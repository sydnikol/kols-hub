# Content Monetization Integration Example

## Adding the Widget to Passive Income Dashboard

To integrate the Content Monetization widget into your Passive Income Dashboard:

### 1. Import the Widget

```typescript
import ContentMonetizationWidget from '../components/content/ContentMonetizationWidget';
```

### 2. Add to Dashboard Layout

```typescript
const PassiveIncomeDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Existing income streams grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Existing widgets... */}

          {/* Add Content Monetization Widget */}
          <ContentMonetizationWidget />
        </div>
      </div>
    </div>
  );
};
```

## Using the Service in Other Components

### Example: Create Income Stream from Content

```typescript
import { contentMonetizationService } from '../services/contentMonetizationService';
import { db } from '../utils/database';

async function createContentIncomeStream() {
  // Get portfolio data
  const portfolio = await contentMonetizationService.getPortfolio();

  // Create income stream for writing
  if (portfolio.totalWriting > 0) {
    await db.incomeStreams.add({
      type: 'content',
      name: 'Writing Portfolio',
      status: 'active',
      monthlyRevenue: portfolio.writing.earnings,
      lastActive: new Date(),
      config: {
        contentType: 'writing',
        pieces: portfolio.totalWriting,
        topPlatform: portfolio.writing.topPlatform
      }
    });
  }

  // Create income stream for photography
  if (portfolio.totalPhotos > 0) {
    await db.incomeStreams.add({
      type: 'content',
      name: 'Photography Portfolio',
      status: 'active',
      monthlyRevenue: portfolio.photography.earnings,
      lastActive: new Date(),
      config: {
        contentType: 'photography',
        pieces: portfolio.totalPhotos,
        topPlatform: portfolio.photography.topPlatform
      }
    });
  }
}
```

### Example: Track Content Earnings

```typescript
// When you receive payment from a platform
async function recordContentEarning(
  contentId: string,
  platform: string,
  amount: number
) {
  // Update content earnings
  await contentMonetizationService.trackEarnings(
    contentId,
    platform,
    amount
  );

  // This automatically logs to income activities
  // You can also manually add to income streams
  const stream = await db.incomeStreams
    .where('name').equals('Writing Portfolio')
    .first();

  if (stream) {
    stream.monthlyRevenue += amount;
    stream.lastActive = new Date();
    await db.incomeStreams.update(stream.id!, stream);
  }
}
```

### Example: Generate Content Report

```typescript
import { contentMonetizationService } from '../services/contentMonetizationService';

async function generateContentReport() {
  const [writing, photos, portfolio] = await Promise.all([
    contentMonetizationService.getAllWritingContent(),
    contentMonetizationService.getAllPhotoContent(),
    contentMonetizationService.getPortfolio()
  ]);

  const report = {
    summary: {
      totalPieces: writing.length + photos.length,
      totalEarnings: portfolio.totalEarnings,
      monthlyRevenue: portfolio.monthlyEarnings
    },
    writing: {
      pieces: writing.length,
      earnings: portfolio.writing.earnings,
      avgQuality: portfolio.writing.avgQuality,
      topPlatform: portfolio.writing.topPlatform,
      byStatus: {
        earning: writing.filter(w => w.status === 'earning').length,
        published: writing.filter(w => w.status === 'published').length,
        ready: writing.filter(w => w.status === 'ready').length,
        draft: writing.filter(w => w.status === 'draft').length
      }
    },
    photography: {
      pieces: photos.length,
      earnings: portfolio.photography.earnings,
      avgQuality: portfolio.photography.avgQuality,
      topPlatform: portfolio.photography.topPlatform,
      totalDownloads: photos.reduce((sum, p) => sum + p.downloads, 0),
      totalViews: photos.reduce((sum, p) => sum + p.views, 0)
    },
    topEarners: {
      writing: writing
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5),
      photos: photos
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5)
    }
  };

  return report;
}
```

## Custom Hooks

### useContentMonetization Hook

```typescript
import { useState, useEffect } from 'react';
import { contentMonetizationService, ContentPortfolio } from '../services/contentMonetizationService';

export function useContentMonetization() {
  const [portfolio, setPortfolio] = useState<ContentPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const data = await contentMonetizationService.getPortfolio();
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const scanWriting = async () => {
    try {
      setLoading(true);
      await contentMonetizationService.scanWritingContent();
      await loadPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan writing');
    } finally {
      setLoading(false);
    }
  };

  const scanPhotos = async () => {
    try {
      setLoading(true);
      await contentMonetizationService.scanPhotographyContent();
      await loadPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return {
    portfolio,
    loading,
    error,
    scanWriting,
    scanPhotos,
    refresh: loadPortfolio
  };
}

// Usage in component:
function MyComponent() {
  const { portfolio, loading, scanWriting } = useContentMonetization();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Earnings: ${portfolio?.totalEarnings}</h2>
      <button onClick={scanWriting}>Scan Writing</button>
    </div>
  );
}
```

## Analytics Integration

### Track Content Performance

```typescript
async function trackContentPerformance() {
  const writing = await contentMonetizationService.getAllWritingContent();

  // Calculate performance metrics
  const analytics = {
    totalViews: writing.reduce((sum, w) =>
      sum + w.platforms.reduce((pSum, p) => pSum + (p.views || 0), 0), 0
    ),
    totalReads: writing.reduce((sum, w) =>
      sum + w.platforms.reduce((pSum, p) => pSum + (p.reads || 0), 0), 0
    ),
    avgEarningsPerPiece: writing.reduce((sum, w) => sum + w.earnings, 0) / writing.length,
    conversionRate: writing.filter(w => w.earnings > 0).length / writing.length,
    platformPerformance: calculatePlatformPerformance(writing)
  };

  return analytics;
}

function calculatePlatformPerformance(writing: WritingContent[]) {
  const platforms: Record<string, { earnings: number; pieces: number }> = {};

  writing.forEach(w => {
    w.platforms.forEach(p => {
      if (!platforms[p.name]) {
        platforms[p.name] = { earnings: 0, pieces: 0 };
      }
      platforms[p.name].earnings += p.earnings;
      platforms[p.name].pieces += 1;
    });
  });

  return Object.entries(platforms).map(([name, data]) => ({
    platform: name,
    totalEarnings: data.earnings,
    pieces: data.pieces,
    avgEarningsPerPiece: data.earnings / data.pieces
  })).sort((a, b) => b.totalEarnings - a.totalEarnings);
}
```

## Automation Examples

### Auto-scan on Schedule

```typescript
// Run every 24 hours
setInterval(async () => {
  const isConnected = await contentMonetizationService.isConnected();

  if (isConnected) {
    console.log('Running scheduled content scan...');

    try {
      await contentMonetizationService.scanWritingContent();
      await contentMonetizationService.scanPhotographyContent();
      console.log('Scan complete!');
    } catch (error) {
      console.error('Scheduled scan failed:', error);
    }
  }
}, 24 * 60 * 60 * 1000); // 24 hours
```

### Auto-create Income Streams

```typescript
async function autoCreateIncomeStreams() {
  const portfolio = await contentMonetizationService.getPortfolio();

  // Check if writing stream exists
  const writingStream = await db.incomeStreams
    .where('name').equals('Content Writing')
    .first();

  if (!writingStream && portfolio.totalWriting > 0) {
    await db.incomeStreams.add({
      type: 'content',
      name: 'Content Writing',
      status: 'active',
      monthlyRevenue: portfolio.writing.earnings,
      lastActive: new Date(),
      config: {
        contentType: 'writing',
        autoCreated: true
      }
    });
  }

  // Similar for photography...
}
```

## Exporting Data

### Export Portfolio as JSON

```typescript
async function exportPortfolio() {
  const [writing, photos, portfolio] = await Promise.all([
    contentMonetizationService.getAllWritingContent(),
    contentMonetizationService.getAllPhotoContent(),
    contentMonetizationService.getPortfolio()
  ]);

  const exportData = {
    exportDate: new Date().toISOString(),
    portfolio,
    writing: writing.map(w => ({
      title: w.title,
      type: w.type,
      wordCount: w.wordCount,
      earnings: w.earnings,
      quality: w.quality,
      platforms: w.platforms.map(p => ({
        name: p.name,
        earnings: p.earnings,
        status: p.status
      }))
    })),
    photos: photos.map(p => ({
      title: p.title,
      category: p.category,
      earnings: p.earnings,
      downloads: p.downloads,
      quality: p.quality,
      platforms: p.platforms.map(pl => ({
        name: pl.name,
        earnings: pl.earnings,
        downloads: pl.downloads,
        status: pl.status
      }))
    }))
  };

  // Download as JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content-portfolio-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
```

## Testing Examples

### Mock Content for Testing

```typescript
import { contentMonetizationService } from '../services/contentMonetizationService';

async function addMockContent() {
  // Mock writing content
  const mockWriting = {
    id: 'writing_test_1',
    title: 'How to Build Passive Income Streams',
    googleDriveId: 'mock_drive_id',
    type: 'article' as const,
    content: 'Lorem ipsum...',
    wordCount: 1500,
    topics: ['finance', 'passive income', 'business'],
    keywords: ['passive income', 'money', 'online business'],
    quality: 85,
    marketability: 78,
    readingTime: 8,
    platforms: [
      {
        name: 'medium' as const,
        earnings: 25.50,
        views: 1250,
        reads: 450,
        projectedEarnings: 50,
        status: 'published' as const,
        publishedAt: new Date()
      }
    ],
    earnings: 25.50,
    submissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fileFormat: 'md' as const,
    status: 'earning' as const
  };

  localStorage.setItem('content_writing', JSON.stringify([mockWriting]));

  // Mock photo content
  const mockPhoto = {
    id: 'photo_test_1',
    title: 'Sunset Mountain Landscape',
    googlePhotoId: 'mock_photo_id',
    photoUrl: 'https://via.placeholder.com/3000x2000',
    category: 'nature',
    subjects: ['mountain', 'sunset', 'landscape'],
    tags: ['nature', 'mountain', 'sunset', 'landscape', 'outdoor'],
    quality: 92,
    marketability: 88,
    platforms: [
      {
        name: 'shutterstock' as const,
        earnings: 45.75,
        downloads: 25,
        views: 1200,
        projectedEarnings: 100,
        status: 'approved' as const,
        approvedAt: new Date(),
        assetId: 'SS123456'
      }
    ],
    earnings: 45.75,
    downloads: 25,
    views: 1200,
    submissions: [],
    metadata: {
      width: 3000,
      height: 2000,
      aspectRatio: '3:2',
      colorPalette: ['#FF6B35', '#F7931E', '#4A90E2'],
      dominantColor: '#FF6B35',
      orientation: 'landscape' as const
    },
    createdAt: new Date(),
    status: 'earning' as const
  };

  localStorage.setItem('content_photos', JSON.stringify([mockPhoto]));
}
```

---

These examples show how to integrate the Content Monetization system throughout your application for maximum passive income potential!

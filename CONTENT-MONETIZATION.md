# Content Monetization System

Transform your writing and photography into passive income streams with AI-powered analysis and platform recommendations.

## Overview

The Content Monetization System scans your Google Drive for writing and Google Photos for photography, analyzes each piece for quality and marketability, and suggests the best platforms for monetization.

## Features

### Writing Monetization

**Supported Formats:**
- `.docx` - Microsoft Word documents
- `.txt` - Plain text files
- `.md` - Markdown files
- `.pdf` - PDF documents

**Analysis:**
- Word count & reading time
- Quality scoring (0-100)
- Marketability analysis
- Topic extraction
- SEO keyword generation
- Content type detection (blog, article, essay, story, poetry, book)

**Suggested Platforms:**
- **Medium** - Best for articles and essays (Partner Program)
- **Substack** - Newsletter content with subscription model
- **Kindle Direct Publishing** - Longer works and books
- **Patreon** - Serialized content with patron support
- **Ghost** - Independent blogging platform
- **Hashnode** - Technical writing
- **Dev.to** - Developer content

**Earnings Tracking:**
- Revenue per piece
- Platform performance comparison
- ROI calculation (earnings vs time invested)
- Submission status tracking
- View and read metrics

### Photography Monetization

**Quality Requirements:**
- Minimum resolution: 1920x1080 (HD)
- Recommended: 3000x2000+ (6MP+)
- Supports all common formats from Google Photos

**Analysis:**
- Technical quality scoring
- Market value assessment
- Category detection (nature, portrait, urban, food, abstract, animals)
- Subject identification
- SEO tag generation
- Aspect ratio and orientation analysis

**Suggested Platforms:**
- **Shutterstock** - General stock photography
- **Adobe Stock** - Premium quality images
- **iStock** - Wide market reach
- **Getty Images** - Premium editorial and commercial
- **Unsplash+** - Subscription-based contributor program
- **Dreamstime** - Royalty-free stock photos
- **500px** - Fine art and licensing

**Earnings Tracking:**
- Sales per photo
- Download counts
- View metrics
- Platform comparison
- Conversion rates
- Earnings per download

## Getting Started

### 1. Connect Google Services

```typescript
// Navigate to /content-monetization
// Click "Connect Google Account"
// Authorize both Google Drive and Google Photos access
```

### 2. Scan Your Content

**Scan Writing:**
```typescript
// Click "Scan Writing" button
// System searches for: .docx, .txt, .md, .pdf files
// Analyzes content quality and marketability
// Generates monetization suggestions
```

**Scan Photos:**
```typescript
// Click "Scan Photos" button
// Filters for high-resolution images (1920x1080+)
// Analyzes quality and commercial potential
// Suggests stock photo platforms
```

### 3. Review & Publish

Each content piece includes:
- Quality score
- Marketability score
- Suggested platforms
- Projected earnings
- Publishing actions

## Service Architecture

### `contentMonetizationService.ts`

Main service handling all content operations:

```typescript
// Writing Operations
await contentMonetizationService.scanWritingContent()
await contentMonetizationService.getAllWritingContent()
await contentMonetizationService.deleteWritingContent(id)

// Photography Operations
await contentMonetizationService.scanPhotographyContent()
await contentMonetizationService.getAllPhotoContent()
await contentMonetizationService.deletePhotoContent(id)

// Portfolio & Analytics
const portfolio = await contentMonetizationService.getPortfolio()
await contentMonetizationService.trackEarnings(contentId, platform, amount)

// Metadata Generation
const metadata = contentMonetizationService.generatePhotoUploadMetadata(photo)
```

### Components

**WritingCard** (`src/components/content/WritingCard.tsx`)
- Displays writing piece details
- Quality and marketability meters
- Platform badges
- Earnings display
- Publishing actions
- ROI calculation

**PhotoCard** (`src/components/content/PhotoCard.tsx`)
- Photo preview with metadata overlay
- Quality and market value scores
- Tag display
- Platform badges
- Earnings and download stats
- Conversion rate tracking

**ContentMonetizationWidget** (`src/components/content/ContentMonetizationWidget.tsx`)
- Dashboard widget for passive income page
- Portfolio summary
- Quick stats
- Link to full monetization page

### Page

**ContentMonetizationPage** (`src/pages/ContentMonetizationPage.tsx`)
- Main interface for content management
- Portfolio overview
- Content scanning
- Platform filtering
- Earnings dashboard
- Content library (writing + photos)

## Database Schema

```typescript
interface ContentWriting {
  id: string;
  title: string;
  googleDriveId: string;
  type: 'blog' | 'story' | 'article' | 'essay' | 'poetry' | 'book';
  wordCount: number;
  quality: number; // 0-100
  marketability: number; // 0-100
  earnings: number;
  status: 'draft' | 'ready' | 'submitted' | 'published' | 'earning';
  createdAt: Date;
  updatedAt: Date;
}

interface ContentPhoto {
  id: string;
  title: string;
  googlePhotoId: string;
  photoUrl: string;
  category: string;
  quality: number; // 0-100
  marketability: number; // 0-100
  earnings: number;
  downloads: number;
  views: number;
  status: 'processing' | 'ready' | 'submitted' | 'approved' | 'earning';
  createdAt: Date;
}
```

## AI Analysis

### Writing Analysis

**Quality Metrics:**
- Word count (longer = higher quality)
- Sentence structure (10-25 words/sentence ideal)
- Paragraph formatting
- Proper nouns and capitalization
- Grammar and readability

**Marketability Factors:**
- Topic relevance
- Keyword density
- Content length (800+ words recommended)
- SEO potential
- Platform fit

### Photo Analysis

**Quality Metrics:**
- Resolution (6MP+ recommended)
- Technical specs (EXIF data)
- Composition
- Sharpness and clarity
- Proper exposure

**Marketability Factors:**
- Subject matter
- Commercial appeal
- Category demand
- Uniqueness
- Stock photo standards

## Platform Integration Guide

### Medium Partner Program
- **Requirements:** 100 followers, 1 published story
- **Earnings:** Based on reading time from members
- **Best For:** Articles, essays, personal stories
- **Projected:** $0-50 per article

### Substack
- **Requirements:** None
- **Earnings:** 10% platform fee on subscriptions
- **Best For:** Newsletter series, recurring content
- **Projected:** $0-150/month (varies by subscribers)

### Kindle Direct Publishing
- **Requirements:** None
- **Earnings:** 35-70% royalties
- **Best For:** Books, novellas, guides
- **Projected:** $0-200+ per book

### Shutterstock
- **Requirements:** Portfolio review
- **Earnings:** $0.25-$120 per download
- **Best For:** General stock photos
- **Projected:** $0.25-2 per photo/month

### Adobe Stock
- **Requirements:** Quality standards
- **Earnings:** 33% royalties
- **Best For:** High-quality commercial photos
- **Projected:** $0.33-5 per photo/month

### Getty Images
- **Requirements:** Professional quality
- **Earnings:** 20-45% royalties
- **Best For:** Premium editorial/commercial
- **Projected:** $2-50+ per photo

## Monetization Strategies

### Writing

**1. Long-Form Content → Kindle**
- Books, guides, manuals
- Serialize chapters from Google Docs
- Compile into ebook format
- Passive income from sales

**2. Article Series → Medium + Substack**
- Publish on Medium for reach
- Cross-post to Substack for subscribers
- Build audience and recurring revenue

**3. Technical Content → Dev.to + Hashnode**
- Developer tutorials
- Technical guides
- Build authority and portfolio

### Photography

**1. High-Volume Approach**
- Upload to multiple platforms
- Focus on commercial categories
- Build large portfolio (100+ photos)
- Steady passive income from downloads

**2. Premium Quality**
- Focus on Getty Images, Adobe Stock
- Higher earnings per download
- Editorial and commercial licensing
- Smaller portfolio, higher value

**3. Niche Specialization**
- Focus on specific categories
- Build reputation in niche
- Command higher prices
- Exclusive partnerships

## Passive Income Integration

### Income Stream Tracking

Content monetization integrates with the passive income system:

```typescript
// Automatic income tracking
await db.incomeActivities.add({
  streamId: 0, // Linked to income stream
  action: `writing sale on medium`,
  revenue: 15.50,
  timestamp: new Date(),
  details: { contentId, platform, type: 'writing' }
});

// Income stream creation
await db.incomeStreams.add({
  type: 'content',
  name: 'Medium Articles',
  status: 'active',
  monthlyRevenue: 125.00,
  lastActive: new Date(),
  config: { platform: 'medium', contentType: 'writing' }
});
```

### Portfolio Metrics

Dashboard displays:
- Total content pieces (writing + photos)
- Total earnings across all platforms
- Monthly revenue
- Top performing platform
- Average quality scores
- ROI per piece

## Tips for Success

### Writing

1. **Quality First:** Focus on 800+ word, well-structured articles
2. **SEO Optimize:** Use extracted keywords in titles and descriptions
3. **Consistent Topics:** Build authority in specific niches
4. **Multiple Platforms:** Cross-post to maximize reach
5. **Track Performance:** Monitor which topics earn best

### Photography

1. **High Resolution:** 3000x2000+ minimum for best platforms
2. **Commercial Subjects:** Focus on marketable categories
3. **Proper Tagging:** Use all 30-50 keyword slots
4. **Model Releases:** Required for photos with people
5. **Consistency:** Upload regularly to build portfolio

## Future Enhancements

- [ ] Automatic publishing to platforms via API
- [ ] AI-powered title and description generation
- [ ] Competitor analysis and pricing recommendations
- [ ] Performance analytics and A/B testing
- [ ] Automated SEO optimization
- [ ] Bulk upload tools
- [ ] Revenue forecasting
- [ ] Content calendar and scheduling
- [ ] Platform trend analysis
- [ ] Copyright protection monitoring

## API Integration ✅ IMPLEMENTED

### Medium API
```typescript
// Auto-publish to Medium
const response = await fetch('https://api.medium.com/v1/users/{userId}/posts', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    title: content.title,
    content: content.text,
    tags: content.keywords
  })
});
```

### Shutterstock API
```typescript
// Auto-upload to Shutterstock
const formData = new FormData();
formData.append('file', photo.blob);
formData.append('metadata', JSON.stringify({
  title: photo.title,
  description: photo.description,
  keywords: photo.tags
}));

await fetch('https://api.shutterstock.com/v2/images', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

## Troubleshooting

### "No content found"
- Ensure Google Drive/Photos are connected
- Check file formats (.docx, .txt, .md, .pdf)
- Verify photos meet minimum resolution (1920x1080)

### "Low quality score"
- Writing: Add more content (aim for 800+ words)
- Writing: Improve structure and formatting
- Photos: Use higher resolution images
- Photos: Ensure proper exposure and composition

### "Low marketability"
- Writing: Add relevant topics and keywords
- Writing: Focus on popular niches
- Photos: Choose commercial subjects
- Photos: Follow stock photo best practices

## Support

For issues or questions:
- Check Google connection status
- Review content quality requirements
- Verify platform eligibility
- Contact platform support for earnings disputes

---

**Start monetizing your content today!** Connect your Google account and discover your earning potential.

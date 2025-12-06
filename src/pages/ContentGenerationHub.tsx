import React, { useState } from 'react';
import { Play, Zap, TrendingUp, Book, Gamepad2, Globe, Download } from 'lucide-react';
import { wikipediaService } from '../services/wikipedia-content-generator';
import { fandomService } from '../services/fandom-content-generator';
import { contentDiscoveryService } from '../services/content-discovery-system';

/**
 * CONTENT GENERATION HUB
 * One-stop dashboard for ALL content generation
 *
 * Generate 100+ pieces of content in minutes!
 */

interface GeneratedContent {
  platform: string;
  title: string;
  content: string;
  estimatedValue: number;
  keywords: string[];
}

export default function ContentGenerationHub() {
  const [niche, setNiche] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  /**
   * MASTER CONTENT GENERATOR
   * Generates content across ALL platforms simultaneously
   */
  const generateEverything = async () => {
    if (!niche.trim()) {
      alert('Please enter a niche/topic first!');
      return;
    }

    setIsGenerating(true);
    const allContent: GeneratedContent[] = [];
    let value = 0;

    try {
      console.log(`🚀 Starting master content generation for: ${niche}`);

      // 1. WIKIPEDIA CONTENT
      console.log('📚 Generating Wikipedia content...');
      const wikiTopics = await wikipediaService.search(niche, 5);

      for (const topic of wikiTopics.slice(0, 3)) {
        // YouTube Scripts
        const ytScript = await wikipediaService.generateYouTubeScript(topic.title);
        if (ytScript) {
          allContent.push({
            platform: 'YouTube',
            title: `Complete Guide: ${topic.title}`,
            content: ytScript,
            estimatedValue: 200,
            keywords: [niche, topic.title, 'guide', 'explained']
          });
          value += 200;
        }

        // Blog Posts
        const blogIdea = await wikipediaService.generateBlogIdea(topic.title);
        if (blogIdea) {
          allContent.push({
            platform: 'Blog/Medium',
            title: blogIdea.title,
            content: JSON.stringify(blogIdea, null, 2),
            estimatedValue: 50,
            keywords: blogIdea.keywords
          });
          value += 50;
        }

        // TikTok Videos
        const tiktoks = await wikipediaService.generateShortFormIdeas(topic.title);
        if (tiktoks.length > 0) {
          allContent.push({
            platform: 'TikTok',
            title: `${tiktoks.length} TikTok videos about ${topic.title}`,
            content: tiktoks.join('\n\n---\n\n'),
            estimatedValue: tiktoks.length * 10,
            keywords: [niche, topic.title, 'shorts', 'viral']
          });
          value += tiktoks.length * 10;
        }
      }

      // 2. FANDOM VIRAL CONTENT
      console.log('🎮 Generating Fandom viral content...');
      const fandomIdeas = await fandomService.generateViralIdeas(niche);

      for (const idea of fandomIdeas) {
        allContent.push({
          platform: idea.type.toUpperCase(),
          title: idea.title,
          content: `Hook: ${idea.hook}\n\nOutline:\n${idea.outline.join('\n')}\n\nAffiliate Opportunities:\n${idea.affiliateOpportunities.join('\n')}`,
          estimatedValue: idea.estimatedViews * 0.002, // $2 per 1000 views
          keywords: idea.keywords
        });
        value += idea.estimatedViews * 0.002;
      }

      // 3. CONTENT CLUSTER (100+ pieces!)
      console.log('🌐 Creating content cluster...');
      const cluster = await contentDiscoveryService.createContentCluster(niche);

      // Add cluster content ideas
      cluster.contentIdeas.slice(0, 20).forEach(idea => {
        allContent.push({
          platform: idea.type.toUpperCase(),
          title: idea.title,
          content: idea.description,
          estimatedValue: idea.estimatedViews * 0.002,
          keywords: idea.keywords
        });
        value += idea.estimatedViews * 0.002;
      });

      // 4. WEEKLY CONTENT PACKAGE
      console.log('📅 Generating weekly content...');
      const weekContent = await contentDiscoveryService.generateWeekOfContent(niche);

      // Add YouTube from weekly package
      weekContent.youtube.forEach((script, i) => {
        allContent.push({
          platform: 'YouTube',
          title: `Week ${i + 1} Video`,
          content: script,
          estimatedValue: 150,
          keywords: [niche, 'tutorial', 'guide']
        });
        value += 150;
      });

      setGeneratedContent(allContent);
      setTotalValue(value);

      console.log(`✅ GENERATION COMPLETE!`);
      console.log(`📊 Total pieces: ${allContent.length}`);
      console.log(`💰 Estimated value: $${value.toFixed(2)}`);

    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating content. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Quick generation presets
   */
  const quickGenerate = async (preset: string) => {
    setNiche(preset);
    setTimeout(() => generateEverything(), 100);
  };

  /**
   * Download all content as JSON
   */
  const downloadContent = () => {
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${niche}-content-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl font-bold">Content Generation Hub</h1>
        </div>
        <p className="text-xl text-gray-300">
          Generate 100+ pieces of content in minutes. Never run out of content ideas again!
        </p>
      </div>

      {/* Main Generator */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Master Content Generator</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter Your Niche/Topic</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Artificial Intelligence, Fitness, Gaming..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                onKeyPress={(e) => e.key === 'Enter' && generateEverything()}
              />
              <button
                onClick={generateEverything}
                disabled={isGenerating}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate Everything
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-4">
            <p className="text-sm mb-2 opacity-80">Quick Start Presets:</p>
            <div className="flex flex-wrap gap-2">
              {['Artificial Intelligence', 'Cryptocurrency', 'Fitness', 'Gaming', 'Space', 'Health', 'Finance', 'Technology'].map(preset => (
                <button
                  key={preset}
                  onClick={() => quickGenerate(preset)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all disabled:opacity-50"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          {generatedContent.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-black/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{generatedContent.length}</div>
                <div className="text-sm text-gray-300">Content Pieces</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">${totalValue.toFixed(0)}</div>
                <div className="text-sm text-gray-300">Estimated Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {Math.round(totalValue / generatedContent.length * 100) / 100}
                </div>
                <div className="text-sm text-gray-300">Avg Value/Piece</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Sources */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-xl font-bold mb-4">Content Sources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
            <Book className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="font-bold mb-2">Wikipedia API</h4>
            <p className="text-sm text-gray-300">
              Generate educational content, blog posts, and YouTube scripts from 6M+ articles
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
            <Gamepad2 className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="font-bold mb-2">Fandom Wikis</h4>
            <p className="text-sm text-gray-300">
              Create viral content from 250K+ wikis. Gaming, anime, movies - 250M+ engaged visitors
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
            <Globe className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="font-bold mb-2">Content Discovery</h4>
            <p className="text-sm text-gray-300">
              Expand 1 topic into 100+ pieces using SeeAlso.org. Never run out of ideas!
            </p>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Generated Content ({generatedContent.length} pieces)</h3>
            <button
              onClick={downloadContent}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          <div className="grid gap-4">
            {generatedContent.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-semibold text-blue-400 mb-1">{item.platform}</div>
                    <h4 className="text-lg font-bold">{item.title}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">${item.estimatedValue.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Est. Value</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-400 mb-1">Keywords:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.keywords.map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/30 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <details className="cursor-pointer">
                  <summary className="text-sm text-blue-400 hover:text-blue-300">
                    View Content
                  </summary>
                  <pre className="mt-3 p-4 bg-black/30 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                    {item.content}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedContent.length === 0 && !isGenerating && (
        <div className="max-w-4xl mx-auto text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Ready to Generate Content?</h3>
          <p className="text-gray-400 mb-6">
            Enter a niche above and click "Generate Everything" to create 100+ pieces of content instantly!
          </p>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 text-left">
            <h4 className="font-bold mb-3">What you'll get:</h4>
            <ul className="space-y-2 text-sm">
              <li>✅ YouTube scripts (5-10 minute videos)</li>
              <li>✅ TikTok/Shorts ideas (30-60 second videos)</li>
              <li>✅ Blog post outlines with SEO keywords</li>
              <li>✅ Medium article ideas with listicles</li>
              <li>✅ Viral content ideas from Fandom</li>
              <li>✅ Content cluster (50-100 related pieces)</li>
              <li>✅ Weekly content calendar</li>
              <li>✅ Affiliate marketing opportunities</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

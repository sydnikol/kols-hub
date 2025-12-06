import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CheckCircle, Clock, ExternalLink, Play, Zap, Target, BookOpen, AlertCircle, Rocket, Star, ArrowRight, Copy } from 'lucide-react';

interface IncomeStream {
  id: string;
  name: string;
  potential: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToStart: string;
  setup: SetupStep[];
  status: 'not-started' | 'in-progress' | 'earning';
  currentEarnings?: number;
  resources: Resource[];
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionUrl?: string;
  copyText?: string;
}

interface Resource {
  name: string;
  url: string;
  type: 'tutorial' | 'platform' | 'tool';
}

export default function PassiveIncomeBuilderPage() {
  const [streams, setStreams] = useState<IncomeStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [totalPotential, setTotalPotential] = useState(0);
  const [activeStreams, setActiveStreams] = useState(0);

  useEffect(() => {
    initializeStreams();
  }, []);

  const initializeStreams = () => {
    const incomeStreams: IncomeStream[] = [
      {
        id: 'blog',
        name: 'AI-Powered Blog Writing',
        potential: '$500-2000/month',
        difficulty: 'easy',
        timeToStart: '1-2 days',
        status: 'not-started',
        setup: [
          {
            id: 'blog-1',
            title: 'Create Medium Account',
            description: 'Sign up for Medium and join their Partner Program to earn money from your articles',
            completed: false,
            actionUrl: 'https://medium.com/creators',
            copyText: 'medium.com/creators'
          },
          {
            id: 'blog-2',
            title: 'Use ChatGPT/Claude to Write First Article',
            description: 'Write about trending topics in tech, AI, productivity, or personal finance. Aim for 1000+ words.',
            completed: false,
            copyText: 'Prompt: "Write a comprehensive 1500-word article about [topic] that provides real value to readers interested in [niche]"'
          },
          {
            id: 'blog-3',
            title: 'Publish and Share',
            description: 'Publish your article and share on social media, Reddit, and relevant communities',
            completed: false
          },
          {
            id: 'blog-4',
            title: 'Create WordPress Site (Optional)',
            description: 'For higher earnings, create your own WordPress blog with ads and affiliate links',
            completed: false,
            actionUrl: 'https://wordpress.com/start'
          }
        ],
        resources: [
          { name: 'Medium Partner Program Guide', url: 'https://help.medium.com/hc/en-us/articles/115011694187', type: 'tutorial' },
          { name: 'WordPress.com', url: 'https://wordpress.com', type: 'platform' },
          { name: 'ChatGPT', url: 'https://chat.openai.com', type: 'tool' }
        ]
      },
      {
        id: 'affiliate',
        name: 'Amazon Affiliate Marketing',
        potential: '$300-1500/month',
        difficulty: 'easy',
        timeToStart: '1 day',
        status: 'not-started',
        setup: [
          {
            id: 'aff-1',
            title: 'Join Amazon Associates',
            description: 'Sign up for the Amazon Associates program - it\'s free and takes 10 minutes',
            completed: false,
            actionUrl: 'https://affiliate-program.amazon.com',
            copyText: 'affiliate-program.amazon.com'
          },
          {
            id: 'aff-2',
            title: 'Choose Your Niche',
            description: 'Pick products you know about: tech gadgets, books, home items, fitness gear, etc.',
            completed: false
          },
          {
            id: 'aff-3',
            title: 'Create Content',
            description: 'Write product reviews, comparison guides, or "Top 10" lists. Use AI to help write compelling content.',
            completed: false,
            copyText: 'Prompt: "Create a detailed product comparison guide for [product category] with pros, cons, and recommendations"'
          },
          {
            id: 'aff-4',
            title: 'Share Affiliate Links',
            description: 'Post on social media, Pinterest, YouTube descriptions, or your blog. Include your Amazon affiliate link.',
            completed: false
          }
        ],
        resources: [
          { name: 'Amazon Associates', url: 'https://affiliate-program.amazon.com', type: 'platform' },
          { name: 'Pinterest', url: 'https://pinterest.com', type: 'platform' },
          { name: 'Affiliate Marketing Guide', url: 'https://www.shopify.com/blog/affiliate-marketing', type: 'tutorial' }
        ]
      },
      {
        id: 'social',
        name: 'Social Media Automation',
        potential: '$200-800/month',
        difficulty: 'medium',
        timeToStart: '2-3 days',
        status: 'not-started',
        setup: [
          {
            id: 'soc-1',
            title: 'Create Business Accounts',
            description: 'Set up Instagram, TikTok, or Twitter accounts focused on a profitable niche (finance, tech, lifestyle)',
            completed: false
          },
          {
            id: 'soc-2',
            title: 'Generate Content with AI',
            description: 'Use ChatGPT to create 30 days of posts at once. Schedule them with free tools.',
            completed: false,
            copyText: 'Prompt: "Create 30 engaging social media posts about [niche] with hashtags and calls-to-action"'
          },
          {
            id: 'soc-3',
            title: 'Use Scheduling Tools',
            description: 'Schedule posts automatically with Later, Buffer, or Hootsuite (free plans available)',
            completed: false,
            actionUrl: 'https://later.com'
          },
          {
            id: 'soc-4',
            title: 'Monetize',
            description: 'Once you hit 10K followers, enable creator monetization, sponsorships, or affiliate links in bio',
            completed: false
          }
        ],
        resources: [
          { name: 'Later - Free Scheduler', url: 'https://later.com', type: 'tool' },
          { name: 'Canva - Free Graphics', url: 'https://canva.com', type: 'tool' },
          { name: 'TikTok Creator Program', url: 'https://www.tiktok.com/creators', type: 'platform' }
        ]
      },
      {
        id: 'print',
        name: 'Print-on-Demand Store',
        potential: '$400-1200/month',
        difficulty: 'medium',
        timeToStart: '1 day',
        status: 'not-started',
        setup: [
          {
            id: 'pod-1',
            title: 'Sign Up for Redbubble',
            description: 'Free to join, no upfront costs. They handle printing, shipping, and customer service.',
            completed: false,
            actionUrl: 'https://www.redbubble.com/signup',
            copyText: 'redbubble.com/signup'
          },
          {
            id: 'pod-2',
            title: 'Create Designs with AI',
            description: 'Use DALL-E, Midjourney, or free Canva templates to create t-shirt designs, mugs, stickers',
            completed: false,
            actionUrl: 'https://www.canva.com'
          },
          {
            id: 'pod-3',
            title: 'Upload 20+ Designs',
            description: 'Upload your designs to Redbubble and Teespring. More designs = more chances to sell.',
            completed: false
          },
          {
            id: 'pod-4',
            title: 'Optimize Listings',
            description: 'Use AI to write compelling titles, descriptions, and tags for each product',
            completed: false,
            copyText: 'Prompt: "Write an SEO-optimized product title and description for a [design type] featuring [theme]"'
          }
        ],
        resources: [
          { name: 'Redbubble', url: 'https://www.redbubble.com', type: 'platform' },
          { name: 'Teespring', url: 'https://teespring.com', type: 'platform' },
          { name: 'Canva Free', url: 'https://canva.com', type: 'tool' }
        ]
      },
      {
        id: 'youtube',
        name: 'Faceless YouTube Channel',
        potential: '$500-3000/month',
        difficulty: 'medium',
        timeToStart: '3-5 days',
        status: 'not-started',
        setup: [
          {
            id: 'yt-1',
            title: 'Create YouTube Channel',
            description: 'Pick a niche: finance tips, tech reviews, AI tutorials, meditation, etc.',
            completed: false,
            actionUrl: 'https://www.youtube.com/create_channel'
          },
          {
            id: 'yt-2',
            title: 'Generate Scripts with AI',
            description: 'Use ChatGPT to write 10-minute video scripts on trending topics in your niche',
            completed: false,
            copyText: 'Prompt: "Write a 10-minute YouTube script about [topic] that is engaging and informative with timestamps"'
          },
          {
            id: 'yt-3',
            title: 'Create Videos (No Face Required)',
            description: 'Use stock footage (Pexels), AI voiceover (ElevenLabs), and free editing (DaVinci Resolve)',
            completed: false,
            actionUrl: 'https://www.pexels.com'
          },
          {
            id: 'yt-4',
            title: 'Upload and Optimize',
            description: 'Upload videos with AI-generated thumbnails, titles, and descriptions. Aim for 3-5 videos/week.',
            completed: false
          }
        ],
        resources: [
          { name: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com', type: 'tutorial' },
          { name: 'Pexels - Free Stock Video', url: 'https://pexels.com', type: 'tool' },
          { name: 'DaVinci Resolve - Free Editor', url: 'https://www.blackmagicdesign.com/products/davinciresolve', type: 'tool' }
        ]
      },
      {
        id: 'ebook',
        name: 'AI-Written eBook Sales',
        potential: '$300-1000/month',
        difficulty: 'easy',
        timeToStart: '2-4 days',
        status: 'not-started',
        setup: [
          {
            id: 'ebook-1',
            title: 'Research Profitable Topics',
            description: 'Check Amazon Kindle bestsellers for ideas: self-help, finance, productivity, niche hobbies',
            completed: false,
            actionUrl: 'https://www.amazon.com/Best-Sellers-Kindle-Store/zgbs/digital-text'
          },
          {
            id: 'ebook-2',
            title: 'Write with ChatGPT',
            description: 'Generate a 10,000-20,000 word eBook using AI. Edit and personalize it.',
            completed: false,
            copyText: 'Prompt: "Write chapter [X] of an ebook about [topic] aimed at [audience]. Make it 2000 words, practical and engaging."'
          },
          {
            id: 'ebook-3',
            title: 'Format and Design Cover',
            description: 'Use Canva to create a professional cover. Format with free tools like Calibre.',
            completed: false,
            actionUrl: 'https://www.canva.com'
          },
          {
            id: 'ebook-4',
            title: 'Publish on Amazon KDP',
            description: 'Upload to Kindle Direct Publishing. Set competitive price ($2.99-$9.99). Earn 70% royalties.',
            completed: false,
            actionUrl: 'https://kdp.amazon.com'
          }
        ],
        resources: [
          { name: 'Amazon KDP', url: 'https://kdp.amazon.com', type: 'platform' },
          { name: 'Canva', url: 'https://canva.com', type: 'tool' },
          { name: 'Calibre - eBook Formatter', url: 'https://calibre-ebook.com', type: 'tool' }
        ]
      }
    ];

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('incomeBuilderProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      incomeStreams.forEach(stream => {
        const saved = progress[stream.id];
        if (saved) {
          stream.status = saved.status;
          stream.setup = stream.setup.map((step: SetupStep) => ({
            ...step,
            completed: saved.completedSteps?.includes(step.id) || false
          }));
        }
      });
    }

    setStreams(incomeStreams);
    calculateStats(incomeStreams);
  };

  const calculateStats = (streamList: IncomeStream[]) => {
    const active = streamList.filter(s => s.status === 'earning').length;
    setActiveStreams(active);

    // Calculate potential based on minimum estimates
    const potential = streamList.reduce((sum, stream) => {
      const minEarning = parseInt(stream.potential.match(/\$(\d+)/)?.[1] || '0');
      return sum + minEarning;
    }, 0);
    setTotalPotential(potential);
  };

  const toggleStep = (streamId: string, stepId: string) => {
    const updatedStreams = streams.map(stream => {
      if (stream.id === streamId) {
        const updatedSetup = stream.setup.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );

        // Update status based on completion
        const allCompleted = updatedSetup.every(s => s.completed);
        const anyCompleted = updatedSetup.some(s => s.completed);

        return {
          ...stream,
          setup: updatedSetup,
          status: allCompleted ? 'earning' as const : anyCompleted ? 'in-progress' as const : 'not-started' as const
        };
      }
      return stream;
    });

    setStreams(updatedStreams);
    calculateStats(updatedStreams);
    saveProgress(updatedStreams);
  };

  const saveProgress = (streamList: IncomeStream[]) => {
    const progress: any = {};
    streamList.forEach(stream => {
      progress[stream.id] = {
        status: stream.status,
        completedSteps: stream.setup.filter(s => s.completed).map(s => s.id)
      };
    });
    localStorage.setItem('incomeBuilderProgress', JSON.stringify(progress));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'earning': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'not-started': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const selectedStreamData = streams.find(s => s.id === selectedStream);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-emerald-950 to-teal-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-4">
          Passive Income Builder
        </h1>
        <p className="text-emerald-300 text-lg">Step-by-step guides to start making real money today</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-emerald-400" size={28} />
            <span className="text-3xl font-bold text-white">${totalPotential}+</span>
          </div>
          <p className="text-emerald-300">Monthly Potential</p>
          <p className="text-xs text-emerald-400 mt-1">If all streams are active</p>
        </div>

        <div className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Rocket className="text-emerald-400" size={28} />
            <span className="text-3xl font-bold text-white">{activeStreams}</span>
          </div>
          <p className="text-emerald-300">Active Income Streams</p>
          <p className="text-xs text-emerald-400 mt-1">Currently earning money</p>
        </div>

        <div className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="text-emerald-400" size={28} />
            <span className="text-3xl font-bold text-white">{streams.filter(s => s.status === 'in-progress').length}</span>
          </div>
          <p className="text-emerald-300">In Progress</p>
          <p className="text-xs text-emerald-400 mt-1">Getting set up</p>
        </div>
      </div>

      {/* Income Streams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {streams.map(stream => {
          const completedSteps = stream.setup.filter(s => s.completed).length;
          const totalSteps = stream.setup.length;
          const progressPercent = (completedSteps / totalSteps) * 100;

          return (
            <div
              key={stream.id}
              className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl p-6 hover:bg-emerald-800/50 transition-all cursor-pointer"
              onClick={() => setSelectedStream(stream.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{stream.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(stream.difficulty)}`}>
                      {stream.difficulty.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(stream.status)}`}>
                      {stream.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{stream.potential}</p>
                  <p className="text-xs text-emerald-300">potential/month</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <Clock size={14} />
                  <span>Start in {stream.timeToStart}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle size={14} />
                  <span>{completedSteps} of {totalSteps} steps completed</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-emerald-900/60 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Play size={16} />
                <span>Start Building</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedStreamData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStream(null)}>
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedStreamData.name}</h2>
                <p className="text-emerald-300">Follow these steps to start earning {selectedStreamData.potential}/month</p>
              </div>
              <button onClick={() => setSelectedStream(null)} className="text-emerald-400 hover:text-emerald-300">
                ✕
              </button>
            </div>

            {/* Setup Steps */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Setup Steps</h3>
              {selectedStreamData.setup.map((step, idx) => (
                <div
                  key={step.id}
                  className={`bg-emerald-800/30 border rounded-xl p-6 transition-all ${
                    step.completed ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-emerald-700/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStep(selectedStreamData.id, step.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-emerald-500/50 hover:border-emerald-500'
                      }`}
                    >
                      {step.completed && <CheckCircle size={14} className="text-white" />}
                    </button>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">
                        Step {idx + 1}: {step.title}
                      </h4>
                      <p className="text-emerald-300 mb-3">{step.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {step.actionUrl && (
                          <a
                            href={step.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            <span>Open Link</span>
                          </a>
                        )}
                        {step.copyText && (
                          <button
                            onClick={() => copyToClipboard(step.copyText!)}
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Copy size={14} />
                            <span>Copy Text</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Helpful Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStreamData.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800/30 border border-emerald-700/30 rounded-xl p-4 hover:bg-emerald-800/50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {resource.type === 'tutorial' && <BookOpen className="text-emerald-400" size={20} />}
                      {resource.type === 'platform' && <Rocket className="text-emerald-400" size={20} />}
                      {resource.type === 'tool' && <Zap className="text-emerald-400" size={20} />}
                      <span className="text-white font-medium">{resource.name}</span>
                    </div>
                    <ExternalLink className="text-emerald-400" size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

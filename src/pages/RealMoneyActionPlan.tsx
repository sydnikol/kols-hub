import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, DollarSign, TrendingUp, AlertCircle, ExternalLink, Zap, Target, Clock } from 'lucide-react';

interface ActionStep {
  id: string;
  title: string;
  description: string;
  estimatedIncome: string;
  timeToComplete: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  steps: string[];
  resources: { name: string; url: string }[];
}

const RealMoneyActionPlan: React.FC = () => {
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([]);
  const [totalPotentialIncome, setTotalPotentialIncome] = useState(0);

  useEffect(() => {
    loadActionPlan();
  }, []);

  const loadActionPlan = () => {
    // Load saved progress
    const saved = localStorage.getItem('real_money_action_plan');
    let steps: ActionStep[] = [];

    if (saved) {
      steps = JSON.parse(saved);
    } else {
      steps = getDefaultActionPlan();
      localStorage.setItem('real_money_action_plan', JSON.stringify(steps));
    }

    setActionSteps(steps);
    calculatePotentialIncome(steps);
  };

  const getDefaultActionPlan = (): ActionStep[] => {
    return [
      {
        id: '1',
        title: 'Set Up Payment Processing (CRITICAL - DO THIS FIRST)',
        description: 'Configure real payment methods to actually receive money when you earn it.',
        estimatedIncome: '$0 (but necessary to receive all future income)',
        timeToComplete: '30 minutes',
        difficulty: 'easy',
        priority: 'high',
        completed: false,
        steps: [
          'Sign up for Stripe at https://stripe.com (FREE, 2.9% + 30¢ per transaction)',
          'Complete identity verification (upload ID)',
          'Connect your bank account',
          'Sign up for PayPal Business at https://paypal.com/business',
          'Set up Cash App for Business (get your $cashtag)',
          'Enter all payment info in the app Settings'
        ],
        resources: [
          { name: 'Stripe Sign Up', url: 'https://stripe.com' },
          { name: 'PayPal Business', url: 'https://paypal.com/business' },
          { name: 'Cash App', url: 'https://cash.app' }
        ]
      },
      {
        id: '2',
        title: 'Join Amazon Associates (Quick Win)',
        description: 'Start earning 4-10% commission on Amazon products. No followers required!',
        estimatedIncome: '$300-1,000/month',
        timeToComplete: '1 hour',
        difficulty: 'easy',
        priority: 'high',
        completed: false,
        steps: [
          'Go to https://affiliate-program.amazon.com',
          'Click "Sign up" and complete application',
          'Add your website/social media (TikTok, Instagram work!)',
          'Get approved (usually instant if you have any content)',
          'Get your Associate ID from the dashboard',
          'Create 3 product review videos/posts TODAY',
          'Share affiliate links on social media'
        ],
        resources: [
          { name: 'Amazon Associates', url: 'https://affiliate-program.amazon.com' },
          { name: 'Top Products to Promote', url: 'https://affiliate-program.amazon.com/home/tools/bestsellers' }
        ]
      },
      {
        id: '3',
        title: 'Start ClickBank Affiliate Marketing (High Commissions)',
        description: 'Earn 50-75% commissions on digital products. No website required!',
        estimatedIncome: '$500-2,000/month',
        timeToComplete: '45 minutes',
        difficulty: 'easy',
        priority: 'high',
        completed: false,
        steps: [
          'Sign up at https://www.clickbank.com (FREE, instant approval)',
          'Browse Marketplace for high-gravity products (Gravity = proven sellers)',
          'Pick 3 products in health, wealth, or relationships niches',
          'Get your affiliate "hoplinks" for each product',
          'Create simple review blog posts or social media posts',
          'Drive traffic using free methods (see Traffic Generation step)',
          'Earn $100-300 per sale (50-75% commission)'
        ],
        resources: [
          { name: 'ClickBank Sign Up', url: 'https://www.clickbank.com/signup' },
          { name: 'Marketplace', url: 'https://accounts.clickbank.com/marketplace.htm' }
        ]
      },
      {
        id: '4',
        title: 'Create Digital Products on Gumroad',
        description: 'Sell templates, guides, or presets. Create once, sell forever.',
        estimatedIncome: '$200-1,500/month',
        timeToComplete: '4-8 hours',
        difficulty: 'medium',
        priority: 'high',
        completed: false,
        steps: [
          'Sign up at https://gumroad.com (FREE, no fees until you sell)',
          'Create a simple digital product: Notion template, Canva templates, AI prompts, workout plan, meal prep guide, etc.',
          'Price it at $9-29 (sweet spot for impulse buys)',
          'Create a simple sales page with benefits',
          'Share on Twitter, TikTok, Instagram',
          'List on Etsy for extra exposure',
          'Wake up to sales while you sleep'
        ],
        resources: [
          { name: 'Gumroad', url: 'https://gumroad.com' },
          { name: 'Product Ideas', url: 'https://www.reddit.com/r/juststart/top/?t=all' }
        ]
      },
      {
        id: '5',
        title: 'Start a Medium Blog (Get Paid to Write)',
        description: 'Medium pays you based on member reading time. $100-1,000+/month possible.',
        estimatedIncome: '$100-1,000/month',
        timeToComplete: '2 hours',
        difficulty: 'easy',
        priority: 'medium',
        completed: false,
        steps: [
          'Sign up at https://medium.com',
          'Join Medium Partner Program at https://medium.com/creators',
          'Write your first article (800-1,500 words)',
          'Use AI to help: ChatGPT, Claude, etc.',
          'Publish to relevant publications for more reach',
          'Write 3-5 articles per week',
          'Medium pays you based on member reading time',
          'Top writers make $1,000-10,000/month'
        ],
        resources: [
          { name: 'Medium Partner Program', url: 'https://medium.com/creators' },
          { name: 'How to Go Viral on Medium', url: 'https://medium.com/tag/writing' }
        ]
      },
      {
        id: '6',
        title: 'YouTube Automation (Faceless Channel)',
        description: 'Create faceless YouTube videos. Once monetized, earn $500-5,000+/month.',
        estimatedIncome: '$500-5,000/month (after monetization)',
        timeToComplete: '3-6 months to monetize',
        difficulty: 'hard',
        priority: 'medium',
        completed: false,
        steps: [
          'Create YouTube channel in a profitable niche (make money, productivity, AI, motivation)',
          'Use AI to generate scripts (ChatGPT, Claude)',
          'Use Eleven Labs or similar for AI voiceover',
          'Use stock footage or AI-generated images',
          'Upload 2-3 videos per week',
          'Hit 1,000 subscribers + 4,000 watch hours',
          'Apply for monetization',
          'Earn $1-5 per 1,000 views'
        ],
        resources: [
          { name: 'YouTube Partner Program', url: 'https://www.youtube.com/creators/' },
          { name: 'Eleven Labs (AI Voice)', url: 'https://elevenlabs.io' },
          { name: 'Pexels (Free Stock)', url: 'https://www.pexels.com' }
        ]
      },
      {
        id: '7',
        title: 'Launch Print-on-Demand Store',
        description: 'Design t-shirts, mugs, etc. No inventory needed. Sites print and ship for you.',
        estimatedIncome: '$200-1,000/month',
        timeToComplete: '3-5 hours',
        difficulty: 'easy',
        priority: 'medium',
        completed: false,
        steps: [
          'Sign up for Redbubble, Teespring, or Printful',
          'Create 20-50 designs using Canva (FREE) or AI',
          'Upload designs (funny quotes, niches, trending topics)',
          'Optimize titles and tags for SEO',
          'Share on Pinterest (huge traffic source)',
          'Earn $5-15 profit per sale',
          'Rinse and repeat - more designs = more sales'
        ],
        resources: [
          { name: 'Redbubble', url: 'https://www.redbubble.com/signup' },
          { name: 'Printful', url: 'https://www.printful.com' },
          { name: 'Canva', url: 'https://www.canva.com' }
        ]
      },
      {
        id: '8',
        title: 'Email Marketing & Newsletter',
        description: 'Build an email list. Each subscriber = $1-10/month in value.',
        estimatedIncome: '$300-3,000/month',
        timeToComplete: '2-3 hours setup',
        difficulty: 'medium',
        priority: 'high',
        completed: false,
        steps: [
          'Sign up for ConvertKit (FREE up to 1,000 subscribers)',
          'Create a lead magnet (free guide, checklist, template)',
          'Add signup form to your website/social bios',
          'Write 1-2 emails per week',
          'Promote affiliate products or your own products',
          'Each subscriber worth $1-10/month if monetized well',
          'Goal: Get to 1,000 subscribers = $1,000-10,000/month'
        ],
        resources: [
          { name: 'ConvertKit', url: 'https://convertkit.com' },
          { name: 'Lead Magnet Ideas', url: 'https://convertkit.com/resources/lead-magnets' }
        ]
      },
      {
        id: '9',
        title: 'Freelance Services on Fiverr',
        description: 'Offer services starting at $5. Use AI to fulfill orders quickly.',
        estimatedIncome: '$500-2,000/month',
        timeToComplete: '2 hours',
        difficulty: 'easy',
        priority: 'medium',
        completed: false,
        steps: [
          'Sign up at https://www.fiverr.com',
          'Create gigs for: AI content writing, logo design, social media posts, video editing',
          'Use AI tools to fulfill orders: ChatGPT, Midjourney, Canva, etc.',
          'Price: Start at $10-25 per gig',
          'Deliver quality work fast',
          'Get 5-star reviews',
          'Raise prices as you get more reviews',
          'Goal: 2-3 orders per day = $600-1,800/month'
        ],
        resources: [
          { name: 'Fiverr', url: 'https://www.fiverr.com/start_selling' },
          { name: 'Top Selling Services', url: 'https://www.fiverr.com/categories/writing-translation' }
        ]
      },
      {
        id: '10',
        title: 'Drive Traffic (CRITICAL FOR ALL INCOME STREAMS)',
        description: 'No traffic = No money. Master free traffic sources.',
        estimatedIncome: 'Multiplies all other income',
        timeToComplete: 'Daily activity',
        difficulty: 'medium',
        priority: 'high',
        completed: false,
        steps: [
          'TikTok: Post 1-3 short videos daily (fastest free traffic)',
          'Twitter/X: Tweet 3-5 times daily, engage in threads',
          'Pinterest: Pin 5-10 times daily (huge for affiliate/POD)',
          'Reddit: Comment value in relevant subreddits, share when allowed',
          'YouTube Shorts: Repurpose TikToks',
          'Instagram Reels: Repurpose TikToks',
          'SEO: Write blog posts with keywords',
          'Goal: 1,000 visitors/day = $1,000-3,000/month in income'
        ],
        resources: [
          { name: 'TikTok Growth Guide', url: 'https://www.tiktok.com/creators/creator-portal/en-us/' },
          { name: 'Pinterest Marketing', url: 'https://business.pinterest.com/en/' },
          { name: 'SEO Basics', url: 'https://moz.com/beginners-guide-to-seo' }
        ]
      },
      {
        id: '11',
        title: 'Stake Cryptocurrency (Passive Crypto Earnings)',
        description: 'Earn 4-20% APY by staking crypto. Set it and forget it.',
        estimatedIncome: '$50-500/month (depends on amount staked)',
        timeToComplete: '1 hour',
        difficulty: 'medium',
        priority: 'low',
        completed: false,
        steps: [
          'Sign up for Coinbase, Kraken, or Binance.US',
          'Complete identity verification',
          'Buy stablecoins (USDC earns 4-5% APY, less risk) or',
          'Buy stakeable crypto (ETH, SOL, ADA earn 4-15% APY)',
          'Click "Earn" or "Staking" in the app',
          'Stake your crypto',
          'Earn daily rewards automatically',
          'Compound by restaking rewards'
        ],
        resources: [
          { name: 'Coinbase Earn', url: 'https://www.coinbase.com/earn' },
          { name: 'Kraken Staking', url: 'https://www.kraken.com/features/staking-coins' }
        ]
      },
      {
        id: '12',
        title: 'Create Online Course (Premium Income)',
        description: 'Package your knowledge into a course. Sell for $50-500.',
        estimatedIncome: '$500-5,000/month',
        timeToComplete: '2-4 weeks',
        difficulty: 'hard',
        priority: 'low',
        completed: false,
        steps: [
          'Pick a skill you know: coding, design, fitness, cooking, etc.',
          'Outline 10-20 lessons',
          'Record videos using Loom or OBS (FREE)',
          'Upload to Teachable, Gumroad, or Udemy',
          'Price: $49-199 for first course',
          'Promote on social media',
          'Email list promotion',
          'Just 10 sales/month = $500-2,000'
        ],
        resources: [
          { name: 'Teachable', url: 'https://teachable.com' },
          { name: 'Udemy', url: 'https://www.udemy.com/teaching/' },
          { name: 'Course Creation Guide', url: 'https://www.teachable.com/blog/how-to-create-an-online-course' }
        ]
      }
    ];
  };

  const calculatePotentialIncome = (steps: ActionStep[]) => {
    // Conservative estimate: average of income ranges
    const estimates = [
      650, // Amazon
      1250, // ClickBank
      850, // Gumroad
      550, // Medium
      2750, // YouTube (once monetized)
      600, // Print on Demand
      1650, // Email
      1250, // Fiverr
      0, // Traffic (multiplier)
      275, // Crypto
      2750 // Course
    ];

    const total = estimates.reduce((sum, val) => sum + val, 0);
    setTotalPotentialIncome(total);
  };

  const toggleStep = (id: string) => {
    const updated = actionSteps.map(step =>
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setActionSteps(updated);
    localStorage.setItem('real_money_action_plan', JSON.stringify(updated));
  };

  const completedCount = actionSteps.filter(s => s.completed).length;
  const progressPercent = (completedCount / actionSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-green-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            Your $1,500/Day Action Plan
          </h1>
          <p className="text-green-400 text-lg mb-4">
            Follow these REAL steps to build multiple income streams. This is NOT theory - these are proven methods.
          </p>
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-400 font-bold mb-1">Reality Check:</h3>
                <p className="text-yellow-300 text-sm">
                  $1,500/day = $45,000/month. This is ACHIEVABLE but requires: consistent action, 3-6 months of building,
                  and multiple income streams. Start with steps 1-4 THIS WEEK for fastest results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {completedCount} / {actionSteps.length}
            </div>
            <div className="w-full bg-green-950 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400">Potential Monthly Income</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${totalPotentialIncome.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              Conservative estimate when all active
            </div>
          </div>

          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-blue-400">Next Action</span>
            </div>
            <div className="text-lg font-bold text-white">
              {actionSteps.find(s => !s.completed)?.title.substring(0, 30) || 'All Done!'}...
            </div>
            <div className="text-xs text-blue-400 mt-1">
              Start here
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="space-y-4">
          {actionSteps.map((step) => (
            <div
              key={step.id}
              className={`bg-green-900/20 border rounded-xl overflow-hidden transition-all ${
                step.completed
                  ? 'border-green-500/50 opacity-75'
                  : step.priority === 'high'
                  ? 'border-red-500/50 shadow-lg shadow-red-500/20'
                  : 'border-green-500/30'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="flex-shrink-0 mt-1"
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className={`text-xl font-bold ${step.completed ? 'text-gray-400 line-through' : 'text-green-300'}`}>
                          {step.title}
                        </h3>
                        {step.priority === 'high' && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold">
                            HIGH PRIORITY
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          step.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          step.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {step.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-green-400 text-sm mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">{step.estimatedIncome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400">{step.timeToComplete}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="ml-10 space-y-3">
                  <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                    <h4 className="text-green-300 font-bold mb-2">Action Steps:</h4>
                    <ol className="space-y-2">
                      {step.steps.map((substep, idx) => (
                        <li key={idx} className="text-green-400 text-sm flex items-start gap-2">
                          <span className="text-green-500 font-bold flex-shrink-0">{idx + 1}.</span>
                          <span>{substep}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Resources */}
                  {step.resources.length > 0 && (
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                      <h4 className="text-blue-300 font-bold mb-2">Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition-colors text-sm"
                          >
                            {resource.name}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-8 rounded-xl border border-green-500/30 text-center">
          <h3 className="text-2xl font-bold text-green-300 mb-3">
            Ready to Start Earning Real Money?
          </h3>
          <p className="text-green-400 mb-6 max-w-2xl mx-auto">
            Pick ONE step from above and complete it TODAY. Don't try to do everything at once.
            Consistency beats intensity. Complete 1 step per week = 12 income streams in 3 months.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/passive-income"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all font-bold text-lg shadow-lg shadow-green-500/50"
            >
              <Zap className="w-5 h-5" />
              Go to Income Dashboard
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors font-bold"
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealMoneyActionPlan;

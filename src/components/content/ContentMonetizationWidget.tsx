import React, { useEffect, useState } from 'react';
import { contentMonetizationService, ContentPortfolio } from '../../services/contentMonetizationService';
import { FileText, Camera, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentMonetizationWidget: React.FC = () => {
  const [portfolio, setPortfolio] = useState<ContentPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await contentMonetizationService.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      console.error('Failed to load content portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30 animate-pulse">
        <div className="h-6 bg-purple-500/20 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
      </div>
    );
  }

  if (!portfolio || (portfolio.totalWriting === 0 && portfolio.totalPhotos === 0)) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-purple-300 mb-1">Content Monetization</h3>
            <p className="text-sm text-purple-400">Turn your writing & photos into income</p>
          </div>
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">
            NEW
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Scan your Google Drive and Photos to discover monetizable content.
        </p>

        <Link
          to="/content-monetization"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-purple-300 mb-1">Content Monetization</h3>
          <p className="text-sm text-purple-400">{portfolio.totalWriting + portfolio.totalPhotos} pieces</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-bold">${portfolio.totalEarnings.toFixed(0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Writing</span>
          </div>
          <div className="text-lg font-bold text-white">{portfolio.totalWriting}</div>
          <div className="text-xs text-purple-300">${portfolio.writing.earnings.toFixed(0)} earned</div>
        </div>

        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Photos</span>
          </div>
          <div className="text-lg font-bold text-white">{portfolio.totalPhotos}</div>
          <div className="text-xs text-blue-300">${portfolio.photography.earnings.toFixed(0)} earned</div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">This Month</span>
          </div>
          <span className="text-sm font-bold text-green-400">
            ${portfolio.monthlyEarnings.toFixed(2)}
          </span>
        </div>
      </div>

      <Link
        to="/content-monetization"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors text-sm w-full"
      >
        View Portfolio
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ContentMonetizationWidget;

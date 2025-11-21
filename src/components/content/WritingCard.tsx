import React from 'react';
import { WritingContent } from '../../services/contentMonetizationService';
import {
  FileText,
  DollarSign,
  Eye,
  Clock,
  TrendingUp,
  ExternalLink,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface WritingCardProps {
  content: WritingContent;
  onEdit?: (content: WritingContent) => void;
  onDelete?: (id: string) => void;
  onPublish?: (content: WritingContent, platform: string) => void;
}

const WritingCard: React.FC<WritingCardProps> = ({
  content,
  onEdit,
  onDelete,
  onPublish,
}) => {
  const getPlatformIcon = (platformName: string) => {
    const icons: Record<string, string> = {
      medium: 'M',
      substack: 'S',
      kindle: 'K',
      patreon: 'P',
      ghost: 'G',
      hashnode: 'H',
      devto: 'D',
    };
    return icons[platformName] || platformName.charAt(0).toUpperCase();
  };

  const getPlatformColor = (platformName: string) => {
    const colors: Record<string, string> = {
      medium: 'bg-green-500',
      substack: 'bg-orange-500',
      kindle: 'bg-blue-500',
      patreon: 'bg-red-500',
      ghost: 'bg-purple-500',
      hashnode: 'bg-blue-400',
      devto: 'bg-gray-700',
    };
    return colors[platformName] || 'bg-gray-500';
  };

  const getStatusColor = (status: WritingContent['status']) => {
    const colors: Record<string, string> = {
      draft: 'text-gray-400',
      ready: 'text-green-400',
      submitted: 'text-yellow-400',
      published: 'text-blue-400',
      earning: 'text-emerald-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusIcon = (status: WritingContent['status']) => {
    if (status === 'earning') return <DollarSign className="w-4 h-4" />;
    if (status === 'published') return <CheckCircle className="w-4 h-4" />;
    if (status === 'submitted') return <Upload className="w-4 h-4" />;
    if (status === 'ready') return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const totalViews = content.platforms.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalProjected = content.platforms.reduce((sum, p) => sum + p.projectedEarnings, 0);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              {content.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
              {content.type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {content.readingTime} min read
            </span>
            <span>{content.wordCount.toLocaleString()} words</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1 ${getStatusColor(content.status)}`}>
          {getStatusIcon(content.status)}
          <span className="text-xs font-semibold uppercase">{content.status}</span>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Quality Score</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${content.quality}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white">{content.quality}</span>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Marketability</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${content.marketability}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white">{content.marketability}</span>
          </div>
        </div>
      </div>

      {/* Topics & Keywords */}
      {content.topics.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Topics</div>
          <div className="flex flex-wrap gap-2">
            {content.topics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Earnings & Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-black/30 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-lg font-bold">${content.earnings.toFixed(0)}</span>
          </div>
          <div className="text-xs text-gray-400">Earned</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-lg font-bold">${totalProjected.toFixed(0)}</span>
          </div>
          <div className="text-xs text-gray-400">Projected</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-lg font-bold">{totalViews}</span>
          </div>
          <div className="text-xs text-gray-400">Views</div>
        </div>
      </div>

      {/* Platform Badges */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Publishing Platforms</div>
        <div className="flex flex-wrap gap-2">
          {content.platforms.map((platform, idx) => (
            <div
              key={idx}
              className="group/platform relative"
              title={`${platform.name}: $${platform.earnings} earned, ${platform.status}`}
            >
              <div
                className={`${getPlatformColor(platform.name)} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform`}
              >
                {getPlatformIcon(platform.name)}
              </div>
              {platform.status === 'published' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(content)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}

        {onPublish && content.platforms.some(p => p.status === 'not_submitted') && (
          <button
            onClick={() => {
              const platform = content.platforms.find(p => p.status === 'not_submitted');
              if (platform) onPublish(content, platform.name);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Publish
          </button>
        )}

        {content.submissions.length > 0 && (
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(content.id)}
            className="flex items-center justify-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ROI Indicator */}
      {content.earnings > 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-300">Time Investment ROI</span>
            <span className="text-green-400 font-bold">
              ${(content.earnings / Math.max(content.readingTime * 2, 1)).toFixed(2)}/hr
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingCard;

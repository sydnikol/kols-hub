import React from 'react';
import { PhotoContent } from '../../services/contentMonetizationService';
import {
  Camera,
  DollarSign,
  Download,
  Eye,
  TrendingUp,
  ExternalLink,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoContent;
  onEdit?: (photo: PhotoContent) => void;
  onDelete?: (id: string) => void;
  onUpload?: (photo: PhotoContent, platform: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onEdit,
  onDelete,
  onUpload,
}) => {
  const getPlatformIcon = (platformName: string) => {
    const icons: Record<string, string> = {
      shutterstock: 'SS',
      adobe_stock: 'AS',
      istock: 'iS',
      getty: 'GI',
      unsplash_plus: 'U+',
      dreamstime: 'DT',
      '500px': '5p',
    };
    return icons[platformName] || platformName.substring(0, 2).toUpperCase();
  };

  const getPlatformColor = (platformName: string) => {
    const colors: Record<string, string> = {
      shutterstock: 'bg-red-500',
      adobe_stock: 'bg-red-600',
      istock: 'bg-green-500',
      getty: 'bg-blue-500',
      unsplash_plus: 'bg-gray-700',
      dreamstime: 'bg-purple-500',
      '500px': 'bg-blue-400',
    };
    return colors[platformName] || 'bg-gray-500';
  };

  const getStatusColor = (status: PhotoContent['status']) => {
    const colors: Record<string, string> = {
      processing: 'text-gray-400',
      ready: 'text-green-400',
      submitted: 'text-yellow-400',
      approved: 'text-blue-400',
      earning: 'text-emerald-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const totalProjected = photo.platforms.reduce((sum, p) => sum + p.projectedEarnings, 0);

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/30 overflow-hidden hover:border-blue-500/50 transition-all group">
      {/* Photo Preview */}
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        <img
          src={photo.photoUrl}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-white text-sm mb-2">
              <Camera className="w-4 h-4" />
              <span>{photo.metadata.width} x {photo.metadata.height}</span>
              <span>•</span>
              <span>{photo.metadata.orientation}</span>
              <span>•</span>
              <span>{photo.metadata.aspectRatio}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full ${getStatusColor(photo.status)}`}>
            {photo.status === 'approved' && <CheckCircle className="w-3 h-3" />}
            {photo.status === 'earning' && <DollarSign className="w-3 h-3" />}
            <span className="text-xs font-semibold uppercase">{photo.status}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {photo.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-1">
            {photo.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ImageIcon className="w-3 h-3" />
            <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Quality</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${photo.quality}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white">{photo.quality}</span>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Market Value</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${photo.marketability}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white">{photo.marketability}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {photo.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Tags</div>
            <div className="flex flex-wrap gap-1">
              {photo.tags.slice(0, 6).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {photo.tags.length > 6 && (
                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                  +{photo.tags.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-black/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <DollarSign className="w-3 h-3" />
              <span className="text-sm font-bold">${photo.earnings.toFixed(0)}</span>
            </div>
            <div className="text-xs text-gray-400">Earned</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-sm font-bold">${totalProjected.toFixed(0)}</span>
            </div>
            <div className="text-xs text-gray-400">Potential</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Download className="w-3 h-3" />
              <span className="text-sm font-bold">{photo.downloads}</span>
            </div>
            <div className="text-xs text-gray-400">Sales</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Eye className="w-3 h-3" />
              <span className="text-sm font-bold">{photo.views}</span>
            </div>
            <div className="text-xs text-gray-400">Views</div>
          </div>
        </div>

        {/* Platform Badges */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Stock Platforms</div>
          <div className="flex flex-wrap gap-2">
            {photo.platforms.map((platform, idx) => (
              <div
                key={idx}
                className="group/platform relative"
                title={`${platform.name}: $${platform.earnings} earned, ${platform.downloads} downloads`}
              >
                <div
                  className={`${getPlatformColor(platform.name)} px-2 py-1 rounded text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform`}
                >
                  {getPlatformIcon(platform.name)}
                </div>
                {platform.status === 'approved' && (
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
              onClick={() => onEdit(photo)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}

          {onUpload && photo.platforms.some(p => p.status === 'not_submitted') && (
            <button
              onClick={() => {
                const platform = photo.platforms.find(p => p.status === 'not_submitted');
                if (platform) onUpload(photo, platform.name);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          )}

          {photo.submissions.length > 0 && (
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(photo.id)}
              className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Download Rate */}
        {photo.downloads > 0 && photo.views > 0 && (
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-300">Conversion Rate</span>
              <span className="text-blue-400 font-bold">
                {((photo.downloads / photo.views) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Earnings Per Download */}
        {photo.downloads > 0 && photo.earnings > 0 && (
          <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-300">Avg. Earnings/Download</span>
              <span className="text-green-400 font-bold">
                ${(photo.earnings / photo.downloads).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;

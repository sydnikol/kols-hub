import React, { useEffect, useState } from 'react';
import {
  contentMonetizationService,
  WritingContent,
  PhotoContent,
  ContentPortfolio,
} from '../services/contentMonetizationService';
import WritingCard from '../components/content/WritingCard';
import PhotoCard from '../components/content/PhotoCard';
import {
  FileText,
  Camera,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Upload,
  Download,
  Play,
  PieChart,
  BarChart3,
  Zap,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const ContentMonetizationPage: React.FC = () => {
  const [writing, setWriting] = useState<WritingContent[]>([]);
  const [photos, setPhotos] = useState<PhotoContent[]>([]);
  const [portfolio, setPortfolio] = useState<ContentPortfolio | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'writing' | 'photos'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    loadData();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = await contentMonetizationService.isConnected();
    setIsConnected(connected);
  };

  const loadData = async () => {
    try {
      const [writingData, photoData, portfolioData] = await Promise.all([
        contentMonetizationService.getAllWritingContent(),
        contentMonetizationService.getAllPhotoContent(),
        contentMonetizationService.getPortfolio(),
      ]);

      setWriting(writingData);
      setPhotos(photoData);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const result = await contentMonetizationService.connect();
      if (result.success) {
        setIsConnected(true);
        alert('Successfully connected to Google Drive & Photos!');
      } else {
        alert(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to connect. Please try again.');
    }
  };

  const handleScanWriting = async () => {
    setIsScanning(true);
    try {
      const scanned = await contentMonetizationService.scanWritingContent();
      setWriting(scanned);
      alert(`Found ${scanned.length} writing pieces!`);
      await loadData();
    } catch (error) {
      alert('Failed to scan writing. Make sure you are connected.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanPhotos = async () => {
    setIsScanning(true);
    try {
      const scanned = await contentMonetizationService.scanPhotographyContent();
      setPhotos(scanned);
      alert(`Found ${scanned.length} photos!`);
      await loadData();
    } catch (error) {
      alert('Failed to scan photos. Make sure you are connected.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteWriting = async (id: string) => {
    if (confirm('Delete this writing piece?')) {
      await contentMonetizationService.deleteWritingContent(id);
      await loadData();
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (confirm('Delete this photo?')) {
      await contentMonetizationService.deletePhotoContent(id);
      await loadData();
    }
  };

  const handlePublishWriting = (content: WritingContent, platform: string) => {
    alert(`Publishing "${content.title}" to ${platform}...\n\nThis would open the ${platform} publishing interface.`);
  };

  const handleUploadPhoto = (photo: PhotoContent, platform: string) => {
    const metadata = contentMonetizationService.generatePhotoUploadMetadata(photo);
    alert(`Uploading "${photo.title}" to ${platform}...\n\nTitle: ${metadata.title}\nDescription: ${metadata.description}\nKeywords: ${metadata.keywords.join(', ')}`);
  };

  const filteredWriting = selectedPlatform === 'all'
    ? writing
    : writing.filter(w => w.platforms.some(p => p.name === selectedPlatform));

  const filteredPhotos = selectedPlatform === 'all'
    ? photos
    : photos.filter(p => p.platforms.some(pl => pl.name === selectedPlatform));

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'medium', label: 'Medium' },
    { value: 'substack', label: 'Substack' },
    { value: 'kindle', label: 'Kindle' },
    { value: 'shutterstock', label: 'Shutterstock' },
    { value: 'adobe_stock', label: 'Adobe Stock' },
    { value: 'getty', label: 'Getty Images' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Content Monetization Hub
          </h1>
          <p className="text-purple-300">
            Transform your writing and photography into passive income streams
          </p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-500/30">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-300 mb-2">Connect to Google Services</h3>
                <p className="text-yellow-200 text-sm mb-4">
                  Connect your Google Drive and Google Photos to scan for monetizable content.
                </p>
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg border border-yellow-500/30 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                  Connect Google Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">Total Earnings</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${portfolio.totalEarnings.toFixed(2)}
              </div>
              <div className="text-xs text-green-300">
                ${portfolio.monthlyEarnings.toFixed(2)} this month
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-400">Writing</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {portfolio.totalWriting}
              </div>
              <div className="text-xs text-purple-300">
                ${portfolio.writing.earnings.toFixed(0)} earned • {portfolio.writing.avgQuality}% avg quality
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-400">Photography</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {portfolio.totalPhotos}
              </div>
              <div className="text-xs text-blue-300">
                ${portfolio.photography.earnings.toFixed(0)} earned • {portfolio.photography.avgQuality}% avg quality
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 p-6 rounded-xl border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-indigo-400">Portfolio Value</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {portfolio.totalWriting + portfolio.totalPhotos}
              </div>
              <div className="text-xs text-indigo-300">
                Total content pieces
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/30 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleScanWriting}
                disabled={!isConnected || isScanning}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors disabled:opacity-50"
              >
                <FileText className="w-5 h-5" />
                {isScanning ? 'Scanning...' : 'Scan Writing'}
              </button>

              <button
                onClick={handleScanPhotos}
                disabled={!isConnected || isScanning}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                {isScanning ? 'Scanning...' : 'Scan Photos'}
              </button>

              <button
                onClick={loadData}
                className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Filter:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 bg-black/30 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500"
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-purple-500/30">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'text-purple-300 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-purple-300'
              }`}
            >
              All Content ({writing.length + photos.length})
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'writing'
                  ? 'text-purple-300 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-purple-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Writing ({writing.length})
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'photos'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <Camera className="w-4 h-4" />
              Photos ({photos.length})
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-8">
          {/* Writing Section */}
          {(activeTab === 'all' || activeTab === 'writing') && filteredWriting.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Writing Portfolio ({filteredWriting.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWriting.map((content) => (
                  <WritingCard
                    key={content.id}
                    content={content}
                    onEdit={() => alert('Edit functionality coming soon!')}
                    onDelete={handleDeleteWriting}
                    onPublish={handlePublishWriting}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Photos Section */}
          {(activeTab === 'all' || activeTab === 'photos') && filteredPhotos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6" />
                Photography Portfolio ({filteredPhotos.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onEdit={() => alert('Edit functionality coming soon!')}
                    onDelete={handleDeletePhoto}
                    onUpload={handleUploadPhoto}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {writing.length === 0 && photos.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/20 rounded-full mb-4">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Content Found
              </h3>
              <p className="text-gray-400 mb-6">
                {isConnected
                  ? 'Click "Scan Writing" or "Scan Photos" to discover monetizable content.'
                  : 'Connect your Google account to get started.'}
              </p>
              {isConnected && (
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleScanWriting}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-8 py-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Scan for Writing
                  </button>
                  <button
                    onClick={handleScanPhotos}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Scan for Photos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Banner */}
        {(writing.length > 0 || photos.length > 0) && (
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/30">
            <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI-Powered Monetization
            </h4>
            <p className="text-purple-200 text-sm">
              Your content is analyzed for quality, marketability, and optimal platform matching.
              Each piece includes projected earnings, SEO recommendations, and automated metadata generation
              to maximize your passive income potential.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentMonetizationPage;

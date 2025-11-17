import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle, AlertCircle, ExternalLink, Apple, Github } from 'lucide-react';

/**
 * 📱 MOBILE DOWNLOADS COMPONENT
 * ==============================
 * Download Android APK and iOS apps directly from the website
 * 
 * Features:
 * - Direct APK download for Android
 * - TestFlight link for iOS
 * - QR codes for easy mobile scanning
 * - Installation instructions
 * - Version tracking
 */

interface DownloadOption {
  platform: 'Android' | 'iOS' | 'Desktop';
  version: string;
  size: string;
  downloadUrl: string;
  alternateUrl?: string;
  icon: React.ReactNode;
  color: string;
  instructions: string[];
}

const MobileDownloads: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Detect user's platform
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      setSelectedPlatform('Android');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setSelectedPlatform('iOS');
    } else {
      setSelectedPlatform('Desktop');
    }
  }, []);

  const downloads: DownloadOption[] = [
    {
      platform: 'Android',
      version: '5.0.0',
      size: '25 MB',
      downloadUrl: '/downloads/kol-hub-v5.0.0.apk',
      alternateUrl: 'https://github.com/yourusername/kol-hub/releases/latest/download/kol-hub.apk',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'green',
      instructions: [
        'Download the APK file',
        'Open the downloaded file on your Android device',
        'If prompted, enable "Install from Unknown Sources" in Settings',
        'Follow the installation prompts',
        'Open KOL Hub from your app drawer',
      ]
    },
    {
      platform: 'iOS',
      version: '5.0.0',
      size: '30 MB',
      downloadUrl: 'https://testflight.apple.com/join/YOUR_CODE',
      icon: <Apple className="w-8 h-8" />,
      color: 'gray',
      instructions: [
        'Install TestFlight from the App Store (if not already installed)',
        'Tap the TestFlight link below',
        'Accept the beta invitation',
        'Download and install KOL Hub',
        'Open the app from your home screen',
      ]
    },
    {
      platform: 'Desktop',
      version: '5.0.0',
      size: '120 MB',
      downloadUrl: '/downloads/KOL-Hub-Setup-5.0.0.exe',
      alternateUrl: 'https://github.com/yourusername/kol-hub/releases/latest',
      icon: <Download className="w-8 h-8" />,
      color: 'purple',
      instructions: [
        'Download the installer for your operating system',
        'Run the installer file',
        'Follow the installation wizard',
        'Launch KOL Hub from your applications',
        'Sign in or create your profile',
      ]
    }
  ];

  const handleDownload = async (download: DownloadOption) => {
    setIsDownloading(true);
    
    // Track download analytics
    try {
      await fetch('/api/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: download.platform,
          version: download.version,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.log('Analytics tracking unavailable (offline mode)');
    }

    // Initiate download
    if (download.platform === 'iOS') {
      window.open(download.downloadUrl, '_blank');
    } else {
      // For Android and Desktop, try local first, then fallback to GitHub
      try {
        const response = await fetch(download.downloadUrl, { method: 'HEAD' });
        if (response.ok) {
          window.location.href = download.downloadUrl;
        } else {
          window.open(download.alternateUrl || download.downloadUrl, '_blank');
        }
      } catch {
        window.open(download.alternateUrl || download.downloadUrl, '_blank');
      }
    }

    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-purple-600 rounded-full mb-4">
          <Smartphone className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
          Download KOL Hub
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Your self-evolving personal operating system. Works everywhere: Desktop, Web, Mobile - Online & Offline.
        </p>
      </div>

      {/* Platform Detection Notice */}
      {selectedPlatform && (
        <div className="mb-8 p-4 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <p className="text-blue-200">
              Detected: <span className="font-semibold">{selectedPlatform}</span> - 
              Scroll down for your recommended download
            </p>
          </div>
        </div>
      )}

      {/* Download Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {downloads.map((download) => (
          <div
            key={download.platform}
            className={`bg-gray-800 rounded-xl p-6 border-2 transition-all ${
              selectedPlatform === download.platform
                ? `border-${download.color}-500 shadow-lg shadow-${download.color}-500/50`
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* Platform Icon & Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-${download.color}-600 rounded-lg`}>
                {download.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{download.platform}</h3>
                <p className="text-sm text-gray-400">v{download.version} • {download.size}</p>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(download)}
              disabled={isDownloading}
              className={`w-full py-3 px-4 bg-${download.color}-600 hover:bg-${download.color}-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download {download.platform}
                </>
              )}
            </button>

            {/* Alternate Link for Desktop/Android */}
            {download.alternateUrl && download.platform !== 'iOS' && (
              <a
                href={download.alternateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 px-4 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            )}

            {/* Installation Instructions */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-gray-300">Installation Steps:</h4>
              <ol className="space-y-2">
                {download.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${download.color}-600 flex items-center justify-center text-white text-xs font-bold`}>
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* QR Codes Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Scan to Download</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Android QR */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <img 
                src="/qr-android.png" 
                alt="Android QR Code"
                className="w-48 h-48"
                onError={(e) => {
                  // Fallback: Generate QR code on the fly or show placeholder
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <h3 className="font-semibold mb-2">Android APK</h3>
            <p className="text-sm text-gray-400">Scan with your Android device</p>
          </div>

          {/* iOS QR */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <img 
                src="/qr-ios.png" 
                alt="iOS QR Code"
                className="w-48 h-48"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <h3 className="font-semibold mb-2">iOS TestFlight</h3>
            <p className="text-sm text-gray-400">Scan with your iPhone/iPad</p>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="bg-gray-800 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">System Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-green-400">Android</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Android 7.0 (Nougat) or later</li>
              <li>• 100 MB free storage</li>
              <li>• 2 GB RAM minimum</li>
              <li>• Internet connection (initial setup)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-400">iOS</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• iOS 13.0 or later</li>
              <li>• 150 MB free storage</li>
              <li>• iPhone 6S or newer</li>
              <li>• TestFlight app installed</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-purple-400">Desktop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Windows 10/11, macOS 10.15+, or Linux</li>
              <li>• 500 MB free storage</li>
              <li>• 4 GB RAM minimum</li>
              <li>• 64-bit processor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Health Tracking', features: ['Medications', 'Vitals', 'Body Weather', 'Pain Logs'] },
            { title: 'AI Companion', features: ['ChronoMuse', '3D Avatar', 'Voice Chat', 'Insights'] },
            { title: 'Support Tools', features: ['Handbooks', 'Scripts', 'Emergency Cards', 'Quick Glance'] },
            { title: 'Offline First', features: ['Works Offline', 'Auto Sync', 'Local Storage', 'PWA Ready'] },
          ].map((category, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-3 text-purple-300">{category.title}</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {category.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-indigo-900 bg-opacity-30 border border-indigo-700 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2 text-indigo-300">Need Help?</h3>
            <p className="text-gray-300 mb-3">
              Having trouble installing? Check our detailed guides or reach out for support.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/docs/installation-guide"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Installation Guide
              </a>
              <a
                href="/docs/troubleshooting"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Troubleshooting
              </a>
              <a
                href="https://github.com/yourusername/kol-hub/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDownloads;

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle,
  AlertCircle,
  Globe,
  Monitor,
  Apple,
  Zap,
  Shield,
  Cloud,
  Heart,
  Brain,
  Wallet,
  Home,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';

/**
 * MOBILE DOWNLOADS PAGE
 * =====================
 * Beautiful, modern download page for Kol's Hub
 * Supports Android APK, PWA for iOS, and Desktop
 */

interface DownloadOption {
  platform: 'Android' | 'iOS' | 'Desktop';
  version: string;
  size: string;
  downloadUrl: string;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
  available: boolean;
  instructions: string[];
  buttonText: string;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
    <div className="text-purple-400 mb-3">{icon}</div>
    <h4 className="font-semibold text-white mb-1">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const MobileDownloads: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      version: '5.5.0',
      size: 'PWA Install',
      downloadUrl: 'https://kolshub.net',
      icon: <Smartphone className="w-10 h-10" />,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/20 to-emerald-600/20',
      available: true,
      buttonText: 'Install Android App',
      instructions: [
        'Open Chrome browser on Android',
        'Visit kolshub.net',
        'Tap the menu (⋮) → "Add to Home screen"',
        'Tap "Install" when prompted',
        'Launch from your home screen - works offline!'
      ]
    },
    {
      platform: 'iOS',
      version: '5.5.0',
      size: 'Web App',
      downloadUrl: 'https://kolshub.net',
      icon: <Apple className="w-10 h-10" />,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-500/20 to-indigo-600/20',
      available: true,
      buttonText: 'Add to Home Screen',
      instructions: [
        'Tap the Share button in Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Name it "Kol\'s Hub" and tap Add',
        'Open from your home screen',
        'Works offline like a native app!'
      ]
    },
    {
      platform: 'Desktop',
      version: '5.5.0',
      size: 'PWA',
      downloadUrl: 'https://kolshub.net',
      icon: <Monitor className="w-10 h-10" />,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-600/20',
      available: true,
      buttonText: 'Install Desktop App',
      instructions: [
        'Click the install icon in your browser\'s address bar',
        'Or click Menu → "Install Kol\'s Hub"',
        'Click "Install" in the popup',
        'App opens in its own window',
        'Access from Start Menu or Dock'
      ]
    }
  ];

  const handleDownload = async (download: DownloadOption) => {
    setIsDownloading(true);

    // All platforms now use PWA installation
    window.open(download.downloadUrl, '_blank');

    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  const features = [
    { icon: <Heart className="w-6 h-6" />, title: 'Health Tracking', desc: 'Medications, vitals, symptoms & more' },
    { icon: <Brain className="w-6 h-6" />, title: 'AI Companion', desc: 'ChronoMuse 3D avatar & insights' },
    { icon: <Wallet className="w-6 h-6" />, title: 'Finance Hub', desc: 'Budget, invest, passive income' },
    { icon: <Home className="w-6 h-6" />, title: 'Smart Home', desc: 'Control your connected devices' },
    { icon: <Shield className="w-6 h-6" />, title: 'Privacy First', desc: 'Your data stays on your device' },
    { icon: <Cloud className="w-6 h-6" />, title: 'Works Offline', desc: 'Full functionality without internet' },
  ];

  const stats = [
    { value: '150+', label: 'Features' },
    { value: '100%', label: 'Free' },
    { value: '5.0', label: 'Rating' },
    { value: '0', label: 'Ads' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Version 5.5.0 — Your Self-Evolving Personal OS</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Kol's Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to manage your life, health, finances, and home —
              all in one beautiful app that works everywhere.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 md:gap-16 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Platform Detection */}
          {selectedPlatform && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300">
                  Detected: <strong>{selectedPlatform}</strong> — Recommended download highlighted below
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {downloads.map((download) => {
            const isRecommended = selectedPlatform === download.platform;
            return (
              <div
                key={download.platform}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  isRecommended
                    ? 'ring-2 ring-purple-500 shadow-xl shadow-purple-500/20 transform scale-105 z-10'
                    : 'hover:transform hover:scale-102'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    RECOMMENDED
                  </div>
                )}

                {/* Card Background */}
                <div className={`bg-gradient-to-br ${download.bgGradient} backdrop-blur-sm border border-white/10`}>
                  <div className="p-6">
                    {/* Platform Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${download.gradient} text-white shadow-lg`}>
                        {download.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{download.platform}</h3>
                        <p className="text-gray-400">v{download.version} • {download.size}</p>
                      </div>
                    </div>

                    {/* Install Button */}
                    <button
                      onClick={() => handleDownload(download)}
                      disabled={isDownloading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 bg-gradient-to-r ${download.gradient} hover:opacity-90 disabled:opacity-50 shadow-lg`}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          {download.buttonText}
                        </>
                      )}
                    </button>

                    {/* Instructions */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Quick Setup
                      </h4>
                      <ol className="space-y-2">
                        {download.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${download.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Everything You Need</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Over 150 integrated features designed to simplify your daily life
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>

      {/* System Requirements */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Smartphone className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-green-400">Android</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Android 7.0+ (Nougat)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  100 MB free storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  2 GB RAM minimum
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Apple className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-blue-400">iOS / iPadOS</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  iOS 13+ / Safari 14+
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Add to Home Screen for best experience
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Works offline after first load
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Monitor className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-purple-400">Desktop</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Chrome, Edge, Firefox, or Safari
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Windows, macOS, or Linux
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Install as standalone app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have simplified their daily routines with Kol's Hub.
              Download now and experience the difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://kolshub.net"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Install App Now
              </a>
              <a
                href="https://kolshub.net"
                className="px-8 py-4 bg-white/20 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Open Web Version
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-300 mb-2">Need Help Installing?</h3>
              <p className="text-gray-300 mb-4">
                If you're having trouble, the Web App at kolshub.net works on all devices.
                Just visit the site and add it to your home screen for the best experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://kolshub.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-sm font-medium text-amber-300 transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Open Web App
                </a>
                <a
                  href="mailto:support@kolshub.net"
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Kol's Hub. All rights reserved. Made with ❤️ for better living.</p>
        </div>
      </footer>
    </div>
  );
};

export default MobileDownloads;

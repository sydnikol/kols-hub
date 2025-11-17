import React, { useState, useEffect } from 'react';
import { Download, Smartphone, QrCode, CheckCircle, AlertCircle, ExternalLink, Apple, Chrome } from 'lucide-react';

export const MobileDownloadPage: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [localIP, setLocalIP] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get current URL for QR code
    const currentUrl = window.location.origin;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`);
    
    // Try to detect local IP (this works in dev mode)
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setLocalIP(data.ip))
      .catch(() => setLocalIP('your-ip-address'));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const installSteps = {
    ios: [
      'Open Safari on your iPhone/iPad',
      'Navigate to this website URL',
      'Tap the Share button (box with arrow)',
      'Scroll down and tap "Add to Home Screen"',
      'Name it "KOL App" and tap "Add"',
      'Find the app icon on your home screen!'
    ],
    android: [
      'Open Chrome on your Android device',
      'Navigate to this website URL',
      'Tap the menu (three dots in corner)',
      'Tap "Install app" or "Add to Home screen"',
      'Confirm the installation',
      'Find the app icon on your home screen!'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
            📱 Install KOL Mobile App
          </h1>
          <p className="text-xl text-gray-300">
            Works on iPhone & Android • No App Store Required • 100% Free
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <QrCode className="w-8 h-8 text-purple-400" />
                Instant Install - Scan QR Code
              </h2>
              <p className="text-gray-300 mb-6">
                The fastest way to install! Just scan this QR code with your phone's camera app,
                and follow the installation steps below.
              </p>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <p className="text-sm text-purple-300 mb-2">✨ Pro Tip:</p>
                <p className="text-sm text-gray-300">
                  Make sure your phone is on the same WiFi network as this computer for fastest loading!
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-2xl">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code to install app"
                    className="w-64 h-64"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Manual URL Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-purple-400" />
            Or Type This URL
          </h2>
          <div className="flex gap-4 items-center">
            <code className="flex-1 bg-gray-900 p-4 rounded-lg text-purple-300 font-mono text-lg border border-purple-500/30">
              {window.location.origin}
            </code>
            <button
              onClick={() => copyToClipboard(window.location.origin)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* iOS Instructions */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Apple className="w-7 h-7 text-purple-400" />
              iPhone & iPad (iOS)
            </h2>
            <ol className="space-y-4">
              {installSteps.ios.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Must use Safari browser for iOS installation
              </p>
            </div>
          </div>

          {/* Android Instructions */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Chrome className="w-7 h-7 text-purple-400" />
              Android Devices
            </h2>
            <ol className="space-y-4">
              {installSteps.android.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-300 pt-1">{step}</p>
                </li>
              ))}            </ol>
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <p className="text-sm text-green-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Works with Chrome, Firefox, or Samsung Internet
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 What You Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Native Feel</h3>
              <p className="text-sm text-gray-300">
                Looks and works exactly like a real app from the app store
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Works Offline</h3>
              <p className="text-sm text-gray-300">
                Access all features even without internet connection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Auto Updates</h3>
              <p className="text-sm text-gray-300">
                Always get the latest features automatically
              </p>
            </div>
          </div>
        </div>

        {/* Advanced: Native App Downloads */}
        <div className="bg-gradient-to-r from-purple-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            🚀 Advanced: Download Native App Files
          </h2>
          <p className="text-gray-300 mb-6">
            Want to build fully native Android (APK) or iOS (IPA) files? 
            These require additional software but give you maximum control.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-xl font-bold mb-3">📦 Android APK</h3>
              <p className="text-sm text-gray-300 mb-4">
                Requires: Android Studio installed on your computer
              </p>
              <div className="space-y-2 text-sm">
                <p>1. Install Android Studio</p>
                <p>2. Run: <code className="bg-gray-800 px-2 py-1 rounded">npm run build:android</code></p>
                <p>3. Find APK in android/app/build/outputs/</p>
              </div>
              <a 
                href="https://developer.android.com/studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Get Android Studio →
              </a>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-xl font-bold mb-3">🍎 iOS IPA</h3>
              <p className="text-sm text-gray-300 mb-4">
                Requires: Xcode (Mac only) + Apple Developer Account ($99/year)
              </p>
              <div className="space-y-2 text-sm">
                <p>1. Install Xcode from Mac App Store</p>
                <p>2. Run: <code className="bg-gray-800 px-2 py-1 rounded">npm run build:ios</code></p>
                <p>3. Archive and export IPA in Xcode</p>
              </div>
              <a 
                href="https://developer.apple.com/xcode/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Get Xcode →
              </a>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Need help? Check the documentation in the README.md file</p>
          <p className="mt-2">or the MOBILE-SETUP.txt guide</p>
        </div>
      </div>
    </div>
  );
};

export default MobileDownloadPage;
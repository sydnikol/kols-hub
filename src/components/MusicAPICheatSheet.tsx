// 📋 ONE-PAGE CHEAT SHEET COMPONENT
// Printable quick reference for API setup

import React from 'react';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';

export const MusicAPICheatSheet: React.FC = () => {
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 print:p-0">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🎵 KOL Music API Cheat Sheet</h1>
        <p className="text-gray-600">Quick Reference for Setup</p>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* SoundCloud */}
        <div className="border-2 border-purple-500 rounded-lg p-4">
          <div className="text-center mb-4">
            <span className="text-4xl">🎧</span>
            <h2 className="text-xl font-bold mt-2">SoundCloud</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Easiest!
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>Dashboard:</strong>
              <a 
                href="https://developers.soundcloud.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-xs mt-1"
              >
                developers.soundcloud.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <strong>You Need:</strong>
              <p className="text-xs text-gray-600">• Client ID</p>
            </div>

            <div>
              <strong>Redirect URI:</strong>
              <div className="bg-gray-100 p-2 rounded text-xs font-mono flex items-center justify-between">
                <span className="text-xs">localhost:5173/callback/soundcloud</span>
                <button 
                  onClick={() => copyText('http://localhost:5173/callback/soundcloud')}
                  className="text-purple-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <strong>Steps:</strong>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                <li>Sign in</li>
                <li>Register new app</li>
                <li>Copy Client ID</li>
                <li>Paste in KOL app</li>
              </ol>
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="border-2 border-red-500 rounded-lg p-4">
          <div className="text-center mb-4">
            <span className="text-4xl">📺</span>
            <h2 className="text-xl font-bold mt-2">YouTube</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Easy!
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>Dashboard:</strong>
              <a 
                href="https://console.cloud.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-xs mt-1"
              >
                console.cloud.google.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <strong>You Need:</strong>
              <p className="text-xs text-gray-600">• API Key</p>
            </div>

            <div>
              <strong>Redirect URI:</strong>
              <p className="text-xs text-gray-600">Not needed!</p>
            </div>

            <div>
              <strong>Steps:</strong>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                <li>Create project</li>
                <li>Enable YouTube Data API v3</li>
                <li>Create API key</li>
                <li>Copy key</li>
                <li>Paste in KOL app</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Spotify */}
        <div className="border-2 border-green-500 rounded-lg p-4">
          <div className="text-center mb-4">
            <span className="text-4xl">🎵</span>
            <h2 className="text-xl font-bold mt-2">Spotify</h2>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Medium
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <strong>Dashboard:</strong>
              <a 
                href="https://developer.spotify.com/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-xs mt-1"
              >
                developer.spotify.com/dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <strong>You Need:</strong>
              <p className="text-xs text-gray-600">• Client ID</p>
              <p className="text-xs text-gray-600">• Client Secret</p>
            </div>

            <div>
              <strong>Redirect URI:</strong>
              <div className="bg-gray-100 p-2 rounded text-xs font-mono flex items-center justify-between">
                <span className="text-xs">localhost:5173/callback/spotify</span>
                <button 
                  onClick={() => copyText('http://localhost:5173/callback/spotify')}
                  className="text-green-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-red-600 mt-1">⚠️ Must match exactly!</p>
            </div>

            <div>
              <strong>Steps:</strong>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                <li>Create app</li>
                <li>Add redirect URI</li>
                <li>Copy Client ID & Secret</li>
                <li>Paste in KOL app</li>
                <li>Click "Connect Account"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-purple-700">✅ DO:</p>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              <li>Copy the ENTIRE key (no spaces)</li>
              <li>Keep keys private</li>
              <li>Screenshot your credentials</li>
              <li>Start with SoundCloud</li>
              <li>Test each platform after setup</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-700">❌ DON'T:</p>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              <li>Share keys publicly</li>
              <li>Commit keys to git</li>
              <li>Skip redirect URI setup</li>
              <li>Add extra spaces</li>
              <li>Use wrong URLs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">🆘 Troubleshooting</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-red-700">"Invalid Redirect URI"</p>
            <p className="text-xs text-gray-700">
              → Check spelling and protocol (http://)
              <br />→ Must match EXACTLY in dashboard
            </p>
          </div>
          <div>
            <p className="font-semibold text-red-700">"API Key Invalid"</p>
            <p className="text-xs text-gray-700">
              → Verify API is enabled
              <br />→ Check for typos in key
              <br />→ Try regenerating key
            </p>
          </div>
          <div>
            <p className="font-semibold text-red-700">"Nothing happens when I search"</p>
            <p className="text-xs text-gray-700">
              → Check internet connection
              <br />→ Verify keys are saved
              <br />→ Look in browser console for errors
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Note */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-2">📱 Mobile Apps (iOS/Android)</h3>
        <p className="text-sm text-gray-700 mb-2">
          When deploying to mobile, update redirect URIs to:
        </p>
        <div className="bg-gray-100 p-3 rounded font-mono text-xs">
          kolapp://callback/soundcloud
          <br />
          kolapp://callback/spotify
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 pt-6">
        <p className="text-sm text-gray-600 mb-2">
          💜 Created with velvet, voltage, and reverence 💜
        </p>
        <p className="text-xs text-gray-500">
          KOL - Your Self-Evolving Personal OS
        </p>
        <button
          onClick={() => window.print()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 print:hidden"
        >
          🖨️ Print This Cheat Sheet
        </button>
      </div>
    </div>
  );
};

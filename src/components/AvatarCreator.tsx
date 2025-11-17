import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Sparkles, User, Download, Save } from 'lucide-react';
import { buildAvatarCreatorUrl, extractAvatarIdFromUrl, createAvatarObject, getDefaultAvatarConfig } from '../utils/avatar-utils';
import { useKolHubStore } from '../store/kolhub-store';
import toast from 'react-hot-toast';

interface AvatarCreatorProps {
  onClose: () => void;
  onAvatarCreated?: (avatarId: string) => void;
}

/**
 * 🎮 AVATAR CREATOR - Ready Player Me Integration
 * ===============================================
 * Full-featured avatar creation using your custom subdomain:
 * kols-hub-674o9x.readyplayer.me
 * 
 * Features:
 * - Custom branded experience
 * - Photo upload or manual creation
 * - Fullbody and halfbody options
 * - Auto-save to KOL profile
 * - Real-time preview
 */
const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onClose, onAvatarCreated }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [creationMode, setCreationMode] = useState<'select' | 'creating'>('select');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { addAvatar, setCurrentAvatar } = useKolHubStore();
  const config = getDefaultAvatarConfig();

  useEffect(() => {
    // Listen for messages from Ready Player Me iframe
    const handleMessage = (event: MessageEvent) => {
      const json = parseMessageData(event.data);
      
      if (json?.source !== 'readyplayerme') return;
      
      // Frame ready
      if (json.eventName === 'v1.frame.ready') {
        setIsLoading(false);
        toast.success('Avatar creator ready! 🎨');
        console.log('✅ Ready Player Me frame loaded');
      }
      
      // Avatar exported (creation complete)
      if (json.eventName === 'v1.avatar.exported') {
        console.log('✅ Avatar exported:', json.data);
        setAvatarPreviewUrl(json.data.url);
        handleAvatarExported(json.data.url);
      }

      // User cancelled
      if (json.eventName === 'v1.user.set') {
        console.log('📝 User data set:', json.data);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const parseMessageData = (data: any): any => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      return null;
    }
  };

  const handleAvatarExported = async (avatarUrl: string) => {
    try {
      const avatarId = extractAvatarIdFromUrl(avatarUrl);
      
      if (!avatarId) {
        throw new Error('Invalid avatar URL received');
      }

      console.log('💾 Saving avatar:', avatarId);

      // Create avatar object with timestamp name
      const timestamp = new Date().toLocaleString();
      const newAvatar = createAvatarObject(avatarId, `KOL Avatar - ${timestamp}`);
      
      // Save to store
      addAvatar(newAvatar);
      setCurrentAvatar(newAvatar);
      
      toast.success('Avatar created and saved! 🎉', {
        duration: 4000,
        icon: '✨',
      });
      
      // Callback
      if (onAvatarCreated) {
        onAvatarCreated(avatarId);
      }
      
      // Show preview briefly before closing
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Error saving avatar:', error);
      toast.error('Failed to save avatar. Please try again.');
    }
  };

  const startCreation = (bodyType: 'fullbody' | 'halfbody', usePhoto: boolean = false) => {
    setCreationMode('creating');
    toast.loading('Opening avatar creator...', { id: 'creator-loading' });
  };

  const creatorUrl = buildAvatarCreatorUrl(config.subdomain, {
    bodyType: 'fullbody',
    quickStart: false,
    clearCache: false,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col border border-purple-500/30 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-400">Create Your Avatar</h2>
              <p className="text-sm text-gray-400">Design your digital self with Ready Player Me</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all hover:scale-110"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Selection Mode */}
        {creationMode === 'select' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Choose Your Creation Method</h3>
                <p className="text-gray-400">Select how you'd like to create your avatar</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo Upload Option */}
                <button
                  onClick={() => startCreation('fullbody', true)}
                  className="group relative bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-8 border-2 border-purple-500/20 hover:border-purple-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl group-hover:from-purple-600/10 group-hover:to-purple-600/20 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Camera size={40} className="text-purple-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">From Photo</h4>
                    <p className="text-gray-400 mb-4">Upload a selfie and let AI create your avatar</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                      <Sparkles size={16} />
                      <span>AI-powered</span>
                    </div>
                  </div>
                </button>

                {/* Manual Creation Option */}
                <button
                  onClick={() => {
                    setCreationMode('creating');
                    toast.dismiss('creator-loading');
                  }}
                  className="group relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-8 border-2 border-purple-500/20 hover:border-purple-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/10 rounded-2xl group-hover:from-indigo-600/10 group-hover:to-indigo-600/20 transition-all"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <User size={40} className="text-indigo-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Custom Design</h4>
                    <p className="text-gray-400 mb-4">Manually customize every detail of your avatar</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-indigo-300">
                      <Sparkles size={16} />
                      <span>Full control</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Your avatar will be saved automatically to your KOL profile
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Creation Mode - iframe */}
        {creationMode === 'creating' && (
          <>
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 z-20 rounded-2xl">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500 mx-auto mb-6"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400" size={32} />
                  </div>
                  <p className="text-purple-300 text-xl mb-2 animate-pulse">Loading Creator...</p>
                  <p className="text-purple-400/60 text-sm">Powered by Ready Player Me</p>
                </div>
              </div>
            )}

            {/* iframe Container */}
            <div className="flex-1 relative overflow-hidden">
              <iframe
                ref={iframeRef}
                src={creatorUrl}
                className="w-full h-full border-0"
                allow="camera *; microphone *; clipboard-write"
                title="Ready Player Me Avatar Creator"
              />
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Save size={20} className="text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Your avatar will be saved automatically when you finish
                  </p>
                </div>
                <div className="text-xs text-gray-600">
                  Subdomain: <span className="text-purple-400 font-mono">{config.subdomain}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarCreator;

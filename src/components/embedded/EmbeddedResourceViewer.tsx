/**
 * Universal Embedded Resource Viewer
 * ===================================
 * Embeds any website, tool, or app directly in the dollhouse
 * With fullscreen, pip mode, and activity tracking
 */

import React, { useState, useCallback, useEffect } from 'react';

interface EmbeddedResourceViewerProps {
  url: string;
  title: string;
  icon?: string;
  category?: string;
  onClose?: () => void;
  onActivity?: (activity: { type: string; url: string; duration: number }) => void;
  className?: string;
  allowFullscreen?: boolean;
  showControls?: boolean;
}

export const EmbeddedResourceViewer: React.FC<EmbeddedResourceViewerProps> = ({
  url,
  title,
  icon = '🌐',
  category = 'general',
  onClose,
  onActivity,
  className = '',
  allowFullscreen = true,
  showControls = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track activity on unmount
  useEffect(() => {
    return () => {
      if (onActivity) {
        onActivity({
          type: category,
          url,
          duration: Math.floor((Date.now() - startTime) / 1000)
        });
      }
    };
  }, []);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    setIsPip(false);
  }, [isFullscreen]);

  const handlePip = useCallback(() => {
    setIsPip(!isPip);
    setIsFullscreen(false);
  }, [isPip]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError('Unable to load this resource. It may not allow embedding.');
    setIsLoading(false);
  };

  // Fullscreen modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex items-center gap-2"
          >
            <span>Exit Fullscreen</span>
            <span>✕</span>
          </button>
        </div>
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  // Picture-in-picture mode
  if (isPip) {
    return (
      <div className="fixed bottom-4 right-4 z-[90] w-96 h-64 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 left-0 right-0 bg-gray-800 px-3 py-1 flex items-center justify-between">
          <span className="text-sm text-white truncate flex items-center gap-2">
            <span>{icon}</span>
            <span>{title}</span>
          </span>
          <div className="flex gap-1">
            <button
              onClick={handleFullscreen}
              className="p-1 hover:bg-gray-700 rounded text-white text-xs"
              title="Fullscreen"
            >
              ⛶
            </button>
            <button
              onClick={handlePip}
              className="p-1 hover:bg-gray-700 rounded text-white text-xs"
              title="Close PiP"
            >
              ✕
            </button>
          </div>
        </div>
        <iframe
          src={url}
          className="w-full h-full pt-8 border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border border-purple-500/20 ${className}`}>
      {/* Header Controls */}
      {showControls && (
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-medium text-white">{title}</h3>
              <span className="text-xs text-gray-400">{url}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePip}
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              title="Picture in Picture"
            >
              📌
            </button>
            {allowFullscreen && (
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Fullscreen"
              >
                ⛶
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              title="Open in New Tab"
            >
              ↗
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {title}...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-8 text-center">
          <span className="text-4xl block mb-4">⚠️</span>
          <p className="text-gray-400 mb-4">{error}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
          >
            Open in New Tab Instead
          </a>
        </div>
      )}

      {/* Iframe */}
      {!error && (
        <iframe
          src={url}
          className="w-full h-[600px] border-0"
          title={title}
          onLoad={handleLoad}
          onError={handleError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; microphone; camera"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
      )}
    </div>
  );
};

export default EmbeddedResourceViewer;

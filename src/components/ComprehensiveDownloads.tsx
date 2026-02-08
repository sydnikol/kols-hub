import React, { useState, useEffect } from 'react';
import {
  Smartphone,
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
  Download,
  Star,
  Users,
  Lock,
  Cpu,
  Crown,
  Key,
  DoorOpen,
  Moon,
  Eye,
  Flame,
  Ghost,
  Clock,
  Sparkles,
  Package,
  ChevronRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

/**
 * GOTHIC DOLLHOUSE DOWNLOADS PAGE
 * ========================================
 * Complete Victorian Dollhouse Aesthetic
 * Download experience like exploring manor rooms
 */

interface DownloadOption {
  platform: string;
  version: string;
  size: string;
  downloadUrl: string;
  icon: React.ReactNode;
  roomType: 'study' | 'attic' | 'cellar' | 'parlor' | 'conservatory' | 'tower';
  available: boolean;
  instructions: string[];
  buttonText: string;
  badge?: string;
  artifact: string; // Themed item name
}

// Dust particle effect
const DustParticle: React.FC<{ delay: number; x: number; size: number }> = ({ delay, x, size }) => (
  <div
    className="absolute animate-dustFloat pointer-events-none opacity-30"
    style={{
      left: `${x}%`,
      top: `${Math.random() * 100}%`,
      width: size,
      height: size,
      animationDelay: `${delay}s`,
      background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
      borderRadius: '50%',
    }}
  />
);

// Candle flame component
const CandleFlame: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-2 h-3', md: 'w-3 h-5', lg: 'w-4 h-6' };
  return (
    <div className={`relative ${sizes[size]}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-flicker blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400 via-yellow-300 to-white rounded-full animate-flicker opacity-80"
        style={{ animationDelay: '0.1s' }} />
      <div className="absolute -inset-2 bg-orange-400/20 rounded-full blur-md animate-pulse" />
    </div>
  );
};

// Victorian ornate frame
const OrnateFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-amber-600/50">
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-500/40 rounded-br-full" />
    </div>
    <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-amber-600/50">
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-500/40 rounded-bl-full" />
    </div>
    <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-amber-600/50">
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-500/40 rounded-tr-full" />
    </div>
    <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-amber-600/50">
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-500/40 rounded-tl-full" />
    </div>
    {children}
  </div>
);

// Room-themed download card
const DollhouseDownloadCard: React.FC<{
  download: DownloadOption;
  isRecommended: boolean;
  onDownload: () => void;
  isLoading: boolean;
}> = ({ download, isRecommended, onDownload, isLoading }) => {
  const roomStyles: Record<string, { bg: string; border: string; glow: string }> = {
    study: { bg: 'from-amber-950 to-stone-950', border: 'border-amber-700/40', glow: 'amber' },
    attic: { bg: 'from-slate-900 to-gray-950', border: 'border-slate-600/40', glow: 'slate' },
    cellar: { bg: 'from-gray-950 to-black', border: 'border-stone-700/40', glow: 'stone' },
    parlor: { bg: 'from-rose-950 to-stone-950', border: 'border-rose-800/40', glow: 'rose' },
    conservatory: { bg: 'from-emerald-950 to-stone-950', border: 'border-emerald-800/40', glow: 'emerald' },
    tower: { bg: 'from-purple-950 to-indigo-950', border: 'border-purple-700/40', glow: 'purple' },
  };

  const style = roomStyles[download.roomType];

  return (
    <div className={`relative group ${isRecommended ? 'z-10' : ''}`}>
      {/* Recommended glow */}
      {isRecommended && (
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-amber-700/30 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Room frame */}
      <div className={`relative bg-gradient-to-b ${style.bg} rounded-xl ${style.border} border-2 overflow-hidden shadow-2xl shadow-black/60 transition-all group-hover:border-amber-600/50`}>

        {/* Wallpaper pattern */}
        <div className="absolute inset-0 bg-damask opacity-[0.05]" />

        {/* Ceiling molding */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-amber-800/30 to-transparent" />

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-amber-950/80 to-transparent">
          <div className="absolute inset-0 bg-wood-floor opacity-20" />
        </div>

        {/* Side shadows */}
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-black/30 to-transparent" />

        {/* Mini chandelier */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-1 bg-amber-600/40" />
          <div className="flex items-end gap-0.5">
            <CandleFlame size="sm" />
            <div className="w-3 h-2 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-full" />
            <CandleFlame size="sm" />
          </div>
        </div>

        {/* Recommended badge */}
        {isRecommended && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-700 to-amber-900 text-amber-200 text-[9px] font-black px-3 py-1.5 rounded-bl-lg border-l border-b border-amber-600/50 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            RECOMMENDED
          </div>
        )}

        {/* Room content */}
        <div className="relative p-5 pt-8">
          {/* Platform icon - like furniture piece */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {/* Glow behind icon */}
              <div className="absolute inset-0 bg-amber-500/10 rounded-xl blur-lg group-hover:bg-amber-400/20 transition-all" />

              <OrnateFrame className="w-18 h-18">
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-amber-900/60 to-black/60 border border-amber-700/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-amber-400">{download.icon}</div>
                </div>
              </OrnateFrame>
            </div>

            <div className="flex-1 pt-1">
              <h3 className="text-xl font-black text-amber-100 font-serif tracking-wide">{download.platform}</h3>
              <p className="text-amber-500/60 text-xs italic mt-0.5">{download.artifact}</p>
              <p className="text-amber-600/50 text-[10px] mt-1">v{download.version} • {download.size}</p>
            </div>
          </div>

          {/* Artifact description */}
          <div className="mb-4 p-3 bg-black/30 rounded-lg border border-amber-900/20">
            <div className="flex items-center gap-2 text-[10px] text-amber-500/60 mb-2">
              <Sparkles className="w-3 h-3" />
              <span className="uppercase tracking-wider">Acquisition Method</span>
            </div>
            <ol className="space-y-1.5">
              {download.instructions.slice(0, 3).map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-amber-400/70">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-amber-400 text-[9px] font-black font-serif">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Download button - like opening a treasure chest */}
          <button
            onClick={onDownload}
            disabled={isLoading || !download.available}
            className="relative w-full py-3.5 px-4 rounded-lg font-black text-amber-200 text-sm transition-all flex items-center justify-center gap-3 bg-gradient-to-b from-amber-800/80 to-amber-950/80 hover:from-amber-700/80 hover:to-amber-900/80 disabled:opacity-50 border-2 border-amber-700/50 hover:border-amber-600/70 shadow-lg shadow-black/50 overflow-hidden group/btn"
          >
            {/* Button shine */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {isLoading ? (
              <span className="relative z-10 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-serif">Acquiring...</span>
              </span>
            ) : download.available ? (
              <span className="relative z-10 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="font-serif tracking-wide">{download.buttonText}</span>
                <ArrowRight className="w-4 h-4 opacity-60 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="font-serif">SEALED</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Feature display - like a display cabinet
const FeatureCabinet: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="relative group">
    <div className="bg-gradient-to-b from-amber-950/40 to-black/40 rounded-lg border border-amber-900/30 p-4 hover:border-amber-700/50 transition-all">
      {/* Cabinet frame corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600/30" />

      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-900/50 to-black/50 border border-amber-700/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-amber-400">
        {icon}
      </div>
      <h4 className="font-bold text-amber-200 text-sm font-serif mb-1">{title}</h4>
      <p className="text-amber-500/50 text-xs italic">{desc}</p>
    </div>
  </div>
);

// Stat display - like antique clock
const AntiqueStat: React.FC<{ value: string; label: string; icon: string }> = ({ value, label, icon }) => (
  <div className="relative group">
    <OrnateFrame className="bg-black/40 rounded-lg p-3 border border-amber-900/30 hover:border-amber-700/40 transition-colors">
      <div className="text-center">
        <span className="text-lg block mb-1">{icon}</span>
        <div className="text-xl font-black text-amber-300 font-serif">{value}</div>
        <div className="text-[9px] text-amber-500/50 uppercase tracking-wider">{label}</div>
      </div>
    </OrnateFrame>
  </div>
);

const ComprehensiveDownloads: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) {
      setSelectedPlatform('Android');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setSelectedPlatform('iOS');
    } else if (/Windows/i.test(userAgent)) {
      setSelectedPlatform('Windows');
    } else if (/Macintosh/i.test(userAgent)) {
      setSelectedPlatform('macOS');
    } else if (/Linux/i.test(userAgent)) {
      setSelectedPlatform('Linux');
    } else {
      setSelectedPlatform('Web');
    }
  }, []);

  const downloads: DownloadOption[] = [
    {
      platform: 'Android',
      version: '10.4.0',
      size: '~95 MB',
      downloadUrl: 'https://kolshub.net',
      icon: <Smartphone className="w-8 h-8" />,
      roomType: 'conservatory',
      available: true,
      buttonText: 'ACQUIRE ARTIFACT',
      artifact: 'The Emerald Portal Stone',
      badge: 'NEW: Sorority of Knowledge!',
      instructions: [
        'Open in Chrome on Android',
        'Tap menu → "Add to Home Screen"',
        'Install as PWA for native-like experience',
      ]
    },
    {
      platform: 'iOS',
      version: '10.4.0',
      size: 'PWA (~15 MB)',
      downloadUrl: 'https://kolshub.net',
      icon: <Apple className="w-8 h-8" />,
      roomType: 'parlor',
      available: true,
      buttonText: 'SUMMON TO HOME',
      artifact: 'The Silver Apple Sigil',
      badge: '80+ Embedded Apps!',
      instructions: [
        'Open in Safari\'s scrying mirror',
        'Tap Share → Add to Home Screen',
        'Launch from your altar (home screen)',
      ]
    },
    {
      platform: 'Windows',
      version: '10.4.0',
      size: 'PWA (~15 MB)',
      downloadUrl: 'https://kolshub.net',
      icon: <Monitor className="w-8 h-8" />,
      roomType: 'study',
      available: true,
      buttonText: 'OBTAIN TOME',
      artifact: 'The Azure Window Grimoire',
      badge: 'Universal App Launcher!',
      instructions: [
        'Open in Edge or Chrome browser',
        'Click install icon in address bar',
        'Or menu → "Install Kol\'s Hub"',
      ]
    },
    {
      platform: 'macOS',
      version: '10.4.0',
      size: 'PWA (~15 MB)',
      downloadUrl: 'https://kolshub.net',
      icon: <Monitor className="w-8 h-8" />,
      roomType: 'tower',
      available: true,
      buttonText: 'CLAIM RELIC',
      artifact: 'The Obsidian Mac Orb',
      badge: 'AI Doll Guides!',
      instructions: [
        'Open in Chrome or Safari',
        'Chrome: Click install in address bar',
        'Safari: File → Add to Dock',
      ]
    },
    {
      platform: 'Linux',
      version: '10.4.0',
      size: 'PWA (~15 MB)',
      downloadUrl: 'https://kolshub.net',
      icon: <Cpu className="w-8 h-8" />,
      roomType: 'attic',
      available: true,
      buttonText: 'RETRIEVE SCROLL',
      artifact: 'The Penguin\'s Ancient Scroll',
      instructions: [
        'Open in Chrome or Firefox',
        'Click install icon in address bar',
        'PWA works on all distros',
      ]
    },
    {
      platform: 'Web App',
      version: '10.4.0',
      size: 'Instant',
      downloadUrl: 'https://kolshub.net',
      icon: <Globe className="w-8 h-8" />,
      roomType: 'cellar',
      available: true,
      buttonText: 'ENTER PORTAL',
      artifact: 'The Ethereal Web Gateway',
      badge: 'Media Player + Libraries!',
      instructions: [
        'Works in any browser sanctum',
        'No installation ritual required',
        'Instant access to the manor',
      ]
    },
  ];

  const handleDownload = async (download: DownloadOption) => {
    setIsDownloading(download.platform);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      if (download.platform === 'Web App' || download.platform === 'iOS') {
        window.open(download.downloadUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = download.downloadUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading(null);
      setDownloadProgress(0);
    }, 2000);
  };

  const features = [
    { icon: <Heart className="w-5 h-5" />, title: 'Apothecary', desc: 'Health tracking elixirs' },
    { icon: <Brain className="w-5 h-5" />, title: 'Séance Chamber', desc: 'AI spirit companions' },
    { icon: <Wallet className="w-5 h-5" />, title: 'Treasury Vault', desc: 'Gold management' },
    { icon: <Shield className="w-5 h-5" />, title: 'Guardian Ward', desc: 'Privacy protection' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Gothic Effects', desc: 'Particles & weather' },
    { icon: <Moon className="w-5 h-5" />, title: 'Story Mode', desc: 'Dynamic events' },
  ];

  const stats = [
    { value: '60+', label: 'EMULATORS', icon: '🎮' },
    { value: '100+', label: 'MEDIA', icon: '📺' },
    { value: '80+', label: 'APPS', icon: '📱' },
    { value: '10.4', label: 'VERSION', icon: '✨' },
  ];

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 20;

  return (
    <div className={`min-h-screen ${isNight ? 'bg-gradient-to-b from-gray-950 via-purple-950/20 to-black' : 'bg-gradient-to-b from-stone-950 via-amber-950/10 to-black'} relative overflow-hidden text-amber-100`}>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dust particles */}
        {[...Array(40)].map((_, i) => (
          <DustParticle key={i} delay={i * 0.5} x={Math.random() * 100} size={Math.random() * 3 + 1} />
        ))}

        {/* Glowing orbs - like candle light */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Victorian wallpaper pattern */}
        <div className="absolute inset-0 bg-damask opacity-[0.02]" />

        {/* Window light beams */}
        <div className="absolute top-0 left-1/3 w-40 h-full bg-gradient-to-b from-amber-400/3 via-transparent to-transparent transform -skew-x-12" />
        <div className="absolute top-0 right-1/3 w-40 h-full bg-gradient-to-b from-amber-400/3 via-transparent to-transparent transform skew-x-12" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-vignette" />
      </div>

      {/* Top Manor Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black/90 via-amber-950/20 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Manor crest */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-800 to-amber-950 border-2 border-amber-600/50 flex items-center justify-center shadow-lg shadow-amber-900/50">
                  <span className="text-xl">🏚️</span>
                </div>
                <div className="absolute -left-0.5 top-0.5">
                  <CandleFlame size="sm" />
                </div>
                <div className="absolute -right-0.5 top-0.5">
                  <CandleFlame size="sm" />
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-amber-400 tracking-wide font-serif">KOL'S MANOR</div>
                <div className="text-[10px] text-amber-600/60 italic">Acquisition Chamber</div>
              </div>
            </div>

            {/* Download progress indicator */}
            {isDownloading && (
              <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-lg border border-amber-800/30">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-amber-400 text-sm font-serif">{downloadProgress}%</span>
                <div className="w-24 h-2 bg-black/60 rounded-full border border-amber-800/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Time display */}
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded border border-amber-800/30">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-mono text-amber-400">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* Chandelier decoration */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex items-end gap-2">
                <CandleFlame size="md" />
                <CandleFlame size="lg" />
                <div className="w-20 h-10 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-b-full border-t-2 border-amber-600/50" />
                <CandleFlame size="lg" />
                <CandleFlame size="md" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-amber-600/40" />
            </div>
          </div>

          {/* Title */}
          <OrnateFrame className="inline-block p-6 bg-black/30 rounded-xl border border-amber-800/20 backdrop-blur-sm">
            <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tight">
              <span className="bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent drop-shadow-2xl">
                ACQUISITION
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/50" />
              <span className="text-amber-500/60 text-xs tracking-[0.2em] font-serif uppercase">Chamber of Artifacts</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
          </OrnateFrame>

          <p className="text-amber-400/50 mt-6 max-w-lg mx-auto text-sm italic font-serif">
            "Choose your vessel and carry the manor's power with you across all realms..."
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-4 mt-8 mb-8">
            {stats.map((stat, idx) => (
              <AntiqueStat key={idx} {...stat} />
            ))}
          </div>

          {/* Platform detected */}
          {selectedPlatform && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded-lg text-amber-400 text-sm">
              <Eye className="w-4 h-4" />
              <span className="font-serif italic">Detected portal: <strong>{selectedPlatform}</strong></span>
            </div>
          )}
        </div>

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {downloads.map((download) => (
            <DollhouseDownloadCard
              key={download.platform}
              download={download}
              isRecommended={selectedPlatform === download.platform}
              onDownload={() => handleDownload(download)}
              isLoading={isDownloading === download.platform}
            />
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700/30" />
            <h2 className="text-xs font-medium text-amber-500/70 uppercase tracking-widest font-serif">Included Enchantments</h2>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700/30" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <FeatureCabinet key={idx} {...feature} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative mb-16">
          <OrnateFrame className="bg-gradient-to-b from-amber-950/30 to-black/50 border border-amber-800/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            {/* Candles on corners */}
            <div className="absolute top-4 left-4">
              <CandleFlame size="md" />
            </div>
            <div className="absolute top-4 right-4">
              <CandleFlame size="md" />
            </div>

            <h2 className="text-2xl font-black text-amber-200 mb-3 font-serif">Ready to Enter?</h2>
            <p className="text-amber-500/60 mb-6 max-w-md mx-auto text-sm italic">
              Choose your artifact and begin your journey through Kol's Manor.
            </p>

            <div className="flex justify-center gap-4">
              <a
                href="https://kolshub.net/download/KolHub-v9.1.0.apk"
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/40 to-amber-800/40 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-amber-900/80 to-amber-950/80 rounded-lg border-2 border-amber-700/50 group-hover:border-amber-600/70 transition-all shadow-lg shadow-black/50">
                  <Download className="w-5 h-5 text-amber-400" />
                  <span className="font-black text-amber-200 font-serif">ACQUIRE NOW</span>
                </div>
              </a>

              <a
                href="https://kolshub.net"
                className="flex items-center gap-2 px-6 py-3 bg-black/40 rounded-lg border border-amber-800/30 hover:border-amber-700/50 transition-colors"
              >
                <Globe className="w-5 h-5 text-amber-500/60" />
                <span className="text-amber-400/80 font-serif font-medium">Web Portal</span>
              </a>
            </div>
          </OrnateFrame>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-amber-900/20">
          <div className="flex justify-center gap-3 mb-4">
            {['🏚️', '🕯️', '🗝️', '📜', '🦇', '⚰️'].map((emoji, i) => (
              <span key={i} className="text-lg opacity-40">{emoji}</span>
            ))}
          </div>
          <p className="text-amber-700/40 text-xs font-serif italic">
            Kol's Manor v9.0 • Gothic Bratz Dollhouse • Est. 2025
          </p>
        </footer>
      </div>

      {/* CSS */}
      <style>{`
        @keyframes dustFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { transform: translate(8px, -12px); opacity: 0.4; }
          50% { transform: translate(-4px, -24px); opacity: 0.3; }
          75% { transform: translate(12px, -12px); opacity: 0.35; }
        }
        .animate-dustFloat {
          animation: dustFloat 10s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scaleY(1) scaleX(1); }
          25% { opacity: 0.9; transform: scaleY(1.1) scaleX(0.95); }
          50% { opacity: 1; transform: scaleY(0.95) scaleX(1.05); }
          75% { opacity: 0.85; transform: scaleY(1.05) scaleX(0.98); }
        }
        .animate-flicker {
          animation: flicker 0.5s ease-in-out infinite;
        }
        .bg-damask {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23d4a574' fill-opacity='0.1'/%3E%3C/svg%3E");
        }
        .bg-radial-vignette {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%);
        }
        .bg-wood-floor {
          background: repeating-linear-gradient(
            90deg,
            rgba(139, 69, 19, 0.3) 0px,
            rgba(139, 69, 19, 0.1) 2px,
            rgba(101, 67, 33, 0.2) 2px,
            rgba(101, 67, 33, 0.1) 20px
          );
        }
      `}</style>
    </div>
  );
};

export default ComprehensiveDownloads;

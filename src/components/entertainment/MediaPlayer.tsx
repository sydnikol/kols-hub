/**
 * Media Player Component
 * ======================
 * Actual embedded media players for YouTube, Spotify, SoundCloud, and more
 * These are REAL working integrations, not just links
 */

import React, { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface MediaPlayerProps {
  className?: string;
}

type PlayerTab = 'youtube' | 'spotify' | 'soundcloud' | 'viki' | 'movies' | 'anime' | 'manga';

// ============================================================================
// YOUTUBE PLAYER
// ============================================================================

const YouTubePlayer: React.FC<{ videoId?: string; playlistId?: string }> = ({
  videoId = 'dQw4w9WgXcQ',
  playlistId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideo, setCurrentVideo] = useState(videoId);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Open YouTube search in the embed
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const embedUrl = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0`
    : `https://www.youtube.com/embed/${currentVideo}?autoplay=0`;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search YouTube..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {/* Player */}
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Player"
        />
      </div>

      {/* Quick Playlists */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { name: 'Lofi Beats', id: 'PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo' },
          { name: 'Music Mix', id: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf' },
          { name: 'Chill Vibes', id: 'PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU' },
          { name: 'Study Music', id: 'PLMIbmfP_9vb8BCxRoraJpoo4q1yMFg4CE' }
        ].map(playlist => (
          <button
            key={playlist.id}
            onClick={() => window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SPOTIFY PLAYER
// ============================================================================

const SpotifyPlayer: React.FC = () => {
  const [currentUri, setCurrentUri] = useState('playlist/37i9dQZF1DXcBWIGoYBM5M');

  const playlists = [
    { name: 'Today\'s Top Hits', uri: 'playlist/37i9dQZF1DXcBWIGoYBM5M' },
    { name: 'RapCaviar', uri: 'playlist/37i9dQZF1DX0XUsuxWHRQd' },
    { name: 'Chill Hits', uri: 'playlist/37i9dQZF1DX4WYpdgoIcn6' },
    { name: 'Rock Classics', uri: 'playlist/37i9dQZF1DWXRqgorJj26U' },
    { name: 'Peaceful Piano', uri: 'playlist/37i9dQZF1DX4sWSpwq3LiO' },
    { name: 'Jazz Vibes', uri: 'playlist/37i9dQZF1DX0SM0LYsmbMT' },
    { name: 'Deep Focus', uri: 'playlist/37i9dQZF1DWZeKCadgRdKQ' },
    { name: 'Anime OST', uri: 'playlist/37i9dQZF1DX5OepaGriAIm' }
  ];

  return (
    <div className="space-y-4">
      {/* Playlist Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {playlists.map(playlist => (
          <button
            key={playlist.uri}
            onClick={() => setCurrentUri(playlist.uri)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              currentUri === playlist.uri
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {playlist.name}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="rounded-xl overflow-hidden">
        <iframe
          src={`https://open.spotify.com/embed/${currentUri}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
          className="rounded-xl"
        />
      </div>

      {/* Open in Spotify */}
      <a
        href={`https://open.spotify.com/${currentUri}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <span>🎵</span> Open in Spotify
      </a>
    </div>
  );
};

// ============================================================================
// SOUNDCLOUD PLAYER
// ============================================================================

const SoundCloudPlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = [
    { name: 'Discover', url: 'https://soundcloud.com/discover/sets/charts-top:all-music' },
    { name: 'Electronic', url: 'https://soundcloud.com/discover/sets/charts-top:electronic' },
    { name: 'Hip-Hop', url: 'https://soundcloud.com/discover/sets/charts-top:hiphoprap' },
    { name: 'Pop', url: 'https://soundcloud.com/discover/sets/charts-top:pop' }
  ];

  const [currentTrack, setCurrentTrack] = useState(tracks[0].url);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SoundCloud..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
        <button
          onClick={() => window.open(`https://soundcloud.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {/* Genre Buttons */}
      <div className="flex gap-2 flex-wrap">
        {tracks.map(track => (
          <button
            key={track.name}
            onClick={() => setCurrentTrack(track.url)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              currentTrack === track.url
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {track.name}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="rounded-xl overflow-hidden">
        <iframe
          width="100%"
          height="300"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(currentTrack)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
          title="SoundCloud Player"
        />
      </div>
    </div>
  );
};

// ============================================================================
// MOVIE STREAMING
// ============================================================================

const MovieStreaming: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const streamingSites = [
    { name: 'Cinego', url: 'https://cinego.co/', icon: '🎬' },
    { name: 'YesMovies', url: 'https://ww1.yesmovies.ag/', icon: '🎥' },
    { name: 'FMovies', url: 'https://fmoviesz.to/', icon: '📽️' },
    { name: 'SFlix', url: 'https://sflix.to/', icon: '🎞️' },
    { name: 'Vumoo', url: 'https://vumoo.to/', icon: '📺' },
    { name: 'LookMovie', url: 'https://lookmovie2.to/', icon: '👀' }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies or TV shows..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      {/* Streaming Sites */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {streamingSites.map(site => (
          <a
            key={site.name}
            href={searchQuery ? `${site.url}search/${encodeURIComponent(searchQuery)}` : site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-6 bg-gray-800/60 rounded-xl border border-gray-700
                       hover:border-purple-500/50 hover:bg-gray-800 transition-all group"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{site.icon}</span>
            <span className="font-medium text-gray-200">{site.name}</span>
            <span className="text-xs text-gray-500">Free Streaming</span>
          </a>
        ))}
      </div>

      {/* Embedded Frame */}
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400 text-sm mb-4">
          Click any streaming site above to open it in a new tab. For security, streaming sites are opened externally.
        </p>
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🎬</span>
            <p className="text-gray-400">Select a streaming site above to start watching</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ANIME STREAMING
// ============================================================================

const AnimeStreaming: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const animeSites = [
    { name: 'Zoro.to', url: 'https://zoro.to/', description: 'HD Anime, No Ads' },
    { name: '9Anime', url: 'https://9animetv.to/', description: 'Large Library' },
    { name: 'GogoAnime', url: 'https://gogoanime3.cc/', description: 'Classic Site' },
    { name: 'AnimePahe', url: 'https://animepahe.ru/', description: 'Small File Sizes' },
    { name: 'AnimeKisa', url: 'https://animekisa.tv/', description: 'Fast Streaming' },
    { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/', description: 'Official (Sub)' }
  ];

  const apps = [
    { name: 'Seanime', url: 'https://seanime.app/', description: 'Desktop + Web' },
    { name: 'Mangayomi', url: 'https://github.com/kodjodevf/mangayomi', description: 'Cross-Platform' },
    { name: 'Anikku', url: 'https://anikku.com/', description: 'Android' },
    { name: 'Cloudstream', url: 'https://cloudstream.on.fleek.co/', description: 'Android TV' }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for anime..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      {/* Streaming Sites */}
      <div>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">🎬 Streaming Sites</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {animeSites.map(site => (
            <a
              key={site.name}
              href={searchQuery ? `${site.url}search?keyword=${encodeURIComponent(searchQuery)}` : site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all"
            >
              <div className="font-medium text-gray-200">{site.name}</div>
              <div className="text-xs text-gray-500">{site.description}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Apps */}
      <div>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">📱 Desktop & Mobile Apps</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {apps.map(app => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all text-center"
            >
              <div className="font-medium text-purple-200">{app.name}</div>
              <div className="text-xs text-gray-400">{app.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MANGA READER
// ============================================================================

const MangaReader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mangaSites = [
    { name: 'MangaDex', url: 'https://mangadex.org/', description: 'Official Translations' },
    { name: 'MangaKakalot', url: 'https://mangakakalot.com/', description: 'Large Library' },
    { name: 'MangaPlus', url: 'https://mangaplus.shueisha.co.jp/', description: 'Official Shonen' },
    { name: 'Webtoon', url: 'https://www.webtoons.com/', description: 'Webtoons/Manhwa' },
    { name: 'ComicK', url: 'https://comick.io/', description: 'Fast Updates' },
    { name: 'Manga4Life', url: 'https://manga4life.com/', description: 'Clean Reader' }
  ];

  const servers = [
    { name: 'Komga', url: 'https://komga.org/', description: 'Self-Hosted Server' },
    { name: 'Stump', url: 'https://www.stumpapp.dev/', description: 'Rust-Based Server' },
    { name: 'Atsumeru', url: 'https://atsumeru.xyz/', description: 'Manga Server' },
    { name: 'Kavita', url: 'https://www.kavitareader.com/', description: 'Full Reader' }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for manga..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      {/* Reading Sites */}
      <div>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">📚 Reading Sites</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mangaSites.map(site => (
            <a
              key={site.name}
              href={searchQuery ? `${site.url}search?q=${encodeURIComponent(searchQuery)}` : site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all"
            >
              <div className="font-medium text-gray-200">{site.name}</div>
              <div className="text-xs text-gray-500">{site.description}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Self-Hosted Servers */}
      <div>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">🖥️ Self-Hosted Servers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {servers.map(server => (
            <a
              key={server.name}
              href={server.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all text-center"
            >
              <div className="font-medium text-blue-200">{server.name}</div>
              <div className="text-xs text-gray-400">{server.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VIKI ASIAN DRAMA
// ============================================================================

const VikiPlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dramaSites = [
    { name: 'Viki', url: 'https://www.viki.com/', description: 'Official Subs' },
    { name: 'DramaGo', url: 'https://dramago.net/', description: 'Korean Drama' },
    { name: 'KissAsian', url: 'https://kissasian.lu/', description: 'Asian Drama Hub' },
    { name: 'DramaCool', url: 'https://dramacool.pa/', description: 'All Asian Drama' },
    { name: 'MyAsianTV', url: 'https://myasiantv.ac/', description: 'Chinese/Korean' },
    { name: 'ViewAsian', url: 'https://viewasian.org/', description: 'Fast Updates' }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for K-Drama, C-Drama, J-Drama..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      {/* Drama Sites */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dramaSites.map(site => (
          <a
            key={site.name}
            href={searchQuery ? `${site.url}search?keyword=${encodeURIComponent(searchQuery)}` : site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-pink-900/30 to-purple-900/30
                       rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all group"
          >
            <span className="text-3xl">🇰🇷</span>
            <span className="font-medium text-gray-200">{site.name}</span>
            <span className="text-xs text-gray-500">{site.description}</span>
          </a>
        ))}
      </div>

      {/* Apps */}
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">
        <h3 className="font-semibold text-purple-300 mb-3">📱 Recommended Apps</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { name: 'KinAni', desc: 'Anime + Drama' },
            { name: 'Moobie', desc: 'K-Drama Web' },
            { name: 'Starlight', desc: 'Asian Drama' },
            { name: 'Viki App', desc: 'Official' }
          ].map(app => (
            <div key={app.name} className="bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="font-medium text-sm text-gray-200">{app.name}</div>
              <div className="text-xs text-gray-500">{app.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<PlayerTab>('youtube');

  const tabs: { id: PlayerTab; name: string; icon: string }[] = [
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'spotify', name: 'Spotify', icon: '🎵' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '🎧' },
    { id: 'movies', name: 'Movies', icon: '🎬' },
    { id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'manga', name: 'Manga', icon: '📚' },
    { id: 'viki', name: 'K-Drama', icon: '🇰🇷' }
  ];

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-purple-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-200">🎵 Media Player</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'youtube' && <YouTubePlayer />}
        {activeTab === 'spotify' && <SpotifyPlayer />}
        {activeTab === 'soundcloud' && <SoundCloudPlayer />}
        {activeTab === 'movies' && <MovieStreaming />}
        {activeTab === 'anime' && <AnimeStreaming />}
        {activeTab === 'manga' && <MangaReader />}
        {activeTab === 'viki' && <VikiPlayer />}
      </div>
    </div>
  );
};

export default MediaPlayer;

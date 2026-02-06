import React, { useState, useRef, useEffect } from 'react';

// Direct media content database - actual playable content
interface MediaContent {
  id: string;
  title: string;
  artist?: string;
  type: 'video' | 'audio' | 'image' | 'pdf' | 'ebook';
  source: string;
  embedUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  year?: number;
  genre?: string[];
  description?: string;
}

// Internet Archive Direct Media
const ARCHIVE_ORG_MEDIA: MediaContent[] = [
  // Public Domain Films
  {
    id: 'ia-nosferatu',
    title: 'Nosferatu (1922)',
    artist: 'F.W. Murnau',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/nosferatu_1922',
    thumbnailUrl: 'https://archive.org/services/img/nosferatu_1922',
    duration: '1h 34m',
    year: 1922,
    genre: ['horror', 'silent film', 'classic'],
    description: 'Classic German Expressionist vampire film'
  },
  {
    id: 'ia-metropolis',
    title: 'Metropolis (1927)',
    artist: 'Fritz Lang',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/Metropolis1927',
    thumbnailUrl: 'https://archive.org/services/img/Metropolis1927',
    duration: '2h 33m',
    year: 1927,
    genre: ['sci-fi', 'silent film', 'dystopia'],
    description: 'Groundbreaking sci-fi masterpiece about class struggle'
  },
  {
    id: 'ia-cabinet',
    title: 'The Cabinet of Dr. Caligari (1920)',
    artist: 'Robert Wiene',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/TheCabinetOfDrCaligari',
    thumbnailUrl: 'https://archive.org/services/img/TheCabinetOfDrCaligari',
    duration: '1h 17m',
    year: 1920,
    genre: ['horror', 'expressionism', 'silent film'],
    description: 'Pioneering German Expressionist horror film'
  },
  {
    id: 'ia-phantom-opera',
    title: 'Phantom of the Opera (1925)',
    artist: 'Rupert Julian',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/ThePhantomOfTheOpera1925',
    thumbnailUrl: 'https://archive.org/services/img/ThePhantomOfTheOpera1925',
    duration: '1h 33m',
    year: 1925,
    genre: ['horror', 'drama', 'silent film'],
    description: 'Lon Chaney stars as the disfigured musical genius'
  },
  {
    id: 'ia-night-living-dead',
    title: 'Night of the Living Dead (1968)',
    artist: 'George Romero',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/night_of_the_living_dead',
    thumbnailUrl: 'https://archive.org/services/img/night_of_the_living_dead',
    duration: '1h 36m',
    year: 1968,
    genre: ['horror', 'zombie', 'cult classic'],
    description: 'The film that started the zombie genre'
  },
  {
    id: 'ia-plan9',
    title: 'Plan 9 from Outer Space (1957)',
    artist: 'Ed Wood',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/Plan_9_from_Outer_Space_1959',
    thumbnailUrl: 'https://archive.org/services/img/Plan_9_from_Outer_Space_1959',
    duration: '1h 19m',
    year: 1957,
    genre: ['sci-fi', 'cult', 'b-movie'],
    description: 'Ed Wood\'s infamous so-bad-it\'s-good classic'
  },
  {
    id: 'ia-house-haunted',
    title: 'House on Haunted Hill (1959)',
    artist: 'William Castle',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/house_on_haunted_hill',
    thumbnailUrl: 'https://archive.org/services/img/house_on_haunted_hill',
    duration: '1h 15m',
    year: 1959,
    genre: ['horror', 'thriller', 'vincent price'],
    description: 'Vincent Price invites guests to a haunted party'
  },
  // Documentaries
  {
    id: 'ia-cosmos',
    title: 'Computer Chronicles',
    artist: 'Stewart Cheifet',
    type: 'video',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/computerchronicles',
    thumbnailUrl: 'https://archive.org/services/img/computerchronicles',
    duration: 'Series',
    year: 1983,
    genre: ['documentary', 'technology', 'history'],
    description: 'Classic tech documentary series from the 80s-90s'
  },
  // Audio - Classic Music
  {
    id: 'ia-grateful-dead',
    title: 'Grateful Dead Live Collection',
    artist: 'Grateful Dead',
    type: 'audio',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/gd1977-05-08.sbd.hicks.4982.sbeok.shnf',
    duration: 'Various',
    year: 1977,
    genre: ['rock', 'jam band', 'live'],
    description: 'Official Grateful Dead concert recordings'
  },
  {
    id: 'ia-old-time-radio',
    title: 'Old Time Radio Drama Collection',
    artist: 'Various',
    type: 'audio',
    source: 'Internet Archive',
    embedUrl: 'https://archive.org/embed/OTRR_Suspense_Singles',
    duration: 'Various',
    year: 1940,
    genre: ['drama', 'mystery', 'radio'],
    description: 'Classic radio drama including Suspense, The Shadow, etc.'
  }
];

// LibriVox Audiobooks
const LIBRIVOX_AUDIOBOOKS: MediaContent[] = [
  {
    id: 'lv-dracula',
    title: 'Dracula',
    artist: 'Bram Stoker (read by various)',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/dracula_bram_stoker',
    duration: '15h 28m',
    year: 1897,
    genre: ['gothic', 'horror', 'audiobook'],
    description: 'The classic vampire novel, free audiobook'
  },
  {
    id: 'lv-frankenstein',
    title: 'Frankenstein',
    artist: 'Mary Shelley (read by various)',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/frankenstein_shelley',
    duration: '8h 35m',
    year: 1818,
    genre: ['gothic', 'sci-fi', 'audiobook'],
    description: 'The original science fiction horror classic'
  },
  {
    id: 'lv-pride',
    title: 'Pride and Prejudice',
    artist: 'Jane Austen (read by Karen Savage)',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/pride_and_prejudice_0711_librivox',
    duration: '11h 35m',
    year: 1813,
    genre: ['romance', 'classic', 'audiobook'],
    description: 'Jane Austen\'s beloved romantic novel'
  },
  {
    id: 'lv-alice',
    title: 'Alice in Wonderland',
    artist: 'Lewis Carroll (read by various)',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/alices_adventures_wonderland_1002_librivox',
    duration: '2h 57m',
    year: 1865,
    genre: ['fantasy', 'children', 'audiobook'],
    description: 'Journey down the rabbit hole'
  },
  {
    id: 'lv-sherlock',
    title: 'Adventures of Sherlock Holmes',
    artist: 'Arthur Conan Doyle',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/adventures_of_sherlock_holmes_0711_librivox',
    duration: '11h 25m',
    year: 1892,
    genre: ['mystery', 'detective', 'audiobook'],
    description: 'Twelve classic Sherlock Holmes stories'
  },
  {
    id: 'lv-jane-eyre',
    title: 'Jane Eyre',
    artist: 'Charlotte Brontë',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/jane_eyre_1003_librivox',
    duration: '18h 48m',
    year: 1847,
    genre: ['gothic', 'romance', 'audiobook'],
    description: 'Gothic romance masterpiece'
  },
  {
    id: 'lv-war-worlds',
    title: 'The War of the Worlds',
    artist: 'H.G. Wells',
    type: 'audio',
    source: 'LibriVox',
    embedUrl: 'https://archive.org/embed/war_of_the_worlds_1002_librivox',
    duration: '6h 25m',
    year: 1898,
    genre: ['sci-fi', 'invasion', 'audiobook'],
    description: 'The Martian invasion classic'
  }
];

// YouTube Embeddable Educational Content
const EDUCATIONAL_VIDEOS: MediaContent[] = [
  {
    id: 'yt-crash-history',
    title: 'World History',
    artist: 'CrashCourse',
    type: 'video',
    source: 'CrashCourse',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLBDA2E52FB1EF80C9',
    duration: 'Series',
    genre: ['education', 'history'],
    description: 'Complete world history series'
  },
  {
    id: 'yt-crash-science',
    title: 'Biology',
    artist: 'CrashCourse',
    type: 'video',
    source: 'CrashCourse',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PL3EED4C1D684D3ADF',
    duration: 'Series',
    genre: ['education', 'science', 'biology'],
    description: 'Complete biology course'
  },
  {
    id: 'yt-crash-psych',
    title: 'Psychology',
    artist: 'CrashCourse',
    type: 'video',
    source: 'CrashCourse',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6',
    duration: 'Series',
    genre: ['education', 'psychology'],
    description: 'Introduction to psychology'
  },
  {
    id: 'yt-crash-lit',
    title: 'Literature',
    artist: 'CrashCourse',
    type: 'video',
    source: 'CrashCourse',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PL8dPuuaLjXtOeEc9ME62zTfqc0h6Pe8vb',
    duration: 'Series',
    genre: ['education', 'literature'],
    description: 'English literature course'
  },
  {
    id: 'yt-3b1b-linear',
    title: 'Essence of Linear Algebra',
    artist: '3Blue1Brown',
    type: 'video',
    source: '3Blue1Brown',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
    duration: 'Series',
    genre: ['education', 'math', 'linear algebra'],
    description: 'Visual introduction to linear algebra'
  },
  {
    id: 'yt-3b1b-calculus',
    title: 'Essence of Calculus',
    artist: '3Blue1Brown',
    type: 'video',
    source: '3Blue1Brown',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
    duration: 'Series',
    genre: ['education', 'math', 'calculus'],
    description: 'Beautiful visual calculus explanation'
  }
];

// All media combined
const ALL_MEDIA = [
  ...ARCHIVE_ORG_MEDIA,
  ...LIBRIVOX_AUDIOBOOKS,
  ...EDUCATIONAL_VIDEOS
];

const MEDIA_CATEGORIES = [
  { id: 'all', name: 'All Media', icon: '🎬' },
  { id: 'video', name: 'Films & Video', icon: '🎥' },
  { id: 'audio', name: 'Audio & Music', icon: '🎵' },
  { id: 'audiobook', name: 'Audiobooks', icon: '📖' },
  { id: 'education', name: 'Educational', icon: '📚' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'classic', name: 'Classics', icon: '🎭' }
];

const UniversalMediaPlayer: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyPlayedMedia');
    if (saved) setRecentlyPlayed(JSON.parse(saved));
  }, []);

  const playMedia = (media: MediaContent) => {
    setSelectedMedia(media);
    const updated = [media.id, ...recentlyPlayed.filter(id => id !== media.id)].slice(0, 10);
    setRecentlyPlayed(updated);
    localStorage.setItem('recentlyPlayedMedia', JSON.stringify(updated));
  };

  const filteredMedia = ALL_MEDIA.filter(media => {
    const matchesCategory = selectedCategory === 'all' ||
      media.type === selectedCategory ||
      media.genre?.some(g => g.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch = !searchQuery ||
      media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.genre?.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const recentMedia = recentlyPlayed
    .map(id => ALL_MEDIA.find(m => m.id === id))
    .filter(Boolean) as MediaContent[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-6">
      {/* Now Playing Modal */}
      {selectedMedia && (
        <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isFullscreen ? '' : 'p-4'}`}>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-500/30">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selectedMedia.type === 'video' ? '🎬' : '🎵'}</span>
              <div>
                <h2 className="text-white font-bold text-lg">{selectedMedia.title}</h2>
                {selectedMedia.artist && (
                  <p className="text-indigo-300 text-sm">{selectedMedia.artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                {isFullscreen ? '⬜ Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
              <button
                onClick={() => setSelectedMedia(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div ref={playerRef} className="flex-1 flex items-center justify-center bg-black">
            <iframe
              src={selectedMedia.embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              title={selectedMedia.title}
            />
          </div>

          {!isFullscreen && (
            <div className="p-4 bg-gray-900/90 border-t border-indigo-500/30">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-400">Source: {selectedMedia.source}</span>
                {selectedMedia.duration && (
                  <span className="text-sm px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">
                    {selectedMedia.duration}
                  </span>
                )}
                {selectedMedia.year && (
                  <span className="text-sm px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                    {selectedMedia.year}
                  </span>
                )}
                {selectedMedia.genre?.map((g, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                    {g}
                  </span>
                ))}
              </div>
              {selectedMedia.description && (
                <p className="text-gray-400 text-sm mt-2">{selectedMedia.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">📺</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Universal Media Player</h1>
              <p className="text-indigo-300">Free films, audiobooks, music & educational content</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="px-4 py-2 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
              <div className="text-xl font-bold text-indigo-300">{ALL_MEDIA.length}</div>
              <div className="text-xs text-gray-400">Media Items</div>
            </div>
            <div className="px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/20">
              <div className="text-xl font-bold text-purple-300">100%</div>
              <div className="text-xs text-gray-400">Free & Legal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search films, audiobooks, music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-900/80 border border-indigo-500/30 rounded-xl text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
          {MEDIA_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      {recentMedia.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⏱️</span> Recently Played
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentMedia.slice(0, 5).map(media => (
              <button
                key={media.id}
                onClick={() => playMedia(media)}
                className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-gray-900 to-indigo-900/50 rounded-xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all text-left"
              >
                <div className="text-3xl mb-2">{media.type === 'video' ? '🎬' : '🎵'}</div>
                <h4 className="text-white font-medium text-sm line-clamp-1">{media.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-1">{media.artist}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCategory === 'all' ? 'All Media' : MEDIA_CATEGORIES.find(c => c.id === selectedCategory)?.name}
          <span className="text-sm text-gray-400 ml-2">({filteredMedia.length} items)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map(media => (
            <div
              key={media.id}
              className="bg-gradient-to-br from-gray-900 to-indigo-900/30 rounded-xl border border-indigo-500/20 overflow-hidden hover:border-indigo-400/40 transition-all group cursor-pointer"
              onClick={() => playMedia(media)}
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative overflow-hidden">
                {media.thumbnailUrl ? (
                  <img
                    src={media.thumbnailUrl}
                    alt={media.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-6xl opacity-50">
                    {media.type === 'video' ? '🎬' : media.type === 'audio' ? '🎵' : '📖'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="text-5xl">▶️</span>
                </div>
                {media.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                    {media.duration}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  {media.title}
                </h3>
                {media.artist && (
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{media.artist}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">
                    {media.source}
                  </span>
                  {media.year && (
                    <span className="text-xs text-gray-500">{media.year}</span>
                  )}
                </div>
                {media.description && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{media.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl mb-4 block">📭</span>
            <p>No media found matching your search.</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
        <p className="text-green-200 text-sm text-center">
          ✅ All content is free, legal, and in the public domain or Creative Commons licensed.
          Sources include Internet Archive, LibriVox, and educational channels.
        </p>
      </div>
    </div>
  );
};

export default UniversalMediaPlayer;

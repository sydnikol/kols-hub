import React, { useState, useEffect, useMemo } from 'react';

// Color Scheme
const COLORS = {
  primary: '#FF1493',
  secondary: '#9B30FF',
  bg: '#0a0010',
  accent: '#E0A0FF',
  mint: '#00FFB3',
  text: '#F5E6FF',
  glass: 'rgba(155,48,255,0.15)',
  darkGlass: 'rgba(155,48,255,0.25)',
};

// Types
interface MediaItem {
  id: number;
  title: string;
  posterUrl?: string;
  rating: number;
  overview: string;
  releaseDate: string;
  genre: string[];
  mediaType: 'movie' | 'tv';
  streamingLinks?: StreamingLink[];
}

interface StreamingLink {
  platform: string;
  url: string;
  free: boolean;
}

interface WatchlistItem extends MediaItem {
  addedDate: string;
  watched: boolean;
}

interface HistoryItem extends MediaItem {
  watchedDate: string;
  duration?: number;
}

// Demo Data
const DEMO_MOVIES: MediaItem[] = [
  {
    id: 1,
    title: 'The Midnight Garden',
    posterUrl: 'https://via.placeholder.com/300x450?text=Midnight+Garden',
    rating: 8.5,
    overview: 'A gothic tale of a mysterious garden that comes alive at night, filled with enchanted flowers and dark secrets.',
    releaseDate: '2024-10-31',
    genre: ['Horror', 'Drama'],
    mediaType: 'movie',
    streamingLinks: [
      { platform: 'Tubi', url: '#', free: true },
      { platform: 'Pluto TV', url: '#', free: true },
    ],
  },
  {
    id: 2,
    title: 'Velvet Shadows',
    posterUrl: 'https://via.placeholder.com/300x450?text=Velvet+Shadows',
    rating: 7.8,
    overview: 'A stylish mystery about a fashion designer who uncovers dark secrets behind the glamorous world of haute couture.',
    releaseDate: '2024-09-15',
    genre: ['Thriller', 'Drama'],
    mediaType: 'movie',
    streamingLinks: [
      { platform: 'Peacock Free', url: '#', free: true },
    ],
  },
  {
    id: 3,
    title: 'Neon Witches',
    posterUrl: 'https://via.placeholder.com/300x450?text=Neon+Witches',
    rating: 8.2,
    overview: 'Modern witches navigate supernatural threats in a neon-lit city where magic meets technology.',
    releaseDate: '2024-08-22',
    genre: ['Horror', 'Comedy', 'Sci-Fi'],
    mediaType: 'movie',
    streamingLinks: [
      { platform: 'Tubi', url: '#', free: true },
      { platform: 'Crackle', url: '#', free: true },
    ],
  },
  {
    id: 4,
    title: 'Crimson Masquerade',
    posterUrl: 'https://via.placeholder.com/300x450?text=Crimson+Masquerade',
    rating: 7.9,
    overview: 'A masked ball harbors deadly intentions as guests reveal their true identities and dark pasts.',
    releaseDate: '2024-07-10',
    genre: ['Thriller', 'Drama'],
    mediaType: 'movie',
  },
  {
    id: 5,
    title: 'Ethereal Nights',
    posterUrl: 'https://via.placeholder.com/300x450?text=Ethereal+Nights',
    rating: 8.4,
    overview: 'A supernatural love story where a ghostly figure haunts the halls of an abandoned mansion.',
    releaseDate: '2024-06-05',
    genre: ['Horror', 'Romance'],
    mediaType: 'movie',
    streamingLinks: [
      { platform: 'YouTube', url: '#', free: true },
    ],
  },
  {
    id: 6,
    title: 'Dark Academia',
    posterUrl: 'https://via.placeholder.com/300x450?text=Dark+Academia',
    rating: 8.1,
    overview: 'Elite students at a mysterious academy discover they are the chosen ones in an ancient supernatural conflict.',
    releaseDate: '2024-05-20',
    genre: ['Drama', 'Sci-Fi'],
    mediaType: 'movie',
  },
];

const DEMO_SHOWS: MediaItem[] = [
  {
    id: 101,
    title: 'The Midnight Chronicles',
    posterUrl: 'https://via.placeholder.com/300x450?text=Midnight+Chronicles',
    rating: 8.7,
    overview: 'A gothic series following a group of teens as they uncover the supernatural secrets hidden in their town.',
    releaseDate: '2024-01-15',
    genre: ['Horror', 'Drama'],
    mediaType: 'tv',
    streamingLinks: [
      { platform: 'Tubi', url: '#', free: true },
      { platform: 'Pluto TV', url: '#', free: true },
    ],
  },
  {
    id: 102,
    title: 'Velvet Underworld',
    posterUrl: 'https://via.placeholder.com/300x450?text=Velvet+Underworld',
    rating: 8.3,
    overview: 'A stylish series about underground fashion designers creating rebellion through haute couture.',
    releaseDate: '2023-11-10',
    genre: ['Drama', 'Comedy'],
    mediaType: 'tv',
    streamingLinks: [
      { platform: 'Peacock Free', url: '#', free: true },
    ],
  },
  {
    id: 103,
    title: 'Neon Sorcery',
    posterUrl: 'https://via.placeholder.com/300x450?text=Neon+Sorcery',
    rating: 8.5,
    overview: 'Modern witches battle supernatural threats in a city where magic and technology collide.',
    releaseDate: '2023-09-20',
    genre: ['Sci-Fi', 'Horror', 'Animation'],
    mediaType: 'tv',
    streamingLinks: [
      { platform: 'Tubi', url: '#', free: true },
      { platform: 'Crackle', url: '#', free: true },
    ],
  },
  {
    id: 104,
    title: 'Crimson Society',
    posterUrl: 'https://via.placeholder.com/300x450?text=Crimson+Society',
    rating: 8.2,
    overview: 'An exclusive club where members hide their darkest secrets and deadliest ambitions.',
    releaseDate: '2023-08-05',
    genre: ['Thriller', 'Drama'],
    mediaType: 'tv',
  },
  {
    id: 105,
    title: 'Ethereal Tales',
    posterUrl: 'https://via.placeholder.com/300x450?text=Ethereal+Tales',
    rating: 8.6,
    overview: 'A gothic anthology series exploring haunting stories from abandoned locations around the world.',
    releaseDate: '2023-07-15',
    genre: ['Horror', 'Documentary'],
    mediaType: 'tv',
    streamingLinks: [
      { platform: 'YouTube', url: '#', free: true },
    ],
  },
];

const STREAMING_PLATFORMS = [
  { name: 'Tubi', color: '#FF1493', icon: '▶️' },
  { name: 'Pluto TV', color: '#9B30FF', icon: '📺' },
  { name: 'Plex', color: '#E0A0FF', icon: '▶️' },
  { name: 'Crackle', color: '#00FFB3', icon: '⚡' },
  { name: 'Peacock Free', color: '#0066CC', icon: '🦚' },
  { name: 'YouTube', color: '#FF0000', icon: '📹' },
];

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Documentary'];

// Main Component
const DollhouseMediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'streaming' | 'downloads'>('movies');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dollhouse_watchlist') || '[]');
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dollhouse_history') || '[]');
    } catch {
      return [];
    }
  });
  const [offlineContent, setOfflineContent] = useState<MediaItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dollhouse_offline') || '[]');
    } catch {
      return [];
    }
  });

  // Persist watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('dollhouse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('dollhouse_history', JSON.stringify(history));
  }, [history]);

  // Persist offline content to localStorage
  useEffect(() => {
    localStorage.setItem('dollhouse_offline', JSON.stringify(offlineContent));
  }, [offlineContent]);

  // Get current media based on tab
  const currentMedia = useMemo(() => {
    if (activeTab === 'downloads') return offlineContent;
    return activeTab === 'tv' ? DEMO_SHOWS : DEMO_MOVIES;
  }, [activeTab, offlineContent]);

  // Filter media based on search and genres
  const filteredMedia = useMemo(() => {
    return currentMedia.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.overview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenres = selectedGenres.length === 0 || item.genre.some((g) => selectedGenres.includes(g));
      return matchesSearch && matchesGenres;
    });
  }, [currentMedia, searchQuery, selectedGenres]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleWatchlist = (item: MediaItem) => {
    const exists = watchlist.some((w) => w.id === item.id && w.mediaType === item.mediaType);
    if (exists) {
      setWatchlist((prev) =>
        prev.filter((w) => !(w.id === item.id && w.mediaType === item.mediaType))
      );
    } else {
      setWatchlist((prev) => [
        ...prev,
        {
          ...item,
          addedDate: new Date().toISOString(),
          watched: false,
        } as WatchlistItem,
      ]);
    }
  };

  const addToHistory = (item: MediaItem) => {
    const newHistoryItem: HistoryItem = {
      ...item,
      watchedDate: new Date().toISOString(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.id === item.id && h.mediaType === item.mediaType));
      return [newHistoryItem, ...filtered].slice(0, 20);
    });
  };

  const toggleOfflineContent = (item: MediaItem) => {
    const exists = offlineContent.some((o) => o.id === item.id && o.mediaType === item.mediaType);
    if (exists) {
      setOfflineContent((prev) =>
        prev.filter((o) => !(o.id === item.id && o.mediaType === item.mediaType))
      );
    } else {
      setOfflineContent((prev) => [...prev, item]);
    }
  };

  const isInWatchlist = (item: MediaItem) =>
    watchlist.some((w) => w.id === item.id && w.mediaType === item.mediaType);

  const isInOffline = (item: MediaItem) =>
    offlineContent.some((o) => o.id === item.id && o.mediaType === item.mediaType);

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
    setShowDetailsModal(true);
    addToHistory(item);
  };

  const getTrendingMedia = () => {
    return (activeTab === 'tv' ? DEMO_SHOWS : DEMO_MOVIES)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1a0025 50%, #0a0010 100%)`,
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: COLORS.text,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '30px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.mint})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: `0 0 30px rgba(255, 20, 147, 0.5)`,
    marginBottom: '10px',
    letterSpacing: '2px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: COLORS.accent,
    opacity: 0.8,
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  };

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    border: `2px solid ${active ? COLORS.primary : COLORS.accent}`,
    backgroundColor: active ? COLORS.glass : 'rgba(0,0,0,0.3)',
    color: active ? COLORS.primary : COLORS.accent,
    cursor: 'pointer',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
    boxShadow: active ? `0 0 20px rgba(255, 20, 147, 0.4)` : 'none',
  });

  const searchBoxStyle: React.CSSProperties = {
    marginBottom: '25px',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: '1',
    minWidth: '250px',
    padding: '12px 16px',
    background: COLORS.glass,
    border: `2px solid ${COLORS.accent}`,
    borderRadius: '15px',
    color: COLORS.text,
    fontSize: '14px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const genreButtonStyle = (selected: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    background: selected ? COLORS.glass : 'rgba(0,0,0,0.4)',
    border: `2px solid ${selected ? COLORS.mint : COLORS.accent}`,
    color: selected ? COLORS.mint : COLORS.accent,
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: selected ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
  });

  const mediaGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  };

  const mediaCardStyle: React.CSSProperties = {
    background: COLORS.glass,
    backdropFilter: 'blur(20px)',
    border: `2px solid ${COLORS.accent}`,
    borderRadius: '15px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const posterStyle: React.CSSProperties = {
    width: '100%',
    height: '250px',
    background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.primary})`,
    borderRadius: '10px',
    marginBottom: '10px',
    objectFit: 'cover',
    border: `2px solid ${COLORS.accent}`,
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const ratingStyle: React.CSSProperties = {
    fontSize: '12px',
    color: COLORS.mint,
    marginBottom: '5px',
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  };

  const actionButtonStyle = (primary: boolean = false): React.CSSProperties => ({
    flex: 1,
    padding: '8px',
    background: primary ? COLORS.glass : 'rgba(0,0,0,0.5)',
    border: `2px solid ${primary ? COLORS.primary : COLORS.accent}`,
    color: primary ? COLORS.primary : COLORS.accent,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
  });

  const modalBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, rgba(10, 0, 16, 0.95), rgba(26, 0, 37, 0.95))`,
    border: `3px solid ${COLORS.primary}`,
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: `0 0 40px rgba(255, 20, 147, 0.6)`,
    backdropFilter: 'blur(20px)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '20px',
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  };

  const closeButtonStyle: React.CSSProperties = {
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.accent,
    background: 'none',
    border: 'none',
    padding: '0',
  };

  const modalPosterStyle: React.CSSProperties = {
    width: '200px',
    height: '300px',
    background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.primary})`,
    borderRadius: '15px',
    marginBottom: '20px',
    border: `3px solid ${COLORS.accent}`,
    objectFit: 'cover',
  };

  const detailsStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const detailLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: COLORS.mint,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '5px',
  };

  const detailValueStyle: React.CSSProperties = {
    fontSize: '14px',
    color: COLORS.text,
    marginBottom: '12px',
  };

  const streamingLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  };

  const streamingLinkStyle: React.CSSProperties = {
    padding: '10px 15px',
    background: COLORS.glass,
    border: `2px solid ${COLORS.mint}`,
    borderRadius: '10px',
    color: COLORS.mint,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
  };

  const genreChipsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '15px',
  };

  const genreChipStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: COLORS.glass,
    border: `2px solid ${COLORS.accent}`,
    borderRadius: '8px',
    color: COLORS.accent,
    fontSize: '12px',
    fontWeight: 'bold',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: COLORS.accent,
  };

  const emptyStateIconStyle: React.CSSProperties = {
    fontSize: '64px',
    marginBottom: '20px',
  };

  const emptyStateTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '10px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '20px',
    marginTop: '30px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${COLORS.accent}`,
  };

  const historyItemStyle: React.CSSProperties = {
    background: COLORS.glass,
    backdropFilter: 'blur(20px)',
    border: `2px solid ${COLORS.accent}`,
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>✨ Kol's Media Hub ✨</div>
        <div style={subtitleStyle}>Your Gothic Entertainment Dimension</div>
      </div>

      {/* Tabs */}
      <div style={tabsContainerStyle}>
        <button
          style={tabButtonStyle(activeTab === 'movies')}
          onClick={() => {
            setActiveTab('movies');
            setSelectedGenres([]);
            setSearchQuery('');
          }}
        >
          🎬 Movie Theater
        </button>
        <button
          style={tabButtonStyle(activeTab === 'tv')}
          onClick={() => {
            setActiveTab('tv');
            setSelectedGenres([]);
            setSearchQuery('');
          }}
        >
          📺 TV Show Lounge
        </button>
        <button
          style={tabButtonStyle(activeTab === 'streaming')}
          onClick={() => {
            setActiveTab('streaming');
            setSelectedGenres([]);
            setSearchQuery('');
          }}
        >
          🌐 Streaming Hub
        </button>
        <button
          style={tabButtonStyle(activeTab === 'downloads')}
          onClick={() => {
            setActiveTab('downloads');
            setSelectedGenres([]);
            setSearchQuery('');
          }}
        >
          💾 Downloads & Offline
        </button>
      </div>

      {/* Search and Filters */}
      {activeTab !== 'streaming' && activeTab !== 'downloads' && (
        <div>
          <div style={searchBoxStyle}>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'tv' ? 'shows' : 'movies'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.border = `2px solid ${COLORS.primary}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = `2px solid ${COLORS.accent}`;
              }}
            />
          </div>

          {/* Genre Filters */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '12px', color: COLORS.mint, fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
              Filter by Genre
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  style={genreButtonStyle(selectedGenres.includes(genre))}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Movie Theater Tab */}
      {activeTab === 'movies' && (
        <div>
          <div style={sectionTitleStyle}>🎭 Latest Releases</div>
          {filteredMedia.length > 0 ? (
            <div style={mediaGridStyle}>
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  style={mediaCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(255, 20, 147, 0.4)`;
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = COLORS.accent;
                  }}
                >
                  <div
                    style={posterStyle}
                    onClick={() => handleMediaClick(media)}
                  >
                    {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                  </div>
                  <div style={cardTitleStyle}>{media.title}</div>
                  <div style={ratingStyle}>⭐ {media.rating.toFixed(1)}</div>
                  <div style={actionButtonsStyle}>
                    <button
                      style={actionButtonStyle(!isInWatchlist(media))}
                      onClick={() => toggleWatchlist(media)}
                    >
                      {isInWatchlist(media) ? '✓ Saved' : '+ Watchlist'}
                    </button>
                    <button
                      style={actionButtonStyle(isInOffline(media))}
                      onClick={() => toggleOfflineContent(media)}
                    >
                      {isInOffline(media) ? '✓ Offline' : 'Offline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyStateIconStyle}>🎬</div>
              <div style={emptyStateTitleStyle}>No Movies Found</div>
              <div>Try adjusting your search or genre filters</div>
            </div>
          )}

          {/* Trending Section */}
          <div style={sectionTitleStyle}>🔥 Trending Now</div>
          <div style={mediaGridStyle}>
            {getTrendingMedia().map((media) => (
              <div
                key={`trend-${media.id}`}
                style={mediaCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px rgba(255, 20, 147, 0.4)`;
                  e.currentTarget.style.borderColor = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = COLORS.accent;
                }}
              >
                <div
                  style={posterStyle}
                  onClick={() => handleMediaClick(media)}
                >
                  {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                </div>
                <div style={cardTitleStyle}>{media.title}</div>
                <div style={ratingStyle}>⭐ {media.rating.toFixed(1)}</div>
                <div style={actionButtonsStyle}>
                  <button
                    style={actionButtonStyle(!isInWatchlist(media))}
                    onClick={() => toggleWatchlist(media)}
                  >
                    {isInWatchlist(media) ? '✓ Saved' : '+ Watchlist'}
                  </button>
                  <button
                    style={actionButtonStyle(isInOffline(media))}
                    onClick={() => toggleOfflineContent(media)}
                  >
                    {isInOffline(media) ? '✓ Offline' : 'Offline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TV Show Lounge Tab */}
      {activeTab === 'tv' && (
        <div>
          <div style={sectionTitleStyle}>📺 Current Series</div>
          {filteredMedia.length > 0 ? (
            <div style={mediaGridStyle}>
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  style={mediaCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(155, 48, 255, 0.4)`;
                    e.currentTarget.style.borderColor = COLORS.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = COLORS.accent;
                  }}
                >
                  <div
                    style={posterStyle}
                    onClick={() => handleMediaClick(media)}
                  >
                    {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                  </div>
                  <div style={cardTitleStyle}>{media.title}</div>
                  <div style={ratingStyle}>⭐ {media.rating.toFixed(1)}</div>
                  <div style={actionButtonsStyle}>
                    <button
                      style={actionButtonStyle(!isInWatchlist(media))}
                      onClick={() => toggleWatchlist(media)}
                    >
                      {isInWatchlist(media) ? '✓ Saved' : '+ Watchlist'}
                    </button>
                    <button
                      style={actionButtonStyle(isInOffline(media))}
                      onClick={() => toggleOfflineContent(media)}
                    >
                      {isInOffline(media) ? '✓ Offline' : 'Offline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyStateIconStyle}>📺</div>
              <div style={emptyStateTitleStyle}>No Shows Found</div>
              <div>Try adjusting your search or genre filters</div>
            </div>
          )}

          {/* Trending Section */}
          <div style={sectionTitleStyle}>🔥 Trending Series</div>
          <div style={mediaGridStyle}>
            {getTrendingMedia().map((media) => (
              <div
                key={`trend-${media.id}`}
                style={mediaCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px rgba(155, 48, 255, 0.4)`;
                  e.currentTarget.style.borderColor = COLORS.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = COLORS.accent;
                }}
              >
                <div
                  style={posterStyle}
                  onClick={() => handleMediaClick(media)}
                >
                  {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                </div>
                <div style={cardTitleStyle}>{media.title}</div>
                <div style={ratingStyle}>⭐ {media.rating.toFixed(1)}</div>
                <div style={actionButtonsStyle}>
                  <button
                    style={actionButtonStyle(!isInWatchlist(media))}
                    onClick={() => toggleWatchlist(media)}
                  >
                    {isInWatchlist(media) ? '✓ Saved' : '+ Watchlist'}
                  </button>
                  <button
                    style={actionButtonStyle(isInOffline(media))}
                    onClick={() => toggleOfflineContent(media)}
                  >
                    {isInOffline(media) ? '✓ Offline' : 'Offline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streaming Hub Tab */}
      {activeTab === 'streaming' && (
        <div>
          <div style={sectionTitleStyle}>🌐 Free Streaming Platforms</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '40px' }}>
            {STREAMING_PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                style={{
                  ...mediaCardStyle,
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = platform.color;
                  e.currentTarget.style.boxShadow = `0 0 20px ${platform.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = COLORS.accent;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => window.open('#', '_blank')}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{platform.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: platform.color }}>
                  {platform.name}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.mint, marginTop: '8px' }}>
                  ✓ Free Streaming
                </div>
              </div>
            ))}
          </div>

          {/* Platform Details */}
          <div style={sectionTitleStyle}>📋 Platform Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>▶️ Tubi</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                Thousands of free movies and TV shows with ads. Great for discovering independent and cult films.
              </div>
            </div>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📺 Pluto TV</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                Live TV channels and on-demand content. Perfect for horror marathons and gothic programming.
              </div>
            </div>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>▶️ Plex</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                Free streaming with a growing library. Create your own watch parties and share content.
              </div>
            </div>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚡ Crackle</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                Sony's free streaming service with movies and original series. Quality content with minimal ads.
              </div>
            </div>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🦚 Peacock Free</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                NBC's streaming service with free tier offering TV shows, movies, and live sports.
              </div>
            </div>
            <div style={{ ...mediaCardStyle, padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📹 YouTube</div>
              <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>
                Full movies, trailers, and documentaries. Search for free gothic content and horror channels.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Downloads & Offline Tab */}
      {activeTab === 'downloads' && (
        <div>
          <div style={sectionTitleStyle}>
            💾 Saved for Offline ({offlineContent.length})
          </div>
          {offlineContent.length > 0 ? (
            <div>
              <div style={mediaGridStyle}>
                {offlineContent.map((media) => (
                  <div
                    key={`${media.id}-${media.mediaType}`}
                    style={mediaCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 255, 179, 0.4)`;
                      e.currentTarget.style.borderColor = COLORS.mint;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = COLORS.accent;
                    }}
                  >
                    <div
                      style={posterStyle}
                      onClick={() => {
                        setSelectedMedia(media);
                        setShowDetailsModal(true);
                      }}
                    >
                      {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                    </div>
                    <div style={cardTitleStyle}>{media.title}</div>
                    <div style={ratingStyle}>⭐ {media.rating.toFixed(1)}</div>
                    <div style={actionButtonsStyle}>
                      <button
                        style={actionButtonStyle(true)}
                        onClick={() => toggleOfflineContent(media)}
                      >
                        ✓ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyStateIconStyle}>💾</div>
              <div style={emptyStateTitleStyle}>No Offline Content</div>
              <div>Save movies and shows from the Movie Theater or TV Show Lounge tabs for offline viewing</div>
            </div>
          )}

          {/* Recently Watched History */}
          {history.length > 0 && (
            <>
              <div style={sectionTitleStyle}>👀 Recently Watched</div>
              <div>
                {history.slice(0, 10).map((item) => (
                  <div
                    key={`${item.id}-${item.watchedDate}`}
                    style={historyItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS.primary;
                      e.currentTarget.style.background = COLORS.darkGlass;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.accent;
                      e.currentTarget.style.background = COLORS.glass;
                    }}
                    onClick={() => {
                      setSelectedMedia(item);
                      setShowDetailsModal(true);
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', color: COLORS.primary, marginBottom: '5px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.accent }}>
                        {new Date(item.watchedDate).toLocaleDateString()} · {item.mediaType === 'tv' ? 'TV Series' : 'Movie'}
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', cursor: 'pointer' }} onClick={(e) => {
                      e.stopPropagation();
                      handleMediaClick(item);
                    }}>
                      ▶️
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Watchlist */}
          {watchlist.length > 0 && (
            <>
              <div style={sectionTitleStyle}>❤️ My Watchlist ({watchlist.length})</div>
              <div style={mediaGridStyle}>
                {watchlist.map((item) => (
                  <div
                    key={`${item.id}-${item.mediaType}`}
                    style={mediaCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = `0 10px 30px rgba(255, 20, 147, 0.4)`;
                      e.currentTarget.style.borderColor = COLORS.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = COLORS.accent;
                    }}
                  >
                    <div
                      style={posterStyle}
                      onClick={() => {
                        setSelectedMedia(item);
                        setShowDetailsModal(true);
                      }}
                    >
                      {item.posterUrl && <img src={item.posterUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />}
                    </div>
                    <div style={cardTitleStyle}>{item.title}</div>
                    <div style={ratingStyle}>⭐ {item.rating.toFixed(1)}</div>
                    <div style={actionButtonsStyle}>
                      <button
                        style={actionButtonStyle(true)}
                        onClick={() => toggleWatchlist(item)}
                      >
                        ✓ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMedia && (
        <div style={modalBackdropStyle} onClick={() => setShowDetailsModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>{selectedMedia.title}</div>
              <button style={closeButtonStyle} onClick={() => setShowDetailsModal(false)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', marginBottom: '20px' }}>
              <div
                style={modalPosterStyle}
                onClick={() => handleMediaClick(selectedMedia)}
              >
                {selectedMedia.posterUrl && <img src={selectedMedia.posterUrl} alt={selectedMedia.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} />}
              </div>

              <div style={detailsStyle}>
                <div style={detailLabelStyle}>Rating</div>
                <div style={detailValueStyle}>
                  ⭐ {selectedMedia.rating.toFixed(1)}/10
                </div>

                <div style={detailLabelStyle}>Type</div>
                <div style={detailValueStyle}>
                  {selectedMedia.mediaType === 'tv' ? 'TV Series' : 'Movie'}
                </div>

                <div style={detailLabelStyle}>Release Date</div>
                <div style={detailValueStyle}>
                  {new Date(selectedMedia.releaseDate).toLocaleDateString()}
                </div>

                <div style={detailLabelStyle}>Genres</div>
                <div style={genreChipsStyle}>
                  {selectedMedia.genre.map((g) => (
                    <div key={g} style={genreChipStyle}>
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={detailLabelStyle}>Overview</div>
              <div style={{ ...detailValueStyle, lineHeight: '1.6' }}>
                {selectedMedia.overview}
              </div>
            </div>

            {selectedMedia.streamingLinks && selectedMedia.streamingLinks.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={detailLabelStyle}>Watch on:</div>
                <div style={streamingLinksStyle}>
                  {selectedMedia.streamingLinks.map((link) => (
                    <button
                      key={link.platform}
                      style={streamingLinkStyle}
                      onClick={() => window.open(link.url, '_blank')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = COLORS.glass;
                        e.currentTarget.style.borderColor = COLORS.primary;
                        e.currentTarget.style.color = COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = COLORS.glass;
                        e.currentTarget.style.borderColor = COLORS.mint;
                        e.currentTarget.style.color = COLORS.mint;
                      }}
                    >
                      ▶️ {link.platform}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                style={{
                  ...actionButtonStyle(true),
                  flex: '1',
                  padding: '12px',
                }}
                onClick={() => {
                  toggleWatchlist(selectedMedia);
                }}
              >
                {isInWatchlist(selectedMedia) ? '✓ Remove from Watchlist' : '+ Add to Watchlist'}
              </button>
              <button
                style={{
                  ...actionButtonStyle(true),
                  flex: '1',
                  padding: '12px',
                }}
                onClick={() => {
                  toggleOfflineContent(selectedMedia);
                }}
              >
                {isInOffline(selectedMedia) ? '✓ Remove from Offline' : '💾 Save for Offline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DollhouseMediaCenter;
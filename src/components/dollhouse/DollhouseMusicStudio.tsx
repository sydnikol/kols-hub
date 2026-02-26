import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  genre: string;
  year: number;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
  isPublic: boolean;
}

interface AudioVisualizerData {
  frequencies: number[];
  waveform: number[];
}

// Demo data
const DEMO_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthetic Dreams',
    album: 'Digital Echoes',
    duration: 245,
    albumArt: 'linear-gradient(135deg, #FF1493, #9B30FF)',
    genre: 'Electronic',
    year: 2024,
  },
  {
    id: '2',
    title: 'Purple Rain Remix',
    artist: 'Cyberpunk Collective',
    album: 'Retro Future',
    duration: 203,
    albumArt: 'linear-gradient(135deg, #9B30FF, #E0A0FF)',
    genre: 'Synthwave',
    year: 2024,
  },
  {
    id: '3',
    title: 'Gothic Midnight',
    artist: 'Shadow Echo',
    album: 'Dark Aesthetics',
    duration: 187,
    albumArt: 'linear-gradient(135deg, #0a0010, #FF1493)',
    genre: 'Dark Ambient',
    year: 2023,
  },
  {
    id: '4',
    title: 'Digital Bloom',
    artist: 'Neon Garden',
    album: 'Synth Paradise',
    duration: 216,
    albumArt: 'linear-gradient(135deg, #00FFB3, #FF1493)',
    genre: 'Synth-Pop',
    year: 2024,
  },
  {
    id: '5',
    title: 'Velvet Echo',
    artist: 'Luna Nights',
    album: 'Ethereal Dreams',
    duration: 198,
    albumArt: 'linear-gradient(135deg, #E0A0FF, #9B30FF)',
    genre: 'Lo-Fi',
    year: 2023,
  },
];

const GENRES = [
  'Hip Hop',
  'R&B',
  'Electronic',
  'Pop',
  'Rock',
  'Jazz',
  'Classical',
  'Lo-Fi',
  'Ambient',
  'Metal',
  'K-Pop',
  'Latin',
];

const MOODS = [
  { name: 'Focus', icon: '🎯', color: '#FF1493' },
  { name: 'Chill', icon: '😎', color: '#9B30FF' },
  { name: 'Workout', icon: '💪', color: '#00FFB3' },
  { name: 'Party', icon: '🎉', color: '#FF1493' },
  { name: 'Sleep', icon: '😴', color: '#E0A0FF' },
  { name: 'Study', icon: '📚', color: '#9B30FF' },
];

export const DollhouseMusicStudio: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'now-playing' | 'spotify' | 'youtube' | 'soundcloud' | 'discovery' | 'collection'>('now-playing');
  const [currentTrack, setCurrentTrack] = useState<Track>(DEMO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState<Track[]>(DEMO_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [visualizerData, setVisualizerData] = useState<AudioVisualizerData>({
    frequencies: new Array(32).fill(0),
    waveform: new Array(256).fill(0),
  });
  const [equalizer, setEqualizer] = useState<'Flat' | 'Bass Boost' | 'Vocal' | 'Electronic' | 'Classical'>('Flat');
  const [sleepTimer, setSleepTimer] = useState(0);
  const [crossfade, setCrossfade] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [soundcloudConnected, setSoundcloudConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context and persistence
  useEffect(() => {
    // Load favorites and playlists from localStorage
    const savedFavorites = localStorage.getItem('music-studio-favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedPlaylists = localStorage.getItem('music-studio-playlists');
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));

    // Initialize audio context
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;

      const analyzer = audioContext.createAnalyser();
      analyzer.connect(gainNode);
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;
    } catch (error) {
      console.log('Web Audio API not available');
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Persist favorites and playlists
  useEffect(() => {
    localStorage.setItem('music-studio-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('music-studio-playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Visualizer animation loop
  useEffect(() => {
    if (!isPlaying || !analyzerRef.current) return;

    const animate = () => {
      const analyzer = analyzerRef.current;
      if (!analyzer) return;

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);

      const frequencies = Array.from(dataArray).slice(0, 32).map(v => v / 255);
      const waveformData = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteTimeDomainData(waveformData);
      const waveform = Array.from(waveformData).slice(0, 256).map(v => (v - 128) / 128);

      setVisualizerData({ frequencies, waveform });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Simulate track progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= currentTrack.duration) {
          handleNextTrack();
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Sleep timer logic
  useEffect(() => {
    if (sleepTimer === 0) {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      return;
    }

    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);

    sleepTimerRef.current = setTimeout(() => {
      setIsPlaying(false);
      setSleepTimer(0);
    }, sleepTimer * 60 * 1000);

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [sleepTimer]);

  // Play/Pause handler
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    const audioContext = audioContextRef.current;

    if (!audioContext) return;

    if (!isPlaying) {
      // Start playing - generate tone
      try {
        if (!oscillatorRef.current) {
          const oscillator = audioContext.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.value = 440;
          oscillator.connect(analyzerRef.current!);
          oscillator.start();
          oscillatorRef.current = oscillator;
        }
      } catch (error) {
        console.log('Audio playback error:', error);
      }
    } else {
      // Stop playing
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (error) {
          console.log('Error stopping oscillator:', error);
        }
        oscillatorRef.current = null;
      }
    }
  }, [isPlaying]);

  // Navigation handlers
  const handleNextTrack = useCallback(() => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIndex);
      setCurrentTrack(queue[randomIndex]);
    } else {
      const nextIndex = (queueIndex + 1) % queue.length;
      setQueueIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
    }
    setCurrentTime(0);
  }, [queueIndex, queue, shuffle]);

  const handlePrevTrack = useCallback(() => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
      setQueueIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
      setCurrentTime(0);
    }
  }, [queueIndex, queue, currentTime]);

  // Toggle favorite
  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  }, []);

  // Add to playlist
  const addToPlaylist = useCallback(
    (track: Track, playlistId: string) => {
      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p
        )
      );
    },
    []
  );

  // Create new playlist
  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: Date.now(),
      isPublic: false,
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = DEMO_TRACKS.filter(
        track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Render components
  const NowPlayingTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Album Art with Visualizer */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        perspective: '1000px',
      }}>
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          borderRadius: '20px',
          background: currentTrack.albumArt,
          boxShadow: `0 0 40px ${isPlaying ? '#FF1493' : '#9B30FF'}, 0 0 80px rgba(255, 20, 147, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5E6FF',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '20px',
          transform: isPlaying ? 'rotateY(5deg)' : 'rotateY(0deg)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}>
          {/* Visualizer bars overlay */}
          {isPlaying && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '4px',
              padding: '10px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
            }}>
              {visualizerData.frequencies.map((freq, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: `${freq * 80}px`,
                    background: `linear-gradient(to top, #FF1493, #E0A0FF)`,
                    borderRadius: '3px',
                    transition: 'height 0.05s ease',
                  }}
                />
              ))}
            </div>
          )}
          <div>🎵 {currentTrack.title}</div>
        </div>
      </div>

      {/* Track Info */}
      <div style={{ textAlign: 'center', color: '#F5E6FF' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
          {currentTrack.title}
        </h2>
        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#E0A0FF' }}>
          {currentTrack.artist}
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#9B30FF' }}>
          {currentTrack.album} • {currentTrack.year}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          height: '6px',
          background: 'rgba(155, 48, 255, 0.2)',
          borderRadius: '3px',
          overflow: 'hidden',
          cursor: 'pointer',
        }} onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          setCurrentTime(percent * currentTrack.duration);
        }}>
          <div style={{
            height: '100%',
            width: `${(currentTime / currentTrack.duration) * 100}%`,
            background: 'linear-gradient(90deg, #FF1493, #E0A0FF)',
            transition: 'width 0.1s linear',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#E0A0FF',
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={() => setShuffle(!shuffle)}
          style={{
            background: shuffle ? '#FF1493' : 'transparent',
            border: `2px solid ${shuffle ? '#FF1493' : '#9B30FF'}`,
            color: '#F5E6FF',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          🔀 Shuffle
        </button>

        <button
          onClick={handlePrevTrack}
          style={{
            background: 'transparent',
            border: '2px solid #9B30FF',
            color: '#F5E6FF',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
          }}
        >
          ⏮️
        </button>

        <button
          onClick={handlePlayPause}
          style={{
            background: 'linear-gradient(135deg, #FF1493, #9B30FF)',
            border: 'none',
            color: '#F5E6FF',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(255, 20, 147, 0.4)',
          }}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>

        <button
          onClick={handleNextTrack}
          style={{
            background: 'transparent',
            border: '2px solid #9B30FF',
            color: '#F5E6FF',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
          }}
        >
          ⏭️
        </button>

        <button
          onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
          style={{
            background: repeat !== 'none' ? '#9B30FF' : 'transparent',
            border: `2px solid ${repeat !== 'none' ? '#9B30FF' : '#9B30FF'}`,
            color: '#F5E6FF',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          🔁 {repeat === 'one' ? '1' : repeat === 'all' ? 'All' : 'Off'}
        </button>
      </div>

      {/* Volume & EQ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        <div style={{
          background: 'rgba(155, 48, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224, 160, 255, 0.3)',
        }}>
          <label style={{ fontSize: '12px', color: '#E0A0FF', marginBottom: '8px', display: 'block' }}>
            🔊 Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (gainNodeRef.current) gainNodeRef.current.gain.value = newVolume;
            }}
            style={{
              width: '100%',
              accentColor: '#FF1493',
              cursor: 'pointer',
            }}
          />
        </div>

        <div style={{
          background: 'rgba(155, 48, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224, 160, 255, 0.3)',
        }}>
          <label style={{ fontSize: '12px', color: '#E0A0FF', marginBottom: '8px', display: 'block' }}>
            🎚️ Equalizer
          </label>
          <select
            value={equalizer}
            onChange={(e) => setEqualizer(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#0a0010',
              color: '#FF1493',
              border: '1px solid #FF1493',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <option>Flat</option>
            <option>Bass Boost</option>
            <option>Vocal</option>
            <option>Electronic</option>
            <option>Classical</option>
          </select>
        </div>
      </div>

      {/* Sleep Timer & Crossfade */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        <div style={{
          background: 'rgba(155, 48, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224, 160, 255, 0.3)',
        }}>
          <label style={{ fontSize: '12px', color: '#E0A0FF', marginBottom: '8px', display: 'block' }}>
            😴 Sleep Timer: {sleepTimer}m
          </label>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={sleepTimer}
            onChange={(e) => setSleepTimer(parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#9B30FF',
              cursor: 'pointer',
            }}
          />
        </div>

        <div style={{
          background: 'rgba(155, 48, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224, 160, 255, 0.3)',
        }}>
          <label style={{ fontSize: '12px', color: '#E0A0FF', marginBottom: '8px', display: 'block' }}>
            🔗 Crossfade: {crossfade}s
          </label>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={crossfade}
            onChange={(e) => setCrossfade(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#00FFB3',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Favorite & Lyrics */}
      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          style={{
            flex: 1,
            background: favorites.includes(currentTrack.id) ? '#FF1493' : 'transparent',
            border: `2px solid ${favorites.includes(currentTrack.id) ? '#FF1493' : '#E0A0FF'}`,
            color: '#F5E6FF',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          {favorites.includes(currentTrack.id) ? '❤️' : '🤍'} Favorite
        </button>

        <button
          onClick={() => setShowLyrics(!showLyrics)}
          style={{
            flex: 1,
            background: showLyrics ? '#9B30FF' : 'transparent',
            border: `2px solid ${showLyrics ? '#9B30FF' : '#E0A0FF'}`,
            color: '#F5E6FF',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          📝 Lyrics
        </button>

        <button
          onClick={() => setMiniPlayerVisible(!miniPlayerVisible)}
          style={{
            flex: 1,
            background: miniPlayerVisible ? '#00FFB3' : 'transparent',
            border: `2px solid ${miniPlayerVisible ? '#00FFB3' : '#E0A0FF'}`,
            color: miniPlayerVisible ? '#0a0010' : '#F5E6FF',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          ⬇️ Mini
        </button>
      </div>

      {/* Lyrics Display */}
      {showLyrics && (
        <div style={{
          background: 'rgba(155, 48, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224, 160, 255, 0.3)',
          maxHeight: '300px',
          overflowY: 'auto',
          color: '#E0A0FF',
          fontSize: '13px',
          lineHeight: '1.6',
        }}>
          <p style={{ margin: '0', fontStyle: 'italic' }}>
            ✨ Lyrics not available for this demo track ✨<br /><br />
            When connected to Spotify or other services, full lyrics will display here.
          </p>
        </div>
      )}

      {/* Queue */}
      <div style={{
        background: 'rgba(155, 48, 255, 0.15)',
        borderRadius: '12px',
        padding: '16px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(224, 160, 255, 0.3)',
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#FF1493', fontSize: '14px', fontWeight: 'bold' }}>
          📋 Queue ({queue.length} tracks)
        </h3>
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {queue.map((track, index) => (
            <div
              key={track.id}
              onClick={() => {
                setQueueIndex(index);
                setCurrentTrack(track);
                setCurrentTime(0);
              }}
              style={{
                padding: '8px',
                background: index === queueIndex ? '#FF1493' : 'rgba(255, 20, 147, 0.05)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                color: index === queueIndex ? '#0a0010' : '#E0A0FF',
                fontWeight: index === queueIndex ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
              }}
            >
              {index + 1}. {track.title} - {track.artist}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SpotifyLoungeTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!spotifyConnected && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(155, 48, 255, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #FF1493',
        }}>
          <h2 style={{ color: '#FF1493', marginTop: 0 }}>🎵 Spotify Lounge</h2>
          <p style={{ color: '#E0A0FF', margin: '12px 0' }}>
            Connect your Spotify account to browse playlists, discover new music, and sync your favorite tracks.
          </p>
          <button
            onClick={() => {
              const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
              if (clientId) {
                setSpotifyConnected(true);
              } else {
                alert('Spotify Client ID not configured. Set VITE_SPOTIFY_CLIENT_ID in your environment.');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #1DB954, #1ed760)',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
          >
            🔗 Connect Spotify
          </button>
        </div>
      )}

      {spotifyConnected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(155, 48, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(224, 160, 255, 0.3)',
          }}>
            <input
              type="text"
              placeholder="Search Spotify catalog..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0a0010',
                border: '1px solid #9B30FF',
                borderRadius: '6px',
                color: '#F5E6FF',
                fontSize: '14px',
              }}
            />
          </div>

          <h3 style={{ color: '#FF1493', margin: 0 }}>📊 Featured Playlists</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}>
            {['Pop Hits', 'Rock Essentials', 'Chill Vibes', 'Party Mix', 'New Music Friday', 'Deep Focus'].map(
              (name) => (
                <div
                  key={name}
                  style={{
                    background: 'rgba(155, 48, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    color: '#E0A0FF',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(224, 160, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
                  }}
                >
                  🎵 {name}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  const YouTubeMusicTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!youtubeConnected && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(155, 48, 255, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #FF1493',
        }}>
          <h2 style={{ color: '#FF1493', marginTop: 0 }}>🎬 YouTube Music</h2>
          <p style={{ color: '#E0A0FF', margin: '12px 0' }}>
            Connect YouTube to watch music videos, discover trending tracks, and create playlists.
          </p>
          <button
            onClick={() => {
              const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
              if (apiKey) {
                setYoutubeConnected(true);
              } else {
                alert('YouTube API Key not configured. Set VITE_YOUTUBE_API_KEY in your environment.');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #FF0000, #cc0000)',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
          >
            🔗 Connect YouTube
          </button>
        </div>
      )}

      {youtubeConnected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(155, 48, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(224, 160, 255, 0.3)',
          }}>
            <input
              type="text"
              placeholder="Search YouTube music videos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0a0010',
                border: '1px solid #9B30FF',
                borderRadius: '6px',
                color: '#F5E6FF',
                fontSize: '14px',
              }}
            />
          </div>

          <h3 style={{ color: '#FF1493', margin: 0 }}>🔥 Trending Now</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {DEMO_TRACKS.map((track) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                style={{
                  background: 'rgba(155, 48, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  color: '#E0A0FF',
                  fontSize: '12px',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(224, 160, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#FF1493' }}>{track.title}</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>{track.artist}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SoundCloudTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!soundcloudConnected && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(155, 48, 255, 0.1))',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '2px dashed #FF1493',
        }}>
          <h2 style={{ color: '#FF1493', marginTop: 0 }}>☁️ SoundCloud</h2>
          <p style={{ color: '#E0A0FF', margin: '12px 0' }}>
            Browse SoundCloud tracks, discover independent artists, and find emerging talent.
          </p>
          <button
            onClick={() => {
              const clientId = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID;
              if (clientId) {
                setSoundcloudConnected(true);
              } else {
                alert('SoundCloud Client ID not configured. Set VITE_SOUNDCLOUD_CLIENT_ID in your environment.');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #FF8800, #FF6600)',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
          >
            🔗 Connect SoundCloud
          </button>
        </div>
      )}

      {soundcloudConnected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(155, 48, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(224, 160, 255, 0.3)',
          }}>
            <input
              type="text"
              placeholder="Search SoundCloud..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0a0010',
                border: '1px solid #9B30FF',
                borderRadius: '6px',
                color: '#F5E6FF',
                fontSize: '14px',
              }}
            />
          </div>

          <h3 style={{ color: '#FF1493', margin: 0 }}>⭐ Trending Artists</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {['Synthetic Dreams', 'Cyberpunk Collective', 'Shadow Echo', 'Neon Garden', 'Luna Nights'].map(
              (artist) => (
                <div
                  key={artist}
                  style={{
                    background: 'rgba(155, 48, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    color: '#E0A0FF',
                    fontSize: '13px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(224, 160, 255, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
                  }}
                >
                  <span>👤 {artist}</span>
                  <span>▶️ Follow</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  const DiscoveryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Genres */}
      <div>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>🎸 Genres</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px',
        }}>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              style={{
                background: selectedGenre === genre ? '#FF1493' : 'rgba(155, 48, 255, 0.15)',
                border: `2px solid ${selectedGenre === genre ? '#FF1493' : '#9B30FF'}`,
                color: selectedGenre === genre ? '#0a0010' : '#E0A0FF',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>😊 Moods & Vibes</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '8px',
        }}>
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
              style={{
                background: selectedMood === mood.name ? mood.color : 'rgba(155, 48, 255, 0.15)',
                border: `2px solid ${selectedMood === mood.name ? mood.color : '#9B30FF'}`,
                color: selectedMood === mood.name ? '#0a0010' : '#E0A0FF',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
            >
              {mood.icon} {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Discover Weekly */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(155, 48, 255, 0.1))',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(224, 160, 255, 0.3)',
      }}>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>✨ Discover Weekly</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}>
          {DEMO_TRACKS.slice(0, 4).map((track) => (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
              }}
              style={{
                background: 'rgba(155, 48, 255, 0.15)',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                color: '#E0A0FF',
                fontSize: '11px',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(224, 160, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#FF1493' }}>{track.title}</div>
              <div style={{ marginTop: '4px' }}>{track.artist}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Artist Spotlight */}
      <div>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>⭐ Artist Spotlight</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          {['Synthetic Dreams', 'Shadow Echo', 'Neon Garden'].map((artist) => (
            <div
              key={artist}
              style={{
                background: 'rgba(155, 48, 255, 0.15)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(224, 160, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎤</div>
              <div style={{ fontWeight: 'bold', color: '#FF1493', fontSize: '13px' }}>{artist}</div>
              <div style={{ fontSize: '11px', color: '#E0A0FF', marginTop: '4px' }}>5.2M followers</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  marginTop: '8px',
                  background: '#9B30FF',
                  border: 'none',
                  color: '#F5E6FF',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CollectionTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Favorites */}
      <div>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>❤️ Favorites ({favorites.length})</h3>
        {favorites.length === 0 ? (
          <p style={{ color: '#E0A0FF', fontSize: '13px', margin: 0 }}>No favorites yet. Add tracks to build your collection!</p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {DEMO_TRACKS.filter(t => favorites.includes(t.id)).map((track) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                style={{
                  background: 'rgba(155, 48, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#E0A0FF',
                  fontSize: '13px',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(224, 160, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#FF1493' }}>{track.title}</div>
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>{track.artist}</div>
                </div>
                <div style={{ fontSize: '11px' }}>{formatTime(track.duration)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Playlists */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#FF1493', margin: 0 }}>🎵 Playlists ({playlists.length})</h3>
          <button
            onClick={() => {
              const name = prompt('Playlist name:');
              if (name) createPlaylist(name);
            }}
            style={{
              background: '#9B30FF',
              border: 'none',
              color: '#F5E6FF',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            + New
          </button>
        </div>
        {playlists.length === 0 ? (
          <p style={{ color: '#E0A0FF', fontSize: '13px', margin: 0 }}>Create your first playlist!</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}>
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                style={{
                  background: 'rgba(155, 48, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  color: '#E0A0FF',
                  fontSize: '12px',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(224, 160, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#FF1493' }}>{playlist.name}</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>{playlist.tracks.length} tracks</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Played */}
      <div>
        <h3 style={{ color: '#FF1493', margin: '0 0 12px 0' }}>🕐 Recently Played</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {DEMO_TRACKS.slice(0, 3).map((track) => (
            <div
              key={track.id}
              style={{
                background: 'rgba(155, 48, 255, 0.15)',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#E0A0FF',
                fontSize: '13px',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(224, 160, 255, 0.3)',
              }}
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(155, 48, 255, 0.15)';
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', color: '#FF1493' }}>{track.title}</div>
                <div style={{ fontSize: '11px', marginTop: '2px' }}>{track.artist}</div>
              </div>
              <div style={{ fontSize: '11px' }}>{formatTime(track.duration)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export/Import */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => {
            const data = { favorites, playlists };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'music-library.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            flex: 1,
            background: '#00FFB3',
            border: 'none',
            color: '#0a0010',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            transition: 'all 0.3s ease',
          }}
        >
          📥 Export Library
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e: any) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                try {
                  const data = JSON.parse(event.target.result);
                  if (data.favorites) setFavorites(data.favorites);
                  if (data.playlists) setPlaylists(data.playlists);
                  alert('Library imported successfully!');
                } catch (error) {
                  alert('Invalid file format');
                }
              };
              reader.readAsText(file);
            };
            input.click();
          }}
          style={{
            flex: 1,
            background: '#9B30FF',
            border: 'none',
            color: '#F5E6FF',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            transition: 'all 0.3s ease',
          }}
        >
          📤 Import Library
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div style={{
      background: '#0a0010',
      color: '#F5E6FF',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Mini Player */}
      {miniPlayerVisible && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(10, 0, 16, 0.95)',
          border: '2px solid #FF1493',
          borderRadius: '12px',
          padding: '12px',
          width: '280px',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          boxShadow: '0 0 30px rgba(255, 20, 147, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', color: '#E0A0FF', fontWeight: 'bold' }}>Now Playing</div>
            <button
              onClick={() => setMiniPlayerVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF1493',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#E0A0FF', marginBottom: '8px', wordBreak: 'break-word' }}>
            {currentTrack.title} - {currentTrack.artist}
          </div>
          <div style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
          }}>
            <button
              onClick={handlePlayPause}
              style={{
                background: '#FF1493',
                border: 'none',
                color: '#0a0010',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={handleNextTrack}
              style={{
                background: '#9B30FF',
                border: 'none',
                color: '#F5E6FF',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              ⏭
            </button>
          </div>
        </div>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #FF1493, #E0A0FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}>
            🎵 Music Studio
          </h1>
          <p style={{ fontSize: '14px', color: '#9B30FF', margin: 0 }}>
            Gothic Bratz Edition • Comprehensive Music Discovery & Playback
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {(['now-playing', 'spotify', 'youtube', 'soundcloud', 'discovery', 'collection'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, #FF1493, #9B30FF)' : 'rgba(155, 48, 255, 0.15)',
                  border: `2px solid ${activeTab === tab ? '#FF1493' : '#9B30FF'}`,
                  color: activeTab === tab ? '#0a0010' : '#E0A0FF',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab === 'now-playing' && '▶️ Now Playing'}
                {tab === 'spotify' && '🎵 Spotify'}
                {tab === 'youtube' && '🎬 YouTube'}
                {tab === 'soundcloud' && '☁️ SoundCloud'}
                {tab === 'discovery' && '🔍 Discover'}
                {tab === 'collection' && '📚 Collection'}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div style={{
          background: 'rgba(155, 48, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(224, 160, 255, 0.2)',
          padding: '24px',
        }}>
          {activeTab === 'now-playing' && <NowPlayingTab />}
          {activeTab === 'spotify' && <SpotifyLoungeTab />}
          {activeTab === 'youtube' && <YouTubeMusicTab />}
          {activeTab === 'soundcloud' && <SoundCloudTab />}
          {activeTab === 'discovery' && <DiscoveryTab />}
          {activeTab === 'collection' && <CollectionTab />}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9B30FF',
        }}>
          <p style={{ margin: 0 }}>✨ Music Studio • Powered by Web Audio API • All data stored locally</p>
        </div>
      </div>
    </div>
  );
};

export default DollhouseMusicStudio;

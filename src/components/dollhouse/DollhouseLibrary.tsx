import React, { useState, useEffect } from 'react';

// Color theme
const THEME = {
  primary: '#FF1493',
  secondary: '#9B30FF',
  bg: '#0a0010',
  accent: '#E0A0FF',
  mint: '#00FFB3',
  text: '#F5E6FF',
  glass: 'rgba(155,48,255,0.15)',
  darkBg: '#1a0a28',
  borderColor: '#9B30FF',
};

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  genre: string;
  year?: number;
  description?: string;
}

interface BookShelf {
  wantToRead: Book[];
  reading: Book[];
  finished: Book[];
}

interface Comic {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating: number;
}

interface AcademicPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url?: string;
  citations?: number;
}

interface Citation {
  id: string;
  paper: AcademicPaper;
  format: 'APA' | 'MLA' | 'Chicago';
  savedAt: number;
}

interface Audiobook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  duration: string;
  cover: string;
  genre: string;
}

// Demo data
const DEMO_COMICS: Comic[] = [
  {
    id: '1',
    title: 'Gothic Chronicles',
    author: 'Melissa',
    cover: '📚',
    genre: 'Dark Fantasy',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Midnight Mysteries',
    author: 'Sasha',
    cover: '🖤',
    genre: 'Horror',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Spellbound Series',
    author: 'Cloe',
    cover: '✨',
    genre: 'Magical Adventure',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Dark Whispers',
    author: 'Jade',
    cover: '🌙',
    genre: 'Supernatural',
    rating: 4.7,
  },
  {
    id: '5',
    title: 'Shadow Realm',
    author: 'Dylan',
    cover: '👻',
    genre: 'Dark Fiction',
    rating: 4.5,
  },
];

const DEMO_AUDIOBOOKS: Audiobook[] = [
  {
    id: 'audio-1',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    narrator: 'Julian Sands',
    duration: '8h 42m',
    cover: '📖',
    genre: 'Gothic Literature',
  },
  {
    id: 'audio-2',
    title: 'Dracula',
    author: 'Bram Stoker',
    narrator: 'Simon Prebble',
    duration: '12h 15m',
    cover: '🦇',
    genre: 'Horror',
  },
  {
    id: 'audio-3',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    narrator: 'Thandiwe Newton',
    duration: '19h 34m',
    cover: '🕯️',
    genre: 'Gothic Romance',
  },
];

const DEMO_PAPERS: AcademicPaper[] = [
  {
    id: 'paper-1',
    title: 'The Evolution of Gothic Literature in Contemporary Culture',
    authors: ['Dr. Emma Stone', 'Prof. Michael Hart'],
    year: 2023,
    abstract:
      'This paper examines the resurgence of gothic themes in modern entertainment and fashion.',
    citations: 45,
  },
  {
    id: 'paper-2',
    title: 'Digital Archives and Library Science',
    authors: ['Dr. Sarah Chen'],
    year: 2024,
    abstract: 'Exploring the role of digital collections in modern library systems.',
    citations: 12,
  },
];

export default function DollhouseLibrary() {
  const [activeTab, setActiveTab] = useState<
    'books' | 'comics' | 'papers' | 'audiobooks' | 'offline'
  >('books');
  const [bookShelves, setBookShelves] = useState<BookShelf>({
    wantToRead: [],
    reading: [],
    finished: [],
  });
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [savedItems, setSavedItems] = useState<{
    comics: Comic[];
    audiobooks: Audiobook[];
  }>({ comics: [], audiobooks: [] });
  const [paperSearch, setPaperSearch] = useState<string>('');
  const [paperResults, setPaperResults] = useState<AcademicPaper[]>([]);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<
    'APA' | 'MLA' | 'Chicago'
  >('APA');

  const GENRES = [
    'All',
    'Fiction',
    'Non-Fiction',
    'Sci-Fi',
    'Fantasy',
    'Horror',
    'Romance',
    'Mystery',
    'Biography',
  ];

  // Load from localStorage on mount
  useEffect(() => {
    const savedBookshelves = localStorage.getItem('dollhouseBookshelves');
    const savedCitations = localStorage.getItem('dollhouseCitations');
    const savedComics = localStorage.getItem('dollhouseComics');
    const savedAudiobooks = localStorage.getItem('dollhouseAudiobooks');

    if (savedBookshelves) {
      setBookShelves(JSON.parse(savedBookshelves));
    }
    if (savedCitations) {
      setCitations(JSON.parse(savedCitations));
    }
    if (savedComics) {
      setSavedItems((prev) => ({
        ...prev,
        comics: JSON.parse(savedComics),
      }));
    }
    if (savedAudiobooks) {
      setSavedItems((prev) => ({
        ...prev,
        audiobooks: JSON.parse(savedAudiobooks),
      }));
    }
  }, []);

  // Save to localStorage whenever bookshelves change
  useEffect(() => {
    localStorage.setItem('dollhouseBookshelves', JSON.stringify(bookShelves));
  }, [bookShelves]);

  useEffect(() => {
    localStorage.setItem('dollhouseCitations', JSON.stringify(citations));
  }, [citations]);

  useEffect(() => {
    localStorage.setItem('dollhouseComics', JSON.stringify(savedItems.comics));
  }, [savedItems.comics]);

  useEffect(() => {
    localStorage.setItem(
      'dollhouseAudiobooks',
      JSON.stringify(savedItems.audiobooks)
    );
  }, [savedItems.audiobooks]);

  // Search books via Open Library API
  const handleBookSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await response.json();

      const results: Book[] = (data.docs || []).map(
        (doc: {
          key: string;
          title: string;
          author_name: string[];
          first_publish_year: number;
          isbn?: string[];
        }) => ({
          id: doc.key || Math.random().toString(),
          title: doc.title,
          author: doc.author_name?.[0] || 'Unknown',
          genre: 'General Fiction',
          year: doc.first_publish_year,
          cover: doc.isbn
            ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
            : undefined,
        })
      );

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Demo fallback
      setSearchResults([
        {
          id: 'demo-1',
          title: 'The Raven and Other Poems',
          author: 'Edgar Allan Poe',
          genre: 'Poetry',
          year: 1845,
          description: 'A collection of dark, gothic poetry',
        },
        {
          id: 'demo-2',
          title: 'Wuthering Heights',
          author: 'Emily Brontë',
          genre: 'Gothic Romance',
          year: 1847,
          description: 'Classic gothic romance novel',
        },
      ]);
    }
    setIsSearching(false);
  };

  // Add book to shelf
  const addToShelf = (
    book: Book,
    shelf: 'wantToRead' | 'reading' | 'finished'
  ) => {
    setBookShelves((prev) => {
      const newShelves = { ...prev };
      // Remove from other shelves
      newShelves.wantToRead = newShelves.wantToRead.filter(
        (b) => b.id !== book.id
      );
      newShelves.reading = newShelves.reading.filter((b) => b.id !== book.id);
      newShelves.finished = newShelves.finished.filter(
        (b) => b.id !== book.id
      );
      // Add to selected shelf
      if (!newShelves[shelf].find((b) => b.id === book.id)) {
        newShelves[shelf].push(book);
      }
      return newShelves;
    });
  };

  // Remove book from shelf
  const removeFromShelf = (bookId: string) => {
    setBookShelves((prev) => ({
      wantToRead: prev.wantToRead.filter((b) => b.id !== bookId),
      reading: prev.reading.filter((b) => b.id !== bookId),
      finished: prev.finished.filter((b) => b.id !== bookId),
    }));
  };

  // Save comic
  const saveComic = (comic: Comic) => {
    setSavedItems((prev) => {
      const exists = prev.comics.find((c) => c.id === comic.id);
      if (exists) {
        return {
          ...prev,
          comics: prev.comics.filter((c) => c.id !== comic.id),
        };
      }
      return {
        ...prev,
        comics: [...prev.comics, comic],
      };
    });
  };

  // Save audiobook
  const saveAudiobook = (audiobook: Audiobook) => {
    setSavedItems((prev) => {
      const exists = prev.audiobooks.find((a) => a.id === audiobook.id);
      if (exists) {
        return {
          ...prev,
          audiobooks: prev.audiobooks.filter((a) => a.id !== audiobook.id),
        };
      }
      return {
        ...prev,
        audiobooks: [...prev.audiobooks, audiobook],
      };
    });
  };

  // Search papers
  const handlePaperSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paperSearch.trim()) return;

    try {
      // Try Semantic Scholar API first
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(paperSearch)}&limit=5`,
        {
          headers: {
            'x-api-key': 'demo',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const results: AcademicPaper[] = (data.data || []).map(
          (paper: {
            paperId: string;
            title: string;
            authors: Array<{ name: string }>;
            year: number;
            abstract: string;
            url: string;
            citationCount: number;
          }) => ({
            id: paper.paperId,
            title: paper.title,
            authors: paper.authors?.map((a) => a.name) || [],
            year: paper.year,
            abstract: paper.abstract || 'No abstract available',
            url: paper.url,
            citations: paper.citationCount,
          })
        );
        setPaperResults(results);
      } else {
        // Demo fallback
        setPaperResults(DEMO_PAPERS);
      }
    } catch (error) {
      console.error('Paper search error:', error);
      setPaperResults(DEMO_PAPERS);
    }
  };

  // Generate citation
  const generateCitation = (paper: AcademicPaper, format: string): string => {
    const authorsStr = paper.authors.join(', ');

    switch (format) {
      case 'APA':
        return `${authorsStr} (${paper.year}). ${paper.title}. Retrieved from ${paper.url || 'academic database'}`;
      case 'MLA':
        return `${authorsStr}. "${paper.title}." ${paper.year}.`;
      case 'Chicago':
        return `${authorsStr}. "${paper.title}." Accessed ${paper.year}.`;
      default:
        return `${authorsStr}. ${paper.title}. ${paper.year}.`;
    }
  };

  // Save citation
  const saveCitation = (
    paper: AcademicPaper,
    format: 'APA' | 'MLA' | 'Chicago'
  ) => {
    const newCitation: Citation = {
      id: Math.random().toString(),
      paper,
      format,
      savedAt: Date.now(),
    };
    setCitations((prev) => [...prev, newCitation]);
  };

  // Filter books by genre
  const allBooks = [
    ...bookShelves.wantToRead,
    ...bookShelves.reading,
    ...bookShelves.finished,
  ];
  const filteredBooks =
    selectedGenre === 'All'
      ? allBooks
      : allBooks.filter((b) => b.genre === selectedGenre);

  // Container styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: THEME.bg,
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Georgia', serif",
    color: THEME.text,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(155,48,255,0.1) 0%, transparent 50%)',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
    borderBottom: `3px solid ${THEME.primary}`,
    paddingBottom: '20px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
    textShadow: `0 0 20px rgba(255,20,147,0.3)`,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: THEME.accent,
    fontStyle: 'italic',
  };

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    overflowX: 'auto',
    paddingBottom: '10px',
    borderBottom: `2px solid ${THEME.borderColor}`,
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    border: `2px solid ${isActive ? THEME.primary : THEME.borderColor}`,
    backgroundColor: isActive ? THEME.primary : 'transparent',
    color: isActive ? THEME.bg : THEME.text,
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    boxShadow: isActive ? `0 0 15px ${THEME.primary}` : 'none',
  });

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: THEME.glass,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${THEME.borderColor}`,
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: THEME.darkBg,
    border: `2px solid ${THEME.borderColor}`,
    borderRadius: '10px',
    color: THEME.text,
    fontSize: '14px',
    fontFamily: 'inherit',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: THEME.primary,
    color: THEME.bg,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: `0 0 10px ${THEME.primary}`,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: THEME.secondary,
    boxShadow: `0 0 10px ${THEME.secondary}`,
  };

  const bookGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const bookCardStyle: React.CSSProperties = {
    ...cardStyle,
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  };

  const genreFilterStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  };

  const genreButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: `2px solid ${THEME.borderColor}`,
    backgroundColor: isActive ? THEME.secondary : 'transparent',
    color: isActive ? 'white' : THEME.text,
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  });

  const shelfHeaderStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: THEME.accent,
    marginTop: '30px',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${THEME.secondary}`,
  };

  const comicGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const comicCardStyle: React.CSSProperties = {
    ...cardStyle,
    textAlign: 'center',
  };

  const paperCardStyle: React.CSSProperties = {
    ...cardStyle,
    marginBottom: '20px',
  };

  const audiobookGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const audiobookCardStyle: React.CSSProperties = {
    ...cardStyle,
    textAlign: 'center',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: THEME.accent,
    fontSize: '18px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📚 Dollhouse Library 📚</h1>
        <p style={subtitleStyle}>
          Kol's Gothic Collection of Books, Comics, Papers & Audio
        </p>
      </div>

      <div style={tabContainerStyle}>
        {[
          { key: 'books', label: '📖 Book Haven' },
          { key: 'comics', label: '💜 Comic & Manga Vault' },
          { key: 'papers', label: '📋 Academic Papers Lab' },
          { key: 'audiobooks', label: '🎧 Audiobook Lounge' },
          { key: 'offline', label: '💾 Offline Library' },
        ].map((tab) => (
          <button
            key={tab.key}
            style={tabButtonStyle(activeTab === tab.key)}
            onClick={() =>
              setActiveTab(
                tab.key as
                  | 'books'
                  | 'comics'
                  | 'papers'
                  | 'audiobooks'
                  | 'offline'
              )
            }
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={contentStyle}>
        {/* BOOK HAVEN TAB */}
        {activeTab === 'books' && (
          <div>
            <form onSubmit={handleBookSearch} style={cardStyle}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books via Open Library..."
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={buttonStyle}
                disabled={isSearching}
                onMouseEnter={(e) => {
                  if (!isSearching) {
                    (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {isSearching ? 'Searching...' : 'Search Books'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                  Search Results ({searchResults.length})
                </h3>
                <div style={bookGridStyle}>
                  {searchResults.map((book) => (
                    <div key={book.id} style={bookCardStyle}>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                        {book.cover ? (
                          <img
                            src={book.cover}
                            alt={book.title}
                            style={{
                              width: '100%',
                              height: '180px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          '📖'
                        )}
                      </div>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {book.author}
                      </p>
                      {book.year && (
                        <p style={{ fontSize: '12px', color: THEME.text }}>
                          {book.year}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '12px',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                        }}
                      >
                        <button
                          style={{
                            ...buttonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                          }}
                          onClick={() => addToShelf(book, 'wantToRead')}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Want to Read
                        </button>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                          }}
                          onClick={() => addToShelf(book, 'reading')}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Reading
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={cardStyle}>
              <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                Filter by Genre
              </h3>
              <div style={genreFilterStyle}>
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    style={genreButtonStyle(selectedGenre === genre)}
                    onClick={() => setSelectedGenre(genre)}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.transform =
                        'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Shelves */}
            {bookShelves.wantToRead.length > 0 && (
              <div>
                <h3 style={shelfHeaderStyle}>📚 Want to Read</h3>
                <div style={bookGridStyle}>
                  {bookShelves.wantToRead.map((book) => (
                    <div key={book.id} style={bookCardStyle}>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {book.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        {book.genre}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '12px',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                          }}
                          onClick={() => addToShelf(book, 'reading')}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Reading
                        </button>
                        <button
                          style={{
                            ...buttonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                            backgroundColor: THEME.mint,
                            color: THEME.bg,
                            boxShadow: `0 0 10px ${THEME.mint}`,
                          }}
                          onClick={() => removeFromShelf(book.id)}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookShelves.reading.length > 0 && (
              <div>
                <h3 style={shelfHeaderStyle}>📖 Currently Reading</h3>
                <div style={bookGridStyle}>
                  {bookShelves.reading.map((book) => (
                    <div key={book.id} style={bookCardStyle}>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {book.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        {book.genre}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '12px',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          style={{
                            ...buttonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                            backgroundColor: THEME.mint,
                            color: THEME.bg,
                            boxShadow: `0 0 10px ${THEME.mint}`,
                          }}
                          onClick={() => addToShelf(book, 'finished')}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Finished
                        </button>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            fontSize: '11px',
                            padding: '6px 10px',
                          }}
                          onClick={() => removeFromShelf(book.id)}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform =
                              'scale(1)';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookShelves.finished.length > 0 && (
              <div>
                <h3 style={shelfHeaderStyle}>✨ Finished</h3>
                <div style={bookGridStyle}>
                  {bookShelves.finished.map((book) => (
                    <div key={book.id} style={bookCardStyle}>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {book.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        {book.genre}
                      </p>
                      <button
                        style={{
                          ...secondaryButtonStyle,
                          fontSize: '11px',
                          padding: '6px 10px',
                          marginTop: '12px',
                        }}
                        onClick={() => removeFromShelf(book.id)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allBooks.length === 0 && (
              <div style={emptyStateStyle}>
                <p>
                  Your shelves are empty. Search for books to get started! 📚✨
                </p>
              </div>
            )}
          </div>
        )}

        {/* COMIC & MANGA VAULT TAB */}
        {activeTab === 'comics' && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                Popular Series & Collections
              </h3>
              <div style={comicGridStyle}>
                {DEMO_COMICS.map((comic) => {
                  const isSaved = savedItems.comics.find(
                    (c) => c.id === comic.id
                  );
                  return (
                    <div key={comic.id} style={comicCardStyle}>
                      <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                        {comic.cover}
                      </div>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {comic.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {comic.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        {comic.genre}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.primary }}>
                        ⭐ {comic.rating}
                      </p>
                      <button
                        style={{
                          ...buttonStyle,
                          marginTop: '12px',
                          backgroundColor: isSaved
                            ? THEME.mint
                            : THEME.primary,
                          color: THEME.bg,
                          boxShadow: `0 0 10px ${
                            isSaved ? THEME.mint : THEME.primary
                          }`,
                        }}
                        onClick={() => saveComic(comic)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1)';
                        }}
                      >
                        {isSaved ? '💾 Saved' : '💜 Save'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {savedItems.comics.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                  My Saved Comics
                </h3>
                <div style={comicGridStyle}>
                  {savedItems.comics.map((comic) => (
                    <div key={comic.id} style={comicCardStyle}>
                      <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                        {comic.cover}
                      </div>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {comic.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {comic.author}
                      </p>
                      <button
                        style={{
                          ...secondaryButtonStyle,
                          marginTop: '12px',
                          fontSize: '11px',
                          padding: '6px 10px',
                        }}
                        onClick={() => saveComic(comic)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACADEMIC PAPERS LAB TAB */}
        {activeTab === 'papers' && (
          <div>
            <form onSubmit={handlePaperSearch} style={cardStyle}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  value={paperSearch}
                  onChange={(e) => setPaperSearch(e.target.value)}
                  placeholder="Search academic papers (Gothic, Library Science, etc.)..."
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                Search Papers
              </button>
            </form>

            {paperResults.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ color: THEME.accent, marginBottom: '20px' }}>
                  Search Results ({paperResults.length})
                </h3>
                {paperResults.map((paper) => (
                  <div key={paper.id} style={paperCardStyle}>
                    <h4 style={{ color: THEME.mint, marginBottom: '8px' }}>
                      {paper.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: THEME.accent }}>
                      {paper.authors.join(', ')} ({paper.year})
                    </p>
                    <p style={{ fontSize: '13px', color: THEME.text, margin: '10px 0' }}>
                      {paper.abstract.substring(0, 200)}
                      {paper.abstract.length > 200 ? '...' : ''}
                    </p>
                    {paper.citations && (
                      <p style={{ fontSize: '12px', color: THEME.primary }}>
                        Citations: {paper.citations}
                      </p>
                    )}
                    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                      <label
                        style={{
                          color: THEME.accent,
                          fontSize: '12px',
                          marginRight: '10px',
                        }}
                      >
                        Citation Format:{' '}
                        <select
                          value={selectedCitationFormat}
                          onChange={(e) =>
                            setSelectedCitationFormat(
                              e.target.value as 'APA' | 'MLA' | 'Chicago'
                            )
                          }
                          style={{
                            backgroundColor: THEME.darkBg,
                            color: THEME.text,
                            border: `1px solid ${THEME.borderColor}`,
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="APA">APA</option>
                          <option value="MLA">MLA</option>
                          <option value="Chicago">Chicago</option>
                        </select>
                      </label>
                    </div>
                    <div
                      style={{
                        backgroundColor: THEME.darkBg,
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: THEME.mint,
                        marginBottom: '12px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {generateCitation(paper, selectedCitationFormat)}
                    </div>
                    <button
                      style={{
                        ...buttonStyle,
                        marginRight: '10px',
                        fontSize: '12px',
                        padding: '8px 12px',
                      }}
                      onClick={() =>
                        saveCitation(paper, selectedCitationFormat)
                      }
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.transform =
                          'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.transform =
                          'scale(1)';
                      }}
                    >
                      Save Citation
                    </button>
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '8px 12px',
                          backgroundColor: THEME.secondary,
                          color: THEME.bg,
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Read Paper
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {citations.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ color: THEME.accent, marginBottom: '20px' }}>
                  Saved Citations ({citations.length})
                </h3>
                {citations.map((citation) => (
                  <div
                    key={citation.id}
                    style={{
                      ...paperCardStyle,
                      backgroundColor: THEME.darkBg,
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        color: THEME.accent,
                        marginBottom: '8px',
                      }}
                    >
                      Format: <strong>{citation.format}</strong>
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: THEME.mint,
                        marginBottom: '8px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {generateCitation(citation.paper, citation.format)}
                    </p>
                    <p style={{ fontSize: '11px', color: THEME.text }}>
                      Saved:{' '}
                      {new Date(citation.savedAt).toLocaleDateString()}
                    </p>
                    <button
                      style={{
                        ...secondaryButtonStyle,
                        marginTop: '10px',
                        fontSize: '11px',
                        padding: '6px 10px',
                      }}
                      onClick={() => {
                        setCitations((prev) =>
                          prev.filter((c) => c.id !== citation.id)
                        );
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.transform =
                          'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.transform =
                          'scale(1)';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIOBOOK LOUNGE TAB */}
        {activeTab === 'audiobooks' && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                Featured LibriVox Audiobooks
              </h3>
              <div style={audiobookGridStyle}>
                {DEMO_AUDIOBOOKS.map((audiobook) => {
                  const isSaved = savedItems.audiobooks.find(
                    (a) => a.id === audiobook.id
                  );
                  return (
                    <div key={audiobook.id} style={audiobookCardStyle}>
                      <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                        {audiobook.cover}
                      </div>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {audiobook.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {audiobook.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        Narrator: {audiobook.narrator}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.primary }}>
                        ⏱️ {audiobook.duration}
                      </p>
                      <p style={{ fontSize: '11px', color: THEME.accent }}>
                        {audiobook.genre}
                      </p>
                      <button
                        style={{
                          ...buttonStyle,
                          marginTop: '12px',
                          backgroundColor: isSaved
                            ? THEME.mint
                            : THEME.primary,
                          color: THEME.bg,
                          boxShadow: `0 0 10px ${
                            isSaved ? THEME.mint : THEME.primary
                          }`,
                        }}
                        onClick={() => saveAudiobook(audiobook)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1)';
                        }}
                      >
                        {isSaved ? '💾 Saved' : '🎧 Save'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {savedItems.audiobooks.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                  My Audiobook Collection
                </h3>
                <div style={audiobookGridStyle}>
                  {savedItems.audiobooks.map((audiobook) => (
                    <div key={audiobook.id} style={audiobookCardStyle}>
                      <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                        {audiobook.cover}
                      </div>
                      <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                        {audiobook.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: THEME.accent }}>
                        {audiobook.author}
                      </p>
                      <p style={{ fontSize: '12px', color: THEME.text }}>
                        {audiobook.duration}
                      </p>
                      <button
                        style={{
                          ...secondaryButtonStyle,
                          marginTop: '12px',
                          fontSize: '11px',
                          padding: '6px 10px',
                        }}
                        onClick={() => saveAudiobook(audiobook)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.transform =
                            'scale(1)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* OFFLINE LIBRARY TAB */}
        {activeTab === 'offline' && (
          <div>
            {allBooks.length === 0 &&
            savedItems.comics.length === 0 &&
            savedItems.audiobooks.length === 0 &&
            citations.length === 0 ? (
              <div style={emptyStateStyle}>
                <p>
                  Your offline library is empty. Start saving items to build
                  your collection! 📚✨
                </p>
              </div>
            ) : (
              <>
                {allBooks.length > 0 && (
                  <div style={cardStyle}>
                    <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                      📚 Saved Books ({allBooks.length})
                    </h3>
                    <div style={bookGridStyle}>
                      {allBooks.map((book) => (
                        <div key={book.id} style={bookCardStyle}>
                          <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                            {book.title}
                          </h4>
                          <p style={{ fontSize: '13px', color: THEME.accent }}>
                            {book.author}
                          </p>
                          <p style={{ fontSize: '12px', color: THEME.text }}>
                            {book.genre}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedItems.comics.length > 0 && (
                  <div style={cardStyle}>
                    <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                      💜 Saved Comics ({savedItems.comics.length})
                    </h3>
                    <div style={comicGridStyle}>
                      {savedItems.comics.map((comic) => (
                        <div key={comic.id} style={comicCardStyle}>
                          <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                            {comic.cover}
                          </div>
                          <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                            {comic.title}
                          </h4>
                          <p style={{ fontSize: '13px', color: THEME.accent }}>
                            {comic.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedItems.audiobooks.length > 0 && (
                  <div style={cardStyle}>
                    <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                      🎧 Saved Audiobooks ({savedItems.audiobooks.length})
                    </h3>
                    <div style={audiobookGridStyle}>
                      {savedItems.audiobooks.map((audiobook) => (
                        <div key={audiobook.id} style={audiobookCardStyle}>
                          <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                            {audiobook.cover}
                          </div>
                          <h4 style={{ marginBottom: '5px', color: THEME.mint }}>
                            {audiobook.title}
                          </h4>
                          <p style={{ fontSize: '13px', color: THEME.accent }}>
                            {audiobook.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {citations.length > 0 && (
                  <div style={cardStyle}>
                    <h3 style={{ color: THEME.accent, marginBottom: '15px' }}>
                      📋 Saved Citations ({citations.length})
                    </h3>
                    {citations.map((citation) => (
                      <div
                        key={citation.id}
                        style={{
                          ...paperCardStyle,
                          backgroundColor: THEME.darkBg,
                        }}
                      >
                        <p style={{ fontSize: '12px', color: THEME.mint }}>
                          {citation.paper.title}
                        </p>
                        <p style={{ fontSize: '11px', color: THEME.accent }}>
                          {citation.paper.authors.join(', ')} (
                          {citation.paper.year})
                        </p>
                        <p
                          style={{
                            fontSize: '11px',
                            color: THEME.text,
                            marginTop: '8px',
                          }}
                        >
                          {generateCitation(citation.paper, citation.format)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

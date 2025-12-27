import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  IconButton,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  BookOpen,
  Search,
  Plus,
  Bookmark,
  CheckCircle2,
  X,
  Star,
  Edit3,
  Trash2,
  Library,
  Clock,
  BookMarked,
  Heart,
  StickyNote,
  Image,
  Save,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

import { bookRecommendations, BookRecommendation } from '../../data/book_recommendations';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
});

const Subtitle = styled(Typography)({
  color: 'rgba(139, 92, 246, 0.8)',
  fontSize: '1rem',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(139, 92, 246, 0.7)',
  },
  '& .MuiInputAdornment-root svg': {
    color: '#8b5cf6',
  },
});

const StyledSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(139, 92, 246, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: '#8b5cf6',
  },
});

const ActionButton = styled(Button)({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    transform: 'scale(1.02)',
  },
});

const BookGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const BookCard = styled(Card)<{ statuscolor?: string }>(({ statuscolor }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  border: `1px solid ${statuscolor || '#8b5cf6'}30`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${statuscolor || '#8b5cf6'}, ${statuscolor || '#8b5cf6'}80)`,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${statuscolor || '#8b5cf6'}20`,
    border: `1px solid ${statuscolor || '#8b5cf6'}50`,
  },
}));

const BookCover = styled(Box)<{ imageUrl?: string }>(({ imageUrl }) => ({
  width: '100%',
  height: '180px',
  background: imageUrl
    ? `url(${imageUrl}) center/cover no-repeat`
    : 'linear-gradient(135deg, #2a1f3d 0%, #1a1028 100%)',
  borderRadius: '8px',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(10, 8, 18, 0.8) 0%, transparent 50%)',
    borderRadius: '8px',
  },
}));

const StatusBadge = styled(Box)<{ statuscolor?: string }>(({ statuscolor }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: `${statuscolor}20`,
  color: statuscolor,
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  border: `1px solid ${statuscolor}40`,
  zIndex: 2,
}));

const ProgressBar = styled(LinearProgress)({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
    borderRadius: '4px',
  },
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
  },
});

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#8b5cf6',
  },
});

const StyledTab = styled(Tab)({
  color: 'rgba(139, 92, 246, 0.7)',
  '&.Mui-selected': {
    color: '#8b5cf6',
  },
});

const RecommendationCard = styled(Card)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.6) 0%, rgba(13, 13, 26, 0.8) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
});

// Types
export type ReadingStatus = 'want_to_read' | 'currently_reading' | 'finished' | 'abandoned';

export interface BookNote {
  id: string;
  content: string;
  page?: number;
  createdAt: string;
}

export interface TrackedBook {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  currentPage: number;
  genre: string;
  coverImageUrl?: string;
  status: ReadingStatus;
  rating?: number;
  notes: BookNote[];
  startDate?: string;
  finishDate?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<ReadingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  want_to_read: { label: 'Want to Read', color: '#fbbf24', icon: <Bookmark size={14} /> },
  currently_reading: { label: 'Reading', color: '#22c55e', icon: <BookOpen size={14} /> },
  finished: { label: 'Finished', color: '#8b5cf6', icon: <CheckCircle2 size={14} /> },
  abandoned: { label: 'Abandoned', color: '#6b7280', icon: <X size={14} /> },
};

const STORAGE_KEY = 'gothic-library-books';

export const BookTracker: React.FC = () => {
  const [books, setBooks] = useState<TrackedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | 'all'>('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'author' | 'rating'>('recent');
  const [selectedBook, setSelectedBook] = useState<TrackedBook | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pageCount: 0,
    currentPage: 0,
    genre: '',
    coverImageUrl: '',
    status: 'want_to_read' as ReadingStatus,
    rating: 0,
  });

  const [newNote, setNewNote] = useState({ content: '', page: '' });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load books:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  // Get unique genres from books
  const genres = useMemo(() => {
    const genreSet = new Set(books.map(b => b.genre).filter(Boolean));
    return ['all', ...Array.from(genreSet)];
  }, [books]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }

    // Genre filter
    if (filterGenre !== 'all') {
      result = result.filter(b => b.genre === filterGenre);
    }

    // Sort
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return result;
  }, [books, searchQuery, filterStatus, filterGenre, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = books.length;
    const finished = books.filter(b => b.status === 'finished').length;
    const reading = books.filter(b => b.status === 'currently_reading').length;
    const wantToRead = books.filter(b => b.status === 'want_to_read').length;
    const totalPages = books.filter(b => b.status === 'finished').reduce((sum, b) => sum + b.pageCount, 0);
    const avgRating = books.filter(b => b.rating).length > 0
      ? books.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / books.filter(b => b.rating).length
      : 0;

    return { total, finished, reading, wantToRead, totalPages, avgRating };
  }, [books]);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      pageCount: 0,
      currentPage: 0,
      genre: '',
      coverImageUrl: '',
      status: 'want_to_read',
      rating: 0,
    });
    setNewNote({ content: '', page: '' });
  };

  const handleAddBook = () => {
    if (!formData.title || !formData.author) return;

    const newBook: TrackedBook = {
      id: `book-${Date.now()}`,
      ...formData,
      notes: [],
      startDate: formData.status === 'currently_reading' ? new Date().toISOString() : undefined,
      finishDate: formData.status === 'finished' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBooks(prev => [newBook, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateBook = () => {
    if (!selectedBook) return;

    setBooks(prev => prev.map(b =>
      b.id === selectedBook.id
        ? {
            ...selectedBook,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : b
    ));
    setIsEditDialogOpen(false);
    setSelectedBook(null);
    resetForm();
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
    setSelectedBook(null);
  };

  const handleAddNote = () => {
    if (!selectedBook || !newNote.content) return;

    const note: BookNote = {
      id: `note-${Date.now()}`,
      content: newNote.content,
      page: newNote.page ? parseInt(newNote.page) : undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedBook = {
      ...selectedBook,
      notes: [...selectedBook.notes, note],
      updatedAt: new Date().toISOString(),
    };

    setBooks(prev => prev.map(b => b.id === selectedBook.id ? updatedBook : b));
    setSelectedBook(updatedBook);
    setNewNote({ content: '', page: '' });
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedBook) return;

    const updatedBook = {
      ...selectedBook,
      notes: selectedBook.notes.filter(n => n.id !== noteId),
      updatedAt: new Date().toISOString(),
    };

    setBooks(prev => prev.map(b => b.id === selectedBook.id ? updatedBook : b));
    setSelectedBook(updatedBook);
  };

  const handleUpdateProgress = (bookId: string, newPage: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== bookId) return b;

      const updatedBook = {
        ...b,
        currentPage: Math.min(Math.max(0, newPage), b.pageCount),
        updatedAt: new Date().toISOString(),
      };

      // Auto-mark as finished if reached end
      if (updatedBook.currentPage >= b.pageCount && b.status === 'currently_reading') {
        updatedBook.status = 'finished';
        updatedBook.finishDate = new Date().toISOString();
      }

      return updatedBook;
    }));
  };

  const handleAddFromRecommendation = (rec: BookRecommendation) => {
    setFormData({
      title: rec.title,
      author: rec.author,
      pageCount: rec.pageCount,
      currentPage: 0,
      genre: rec.genre,
      coverImageUrl: '',
      status: 'want_to_read',
      rating: 0,
    });
    setShowRecommendations(false);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (book: TrackedBook) => {
    setFormData({
      title: book.title,
      author: book.author,
      pageCount: book.pageCount,
      currentPage: book.currentPage,
      genre: book.genre,
      coverImageUrl: book.coverImageUrl || '',
      status: book.status,
      rating: book.rating || 0,
    });
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Library size={36} />
          Gothic Library
        </Title>
        <Subtitle>Track your reading journey through the shadows</Subtitle>
      </Header>

      {/* Stats Panel */}
      <Box sx={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '32px'
      }}>
        {[
          { icon: <Library size={20} />, value: stats.total, label: 'Total Books' },
          { icon: <BookOpen size={20} />, value: stats.reading, label: 'Reading' },
          { icon: <CheckCircle2 size={20} />, value: stats.finished, label: 'Finished' },
          { icon: <Bookmark size={20} />, value: stats.wantToRead, label: 'To Read' },
          { icon: <Star size={20} />, value: stats.avgRating.toFixed(1), label: 'Avg Rating' },
        ].map((stat, idx) => (
          <Box
            key={idx}
            sx={{
              background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
              borderRadius: '16px',
              padding: '16px 24px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '120px',
            }}
          >
            <Box sx={{ color: '#8b5cf6' }}>{stat.icon}</Box>
            <Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(139, 92, 246, 0.7)', textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
        <ActionButton onClick={() => setIsAddDialogOpen(true)} startIcon={<Plus size={18} />}>
          Add Book
        </ActionButton>
        <ActionButton
          onClick={() => setShowRecommendations(true)}
          startIcon={<Sparkles size={18} />}
          sx={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0a0812' }}
        >
          Browse Recommendations
        </ActionButton>
      </Box>

      {/* Filters */}
      <Box sx={{
        display: 'flex',
        gap: '16px',
        maxWidth: '1200px',
        margin: '0 auto 24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <StyledTextField
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />

        <StyledSelect sx={{ minWidth: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value as ReadingStatus | 'all')}
          >
            <MenuItem value="all">All Status</MenuItem>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {config.icon}
                  {config.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </StyledSelect>

        <StyledSelect sx={{ minWidth: '150px' }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterGenre}
            label="Genre"
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            {genres.map(genre => (
              <MenuItem key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre}
              </MenuItem>
            ))}
          </Select>
        </StyledSelect>

        <StyledSelect sx={{ minWidth: '150px' }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <MenuItem value="recent">Recently Updated</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </StyledSelect>
      </Box>

      {/* Book Grid */}
      <BookGrid>
        {filteredBooks.map(book => {
          const statusConfig = STATUS_CONFIG[book.status];
          const progress = book.pageCount > 0 ? (book.currentPage / book.pageCount) * 100 : 0;

          return (
            <BookCard
              key={book.id}
              statuscolor={statusConfig.color}
              onClick={() => setSelectedBook(book)}
            >
              <StatusBadge statuscolor={statusConfig.color}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Box>
              </StatusBadge>
              <CardContent sx={{ padding: '20px' }}>
                <BookCover imageUrl={book.coverImageUrl}>
                  {!book.coverImageUrl && (
                    <BookOpen size={48} color="rgba(139, 92, 246, 0.3)" style={{ zIndex: 1 }} />
                  )}
                </BookCover>

                <Typography sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#f0e6ff',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {book.title}
                </Typography>

                <Typography sx={{
                  fontSize: '0.875rem',
                  color: 'rgba(240, 230, 255, 0.7)',
                  marginBottom: '8px',
                }}>
                  by {book.author}
                </Typography>

                {book.genre && (
                  <Chip
                    label={book.genre}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      color: '#a855f7',
                      fontSize: '0.7rem',
                      height: '22px',
                      marginBottom: '12px',
                    }}
                  />
                )}

                {book.status === 'currently_reading' && (
                  <Box sx={{ marginBottom: '8px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)' }}>
                        Progress
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#8b5cf6' }}>
                        {book.currentPage} / {book.pageCount} pages
                      </Typography>
                    </Box>
                    <ProgressBar variant="determinate" value={progress} />
                  </Box>
                )}

                {book.rating && book.rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Rating value={book.rating} readOnly size="small" sx={{
                      '& .MuiRating-iconFilled': { color: '#fbbf24' },
                      '& .MuiRating-iconEmpty': { color: 'rgba(251, 191, 36, 0.3)' },
                    }} />
                  </Box>
                )}

                {book.notes.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <StickyNote size={14} color="rgba(240, 230, 255, 0.5)" />
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.5)' }}>
                      {book.notes.length} note{book.notes.length > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </BookCard>
          );
        })}
      </BookGrid>

      {filteredBooks.length === 0 && (
        <Box sx={{ textAlign: 'center', padding: '60px 20px' }}>
          <Library size={64} color="rgba(139, 92, 246, 0.3)" />
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.6)', marginTop: '16px', fontSize: '1.1rem' }}>
            {books.length === 0
              ? 'Your library awaits. Add your first book!'
              : 'No books match your filters'}
          </Typography>
        </Box>
      )}

      {/* Add Book Dialog */}
      <DialogStyled open={isAddDialogOpen} onClose={() => { setIsAddDialogOpen(false); resetForm(); }}>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
          color: '#f0e6ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Plus size={24} color="#8b5cf6" />
            Add New Book
          </Box>
          <IconButton onClick={() => { setIsAddDialogOpen(false); resetForm(); }} sx={{ color: '#f0e6ff' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <StyledTextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            <StyledTextField
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <StyledTextField
                label="Total Pages"
                type="number"
                value={formData.pageCount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
              <StyledTextField
                label="Current Page"
                type="number"
                value={formData.currentPage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPage: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
            </Box>
            <StyledTextField
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              fullWidth
            />
            <StyledTextField
              label="Cover Image URL"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><Image size={18} /></InputAdornment>,
              }}
            />
            <StyledSelect fullWidth>
              <InputLabel>Reading Status</InputLabel>
              <Select
                value={formData.status}
                label="Reading Status"
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ReadingStatus }))}
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {config.icon}
                      {config.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </StyledSelect>
            <Box>
              <Typography sx={{ color: 'rgba(139, 92, 246, 0.8)', marginBottom: '8px' }}>Rating</Typography>
              <Rating
                value={formData.rating}
                onChange={(_, value) => setFormData(prev => ({ ...prev, rating: value || 0 }))}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': { color: '#fbbf24' },
                  '& .MuiRating-iconEmpty': { color: 'rgba(251, 191, 36, 0.3)' },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Button
            onClick={() => { setIsAddDialogOpen(false); resetForm(); }}
            sx={{ color: 'rgba(240, 230, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <ActionButton onClick={handleAddBook} startIcon={<Save size={18} />}>
            Add Book
          </ActionButton>
        </DialogActions>
      </DialogStyled>

      {/* Edit Book Dialog */}
      <DialogStyled open={isEditDialogOpen} onClose={() => { setIsEditDialogOpen(false); resetForm(); }}>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
          color: '#f0e6ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Edit3 size={24} color="#8b5cf6" />
            Edit Book
          </Box>
          <IconButton onClick={() => { setIsEditDialogOpen(false); resetForm(); }} sx={{ color: '#f0e6ff' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <StyledTextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <StyledTextField
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <StyledTextField
                label="Total Pages"
                type="number"
                value={formData.pageCount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
              <StyledTextField
                label="Current Page"
                type="number"
                value={formData.currentPage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPage: parseInt(e.target.value) || 0 }))}
                fullWidth
              />
            </Box>
            <StyledTextField
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              fullWidth
            />
            <StyledTextField
              label="Cover Image URL"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
              fullWidth
            />
            <StyledSelect fullWidth>
              <InputLabel>Reading Status</InputLabel>
              <Select
                value={formData.status}
                label="Reading Status"
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ReadingStatus }))}
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {config.icon}
                      {config.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </StyledSelect>
            <Box>
              <Typography sx={{ color: 'rgba(139, 92, 246, 0.8)', marginBottom: '8px' }}>Rating</Typography>
              <Rating
                value={formData.rating}
                onChange={(_, value) => setFormData(prev => ({ ...prev, rating: value || 0 }))}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': { color: '#fbbf24' },
                  '& .MuiRating-iconEmpty': { color: 'rgba(251, 191, 36, 0.3)' },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Button
            onClick={() => selectedBook && handleDeleteBook(selectedBook.id)}
            sx={{ color: '#ef4444', marginRight: 'auto' }}
            startIcon={<Trash2 size={18} />}
          >
            Delete
          </Button>
          <Button
            onClick={() => { setIsEditDialogOpen(false); resetForm(); }}
            sx={{ color: 'rgba(240, 230, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <ActionButton onClick={handleUpdateBook} startIcon={<Save size={18} />}>
            Save Changes
          </ActionButton>
        </DialogActions>
      </DialogStyled>

      {/* Book Detail Dialog */}
      <DialogStyled
        open={!!selectedBook && !isEditDialogOpen}
        onClose={() => setSelectedBook(null)}
        maxWidth="md"
      >
        {selectedBook && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
              color: '#f0e6ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={24} color="#8b5cf6" />
                {selectedBook.title}
              </Box>
              <Box>
                <IconButton onClick={() => openEditDialog(selectedBook)} sx={{ color: '#8b5cf6' }}>
                  <Edit3 size={20} />
                </IconButton>
                <IconButton onClick={() => setSelectedBook(null)} sx={{ color: '#f0e6ff' }}>
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ padding: '0' }}>
              <StyledTabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ borderBottom: '1px solid rgba(139, 92, 246, 0.2)', px: 2 }}
              >
                <StyledTab label="Details" />
                <StyledTab label={`Notes (${selectedBook.notes.length})`} />
              </StyledTabs>

              <Box sx={{ padding: '24px' }}>
                {activeTab === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                      <BookCover
                        imageUrl={selectedBook.coverImageUrl}
                        sx={{ width: '150px', height: '220px', flexShrink: 0 }}
                      >
                        {!selectedBook.coverImageUrl && (
                          <BookOpen size={48} color="rgba(139, 92, 246, 0.3)" style={{ zIndex: 1 }} />
                        )}
                      </BookCover>
                      <Box>
                        <Typography sx={{ color: '#f0e6ff', fontSize: '1.25rem', fontWeight: 600 }}>
                          {selectedBook.title}
                        </Typography>
                        <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', marginBottom: '12px' }}>
                          by {selectedBook.author}
                        </Typography>
                        <Chip
                          label={STATUS_CONFIG[selectedBook.status].label}
                          icon={STATUS_CONFIG[selectedBook.status].icon as React.ReactElement}
                          sx={{
                            backgroundColor: `${STATUS_CONFIG[selectedBook.status].color}20`,
                            color: STATUS_CONFIG[selectedBook.status].color,
                            marginBottom: '12px',
                          }}
                        />
                        {selectedBook.genre && (
                          <Chip
                            label={selectedBook.genre}
                            sx={{
                              backgroundColor: 'rgba(139, 92, 246, 0.2)',
                              color: '#a855f7',
                              marginLeft: '8px',
                              marginBottom: '12px',
                            }}
                          />
                        )}
                        {selectedBook.rating && selectedBook.rating > 0 && (
                          <Box sx={{ marginTop: '8px' }}>
                            <Rating value={selectedBook.rating} readOnly sx={{
                              '& .MuiRating-iconFilled': { color: '#fbbf24' },
                              '& .MuiRating-iconEmpty': { color: 'rgba(251, 191, 36, 0.3)' },
                            }} />
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Progress Section */}
                    <Box sx={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px',
                    }}>
                      <Typography sx={{ color: '#8b5cf6', fontWeight: 600, marginBottom: '12px' }}>
                        Reading Progress
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <StyledTextField
                          type="number"
                          value={selectedBook.currentPage}
                          onChange={(e) => handleUpdateProgress(selectedBook.id, parseInt(e.target.value) || 0)}
                          sx={{ width: '100px' }}
                          size="small"
                        />
                        <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)' }}>
                          of {selectedBook.pageCount} pages
                        </Typography>
                        <Typography sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                          ({selectedBook.pageCount > 0
                            ? Math.round((selectedBook.currentPage / selectedBook.pageCount) * 100)
                            : 0}%)
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={selectedBook.pageCount > 0
                          ? (selectedBook.currentPage / selectedBook.pageCount) * 100
                          : 0
                        }
                        sx={{ marginTop: '12px' }}
                      />
                    </Box>

                    {/* Dates */}
                    <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {selectedBook.startDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} color="#8b5cf6" />
                          <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontSize: '0.875rem' }}>
                            Started: {new Date(selectedBook.startDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      {selectedBook.finishDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} color="#22c55e" />
                          <Typography sx={{ color: 'rgba(240, 230, 255, 0.7)', fontSize: '0.875rem' }}>
                            Finished: {new Date(selectedBook.finishDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    {/* Add Note Form */}
                    <Box sx={{ marginBottom: '20px' }}>
                      <StyledTextField
                        label="Add a note or highlight"
                        value={newNote.content}
                        onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ marginBottom: '12px' }}
                      />
                      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <StyledTextField
                          label="Page (optional)"
                          type="number"
                          value={newNote.page}
                          onChange={(e) => setNewNote(prev => ({ ...prev, page: e.target.value }))}
                          sx={{ width: '120px' }}
                          size="small"
                        />
                        <ActionButton
                          onClick={handleAddNote}
                          disabled={!newNote.content}
                          startIcon={<Plus size={18} />}
                        >
                          Add Note
                        </ActionButton>
                      </Box>
                    </Box>

                    {/* Notes List */}
                    {selectedBook.notes.length === 0 ? (
                      <Box sx={{ textAlign: 'center', padding: '40px' }}>
                        <StickyNote size={48} color="rgba(139, 92, 246, 0.3)" />
                        <Typography sx={{ color: 'rgba(139, 92, 246, 0.6)', marginTop: '12px' }}>
                          No notes yet. Add your first highlight or thought!
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedBook.notes.map(note => (
                          <Box
                            key={note.id}
                            sx={{
                              background: 'rgba(139, 92, 246, 0.1)',
                              borderRadius: '12px',
                              padding: '16px',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography sx={{ color: '#f0e6ff', flex: 1 }}>
                                {note.content}
                              </Typography>
                              <IconButton
                                onClick={() => handleDeleteNote(note.id)}
                                sx={{ color: 'rgba(239, 68, 68, 0.7)', marginLeft: '8px' }}
                                size="small"
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                              {note.page && (
                                <Typography sx={{ color: 'rgba(139, 92, 246, 0.7)', fontSize: '0.75rem' }}>
                                  Page {note.page}
                                </Typography>
                              )}
                              <Typography sx={{ color: 'rgba(240, 230, 255, 0.5)', fontSize: '0.75rem' }}>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </DialogStyled>

      {/* Recommendations Dialog */}
      <DialogStyled
        open={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
          color: '#f0e6ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={24} color="#fbbf24" />
            Book Recommendations ({bookRecommendations.length}+ books)
          </Box>
          <IconButton onClick={() => setShowRecommendations(false)} sx={{ color: '#f0e6ff' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}>
            {bookRecommendations.map(rec => (
              <RecommendationCard key={rec.id} onClick={() => handleAddFromRecommendation(rec)}>
                <CardContent sx={{ padding: '16px' }}>
                  <Typography sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#f0e6ff',
                    marginBottom: '4px',
                  }}>
                    {rec.title}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.875rem',
                    color: 'rgba(240, 230, 255, 0.7)',
                    marginBottom: '8px',
                  }}>
                    by {rec.author}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <Chip
                      label={rec.genre}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#a855f7',
                        fontSize: '0.7rem',
                        height: '22px',
                      }}
                    />
                    <Chip
                      label={`${rec.pageCount} pages`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(251, 191, 36, 0.2)',
                        color: '#fbbf24',
                        fontSize: '0.7rem',
                        height: '22px',
                      }}
                    />
                  </Box>
                  <Typography sx={{
                    fontSize: '0.8rem',
                    color: 'rgba(240, 230, 255, 0.6)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {rec.description}
                  </Typography>
                </CardContent>
              </RecommendationCard>
            ))}
          </Box>
        </DialogContent>
      </DialogStyled>
    </PageContainer>
  );
};

export default BookTracker;

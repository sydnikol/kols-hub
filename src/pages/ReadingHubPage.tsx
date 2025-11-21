import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Clock, Target, Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  status: 'want-to-read' | 'reading' | 'completed' | 'on-hold' | 'abandoned';
  rating?: number; // 1-5
  pages: number;
  pagesRead: number;
  format: 'physical' | 'ebook' | 'audiobook';
  startDate?: string;
  completedDate?: string;
  notes: string;
}

interface ReadingSession {
  id: string;
  bookTitle: string;
  date: string;
  duration: number; // minutes
  pagesRead: number;
  location: string;
  mood: 'terrible' | 'poor' | 'okay' | 'good' | 'excellent';
  notes: string;
}

interface ReadingGoal {
  id: string;
  goal: string;
  type: 'books-per-year' | 'books-per-month' | 'pages-per-day' | 'hours-per-week' | 'other';
  target: number;
  current: number;
  deadline?: string;
  active: boolean;
}

const ReadingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'sessions' | 'goals' | 'stats'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);

  useEffect(() => {
    const savedBooks = localStorage.getItem('bookLibrary');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    const savedSessions = localStorage.getItem('readingSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    const savedGoals = localStorage.getItem('readingGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => { localStorage.setItem('bookLibrary', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('readingSessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('readingGoals', JSON.stringify(goals)); }, [goals]);

  const addBook = () => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: '',
      author: '',
      genre: [],
      status: 'want-to-read',
      pages: 0,
      pagesRead: 0,
      format: 'physical',
      notes: '',
    };
    setBooks([...books, newBook]);
    toast.success('Book added');
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(books.map(b => b.id === id ? { ...b, ...updates } : b));
    toast.success('Book updated');
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
    toast.success('Book deleted');
  };

  const currentlyReading = books.filter(b => b.status === 'reading').length;
  const completed = books.filter(b => b.status === 'completed').length;
  const totalPages = books.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.pages, 0);
  const toBeRead = books.filter(b => b.status === 'want-to-read').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 pb-20">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Reading Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{books.length}</div>
            <div className="text-xs opacity-90">Books</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{currentlyReading}</div>
            <div className="text-xs opacity-90">Reading</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Check className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completed}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalPages}</div>
            <div className="text-xs opacity-90">Pages</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'books', label: 'Book Library', icon: BookOpen },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'stats', label: 'Stats', icon: Star },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'books' && (
          <div className="space-y-4">
            <button onClick={addBook} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Book</span>
            </button>
            {books.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No books yet. Start building your library!</p>
              </div>
            ) : (
              books.map(book => (
                <div key={book.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${book.status === 'completed' ? 'border-green-500' : book.status === 'reading' ? 'border-teal-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={book.title} onChange={(e) => updateBook(book.id, { title: e.target.value })} placeholder="Book title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-teal-500 outline-none w-full mb-1" />
                      <input type="text" value={book.author} onChange={(e) => updateBook(book.id, { author: e.target.value })} placeholder="Author..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-teal-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteBook(book.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={book.status} onChange={(e) => updateBook(book.id, { status: e.target.value as Book['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none">
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    <select value={book.format} onChange={(e) => updateBook(book.id, { format: e.target.value as Book['format'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none">
                      <option value="physical">Physical Book</option>
                      <option value="ebook">E-Book</option>
                      <option value="audiobook">Audiobook</option>
                    </select>
                    <input type="number" value={book.pages} onChange={(e) => updateBook(book.id, { pages: parseInt(e.target.value) || 0 })} placeholder="Total pages..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Progress: {book.pagesRead}/{book.pages} pages ({book.pages > 0 ? Math.round((book.pagesRead / book.pages) * 100) : 0}%)</label>
                    <input type="range" min="0" max={book.pages} value={book.pagesRead} onChange={(e) => updateBook(book.id, { pagesRead: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Rating: {book.rating ? `${book.rating}/5` : 'Not rated'}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => updateBook(book.id, { rating })} className="transition-colors">
                          <Star className={`w-6 h-6 ${rating <= (book.rating || 0) ? 'fill-teal-500 text-teal-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={book.notes} onChange={(e) => updateBook(book.id, { notes: e.target.value })} placeholder="Notes, thoughts, quotes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-600">Reading Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Books:</span>
                  <span className="font-semibold">{books.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currently Reading:</span>
                  <span className="font-semibold">{currentlyReading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold">{completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Be Read:</span>
                  <span className="font-semibold">{toBeRead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pages Read:</span>
                  <span className="font-semibold">{totalPages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Sessions:</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHubPage;

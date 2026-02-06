import React from 'react';
import { Book, Search, Download, ExternalLink, Database, Star, Clock } from 'lucide-react';

const AnnaArchiveLibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Anna's Archive Library
            </h1>
          </div>
          <p className="text-gray-400">Access millions of books, papers, and educational resources</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books, papers, articles..."
              className="w-full pl-12 pr-4 py-4 bg-purple-900/30 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400 text-lg"
            />
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <a
            href="https://annas-archive.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Book className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold">Anna's Archive</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400">World's largest open library with millions of books</p>
          </a>

          <a
            href="https://libgen.is/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold">Library Genesis</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400">Scientific articles, books, and textbooks</p>
          </a>

          <a
            href="https://z-lib.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold">Z-Library</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400">E-books and articles in various formats</p>
          </a>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Fiction', 'Science', 'History', 'Medicine', 'Technology', 'Philosophy', 'Art', 'Psychology', 'Education', 'Music', 'Literature', 'Mathematics'].map((cat) => (
            <button
              key={cat}
              className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all text-center"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnaArchiveLibraryPage;

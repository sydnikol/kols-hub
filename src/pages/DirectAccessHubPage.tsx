import React from 'react';
import { Zap, ExternalLink, Search, Book, Film, Music, Gamepad2, Code, Database, Globe } from 'lucide-react';

const DirectAccessHubPage: React.FC = () => {
  const resources = [
    // Libraries
    { name: "Anna's Archive", url: 'https://annas-archive.org/', category: 'Libraries', icon: Book },
    { name: 'Library Genesis', url: 'https://libgen.is/', category: 'Libraries', icon: Database },
    { name: 'Z-Library', url: 'https://z-lib.org/', category: 'Libraries', icon: Book },
    { name: 'Sci-Hub', url: 'https://sci-hub.se/', category: 'Libraries', icon: Code },
    { name: 'Internet Archive', url: 'https://archive.org/', category: 'Libraries', icon: Globe },
    { name: 'Project Gutenberg', url: 'https://www.gutenberg.org/', category: 'Libraries', icon: Book },
    // Media
    { name: 'YouTube', url: 'https://youtube.com/', category: 'Media', icon: Film },
    { name: 'Spotify', url: 'https://open.spotify.com/', category: 'Media', icon: Music },
    { name: 'SoundCloud', url: 'https://soundcloud.com/', category: 'Media', icon: Music },
    // Learning
    { name: 'Khan Academy', url: 'https://www.khanacademy.org/', category: 'Learning', icon: Book },
    { name: 'Coursera', url: 'https://www.coursera.org/', category: 'Learning', icon: Book },
    { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/', category: 'Learning', icon: Code },
  ];

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Direct Access Hub
            </h1>
          </div>
          <p className="text-gray-400">45+ quick access resources for learning and entertainment</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-4 bg-purple-900/30 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Resources by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {resources
                .filter((r) => r.category === category)
                .map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all flex items-center gap-3 group"
                  >
                    <res.icon className="w-6 h-6 text-purple-400" />
                    <span className="font-medium">{res.name}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectAccessHubPage;

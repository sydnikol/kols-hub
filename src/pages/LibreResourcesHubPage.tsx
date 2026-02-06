import React from 'react';
import { Book, Code, FileText, Music, Video, Image, ExternalLink, Heart } from 'lucide-react';

const LibreResourcesHubPage: React.FC = () => {
  const resources = [
    { name: 'LibreOffice', url: 'https://www.libreoffice.org/', desc: 'Free office suite', icon: FileText, color: 'green' },
    { name: 'GIMP', url: 'https://www.gimp.org/', desc: 'Image editing', icon: Image, color: 'purple' },
    { name: 'Audacity', url: 'https://www.audacityteam.org/', desc: 'Audio editor', icon: Music, color: 'blue' },
    { name: 'VLC', url: 'https://www.videolan.org/', desc: 'Media player', icon: Video, color: 'orange' },
    { name: 'VS Code', url: 'https://code.visualstudio.com/', desc: 'Code editor', icon: Code, color: 'cyan' },
    { name: 'Calibre', url: 'https://calibre-ebook.com/', desc: 'E-book manager', icon: Book, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-pink-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Libre Resources Hub
            </h1>
          </div>
          <p className="text-gray-400">Free and open source software for everyone</p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <a
              key={res.name}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <res.icon className={`w-8 h-8 text-${res.color}-400`} />
                <h3 className="text-xl font-bold">{res.name}</h3>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
              <p className="text-gray-400">{res.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibreResourcesHubPage;

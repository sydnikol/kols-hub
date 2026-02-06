import React from 'react';
import { Shield, Code, CheckCircle, FileText, ExternalLink, Heart } from 'lucide-react';

const FreeSoftwareCompliancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Free Software Compliance
            </h1>
          </div>
          <p className="text-gray-400">Open source licenses and free software resources</p>
        </div>

        {/* Key Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Freedom 0', desc: 'Run the program for any purpose', icon: Code },
            { title: 'Freedom 1', desc: 'Study how it works and modify it', icon: FileText },
            { title: 'Freedom 2', desc: 'Redistribute copies to help others', icon: Heart },
            { title: 'Freedom 3', desc: 'Distribute modified versions', icon: Shield },
          ].map((freedom, i) => (
            <div key={i} className="p-6 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/30">
              <freedom.icon className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">{freedom.title}</h3>
              <p className="text-gray-400 text-sm">{freedom.desc}</p>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://www.gnu.org/philosophy/free-sw.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold">GNU Philosophy</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400">Learn about free software principles</p>
          </a>

          <a
            href="https://choosealicense.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold">Choose a License</h3>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400">Find the right license for your project</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FreeSoftwareCompliancePage;

import React from 'react';
import { Camera, Code, Palette, FileText, Heart, Users } from 'lucide-react';

const SkillsPortfolio: React.FC = () => {
  const portfolioSections = [
    {
      category: 'Creative Work',
      icon: Palette,
      color: 'pink',
      projects: [
        {
          title: 'Photography Portfolio',
          desc: 'Personal and professional photoshoots',
          type: 'Visual Art',
          count: '127 pieces'
        },
        {
          title: 'Poetry Collection',
          desc: 'Published and unpublished works',
          type: 'Writing',
          count: '43 poems'
        },
        {
          title: 'Performance Archive',
          desc: 'Drag, modeling, and stage performances',
          type: 'Performance',
          count: '15 events'
        }
      ]
    },
    {
      category: 'Technical Projects',
      icon: Code,
      color: 'blue',
      projects: [
        {
          title: 'KOL Personal OS',
          desc: 'Full-stack health & life management app',
          type: 'React + TypeScript',
          count: 'Open source'
        },
        {
          title: 'Accessibility Tools',
          desc: 'WCAG AA compliant component library',
          type: 'Web Development',
          count: 'In progress'
        }
      ]
    },
    {
      category: 'Community Work',
      icon: Users,
      color: 'green',
      projects: [
        {
          title: 'Health Advocacy',
          desc: 'Chronic illness and disability education',
          type: 'Activism',
          count: 'Ongoing'
        },
        {
          title: 'LGBTQ+ Organizing',
          desc: 'Community events and support networks',
          type: 'Community Building',
          count: '2020-Present'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-2">Living Portfolio</h2>
        <p className="text-gray-300">
          Your work automatically gets documented and organized. Perfect for job applications, 
          grant proposals, or showcasing your multidisciplinary talents.
        </p>
      </div>

      {/* Portfolio Sections */}
      {portfolioSections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.category}
            className={`bg-${section.color}-500/10 backdrop-blur-xl rounded-2xl p-6 border border-${section.color}-500/20`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-${section.color}-500/20 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${section.color}-400`} />
              </div>
              <h3 className="text-xl font-bold">{section.category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group"
                >
                  <h4 className="font-semibold mb-1 group-hover:text-white transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">{project.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 bg-${section.color}-500/20 text-${section.color}-400 rounded-full`}>
                      {project.type}
                    </span>
                    <span className="text-xs text-gray-500">{project.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Export Options */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="font-semibold text-lg mb-4">Export & Share</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/20 transition-all text-left">
            <div className="font-medium mb-1">PDF Portfolio</div>
            <div className="text-sm text-gray-400">Professional format for applications</div>
          </button>
          <button className="p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 transition-all text-left">
            <div className="font-medium mb-1">Web Portfolio</div>
            <div className="text-sm text-gray-400">Shareable link with live updates</div>
          </button>
          <button className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-xl border border-green-500/20 transition-all text-left">
            <div className="font-medium mb-1">GitHub README</div>
            <div className="text-sm text-gray-400">Markdown format for repositories</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsPortfolio;

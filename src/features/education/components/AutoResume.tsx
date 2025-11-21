import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Eye, Edit, Sparkles, 
  Briefcase, GraduationCap, Award, Code, 
  Heart, Users, TrendingUp, Share2, Copy, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEducationStore } from '../store/educationStore';

const AutoResume: React.FC = () => {
  const { credits, totalCredits, passiveSessions, resumeData, updateResume } = useEducationStore();
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');

  // Auto-generate resume data from education tracking
  useEffect(() => {
    const autoEducation = {
      degree: totalCredits >= 60 ? 'Associate Degree (In Progress)' : 'College Credits Earned',
      credits: totalCredits,
      sources: [...new Set(credits.map(c => c.source))],
      recentExams: credits.filter(c => c.completed).slice(-5)
    };

    const autoSkills = {
      technical: ['Self-Directed Learning', 'Online Education', 'Time Management'],
      soft: ['Adaptability', 'Persistence', 'Independent Study'],
      platforms: ['CLEP', 'DSST', 'Sophia Learning', 'Saylor Academy', 'Coursera', 'Khan Academy'],
      learning: passiveSessions.length
    };

    updateResume({
      education: autoEducation,
      skills: autoSkills,
      lastUpdated: new Date().toISOString()
    });
  }, [credits, totalCredits, passiveSessions]);

  const templates = [
    { id: 'professional', name: 'Professional', color: 'blue' },
    { id: 'creative', name: 'Creative', color: 'purple' },
    { id: 'minimal', name: 'Minimal', color: 'gray' },
    { id: 'modern', name: 'Modern', color: 'pink' }
  ];

  const copyToClipboard = () => {
    const resumeText = JSON.stringify(resumeData, null, 2);
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Auto-Generated Resume</h2>
              <p className="text-gray-400 text-sm">Built from your learning journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Education
            </h3>
            {resumeData?.education && (
              <div className="text-sm text-gray-300">
                <p className="font-medium">{resumeData.education.degree}</p>
                <p className="text-gray-400">{resumeData.education.credits} credits earned</p>
                <p className="text-gray-400 text-xs mt-1">
                  Sources: {resumeData.education.sources.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Skills
            </h3>
            {resumeData?.skills && (
              <div className="text-sm text-gray-300 space-y-2">
                <div>
                  <p className="text-xs text-gray-400">Technical:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resumeData.skills.technical.map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-blue-500/20 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Soft Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resumeData.skills.soft.map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-purple-500/20 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            Last updated: {resumeData?.lastUpdated ? new Date(resumeData.lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              selectedTemplate === template.id
                ? `bg-${template.color}-500/30 border-${template.color}-500/50`
                : 'bg-white/5 border-white/10'
            } border`}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutoResume;

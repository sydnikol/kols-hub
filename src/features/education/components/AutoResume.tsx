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


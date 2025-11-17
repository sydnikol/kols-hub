import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Award, TrendingUp, Download, Eye, Sparkles } from 'lucide-react';
import { learningService } from '../services/learningService';

const LearningDashboard: React.FC = () => {
  const [dailySummary, setDailySummary] = useState<any>(null);
  const [skillProgress, setSkillProgress] = useState<any[]>([]);
  const [resumeBullets, setResumeBullets] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [summary, progress, bullets, trans] = await Promise.all([
      learningService.getDailySummary(),
      learningService.getSkillProgress(),
      learningService.generateResumeBullets(),
      learningService.generateTranscript()
    ]);
    
    setDailySummary(summary);
    setSkillProgress(progress);
    setResumeBullets(bullets);
    setTranscript(trans);
    setLoading(false);
  };

  const exportPortfolio = async (format: 'pdf' | 'web' | 'notion') => {
    const portfolio = await learningService.exportPortfolio(format);
    
    if (format === 'web') {
      // Create and download HTML
      const blob = new Blob([portfolio as string], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kol-learning-portfolio.html';
      a.click();
    } else {
      // Download JSON for now (PDF generation would need additional library)
      const blob = new Blob([JSON.stringify(portfolio, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kol-portfolio.${format === 'pdf' ? 'json' : format}`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="text-[#9d7bd8] flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 animate-pulse" />
          <p>Loading your growth journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#c8b7e5] p-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#9d7bd8] mb-2 flex items-center gap-3">
            <Brain className="w-12 h-12" />
            Learning Without Trauma
          </h1>
          <p className="text-xl text-[#8c6bb1] italic">
            Growth through joy. Skills through lived experience.
          </p>
        </div>

        {/* Daily Summary Card */}
        <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] rounded-lg p-6 mb-8 border border-[#4a3a5a]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#9d7bd8]" />
            Today's Growth
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0f]/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#9d7bd8]">{dailySummary.momentsToday}</div>
              <div className="text-sm text-[#8c6bb1]">Learning Moments</div>
            </div>
            <div className="bg-[#0a0a0f]/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#9d7bd8]">{dailySummary.pathwaysEngaged}</div>
              <div className="text-sm text-[#8c6bb1]">Pathways Active</div>
            </div>
            <div className="bg-[#0a0a0f]/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#9d7bd8]">{dailySummary.skillsPracticed}</div>
              <div className="text-sm text-[#8c6bb1]">Skills Practiced</div>
            </div>
            <div className="bg-[#0a0a0f]/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#9d7bd8]">{dailySummary.portfolioPiecesCreated}</div>
              <div className="text-sm text-[#8c6bb1]">Portfolio Pieces</div>
            </div>
          </div>
          
          <p className="mt-4 text-center text-lg text-[#9d7bd8] italic">
            "{dailySummary.message}"
          </p>
        </div>

        {/* Skill Progress */}
        <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] rounded-lg p-6 mb-8 border border-[#4a3a5a]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#9d7bd8]" />
            Your Learning Pathways
          </h2>
          
          <div className="space-y-4">
            {skillProgress.map((progress, index) => (
              <div key={index} className="bg-[#0a0a0f]/50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[#9d7bd8]">{progress.pathwayName}</h3>
                    <p className="text-sm text-[#8c6bb1]">{progress.moduleName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#8c6bb1]">
                      {Math.floor(progress.hoursEstimated)} hours
                    </div>
                    <div className="text-sm text-[#9d7bd8]">
                      {progress.portfolioPieces} pieces
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {progress.skillsAcquired.slice(0, 5).map((skill: string, i: number) => (
                    <span key={i} className="bg-[#2a1a3a] px-3 py-1 rounded-full text-sm text-[#c8b7e5]">
                      {skill.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {progress.skillsAcquired.length > 5 && (
                    <span className="bg-[#2a1a3a] px-3 py-1 rounded-full text-sm text-[#8c6bb1]">
                      +{progress.skillsAcquired.length - 5} more
                    </span>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-[#8c6bb1]">
                  Resume Value: {progress.resumeValue}
                </div>
              </div>
            ))}
            
            {skillProgress.length === 0 && (
              <div className="text-center py-8 text-[#8c6bb1]">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your learning journey starts with the first step.</p>
                <p className="text-sm mt-2">Use the app naturally. Learning happens automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resume Bullets */}
        {resumeBullets.length > 0 && (
          <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] rounded-lg p-6 mb-8 border border-[#4a3a5a]">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#9d7bd8]" />
              Resume-Ready Achievements
            </h2>
            
            <ul className="space-y-2">
              {resumeBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#9d7bd8] mt-1">•</span>
                  <span className="text-[#c8b7e5]">{bullet}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(resumeBullets.join('\n'));
                alert('Copied to clipboard!');
              }}
              className="mt-4 bg-[#9d7bd8] text-[#0a0a0f] px-4 py-2 rounded-lg hover:bg-[#8c6bb1] transition-colors"
            >
              Copy All Bullets
            </button>
          </div>
        )}

        {/* College Transcript */}
        {transcript && transcript.totalCredits > 0 && (
          <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] rounded-lg p-6 mb-8 border border-[#4a3a5a]">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#9d7bd8]" />
              Unofficial Transcript
            </h2>
            
            <div className="mb-4">
              <div className="text-3xl font-bold text-[#9d7bd8]">
                {transcript.totalCredits.toFixed(1)} College Credits
              </div>
              <p className="text-sm text-[#8c6bb1] mt-1">
                Based on life experience and demonstrated competency
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              {transcript.courses.slice(0, 5).map((course: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-[#0a0a0f]/50 p-3 rounded-lg">
                  <div>
                    <div className="font-semibold text-[#c8b7e5]">{course.courseCode}</div>
                    <div className="text-sm text-[#8c6bb1]">{course.courseName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#9d7bd8]">{course.credits.toFixed(1)} credits</div>
                    <div className="text-sm text-[#8c6bb1]">Grade: {course.grade}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-[#8c6bb1] italic">
              Note: This transcript documents life experience learning. Many colleges accept Prior Learning Assessment (PLA) for official credit. 
              Export this transcript for portfolio assessment.
            </p>
          </div>
        )}

        {/* Export Options */}
        <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] rounded-lg p-6 border border-[#4a3a5a]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Download className="w-6 h-6 text-[#9d7bd8]" />
            Export Your Learning Portfolio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => exportPortfolio('web')}
              className="bg-[#9d7bd8] text-[#0a0a0f] px-6 py-3 rounded-lg hover:bg-[#8c6bb1] transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Web Portfolio
            </button>
            <button
              onClick={() => exportPortfolio('notion')}
              className="bg-[#4a3a5a] text-[#c8b7e5] px-6 py-3 rounded-lg hover:bg-[#5a4a6a] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Notion Export
            </button>
            <button
              onClick={() => exportPortfolio('pdf')}
              className="bg-[#4a3a5a] text-[#c8b7e5] px-6 py-3 rounded-lg hover:bg-[#5a4a6a] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              PDF (JSON)
            </button>
          </div>
          
          <p className="mt-4 text-sm text-[#8c6bb1]">
            These exports are ready for college PLA submissions, job applications, or personal documentation.
          </p>
        </div>

        {/* Philosophy Statement */}
        <div className="mt-8 bg-[#1a0a2e]/50 p-6 rounded-lg border border-[#4a3a5a]">
          <h3 className="text-xl font-semibold text-[#9d7bd8] mb-3">The Philosophy</h3>
          <div className="space-y-2 text-[#c8b7e5]">
            <p>✨ <strong>No deadlines.</strong> Learn at your own pace, always.</p>
            <p>✨ <strong>No grades.</strong> Growth is documented, not judged.</p>
            <p>✨ <strong>No classrooms.</strong> Learn while living your life.</p>
            <p>✨ <strong>No pressure.</strong> You can hide any learning feature anytime.</p>
            <p>✨ <strong>No comparison.</strong> Your journey, your timeline.</p>
            <p className="text-[#9d7bd8] italic mt-4">
              "Learning happens in the margins of your life, not in spite of it. Every moment you engage with this app, you're building skills. Every photo you upload, every theme you create, every word you write—it's all education. It all counts. And you never have to sit in a classroom again."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;

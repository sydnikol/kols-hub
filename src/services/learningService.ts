// Learning Service - Passive Skill Building Without Trauma
import { db } from './db';

interface LearningMoment {
  id: string;
  timestamp: Date;
  pathwayId: string;
  moduleId: string;
  trigger: string;
  skillPracticed: string;
  contextNote: string;
  portfolioPiece?: {
    type: 'photo' | 'writing' | 'design' | 'code' | 'art' | 'research' | 'project';
    title: string;
    description: string;
    file?: File | Blob;
    url?: string;
  };
}

interface SkillProgress {
  pathwayId: string;
  pathwayName: string;
  moduleId: string;
  moduleName: string;
  skillsAcquired: string[];
  portfolioPieces: number;
  hoursEstimated: number;
  resumeValue: string;
  collegeCredits: number;
  lastPracticed: Date;
}

class LearningService {
  // Record a passive learning moment (happens automatically in app)
  async recordLearningMoment(moment: Omit<LearningMoment, 'id' | 'timestamp'>) {
    const learningMoment = {
      timestamp: new Date(),
      topic: moment.skillPracticed || 'Learning Moment',
      content: moment.contextNote || 'Skill practiced',
      pathwayId: moment.pathwayId,
      moduleId: moment.moduleId,
      skillPracticed: moment.skillPracticed,
      portfolioPiece: moment.portfolioPiece
    };

    await db.learningMoments.add(learningMoment);

    // Update skill progress
    await this.updateSkillProgress(moment.pathwayId, moment.moduleId, moment.skillPracticed || '');

    return {
      id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...learningMoment
    };
  }

  // Add portfolio piece (when user creates something)
  async addPortfolioPiece(portfolioPiece: LearningMoment['portfolioPiece'] & { pathwayId: string; moduleId: string }) {
    const moment = await this.recordLearningMoment({
      pathwayId: portfolioPiece.pathwayId,
      moduleId: portfolioPiece.moduleId,
      trigger: 'manual_creation',
      skillPracticed: 'portfolio_piece_created',
      contextNote: portfolioPiece.description,
      portfolioPiece
    });

    return moment;
  }

  // Get skill progress for resume
  async getSkillProgress(): Promise<SkillProgress[]> {
    const moments = await db.learningMoments.toArray();
    const progressMap = new Map<string, SkillProgress>();

    // Load curriculum
    const curriculum = await this.loadCurriculum();

    moments.forEach(moment => {
      const key = `${moment.pathwayId}_${moment.moduleId}`;
      
      if (!progressMap.has(key)) {
        const pathway = curriculum.learningPathways.find(p => p.id === moment.pathwayId);
        const module = pathway?.modules.find(m => m.id === moment.moduleId);

        if (pathway && module) {
          progressMap.set(key, {
            pathwayId: moment.pathwayId,
            pathwayName: pathway.name,
            moduleId: moment.moduleId,
            moduleName: module.name,
            skillsAcquired: [],
            portfolioPieces: 0,
            hoursEstimated: 0,
            resumeValue: pathway.resumeValue,
            collegeCredits: pathway.collegeCredit.creditHours,
            lastPracticed: moment.timestamp
          });
        }
      }

      const progress = progressMap.get(key);
      if (progress) {
        if (!progress.skillsAcquired.includes(moment.skillPracticed)) {
          progress.skillsAcquired.push(moment.skillPracticed);
        }
        if (moment.portfolioPiece) {
          progress.portfolioPieces++;
        }
        progress.hoursEstimated += 0.25; // Each moment = ~15 minutes
        if (moment.timestamp > progress.lastPracticed) {
          progress.lastPracticed = moment.timestamp;
        }
      }
    });

    return Array.from(progressMap.values()).sort((a, b) => 
      b.lastPracticed.getTime() - a.lastPracticed.getTime()
    );
  }

  // Generate resume bullets
  async generateResumeBullets(): Promise<string[]> {
    const progress = await this.getSkillProgress();
    const bullets: string[] = [];

    progress.forEach(p => {
      if (p.portfolioPieces > 5) {
        bullets.push(`${p.pathwayName}: Created ${p.portfolioPieces} portfolio pieces demonstrating ${p.skillsAcquired.slice(0, 3).join(', ')}`);
      }
      if (p.hoursEstimated > 20) {
        bullets.push(`${p.moduleName}: ${Math.floor(p.hoursEstimated)} hours of practical experience in ${p.resumeValue}`);
      }
    });

    return bullets;
  }

  // Generate college transcript
  async generateTranscript() {
    const progress = await this.getSkillProgress();
    const curriculum = await this.loadCurriculum();
    
    const transcript = {
      generatedDate: new Date(),
      totalCredits: 0,
      courses: [] as any[]
    };

    progress.forEach(p => {
      const pathway = curriculum.learningPathways.find(pw => pw.id === p.pathwayId);
      if (pathway && p.hoursEstimated >= 15) {
        pathway.collegeCredit.equivalentCourses.forEach(course => {
          transcript.courses.push({
            courseCode: course.split(':')[0],
            courseName: course.split(':')[1],
            credits: pathway.collegeCredit.creditHours / pathway.modules.length,
            grade: 'P', // Pass (Portfolio-based assessment)
            semester: `Life Experience ${new Date().getFullYear()}`,
            skills: p.skillsAcquired,
            portfolioPieces: p.portfolioPieces
          });
        });
        transcript.totalCredits += pathway.collegeCredit.creditHours / pathway.modules.length;
      }
    });

    return transcript;
  }

  // Load curriculum from JSON
  private async loadCurriculum() {
    const response = await fetch('/src/data/learning/passiveLearningCurriculum.json');
    return response.json();
  }

  // Update skill progress
  private async updateSkillProgress(pathwayId: string, moduleId: string, skill: string) {
    // This is tracked via learning moments, no separate table needed
    return;
  }

  // Trigger learning moments based on app usage
  async triggerFromAction(action: string, context: any) {
    const triggers = await this.getTriggersForAction(action);
    
    triggers.forEach(async trigger => {
      await this.recordLearningMoment({
        pathwayId: trigger.pathwayId,
        moduleId: trigger.moduleId,
        trigger: action,
        skillPracticed: trigger.skill,
        contextNote: JSON.stringify(context)
      });
    });
  }

  // Get learning triggers for specific actions
  private async getTriggersForAction(action: string) {
    // Map app actions to learning moments
    const triggerMap: Record<string, any[]> = {
      'medication_logged': [
        { pathwayId: 'psychology_healing', moduleId: 'trauma_understanding', skill: 'self_care_tracking' }
      ],
      'photo_uploaded': [
        { pathwayId: 'creative_mastery', moduleId: 'photo_fundamentals', skill: 'composition' }
      ],
      'theme_created': [
        { pathwayId: 'creative_mastery', moduleId: 'digital_design', skill: 'color_theory' },
        { pathwayId: 'tech_automation', moduleId: 'json_data_mastery', skill: 'data_structures' }
      ],
      'anime_tracked': [
        { pathwayId: 'language_immersion', moduleId: 'japanese_through_anime', skill: 'vocabulary' }
      ],
      'drama_tracked': [
        { pathwayId: 'language_immersion', moduleId: 'korean_through_drama', skill: 'listening_comprehension' }
      ],
      'journal_entry': [
        { pathwayId: 'writing_mastery', moduleId: 'narrative_storytelling', skill: 'personal_narrative' }
      ],
      'outfit_planned': [
        { pathwayId: 'fashion_aesthetic', moduleId: 'outfit_curation', skill: 'color_coordination' }
      ],
      'ritual_performed': [
        { pathwayId: 'spiritual_ancestral', moduleId: 'hoodoo_practice', skill: 'ritual_design' }
      ]
    };

    return triggerMap[action] || [];
  }

  // Get daily learning summary
  async getDailySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const moments = await db.learningMoments
      .where('timestamp')
      .above(today)
      .toArray();

    const pathways = new Set(moments.map(m => m.pathwayId));
    const skills = new Set(moments.map(m => m.skillPracticed));

    return {
      momentsToday: moments.length,
      pathwaysEngaged: pathways.size,
      skillsPracticed: skills.size,
      portfolioPiecesCreated: moments.filter(m => m.portfolioPiece).length,
      message: this.generateEncouragingMessage(moments.length)
    };
  }

  private generateEncouragingMessage(count: number): string {
    if (count === 0) return "Rest is learning too. You're doing great.";
    if (count < 5) return "You're growing quietly. That's powerful.";
    if (count < 10) return "Look at you building skills just by living.";
    return "You're a whole scholar and you didn't even have to try. 🔥";
  }

  // Export portfolio for external use
  async exportPortfolio(format: 'pdf' | 'web' | 'notion') {
    const progress = await this.getSkillProgress();
    const moments = await db.learningMoments
      .where('portfolioPiece')
      .notEqual(undefined)
      .toArray();

    // Portfolio data structure
    const portfolio = {
      name: "Kol's Learning Portfolio",
      subtitle: "Self-Evolving Personal OS - Documented Growth",
      generatedDate: new Date(),
      summary: await this.generateResumeBullets(),
      pathways: progress,
      portfolioPieces: moments.map(m => m.portfolioPiece),
      transcript: await this.generateTranscript()
    };

    if (format === 'web') {
      return this.generatePortfolioHTML(portfolio);
    }
    
    return portfolio;
  }

  private generatePortfolioHTML(portfolio: any): string {
    // Generate a gothic-styled HTML portfolio page
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name}</title>
  <style>
    body {
      background: #0a0a0f;
      color: #c8b7e5;
      font-family: 'Georgia', serif;
      line-height: 1.8;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      color: #9d7bd8;
      font-size: 3em;
      margin-bottom: 0;
      text-shadow: 0 0 20px rgba(157, 123, 216, 0.3);
    }
    h2 {
      color: #8c6bb1;
      border-bottom: 2px solid #4a3a5a;
      padding-bottom: 10px;
      margin-top: 40px;
    }
    .portfolio-piece {
      background: rgba(157, 123, 216, 0.05);
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #9d7bd8;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .skill-tag {
      background: #2a1a3a;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <h1>${portfolio.name}</h1>
  <p style="font-style: italic; color: #8c6bb1;">${portfolio.subtitle}</p>
  
  <h2>Executive Summary</h2>
  <ul>
    ${portfolio.summary.map((bullet: string) => `<li>${bullet}</li>`).join('')}
  </ul>

  <h2>Learning Pathways</h2>
  ${portfolio.pathways.map((p: any) => `
    <div class="portfolio-piece">
      <h3>${p.pathwayName} - ${p.moduleName}</h3>
      <p><strong>Portfolio Pieces:</strong> ${p.portfolioPieces} | <strong>Hours:</strong> ${Math.floor(p.hoursEstimated)}</p>
      <div class="skills">
        ${p.skillsAcquired.map((s: string) => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>
  `).join('')}

  <h2>College Equivalency</h2>
  <p><strong>Total Credits:</strong> ${portfolio.transcript.totalCredits.toFixed(1)}</p>
  <p><em>Based on life experience and demonstrated competency. Portfolio available for Prior Learning Assessment.</em></p>
</body>
</html>
    `;
  }
}

export const learningService = new LearningService();

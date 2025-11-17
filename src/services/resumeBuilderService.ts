import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ResumeItem {
  id: string;
  type: 'course' | 'project' | 'skill' | 'certification';
  title: string;
  description: string;
  dateCompleted?: string;
  verified: boolean;
  platform?: string;
  url?: string;
  skills?: string[];
  highlights?: string[];
}

interface ResumeBuildDB extends DBSchema {
  resumeItems: {
    key: string;
    value: ResumeItem;
    indexes: {
      'by-type': string;
      'by-date': string;
    };
  };
}

class ResumeBuilderService {
  private db: IDBPDatabase<ResumeBuildDB> | null = null;

  async initDB(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<ResumeBuildDB>('kol-resume-builder-db', 1, {
      upgrade(db) {
        const itemStore = db.createObjectStore('resumeItems', { keyPath: 'id' });
        itemStore.createIndex('by-type', 'type');
        itemStore.createIndex('by-date', 'dateCompleted');
      },
    });
  }

  async getResumeItems(): Promise<ResumeItem[]> {
    await this.initDB();
    if (!this.db) return [];
    return await this.db.getAll('resumeItems');
  }

  async addResumeItem(item: Omit<ResumeItem, 'id'>): Promise<string> {
    await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    const id = `resume-item-${Date.now()}`;
    const newItem: ResumeItem = { ...item, id };
    await this.db.add('resumeItems', newItem);
    return id;
  }

  async updateResumeItem(id: string, updates: Partial<ResumeItem>): Promise<void> {
    await this.initDB();
    if (!this.db) return;

    const item = await this.db.get('resumeItems', id);
    if (!item) return;

    const updatedItem = { ...item, ...updates };
    await this.db.put('resumeItems', updatedItem);
  }

  async deleteResumeItem(id: string): Promise<void> {
    await this.initDB();
    if (!this.db) return;
    await this.db.delete('resumeItems', id);
  }

  // Auto-generate resume content from completed course
  async generateFromCourse(course: any): Promise<ResumeItem> {
    const item: Omit<ResumeItem, 'id'> = {
      type: course.type === 'credit' ? 'course' : 'certification',
      title: course.title,
      description: this.generateCourseDescription(course),
      dateCompleted: course.dateCompleted || new Date().toISOString(),
      verified: true,
      platform: course.platform,
      url: course.url,
      skills: this.extractSkillsFromCourse(course),
      highlights: this.generateHighlights(course)
    };

    const id = await this.addResumeItem(item);
    return { ...item, id };
  }

  private generateCourseDescription(course: any): string {
    if (course.type === 'credit') {
      return `Completed ${course.credits}-credit college course through ${course.platform}. Demonstrated mastery of course material through comprehensive examination.`;
    } else if (course.type === 'certificate') {
      return `Earned professional certificate from ${course.platform}. Completed ${course.timeCommitment} of coursework and hands-on projects.`;
    } else {
      return `Completed intensive ${course.timeCommitment} skill development program through ${course.platform}.`;
    }
  }

  private extractSkillsFromCourse(course: any): string[] {
    // Map common course types to relevant skills
    const skillMap: Record<string, string[]> = {
      'psychology': ['Critical Thinking', 'Research Analysis', 'Human Behavior Understanding'],
      'sociology': ['Social Analysis', 'Research Methods', 'Cultural Competency'],
      'english': ['Written Communication', 'Analysis', 'Academic Writing'],
      'composition': ['Writing', 'Editing', 'Communication'],
      'literature': ['Literary Analysis', 'Critical Reading', 'Interpretation'],
      'data': ['Data Analysis', 'Python', 'SQL', 'Visualization'],
      'web': ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      'project': ['Project Management', 'Agile', 'Leadership'],
      'design': ['UX/UI Design', 'Figma', 'User Research'],
    };

    const title = course.title.toLowerCase();
    for (const [keyword, skills] of Object.entries(skillMap)) {
      if (title.includes(keyword)) {
        return skills;
      }
    }

    return ['Self-Directed Learning', 'Time Management', 'Problem Solving'];
  }

  private generateHighlights(course: any): string[] {
    const highlights: string[] = [];

    if (course.credits >= 3) {
      highlights.push(`Earned ${course.credits} transferable college credits`);
    }

    if (course.platform.toLowerCase().includes('modern states')) {
      highlights.push('Completed through ACE-approved examination program');
    }

    if (course.platform.toLowerCase().includes('google')) {
      highlights.push('Industry-recognized certification from Google');
    }

    if (course.type === 'skill') {
      highlights.push('Built portfolio of practical projects');
    }

    return highlights;
  }

  // Generate formatted resume sections
  async generateResumeSection(type: ResumeItem['type']): Promise<string> {
    await this.initDB();
    if (!this.db) return '';

    const items = await this.db.getAllFromIndex('resumeItems', 'by-type', type);
    if (items.length === 0) return '';

    let section = '';

    switch (type) {
      case 'course':
        section = '## Education\n\n';
        items.forEach(item => {
          section += `**${item.title}**\n`;
          section += `${item.platform || 'Self-Study'}\n`;
          if (item.dateCompleted) {
            section += `Completed: ${new Date(item.dateCompleted).toLocaleDateString()}\n`;
          }
          section += `${item.description}\n\n`;
        });
        break;

      case 'certification':
        section = '## Certifications\n\n';
        items.forEach(item => {
          section += `**${item.title}**\n`;
          section += `${item.platform}\n`;
          if (item.dateCompleted) {
            section += `${new Date(item.dateCompleted).toLocaleDateString()}\n`;
          }
          if (item.url) {
            section += `Credential: ${item.url}\n`;
          }
          section += '\n';
        });
        break;

      case 'skill':
        section = '## Skills\n\n';
        const allSkills = new Set<string>();
        items.forEach(item => {
          item.skills?.forEach(skill => allSkills.add(skill));
        });
        section += Array.from(allSkills).join(' • ') + '\n\n';
        break;

      case 'project':
        section = '## Projects\n\n';
        items.forEach(item => {
          section += `**${item.title}**\n`;
          section += `${item.description}\n`;
          if (item.highlights && item.highlights.length > 0) {
            item.highlights.forEach(highlight => {
              section += `• ${highlight}\n`;
            });
          }
          section += '\n';
        });
        break;
    }

    return section;
  }

  async generateFullResume(): Promise<string> {
    let resume = '# Professional Resume\n\n';

    resume += await this.generateResumeSection('course');
    resume += await this.generateResumeSection('certification');
    resume += await this.generateResumeSection('skill');
    resume += await this.generateResumeSection('project');

    return resume;
  }

  // Export formats
  async exportToMarkdown(): Promise<string> {
    return await this.generateFullResume();
  }

  async exportToJSON(): Promise<string> {
    const items = await this.getResumeItems();
    return JSON.stringify(items, null, 2);
  }

  // LinkedIn formatting
  async generateLinkedInSummary(): Promise<string> {
    const items = await this.getResumeItems();
    const certifications = items.filter(i => i.type === 'certification');
    const skills = new Set<string>();
    items.forEach(item => {
      item.skills?.forEach(skill => skills.add(skill));
    });

    let summary = 'Professional with demonstrated commitment to continuous learning and skill development.\n\n';
    
    if (certifications.length > 0) {
      summary += 'Recent Certifications:\n';
      certifications.forEach(cert => {
        summary += `• ${cert.title} (${cert.platform})\n`;
      });
      summary += '\n';
    }

    if (skills.size > 0) {
      summary += 'Key Skills: ' + Array.from(skills).join(', ');
    }

    return summary;
  }

  // Track portfolio projects
  async addPortfolioProject(project: {
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }): Promise<string> {
    const item: Omit<ResumeItem, 'id'> = {
      type: 'project',
      title: project.title,
      description: project.description,
      dateCompleted: new Date().toISOString(),
      verified: true,
      skills: project.technologies,
      url: project.githubUrl || project.liveUrl,
      highlights: [
        ...(project.githubUrl ? [`GitHub: ${project.githubUrl}`] : []),
        ...(project.liveUrl ? [`Live Demo: ${project.liveUrl}`] : []),
      ]
    };

    return await this.addResumeItem(item);
  }
}

export const resumeBuilderService = new ResumeBuilderService();
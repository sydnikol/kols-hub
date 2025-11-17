import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Course {
  id: string;
  title: string;
  platform: string;
  url: string;
  credits: number;
  type: 'credit' | 'certificate' | 'skill';
  timeCommitment: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  deadline?: string;
  dateStarted?: string;
  dateCompleted?: string;
  notes?: string;
}

interface EducationDB extends DBSchema {
  courses: {
    key: string;
    value: Course;
    indexes: {
      'by-status': string;
      'by-platform': string;
    };
  };
}

class EducationService {
  private db: IDBPDatabase<EducationDB> | null = null;

  async initDB(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<EducationDB>('kol-education-db', 1, {
      upgrade(db) {
        const courseStore = db.createObjectStore('courses', { keyPath: 'id' });
        courseStore.createIndex('by-status', 'status');
        courseStore.createIndex('by-platform', 'platform');
      },
    });

    // Add sample courses if database is empty
    const count = await this.db.count('courses');
    if (count === 0) {
      await this.addSampleCourses();
    }
  }

  private async addSampleCourses(): Promise<void> {
    if (!this.db) return;

    const sampleCourses: Course[] = [
      {
        id: 'course-1',
        title: 'Introduction to Psychology',
        platform: 'Modern States (FREE)',
        url: 'https://modernstates.org/course/introduction-to-psychology/',
        credits: 3,
        type: 'credit',
        timeCommitment: '2-4 weeks, 5 hrs/week',
        status: 'not-started',
        progress: 0,
        notes: 'Completely free with Modern States + FREE CLEP exam voucher'
      },
      {
        id: 'course-2',
        title: 'College Composition',
        platform: 'Modern States (FREE)',
        url: 'https://modernstates.org/course/college-composition/',
        credits: 3,
        type: 'credit',
        timeCommitment: '3-5 weeks, 5 hrs/week',
        status: 'not-started',
        progress: 0,
        notes: 'Completely free with Modern States + FREE CLEP exam voucher'
      },
      {
        id: 'course-3',
        title: 'Google Data Analytics Certificate',
        platform: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        credits: 0,
        type: 'certificate',
        timeCommitment: '6 months, 10 hrs/week',
        status: 'not-started',
        progress: 0,
        notes: 'Financial aid available - Shows on resume and LinkedIn'
      },
      {
        id: 'course-4',
        title: 'Responsive Web Design',
        platform: 'FreeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        credits: 0,
        type: 'certificate',
        timeCommitment: '300 hours',
        status: 'not-started',
        progress: 0,
        notes: 'Completely free certificate + portfolio projects'
      }
    ];

    for (const course of sampleCourses) {
      await this.db.add('courses', course);
    }
  }

  async getCourses(): Promise<Course[]> {
    await this.initDB();
    if (!this.db) return [];
    return await this.db.getAll('courses');
  }

  async getCoursesByStatus(status: Course['status']): Promise<Course[]> {
    await this.initDB();
    if (!this.db) return [];
    return await this.db.getAllFromIndex('courses', 'by-status', status);
  }

  async addCourse(course: Omit<Course, 'id'>): Promise<string> {
    await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    const id = `course-${Date.now()}`;
    const newCourse: Course = { ...course, id };
    await this.db.add('courses', newCourse);
    return id;
  }

  async updateCourseProgress(id: string, progress: number): Promise<void> {
    await this.initDB();
    if (!this.db) return;

    const course = await this.db.get('courses', id);
    if (!course) return;

    course.progress = progress;
    
    if (progress === 100 && course.status !== 'completed') {
      course.status = 'completed';
      course.dateCompleted = new Date().toISOString();
    } else if (progress > 0 && course.status === 'not-started') {
      course.status = 'in-progress';
      course.dateStarted = new Date().toISOString();
    }

    await this.db.put('courses', course);
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<void> {
    await this.initDB();
    if (!this.db) return;

    const course = await this.db.get('courses', id);
    if (!course) return;

    const updatedCourse = { ...course, ...updates };
    await this.db.put('courses', updatedCourse);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.initDB();
    if (!this.db) return;
    await this.db.delete('courses', id);
  }

  async getTotalCredits(): Promise<number> {
    await this.initDB();
    if (!this.db) return 0;

    const completedCourses = await this.getCoursesByStatus('completed');
    return completedCourses.reduce((sum, course) => sum + course.credits, 0);
  }

  async getRecommendations(): Promise<Course[]> {
    // Return curated list of easiest/best free courses to start with
    return [
      {
        id: 'rec-1',
        title: 'College Composition (English)',
        platform: 'Modern States',
        url: 'https://modernstates.org/course/college-composition/',
        credits: 3,
        type: 'credit',
        timeCommitment: '3-5 weeks',
        status: 'not-started',
        progress: 0,
        notes: '✨ EASIEST START - Free course + free exam + 3 college credits'
      },
      {
        id: 'rec-2',
        title: 'Introduction to Sociology',
        platform: 'Modern States',
        url: 'https://modernstates.org/course/introductory-sociology/',
        credits: 3,
        type: 'credit',
        timeCommitment: '3-4 weeks',
        status: 'not-started',
        progress: 0,
        notes: '✨ VERY ACCESSIBLE - Common sense + basic social knowledge'
      },
      {
        id: 'rec-3',
        title: 'Analyzing and Interpreting Literature',
        platform: 'Modern States',
        url: 'https://modernstates.org/course/analyzing-and-interpreting-literature/',
        credits: 6,
        type: 'credit',
        timeCommitment: '4-6 weeks',
        status: 'not-started',
        progress: 0,
        notes: '✨ DOUBLE CREDITS - Worth 6 credits instead of 3!'
      }
    ];
  }

  // Learning schedule based on spoon theory
  async getPersonalizedSchedule(spoons: number): Promise<any> {
    const schedule: any = {
      veryLow: { // 1-2 spoons
        activity: 'Passive learning only',
        suggestions: [
          'Watch course videos in bed',
          'Listen to audio lectures',
          'Review flashcards on phone',
        ],
        timeLimit: '15-30 minutes'
      },
      low: { // 3-4 spoons
        activity: 'Light engagement',
        suggestions: [
          'Read course materials',
          'Take simple quizzes',
          'Watch educational videos',
        ],
        timeLimit: '30-60 minutes'
      },
      medium: { // 5-7 spoons
        activity: 'Active learning',
        suggestions: [
          'Complete course modules',
          'Practice problems',
          'Write notes and summaries',
        ],
        timeLimit: '1-2 hours'
      },
      high: { // 8-10 spoons
        activity: 'Intensive work',
        suggestions: [
          'Take practice exams',
          'Complete difficult assignments',
          'Deep focus sessions',
        ],
        timeLimit: '2-3 hours'
      }
    };

    if (spoons <= 2) return schedule.veryLow;
    if (spoons <= 4) return schedule.low;
    if (spoons <= 7) return schedule.medium;
    return schedule.high;
  }
}

export const educationService = new EducationService();
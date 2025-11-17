// Update db.ts to include learning tables
import Dexie, { Table } from 'dexie';

// ... existing interfaces ...

interface LearningMoment {
  id?: string;
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
    fileUrl?: string;
    metadata?: any;
  };
}

export class KolDB extends Dexie {
  // ... existing tables ...
  learningMoments!: Table<LearningMoment, string>;

  constructor() {
    super('KolUnifiedDB');
    
    this.version(4).stores({
      // ... existing stores ...
      learningMoments: 'id, timestamp, pathwayId, moduleId, trigger, [pathwayId+moduleId]'
    });
  }
}

export const db = new KolDB();

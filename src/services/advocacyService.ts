// Self-Advocacy Service - Scripts, Templates, and Support Tools
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AdvocacyDB extends DBSchema {
  scripts: {
    key: string;
    value: AdvocacyScript;
    indexes: { 'by-tone': string; 'by-category': string };
  };
  hearingPrep: {
    key: string;
    value: HearingPrepItem;
  };
  insuranceCalls: {
    key: string;
    value: InsuranceCallLog;
    indexes: { 'by-date': string };
  };
  accessCards: {
    key: string;
    value: AccessNeedsCard;
  };
  appealLetters: {
    key: string;
    value: AppealLetter;
    indexes: { 'by-status': string };
  };
  boundaries: {
    key: string;
    value: BoundaryPhrase;
    indexes: { 'by-category': string };
  };
}

export interface AdvocacyScript {
  id: string;
  title: string;
  tone: 'calm' | 'firm' | 'warm' | 'assertive' | 'professional';
  category: 'medical' | 'insurance' | 'disability' | 'work' | 'social' | 'legal';
  situation: string;
  script: string;
  tips: string[];
  whenToUse: string;
  followUpScripts?: string[];
  favorite: boolean;
}

export interface HearingPrepItem {
  id: string;
  hearingDate?: string;
  hearingType: 'SSI' | 'SSDI' | 'appeal' | 'reconsideration' | 'ALJ' | 'other';
  checklist: { item: string; completed: boolean; notes?: string }[];
  documentsNeeded: string[];
  keyPoints: string[];
  medicalEvidence: string[];
  witnessInfo?: { name: string; relationship: string; testimony: string }[];
  questions: string[];
  answers: string[];
  notes: string;
  completionPercentage: number;
}

export interface InsuranceCallLog {
  id: string;
  date: string;
  company: string;
  purpose: string;
  refNumber?: string;
  representative: string;
  duration: string;
  outcome: 'resolved' | 'pending' | 'escalated' | 'denied';
  notes: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  recordingPath?: string;
}

export interface AccessNeedsCard {
  id: string;
  title: string;
  needs: string[];
  accommodations: string[];
  emergencyContact: { name: string; phone: string };
  medicalInfo: string[];
  printable: boolean;
  layout: 'card' | 'letter' | 'poster';
}

export interface AppealLetter {
  id: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  denialDate: string;
  denialReason: string;
  yourArgument: string;
  supportingEvidence: string[];
  medicalDocumentation: string[];
  requestedAction: string;
  deadline?: string;
  status: 'draft' | 'sent' | 'pending' | 'approved' | 'denied';
  letterContent: string;
}

export interface BoundaryPhrase {
  id: string;
  category: 'time' | 'energy' | 'physical' | 'emotional' | 'communication' | 'care';
  situation: string;
  phrase: string;
  tone: 'gentle' | 'firm' | 'direct';
  explanation?: string;
}

class AdvocacyService {
  private db: IDBPDatabase<AdvocacyDB> | null = null;

  async init() {
    this.db = await openDB<AdvocacyDB>('advocacy-db', 1, {
      upgrade(db) {
        const scriptsStore = db.createObjectStore('scripts', { keyPath: 'id' });
        scriptsStore.createIndex('by-tone', 'tone');
        scriptsStore.createIndex('by-category', 'category');

        db.createObjectStore('hearingPrep', { keyPath: 'id' });

        const callsStore = db.createObjectStore('insuranceCalls', { keyPath: 'id' });
        callsStore.createIndex('by-date', 'date');

        db.createObjectStore('accessCards', { keyPath: 'id' });

        const appealsStore = db.createObjectStore('appealLetters', { keyPath: 'id' });
        appealsStore.createIndex('by-status', 'status');

        const boundariesStore = db.createObjectStore('boundaries', { keyPath: 'id' });
        boundariesStore.createIndex('by-category', 'category');
      },
    });
  }

  // Scripts
  async addScript(script: Omit<AdvocacyScript, 'id'>): Promise<string> {
    await this.init();
    const id = `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('scripts', { ...script, id });
    return id;
  }

  async getScriptsByTone(tone: AdvocacyScript['tone']): Promise<AdvocacyScript[]> {
    await this.init();
    return await this.db!.getAllFromIndex('scripts', 'by-tone', tone);
  }

  async getScriptsByCategory(category: AdvocacyScript['category']): Promise<AdvocacyScript[]> {
    await this.init();
    return await this.db!.getAllFromIndex('scripts', 'by-category', category);
  }

  async getAllScripts(): Promise<AdvocacyScript[]> {
    await this.init();
    return await this.db!.getAll('scripts');
  }

  async toggleFavorite(id: string): Promise<void> {
    await this.init();
    const script = await this.db!.get('scripts', id);
    if (script) {
      await this.db!.put('scripts', { ...script, favorite: !script.favorite });
    }
  }

  // Hearing Prep
  async saveHearingPrep(prep: Omit<HearingPrepItem, 'id'>): Promise<string> {
    await this.init();
    const id = `hearing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('hearingPrep', { ...prep, id });
    return id;
  }

  async updateHearingPrep(id: string, updates: Partial<HearingPrepItem>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('hearingPrep', id);
    if (existing) {
      const updated = { ...existing, ...updates };
      // Recalculate completion percentage
      const completed = updated.checklist.filter(item => item.completed).length;
      updated.completionPercentage = Math.round((completed / updated.checklist.length) * 100);
      await this.db!.put('hearingPrep', updated);
    }
  }

  async getAllHearingPrep(): Promise<HearingPrepItem[]> {
    await this.init();
    return await this.db!.getAll('hearingPrep');
  }

  // Insurance Calls
  async logInsuranceCall(call: Omit<InsuranceCallLog, 'id'>): Promise<string> {
    await this.init();
    const id = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('insuranceCalls', { ...call, id });
    return id;
  }

  async getAllInsuranceCalls(): Promise<InsuranceCallLog[]> {
    await this.init();
    const calls = await this.db!.getAll('insuranceCalls');
    return calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Access Cards
  async createAccessCard(card: Omit<AccessNeedsCard, 'id'>): Promise<string> {
    await this.init();
    const id = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('accessCards', { ...card, id });
    return id;
  }

  async getAllAccessCards(): Promise<AccessNeedsCard[]> {
    await this.init();
    return await this.db!.getAll('accessCards');
  }

  // Appeal Letters
  async createAppealLetter(letter: Omit<AppealLetter, 'id'>): Promise<string> {
    await this.init();
    const id = `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('appealLetters', { ...letter, id });
    return id;
  }

  async updateAppealStatus(id: string, status: AppealLetter['status']): Promise<void> {
    await this.init();
    const letter = await this.db!.get('appealLetters', id);
    if (letter) {
      await this.db!.put('appealLetters', { ...letter, status });
    }
  }

  async getAllAppealLetters(): Promise<AppealLetter[]> {
    await this.init();
    return await this.db!.getAll('appealLetters');
  }

  // Boundaries
  async addBoundaryPhrase(phrase: Omit<BoundaryPhrase, 'id'>): Promise<string> {
    await this.init();
    const id = `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('boundaries', { ...phrase, id });
    return id;
  }

  async getBoundariesByCategory(category: BoundaryPhrase['category']): Promise<BoundaryPhrase[]> {
    await this.init();
    return await this.db!.getAllFromIndex('boundaries', 'by-category', category);
  }

  async getAllBoundaries(): Promise<BoundaryPhrase[]> {
    await this.init();
    return await this.db!.getAll('boundaries');
  }

  // Seed data
  async seedSampleData() {
    // Sample scripts
    await this.addScript({
      title: 'Requesting Accommodations - Calm',
      tone: 'calm',
      category: 'medical',
      situation: 'When asking a doctor for specific accommodations',
      script: "I appreciate you taking the time to see me today. I've noticed that [specific issue], and I was hoping we could discuss some accommodations that might help. Would it be possible to [specific request]? I understand if there are limitations, but this would significantly improve my ability to [desired outcome].",
      tips: [
        'Speak slowly and clearly',
        'Bring written notes if needed',
        'Be specific about what you need',
        'Thank them for considering your request'
      ],
      whenToUse: 'When you want to maintain a collaborative relationship',
      favorite: false
    });

    await this.addScript({
      title: 'Insurance Denial Response - Firm',
      tone: 'firm',
      category: 'insurance',
      situation: 'When insurance denies a claim you believe should be covered',
      script: "I am calling regarding claim number [NUMBER], which was denied on [DATE]. According to my policy [POLICY NUMBER], this treatment should be covered under [SPECIFIC COVERAGE]. I am requesting a detailed explanation of the denial and would like to initiate the appeals process. Please provide me with the reference number for this call and the next steps in writing.",
      tips: [
        'Have all documentation ready',
        'Record reference numbers',
        'Stay calm but persistent',
        'Request everything in writing',
        'Ask for supervisor if needed'
      ],
      whenToUse: 'When you need to assert your rights firmly',
      favorite: false
    });

    await this.addScript({
      title: 'Setting Boundaries - Gentle',
      tone: 'warm',
      category: 'social',
      situation: 'When you need to decline an invitation due to health',
      script: "Thank you so much for thinking of me! I really appreciate the invitation. Unfortunately, I need to take care of my health right now and won't be able to make it. I hope you have a wonderful time, and maybe we can find a quieter time to catch up one-on-one?",
      tips: [
        'Express gratitude first',
        'Be honest but brief',
        'Offer alternative if desired',
        'Don\'t over-explain'
      ],
      whenToUse: 'When declining social events with friends',
      favorite: false
    });

    // Sample boundaries
    await this.addBoundaryPhrase({
      category: 'energy',
      situation: 'When someone asks you to do something beyond your capacity',
      phrase: "I appreciate you thinking of me, but I don't have the energy for that right now. I need to prioritize my health.",
      tone: 'gentle'
    });

    await this.addBoundaryPhrase({
      category: 'care',
      situation: 'When medical provider dismisses your symptoms',
      phrase: "I hear what you're saying, but I know my body. These symptoms are real and significantly impacting my quality of life. I need us to work together to find answers.",
      tone: 'firm'
    });

    await this.addBoundaryPhrase({
      category: 'communication',
      situation: 'When you need time to process',
      phrase: "I need some time to think about this. Can we continue this conversation [tomorrow/in a few hours]?",
      tone: 'gentle'
    });
  }
}

export const advocacyService = new AdvocacyService();

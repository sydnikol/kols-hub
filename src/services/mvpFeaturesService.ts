// MVP Features Service - Hydration, Sodium, Pain Map, Body Weather, Crisis Calm Mode
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MVPFeaturesDB extends DBSchema {
  hydration: {
    key: string;
    value: HydrationEntry;
    indexes: { 'by-date': string };
  };
  sodium: {
    key: string;
    value: SodiumEntry;
    indexes: { 'by-date': string };
  };
  bodyWeather: {
    key: string;
    value: BodyWeatherEntry;
    indexes: { 'by-date': string };
  };
  painMap: {
    key: string;
    value: PainMapEntry;
    indexes: { 'by-date': string };
  };
  flareEvents: {
    key: string;
    value: FlareEvent;
    indexes: { 'by-status': string };
  };
  symptoms: {
    key: string;
    value: SymptomEntry;
    indexes: { 'by-date': string; 'by-type': string };
  };
  sleepQuality: {
    key: string;
    value: SleepEntry;
    indexes: { 'by-date': string };
  };
  dailyCheckIns: {
    key: string;
    value: DailyCheckIn;
    indexes: { 'by-date': string };
  };
}

export interface HydrationEntry {
  id: string;
  date: string;
  time: string;
  amount: number; // in mL
  type: 'water' | 'electrolyte' | 'other';
  notes?: string;
}

export interface HydrationGoal {
  dailyGoalLiters: number;
  reminderEnabled: boolean;
  reminderIntervalMinutes: number;
}

export interface SodiumEntry {
  id: string;
  date: string;
  time: string;
  amount: number; // in mg
  source: string;
  notes?: string;
}

export interface SodiumGoal {
  dailyGoalMg: number; // Default 4000mg for POTS
  trackingEnabled: boolean;
}

export interface BodyWeatherEntry {
  id: string;
  date: string;
  time: string;
  weather: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'tornado';
  note?: string;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  painLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  mood: 'great' | 'good' | 'okay' | 'struggling' | 'crisis';
}

export interface PainMapEntry {
  id: string;
  date: string;
  time: string;
  painPoints: {
    location: string; // e.g., 'head', 'neck', 'shoulder-left', 'back-upper'
    intensity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    type: 'sharp' | 'dull' | 'burning' | 'aching' | 'throbbing' | 'stabbing';
    triggers?: string[];
  }[];
  notes?: string;
}

export interface FlareEvent {
  id: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: 'active' | 'resolved';
  triggers: string[];
  symptoms: string[];
  severity: 1 | 2 | 3 | 4 | 5;
  treatmentsTried: string[];
  notes: string;
  duration?: string; // calculated when resolved
}

export interface SymptomEntry {
  id: string;
  date: string;
  time: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  type: 'physical' | 'mental' | 'emotional' | 'cognitive';
  tags: string[];
  notes?: string;
}

export interface SleepEntry {
  id: string;
  date: string; // Date of waking up
  bedTime: string;
  wakeTime: string;
  duration: number; // in hours
  quality: 1 | 2 | 3 | 4 | 5;
  nightmares: boolean;
  wakeUps: number;
  restful: boolean;
  notes?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  time: string;
  pain: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  symptoms: string[];
  gratitude?: string;
  notes?: string;
}

class MVPFeaturesService {
  private db: IDBPDatabase<MVPFeaturesDB> | null = null;

  async init() {
    this.db = await openDB<MVPFeaturesDB>('mvp-features-db', 1, {
      upgrade(db) {
        const hydrationStore = db.createObjectStore('hydration', { keyPath: 'id' });
        hydrationStore.createIndex('by-date', 'date');

        const sodiumStore = db.createObjectStore('sodium', { keyPath: 'id' });
        sodiumStore.createIndex('by-date', 'date');

        const weatherStore = db.createObjectStore('bodyWeather', { keyPath: 'id' });
        weatherStore.createIndex('by-date', 'date');

        const painStore = db.createObjectStore('painMap', { keyPath: 'id' });
        painStore.createIndex('by-date', 'date');

        const flareStore = db.createObjectStore('flareEvents', { keyPath: 'id' });
        flareStore.createIndex('by-status', 'status');

        const symptomsStore = db.createObjectStore('symptoms', { keyPath: 'id' });
        symptomsStore.createIndex('by-date', 'date');
        symptomsStore.createIndex('by-type', 'type');

        const sleepStore = db.createObjectStore('sleepQuality', { keyPath: 'id' });
        sleepStore.createIndex('by-date', 'date');

        const checkInStore = db.createObjectStore('dailyCheckIns', { keyPath: 'id' });
        checkInStore.createIndex('by-date', 'date');
      },
    });
  }

  // Hydration
  async addHydration(entry: Omit<HydrationEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `hydro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('hydration', { ...entry, id });
    return id;
  }

  async getHydrationByDate(date: string): Promise<HydrationEntry[]> {
    await this.init();
    return await this.db!.getAllFromIndex('hydration', 'by-date', date);
  }

  async getTodayHydration(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const entries = await this.getHydrationByDate(today);
    return entries.reduce((sum, e) => sum + e.amount, 0);
  }

  async getHydrationGoal(): Promise<HydrationGoal> {
    const stored = localStorage.getItem('hydrationGoal');
    return stored ? JSON.parse(stored) : {
      dailyGoalLiters: 2.5,
      reminderEnabled: true,
      reminderIntervalMinutes: 60
    };
  }

  async setHydrationGoal(goal: HydrationGoal): Promise<void> {
    localStorage.setItem('hydrationGoal', JSON.stringify(goal));
  }

  // Sodium
  async addSodium(entry: Omit<SodiumEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `sodium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('sodium', { ...entry, id });
    return id;
  }

  async getSodiumByDate(date: string): Promise<SodiumEntry[]> {
    await this.init();
    return await this.db!.getAllFromIndex('sodium', 'by-date', date);
  }

  async getTodaySodium(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const entries = await this.getSodiumByDate(today);
    return entries.reduce((sum, e) => sum + e.amount, 0);
  }

  async getSodiumGoal(): Promise<SodiumGoal> {
    const stored = localStorage.getItem('sodiumGoal');
    return stored ? JSON.parse(stored) : {
      dailyGoalMg: 4000,
      trackingEnabled: true
    };
  }

  // Body Weather
  async addBodyWeather(entry: Omit<BodyWeatherEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `weather-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('bodyWeather', { ...entry, id });
    return id;
  }

  async getTodayWeather(): Promise<BodyWeatherEntry | undefined> {
    await this.init();
    const today = new Date().toISOString().split('T')[0];
    const entries = await this.db!.getAllFromIndex('bodyWeather', 'by-date', today);
    return entries[entries.length - 1]; // Return most recent
  }

  async getWeatherHistory(days: number = 30): Promise<BodyWeatherEntry[]> {
    await this.init();
    const all = await this.db!.getAll('bodyWeather');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Pain Map
  async addPainMap(entry: Omit<PainMapEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `pain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('painMap', { ...entry, id });
    return id;
  }

  async getTodayPainMap(): Promise<PainMapEntry | undefined> {
    await this.init();
    const today = new Date().toISOString().split('T')[0];
    const entries = await this.db!.getAllFromIndex('painMap', 'by-date', today);
    return entries[entries.length - 1];
  }

  async getPainHistory(days: number = 30): Promise<PainMapEntry[]> {
    await this.init();
    const all = await this.db!.getAll('painMap');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Flare Events
  async startFlare(flare: Omit<FlareEvent, 'id' | 'status'>): Promise<string> {
    await this.init();
    const id = `flare-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('flareEvents', { ...flare, id, status: 'active' });
    return id;
  }

  async endFlare(id: string, endDate: string, endTime: string): Promise<void> {
    await this.init();
    const flare = await this.db!.get('flareEvents', id);
    if (flare) {
      const start = new Date(`${flare.startDate}T${flare.startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const durationMs = end.getTime() - start.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationDays = Math.floor(durationHours / 24);
      const remainingHours = durationHours % 24;

      let duration = '';
      if (durationDays > 0) duration += `${durationDays}d `;
      duration += `${remainingHours}h`;

      await this.db!.put('flareEvents', {
        ...flare,
        endDate,
        endTime,
        status: 'resolved',
        duration
      });
    }
  }

  async getActiveFlares(): Promise<FlareEvent[]> {
    await this.init();
    return await this.db!.getAllFromIndex('flareEvents', 'by-status', 'active');
  }

  async getAllFlares(): Promise<FlareEvent[]> {
    await this.init();
    const flares = await this.db!.getAll('flareEvents');
    return flares.sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  // Symptoms
  async addSymptom(entry: Omit<SymptomEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `symptom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('symptoms', { ...entry, id });
    return id;
  }

  async getSymptomsByDate(date: string): Promise<SymptomEntry[]> {
    await this.init();
    return await this.db!.getAllFromIndex('symptoms', 'by-date', date);
  }

  async getRecentSymptoms(days: number = 7): Promise<SymptomEntry[]> {
    await this.init();
    const all = await this.db!.getAll('symptoms');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Sleep Quality
  async addSleepEntry(entry: Omit<SleepEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `sleep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('sleepQuality', { ...entry, id });
    return id;
  }

  async getSleepByDate(date: string): Promise<SleepEntry | undefined> {
    await this.init();
    const entries = await this.db!.getAllFromIndex('sleepQuality', 'by-date', date);
    return entries[0];
  }

  async getSleepHistory(days: number = 30): Promise<SleepEntry[]> {
    await this.init();
    const all = await this.db!.getAll('sleepQuality');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Daily Check-In
  async addDailyCheckIn(checkIn: Omit<DailyCheckIn, 'id'>): Promise<string> {
    await this.init();
    const id = `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('dailyCheckIns', { ...checkIn, id });
    return id;
  }

  async getTodayCheckIn(): Promise<DailyCheckIn | undefined> {
    await this.init();
    const today = new Date().toISOString().split('T')[0];
    const entries = await this.db!.getAllFromIndex('dailyCheckIns', 'by-date', today);
    return entries[entries.length - 1];
  }

  async getCheckInHistory(days: number = 30): Promise<DailyCheckIn[]> {
    await this.init();
    const all = await this.db!.getAll('dailyCheckIns');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Seed sample data
  async seedSampleData() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

    // Hydration
    await this.addHydration({
      date: today,
      time: '08:00',
      amount: 500,
      type: 'water'
    });

    await this.addHydration({
      date: today,
      time: '10:00',
      amount: 350,
      type: 'electrolyte',
      notes: 'LMNT packet'
    });

    // Sodium
    await this.addSodium({
      date: today,
      time: '08:00',
      amount: 1200,
      source: 'LMNT electrolyte drink'
    });

    await this.addSodium({
      date: today,
      time: '12:00',
      amount: 800,
      source: 'Lunch with added salt'
    });

    // Body Weather
    await this.addBodyWeather({
      date: today,
      time: now,
      weather: 'partly-cloudy',
      energyLevel: 3,
      painLevel: 5,
      mood: 'okay',
      note: 'Manageable day so far'
    });

    // Pain Map
    await this.addPainMap({
      date: today,
      time: now,
      painPoints: [
        { location: 'neck', intensity: 6, type: 'aching' },
        { location: 'lower-back', intensity: 7, type: 'throbbing' },
        { location: 'knees', intensity: 4, type: 'dull' }
      ],
      notes: 'Worse after sitting for extended period'
    });

    // Daily Check-In
    await this.addDailyCheckIn({
      date: today,
      time: now,
      pain: 6,
      energy: 3,
      mood: 3,
      symptoms: ['Fatigue', 'Brain fog', 'Joint pain'],
      gratitude: 'Sunshine through the window'
    });
  }
}

export const mvpFeaturesService = new MVPFeaturesService();

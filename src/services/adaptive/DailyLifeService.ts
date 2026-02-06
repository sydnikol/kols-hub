import {
  Ritual,
  RitualLog,
  Chore,
  ChoreLog,
  Pet,
  PetCareLog,
  MealPreference,
  PantryItem,
  GroceryList,
  Script,
  Handbook,
  MediaAutomation,
  BodyWeatherEntry,
} from '../models/DailyLifeModels';

export class DailyLifeService {
  private rituals: Map<string, Ritual>;
  private ritualLogs: RitualLog[];
  private chores: Map<string, Chore>;
  private choreLogs: ChoreLog[];
  private pets: Map<string, Pet>;
  private petCareLogs: PetCareLog[];
  private mealPreferences: Map<string, MealPreference>;
  private pantryItems: Map<string, PantryItem>;
  private groceryLists: Map<string, GroceryList>;
  private scripts: Map<string, Script>;
  private handbooks: Map<string, Handbook>;
  private mediaAutomations: Map<string, MediaAutomation>;
  private bodyWeatherEntries: BodyWeatherEntry[];

  constructor() {
    this.rituals = new Map();
    this.ritualLogs = [];
    this.chores = new Map();
    this.choreLogs = [];
    this.pets = new Map();
    this.petCareLogs = [];
    this.mealPreferences = new Map();
    this.pantryItems = new Map();
    this.groceryLists = new Map();
    this.scripts = new Map();
    this.handbooks = new Map();
    this.mediaAutomations = new Map();
    this.bodyWeatherEntries = [];
  }

  // Rituals Management
  async addRitual(ritual: Ritual): Promise<Ritual> {
    this.rituals.set(ritual.id, ritual);
    return ritual;
  }

  async getUserRituals(userId: string): Promise<Ritual[]> {
    return Array.from(this.rituals.values()).filter(
      (r) => r.userId === userId && r.active
    );
  }

  async getRitualsByCadence(userId: string, cadence: Ritual['cadence']): Promise<Ritual[]> {
    return Array.from(this.rituals.values()).filter(
      (r) => r.userId === userId && r.cadence === cadence && r.active
    );
  }

  async logRitual(log: RitualLog): Promise<RitualLog> {
    this.ritualLogs.push(log);
    return log;
  }

  async getRitualLogs(userId: string, ritualId?: string): Promise<RitualLog[]> {
    let logs = this.ritualLogs.filter((log) => log.userId === userId);

    if (ritualId) {
      logs = logs.filter((log) => log.ritual_id === ritualId);
    }

    return logs.sort((a, b) => b.performed_at.getTime() - a.performed_at.getTime());
  }

  // Chores Management
  async addChore(chore: Chore): Promise<Chore> {
    this.chores.set(chore.id, chore);
    return chore;
  }

  async getUserChores(userId: string): Promise<Chore[]> {
    return Array.from(this.chores.values()).filter(
      (c) => c.userId === userId && c.active
    );
  }

  async logChore(log: ChoreLog): Promise<ChoreLog> {
    this.choreLogs.push(log);
    return log;
  }

  async getChoresByContact(userId: string, contactId: string): Promise<Chore[]> {
    return Array.from(this.chores.values()).filter(
      (c) => c.userId === userId && c.assigned_contact_id === contactId && c.active
    );
  }

  // Pet Care
  async addPet(pet: Pet): Promise<Pet> {
    this.pets.set(pet.id, pet);
    return pet;
  }

  async getUserPets(userId: string): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter((p) => p.userId === userId);
  }

  async logPetCare(log: PetCareLog): Promise<PetCareLog> {
    this.petCareLogs.push(log);
    return log;
  }

  async getPetCareLogs(userId: string, petId?: string): Promise<PetCareLog[]> {
    let logs = this.petCareLogs.filter((log) => log.userId === userId);

    if (petId) {
      logs = logs.filter((log) => log.pet_id === petId);
    }

    return logs.sort((a, b) => b.performed_at.getTime() - a.performed_at.getTime());
  }

  // Meal Planning
  async setMealPreferences(preferences: MealPreference): Promise<MealPreference> {
    this.mealPreferences.set(preferences.userId, preferences);
    return preferences;
  }

  async getMealPreferences(userId: string): Promise<MealPreference | undefined> {
    return this.mealPreferences.get(userId);
  }

  // Pantry Management
  async addPantryItem(item: PantryItem): Promise<PantryItem> {
    this.pantryItems.set(item.id, item);
    return item;
  }

  async getUserPantryItems(userId: string): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).filter((item) => item.userId === userId);
  }

  async getOutOfStockItems(userId: string): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).filter(
      (item) => item.userId === userId && !item.in_stock
    );
  }

  async getLowStockItems(userId: string): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).filter(
      (item) => item.userId === userId && item.low_stock
    );
  }

  // Grocery Lists
  async createGroceryList(list: GroceryList): Promise<GroceryList> {
    list.created_at = new Date();
    this.groceryLists.set(list.id, list);
    return list;
  }

  async getUserGroceryLists(userId: string): Promise<GroceryList[]> {
    return Array.from(this.groceryLists.values()).filter((list) => list.userId === userId);
  }

  async autoGenerateGroceryList(userId: string): Promise<GroceryList> {
    const outOfStock = await this.getOutOfStockItems(userId);
    const lowStock = await this.getLowStockItems(userId);

    const items = [...outOfStock, ...lowStock].map((item) => ({
      name: item.name,
      quantity: 1,
      unit: 'unit',
      category: item.category,
      checked: false,
    }));

    const list: GroceryList = {
      id: `grocery-${Date.now()}`,
      userId,
      name: `Auto-generated - ${new Date().toLocaleDateString()}`,
      items,
      created_at: new Date(),
      completed: false,
    };

    return this.createGroceryList(list);
  }

  // Communication Scripts
  async addScript(script: Script): Promise<Script> {
    this.scripts.set(script.id, script);
    return script;
  }

  async getUserScripts(userId: string): Promise<Script[]> {
    return Array.from(this.scripts.values()).filter((s) => s.userId === userId);
  }

  async getScriptsByDomain(userId: string, domain: Script['domain']): Promise<Script[]> {
    return Array.from(this.scripts.values()).filter(
      (s) => s.userId === userId && s.domain === domain
    );
  }

  async searchScripts(userId: string, query: string): Promise<Script[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.scripts.values()).filter(
      (s) =>
        s.userId === userId &&
        (s.situation.toLowerCase().includes(lowerQuery) ||
          s.script_text.toLowerCase().includes(lowerQuery))
    );
  }

  // Handbooks
  async createHandbook(handbook: Handbook): Promise<Handbook> {
    handbook.created_at = new Date();
    handbook.last_updated = new Date();
    this.handbooks.set(handbook.id, handbook);
    return handbook;
  }

  async getUserHandbooks(userId: string): Promise<Handbook[]> {
    return Array.from(this.handbooks.values()).filter((h) => h.userId === userId);
  }

  async getHandbookByAudience(
    userId: string,
    audience: Handbook['audience']
  ): Promise<Handbook | undefined> {
    return Array.from(this.handbooks.values()).find(
      (h) => h.userId === userId && h.audience === audience
    );
  }

  // Media Automations
  async addMediaAutomation(automation: MediaAutomation): Promise<MediaAutomation> {
    this.mediaAutomations.set(automation.id, automation);
    return automation;
  }

  async getUserMediaAutomations(userId: string): Promise<MediaAutomation[]> {
    return Array.from(this.mediaAutomations.values()).filter(
      (a) => a.userId === userId
    );
  }

  async getActiveAutomations(userId: string): Promise<MediaAutomation[]> {
    return Array.from(this.mediaAutomations.values()).filter(
      (a) => a.userId === userId && a.enabled
    );
  }

  async triggerTimeBasedAutomations(userId: string, currentTime: string): Promise<MediaAutomation[]> {
    const active = await this.getActiveAutomations(userId);
    const triggered: MediaAutomation[] = [];

    for (const automation of active) {
      if (automation.trigger_type === 'time' && automation.trigger_value.includes(currentTime)) {
        triggered.push(automation);
        console.log(`Triggering automation: ${automation.name}`);
        // In production, execute the automation action
      }
    }

    return triggered;
  }

  // Body Weather Tracking
  async logBodyWeather(entry: BodyWeatherEntry): Promise<BodyWeatherEntry> {
    this.bodyWeatherEntries.push(entry);
    return entry;
  }

  async getBodyWeatherEntries(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<BodyWeatherEntry[]> {
    let entries = this.bodyWeatherEntries.filter((e) => e.userId === userId);

    if (dateRange) {
      entries = entries.filter(
        (e) => e.logged_at >= dateRange.start && e.logged_at <= dateRange.end
      );
    }

    return entries.sort((a, b) => b.logged_at.getTime() - a.logged_at.getTime());
  }

  async getBodyWeatherTrends(userId: string, days: number = 7): Promise<{
    avg_pain: number;
    avg_energy: number;
    avg_mood: number;
    avg_spoons: number;
    common_symptoms: string[];
    common_triggers: string[];
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.getBodyWeatherEntries(userId, {
      start: startDate,
      end: endDate,
    });

    if (entries.length === 0) {
      return {
        avg_pain: 0,
        avg_energy: 0,
        avg_mood: 0,
        avg_spoons: 0,
        common_symptoms: [],
        common_triggers: [],
      };
    }

    const avg_pain = entries.reduce((sum, e) => sum + e.pain_level, 0) / entries.length;
    const avg_energy = entries.reduce((sum, e) => sum + e.energy_level, 0) / entries.length;
    const avg_mood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
    const avg_spoons =
      entries.reduce((sum, e) => sum + e.spoons_available, 0) / entries.length;

    // Collect all symptoms and triggers
    const allSymptoms: string[] = [];
    const allTriggers: string[] = [];

    entries.forEach((e) => {
      allSymptoms.push(...e.symptoms);
      if (e.triggers) allTriggers.push(...e.triggers);
    });

    // Find most common
    const symptomCounts = this.countOccurrences(allSymptoms);
    const triggerCounts = this.countOccurrences(allTriggers);

    const common_symptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((e) => e[0]);

    const common_triggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((e) => e[0]);

    return {
      avg_pain,
      avg_energy,
      avg_mood,
      avg_spoons,
      common_symptoms,
      common_triggers,
    };
  }

  private countOccurrences(arr: string[]): Record<string, number> {
    return arr.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }
}

/**
 * Dungeons & Dragons Integration Service
 * Supports solo play with AI DM and multiplayer campaigns
 */

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type CharacterClass =
  | 'Barbarian' | 'Bard' | 'Cleric' | 'Druid'
  | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger'
  | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard';

export type CharacterRace =
  | 'Human' | 'Elf' | 'Dwarf' | 'Halfling'
  | 'Dragonborn' | 'Gnome' | 'Half-Elf' | 'Half-Orc'
  | 'Tiefling';

export type Alignment =
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  race: CharacterRace;
  class: CharacterClass;
  level: number;
  alignment: Alignment;
  stats: CharacterStats;
  hp: number;
  maxHp: number;
  ac: number; // Armor Class
  initiative: number;
  proficiencyBonus: number;
  inventory: Item[];
  spells: Spell[];
  skills: Skill[];
  background: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  experience: number;
  gold: number;
  avatar?: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc';
  description: string;
  damage?: string;
  armorClass?: number;
  magical?: boolean;
  quantity: number;
  value: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  damage?: string;
}

export interface Skill {
  name: string;
  modifier: number;
  proficient: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  dmId: string;
  dmName: string;
  players: string[]; // character IDs
  isAIDM: boolean; // Solo play with AI DM
  currentScene: string;
  storyLog: StoryEntry[];
  combatActive: boolean;
  currentTurn?: string; // character ID
  turnOrder: string[];
  createdAt: Date;
  lastPlayed: Date;
  setting: 'Forgotten Realms' | 'Eberron' | 'Custom' | 'Ravenloft' | 'Dark Sun';
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Deadly';
}

export interface StoryEntry {
  id: string;
  timestamp: Date;
  type: 'narration' | 'action' | 'dialogue' | 'combat' | 'skill_check' | 'dice_roll';
  speaker?: string;
  content: string;
  diceRoll?: DiceRollResult;
}

export interface DiceRollResult {
  dice: DiceType;
  count: number;
  results: number[];
  total: number;
  modifier: number;
  finalTotal: number;
  criticalHit?: boolean;
  criticalFail?: boolean;
}

export interface CombatEncounter {
  id: string;
  campaignId: string;
  enemies: Enemy[];
  turnOrder: (Character | Enemy)[];
  round: number;
  active: boolean;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initiative: number;
  damage: string;
  cr: number; // Challenge Rating
  type: string;
  description: string;
}

class DnDService {
  private readonly STORAGE_KEY = 'dnd_data';

  // ============= DICE ROLLING =============

  rollDice(type: DiceType, count: number = 1, modifier: number = 0): DiceRollResult {
    const maxValue = parseInt(type.substring(1));
    const results: number[] = [];

    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * maxValue) + 1);
    }

    const total = results.reduce((sum, val) => sum + val, 0);
    const finalTotal = total + modifier;

    return {
      dice: type,
      count,
      results,
      total,
      modifier,
      finalTotal,
      criticalHit: type === 'd20' && count === 1 && results[0] === 20,
      criticalFail: type === 'd20' && count === 1 && results[0] === 1,
    };
  }

  // ============= CHARACTER CREATION =============

  generateStats(): CharacterStats {
    const rollStat = () => {
      // Roll 4d6, drop lowest
      const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => a - b);
      return rolls.slice(1).reduce((sum, val) => sum + val, 0);
    };

    return {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat(),
    };
  }

  calculateModifier(stat: number): number {
    return Math.floor((stat - 10) / 2);
  }

  createCharacter(params: {
    name: string;
    race: CharacterRace;
    class: CharacterClass;
    stats: CharacterStats;
    background?: string;
  }): Character {
    const { name, race, class: charClass, stats, background } = params;

    const conModifier = this.calculateModifier(stats.constitution);
    const maxHp = 10 + conModifier; // Simplified HP calculation

    return {
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      race,
      class: charClass,
      level: 1,
      alignment: 'True Neutral',
      stats,
      hp: maxHp,
      maxHp,
      ac: 10 + this.calculateModifier(stats.dexterity),
      initiative: this.calculateModifier(stats.dexterity),
      proficiencyBonus: 2,
      inventory: this.getStartingEquipment(charClass),
      spells: this.getStartingSpells(charClass),
      skills: this.getClassSkills(charClass, stats),
      background: background || 'Adventurer seeking glory and treasure',
      personality: '',
      ideals: '',
      bonds: '',
      flaws: '',
      experience: 0,
      gold: 100,
      createdAt: new Date(),
    };
  }

  private getStartingEquipment(charClass: CharacterClass): Item[] {
    const equipment: Record<CharacterClass, Item[]> = {
      Fighter: [
        { id: 'sword', name: 'Longsword', type: 'weapon', description: 'A versatile blade', damage: '1d8', quantity: 1, value: 15 },
        { id: 'shield', name: 'Shield', type: 'armor', description: 'A sturdy shield', armorClass: 2, quantity: 1, value: 10 },
      ],
      Wizard: [
        { id: 'staff', name: 'Quarterstaff', type: 'weapon', description: 'A simple staff', damage: '1d6', quantity: 1, value: 2 },
        { id: 'spellbook', name: 'Spellbook', type: 'misc', description: 'Contains your spells', quantity: 1, value: 50 },
      ],
      Rogue: [
        { id: 'dagger', name: 'Dagger', type: 'weapon', description: 'A short blade', damage: '1d4', quantity: 2, value: 2 },
        { id: 'lockpicks', name: "Thieves' Tools", type: 'misc', description: 'For picking locks', quantity: 1, value: 25 },
      ],
      Cleric: [
        { id: 'mace', name: 'Mace', type: 'weapon', description: 'A holy mace', damage: '1d6', quantity: 1, value: 5 },
        { id: 'holy_symbol', name: 'Holy Symbol', type: 'misc', description: 'Symbol of your faith', magical: true, quantity: 1, value: 10 },
      ],
      // Default equipment for other classes
      Barbarian: [{ id: 'axe', name: 'Greataxe', type: 'weapon', description: 'A massive axe', damage: '1d12', quantity: 1, value: 30 }],
      Bard: [{ id: 'rapier', name: 'Rapier', type: 'weapon', description: 'An elegant blade', damage: '1d8', quantity: 1, value: 25 }],
      Druid: [{ id: 'staff', name: 'Druidic Staff', type: 'weapon', description: 'A natural staff', damage: '1d6', magical: true, quantity: 1, value: 10 }],
      Monk: [{ id: 'fists', name: 'Martial Arts', type: 'weapon', description: 'Your body is a weapon', damage: '1d4', quantity: 1, value: 0 }],
      Paladin: [{ id: 'sword', name: 'Longsword', type: 'weapon', description: 'A holy blade', damage: '1d8', magical: true, quantity: 1, value: 50 }],
      Ranger: [{ id: 'bow', name: 'Longbow', type: 'weapon', description: 'A hunting bow', damage: '1d8', quantity: 1, value: 50 }],
      Sorcerer: [{ id: 'dagger', name: 'Dagger', type: 'weapon', description: 'A simple blade', damage: '1d4', quantity: 1, value: 2 }],
      Warlock: [{ id: 'rod', name: 'Arcane Focus', type: 'misc', description: 'Channel eldritch power', magical: true, quantity: 1, value: 20 }],
    };

    return equipment[charClass] || [];
  }

  private getStartingSpells(charClass: CharacterClass): Spell[] {
    const spellsByClass: Record<string, Spell[]> = {
      Wizard: [
        {
          id: 'magic_missile',
          name: 'Magic Missile',
          level: 1,
          school: 'Evocation',
          castingTime: '1 action',
          range: '120 feet',
          components: 'V, S',
          duration: 'Instantaneous',
          description: 'Three darts of magical force that never miss',
          damage: '1d4+1 per dart',
        },
        {
          id: 'shield',
          name: 'Shield',
          level: 1,
          school: 'Abjuration',
          castingTime: '1 reaction',
          range: 'Self',
          components: 'V, S',
          duration: '1 round',
          description: '+5 AC until your next turn',
        },
      ],
      Cleric: [
        {
          id: 'cure_wounds',
          name: 'Cure Wounds',
          level: 1,
          school: 'Evocation',
          castingTime: '1 action',
          range: 'Touch',
          components: 'V, S',
          duration: 'Instantaneous',
          description: 'Heal 1d8 + spellcasting modifier',
          damage: '1d8',
        },
      ],
      Sorcerer: [
        {
          id: 'burning_hands',
          name: 'Burning Hands',
          level: 1,
          school: 'Evocation',
          castingTime: '1 action',
          range: '15 feet',
          components: 'V, S',
          duration: 'Instantaneous',
          description: 'Cone of fire damage',
          damage: '3d6',
        },
      ],
      Warlock: [
        {
          id: 'eldritch_blast',
          name: 'Eldritch Blast',
          level: 0,
          school: 'Evocation',
          castingTime: '1 action',
          range: '120 feet',
          components: 'V, S',
          duration: 'Instantaneous',
          description: 'A beam of crackling energy',
          damage: '1d10',
        },
      ],
    };

    return spellsByClass[charClass] || [];
  }

  private getClassSkills(charClass: CharacterClass, stats: CharacterStats): Skill[] {
    const skills = [
      { name: 'Athletics', modifier: this.calculateModifier(stats.strength), proficient: false },
      { name: 'Acrobatics', modifier: this.calculateModifier(stats.dexterity), proficient: false },
      { name: 'Stealth', modifier: this.calculateModifier(stats.dexterity), proficient: false },
      { name: 'Arcana', modifier: this.calculateModifier(stats.intelligence), proficient: false },
      { name: 'Investigation', modifier: this.calculateModifier(stats.intelligence), proficient: false },
      { name: 'Perception', modifier: this.calculateModifier(stats.wisdom), proficient: false },
      { name: 'Insight', modifier: this.calculateModifier(stats.wisdom), proficient: false },
      { name: 'Persuasion', modifier: this.calculateModifier(stats.charisma), proficient: false },
      { name: 'Deception', modifier: this.calculateModifier(stats.charisma), proficient: false },
    ];

    // Give proficiency to class-appropriate skills
    const classProficiencies: Record<CharacterClass, string[]> = {
      Fighter: ['Athletics', 'Perception'],
      Wizard: ['Arcana', 'Investigation'],
      Rogue: ['Stealth', 'Acrobatics', 'Deception'],
      Cleric: ['Insight', 'Persuasion'],
      Barbarian: ['Athletics', 'Perception'],
      Bard: ['Persuasion', 'Deception'],
      Druid: ['Perception', 'Insight'],
      Monk: ['Acrobatics', 'Insight'],
      Paladin: ['Athletics', 'Persuasion'],
      Ranger: ['Stealth', 'Perception'],
      Sorcerer: ['Persuasion', 'Arcana'],
      Warlock: ['Deception', 'Arcana'],
    };

    const proficientSkills = classProficiencies[charClass] || [];
    skills.forEach(skill => {
      if (proficientSkills.includes(skill.name)) {
        skill.proficient = true;
        skill.modifier += 2; // Proficiency bonus
      }
    });

    return skills;
  }

  // ============= CAMPAIGN MANAGEMENT =============

  async createCampaign(params: {
    name: string;
    description: string;
    isAIDM: boolean;
    characterIds: string[];
    setting?: Campaign['setting'];
  }): Promise<Campaign> {
    const campaign: Campaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      dmId: params.isAIDM ? 'ai_dm' : 'user_dm',
      dmName: params.isAIDM ? 'AI Dungeon Master' : 'Dungeon Master',
      players: params.characterIds,
      isAIDM: params.isAIDM,
      currentScene: 'You find yourselves at the entrance of a mysterious dungeon...',
      storyLog: [],
      combatActive: false,
      turnOrder: [],
      createdAt: new Date(),
      lastPlayed: new Date(),
      setting: params.setting || 'Forgotten Realms',
      difficulty: 'Normal',
    };

    await this.saveCampaign(campaign);
    return campaign;
  }

  async addStoryEntry(campaignId: string, entry: Omit<StoryEntry, 'id' | 'timestamp'>): Promise<void> {
    const data = await this.loadData();
    const campaign = data.campaigns.find(c => c.id === campaignId);

    if (campaign) {
      const storyEntry: StoryEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...entry,
      };

      campaign.storyLog.push(storyEntry);
      campaign.lastPlayed = new Date();
      await this.saveData(data);
    }
  }

  // ============= AI DUNGEON MASTER =============

  async getAIDMResponse(campaignId: string, playerAction: string): Promise<string> {
    // In production, this would call an AI API (like OpenAI)
    // For now, generate contextual responses

    const responses = [
      `As you ${playerAction}, you notice something glinting in the shadows...`,
      `The ${playerAction} echoes through the chamber. Suddenly, you hear footsteps approaching...`,
      `Your attempt to ${playerAction} is partially successful. A hidden door creaks open...`,
      `Roll for ${playerAction}. The DC is 15.`,
      `The mysterious figure watches as you ${playerAction}, then whispers: "Interesting choice, adventurer..."`,
      `Your ${playerAction} disturbs something ancient. The ground begins to rumble...`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateEncounter(partyLevel: number, difficulty: Campaign['difficulty']): CombatEncounter {
    const crMultiplier = difficulty === 'Easy' ? 0.5 : difficulty === 'Hard' ? 1.5 : difficulty === 'Deadly' ? 2 : 1;
    const targetCR = partyLevel * crMultiplier;

    const enemyTemplates = [
      { name: 'Goblin', cr: 0.25, hp: 7, ac: 15, damage: '1d6', type: 'Humanoid' },
      { name: 'Orc', cr: 0.5, hp: 15, ac: 13, damage: '1d12', type: 'Humanoid' },
      { name: 'Skeleton', cr: 0.25, hp: 13, ac: 13, damage: '1d6', type: 'Undead' },
      { name: 'Ogre', cr: 2, hp: 59, ac: 11, damage: '2d8', type: 'Giant' },
      { name: 'Troll', cr: 5, hp: 84, ac: 15, damage: '2d6', type: 'Giant' },
    ];

    const enemies: Enemy[] = [];
    let currentCR = 0;

    while (currentCR < targetCR) {
      const template = enemyTemplates[Math.floor(Math.random() * enemyTemplates.length)];
      enemies.push({
        id: `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} ${enemies.length + 1}`,
        hp: template.hp,
        maxHp: template.hp,
        ac: template.ac,
        initiative: Math.floor(Math.random() * 20) + 1,
        damage: template.damage,
        cr: template.cr,
        type: template.type,
        description: `A fearsome ${template.name.toLowerCase()}`,
      });
      currentCR += template.cr;
    }

    return {
      id: `encounter_${Date.now()}`,
      campaignId: '',
      enemies,
      turnOrder: [],
      round: 1,
      active: true,
    };
  }

  // ============= STORAGE =============

  private async loadData(): Promise<{
    characters: Character[];
    campaigns: Campaign[];
  }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { characters: [], campaigns: [] };
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load D&D data:', error);
      return { characters: [], campaigns: [] };
    }
  }

  private async saveData(data: { characters: Character[]; campaigns: Campaign[] }): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async saveCharacter(character: Character): Promise<void> {
    const data = await this.loadData();
    const index = data.characters.findIndex(c => c.id === character.id);

    if (index !== -1) {
      data.characters[index] = character;
    } else {
      data.characters.push(character);
    }

    await this.saveData(data);
  }

  async getCharacters(): Promise<Character[]> {
    const data = await this.loadData();
    return data.characters;
  }

  async getCharacter(id: string): Promise<Character | null> {
    const data = await this.loadData();
    return data.characters.find(c => c.id === id) || null;
  }

  async deleteCharacter(id: string): Promise<void> {
    const data = await this.loadData();
    data.characters = data.characters.filter(c => c.id !== id);
    await this.saveData(data);
  }

  async saveCampaign(campaign: Campaign): Promise<void> {
    const data = await this.loadData();
    const index = data.campaigns.findIndex(c => c.id === campaign.id);

    if (index !== -1) {
      data.campaigns[index] = campaign;
    } else {
      data.campaigns.push(campaign);
    }

    await this.saveData(data);
  }

  async getCampaigns(): Promise<Campaign[]> {
    const data = await this.loadData();
    return data.campaigns;
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    const data = await this.loadData();
    return data.campaigns.find(c => c.id === id) || null;
  }

  async deleteCampaign(id: string): Promise<void> {
    const data = await this.loadData();
    data.campaigns = data.campaigns.filter(c => c.id !== id);
    await this.saveData(data);
  }
}

export const dndService = new DnDService();

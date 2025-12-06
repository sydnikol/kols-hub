/**
 * UNIFIED D&D & GAMING ECOSYSTEM
 *
 * Consolidates all gaming functionality:
 * - DnDPage, GamingHubPage, BoardGamesPage
 * - Character management, campaigns, sessions
 * - Video game library, achievements
 * - Board game collection
 *
 * Cross-system connections:
 * - Health: Spoon management for gaming sessions
 * - Social: Gaming groups, session coordination
 * - Entertainment: Streaming integration
 * - Learning: Strategy skills, world-building
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// D&D INTERFACES
// ============================================================================

export interface DnDCharacter {
  id: string;
  name: string;
  race: string;
  class: string;
  subclass?: string;
  level: number;
  experience: number;
  background: string;
  alignment: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows: Record<string, number>;
  skills: Record<string, { proficient: boolean; expertise: boolean; bonus: number }>;
  hitPoints: {
    max: number;
    current: number;
    temporary: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    weight: number;
    equipped: boolean;
    magical: boolean;
    description?: string;
    properties?: string[];
  }>;
  spells?: {
    spellcastingAbility: string;
    spellSaveDC: number;
    spellAttackBonus: number;
    slots: Record<number, { max: number; used: number }>;
    known: Array<{
      name: string;
      level: number;
      school: string;
      prepared: boolean;
      ritual: boolean;
    }>;
  };
  features: Array<{
    name: string;
    source: string;
    description: string;
    usesPerRest?: { max: number; current: number; restType: 'short' | 'long' };
  }>;
  backstory: string;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  notes: string;
  portrait?: string;
  campaignId?: string;
  isNPC: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DnDCampaign {
  id: string;
  name: string;
  description: string;
  setting: string;
  dungeonMaster: string;
  dmIsAI: boolean;
  players: Array<{
    name: string;
    characterId: string;
    isActive: boolean;
  }>;
  npcs: string[]; // Character IDs
  sessions: string[]; // Session IDs
  currentSessionNumber: number;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'abandoned';
  startDate?: Date;
  endDate?: Date;
  worldBuilding: {
    locations: Array<{
      id: string;
      name: string;
      type: string;
      description: string;
      parentLocationId?: string;
      npcs: string[];
      notes: string;
    }>;
    factions: Array<{
      id: string;
      name: string;
      description: string;
      alignment: string;
      relationships: Record<string, 'ally' | 'neutral' | 'enemy'>;
      members: string[];
    }>;
    lore: Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      knownByPlayers: boolean;
    }>;
  };
  questLog: Array<{
    id: string;
    title: string;
    description: string;
    status: 'available' | 'active' | 'completed' | 'failed';
    objectives: Array<{
      description: string;
      completed: boolean;
    }>;
    rewards?: string;
    givenBy?: string;
    deadline?: string;
  }>;
  notes: string;
  homebrewRules: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DnDSession {
  id: string;
  campaignId: string;
  sessionNumber: number;
  title: string;
  date: Date;
  duration: number; // minutes
  attendees: Array<{
    playerName: string;
    characterId: string;
    present: boolean;
  }>;
  summary: string;
  keyEvents: string[];
  combatEncounters: Array<{
    name: string;
    enemies: Array<{ name: string; count: number; cr?: number }>;
    outcome: 'victory' | 'defeat' | 'fled' | 'negotiated';
    experienceAwarded: number;
    lootDropped: string[];
  }>;
  roleplayHighlights: string[];
  npcsEncountered: string[];
  locationsVisited: string[];
  questsUpdated: string[];
  levelUps: Array<{
    characterId: string;
    newLevel: number;
  }>;
  playerNotes: string;
  dmNotes: string;
  nextSessionTeaser?: string;
  createdAt: Date;
}

export interface AIGeneratedContent {
  id: string;
  type: 'npc' | 'location' | 'quest' | 'encounter' | 'item' | 'lore' | 'dialogue';
  prompt: string;
  content: any;
  campaignId?: string;
  used: boolean;
  rating?: number;
  createdAt: Date;
}

// ============================================================================
// VIDEO GAME INTERFACES
// ============================================================================

export interface VideoGame {
  id: string;
  title: string;
  platform: string[];
  genre: string[];
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  status: 'backlog' | 'playing' | 'completed' | 'abandoned' | 'wishlist' | '100%';
  rating?: number;
  hoursPlayed: number;
  completionPercentage: number;
  achievements?: Array<{
    name: string;
    description: string;
    unlocked: boolean;
    unlockedDate?: Date;
    rarity?: number;
  }>;
  currentSave?: {
    location: string;
    level?: number;
    lastPlayed: Date;
    notes: string;
  };
  notes: string;
  tags: string[];
  coverImage?: string;
  steamId?: string;
  playstationId?: string;
  xboxId?: string;
  nintendoId?: string;
  spoonCost: number; // 1-5 energy cost
  multiplayerCapable: boolean;
  onlineRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GamingSession {
  id: string;
  gameId?: string;
  dndSessionId?: string;
  boardGameId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  players?: string[];
  energyBefore?: number;
  energyAfter?: number;
  mood?: 'fun' | 'frustrated' | 'relaxed' | 'competitive' | 'social';
  notes: string;
  achievements?: string[];
  createdAt: Date;
}

// ============================================================================
// BOARD GAME INTERFACES
// ============================================================================

export interface BoardGame {
  id: string;
  name: string;
  publisher?: string;
  yearPublished?: number;
  minPlayers: number;
  maxPlayers: number;
  playTime: { min: number; max: number };
  complexity: number; // 1-5
  categories: string[];
  mechanics: string[];
  bggId?: string;
  bggRating?: number;
  personalRating?: number;
  owned: boolean;
  wishlist: boolean;
  timesPlayed: number;
  lastPlayed?: Date;
  expansion: boolean;
  baseGameId?: string;
  expansions: string[];
  notes: string;
  rulesUrl?: string;
  image?: string;
  location?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  sleevedCards: boolean;
  spoonCost: number;
  bestPlayerCount?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardGamePlay {
  id: string;
  gameId: string;
  date: Date;
  duration?: number;
  players: Array<{
    name: string;
    personId?: string;
    score?: number;
    winner: boolean;
    color?: string;
    faction?: string;
  }>;
  location?: string;
  notes: string;
  photos?: string[];
  rating?: number;
  teachingGame: boolean;
  createdAt: Date;
}

// ============================================================================
// UNIFIED DND & GAMING ECOSYSTEM CLASS
// ============================================================================

class UnifiedDnDGamingEcosystem {
  private static instance: UnifiedDnDGamingEcosystem;

  // D&D Data
  private characters: Map<string, DnDCharacter> = new Map();
  private campaigns: Map<string, DnDCampaign> = new Map();
  private dndSessions: Map<string, DnDSession> = new Map();
  private aiGeneratedContent: AIGeneratedContent[] = [];

  // Video Game Data
  private videoGames: Map<string, VideoGame> = new Map();
  private gamingSessions: GamingSession[] = [];

  // Board Game Data
  private boardGames: Map<string, BoardGame> = new Map();
  private boardGamePlays: BoardGamePlay[] = [];

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  static getInstance(): UnifiedDnDGamingEcosystem {
    if (!UnifiedDnDGamingEcosystem.instance) {
      UnifiedDnDGamingEcosystem.instance = new UnifiedDnDGamingEcosystem();
    }
    return UnifiedDnDGamingEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - track gaming energy
    eventBus.on('health:energy:changed', (data: any) => {
      this.updateGameRecommendations(data.currentSpoons);
    });

    // Social integration - coordinate gaming sessions
    eventBus.on('relationships:event:created', (data: any) => {
      if (data.type === 'gaming' || data.type === 'dnd') {
        this.linkSocialEvent(data);
      }
    });

    // Entertainment integration
    eventBus.on('entertainment:streaming:started', (data: any) => {
      if (data.category === 'gaming') {
        console.log('[Gaming] Streaming detected, may want to track session');
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_dnd_gaming_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.characters) data.characters.forEach((c: DnDCharacter) => this.characters.set(c.id, c));
        if (data.campaigns) data.campaigns.forEach((c: DnDCampaign) => this.campaigns.set(c.id, c));
        if (data.dndSessions) data.dndSessions.forEach((s: DnDSession) => this.dndSessions.set(s.id, s));
        if (data.aiGeneratedContent) this.aiGeneratedContent = data.aiGeneratedContent;
        if (data.videoGames) data.videoGames.forEach((g: VideoGame) => this.videoGames.set(g.id, g));
        if (data.gamingSessions) this.gamingSessions = data.gamingSessions;
        if (data.boardGames) data.boardGames.forEach((g: BoardGame) => this.boardGames.set(g.id, g));
        if (data.boardGamePlays) this.boardGamePlays = data.boardGamePlays;
      }
    } catch (error) {
      console.error('[Gaming] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        characters: Array.from(this.characters.values()),
        campaigns: Array.from(this.campaigns.values()),
        dndSessions: Array.from(this.dndSessions.values()),
        aiGeneratedContent: this.aiGeneratedContent.slice(-200),
        videoGames: Array.from(this.videoGames.values()),
        gamingSessions: this.gamingSessions.slice(-500),
        boardGames: Array.from(this.boardGames.values()),
        boardGamePlays: this.boardGamePlays.slice(-500)
      };
      localStorage.setItem('unified_dnd_gaming_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Gaming] Failed to save to storage:', error);
    }
  }

  // ============================================================================
  // D&D CHARACTER MANAGEMENT
  // ============================================================================

  async createCharacter(character: Omit<DnDCharacter, 'id' | 'createdAt' | 'updatedAt'>): Promise<DnDCharacter> {
    const newCharacter: DnDCharacter = {
      ...character,
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.characters.set(newCharacter.id, newCharacter);
    this.saveToStorage();

    eventBus.emit('gaming:dnd:character:created', newCharacter);
    return newCharacter;
  }

  async updateCharacter(characterId: string, updates: Partial<DnDCharacter>): Promise<DnDCharacter | null> {
    const character = this.characters.get(characterId);
    if (!character) return null;

    Object.assign(character, updates, { updatedAt: new Date() });
    this.characters.set(characterId, character);
    this.saveToStorage();

    return character;
  }

  async levelUpCharacter(characterId: string, newLevel: number, hpIncrease: number, newFeatures?: DnDCharacter['features']): Promise<DnDCharacter | null> {
    const character = this.characters.get(characterId);
    if (!character) return null;

    character.level = newLevel;
    character.hitPoints.max += hpIncrease;
    character.hitPoints.current += hpIncrease;
    character.proficiencyBonus = Math.ceil(newLevel / 4) + 1;

    if (newFeatures) {
      character.features.push(...newFeatures);
    }

    character.updatedAt = new Date();
    this.characters.set(characterId, character);
    this.saveToStorage();

    eventBus.emit('gaming:dnd:character:levelup', { character, newLevel });
    return character;
  }

  async damageCharacter(characterId: string, damage: number): Promise<DnDCharacter | null> {
    const character = this.characters.get(characterId);
    if (!character) return null;

    // Apply to temporary HP first
    if (character.hitPoints.temporary > 0) {
      const tempAbsorbed = Math.min(character.hitPoints.temporary, damage);
      character.hitPoints.temporary -= tempAbsorbed;
      damage -= tempAbsorbed;
    }

    character.hitPoints.current = Math.max(0, character.hitPoints.current - damage);
    character.updatedAt = new Date();
    this.characters.set(characterId, character);
    this.saveToStorage();

    if (character.hitPoints.current === 0) {
      eventBus.emit('gaming:dnd:character:downed', character);
    }

    return character;
  }

  async healCharacter(characterId: string, healing: number): Promise<DnDCharacter | null> {
    const character = this.characters.get(characterId);
    if (!character) return null;

    character.hitPoints.current = Math.min(character.hitPoints.max, character.hitPoints.current + healing);
    character.updatedAt = new Date();
    this.characters.set(characterId, character);
    this.saveToStorage();

    return character;
  }

  getCharacter(characterId: string): DnDCharacter | undefined {
    return this.characters.get(characterId);
  }

  getAllCharacters(): DnDCharacter[] {
    return Array.from(this.characters.values());
  }

  getPlayerCharacters(): DnDCharacter[] {
    return Array.from(this.characters.values()).filter(c => !c.isNPC);
  }

  getNPCs(campaignId?: string): DnDCharacter[] {
    let npcs = Array.from(this.characters.values()).filter(c => c.isNPC);
    if (campaignId) {
      npcs = npcs.filter(c => c.campaignId === campaignId);
    }
    return npcs;
  }

  // ============================================================================
  // D&D CAMPAIGN MANAGEMENT
  // ============================================================================

  async createCampaign(campaign: Omit<DnDCampaign, 'id' | 'sessions' | 'currentSessionNumber' | 'createdAt' | 'updatedAt'>): Promise<DnDCampaign> {
    const newCampaign: DnDCampaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      sessions: [],
      currentSessionNumber: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.campaigns.set(newCampaign.id, newCampaign);
    this.saveToStorage();

    eventBus.emit('gaming:dnd:campaign:created', newCampaign);
    return newCampaign;
  }

  async updateCampaignStatus(campaignId: string, status: DnDCampaign['status']): Promise<DnDCampaign | null> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    campaign.status = status;
    campaign.updatedAt = new Date();

    if (status === 'completed') {
      campaign.endDate = new Date();
      eventBus.emit('gaming:dnd:campaign:completed', campaign);
    }

    this.campaigns.set(campaignId, campaign);
    this.saveToStorage();

    return campaign;
  }

  async addQuestToCampaign(campaignId: string, quest: DnDCampaign['questLog'][0]): Promise<DnDCampaign | null> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    campaign.questLog.push(quest);
    campaign.updatedAt = new Date();
    this.campaigns.set(campaignId, campaign);
    this.saveToStorage();

    return campaign;
  }

  async updateQuestStatus(campaignId: string, questId: string, status: DnDCampaign['questLog'][0]['status']): Promise<DnDCampaign | null> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    const quest = campaign.questLog.find(q => q.id === questId);
    if (quest) {
      quest.status = status;
      campaign.updatedAt = new Date();
      this.campaigns.set(campaignId, campaign);
      this.saveToStorage();
    }

    return campaign;
  }

  getCampaign(campaignId: string): DnDCampaign | undefined {
    return this.campaigns.get(campaignId);
  }

  getAllCampaigns(): DnDCampaign[] {
    return Array.from(this.campaigns.values());
  }

  getActiveCampaigns(): DnDCampaign[] {
    return Array.from(this.campaigns.values()).filter(c => c.status === 'active');
  }

  // ============================================================================
  // D&D SESSION MANAGEMENT
  // ============================================================================

  async createSession(session: Omit<DnDSession, 'id' | 'createdAt'>): Promise<DnDSession> {
    const newSession: DnDSession = {
      ...session,
      id: `session_${Date.now()}`,
      createdAt: new Date()
    };

    this.dndSessions.set(newSession.id, newSession);

    // Update campaign
    const campaign = this.campaigns.get(session.campaignId);
    if (campaign) {
      campaign.sessions.push(newSession.id);
      campaign.currentSessionNumber = session.sessionNumber;
      campaign.updatedAt = new Date();
      this.campaigns.set(campaign.id, campaign);
    }

    // Process level ups
    for (const levelUp of session.levelUps) {
      const character = this.characters.get(levelUp.characterId);
      if (character) {
        await this.levelUpCharacter(levelUp.characterId, levelUp.newLevel, Math.floor(Math.random() * 6) + 1 + Math.floor((character.stats.constitution - 10) / 2));
      }
    }

    this.saveToStorage();

    // Track as gaming session
    this.gamingSessions.push({
      id: `gsession_${Date.now()}`,
      dndSessionId: newSession.id,
      startTime: session.date,
      duration: session.duration,
      players: session.attendees.filter(a => a.present).map(a => a.playerName),
      notes: session.summary,
      createdAt: new Date()
    });

    // Track spoon usage
    eventBus.emit('health:spoons:used', {
      amount: Math.ceil(session.duration / 60) * 2,
      activity: 'dnd_session',
      linkedId: newSession.id
    });

    eventBus.emit('gaming:dnd:session:created', newSession);
    return newSession;
  }

  getSession(sessionId: string): DnDSession | undefined {
    return this.dndSessions.get(sessionId);
  }

  getCampaignSessions(campaignId: string): DnDSession[] {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return [];

    return campaign.sessions
      .map(id => this.dndSessions.get(id))
      .filter((s): s is DnDSession => !!s)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);
  }

  // ============================================================================
  // AI DM FEATURES
  // ============================================================================

  async generateAIContent(type: AIGeneratedContent['type'], prompt: string, campaignId?: string): Promise<AIGeneratedContent> {
    // In production, this would call an AI service
    const content = await this.simulateAIGeneration(type, prompt);

    const generated: AIGeneratedContent = {
      id: `ai_${Date.now()}`,
      type,
      prompt,
      content,
      campaignId,
      used: false,
      createdAt: new Date()
    };

    this.aiGeneratedContent.push(generated);
    this.saveToStorage();

    eventBus.emit('gaming:dnd:ai:generated', generated);
    return generated;
  }

  private async simulateAIGeneration(type: AIGeneratedContent['type'], prompt: string): Promise<any> {
    // Simulated AI generation - in production would use actual AI
    switch (type) {
      case 'npc':
        return {
          name: 'Generated NPC',
          race: 'Human',
          occupation: 'Merchant',
          personality: 'Friendly but shrewd',
          secrets: ['Secretly a retired adventurer'],
          hooks: ['Needs help with a shipment problem']
        };
      case 'location':
        return {
          name: 'The Wandering Wyvern',
          type: 'Tavern',
          description: 'A cozy tavern with low ceilings and warm hearth',
          features: ['Hidden cellar', 'Secret meeting room'],
          npcs: ['Burly bartender', 'Mysterious hooded figure']
        };
      case 'encounter':
        return {
          name: 'Goblin Ambush',
          difficulty: 'Medium',
          enemies: [{ name: 'Goblin', count: 4 }, { name: 'Goblin Boss', count: 1 }],
          terrain: 'Forest clearing',
          tactics: 'Goblins hide in trees and attack from above'
        };
      case 'quest':
        return {
          title: 'The Missing Merchant',
          hook: 'A wealthy merchant has gone missing on the road',
          objectives: ['Investigate the last known location', 'Track the kidnappers', 'Rescue the merchant'],
          rewards: ['Gold', 'Merchant contact', 'Reputation in town']
        };
      default:
        return { generated: true, prompt };
    }
  }

  markAIContentUsed(contentId: string, rating?: number): void {
    const content = this.aiGeneratedContent.find(c => c.id === contentId);
    if (content) {
      content.used = true;
      content.rating = rating;
      this.saveToStorage();
    }
  }

  getAIContent(type?: AIGeneratedContent['type'], unused?: boolean): AIGeneratedContent[] {
    let content = [...this.aiGeneratedContent];
    if (type) content = content.filter(c => c.type === type);
    if (unused) content = content.filter(c => !c.used);
    return content.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ============================================================================
  // VIDEO GAME MANAGEMENT
  // ============================================================================

  async addVideoGame(game: Omit<VideoGame, 'id' | 'hoursPlayed' | 'completionPercentage' | 'createdAt' | 'updatedAt'>): Promise<VideoGame> {
    const newGame: VideoGame = {
      ...game,
      id: `vgame_${Date.now()}`,
      hoursPlayed: 0,
      completionPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.videoGames.set(newGame.id, newGame);
    this.saveToStorage();

    eventBus.emit('gaming:videogame:added', newGame);
    return newGame;
  }

  async updateVideoGameProgress(gameId: string, hoursPlayed: number, completionPercentage: number, notes?: string): Promise<VideoGame | null> {
    const game = this.videoGames.get(gameId);
    if (!game) return null;

    game.hoursPlayed = hoursPlayed;
    game.completionPercentage = completionPercentage;
    if (notes) game.notes = notes;
    game.updatedAt = new Date();

    if (game.currentSave) {
      game.currentSave.lastPlayed = new Date();
    }

    // Update status based on completion
    if (completionPercentage === 100 && game.status !== '100%') {
      game.status = 'completed';
    }

    this.videoGames.set(gameId, game);
    this.saveToStorage();

    return game;
  }

  async unlockAchievement(gameId: string, achievementName: string): Promise<VideoGame | null> {
    const game = this.videoGames.get(gameId);
    if (!game || !game.achievements) return null;

    const achievement = game.achievements.find(a => a.name === achievementName);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = new Date();
      game.updatedAt = new Date();
      this.videoGames.set(gameId, game);
      this.saveToStorage();

      eventBus.emit('gaming:achievement:unlocked', { game, achievement });
    }

    return game;
  }

  getVideoGame(gameId: string): VideoGame | undefined {
    return this.videoGames.get(gameId);
  }

  getAllVideoGames(): VideoGame[] {
    return Array.from(this.videoGames.values());
  }

  getVideoGamesByStatus(status: VideoGame['status']): VideoGame[] {
    return Array.from(this.videoGames.values()).filter(g => g.status === status);
  }

  getBacklog(): VideoGame[] {
    return this.getVideoGamesByStatus('backlog');
  }

  getCurrentlyPlaying(): VideoGame[] {
    return this.getVideoGamesByStatus('playing');
  }

  // ============================================================================
  // BOARD GAME MANAGEMENT
  // ============================================================================

  async addBoardGame(game: Omit<BoardGame, 'id' | 'timesPlayed' | 'createdAt' | 'updatedAt'>): Promise<BoardGame> {
    const newGame: BoardGame = {
      ...game,
      id: `bgame_${Date.now()}`,
      timesPlayed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.boardGames.set(newGame.id, newGame);
    this.saveToStorage();

    eventBus.emit('gaming:boardgame:added', newGame);
    return newGame;
  }

  async logBoardGamePlay(play: Omit<BoardGamePlay, 'id' | 'createdAt'>): Promise<BoardGamePlay> {
    const newPlay: BoardGamePlay = {
      ...play,
      id: `bplay_${Date.now()}`,
      createdAt: new Date()
    };

    this.boardGamePlays.push(newPlay);

    // Update game stats
    const game = this.boardGames.get(play.gameId);
    if (game) {
      game.timesPlayed++;
      game.lastPlayed = play.date;
      game.updatedAt = new Date();
      this.boardGames.set(game.id, game);
    }

    // Track as gaming session
    this.gamingSessions.push({
      id: `gsession_${Date.now()}`,
      boardGameId: play.gameId,
      startTime: play.date,
      duration: play.duration,
      players: play.players.map(p => p.name),
      notes: play.notes,
      createdAt: new Date()
    });

    // Track spoon usage
    if (game) {
      eventBus.emit('health:spoons:used', {
        amount: game.spoonCost,
        activity: 'board_game',
        linkedId: newPlay.id
      });
    }

    this.saveToStorage();

    // Link players to relationships if personId provided
    for (const player of play.players) {
      if (player.personId) {
        eventBus.emit('relationships:interaction:logged', {
          personIds: [player.personId],
          type: 'board_game',
          date: play.date,
          duration: play.duration,
          notes: `Played ${game?.name || 'board game'}`
        });
      }
    }

    eventBus.emit('gaming:boardgame:played', { play, game });
    return newPlay;
  }

  getBoardGame(gameId: string): BoardGame | undefined {
    return this.boardGames.get(gameId);
  }

  getAllBoardGames(): BoardGame[] {
    return Array.from(this.boardGames.values());
  }

  getOwnedBoardGames(): BoardGame[] {
    return Array.from(this.boardGames.values()).filter(g => g.owned);
  }

  getBoardGameWishlist(): BoardGame[] {
    return Array.from(this.boardGames.values()).filter(g => g.wishlist && !g.owned);
  }

  getBoardGamePlays(gameId?: string, limit?: number): BoardGamePlay[] {
    let plays = [...this.boardGamePlays];
    if (gameId) plays = plays.filter(p => p.gameId === gameId);
    plays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (limit) plays = plays.slice(0, limit);
    return plays;
  }

  getSuggestedGamesForPlayerCount(count: number): BoardGame[] {
    return Array.from(this.boardGames.values())
      .filter(g => g.owned && g.minPlayers <= count && g.maxPlayers >= count)
      .sort((a, b) => {
        // Prefer games where this player count is optimal
        const aOptimal = a.bestPlayerCount?.includes(count) ? 1 : 0;
        const bOptimal = b.bestPlayerCount?.includes(count) ? 1 : 0;
        if (aOptimal !== bOptimal) return bOptimal - aOptimal;
        // Then by personal rating
        return (b.personalRating || 0) - (a.personalRating || 0);
      });
  }

  // ============================================================================
  // GAMING SESSIONS
  // ============================================================================

  async startGamingSession(session: Omit<GamingSession, 'id' | 'endTime' | 'duration' | 'createdAt'>): Promise<GamingSession> {
    const newSession: GamingSession = {
      ...session,
      id: `gsession_${Date.now()}`,
      createdAt: new Date()
    };

    this.gamingSessions.push(newSession);
    this.saveToStorage();

    eventBus.emit('gaming:session:started', newSession);
    return newSession;
  }

  async endGamingSession(sessionId: string, notes: string, energyAfter?: number, achievements?: string[]): Promise<GamingSession | null> {
    const session = this.gamingSessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000);
    session.notes = notes;
    session.energyAfter = energyAfter;
    session.achievements = achievements;

    // Update game hours if video game
    if (session.gameId) {
      const game = this.videoGames.get(session.gameId);
      if (game) {
        game.hoursPlayed += session.duration / 60;
        if (game.currentSave) {
          game.currentSave.lastPlayed = new Date();
        }
        this.videoGames.set(game.id, game);
      }
    }

    this.saveToStorage();

    eventBus.emit('gaming:session:ended', session);
    return session;
  }

  getGamingSessions(options?: { gameId?: string; limit?: number; type?: 'video' | 'board' | 'dnd' }): GamingSession[] {
    let sessions = [...this.gamingSessions];

    if (options?.gameId) {
      sessions = sessions.filter(s => s.gameId === options.gameId);
    }
    if (options?.type === 'video') {
      sessions = sessions.filter(s => s.gameId);
    }
    if (options?.type === 'board') {
      sessions = sessions.filter(s => s.boardGameId);
    }
    if (options?.type === 'dnd') {
      sessions = sessions.filter(s => s.dndSessionId);
    }

    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    if (options?.limit) {
      sessions = sessions.slice(0, options.limit);
    }

    return sessions;
  }

  // ============================================================================
  // ANALYTICS & RECOMMENDATIONS
  // ============================================================================

  private updateGameRecommendations(currentSpoons: number): void {
    // Get games appropriate for current energy level
    const lowSpoonGames = Array.from(this.videoGames.values())
      .filter(g => g.spoonCost <= Math.ceil(currentSpoons / 2) && g.status === 'playing')
      .slice(0, 3);

    if (lowSpoonGames.length > 0) {
      console.log('[Gaming] Low spoon game recommendations:', lowSpoonGames.map(g => g.title));
    }
  }

  getGameRecommendations(spoons: number): {
    videoGames: VideoGame[];
    boardGames: BoardGame[];
    reason: string;
  } {
    const maxSpoonCost = Math.ceil(spoons / 2);

    const videoGames = Array.from(this.videoGames.values())
      .filter(g => g.spoonCost <= maxSpoonCost && (g.status === 'playing' || g.status === 'backlog'))
      .sort((a, b) => a.spoonCost - b.spoonCost)
      .slice(0, 5);

    const boardGames = Array.from(this.boardGames.values())
      .filter(g => g.owned && g.spoonCost <= maxSpoonCost)
      .sort((a, b) => a.spoonCost - b.spoonCost)
      .slice(0, 5);

    return {
      videoGames,
      boardGames,
      reason: spoons <= 3 ? 'Low energy - relaxing games recommended' : 'Games matching your current energy level'
    };
  }

  private linkSocialEvent(data: any): void {
    console.log('[Gaming] Linked social gaming event:', data);
  }

  getGamingStats(): {
    totalVideoGames: number;
    totalBoardGames: number;
    totalDnDCharacters: number;
    activeCampaigns: number;
    hoursPlayedThisMonth: number;
    boardGamesPlayedThisMonth: number;
    achievementsUnlocked: number;
    backlogSize: number;
  } {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthSessions = this.gamingSessions.filter(s => new Date(s.startTime) >= monthStart);
    const videoGameHours = thisMonthSessions
      .filter(s => s.gameId)
      .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

    const boardGamesPlayed = this.boardGamePlays.filter(p => new Date(p.date) >= monthStart).length;

    const totalAchievements = Array.from(this.videoGames.values())
      .flatMap(g => g.achievements || [])
      .filter(a => a.unlocked).length;

    return {
      totalVideoGames: this.videoGames.size,
      totalBoardGames: this.boardGames.size,
      totalDnDCharacters: this.characters.size,
      activeCampaigns: this.getActiveCampaigns().length,
      hoursPlayedThisMonth: Math.round(videoGameHours * 10) / 10,
      boardGamesPlayedThisMonth: boardGamesPlayed,
      achievementsUnlocked: totalAchievements,
      backlogSize: this.getBacklog().length
    };
  }
}

// Export singleton instance
export const dndGamingEcosystem = UnifiedDnDGamingEcosystem.getInstance();

// Export convenience functions
export const createCharacter = (c: Parameters<typeof dndGamingEcosystem.createCharacter>[0]) => dndGamingEcosystem.createCharacter(c);
export const createCampaign = (c: Parameters<typeof dndGamingEcosystem.createCampaign>[0]) => dndGamingEcosystem.createCampaign(c);
export const addVideoGame = (g: Parameters<typeof dndGamingEcosystem.addVideoGame>[0]) => dndGamingEcosystem.addVideoGame(g);
export const addBoardGame = (g: Parameters<typeof dndGamingEcosystem.addBoardGame>[0]) => dndGamingEcosystem.addBoardGame(g);
export const generateAIContent = (type: any, prompt: string, campaignId?: string) => dndGamingEcosystem.generateAIContent(type, prompt, campaignId);
export const getGamingStats = () => dndGamingEcosystem.getGamingStats();

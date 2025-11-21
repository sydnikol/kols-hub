/**
 * D&D TYPE DEFINITIONS
 * Complete type system for D&D 5e gameplay
 */

// CHARACTER TYPES
export type CharacterClass = 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard';
export type CharacterRace = 'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Dragonborn' | 'Gnome' | 'Half-Elf' | 'Half-Orc' | 'Tiefling';
export type Alignment = 'LG' | 'NG' | 'CG' | 'LN' | 'TN' | 'CN' | 'LE' | 'NE' | 'CE';
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface DnDCharacter {
  id: string;
  name: string;
  class: CharacterClass;
  race: CharacterRace;
  level: number;
  alignment: Alignment;

  // Ability Scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat Stats
  maxHP: number;
  currentHP: number;
  armorClass: number;
  initiative: number;
  speed: number;
  attackBonus: number;

  // Resources
  hitDice: string; // e.g., "1d8"
  spellSlots: SpellSlots;

  // Skills & Proficiencies
  skills: Skill[];
  savingThrows: AbilityScore[];
  proficiencies: string[];
  languages: string[];

  // Equipment
  weapon?: Weapon;
  armor?: Armor;
  inventory: Item[];
  gold: number;

  // Progression
  experience: number;
  proficiencyBonus: number;

  // Spells (if applicable)
  knownSpells: Spell[];
  preparedSpells: Spell[];

  // Background
  background: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;

  // Status
  conditions: Condition[];
  inspiration: boolean;

  createdAt: string;
}

export interface SpellSlots {
  level1: { max: number; current: number };
  level2: { max: number; current: number };
  level3: { max: number; current: number };
  level4: { max: number; current: number };
  level5: { max: number; current: number };
  level6: { max: number; current: number };
  level7: { max: number; current: number };
  level8: { max: number; current: number };
  level9: { max: number; current: number };
}

export interface Skill {
  name: string;
  ability: AbilityScore;
  proficient: boolean;
  expertise: boolean;
  bonus: number;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  damage: string; // e.g., "1d8"
  damageType: 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force' | 'psychic';
  properties: string[];
  range?: { normal: number; long: number };
}

export interface Armor {
  id: string;
  name: string;
  type: 'light' | 'medium' | 'heavy' | 'shield';
  armorClass: number;
  stealthDisadvantage: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'tool' | 'misc';
  description: string;
  quantity: number;
  weight: number;
  value: number; // in gold
  magical: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
  properties?: any;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: 'abjuration' | 'conjuration' | 'divination' | 'enchantment' | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: string;
  concentration: boolean;
  description: string;
  damage?: string;
  savingThrow?: {
    ability: AbilityScore;
    effect: string;
  };
}

export type Condition = 'blinded' | 'charmed' | 'deafened' | 'frightened' | 'grappled' | 'incapacitated' | 'invisible' | 'paralyzed' | 'petrified' | 'poisoned' | 'prone' | 'restrained' | 'stunned' | 'unconscious';

// CAMPAIGN TYPES
export interface DnDCampaign {
  id: string;
  name: string;
  description: string;
  level: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'deadly';
  currentChapter: number;
  totalChapters: number;
  startedAt: string;
}

// COMBAT TYPES
export interface DnDCombatEncounter {
  id: string;
  name: string;
  description: string;
  round: number;
  turnOrder: CombatTurn[];
  currentTurnIndex: number;
  enemies: Enemy[];
  allies: Ally[];
  environment: string;
  startedAt: string;
}

export interface CombatTurn {
  id: string;
  name: string;
  initiative: number;
  type: 'player' | 'enemy' | 'ally';
  hasActed: boolean;
}

export interface Enemy {
  id: string;
  name: string;
  type: string; // e.g., "Goblin", "Dragon"
  maxHP: number;
  currentHP: number;
  armorClass: number;
  initiative: number;
  attacks: Attack[];
  abilities: string[];
  vulnerabilities: string[];
  resistances: string[];
  immunities: string[];
  challengeRating: number;
  xpValue: number;
  loot: Item[];
  status: 'active' | 'defeated' | 'fled';
}

export interface Ally {
  id: string;
  name: string;
  type: string;
  maxHP: number;
  currentHP: number;
  armorClass: number;
  initiative: number;
}

export interface Attack {
  name: string;
  toHit: number;
  damage: string;
  damageType: string;
  range?: number;
  description?: string;
}

// QUEST TYPES
export interface DnDQuest {
  id: string;
  name: string;
  description: string;
  questGiver: string;
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    gold: number;
    items: Item[];
    reputation?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  location: string;
  level: number;
  status: 'available' | 'active' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'talk' | 'explore' | 'deliver' | 'protect';
  target?: string;
  currentProgress: number;
  requiredProgress: number;
  completed: boolean;
}

// MULTIPLAYER TYPES
export interface MultiplayerSession {
  id: string;
  name: string;
  host: string;
  players: MultiplayerPlayer[];
  maxPlayers: number;
  campaignId: string;
  status: 'waiting' | 'active' | 'paused' | 'ended';
  inviteCode: string;
  createdAt: string;
}

export interface MultiplayerPlayer {
  id: string;
  username: string;
  characterId: string;
  isHost: boolean;
  isReady: boolean;
  online: boolean;
}

// AI DM TYPES
export interface AIDMResponse {
  narration: string;
  stateChanges?: Partial<any>;
  triggerCombat?: boolean;
  combatEncounter?: DnDCombatEncounter;
  questUpdates?: {
    active: DnDQuest[];
    completed: DnDQuest[];
  };
  itemsFound?: Item[];
  npcDialogue?: NPCDialogue;
}

export interface NPCDialogue {
  npcName: string;
  npcDescription: string;
  dialogue: string;
  dialogueOptions?: DialogueOption[];
}

export interface DialogueOption {
  id: string;
  text: string;
  skill?: string; // e.g., "Persuasion", "Intimidation"
  difficultyClass?: number;
  result?: string;
}

// DICE TYPES
export interface DiceRoll {
  dice: string; // e.g., "1d20+5"
  rolls: number[];
  modifier: number;
  total: number;
  critical: boolean;
  fumble: boolean;
}

// LOCATION TYPES
export interface Location {
  id: string;
  name: string;
  type: 'city' | 'dungeon' | 'wilderness' | 'tavern' | 'shop' | 'temple' | 'castle';
  description: string;
  npcs: NPC[];
  shops: Shop[];
  quests: DnDQuest[];
  encounters: EncounterTable[];
  connections: string[]; // Connected location IDs
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  occupation: string;
  description: string;
  personality: string;
  dialogue: string[];
  questGiver: boolean;
  merchant: boolean;
  disposition: 'friendly' | 'neutral' | 'hostile';
}

export interface Shop {
  id: string;
  name: string;
  type: 'general' | 'weapons' | 'armor' | 'magic' | 'potions' | 'tavern';
  keeper: string;
  inventory: ShopItem[];
}

export interface ShopItem {
  item: Item;
  price: number;
  stock: number;
}

export interface EncounterTable {
  id: string;
  diceRoll: string;
  result: string;
  enemyTypes: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
}

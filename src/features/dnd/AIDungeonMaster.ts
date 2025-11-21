/**
 * AI DUNGEON MASTER
 * Fully autonomous DM for solo and multiplayer D&D without human DM
 * Generates narratives, encounters, quests, NPCs, and manages game flow
 */

import { DnDCharacter, DnDCombatEncounter, DnDQuest, Enemy, Item, AIDMResponse, NPCDialogue, Location, NPC } from './types';
import { DiceRoller } from './DiceRoller';

export class AIDungeonMaster {
  private diceRoller: DiceRoller;
  private storyContext: string[];
  private currentNarrativeThread: string;
  private encounterHistory: DnDCombatEncounter[];
  private questTemplates: QuestTemplate[];
  private locationDatabase: Location[];
  private npcDatabase: NPC[];

  constructor() {
    this.diceRoller = new DiceRoller();
    this.storyContext = [];
    this.currentNarrativeThread = 'exploration';
    this.encounterHistory = [];
    this.questTemplates = this.initializeQuestTemplates();
    this.locationDatabase = this.initializeLocations();
    this.npcDatabase = this.initializeNPCs();
  }

  /**
   * Process player action and generate DM response
   */
  async processPlayerAction(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    this.storyContext.push(`Player: ${action}`);

    // Analyze the action
    const actionType = this.categorizeAction(action);

    switch (actionType) {
      case 'exploration':
        return this.handleExploration(action, gameState, character);

      case 'social':
        return this.handleSocialInteraction(action, gameState, character);

      case 'combat':
        return this.handleCombatInitiation(action, gameState, character);

      case 'investigation':
        return this.handleInvestigation(action, gameState, character);

      case 'rest':
        return this.handleRest(action, gameState, character);

      default:
        return this.generateGenericResponse(action, gameState, character);
    }
  }

  /**
   * Categorize player action
   */
  private categorizeAction(action: string): string {
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes('attack') || lowerAction.includes('fight') || lowerAction.includes('kill')) {
      return 'combat';
    }
    if (lowerAction.includes('talk') || lowerAction.includes('speak') || lowerAction.includes('ask')) {
      return 'social';
    }
    if (lowerAction.includes('search') || lowerAction.includes('investigate') || lowerAction.includes('look')) {
      return 'investigation';
    }
    if (lowerAction.includes('rest') || lowerAction.includes('sleep') || lowerAction.includes('camp')) {
      return 'rest';
    }

    return 'exploration';
  }

  /**
   * Handle exploration actions
   */
  private async handleExploration(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    const scenarios = [
      {
        narration: `You venture deeper into the ${gameState.currentLocation}. The air grows colder, and you notice ancient runes carved into the stone walls. They seem to pulse with a faint magical energy. Ahead, you see three paths: one leading down into darkness, one climbing upward toward dim light, and one that continues straight with the sound of running water in the distance.`,
        stateChanges: {}
      },
      {
        narration: `As you explore, you discover a hidden alcove behind a tapestry. Inside, you find a dusty old journal belonging to an adventurer who came before you. The final entry reads: "The guardian sleeps, but not for long. The key lies where the moonlight touches stone." A chill runs down your spine.`,
        itemsFound: [
          {
            id: crypto.randomUUID(),
            name: 'Ancient Journal',
            type: 'misc',
            description: 'A weathered journal with cryptic clues',
            quantity: 1,
            weight: 0.5,
            value: 10,
            magical: false
          }
        ]
      },
      {
        narration: `Your keen senses alert you to movement ahead. You hear the shuffle of feet and low grunting sounds. As you peek around the corner, you spot three goblins arguing over a pile of stolen goods. They haven't noticed you yet. You could try to sneak past, confront them, or perhaps eavesdrop on their conversation.`,
        triggerCombat: false
      }
    ];

    // Random encounter check (20% chance)
    const encounterRoll = this.diceRoller.roll('1d100');
    if (encounterRoll.total <= 20) {
      return this.generateRandomEncounter(gameState, character);
    }

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    this.storyContext.push(`DM: ${scenario.narration}`);

    return {
      narration: scenario.narration,
      stateChanges: scenario.stateChanges,
      itemsFound: scenario.itemsFound,
      triggerCombat: scenario.triggerCombat
    };
  }

  /**
   * Handle social interactions
   */
  private async handleSocialInteraction(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    // Generate NPC for interaction
    const npc = this.generateRandomNPC(gameState.currentLocation);

    const dialogueOptions = [
      {
        id: '1',
        text: 'Ask about rumors in the area',
        skill: 'Persuasion',
        difficultyClass: 12,
        result: `${npc.name} leans in closer and whispers: "Strange things have been happening in the old ruins to the north. People who go there don't always come back... but those who do speak of treasure beyond imagination."`
      },
      {
        id: '2',
        text: 'Inquire about local quests',
        skill: 'Investigation',
        difficultyClass: 10,
        result: `${npc.name} mentions that the village elder has been looking for someone brave enough to investigate disappearances near the ancient temple.`
      },
      {
        id: '3',
        text: 'Try to gather information through intimidation',
        skill: 'Intimidation',
        difficultyClass: 15,
        result: `${npc.name} looks nervous but refuses to be bullied. "I... I don't know anything! Please, just leave me alone!"`
      }
    ];

    const narration = `You approach ${npc.name}, ${npc.description}. They ${npc.disposition === 'friendly' ? 'greet you warmly' : npc.disposition === 'hostile' ? 'eye you suspiciously' : 'nod curtly in acknowledgment'}.`;

    this.storyContext.push(`DM: ${narration}`);

    // Check if this NPC has a quest
    if (npc.questGiver) {
      const quest = this.generateQuest(character.level, gameState.currentLocation);
      return {
        narration: narration + ` ${npc.name} has something important to discuss with you.`,
        npcDialogue: {
          npcName: npc.name,
          npcDescription: npc.description,
          dialogue: `"Adventurer, I'm in desperate need of help! ${quest.description} Will you aid me in this matter?"`,
          dialogueOptions
        },
        questUpdates: {
          active: [...gameState.activeQuests, quest],
          completed: gameState.completedQuests
        }
      };
    }

    return {
      narration,
      npcDialogue: {
        npcName: npc.name,
        npcDescription: npc.description,
        dialogue: npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)],
        dialogueOptions
      }
    };
  }

  /**
   * Handle combat initiation
   */
  private async handleCombatInitiation(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    const encounter = this.generateCombatEncounter(character.level, gameState.currentLocation);

    const narration = `You draw your weapon and prepare for battle! ${encounter.description}`;

    this.storyContext.push(`DM: ${narration}`);
    this.encounterHistory.push(encounter);

    return {
      narration,
      triggerCombat: true,
      combatEncounter: encounter
    };
  }

  /**
   * Handle investigation actions
   */
  private async handleInvestigation(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    // Skill check required
    const perceptionCheck = this.diceRoller.rollAbilityCheck(
      Math.floor((character.wisdom - 10) / 2),
      character.proficiencyBonus
    );

    const difficultyClass = 12;
    const success = perceptionCheck.total >= difficultyClass;

    if (success) {
      const foundItems: Item[] = [
        {
          id: crypto.randomUUID(),
          name: 'Healing Potion',
          type: 'potion',
          description: 'Restores 2d4+2 hit points',
          quantity: 1,
          weight: 0.5,
          value: 50,
          magical: true,
          rarity: 'common'
        }
      ];

      const narration = `(Perception check: ${perceptionCheck.total} vs DC ${difficultyClass} - Success!) Your keen eyes spot something glinting in the shadows. You discover a hidden cache containing a healing potion! The red liquid swirls mysteriously within the vial.`;

      return {
        narration,
        itemsFound: foundItems
      };
    } else {
      const narration = `(Perception check: ${perceptionCheck.total} vs DC ${difficultyClass} - Failed) Despite your careful search, you don't find anything of interest in this area. Perhaps there's nothing here, or perhaps you just missed it.`;

      return {
        narration
      };
    }
  }

  /**
   * Handle rest
   */
  private async handleRest(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    const isLongRest = action.toLowerCase().includes('long') || action.toLowerCase().includes('sleep');

    if (isLongRest) {
      const narration = `You find a safe spot to make camp and settle in for a long rest. As you drift off to sleep, you dream of the adventures that await. You wake refreshed, with your hit points and spell slots fully restored!`;

      return {
        narration,
        stateChanges: {
          characters: gameState.characters.map((c: DnDCharacter) => ({
            ...c,
            currentHP: c.maxHP,
            spellSlots: {
              level1: { ...c.spellSlots.level1, current: c.spellSlots.level1.max },
              level2: { ...c.spellSlots.level2, current: c.spellSlots.level2.max },
              level3: { ...c.spellSlots.level3, current: c.spellSlots.level3.max },
              level4: { ...c.spellSlots.level4, current: c.spellSlots.level4.max },
              level5: { ...c.spellSlots.level5, current: c.spellSlots.level5.max },
              level6: { ...c.spellSlots.level6, current: c.spellSlots.level6.max },
              level7: { ...c.spellSlots.level7, current: c.spellSlots.level7.max },
              level8: { ...c.spellSlots.level8, current: c.spellSlots.level8.max },
              level9: { ...c.spellSlots.level9, current: c.spellSlots.level9.max }
            }
          }))
        }
      };
    } else {
      const healAmount = Math.floor(character.maxHP / 2);
      const narration = `You take a short rest, binding your wounds and catching your breath. You recover ${healAmount} hit points. The break gives you time to reflect on your journey so far.`;

      return {
        narration,
        stateChanges: {
          characters: gameState.characters.map((c: DnDCharacter) =>
            c.id === character.id
              ? { ...c, currentHP: Math.min(c.currentHP + healAmount, c.maxHP) }
              : c
          )
        }
      };
    }
  }

  /**
   * Generate generic response for other actions
   */
  private async generateGenericResponse(
    action: string,
    gameState: any,
    character: DnDCharacter
  ): Promise<AIDMResponse> {
    const responses = [
      `You ${action}. The atmosphere around you shifts subtly, as if the very dungeon is watching your every move.`,
      `As you ${action}, you notice the flickering torchlight casting eerie shadows on the walls. The silence is almost oppressive.`,
      `You successfully ${action}. Your actions echo through the ancient halls, and for a moment, you wonder if something heard you.`,
      `${action.charAt(0).toUpperCase() + action.slice(1)}. The weight of your quest presses upon you, but your determination remains unshaken.`
    ];

    const narration = responses[Math.floor(Math.random() * responses.length)];
    this.storyContext.push(`DM: ${narration}`);

    return {
      narration
    };
  }

  /**
   * Generate random encounter
   */
  private generateRandomEncounter(gameState: any, character: DnDCharacter): AIDMResponse {
    const encounterTypes = ['combat', 'treasure', 'trap', 'npc'];
    const type = encounterTypes[Math.floor(Math.random() * encounterTypes.length)];

    switch (type) {
      case 'combat':
        const encounter = this.generateCombatEncounter(character.level, gameState.currentLocation);
        return {
          narration: `Suddenly, you hear a battle cry! ${encounter.description}`,
          triggerCombat: true,
          combatEncounter: encounter
        };

      case 'treasure':
        return {
          narration: `Your eyes catch a glint of gold! You've discovered a hidden treasure chest!`,
          itemsFound: this.generateTreasure(character.level)
        };

      case 'trap':
        const savingThrow = this.diceRoller.rollSavingThrow(
          Math.floor((character.dexterity - 10) / 2),
          true,
          character.proficiencyBonus
        );
        const trapDC = 13;

        if (savingThrow.total >= trapDC) {
          return {
            narration: `You notice a pressure plate just before stepping on it! (DEX save: ${savingThrow.total} vs DC ${trapDC} - Success!) You carefully avoid the trap.`
          };
        } else {
          const damage = this.diceRoller.roll('2d6').total;
          return {
            narration: `You trigger a hidden trap! (DEX save: ${savingThrow.total} vs DC ${trapDC} - Failed!) Poison darts shoot from the walls, dealing ${damage} damage!`,
            stateChanges: {
              characters: gameState.characters.map((c: DnDCharacter) =>
                c.id === character.id
                  ? { ...c, currentHP: Math.max(0, c.currentHP - damage) }
                  : c
              )
            }
          };
        }

      case 'npc':
        const npc = this.generateRandomNPC(gameState.currentLocation);
        return {
          narration: `You encounter ${npc.name}, ${npc.description}. They seem ${npc.disposition} toward you.`,
          npcDialogue: {
            npcName: npc.name,
            npcDescription: npc.description,
            dialogue: npc.dialogue[0],
            dialogueOptions: []
          }
        };

      default:
        return {
          narration: `You continue your journey through the ${gameState.currentLocation}.`
        };
    }
  }

  /**
   * Generate combat encounter
   */
  generateCombatEncounter(playerLevel: number, location: string): DnDCombatEncounter {
    const enemies = this.generateEnemies(playerLevel, location);

    // Calculate initiative for all combatants
    const turnOrder = enemies.map(enemy => ({
      id: enemy.id,
      name: enemy.name,
      initiative: this.diceRoller.roll('1d20').total + Math.floor((enemy.initiative || 0)),
      type: 'enemy' as const,
      hasActed: false
    })).sort((a, b) => b.initiative - a.initiative);

    return {
      id: crypto.randomUUID(),
      name: `Battle in ${location}`,
      description: `You face ${enemies.length} ${enemies.map(e => e.name).join(', ')}!`,
      round: 1,
      turnOrder,
      currentTurnIndex: 0,
      enemies,
      allies: [],
      environment: location,
      startedAt: new Date().toISOString()
    };
  }

  /**
   * Generate enemies based on level
   */
  private generateEnemies(playerLevel: number, location: string): Enemy[] {
    const enemyTemplates = [
      {
        name: 'Goblin',
        type: 'Goblin',
        maxHP: 7,
        armorClass: 15,
        challengeRating: 0.25,
        xpValue: 50,
        attacks: [
          {
            name: 'Scimitar',
            toHit: 4,
            damage: '1d6+2',
            damageType: 'slashing'
          }
        ]
      },
      {
        name: 'Orc Warrior',
        type: 'Orc',
        maxHP: 15,
        armorClass: 13,
        challengeRating: 0.5,
        xpValue: 100,
        attacks: [
          {
            name: 'Greataxe',
            toHit: 5,
            damage: '1d12+3',
            damageType: 'slashing'
          }
        ]
      },
      {
        name: 'Giant Spider',
        type: 'Beast',
        maxHP: 26,
        armorClass: 14,
        challengeRating: 1,
        xpValue: 200,
        attacks: [
          {
            name: 'Bite',
            toHit: 5,
            damage: '1d8+3',
            damageType: 'piercing',
            description: 'Plus 1d8 poison damage (DC 11 CON save)'
          }
        ]
      },
      {
        name: 'Skeleton Warrior',
        type: 'Undead',
        maxHP: 13,
        armorClass: 13,
        challengeRating: 0.25,
        xpValue: 50,
        attacks: [
          {
            name: 'Shortsword',
            toHit: 4,
            damage: '1d6+2',
            damageType: 'piercing'
          }
        ]
      }
    ];

    // Select appropriate enemies for player level
    const count = Math.min(Math.floor(playerLevel / 2) + 1, 5);
    const enemies: Enemy[] = [];

    for (let i = 0; i < count; i++) {
      const template = enemyTemplates[Math.floor(Math.random() * enemyTemplates.length)];
      enemies.push({
        id: crypto.randomUUID(),
        name: `${template.name} ${i + 1}`,
        type: template.type,
        maxHP: template.maxHP,
        currentHP: template.maxHP,
        armorClass: template.armorClass,
        initiative: this.diceRoller.roll('1d20').total,
        attacks: template.attacks,
        abilities: [],
        vulnerabilities: [],
        resistances: [],
        immunities: [],
        challengeRating: template.challengeRating,
        xpValue: template.xpValue,
        loot: this.generateLoot(template.challengeRating),
        status: 'active'
      });
    }

    return enemies;
  }

  /**
   * Generate loot for defeated enemies
   */
  private generateLoot(challengeRating: number): Item[] {
    const loot: Item[] = [];
    const goldAmount = Math.floor(Math.random() * (challengeRating * 10)) + 1;

    if (goldAmount > 0) {
      loot.push({
        id: crypto.randomUUID(),
        name: 'Gold Coins',
        type: 'misc',
        description: `${goldAmount} gold pieces`,
        quantity: goldAmount,
        weight: 0.02 * goldAmount,
        value: goldAmount,
        magical: false
      });
    }

    // 30% chance of item
    if (Math.random() < 0.3) {
      const items = [
        { name: 'Healing Potion', value: 50, rarity: 'common' as const },
        { name: 'Silver Dagger', value: 25, rarity: 'common' as const },
        { name: 'Torch', value: 1, rarity: 'common' as const }
      ];

      const item = items[Math.floor(Math.random() * items.length)];
      loot.push({
        id: crypto.randomUUID(),
        name: item.name,
        type: 'misc',
        description: `A ${item.name.toLowerCase()}`,
        quantity: 1,
        weight: 1,
        value: item.value,
        magical: false,
        rarity: item.rarity
      });
    }

    return loot;
  }

  /**
   * Generate treasure
   */
  private generateTreasure(playerLevel: number): Item[] {
    const treasure: Item[] = [];
    const goldAmount = this.diceRoller.roll(`${playerLevel}d10+${playerLevel * 5}`).total;

    treasure.push({
      id: crypto.randomUUID(),
      name: 'Gold Coins',
      type: 'misc',
      description: `${goldAmount} gold pieces`,
      quantity: goldAmount,
      weight: 0.02 * goldAmount,
      value: goldAmount,
      magical: false
    });

    return treasure;
  }

  /**
   * Generate quest
   */
  generateQuest(playerLevel: number, location: string): DnDQuest {
    const templates = this.questTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      questGiver: template.questGiver,
      objectives: template.objectives.map(obj => ({
        ...obj,
        id: crypto.randomUUID(),
        completed: false,
        currentProgress: 0
      })),
      rewards: {
        xp: playerLevel * 100,
        gold: playerLevel * 50,
        items: [],
        reputation: 'Village Hero'
      },
      difficulty: playerLevel <= 3 ? 'easy' : playerLevel <= 7 ? 'medium' : 'hard',
      location,
      level: playerLevel,
      status: 'active',
      startedAt: new Date().toISOString()
    };
  }

  /**
   * Generate random NPC
   */
  private generateRandomNPC(location: string): NPC {
    const names = ['Aldric', 'Elara', 'Thom', 'Mira', 'Garrick', 'Lyssa'];
    const occupations = ['Merchant', 'Guard', 'Innkeeper', 'Scholar', 'Blacksmith', 'Priest'];
    const personalities = ['friendly and talkative', 'gruff but helpful', 'mysterious and cryptic', 'cheerful and optimistic'];

    const name = names[Math.floor(Math.random() * names.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    return {
      id: crypto.randomUUID(),
      name,
      race: 'Human',
      occupation,
      description: `a ${personality} ${occupation.toLowerCase()}`,
      personality,
      dialogue: [
        'Greetings, traveler! What brings you to these parts?',
        'I might have some information that could help you... for the right price.',
        'Be careful out there. Strange things have been happening lately.'
      ],
      questGiver: Math.random() < 0.3,
      merchant: occupation === 'Merchant',
      disposition: Math.random() < 0.7 ? 'friendly' : 'neutral'
    };
  }

  /**
   * Welcome new character
   */
  async welcomeCharacter(character: DnDCharacter): Promise<string> {
    return `Welcome, ${character.name} the ${character.race} ${character.class}! Your adventure begins in the Tavern of the Wandering Moon. The smell of ale and roasted meat fills the air, and you can hear the crackling of the fireplace. A group of adventurers sits in the corner, talking in hushed tones. The bartender, a stout dwarf named Thorin, nods in your direction. What would you like to do?`;
  }

  /**
   * Narrate combat action
   */
  async narrateCombatAction(result: any): Promise<string> {
    if (result.success) {
      return `Your attack strikes true! You deal ${result.damage} damage to ${result.targetName}!`;
    } else {
      return `Your attack misses ${result.targetName}! (Attack roll: ${result.attackRoll})`;
    }
  }

  /**
   * Generate combat rewards
   */
  async generateCombatRewards(result: any): Promise<any> {
    return {
      xp: 100,
      gold: 50,
      items: []
    };
  }

  /**
   * Initialize quest templates
   */
  private initializeQuestTemplates(): QuestTemplate[] {
    return [
      {
        name: 'The Missing Merchant',
        description: 'A local merchant has gone missing while traveling to the next town. Find out what happened.',
        questGiver: 'Village Elder',
        objectives: [
          {
            id: '',
            description: 'Search the road between towns',
            type: 'explore',
            requiredProgress: 1,
            currentProgress: 0,
            completed: false
          },
          {
            id: '',
            description: 'Defeat the bandits',
            type: 'kill',
            target: 'Bandits',
            requiredProgress: 3,
            currentProgress: 0,
            completed: false
          }
        ]
      },
      {
        name: 'Ancient Ruins Investigation',
        description: 'Strange lights have been seen emanating from the old ruins. Investigate their source.',
        questGiver: 'Local Sage',
        objectives: [
          {
            id: '',
            description: 'Explore the ancient ruins',
            type: 'explore',
            requiredProgress: 1,
            currentProgress: 0,
            completed: false
          },
          {
            id: '',
            description: 'Retrieve the magical artifact',
            type: 'collect',
            target: 'Artifact',
            requiredProgress: 1,
            currentProgress: 0,
            completed: false
          }
        ]
      }
    ];
  }

  /**
   * Initialize locations
   */
  private initializeLocations(): Location[] {
    return [];
  }

  /**
   * Initialize NPCs
   */
  private initializeNPCs(): NPC[] {
    return [];
  }
}

interface QuestTemplate {
  name: string;
  description: string;
  questGiver: string;
  objectives: Array<{
    id: string;
    description: string;
    type: 'kill' | 'collect' | 'talk' | 'explore' | 'deliver' | 'protect';
    target?: string;
    requiredProgress: number;
    currentProgress: number;
    completed: boolean;
  }>;
}

export default AIDungeonMaster;

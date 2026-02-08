/**
 * OPEN RPG SYSTEMS & TABLETOP TOOLS
 * ==================================
 * All embedded directly into Kol's Hub
 */

// ============================================
// OPEN RPG SYSTEMS (SRDs)
// ============================================
export const OPEN_RPG_SYSTEMS = [
  {
    id: 'fate-core',
    name: 'Fate Core System',
    description: 'Narrative-focused RPG using aspects and fate points. Great for storytelling games.',
    srdUrl: 'https://fate-srd.com/fate-core',
    embedUrl: 'https://fate-srd.com/fate-core/basics',
    features: ['Aspects', 'Fate Points', 'Skills', 'Stunts', 'Stress/Consequences'],
    variants: ['Fate Core', 'Fate Accelerated (FAE)', 'Fate Condensed'],
    license: 'CC BY 3.0',
    complexity: 'Medium',
    bestFor: ['Narrative games', 'Collaborative storytelling', 'Quick play']
  },
  {
    id: 'opend6',
    name: 'OpenD6',
    description: 'Flexible D6-based system. Originally from Star Wars RPG. Attribute + Skill dice pools.',
    srdUrl: 'http://opend6project.org',
    variants: ['D6 Adventure', 'D6 Fantasy', 'D6 Space', 'Mini Six'],
    features: ['Attribute Dice', 'Wild Die', 'Character Points', 'Scale'],
    license: 'OGL',
    complexity: 'Medium',
    bestFor: ['Cinematic action', 'Star Wars style', 'Pulp adventures']
  },
  {
    id: 'fudge',
    name: 'FUDGE RPG',
    description: 'Free-form Universal Do-it-yourself Gaming Engine. Highly customizable.',
    srdUrl: 'http://www.fudgerpg.com/fudge/fudge.pdf',
    features: ['Trait Ladder', 'Fudge Dice (+/-)', 'Gifts & Faults', 'Subjective Character Creation'],
    license: 'OGL',
    complexity: 'Low-Medium',
    bestFor: ['Custom settings', 'Flexible rules', 'Beginners']
  },
  {
    id: 'pathfinder-1e',
    name: 'Pathfinder 1e SRD',
    description: 'D&D 3.5 evolution. Extremely detailed with tons of options.',
    srdUrl: 'https://www.d20pfsrd.com',
    embedUrl: 'https://www.d20pfsrd.com',
    features: ['20+ Classes', '100+ Archetypes', 'Feats', 'Spells', 'Monsters'],
    license: 'OGL',
    complexity: 'High',
    bestFor: ['Crunchy gameplay', 'Character optimization', 'Long campaigns']
  },
  {
    id: 'pathfinder-2e',
    name: 'Pathfinder 2e SRD',
    description: 'Modernized Pathfinder with three-action economy.',
    srdUrl: 'https://2e.aonprd.com',
    embedUrl: 'https://2e.aonprd.com',
    features: ['Three-Action Economy', 'Ancestry/Class/Background', 'Proficiency Scaling'],
    license: 'OGL/ORC',
    complexity: 'Medium-High',
    bestFor: ['Tactical combat', 'Balanced play', 'Modern rules']
  },
  {
    id: 'open-adventure',
    name: 'Open Adventure',
    description: 'Rules-light fantasy RPG. Simple D6-based system.',
    srdUrl: 'https://github.com/openadventure/Open-Adventure',
    features: ['D6 System', 'Simple Rules', 'Fantasy Focus'],
    license: 'CC BY-SA',
    complexity: 'Low',
    bestFor: ['Quick games', 'New players', 'One-shots']
  },
  {
    id: 'dnd-5e-srd',
    name: 'D&D 5e SRD',
    description: 'Core 5th Edition rules under Creative Commons.',
    srdUrl: 'https://www.5esrd.com',
    alternateUrl: 'https://5e.tools',
    features: ['Basic Rules', 'Core Classes', 'Monsters', 'Spells', 'Items'],
    license: 'CC BY 4.0',
    complexity: 'Medium',
    bestFor: ['Most popular system', 'Easy to find players', 'Balanced']
  },
  {
    id: 'basic-fantasy',
    name: 'Basic Fantasy RPG',
    description: 'Old-school D&D feel with modern presentation. Free PDFs.',
    srdUrl: 'https://basicfantasy.org',
    features: ['Race/Class Separate', 'Simple Rules', 'Lots of Supplements'],
    license: 'OGL',
    complexity: 'Low',
    bestFor: ['OSR gaming', 'Classic feel', 'Budget-friendly']
  }
];

// ============================================
// D&D TOOLS (EMBEDDABLE)
// ============================================
export const DND_TOOLS = {
  characterBuilders: [
    {
      id: 'fast-character',
      name: 'Fast Character',
      description: 'Quick 5e character generator',
      url: 'https://fastcharacter.com',
      embedUrl: 'https://fastcharacter.com',
      features: ['Random generation', 'All classes', 'Equipment included'],
      free: true
    },
    {
      id: 'dnd-beyond-basic',
      name: 'D&D Beyond (Basic)',
      description: 'Official character builder - basic rules free',
      url: 'https://www.dndbeyond.com/characters/builder',
      features: ['Official content', 'Digital sheet', 'Basic rules free'],
      free: 'partial'
    },
    {
      id: 'orcpub',
      name: 'OrcPub2',
      description: 'Open source character builder',
      url: 'https://orcpub2.com',
      features: ['SRD content', 'Export options', 'Homebrew support'],
      free: true
    }
  ],
  diceRollers: [
    {
      id: 'roll20-dice',
      name: 'Roll20 Dice',
      description: '3D dice roller with macros',
      url: 'https://roll20.net',
      features: ['3D dice', 'Macros', 'Shared rolling']
    },
    {
      id: 'rolz',
      name: 'Rolz.org',
      description: 'Simple online dice roller',
      url: 'https://rolz.org',
      embedUrl: 'https://rolz.org/dr',
      features: ['Any dice', 'Room-based', 'Log history']
    }
  ],
  encounterBuilders: [
    {
      id: 'kobold-plus',
      name: 'Kobold Plus Club',
      description: 'Encounter difficulty calculator',
      url: 'https://koboldplus.club',
      embedUrl: 'https://koboldplus.club',
      features: ['CR calculator', 'Party manager', 'Random encounters']
    },
    {
      id: 'donjon-encounter',
      name: 'Donjon Encounter Generator',
      description: 'Random encounter tables',
      url: 'https://donjon.bin.sh/5e/random/#type=encounter',
      features: ['By environment', 'By level', 'Treasure included']
    }
  ],
  mapMakers: [
    {
      id: 'dungeon-scrawl',
      name: 'Dungeon Scrawl',
      description: 'Free dungeon map maker',
      url: 'https://dungeonscrawl.com',
      embedUrl: 'https://dungeonscrawl.com',
      features: ['Grid maps', 'Export PNG', 'Layers', 'Free'],
      free: true
    },
    {
      id: 'inkarnate-free',
      name: 'Inkarnate (Free)',
      description: 'Fantasy world map maker',
      url: 'https://inkarnate.com',
      features: ['World maps', 'Battle maps', 'Assets'],
      free: 'partial'
    },
    {
      id: 'watabou',
      name: "Watabou's Generators",
      description: 'Procedural map generators',
      url: 'https://watabou.github.io',
      features: ['City maps', 'Dungeon maps', 'Village maps'],
      free: true
    }
  ],
  nameGenerators: [
    {
      id: 'fantasy-name-gen',
      name: 'Fantasy Name Generators',
      description: 'Names for everything',
      url: 'https://www.fantasynamegenerators.com',
      embedUrl: 'https://www.fantasynamegenerators.com',
      features: ['Character names', 'Place names', 'Item names', 'Descriptions']
    },
    {
      id: 'donjon-names',
      name: 'Donjon Name Generator',
      description: 'D&D-specific names',
      url: 'https://donjon.bin.sh/fantasy/name/',
      features: ['By race', 'Random', 'Customizable']
    }
  ],
  spellReferences: [
    {
      id: '5e-spells',
      name: 'D&D 5e Spells',
      description: 'Comprehensive spell database',
      url: 'https://www.dnd-spells.com',
      embedUrl: 'https://www.dnd-spells.com/spells',
      features: ['Filters', 'Spell cards', 'Class lists']
    },
    {
      id: 'spell-book-app',
      name: '5e Spell List',
      description: 'Filterable spell reference',
      url: 'https://5e.tools/spells.html',
      features: ['All spells', 'Advanced filters', 'Stat blocks']
    }
  ],
  documentCreators: [
    {
      id: 'homebrewery',
      name: 'Homebrewery',
      description: 'Create PHB-style documents',
      url: 'https://homebrewery.naturalcrit.com',
      embedUrl: 'https://homebrewery.naturalcrit.com/new',
      features: ['Markdown', 'PHB style', 'Export PDF'],
      free: true
    },
    {
      id: 'gm-binder',
      name: 'GM Binder',
      description: 'Document creation tools',
      url: 'https://www.gmbinder.com',
      features: ['Markdown', 'Custom styles', 'Sharing'],
      free: true
    }
  ],
  npcGenerators: [
    {
      id: 'kassoon-npc',
      name: 'Kassoon NPC Generator',
      description: 'Detailed NPC creation',
      url: 'https://www.kassoon.com/dnd/npc-generator/',
      features: ['Personality', 'Appearance', 'Background', 'Secrets']
    },
    {
      id: 'rpgen',
      name: 'RPGen',
      description: 'Random generators for RPGs',
      url: 'https://rpgen.io',
      features: ['NPCs', 'Quests', 'Dungeons', 'Treasure']
    }
  ],
  virtualTabletops: [
    {
      id: 'roll20',
      name: 'Roll20',
      description: 'Free virtual tabletop',
      url: 'https://roll20.net',
      features: ['Maps', 'Tokens', 'Character sheets', 'Video chat'],
      free: 'partial'
    },
    {
      id: 'owlbear-rodeo',
      name: 'Owlbear Rodeo',
      description: 'Simple free VTT',
      url: 'https://www.owlbear.rodeo',
      features: ['No account needed', 'Simple maps', 'Dice rolling'],
      free: true
    },
    {
      id: 'foundry-vtt',
      name: 'Foundry VTT',
      description: 'Self-hosted VTT',
      url: 'https://foundryvtt.com',
      features: ['One-time purchase', 'Highly customizable', 'Modules'],
      free: false
    }
  ]
};

// ============================================
// CLASSIC CARD GAMES
// ============================================
export const CARD_GAMES = [
  {
    id: 'poker',
    name: 'Poker',
    players: '2-10',
    type: 'betting',
    variants: ['Texas Hold\'em', 'Omaha', 'Seven Card Stud', 'Five Card Draw'],
    rules: 'https://en.wikipedia.org/wiki/Poker'
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    players: '1-7',
    type: 'casino',
    rules: 'https://en.wikipedia.org/wiki/Blackjack'
  },
  {
    id: 'bridge',
    name: 'Bridge',
    players: '4',
    type: 'trick-taking',
    rules: 'https://en.wikipedia.org/wiki/Contract_bridge'
  },
  {
    id: 'hearts',
    name: 'Hearts',
    players: '4',
    type: 'trick-taking',
    rules: 'https://en.wikipedia.org/wiki/Hearts_(card_game)'
  },
  {
    id: 'spades',
    name: 'Spades',
    players: '4',
    type: 'trick-taking',
    rules: 'https://en.wikipedia.org/wiki/Spades_(card_game)'
  },
  {
    id: 'rummy',
    name: 'Rummy',
    players: '2-6',
    type: 'matching',
    variants: ['Gin Rummy', 'Canasta', 'Rummy 500'],
    rules: 'https://en.wikipedia.org/wiki/Rummy'
  },
  {
    id: 'solitaire',
    name: 'Solitaire',
    players: '1',
    type: 'patience',
    variants: ['Klondike', 'Spider', 'FreeCell'],
    rules: 'https://en.wikipedia.org/wiki/Klondike_(solitaire)'
  },
  {
    id: 'crazy-eights',
    name: 'Crazy Eights / UNO',
    players: '2-7',
    type: 'shedding',
    rules: 'https://en.wikipedia.org/wiki/Crazy_Eights'
  },
  {
    id: 'go-fish',
    name: 'Go Fish',
    players: '2-6',
    type: 'matching',
    rules: 'https://en.wikipedia.org/wiki/Go_Fish'
  },
  {
    id: 'war',
    name: 'War',
    players: '2',
    type: 'comparing',
    rules: 'https://en.wikipedia.org/wiki/War_(card_game)'
  },
  {
    id: 'cribbage',
    name: 'Cribbage',
    players: '2-4',
    type: 'scoring',
    rules: 'https://en.wikipedia.org/wiki/Cribbage'
  },
  {
    id: 'euchre',
    name: 'Euchre',
    players: '4',
    type: 'trick-taking',
    rules: 'https://en.wikipedia.org/wiki/Euchre'
  }
];

// ============================================
// CLASSIC BOARD GAMES
// ============================================
export const CLASSIC_BOARD_GAMES = [
  {
    id: 'chess',
    name: 'Chess',
    players: '2',
    type: 'strategy',
    playOnline: 'https://lichess.org',
    embedUrl: 'https://lichess.org/embed/game/watch',
    rules: 'https://en.wikipedia.org/wiki/Rules_of_chess'
  },
  {
    id: 'checkers',
    name: 'Checkers/Draughts',
    players: '2',
    type: 'strategy',
    rules: 'https://en.wikipedia.org/wiki/English_draughts'
  },
  {
    id: 'go',
    name: 'Go',
    players: '2',
    type: 'strategy',
    playOnline: 'https://online-go.com',
    rules: 'https://en.wikipedia.org/wiki/Rules_of_Go'
  },
  {
    id: 'backgammon',
    name: 'Backgammon',
    players: '2',
    type: 'race',
    rules: 'https://en.wikipedia.org/wiki/Backgammon'
  },
  {
    id: 'mancala',
    name: 'Mancala',
    players: '2',
    type: 'count-capture',
    rules: 'https://en.wikipedia.org/wiki/Mancala'
  },
  {
    id: 'reversi',
    name: 'Reversi/Othello',
    players: '2',
    type: 'strategy',
    rules: 'https://en.wikipedia.org/wiki/Reversi'
  },
  {
    id: 'dominoes',
    name: 'Dominoes',
    players: '2-4',
    type: 'tile',
    variants: ['Block', 'Draw', 'Mexican Train'],
    rules: 'https://en.wikipedia.org/wiki/Dominoes'
  },
  {
    id: 'mahjong',
    name: 'Mahjong',
    players: '4',
    type: 'tile',
    rules: 'https://en.wikipedia.org/wiki/Mahjong'
  },
  {
    id: 'nine-morris',
    name: "Nine Men's Morris",
    players: '2',
    type: 'alignment',
    rules: 'https://en.wikipedia.org/wiki/Nine_men%27s_morris'
  }
];

// ============================================
// VIRTUAL TABLETOP PLATFORMS
// ============================================
export const TABLETOP_PLATFORMS = [
  {
    id: 'tabletop-sim',
    name: 'Tabletop Simulator',
    description: 'Play any board game virtually',
    url: 'https://www.tabletopsimulator.com',
    steamUrl: 'https://store.steampowered.com/app/286160/Tabletop_Simulator/',
    workshopUrl: 'https://steamcommunity.com/app/286160/workshop/',
    features: ['Physics engine', 'VR support', 'Steam Workshop', 'Custom games'],
    price: 'paid'
  },
  {
    id: 'tabletopia',
    name: 'Tabletopia',
    description: 'Browser-based board game platform',
    url: 'https://tabletopia.com',
    features: ['Browser-based', 'Official games', 'Multiplayer'],
    price: 'freemium'
  },
  {
    id: 'board-game-arena',
    name: 'Board Game Arena',
    description: 'Play 700+ board games online',
    url: 'https://boardgamearena.com',
    features: ['700+ games', 'Real-time/turn-based', 'Rankings'],
    price: 'freemium'
  },
  {
    id: 'screentop',
    name: 'Screentop.gg',
    description: 'Free virtual tabletop',
    url: 'https://screentop.gg',
    features: ['Free', 'No account needed', 'Custom games'],
    price: 'free'
  },
  {
    id: 'playingcards-io',
    name: 'PlayingCards.io',
    description: 'Virtual card table',
    url: 'https://playingcards.io',
    features: ['Card games', 'Custom decks', 'Room codes'],
    price: 'free'
  }
];

export default {
  OPEN_RPG_SYSTEMS,
  DND_TOOLS,
  CARD_GAMES,
  CLASSIC_BOARD_GAMES,
  TABLETOP_PLATFORMS
};

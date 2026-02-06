// Comprehensive Emulator Database
// All gaming platforms with no repeats

export interface Emulator {
  id: string;
  name: string;
  platform: string;
  description: string;
  website: string;
  downloadUrl?: string;
  webEmulator?: string; // For browser-based emulation
  supportedFormats: string[];
  features: string[];
  icon: string;
  category: 'retro' | 'handheld' | 'console' | 'arcade' | 'computer';
  generation: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  isOpenSource: boolean;
}

export interface RomSource {
  id: string;
  name: string;
  url: string;
  description: string;
  platforms: string[];
  legalNote: string;
}

// Complete Emulator List - No Repeats
export const EMULATORS: Emulator[] = [
  // === NINTENDO CONSOLES ===
  {
    id: 'fceux',
    name: 'FCEUX',
    platform: 'Nintendo Entertainment System (NES)',
    description: 'The most accurate and feature-rich NES emulator with debugging tools',
    website: 'https://fceux.com/',
    webEmulator: 'https://www.retrogames.cc/embed/nes/',
    supportedFormats: ['.nes', '.fds', '.nsf'],
    features: ['Save states', 'Rewind', 'Lua scripting', 'TAS tools', 'Debugger'],
    icon: '🎮',
    category: 'retro',
    generation: '8-bit (1983)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'snes9x',
    name: 'Snes9x',
    platform: 'Super Nintendo (SNES)',
    description: 'Portable, freeware SNES emulator with high compatibility',
    website: 'https://www.snes9x.com/',
    webEmulator: 'https://www.retrogames.cc/embed/snes/',
    supportedFormats: ['.smc', '.sfc', '.fig', '.swc'],
    features: ['Save states', 'Cheats', 'Netplay', 'Shader support'],
    icon: '🕹️',
    category: 'retro',
    generation: '16-bit (1990)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'project64',
    name: 'Project64',
    platform: 'Nintendo 64',
    description: 'The most popular N64 emulator with plugin system',
    website: 'https://www.pj64-emu.com/',
    supportedFormats: ['.z64', '.v64', '.n64', '.rom'],
    features: ['HD textures', 'Widescreen hacks', 'Controller pak support', 'Save states'],
    icon: '🎯',
    category: 'console',
    generation: '64-bit (1996)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    platform: 'GameCube / Wii',
    description: 'The gold standard for GameCube and Wii emulation',
    website: 'https://dolphin-emu.org/',
    supportedFormats: ['.iso', '.gcm', '.gcz', '.wbfs', '.rvz'],
    features: ['HD rendering', 'Netplay', 'Wiimote support', 'Texture packs'],
    icon: '🐬',
    category: 'console',
    generation: '128-bit (2001/2006)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'cemu',
    name: 'Cemu',
    platform: 'Wii U',
    description: 'Highly compatible Wii U emulator with excellent performance',
    website: 'https://cemu.info/',
    supportedFormats: ['.wud', '.wux', '.rpx'],
    features: ['4K support', 'Shader caching', 'Motion controls', 'Amiibo support'],
    icon: '🎪',
    category: 'console',
    generation: 'HD (2012)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'yuzu',
    name: 'Yuzu / Suyu',
    platform: 'Nintendo Switch',
    description: 'Experimental Switch emulator (community forks available)',
    website: 'https://suyu.dev/',
    supportedFormats: ['.nsp', '.xci', '.nca'],
    features: ['Vulkan support', 'Docked/handheld modes', 'Controller support'],
    icon: '🔴',
    category: 'console',
    generation: 'Current Gen (2017)',
    difficulty: 'advanced',
    isOpenSource: true
  },

  // === NINTENDO HANDHELDS ===
  {
    id: 'visualboyadvance',
    name: 'VisualBoyAdvance-M',
    platform: 'Game Boy / GBC / GBA',
    description: 'All-in-one Game Boy emulator with enhanced features',
    website: 'https://vba-m.com/',
    webEmulator: 'https://www.retrogames.cc/embed/gba/',
    supportedFormats: ['.gb', '.gbc', '.gba', '.sgb'],
    features: ['Link cable emulation', 'Solar sensor', 'Tilt sensor', 'e-Reader'],
    icon: '🎒',
    category: 'handheld',
    generation: 'Portable (1989-2001)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'desmume',
    name: 'DeSmuME',
    platform: 'Nintendo DS',
    description: 'Feature-rich Nintendo DS emulator',
    website: 'https://desmume.org/',
    supportedFormats: ['.nds', '.ds.gba'],
    features: ['Dual screen', 'Touch input', 'Microphone', 'WiFi emulation'],
    icon: '📱',
    category: 'handheld',
    generation: 'Dual Screen (2004)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'citra',
    name: 'Citra / Lime3DS',
    platform: 'Nintendo 3DS',
    description: '3DS emulator with stereoscopic 3D support',
    website: 'https://lime3ds.github.io/',
    supportedFormats: ['.3ds', '.cci', '.cxi', '.cia'],
    features: ['Stereoscopic 3D', 'Amiibo', 'Camera support', 'Local wireless'],
    icon: '👓',
    category: 'handheld',
    generation: '3D Portable (2011)',
    difficulty: 'medium',
    isOpenSource: true
  },

  // === SEGA CONSOLES ===
  {
    id: 'kega-fusion',
    name: 'Kega Fusion',
    platform: 'Sega Master System / Genesis / CD / 32X',
    description: 'All-in-one Sega emulator covering multiple systems',
    website: 'https://www.emulator-zone.com/doc.php/genesis/fusion.html',
    webEmulator: 'https://www.retrogames.cc/embed/genesis/',
    supportedFormats: ['.sms', '.gg', '.md', '.gen', '.bin', '.iso'],
    features: ['Netplay', 'Perfect sync', 'All Sega 16-bit systems'],
    icon: '🔵',
    category: 'retro',
    generation: '8/16-bit (1985-1994)',
    difficulty: 'easy',
    isOpenSource: false
  },
  {
    id: 'yabause',
    name: 'Yabause / Kronos',
    platform: 'Sega Saturn',
    description: 'Cross-platform Sega Saturn emulator',
    website: 'https://yabause.org/',
    supportedFormats: ['.iso', '.cue', '.bin', '.mds'],
    features: ['OpenGL renderer', 'Netplay', 'Per-game settings'],
    icon: '🪐',
    category: 'console',
    generation: '32-bit (1994)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'flycast',
    name: 'Flycast',
    platform: 'Sega Dreamcast',
    description: 'Multi-platform Dreamcast emulator (fork of reicast)',
    website: 'https://github.com/flyinghead/flycast',
    supportedFormats: ['.gdi', '.cdi', '.chd', '.cue'],
    features: ['Widescreen', 'VMU support', 'Network play', 'Vulkan'],
    icon: '💿',
    category: 'console',
    generation: '128-bit (1998)',
    difficulty: 'medium',
    isOpenSource: true
  },

  // === SONY CONSOLES ===
  {
    id: 'duckstation',
    name: 'DuckStation',
    platform: 'PlayStation 1',
    description: 'Modern, accurate PlayStation emulator with enhancements',
    website: 'https://www.duckstation.org/',
    supportedFormats: ['.bin', '.cue', '.iso', '.img', '.chd', '.pbp'],
    features: ['PGXP', 'Widescreen', 'Texture replacement', 'Runahead'],
    icon: '🦆',
    category: 'console',
    generation: '32-bit (1994)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'pcsx2',
    name: 'PCSX2',
    platform: 'PlayStation 2',
    description: 'The most mature PS2 emulator with excellent compatibility',
    website: 'https://pcsx2.net/',
    supportedFormats: ['.iso', '.bin', '.img', '.mdf', '.nrg', '.chd'],
    features: ['Upscaling', 'Widescreen patches', 'USB support', 'Save states'],
    icon: '2️⃣',
    category: 'console',
    generation: '128-bit (2000)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'rpcs3',
    name: 'RPCS3',
    platform: 'PlayStation 3',
    description: 'Experimental PS3 emulator with growing compatibility',
    website: 'https://rpcs3.net/',
    supportedFormats: ['.pkg', 'folder'],
    features: ['Vulkan', '4K support', 'Online services', 'Trophy support'],
    icon: '3️⃣',
    category: 'console',
    generation: 'HD (2006)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'ppsspp',
    name: 'PPSSPP',
    platform: 'PlayStation Portable (PSP)',
    description: 'Fast and portable PSP emulator',
    website: 'https://www.ppsspp.org/',
    webEmulator: 'https://nickcano.com/pspemu/',
    supportedFormats: ['.iso', '.cso', '.pbp', '.elf'],
    features: ['HD rendering', 'Save states', 'Texture scaling', 'Cheats'],
    icon: '📀',
    category: 'handheld',
    generation: 'Portable (2004)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'vita3k',
    name: 'Vita3K',
    platform: 'PlayStation Vita',
    description: 'Experimental PlayStation Vita emulator',
    website: 'https://vita3k.org/',
    supportedFormats: ['.vpk', '.pkg'],
    features: ['Touch controls', 'Trophies', 'Shader caching'],
    icon: '📲',
    category: 'handheld',
    generation: 'Portable (2011)',
    difficulty: 'advanced',
    isOpenSource: true
  },

  // === MICROSOFT CONSOLES ===
  {
    id: 'xemu',
    name: 'xemu',
    platform: 'Xbox (Original)',
    description: 'Original Xbox emulator with high compatibility',
    website: 'https://xemu.app/',
    supportedFormats: ['.iso', '.xiso'],
    features: ['Networking', 'Save states', 'Vulkan'],
    icon: '❎',
    category: 'console',
    generation: '128-bit (2001)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'xenia',
    name: 'Xenia',
    platform: 'Xbox 360',
    description: 'Experimental Xbox 360 emulator',
    website: 'https://xenia.jp/',
    supportedFormats: ['.iso', '.xex', 'GOD'],
    features: ['Vulkan', 'Disc images', 'Live Arcade games'],
    icon: '🟢',
    category: 'console',
    generation: 'HD (2005)',
    difficulty: 'advanced',
    isOpenSource: true
  },

  // === ARCADE ===
  {
    id: 'mame',
    name: 'MAME',
    platform: 'Arcade (Multiple)',
    description: 'The definitive arcade machine emulator - thousands of games',
    website: 'https://www.mamedev.org/',
    webEmulator: 'https://www.retrogames.cc/embed/arcade/',
    supportedFormats: ['.zip', '.7z', '.chd'],
    features: ['Thousands of machines', 'Accurate emulation', 'Cheats'],
    icon: '🕹️',
    category: 'arcade',
    generation: 'Arcade (1970s-2000s)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'fbalpha',
    name: 'FinalBurn Neo',
    platform: 'Arcade (CPS1/CPS2/Neo Geo)',
    description: 'Specialized arcade emulator for fighting games',
    website: 'https://github.com/finalburnneo/FBNeo',
    supportedFormats: ['.zip', '.7z'],
    features: ['CPS1/2/3', 'Neo Geo', 'Netplay', 'Shaders'],
    icon: '👊',
    category: 'arcade',
    generation: 'Arcade (1990s)',
    difficulty: 'medium',
    isOpenSource: true
  },

  // === ATARI ===
  {
    id: 'stella',
    name: 'Stella',
    platform: 'Atari 2600',
    description: 'Multi-platform Atari 2600 emulator',
    website: 'https://stella-emu.github.io/',
    webEmulator: 'https://www.retrogames.cc/embed/atari2600/',
    supportedFormats: ['.a26', '.bin', '.rom'],
    features: ['Debugger', 'TIA emulation', 'Paddle support'],
    icon: '🕹️',
    category: 'retro',
    generation: '8-bit (1977)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'atari800',
    name: 'Atari800',
    platform: 'Atari 8-bit (400/800/XL/XE)',
    description: 'Atari 8-bit computer emulator',
    website: 'https://atari800.github.io/',
    supportedFormats: ['.atr', '.xex', '.cas', '.car'],
    features: ['All Atari 8-bit computers', 'Disk drive emulation'],
    icon: '💾',
    category: 'computer',
    generation: '8-bit (1979)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'hatari',
    name: 'Hatari',
    platform: 'Atari ST/STE/TT/Falcon',
    description: 'Atari ST family emulator',
    website: 'https://hatari.tuxfamily.org/',
    supportedFormats: ['.st', '.msa', '.stx', '.dim'],
    features: ['All ST variants', 'MIDI support', 'Hard disk support'],
    icon: '🖥️',
    category: 'computer',
    generation: '16-bit (1985)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'prosystem',
    name: 'ProSystem',
    platform: 'Atari 7800',
    description: 'Atari 7800 emulator with 2600 compatibility',
    website: 'https://www.emulator-zone.com/doc.php/atari/prosystem.html',
    supportedFormats: ['.a78', '.bin'],
    features: ['High compatibility', 'Lightgun support'],
    icon: '7️⃣',
    category: 'retro',
    generation: '8-bit (1986)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'virtualjaguar',
    name: 'Virtual Jaguar',
    platform: 'Atari Jaguar',
    description: 'Atari Jaguar emulator',
    website: 'https://icculus.org/virtualjaguar/',
    supportedFormats: ['.j64', '.jag', '.rom'],
    features: ['CD support', 'Alpine development board'],
    icon: '🐆',
    category: 'console',
    generation: '64-bit (1993)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'a5200',
    name: 'Atari 5200',
    platform: 'Atari 5200',
    description: 'Atari 5200 SuperSystem emulator',
    website: 'https://www.emulator-zone.com/doc.php/atari/atari5200.html',
    supportedFormats: ['.a52', '.bin'],
    features: ['Analog controller support', 'High compatibility'],
    icon: '5️⃣',
    category: 'retro',
    generation: '8-bit (1982)',
    difficulty: 'easy',
    isOpenSource: true
  },

  // === CLASSIC COMPUTERS ===
  {
    id: 'dosbox',
    name: 'DOSBox',
    platform: 'MS-DOS',
    description: 'DOS emulator for classic PC games',
    website: 'https://www.dosbox.com/',
    webEmulator: 'https://js-dos.com/',
    supportedFormats: ['.exe', '.com', '.bat', 'folders'],
    features: ['Sound Blaster', 'VGA graphics', 'Serial/parallel ports'],
    icon: '💻',
    category: 'computer',
    generation: 'PC (1980s-90s)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'vice',
    name: 'VICE',
    platform: 'Commodore 64/128/VIC-20/PET',
    description: 'The Versatile Commodore Emulator',
    website: 'https://vice-emu.sourceforge.io/',
    supportedFormats: ['.d64', '.t64', '.prg', '.crt', '.tap'],
    features: ['All Commodore 8-bit systems', 'Disk drive emulation'],
    icon: '🖥️',
    category: 'computer',
    generation: '8-bit (1980s)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'fsuae',
    name: 'FS-UAE',
    platform: 'Commodore Amiga',
    description: 'Cross-platform Amiga emulator',
    website: 'https://fs-uae.net/',
    supportedFormats: ['.adf', '.ipf', '.dms', '.hdf'],
    features: ['All Amiga models', 'CD32 support', 'WHDLoad'],
    icon: '🔲',
    category: 'computer',
    generation: '16/32-bit (1985)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'zxspectrum',
    name: 'Fuse',
    platform: 'ZX Spectrum',
    description: 'Free Unix Spectrum Emulator',
    website: 'https://fuse-emulator.sourceforge.net/',
    supportedFormats: ['.tap', '.tzx', '.z80', '.sna'],
    features: ['All Spectrum models', 'Joystick support', 'Kempston mouse'],
    icon: '🌈',
    category: 'computer',
    generation: '8-bit (1982)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'arnold',
    name: 'Arnold',
    platform: 'Amstrad CPC',
    description: 'Amstrad CPC emulator',
    website: 'https://www.cpcwiki.eu/index.php/Arnold',
    supportedFormats: ['.dsk', '.sna', '.cdt'],
    features: ['All CPC models', 'Disk/tape support'],
    icon: '📺',
    category: 'computer',
    generation: '8-bit (1984)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'appleiigs',
    name: 'KEGS / GSPlus',
    platform: 'Apple II / IIGS',
    description: 'Apple II series emulator',
    website: 'https://apple2.gs/',
    supportedFormats: ['.2mg', '.po', '.dsk', '.woz'],
    features: ['All Apple II variants', 'ProDOS support'],
    icon: '🍎',
    category: 'computer',
    generation: '8/16-bit (1977-86)',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'bluemsx',
    name: 'blueMSX',
    platform: 'MSX / MSX2 / MSX2+',
    description: 'Cross-platform MSX emulator',
    website: 'https://www.bluemsx.com/',
    supportedFormats: ['.rom', '.dsk', '.cas', '.mx1', '.mx2'],
    features: ['All MSX variants', 'Moonsound', 'SCC+'],
    icon: '📼',
    category: 'computer',
    generation: '8-bit (1983)',
    difficulty: 'medium',
    isOpenSource: true
  },

  // === NEO GEO ===
  {
    id: 'kawaks',
    name: 'Kawaks / NeoRAGEx',
    platform: 'Neo Geo AES/MVS',
    description: 'Dedicated Neo Geo arcade/console emulator',
    website: 'https://www.emulator-zone.com/doc.php/neogeo/kawaks.html',
    supportedFormats: ['.zip'],
    features: ['Perfect compatibility', 'Cheats', 'Netplay'],
    icon: '🎰',
    category: 'arcade',
    generation: '24-bit (1990)',
    difficulty: 'medium',
    isOpenSource: false
  },
  {
    id: 'neogeocd',
    name: 'NeoCD/SDL',
    platform: 'Neo Geo CD',
    description: 'Neo Geo CD emulator',
    website: 'https://www.emulator-zone.com/doc.php/neogeo/neocdsdl.html',
    supportedFormats: ['.cue', '.iso', '.img'],
    features: ['CD audio', 'Memory card'],
    icon: '💿',
    category: 'console',
    generation: '24-bit (1994)',
    difficulty: 'medium',
    isOpenSource: true
  },

  // === NEC CONSOLES ===
  {
    id: 'mednafen-pce',
    name: 'Mednafen',
    platform: 'TurboGrafx-16 / PC Engine',
    description: 'Multi-system emulator with excellent PCE support',
    website: 'https://mednafen.github.io/',
    supportedFormats: ['.pce', '.sgx', '.cue', '.ccd'],
    features: ['CD-ROM²', 'SuperGrafx', 'Arcade Card'],
    icon: '🌀',
    category: 'retro',
    generation: '8/16-bit (1987)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'pcfx',
    name: 'Mednafen PC-FX',
    platform: 'PC-FX',
    description: 'PC-FX emulation via Mednafen',
    website: 'https://mednafen.github.io/',
    supportedFormats: ['.cue', '.ccd', '.toc'],
    features: ['CD audio', 'Full compatibility'],
    icon: '📀',
    category: 'console',
    generation: '32-bit (1994)',
    difficulty: 'advanced',
    isOpenSource: true
  },

  // === OTHER CONSOLES ===
  {
    id: 'bsnes',
    name: 'bsnes / higan',
    platform: 'Super Nintendo (Accuracy)',
    description: 'Cycle-accurate SNES emulator',
    website: 'https://bsnes.org/',
    supportedFormats: ['.smc', '.sfc', '.bs'],
    features: ['Cycle accuracy', 'MSU-1', 'Satellaview'],
    icon: '🎯',
    category: 'retro',
    generation: '16-bit (1990)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'ares',
    name: 'ares',
    platform: 'Multi-System',
    description: 'Multi-system emulator (successor to higan)',
    website: 'https://ares-emu.net/',
    supportedFormats: ['Multiple'],
    features: ['30+ systems', 'Accuracy focused', 'Modern UI'],
    icon: '⭐',
    category: 'retro',
    generation: 'Multiple',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'bizhawk',
    name: 'BizHawk',
    platform: 'Multi-System (TAS)',
    description: 'Multi-system emulator designed for tool-assisted speedruns',
    website: 'https://tasvideos.org/BizHawk',
    supportedFormats: ['Multiple'],
    features: ['TAS tools', 'Lua scripting', 'Rerecording'],
    icon: '🏃',
    category: 'retro',
    generation: 'Multiple',
    difficulty: 'advanced',
    isOpenSource: true
  },
  {
    id: 'retroarch',
    name: 'RetroArch',
    platform: 'Multi-System (Libretro)',
    description: 'Frontend for the libretro API - runs many emulator cores',
    website: 'https://www.retroarch.com/',
    supportedFormats: ['Multiple via cores'],
    features: ['Shaders', 'Netplay', 'Achievements', 'Unified interface'],
    icon: '🔄',
    category: 'retro',
    generation: 'All',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'openemu',
    name: 'OpenEmu',
    platform: 'Multi-System (macOS)',
    description: 'Beautiful multi-system emulator for macOS',
    website: 'https://openemu.org/',
    supportedFormats: ['Multiple'],
    features: ['iTunes-like library', 'Controller support', 'Save states'],
    icon: '🍎',
    category: 'retro',
    generation: 'All',
    difficulty: 'easy',
    isOpenSource: true
  },

  // === HANDHELDS (Non-Nintendo/Sony) ===
  {
    id: 'wonderswan',
    name: 'Mednafen WonderSwan',
    platform: 'Bandai WonderSwan',
    description: 'WonderSwan/Color emulation via Mednafen',
    website: 'https://mednafen.github.io/',
    supportedFormats: ['.ws', '.wsc', '.pc2'],
    features: ['Portrait/landscape', 'Full compatibility'],
    icon: '🎮',
    category: 'handheld',
    generation: 'Portable (1999)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'ngp',
    name: 'Mednafen NGP',
    platform: 'Neo Geo Pocket / Color',
    description: 'Neo Geo Pocket emulation',
    website: 'https://mednafen.github.io/',
    supportedFormats: ['.ngp', '.ngc', '.npc'],
    features: ['Link cable', 'Full compatibility'],
    icon: '📱',
    category: 'handheld',
    generation: 'Portable (1998)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'lynx',
    name: 'Handy',
    platform: 'Atari Lynx',
    description: 'Atari Lynx emulator',
    website: 'https://www.emulator-zone.com/doc.php/atari/handy.html',
    supportedFormats: ['.lnx', '.o'],
    features: ['Rotation support', 'ComLynx'],
    icon: '🐱',
    category: 'handheld',
    generation: 'Portable (1989)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'gamegear',
    name: 'Gearsystem',
    platform: 'Sega Game Gear',
    description: 'Game Gear and Master System emulator',
    website: 'https://github.com/drhelius/Gearsystem',
    supportedFormats: ['.gg', '.sms', '.sg'],
    features: ['High accuracy', 'Save states'],
    icon: '🎮',
    category: 'handheld',
    generation: 'Portable (1990)',
    difficulty: 'easy',
    isOpenSource: true
  },

  // === OBSCURE/MISC ===
  {
    id: '3do',
    name: 'Opera / 4DO',
    platform: '3DO Interactive Multiplayer',
    description: '3DO console emulator',
    website: 'https://www.emulator-zone.com/doc.php/3do/',
    supportedFormats: ['.iso', '.bin', '.cue'],
    features: ['High compatibility', 'FMV support'],
    icon: '3️⃣',
    category: 'console',
    generation: '32-bit (1993)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'cdimono',
    name: 'CD-i Emulator',
    platform: 'Philips CD-i',
    description: 'CD-i console emulator',
    website: 'https://www.cdiemu.org/',
    supportedFormats: ['.cue', '.bin'],
    features: ['MPEG-1 video', 'Digital video cartridge'],
    icon: '📀',
    category: 'console',
    generation: '16-bit (1991)',
    difficulty: 'advanced',
    isOpenSource: false
  },
  {
    id: 'vectrex',
    name: 'ParaJVE',
    platform: 'Vectrex',
    description: 'Vector graphics console emulator',
    website: 'https://www.emulator-zone.com/doc.php/vectrex/',
    supportedFormats: ['.vec', '.bin'],
    features: ['Vector graphics', 'Overlays'],
    icon: '📐',
    category: 'console',
    generation: 'Vector (1982)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'colecovision',
    name: 'ColEm',
    platform: 'ColecoVision',
    description: 'ColecoVision console emulator',
    website: 'https://fms.komkon.org/ColEm/',
    supportedFormats: ['.col', '.rom'],
    features: ['Roller controller', 'Super Game Module'],
    icon: '🎮',
    category: 'retro',
    generation: '8-bit (1982)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'intellivision',
    name: 'jzIntv',
    platform: 'Intellivision',
    description: 'Intellivision console emulator',
    website: 'http://spatula-city.org/~im14u2c/intv/',
    supportedFormats: ['.int', '.bin', '.rom'],
    features: ['ECS', 'Intellivoice'],
    icon: '🕹️',
    category: 'retro',
    generation: '16-bit (1979)',
    difficulty: 'medium',
    isOpenSource: true
  },
  {
    id: 'odyssey2',
    name: 'O2EM',
    platform: 'Magnavox Odyssey²',
    description: 'Odyssey² console emulator',
    website: 'https://www.emulator-zone.com/doc.php/odyssey2/',
    supportedFormats: ['.bin'],
    features: ['Voice module', 'Full compatibility'],
    icon: '🎮',
    category: 'retro',
    generation: '8-bit (1978)',
    difficulty: 'easy',
    isOpenSource: true
  },
  {
    id: 'channelf',
    name: 'FreeChaF',
    platform: 'Fairchild Channel F',
    description: 'First cartridge-based console emulator',
    website: 'https://github.com/libretro/FreeChaF',
    supportedFormats: ['.bin', '.chf'],
    features: ['First cartridge console ever'],
    icon: '📼',
    category: 'retro',
    generation: '8-bit (1976)',
    difficulty: 'easy',
    isOpenSource: true
  }
];

// ROM Sources (Legal/Educational)
export const ROM_SOURCES: RomSource[] = [
  {
    id: 'archive-games',
    name: 'Internet Archive - Games',
    url: 'https://archive.org/details/software?query=games',
    description: 'Massive collection of abandonware and homebrew games',
    platforms: ['DOS', 'Windows', 'Arcade', 'Various'],
    legalNote: 'Abandonware and freely distributed games'
  },
  {
    id: 'emulatorgamer',
    name: 'Emulator Gamer',
    url: 'https://emulatorgamer.com/',
    description: 'ROM collection with emulator downloads',
    platforms: ['NES', 'SNES', 'N64', 'GBA', 'Genesis', 'PS1', 'PS2'],
    legalNote: 'For personal backup use only'
  },
  {
    id: 'emulator-zone',
    name: 'Emulator Zone',
    url: 'https://www.emulator-zone.com/',
    description: 'Comprehensive emulator download site',
    platforms: ['All platforms'],
    legalNote: 'Emulators only - no ROMs'
  },
  {
    id: 'vimms-lair',
    name: 'Vimm\'s Lair',
    url: 'https://vimm.net/',
    description: 'Long-running preservation site',
    platforms: ['Nintendo', 'Sega', 'Sony', 'Various'],
    legalNote: 'Preservation focus'
  },
  {
    id: 'romhacking',
    name: 'ROMhacking.net',
    url: 'https://www.romhacking.net/',
    description: 'ROM hacks, translations, and utilities',
    platforms: ['All retro platforms'],
    legalNote: 'Patches only - requires original ROMs'
  },
  {
    id: 'homebrew',
    name: 'PDRoms',
    url: 'https://pdroms.de/',
    description: 'Public domain and homebrew ROMs',
    platforms: ['All platforms'],
    legalNote: 'Free and legal homebrew games'
  }
];

// Platform Categories
export const EMULATOR_CATEGORIES = [
  { id: 'all', name: 'All Platforms', icon: '🎮', count: EMULATORS.length },
  { id: 'retro', name: 'Retro Consoles', icon: '👾', count: EMULATORS.filter(e => e.category === 'retro').length },
  { id: 'console', name: 'Modern Consoles', icon: '🎯', count: EMULATORS.filter(e => e.category === 'console').length },
  { id: 'handheld', name: 'Handhelds', icon: '📱', count: EMULATORS.filter(e => e.category === 'handheld').length },
  { id: 'arcade', name: 'Arcade', icon: '🕹️', count: EMULATORS.filter(e => e.category === 'arcade').length },
  { id: 'computer', name: 'Computers', icon: '💻', count: EMULATORS.filter(e => e.category === 'computer').length }
];

// Statistics
export const EMULATOR_STATS = {
  totalEmulators: EMULATORS.length,
  platforms: new Set(EMULATORS.map(e => e.platform)).size,
  openSource: EMULATORS.filter(e => e.isOpenSource).length,
  webPlayable: EMULATORS.filter(e => e.webEmulator).length
};

export default {
  EMULATORS,
  ROM_SOURCES,
  EMULATOR_CATEGORIES,
  EMULATOR_STATS
};

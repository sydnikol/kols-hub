// Gothic Luxury Apartment Themes - 100+ Premade Themes
// Includes seasonal, holiday, and luxury variations

export interface GothicTheme {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    glow: string;
  };
  ambiance: {
    lighting: 'candlelight' | 'moonlight' | 'firelight' | 'starlight' | 'twilight' | 'dawn' | 'ethereal' | 'storm';
    mood: string;
    scent: string;
    sound: string;
    temperature: 'cold' | 'cool' | 'warm' | 'cozy';
  };
  decorations: string[];
  specialEffects: string[];
  isHoliday: boolean;
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
}

export type ThemeCategory =
  | 'classic-gothic'
  | 'victorian'
  | 'romantic-gothic'
  | 'dark-academia'
  | 'witchy'
  | 'vampire'
  | 'celestial'
  | 'nature-gothic'
  | 'royal'
  | 'holiday'
  | 'seasonal'
  | 'mystical'
  | 'steampunk'
  | 'art-nouveau'
  | 'baroque';

export const GOTHIC_THEMES: GothicTheme[] = [
  // ==================== CLASSIC GOTHIC (1-10) ====================
  {
    id: 'midnight-velvet',
    name: 'Midnight Velvet',
    category: 'classic-gothic',
    description: 'Deep purple velvet draped over mahogany, lit by silver candelabras',
    colors: {
      primary: '#2D1B4E',
      secondary: '#1A0F2E',
      accent: '#9B59B6',
      background: '#0D0A12',
      surface: '#1E1428',
      text: '#E8E0F0',
      textMuted: '#9B8FB0',
      glow: '#B388FF'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mysterious',
      scent: 'velvet rose and amber',
      sound: 'crackling fire',
      temperature: 'warm'
    },
    decorations: ['silver candelabras', 'velvet drapes', 'antique mirrors', 'crystal decanters'],
    specialEffects: ['flickering shadows', 'dust motes in light'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'ravens-sanctuary',
    name: "Raven's Sanctuary",
    category: 'classic-gothic',
    description: 'Obsidian black with iridescent purple highlights, feathers everywhere',
    colors: {
      primary: '#1A1A2E',
      secondary: '#0F0F1A',
      accent: '#4A0E78',
      background: '#050508',
      surface: '#12121C',
      text: '#D4D4E8',
      textMuted: '#7A7A9E',
      glow: '#7B2CBF'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'ominous',
      scent: 'black orchid',
      sound: 'distant cawing',
      temperature: 'cool'
    },
    decorations: ['raven statues', 'black feathers', 'obsidian crystals', 'iron chandeliers'],
    specialEffects: ['shadow wings', 'glinting eyes'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'crimson-cathedral',
    name: 'Crimson Cathedral',
    category: 'classic-gothic',
    description: 'Deep reds and blacks with stained glass light filtering through',
    colors: {
      primary: '#4A0D0D',
      secondary: '#2B0808',
      accent: '#DC143C',
      background: '#0A0505',
      surface: '#1C0A0A',
      text: '#F5E6E6',
      textMuted: '#C4A0A0',
      glow: '#FF4D6D'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'dramatic',
      scent: 'frankincense and myrrh',
      sound: 'gregorian chants',
      temperature: 'cool'
    },
    decorations: ['stained glass panels', 'gothic arches', 'iron crosses', 'red roses'],
    specialEffects: ['colored light beams', 'incense smoke'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'shadow-manor',
    name: 'Shadow Manor',
    category: 'classic-gothic',
    description: 'Classic haunted mansion aesthetic with dusty elegance',
    colors: {
      primary: '#2C2C3C',
      secondary: '#1A1A24',
      accent: '#6B6B8D',
      background: '#0E0E14',
      surface: '#1E1E28',
      text: '#D8D8E8',
      textMuted: '#8888A8',
      glow: '#9090B0'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'haunting',
      scent: 'old books and dust',
      sound: 'creaking floorboards',
      temperature: 'cold'
    },
    decorations: ['cobwebs', 'dusty portraits', 'grandfather clocks', 'faded tapestries'],
    specialEffects: ['floating dust', 'moving shadows'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'ebony-elegance',
    name: 'Ebony Elegance',
    category: 'classic-gothic',
    description: 'Pure black with silver accents, minimalist gothic luxury',
    colors: {
      primary: '#1A1A1A',
      secondary: '#0D0D0D',
      accent: '#C0C0C0',
      background: '#050505',
      surface: '#141414',
      text: '#F0F0F0',
      textMuted: '#A0A0A0',
      glow: '#E8E8E8'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'sophisticated',
      scent: 'black amber',
      sound: 'soft piano',
      temperature: 'cool'
    },
    decorations: ['silver frames', 'black marble', 'crystal vases', 'silk cushions'],
    specialEffects: ['silver shimmer', 'smooth reflections'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gargoyle-keep',
    name: 'Gargoyle Keep',
    category: 'classic-gothic',
    description: 'Stone fortress aesthetic with guardian statues',
    colors: {
      primary: '#3D3D4D',
      secondary: '#2A2A38',
      accent: '#7D7D9D',
      background: '#15151C',
      surface: '#25252F',
      text: '#E0E0EC',
      textMuted: '#9090A8',
      glow: '#A0A0C0'
    },
    ambiance: {
      lighting: 'storm',
      mood: 'protective',
      scent: 'rain on stone',
      sound: 'thunder rolling',
      temperature: 'cold'
    },
    decorations: ['gargoyle statues', 'stone arches', 'iron torches', 'medieval banners'],
    specialEffects: ['lightning flashes', 'rain on windows'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'phantoms-parlor',
    name: "Phantom's Parlor",
    category: 'classic-gothic',
    description: 'Ethereal whites and grays with ghostly presence',
    colors: {
      primary: '#E8E8F0',
      secondary: '#C8C8D8',
      accent: '#A0A0C0',
      background: '#F5F5FA',
      surface: '#FFFFFF',
      text: '#2A2A3A',
      textMuted: '#6A6A7A',
      glow: '#D0D0FF'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'spectral',
      scent: 'white lily',
      sound: 'whispers',
      temperature: 'cold'
    },
    decorations: ['white lace', 'silver mirrors', 'pale flowers', 'crystal chandeliers'],
    specialEffects: ['floating orbs', 'transparent figures'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'crypt-keeper',
    name: 'Crypt Keeper',
    category: 'classic-gothic',
    description: 'Underground tomb aesthetic with ancient mystique',
    colors: {
      primary: '#2B2B35',
      secondary: '#1B1B22',
      accent: '#5A5A70',
      background: '#0C0C10',
      surface: '#1A1A22',
      text: '#C8C8D8',
      textMuted: '#7878888',
      glow: '#8080A0'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'ancient',
      scent: 'earth and stone',
      sound: 'dripping water',
      temperature: 'cold'
    },
    decorations: ['stone sarcophagi', 'iron gates', 'ancient inscriptions', 'bone relics'],
    specialEffects: ['fog rolling', 'torch flicker'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'noir-nights',
    name: 'Noir Nights',
    category: 'classic-gothic',
    description: 'Film noir inspired with dramatic contrasts',
    colors: {
      primary: '#1C1C24',
      secondary: '#0F0F14',
      accent: '#F0F0F0',
      background: '#080810',
      surface: '#16161E',
      text: '#FFFFFF',
      textMuted: '#909098',
      glow: '#FFFFFF'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'mysterious',
      scent: 'cigarette smoke and perfume',
      sound: 'jazz saxophone',
      temperature: 'cool'
    },
    decorations: ['venetian blinds', 'art deco lamps', 'fedora hats', 'vintage cameras'],
    specialEffects: ['dramatic shadows', 'light stripes'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gothic-grandeur',
    name: 'Gothic Grandeur',
    category: 'classic-gothic',
    description: 'Maximalist gothic with every luxury',
    colors: {
      primary: '#2E1A3D',
      secondary: '#1A0F24',
      accent: '#FFD700',
      background: '#0D0812',
      surface: '#1E1428',
      text: '#F5F0FA',
      textMuted: '#B0A0C0',
      glow: '#FFE066'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'opulent',
      scent: 'oud and gold',
      sound: 'orchestral swells',
      temperature: 'warm'
    },
    decorations: ['gold leaf details', 'crystal chandeliers', 'oil paintings', 'marble statues'],
    specialEffects: ['golden sparkles', 'rich glow'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== VICTORIAN (11-20) ====================
  {
    id: 'victorian-mourning',
    name: 'Victorian Mourning',
    category: 'victorian',
    description: 'Black crepe and jet jewelry, somber elegance',
    colors: {
      primary: '#1A1A1E',
      secondary: '#0D0D10',
      accent: '#4A4A5A',
      background: '#050506',
      surface: '#141416',
      text: '#D0D0D8',
      textMuted: '#808088',
      glow: '#606070'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'melancholic',
      scent: 'black roses',
      sound: 'ticking clocks',
      temperature: 'cool'
    },
    decorations: ['jet jewelry', 'mourning portraits', 'black lace', 'memorial wreaths'],
    specialEffects: ['slow clock ticking', 'fading light'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gaslight-romance',
    name: 'Gaslight Romance',
    category: 'victorian',
    description: 'Warm amber gaslight glow with romantic touches',
    colors: {
      primary: '#3D2A1A',
      secondary: '#2A1C10',
      accent: '#D4A574',
      background: '#1A1208',
      surface: '#2D1E12',
      text: '#F5E8D8',
      textMuted: '#C4A888',
      glow: '#FFB366'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'romantic',
      scent: 'vanilla and tobacco',
      sound: 'music box melody',
      temperature: 'warm'
    },
    decorations: ['gas lamps', 'love letters', 'dried flowers', 'lace doilies'],
    specialEffects: ['warm flicker', 'soft shadows'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'parlor-poison',
    name: 'Parlor Poison',
    category: 'victorian',
    description: 'Arsenic green wallpaper with deadly beauty',
    colors: {
      primary: '#1A3D2A',
      secondary: '#0F2A1A',
      accent: '#50C878',
      background: '#081A10',
      surface: '#122D1C',
      text: '#E8F5EC',
      textMuted: '#88C4A0',
      glow: '#7CFC00'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'dangerous',
      scent: 'lily of the valley',
      sound: 'whispering',
      temperature: 'cool'
    },
    decorations: ['poison bottles', 'exotic plants', 'taxidermy', 'green velvet'],
    specialEffects: ['toxic shimmer', 'creeping vines'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'seance-chamber',
    name: 'Seance Chamber',
    category: 'victorian',
    description: 'Spiritualist aesthetic for communing with beyond',
    colors: {
      primary: '#2D2035',
      secondary: '#1A1420',
      accent: '#9B6B9B',
      background: '#0F0A12',
      surface: '#201828',
      text: '#E8E0F0',
      textMuted: '#A090B0',
      glow: '#DA70D6'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mystical',
      scent: 'sage and lavender',
      sound: 'spirit rapping',
      temperature: 'cold'
    },
    decorations: ['ouija boards', 'crystal balls', 'spirit photography', 'velvet curtains'],
    specialEffects: ['table levitation', 'ectoplasm wisps'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'opium-den',
    name: 'Opium Den Dreams',
    category: 'victorian',
    description: 'Hazy oriental luxury with decadent comfort',
    colors: {
      primary: '#3D1A2A',
      secondary: '#2A0F1A',
      accent: '#C4547A',
      background: '#1A0810',
      surface: '#2D1220',
      text: '#F5E0E8',
      textMuted: '#C488A0',
      glow: '#FF69B4'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'dreamy',
      scent: 'poppy and sandalwood',
      sound: 'distant bells',
      temperature: 'warm'
    },
    decorations: ['silk cushions', 'hookah pipes', 'oriental screens', 'embroidered fabrics'],
    specialEffects: ['smoke wisps', 'dreamy haze'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'inventors-workshop',
    name: "Inventor's Workshop",
    category: 'victorian',
    description: 'Scientific gothic with brass and glass',
    colors: {
      primary: '#2A2A1A',
      secondary: '#1A1A0F',
      accent: '#B8860B',
      background: '#10100A',
      surface: '#222218',
      text: '#F0E8D8',
      textMuted: '#A8A088',
      glow: '#DAA520'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'curious',
      scent: 'machine oil and leather',
      sound: 'ticking mechanisms',
      temperature: 'warm'
    },
    decorations: ['brass instruments', 'glass beakers', 'blueprints', 'leather journals'],
    specialEffects: ['steam puffs', 'electrical sparks'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'penny-dreadful',
    name: 'Penny Dreadful',
    category: 'victorian',
    description: 'Pulp horror aesthetic with sensational drama',
    colors: {
      primary: '#1A1A28',
      secondary: '#0F0F18',
      accent: '#8B0000',
      background: '#08080E',
      surface: '#141420',
      text: '#E8E0F0',
      textMuted: '#9888A8',
      glow: '#DC143C'
    },
    ambiance: {
      lighting: 'storm',
      mood: 'thrilling',
      scent: 'ink and blood',
      sound: 'dramatic music',
      temperature: 'cold'
    },
    decorations: ['pulp magazines', 'anatomical charts', 'medical instruments', 'wanted posters'],
    specialEffects: ['blood drips', 'lightning flashes'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'crystal-palace',
    name: 'Crystal Palace',
    category: 'victorian',
    description: 'Glass and iron conservatory with exotic plants',
    colors: {
      primary: '#E8F0F0',
      secondary: '#C8D8D8',
      accent: '#2E8B57',
      background: '#F0F8F8',
      surface: '#FFFFFF',
      text: '#1A2A2A',
      textMuted: '#5A7070',
      glow: '#98FB98'
    },
    ambiance: {
      lighting: 'dawn',
      mood: 'wonder',
      scent: 'exotic flowers',
      sound: 'tropical birds',
      temperature: 'warm'
    },
    decorations: ['iron framework', 'palms', 'orchids', 'fountain'],
    specialEffects: ['sunbeams', 'mist spray'],
    isHoliday: false,
    season: 'spring'
  },
  {
    id: 'ripper-london',
    name: 'Ripper London',
    category: 'victorian',
    description: 'Foggy Whitechapel streets, gas lamps in the mist',
    colors: {
      primary: '#2A2A30',
      secondary: '#1A1A20',
      accent: '#708090',
      background: '#0E0E12',
      surface: '#1E1E24',
      text: '#D8D8E0',
      textMuted: '#8888958',
      glow: '#A9A9A9'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'dangerous',
      scent: 'fog and coal',
      sound: 'distant footsteps',
      temperature: 'cold'
    },
    decorations: ['street signs', 'cobblestones', 'newspaper clippings', 'pocket watches'],
    specialEffects: ['thick fog', 'distant screams'],
    isHoliday: false,
    season: 'autumn'
  },
  {
    id: 'tea-time-terror',
    name: 'Tea Time Terror',
    category: 'victorian',
    description: 'Proper afternoon tea with sinister undertones',
    colors: {
      primary: '#4A3728',
      secondary: '#2E221A',
      accent: '#DEB887',
      background: '#1A1410',
      surface: '#3A2E24',
      text: '#F5EDE0',
      textMuted: '#C4B8A0',
      glow: '#F5DEB3'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'unsettling',
      scent: 'earl grey and arsenic',
      sound: 'clinking china',
      temperature: 'warm'
    },
    decorations: ['fine china', 'silver service', 'poisoned pastries', 'lace tablecloths'],
    specialEffects: ['steam rising', 'suspicious glances'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== ROMANTIC GOTHIC (21-30) ====================
  {
    id: 'bleeding-heart',
    name: 'Bleeding Heart',
    category: 'romantic-gothic',
    description: 'Deep romantic reds with passionate darkness',
    colors: {
      primary: '#4A1028',
      secondary: '#2E0818',
      accent: '#DC143C',
      background: '#180510',
      surface: '#2E1020',
      text: '#F5E0E8',
      textMuted: '#C4889A',
      glow: '#FF1744'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'passionate',
      scent: 'red roses and wine',
      sound: 'heartbeat pulse',
      temperature: 'warm'
    },
    decorations: ['red roses', 'love letters', 'heart lockets', 'wine glasses'],
    specialEffects: ['rose petals falling', 'heartbeat glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'forbidden-love',
    name: 'Forbidden Love',
    category: 'romantic-gothic',
    description: 'Secret romance aesthetic with hidden passion',
    colors: {
      primary: '#3D1A35',
      secondary: '#280F24',
      accent: '#E91E63',
      background: '#140810',
      surface: '#2A1424',
      text: '#F8E8F0',
      textMuted: '#C890B0',
      glow: '#FF4081'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'secretive',
      scent: 'jasmine at midnight',
      sound: 'whispered promises',
      temperature: 'warm'
    },
    decorations: ['locked diaries', 'hidden portraits', 'secret doors', 'cipher letters'],
    specialEffects: ['keyhole light', 'shadow embrace'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'eternal-devotion',
    name: 'Eternal Devotion',
    category: 'romantic-gothic',
    description: 'Love that transcends death itself',
    colors: {
      primary: '#2A1A3D',
      secondary: '#1A1028',
      accent: '#9C27B0',
      background: '#0E0812',
      surface: '#201430',
      text: '#F0E8F8',
      textMuted: '#A890C0',
      glow: '#E040FB'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'eternal',
      scent: 'immortelle flowers',
      sound: 'ethereal vocals',
      temperature: 'cold'
    },
    decorations: ['memorial jewelry', 'twin graves', 'intertwined roses', 'eternal flames'],
    specialEffects: ['ghostly embrace', 'eternal light'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'moonlit-tryst',
    name: 'Moonlit Tryst',
    category: 'romantic-gothic',
    description: 'Secret meetings under the silver moon',
    colors: {
      primary: '#1A1A30',
      secondary: '#0F0F20',
      accent: '#B8C4E0',
      background: '#080810',
      surface: '#14142A',
      text: '#E8E8F8',
      textMuted: '#9090B8',
      glow: '#E0E8FF'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'romantic',
      scent: 'night-blooming jasmine',
      sound: 'nightingale song',
      temperature: 'cool'
    },
    decorations: ['moon motifs', 'garden gazebo', 'climbing roses', 'stone benches'],
    specialEffects: ['moonbeams', 'fireflies'],
    isHoliday: false,
    season: 'summer'
  },
  {
    id: 'dark-wedding',
    name: 'Dark Wedding',
    category: 'romantic-gothic',
    description: 'Gothic matrimony in black lace and deep purple',
    colors: {
      primary: '#28182A',
      secondary: '#1A0F1C',
      accent: '#8B668B',
      background: '#0C080D',
      surface: '#201420',
      text: '#F0E8F2',
      textMuted: '#A898AC',
      glow: '#DDA0DD'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'ceremonial',
      scent: 'black orchids',
      sound: 'wedding march minor key',
      temperature: 'cool'
    },
    decorations: ['black lace', 'dark calla lilies', 'silver rings', 'gothic arch'],
    specialEffects: ['veil flowing', 'candlelight procession'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'tragic-beauty',
    name: 'Tragic Beauty',
    category: 'romantic-gothic',
    description: 'Heartbreak made beautiful in deep blues',
    colors: {
      primary: '#1A2040',
      secondary: '#0F1428',
      accent: '#4169E1',
      background: '#080A18',
      surface: '#141830',
      text: '#E0E8F8',
      textMuted: '#8898C0',
      glow: '#6495ED'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'melancholic',
      scent: 'rain and tears',
      sound: 'sorrowful violin',
      temperature: 'cold'
    },
    decorations: ['wilted flowers', 'tear-stained letters', 'broken mirrors', 'faded photographs'],
    specialEffects: ['falling tears', 'rain on glass'],
    isHoliday: false,
    season: 'autumn'
  },
  {
    id: 'vampire-kiss',
    name: 'Vampire Kiss',
    category: 'romantic-gothic',
    description: 'Seductive immortal romance in crimson and black',
    colors: {
      primary: '#2A0A18',
      secondary: '#1A050F',
      accent: '#B22222',
      background: '#0D0308',
      surface: '#220A14',
      text: '#F8E8EC',
      textMuted: '#C88898',
      glow: '#FF0000'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'seductive',
      scent: 'blood and roses',
      sound: 'heartbeat slowing',
      temperature: 'cold'
    },
    decorations: ['gothic bed', 'red curtains', 'ancient portraits', 'wine goblets'],
    specialEffects: ['neck exposure', 'fanged shadow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'ghost-bride',
    name: 'Ghost Bride',
    category: 'romantic-gothic',
    description: 'Spectral wedding dress wandering the halls',
    colors: {
      primary: '#E0E0E8',
      secondary: '#C0C0D0',
      accent: '#F5F5F5',
      background: '#F0F0F8',
      surface: '#FFFFFF',
      text: '#2A2A40',
      textMuted: '#6A6A88',
      glow: '#FFFFFF'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'haunting',
      scent: 'faded flowers',
      sound: 'distant sobbing',
      temperature: 'cold'
    },
    decorations: ['tattered veil', 'dead bouquet', 'broken mirror', 'dusty aisle'],
    specialEffects: ['translucent figure', 'floating veil'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'poison-ivy',
    name: 'Poison Ivy',
    category: 'romantic-gothic',
    description: 'Dangerous natural beauty with toxic allure',
    colors: {
      primary: '#1A3020',
      secondary: '#0F2014',
      accent: '#228B22',
      background: '#081408',
      surface: '#142818',
      text: '#E8F0E8',
      textMuted: '#88A888',
      glow: '#32CD32'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'dangerous',
      scent: 'poison flowers',
      sound: 'rustling leaves',
      temperature: 'cool'
    },
    decorations: ['climbing vines', 'thorny roses', 'venus flytraps', 'nightshade'],
    specialEffects: ['creeping tendrils', 'pollen clouds'],
    isHoliday: false,
    season: 'spring'
  },
  {
    id: 'romeo-crypt',
    name: 'Romeo & Juliet Crypt',
    category: 'romantic-gothic',
    description: 'Star-crossed lovers final resting place',
    colors: {
      primary: '#2A2030',
      secondary: '#1A1420',
      accent: '#C9A0DC',
      background: '#0E0A12',
      surface: '#201828',
      text: '#F0E8F5',
      textMuted: '#A098B0',
      glow: '#DA70D6'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'tragic',
      scent: 'tomb flowers',
      sound: 'echoing steps',
      temperature: 'cold'
    },
    decorations: ['twin tombs', 'wilted roses', 'love poems', 'daggers'],
    specialEffects: ['spectral embrace', 'eternal light'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== DARK ACADEMIA (31-40) ====================
  {
    id: 'library-midnight',
    name: 'Midnight Library',
    category: 'dark-academia',
    description: 'Endless books in flickering candlelight',
    colors: {
      primary: '#2E2418',
      secondary: '#1E180F',
      accent: '#8B7355',
      background: '#0F0C08',
      surface: '#241E14',
      text: '#F0E8D8',
      textMuted: '#A89878',
      glow: '#DEB887'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'studious',
      scent: 'old books and candles',
      sound: 'page turning',
      temperature: 'warm'
    },
    decorations: ['towering bookshelves', 'reading chairs', 'brass ladders', 'ink wells'],
    specialEffects: ['dust motes', 'candle flicker'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'secret-society',
    name: 'Secret Society',
    category: 'dark-academia',
    description: 'Clandestine academic mysteries',
    colors: {
      primary: '#1A1A28',
      secondary: '#0F0F18',
      accent: '#C9B037',
      background: '#08080E',
      surface: '#141420',
      text: '#E8E0F0',
      textMuted: '#9888A8',
      glow: '#FFD700'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'secretive',
      scent: 'leather and secrets',
      sound: 'hushed whispers',
      temperature: 'cool'
    },
    decorations: ['secret symbols', 'hooded robes', 'ancient texts', 'skull motifs'],
    specialEffects: ['hidden passages', 'mysterious glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'poets-garret',
    name: "Poet's Garret",
    category: 'dark-academia',
    description: 'Romantic suffering in the attic room',
    colors: {
      primary: '#3A3028',
      secondary: '#28201A',
      accent: '#A08060',
      background: '#18140F',
      surface: '#302820',
      text: '#F0E8E0',
      textMuted: '#A09080',
      glow: '#D2B48C'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'creative',
      scent: 'ink and wine',
      sound: 'quill scratching',
      temperature: 'cold'
    },
    decorations: ['scattered papers', 'ink bottles', 'worn books', 'dying candles'],
    specialEffects: ['flickering shadows', 'wind through rafters'],
    isHoliday: false,
    season: 'autumn'
  },
  {
    id: 'ancient-archives',
    name: 'Ancient Archives',
    category: 'dark-academia',
    description: 'Forbidden knowledge in dust-covered scrolls',
    colors: {
      primary: '#2A2418',
      secondary: '#1C1810',
      accent: '#8B8000',
      background: '#100E08',
      surface: '#221E14',
      text: '#F0E8D0',
      textMuted: '#A09868',
      glow: '#BDB76B'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mysterious',
      scent: 'ancient parchment',
      sound: 'distant echoes',
      temperature: 'cool'
    },
    decorations: ['scrolls', 'ancient maps', 'astronomical charts', 'hieroglyphics'],
    specialEffects: ['dust clouds', 'aged paper glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'philosophy-hall',
    name: 'Philosophy Hall',
    category: 'dark-academia',
    description: 'Grand debates under vaulted ceilings',
    colors: {
      primary: '#2A2A35',
      secondary: '#1A1A24',
      accent: '#708090',
      background: '#0E0E14',
      surface: '#202028',
      text: '#E8E8F0',
      textMuted: '#9090A0',
      glow: '#B0C4DE'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'contemplative',
      scent: 'stone and wisdom',
      sound: 'echoing discourse',
      temperature: 'cool'
    },
    decorations: ['marble busts', 'columns', 'frescoes', 'lecture podium'],
    specialEffects: ['light through high windows', 'echoing voices'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'alchemist-study',
    name: "Alchemist's Study",
    category: 'dark-academia',
    description: 'Transformation and forbidden experiments',
    colors: {
      primary: '#2A1A28',
      secondary: '#1C0F1A',
      accent: '#B8860B',
      background: '#100810',
      surface: '#221420',
      text: '#F0E8E8',
      textMuted: '#A89090',
      glow: '#FFD700'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'experimental',
      scent: 'sulfur and herbs',
      sound: 'bubbling liquids',
      temperature: 'warm'
    },
    decorations: ['alembics', 'philosopher stone', 'gold transmutation', 'mystic symbols'],
    specialEffects: ['smoke rising', 'glowing liquids'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'music-conservatory',
    name: 'Dark Conservatory',
    category: 'dark-academia',
    description: 'Haunting melodies in the practice rooms',
    colors: {
      primary: '#28201A',
      secondary: '#1A1410',
      accent: '#CD853F',
      background: '#100C08',
      surface: '#201814',
      text: '#F0E8E0',
      textMuted: '#A09080',
      glow: '#DEB887'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'melancholic',
      scent: 'wood polish',
      sound: 'minor key piano',
      temperature: 'cool'
    },
    decorations: ['grand piano', 'violin cases', 'sheet music', 'metronomes'],
    specialEffects: ['music notes floating', 'resonating strings'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'anatomy-theater',
    name: 'Anatomy Theater',
    category: 'dark-academia',
    description: 'Medical studies in the round',
    colors: {
      primary: '#2A2428',
      secondary: '#1A1618',
      accent: '#8B0000',
      background: '#0E0C0D',
      surface: '#201C1E',
      text: '#F0E8EA',
      textMuted: '#A09098',
      glow: '#DC143C'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'clinical',
      scent: 'formaldehyde',
      sound: 'professor lecturing',
      temperature: 'cold'
    },
    decorations: ['anatomical models', 'surgical tools', 'medical texts', 'specimen jars'],
    specialEffects: ['spotlight focus', 'dramatic shadows'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'observatory-night',
    name: 'Observatory Night',
    category: 'dark-academia',
    description: 'Stargazing and cosmic mysteries',
    colors: {
      primary: '#0A0A20',
      secondary: '#050510',
      accent: '#4169E1',
      background: '#020208',
      surface: '#0A0A18',
      text: '#E0E8FF',
      textMuted: '#8090C0',
      glow: '#87CEEB'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'wonder',
      scent: 'night air',
      sound: 'telescope clicking',
      temperature: 'cold'
    },
    decorations: ['brass telescope', 'star charts', 'orrery', 'celestial globe'],
    specialEffects: ['twinkling stars', 'meteor showers'],
    isHoliday: false,
    season: 'winter'
  },
  {
    id: 'dead-languages',
    name: 'Dead Languages Hall',
    category: 'dark-academia',
    description: 'Ancient tongues in forgotten classrooms',
    colors: {
      primary: '#282420',
      secondary: '#1A1814',
      accent: '#8B7355',
      background: '#0E0C0A',
      surface: '#201C18',
      text: '#F0E8E0',
      textMuted: '#A09078',
      glow: '#C4A484'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'scholarly',
      scent: 'chalk and dust',
      sound: 'Latin chanting',
      temperature: 'cool'
    },
    decorations: ['blackboards', 'Latin texts', 'Greek sculptures', 'worn desks'],
    specialEffects: ['chalk dust floating', 'ancient whispers'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== WITCHY (41-50) ====================
  {
    id: 'witchs-cottage',
    name: "Witch's Cottage",
    category: 'witchy',
    description: 'Cozy magical home with herbs and spells',
    colors: {
      primary: '#2A3020',
      secondary: '#1A2014',
      accent: '#6B8E23',
      background: '#0A1008',
      surface: '#1E2818',
      text: '#E8F0E0',
      textMuted: '#90A080',
      glow: '#9ACD32'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'cozy',
      scent: 'herbs and woodsmoke',
      sound: 'bubbling cauldron',
      temperature: 'warm'
    },
    decorations: ['hanging herbs', 'cauldron', 'spell books', 'crystal jars'],
    specialEffects: ['smoke wisps', 'glowing potions'],
    isHoliday: false,
    season: 'autumn'
  },
  {
    id: 'coven-circle',
    name: 'Coven Circle',
    category: 'witchy',
    description: 'Ritual space for gathering witches',
    colors: {
      primary: '#201828',
      secondary: '#140F1A',
      accent: '#8B008B',
      background: '#0A0810',
      surface: '#181220',
      text: '#F0E8F8',
      textMuted: '#9888A8',
      glow: '#DA70D6'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mystical',
      scent: 'sage and moonflower',
      sound: 'chanting voices',
      temperature: 'cool'
    },
    decorations: ['pentagram', 'altar', 'black candles', 'ritual tools'],
    specialEffects: ['circle of light', 'energy swirls'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'potion-lab',
    name: 'Potion Laboratory',
    category: 'witchy',
    description: 'Bubbling brews and magical mixtures',
    colors: {
      primary: '#1A2028',
      secondary: '#0F1418',
      accent: '#00CED1',
      background: '#080A10',
      surface: '#141820',
      text: '#E0F0F8',
      textMuted: '#88A8B8',
      glow: '#40E0D0'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'experimental',
      scent: 'mysterious herbs',
      sound: 'bubbling and hissing',
      temperature: 'warm'
    },
    decorations: ['colored bottles', 'ingredient shelves', 'measuring tools', 'recipe scrolls'],
    specialEffects: ['colorful steam', 'glowing liquids'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'moon-garden',
    name: 'Moon Garden',
    category: 'witchy',
    description: 'Nocturnal plants under silver light',
    colors: {
      primary: '#182028',
      secondary: '#0F1418',
      accent: '#C0C0C0',
      background: '#080A10',
      surface: '#141820',
      text: '#E8F0F8',
      textMuted: '#90A0B0',
      glow: '#F0F8FF'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'serene',
      scent: 'night flowers',
      sound: 'crickets and owls',
      temperature: 'cool'
    },
    decorations: ['moonflowers', 'white roses', 'moon dial', 'silver planters'],
    specialEffects: ['moonbeams', 'flower blooming'],
    isHoliday: false,
    season: 'summer'
  },
  {
    id: 'crystal-sanctum',
    name: 'Crystal Sanctum',
    category: 'witchy',
    description: 'Sacred space filled with healing crystals',
    colors: {
      primary: '#281830',
      secondary: '#1A0F20',
      accent: '#E6E6FA',
      background: '#100818',
      surface: '#201028',
      text: '#F8F0FF',
      textMuted: '#B8A8C8',
      glow: '#DDA0DD'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'healing',
      scent: 'lavender and quartz',
      sound: 'crystal singing',
      temperature: 'cool'
    },
    decorations: ['amethyst clusters', 'clear quartz', 'rose quartz', 'crystal grids'],
    specialEffects: ['prismatic light', 'energy waves'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'familiar-den',
    name: "Familiar's Den",
    category: 'witchy',
    description: 'Home to magical animal companions',
    colors: {
      primary: '#282018',
      secondary: '#1A1410',
      accent: '#FFD700',
      background: '#100C08',
      surface: '#201810',
      text: '#F8F0E0',
      textMuted: '#B8A888',
      glow: '#FFA500'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'cozy',
      scent: 'warm fur',
      sound: 'purring and hooting',
      temperature: 'warm'
    },
    decorations: ['cat beds', 'owl perches', 'toad terrarium', 'feeding bowls'],
    specialEffects: ['glowing eyes', 'magical auras'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'divination-room',
    name: 'Divination Chamber',
    category: 'witchy',
    description: 'Seeing the future in cards and crystals',
    colors: {
      primary: '#201830',
      secondary: '#140F20',
      accent: '#9370DB',
      background: '#0A0818',
      surface: '#181028',
      text: '#F0E8FF',
      textMuted: '#A098C0',
      glow: '#BA55D3'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mysterious',
      scent: 'incense smoke',
      sound: 'soft chimes',
      temperature: 'cool'
    },
    decorations: ['tarot cards', 'crystal ball', 'pendulum', 'tea leaves'],
    specialEffects: ['swirling mists', 'visions appearing'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'hedge-witch',
    name: 'Hedge Witch Hollow',
    category: 'witchy',
    description: 'Folk magic at the edge of the forest',
    colors: {
      primary: '#283020',
      secondary: '#1A2014',
      accent: '#8FBC8F',
      background: '#0A1408',
      surface: '#1E2818',
      text: '#F0F8E8',
      textMuted: '#98B088',
      glow: '#98FB98'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'rustic',
      scent: 'wild herbs',
      sound: 'forest sounds',
      temperature: 'cool'
    },
    decorations: ['dried flowers', 'bone charms', 'woven baskets', 'herbal bundles'],
    specialEffects: ['nature spirits', 'leaf swirls'],
    isHoliday: false,
    season: 'autumn'
  },
  {
    id: 'spell-library',
    name: 'Grimoire Library',
    category: 'witchy',
    description: 'Ancient spell books and magical tomes',
    colors: {
      primary: '#281820',
      secondary: '#1A1014',
      accent: '#8B4513',
      background: '#100808',
      surface: '#201018',
      text: '#F8F0E8',
      textMuted: '#B89888',
      glow: '#D2691E'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'scholarly',
      scent: 'old paper and magic',
      sound: 'whispered spells',
      temperature: 'cool'
    },
    decorations: ['spell books', 'floating quills', 'enchanted locks', 'magical wards'],
    specialEffects: ['glowing runes', 'turning pages'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'sabbat-night',
    name: 'Sabbat Night',
    category: 'witchy',
    description: 'Wild witches gathering under stars',
    colors: {
      primary: '#101020',
      secondary: '#080810',
      accent: '#FF4500',
      background: '#040408',
      surface: '#0C0C18',
      text: '#E8E0F0',
      textMuted: '#9088A0',
      glow: '#FF6347'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'wild',
      scent: 'bonfire smoke',
      sound: 'drums and dancing',
      temperature: 'warm'
    },
    decorations: ['bonfire', 'dancing figures', 'masks', 'offerings'],
    specialEffects: ['sparks rising', 'shadow dancing'],
    isHoliday: false,
    season: 'autumn'
  },

  // ==================== VAMPIRE (51-60) ====================
  {
    id: 'count-castle',
    name: "Count's Castle",
    category: 'vampire',
    description: 'Transylvanian fortress of the undead',
    colors: {
      primary: '#1A0A10',
      secondary: '#100508',
      accent: '#8B0000',
      background: '#080304',
      surface: '#14080C',
      text: '#F8E8EC',
      textMuted: '#C89098',
      glow: '#DC143C'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'ominous',
      scent: 'ancient stone',
      sound: 'wolves howling',
      temperature: 'cold'
    },
    decorations: ['throne', 'ancestral portraits', 'crossed swords', 'bat motifs'],
    specialEffects: ['bat swarms', 'red mist'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'blood-ball',
    name: 'Blood Ball',
    category: 'vampire',
    description: 'Eternal dance of the immortals',
    colors: {
      primary: '#2A0A14',
      secondary: '#1A050A',
      accent: '#FFD700',
      background: '#0D0308',
      surface: '#22080F',
      text: '#FFF8F0',
      textMuted: '#D8A8B0',
      glow: '#FF0000'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'decadent',
      scent: 'champagne and blood',
      sound: 'waltz music',
      temperature: 'cool'
    },
    decorations: ['ballroom', 'chandeliers', 'masked guests', 'blood fountains'],
    specialEffects: ['swirling dancers', 'reflecting mirrors'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'coffin-chamber',
    name: 'Coffin Chamber',
    category: 'vampire',
    description: 'Resting place of the ancient ones',
    colors: {
      primary: '#18080C',
      secondary: '#0F0406',
      accent: '#4A0000',
      background: '#080204',
      surface: '#120608',
      text: '#F0E0E4',
      textMuted: '#B88890',
      glow: '#800000'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'deathly',
      scent: 'earth and roses',
      sound: 'silence and breathing',
      temperature: 'cold'
    },
    decorations: ['ornate coffins', 'wilted roses', 'ancestral soil', 'gothic locks'],
    specialEffects: ['lid opening', 'dust rising'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'feeding-salon',
    name: 'Feeding Salon',
    category: 'vampire',
    description: 'Elegant dining for the undead',
    colors: {
      primary: '#280810',
      secondary: '#180508',
      accent: '#B22222',
      background: '#0C0204',
      surface: '#20080C',
      text: '#F8E8EC',
      textMuted: '#C08890',
      glow: '#CD5C5C'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'seductive',
      scent: 'wine and copper',
      sound: 'soft conversation',
      temperature: 'warm'
    },
    decorations: ['chaise lounges', 'wine glasses', 'silk curtains', 'willing victims'],
    specialEffects: ['pulse glow', 'fading consciousness'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'nosferatu-lair',
    name: "Nosferatu's Lair",
    category: 'vampire',
    description: 'Ancient horror in the shadows',
    colors: {
      primary: '#141414',
      secondary: '#0A0A0A',
      accent: '#3A3A3A',
      background: '#040404',
      surface: '#0E0E0E',
      text: '#D0D0D0',
      textMuted: '#808080',
      glow: '#505050'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'terrifying',
      scent: 'decay and fear',
      sound: 'scratching claws',
      temperature: 'cold'
    },
    decorations: ['rat swarms', 'broken coffins', 'plague imagery', 'elongated shadows'],
    specialEffects: ['creeping shadow', 'glowing eyes'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'vampire-masquerade',
    name: 'Vampire Masquerade',
    category: 'vampire',
    description: 'Hidden identities at the midnight ball',
    colors: {
      primary: '#1A0818',
      secondary: '#100510',
      accent: '#C71585',
      background: '#080308',
      surface: '#14080F',
      text: '#F8E8F4',
      textMuted: '#C088A0',
      glow: '#FF1493'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mysterious',
      scent: 'perfume and secrets',
      sound: 'masked whispers',
      temperature: 'cool'
    },
    decorations: ['ornate masks', 'feathered fans', 'secret alcoves', 'mirrors'],
    specialEffects: ['mask removal', 'identity reveal'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'blood-wine-cellar',
    name: 'Blood Wine Cellar',
    category: 'vampire',
    description: 'Vintage collections of the finest years',
    colors: {
      primary: '#200808',
      secondary: '#140404',
      accent: '#722F37',
      background: '#0A0202',
      surface: '#180606',
      text: '#F0E0E0',
      textMuted: '#B88080',
      glow: '#8B0000'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'refined',
      scent: 'aged wine',
      sound: 'dripping echoes',
      temperature: 'cold'
    },
    decorations: ['wine racks', 'vintage bottles', 'tasting table', 'aged labels'],
    specialEffects: ['swirling wine', 'candlelight reflection'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'daylight-haven',
    name: 'Daylight Haven',
    category: 'vampire',
    description: 'Sun-proofed sanctuary for daytime rest',
    colors: {
      primary: '#181018',
      secondary: '#0F080F',
      accent: '#2F4F4F',
      background: '#080408',
      surface: '#120A12',
      text: '#E8E0E8',
      textMuted: '#988898',
      glow: '#4682B4'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'protective',
      scent: 'cool darkness',
      sound: 'distant daylight',
      temperature: 'cool'
    },
    decorations: ['blackout curtains', 'reinforced doors', 'emergency exits', 'safe room'],
    specialEffects: ['light blocking', 'safe glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'immortal-library',
    name: 'Immortal Library',
    category: 'vampire',
    description: 'Centuries of collected knowledge',
    colors: {
      primary: '#1A1018',
      secondary: '#10080F',
      accent: '#8B4513',
      background: '#080408',
      surface: '#140A12',
      text: '#F0E8EC',
      textMuted: '#A89098',
      glow: '#A0522D'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'eternal',
      scent: 'ancient tomes',
      sound: 'turning pages',
      temperature: 'cool'
    },
    decorations: ['ancient manuscripts', 'historical records', 'blood contracts', 'portraits'],
    specialEffects: ['time passing', 'age layers'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'fledgling-nest',
    name: 'Fledgling Nest',
    category: 'vampire',
    description: 'Training grounds for new vampires',
    colors: {
      primary: '#1A0A0F',
      secondary: '#100508',
      accent: '#FF6B6B',
      background: '#080205',
      surface: '#140809',
      text: '#FFE8EC',
      textMuted: '#D89098',
      glow: '#FF4444'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'learning',
      scent: 'fresh blood',
      sound: 'hungry whispers',
      temperature: 'warm'
    },
    decorations: ['training dummies', 'blood bags', 'mentorship area', 'first hunt trophies'],
    specialEffects: ['red hunger', 'growing power'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== CELESTIAL (61-70) ====================
  {
    id: 'starfall-chamber',
    name: 'Starfall Chamber',
    category: 'celestial',
    description: 'Where fallen stars are collected',
    colors: {
      primary: '#0A0A20',
      secondary: '#050510',
      accent: '#FFD700',
      background: '#020208',
      surface: '#080818',
      text: '#F0F0FF',
      textMuted: '#9090C0',
      glow: '#FFFACD'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'wonder',
      scent: 'cosmic dust',
      sound: 'celestial harmonics',
      temperature: 'cold'
    },
    decorations: ['meteorites', 'star maps', 'astrolabes', 'constellation art'],
    specialEffects: ['falling stars', 'cosmic sparkle'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'lunar-temple',
    name: 'Lunar Temple',
    category: 'celestial',
    description: 'Sacred space for moon worship',
    colors: {
      primary: '#101828',
      secondary: '#080F18',
      accent: '#E6E6FA',
      background: '#040810',
      surface: '#0C1220',
      text: '#F8F8FF',
      textMuted: '#A0A8C0',
      glow: '#F0F8FF'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'reverent',
      scent: 'moonflower',
      sound: 'moon chanting',
      temperature: 'cool'
    },
    decorations: ['moon phases', 'silver altar', 'selenite crystals', 'tidal pools'],
    specialEffects: ['moonrise animation', 'silver glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'void-sanctuary',
    name: 'Void Sanctuary',
    category: 'celestial',
    description: 'Embracing the cosmic darkness',
    colors: {
      primary: '#050510',
      secondary: '#020208',
      accent: '#4B0082',
      background: '#000002',
      surface: '#040408',
      text: '#D8D8F0',
      textMuted: '#6868A0',
      glow: '#8A2BE2'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'infinite',
      scent: 'void essence',
      sound: 'cosmic silence',
      temperature: 'cold'
    },
    decorations: ['black holes', 'void mirrors', 'dark matter', 'event horizons'],
    specialEffects: ['reality warping', 'light bending'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'solar-eclipse',
    name: 'Solar Eclipse Chamber',
    category: 'celestial',
    description: 'Capturing the moment of totality',
    colors: {
      primary: '#0A0A10',
      secondary: '#050508',
      accent: '#FFA500',
      background: '#020204',
      surface: '#08080C',
      text: '#F0F0F8',
      textMuted: '#9090A8',
      glow: '#FFD700'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'awe',
      scent: 'corona fire',
      sound: 'silence then roar',
      temperature: 'cool'
    },
    decorations: ['eclipse viewers', 'sun/moon alignment', 'corona displays', 'totality art'],
    specialEffects: ['diamond ring effect', 'corona glow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'aurora-hall',
    name: 'Aurora Hall',
    category: 'celestial',
    description: 'Northern lights dancing overhead',
    colors: {
      primary: '#0A1820',
      secondary: '#050F14',
      accent: '#00FF7F',
      background: '#020810',
      surface: '#081018',
      text: '#E8F8F0',
      textMuted: '#88C0A8',
      glow: '#7FFFD4'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'magical',
      scent: 'arctic air',
      sound: 'crackling energy',
      temperature: 'cold'
    },
    decorations: ['aurora curtains', 'ice crystals', 'polar imagery', 'magnetic displays'],
    specialEffects: ['dancing lights', 'color waves'],
    isHoliday: false,
    season: 'winter'
  },
  {
    id: 'zodiac-sanctum',
    name: 'Zodiac Sanctum',
    category: 'celestial',
    description: 'The twelve signs in perfect alignment',
    colors: {
      primary: '#181028',
      secondary: '#0F0818',
      accent: '#9932CC',
      background: '#080410',
      surface: '#100820',
      text: '#F0E8FF',
      textMuted: '#A090C8',
      glow: '#BA55D3'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'destined',
      scent: 'star essence',
      sound: 'wheel turning',
      temperature: 'cool'
    },
    decorations: ['zodiac wheel', 'birth charts', 'planetary symbols', 'house divisions'],
    specialEffects: ['sign activation', 'planetary alignment'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'nebula-nursery',
    name: 'Nebula Nursery',
    category: 'celestial',
    description: 'Where new stars are born',
    colors: {
      primary: '#100820',
      secondary: '#080414',
      accent: '#FF69B4',
      background: '#040210',
      surface: '#0C0618',
      text: '#F8E8FF',
      textMuted: '#C090D0',
      glow: '#FFB6C1'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'creative',
      scent: 'stardust',
      sound: 'cosmic heartbeat',
      temperature: 'warm'
    },
    decorations: ['gas clouds', 'proto-stars', 'cosmic nursery', 'stellar cocoons'],
    specialEffects: ['swirling gases', 'star ignition'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'cosmic-ocean',
    name: 'Cosmic Ocean',
    category: 'celestial',
    description: 'Swimming through the stars',
    colors: {
      primary: '#081020',
      secondary: '#040814',
      accent: '#1E90FF',
      background: '#020410',
      surface: '#060C18',
      text: '#E0F0FF',
      textMuted: '#80B0D0',
      glow: '#00BFFF'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'flowing',
      scent: 'cosmic waters',
      sound: 'stellar waves',
      temperature: 'cool'
    },
    decorations: ['star currents', 'cosmic kelp', 'space whales', 'nebula fish'],
    specialEffects: ['floating debris', 'current flow'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'meteor-shower',
    name: 'Meteor Shower Room',
    category: 'celestial',
    description: 'Wish upon a falling star',
    colors: {
      primary: '#0A0A18',
      secondary: '#050510',
      accent: '#F0E68C',
      background: '#020208',
      surface: '#080812',
      text: '#F8F8F0',
      textMuted: '#A0A090',
      glow: '#FFFF00'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'hopeful',
      scent: 'burning trails',
      sound: 'wishes whispered',
      temperature: 'cool'
    },
    decorations: ['viewing platforms', 'wish jars', 'impact craters', 'streak art'],
    specialEffects: ['constant meteors', 'trail glow'],
    isHoliday: false,
    season: 'summer'
  },
  {
    id: 'galactic-throne',
    name: 'Galactic Throne',
    category: 'celestial',
    description: 'Ruling the cosmos from the center',
    colors: {
      primary: '#100818',
      secondary: '#080410',
      accent: '#FFD700',
      background: '#040208',
      surface: '#0C0612',
      text: '#F8F0FF',
      textMuted: '#B0A0C8',
      glow: '#FFC125'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'powerful',
      scent: 'cosmic royalty',
      sound: 'galactic hum',
      temperature: 'cool'
    },
    decorations: ['star throne', 'galaxy crown', 'cosmic scepter', 'universe map'],
    specialEffects: ['galaxy swirl', 'power radiance'],
    isHoliday: false,
    season: 'all'
  },

  // ==================== HOLIDAY THEMES (71-100) ====================

  // Halloween (71-75)
  {
    id: 'halloween-haunting',
    name: 'Halloween Haunting',
    category: 'holiday',
    description: 'Classic spooky Halloween decor',
    colors: {
      primary: '#1A0F0A',
      secondary: '#100805',
      accent: '#FF6600',
      background: '#080402',
      surface: '#140A08',
      text: '#F8F0E8',
      textMuted: '#C0A898',
      glow: '#FF8C00'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'spooky',
      scent: 'pumpkin spice',
      sound: 'creaking doors',
      temperature: 'cool'
    },
    decorations: ['jack-o-lanterns', 'black cats', 'witches hats', 'candy corn'],
    specialEffects: ['ghost floating', 'bat swarms'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'day-of-dead',
    name: 'Día de los Muertos',
    category: 'holiday',
    description: 'Celebrating ancestors with color and love',
    colors: {
      primary: '#1A0820',
      secondary: '#100510',
      accent: '#FF1493',
      background: '#080210',
      surface: '#140818',
      text: '#FFF8F0',
      textMuted: '#D0A8B8',
      glow: '#FF69B4'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'celebratory',
      scent: 'marigolds',
      sound: 'mariachi music',
      temperature: 'warm'
    },
    decorations: ['sugar skulls', 'marigolds', 'ofrendas', 'papel picado'],
    specialEffects: ['floating petals', 'candle procession'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'samhain-sacred',
    name: 'Sacred Samhain',
    category: 'holiday',
    description: 'Ancient Celtic new year celebration',
    colors: {
      primary: '#201810',
      secondary: '#140F08',
      accent: '#CD853F',
      background: '#0A0804',
      surface: '#181208',
      text: '#F8F0E0',
      textMuted: '#B8A888',
      glow: '#DAA520'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'sacred',
      scent: 'apple and oak',
      sound: 'ancient drums',
      temperature: 'cool'
    },
    decorations: ['ancestor altar', 'carved turnips', 'harvest symbols', 'veil imagery'],
    specialEffects: ['veil thinning', 'spirit passage'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'haunted-harvest',
    name: 'Haunted Harvest',
    category: 'holiday',
    description: 'Spooky autumn harvest festival',
    colors: {
      primary: '#2A1808',
      secondary: '#1A1004',
      accent: '#B8860B',
      background: '#0E0802',
      surface: '#221406',
      text: '#FFF8E8',
      textMuted: '#C8A878',
      glow: '#CD853F'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'festive',
      scent: 'autumn leaves',
      sound: 'harvest music',
      temperature: 'cool'
    },
    decorations: ['corn stalks', 'hay bales', 'scarecrows', 'harvest moon'],
    specialEffects: ['falling leaves', 'crow flight'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'witches-night',
    name: "Witches' Night",
    category: 'holiday',
    description: 'All Hallows Eve for the magical',
    colors: {
      primary: '#181020',
      secondary: '#0F0814',
      accent: '#9932CC',
      background: '#080410',
      surface: '#120A18',
      text: '#F8F0FF',
      textMuted: '#B098C0',
      glow: '#BA55D3'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'magical',
      scent: 'witch hazel',
      sound: 'cackling',
      temperature: 'cold'
    },
    decorations: ['broomsticks', 'cauldrons', 'black hats', 'spell ingredients'],
    specialEffects: ['flying silhouettes', 'potion bubbles'],
    isHoliday: true,
    season: 'autumn'
  },

  // Winter Holidays (76-85)
  {
    id: 'gothic-christmas',
    name: 'Gothic Christmas',
    category: 'holiday',
    description: 'Dark elegance meets holiday cheer',
    colors: {
      primary: '#1A0808',
      secondary: '#100404',
      accent: '#8B0000',
      background: '#080202',
      surface: '#140606',
      text: '#F8F0F0',
      textMuted: '#C09898',
      glow: '#DC143C'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'festive',
      scent: 'pine and cinnamon',
      sound: 'dark carols',
      temperature: 'warm'
    },
    decorations: ['black christmas tree', 'dark ornaments', 'skull baubles', 'red ribbons'],
    specialEffects: ['snow falling', 'ornament glow'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'yule-celebration',
    name: 'Yule Celebration',
    category: 'holiday',
    description: 'Winter solstice in pagan tradition',
    colors: {
      primary: '#1A2010',
      secondary: '#101408',
      accent: '#228B22',
      background: '#080A04',
      surface: '#14180A',
      text: '#F0F8E8',
      textMuted: '#98B080',
      glow: '#32CD32'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'sacred',
      scent: 'evergreen and oak',
      sound: 'yule songs',
      temperature: 'warm'
    },
    decorations: ['yule log', 'holly', 'evergreen boughs', 'sun wheel'],
    specialEffects: ['log burning', 'sun return'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'krampus-night',
    name: 'Krampusnacht',
    category: 'holiday',
    description: 'The dark companion of St. Nicholas',
    colors: {
      primary: '#1A0808',
      secondary: '#100404',
      accent: '#B22222',
      background: '#080202',
      surface: '#140606',
      text: '#F8E8E8',
      textMuted: '#C08888',
      glow: '#FF0000'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'fearsome',
      scent: 'sulfur and birch',
      sound: 'chains rattling',
      temperature: 'cold'
    },
    decorations: ['krampus masks', 'birch switches', 'chains', 'dark stockings'],
    specialEffects: ['shadow beast', 'fire breath'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'new-years-midnight',
    name: "New Year's Midnight",
    category: 'holiday',
    description: 'Gothic celebration of the new year',
    colors: {
      primary: '#0A0A18',
      secondary: '#05050F',
      accent: '#FFD700',
      background: '#020208',
      surface: '#080810',
      text: '#F8F8FF',
      textMuted: '#A0A0C0',
      glow: '#FFFF00'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'celebratory',
      scent: 'champagne',
      sound: 'clock chiming',
      temperature: 'cool'
    },
    decorations: ['grandfather clock', 'champagne towers', 'masks', 'confetti'],
    specialEffects: ['countdown', 'fireworks'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'winter-solstice',
    name: 'Winter Solstice',
    category: 'holiday',
    description: 'The longest night, the return of light',
    colors: {
      primary: '#0A1020',
      secondary: '#050814',
      accent: '#87CEEB',
      background: '#020410',
      surface: '#080C18',
      text: '#E8F0FF',
      textMuted: '#88A8C8',
      glow: '#ADD8E6'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'contemplative',
      scent: 'frost and pine',
      sound: 'winter silence',
      temperature: 'cold'
    },
    decorations: ['ice crystals', 'evergreen', 'candle spiral', 'sun symbols'],
    specialEffects: ['ice forming', 'dawn breaking'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'victorian-christmas',
    name: 'Victorian Christmas',
    category: 'holiday',
    description: 'A Christmas Carol aesthetic',
    colors: {
      primary: '#2A1810',
      secondary: '#1A1008',
      accent: '#B8860B',
      background: '#100804',
      surface: '#221408',
      text: '#FFF8E8',
      textMuted: '#C8A888',
      glow: '#FFD700'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'nostalgic',
      scent: 'plum pudding',
      sound: 'carolers',
      temperature: 'warm'
    },
    decorations: ['tinsel', 'glass ornaments', 'paper chains', 'oranges with cloves'],
    specialEffects: ['ghost visitations', 'snow globe'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'frost-faerie',
    name: 'Frost Faerie Winter',
    category: 'holiday',
    description: 'Magical winter wonderland with ice sprites',
    colors: {
      primary: '#E8F0FF',
      secondary: '#C8D8F0',
      accent: '#00CED1',
      background: '#F0F8FF',
      surface: '#FFFFFF',
      text: '#1A2840',
      textMuted: '#5A7090',
      glow: '#7FFFD4'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'magical',
      scent: 'ice and mint',
      sound: 'tinkling bells',
      temperature: 'cold'
    },
    decorations: ['ice sculptures', 'snowflakes', 'crystal formations', 'frost patterns'],
    specialEffects: ['snowfall', 'ice sparkle'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'nutcracker-nightmare',
    name: 'Nutcracker Nightmare',
    category: 'holiday',
    description: 'Dark twist on the holiday ballet',
    colors: {
      primary: '#2A1020',
      secondary: '#1A0814',
      accent: '#C71585',
      background: '#100408',
      surface: '#220A18',
      text: '#FFF0F8',
      textMuted: '#D090B0',
      glow: '#FF1493'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'surreal',
      scent: 'sugar and darkness',
      sound: 'music box waltz',
      temperature: 'cool'
    },
    decorations: ['sinister nutcrackers', 'mouse king', 'dark sugarplums', 'twisted trees'],
    specialEffects: ['growing shrinking', 'toy animation'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'epiphany-dark',
    name: 'Dark Epiphany',
    category: 'holiday',
    description: 'Three kings in the shadow',
    colors: {
      primary: '#201818',
      secondary: '#141010',
      accent: '#B8860B',
      background: '#0A0808',
      surface: '#181010',
      text: '#F8F0E8',
      textMuted: '#B09888',
      glow: '#DAA520'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'mystical',
      scent: 'frankincense and myrrh',
      sound: 'camel bells',
      temperature: 'cool'
    },
    decorations: ['three crowns', 'star of wonder', 'gift boxes', 'desert imagery'],
    specialEffects: ['guiding star', 'gift glow'],
    isHoliday: true,
    season: 'winter'
  },
  {
    id: 'imbolc-awakening',
    name: 'Imbolc Awakening',
    category: 'holiday',
    description: 'First stirrings of spring in winter',
    colors: {
      primary: '#F8F8F0',
      secondary: '#E8E8E0',
      accent: '#90EE90',
      background: '#FFFFF0',
      surface: '#FFFFFF',
      text: '#2A3020',
      textMuted: '#6A7060',
      glow: '#98FB98'
    },
    ambiance: {
      lighting: 'dawn',
      mood: 'hopeful',
      scent: 'snowdrops',
      sound: 'ice melting',
      temperature: 'cool'
    },
    decorations: ['white candles', 'Brigid crosses', 'snowdrops', 'milk bowls'],
    specialEffects: ['ice thaw', 'first green'],
    isHoliday: true,
    season: 'winter'
  },

  // Spring Holidays (86-90)
  {
    id: 'ostara-equinox',
    name: 'Ostara Equinox',
    category: 'holiday',
    description: 'Spring equinox with gothic touches',
    colors: {
      primary: '#1A2018',
      secondary: '#101410',
      accent: '#98FB98',
      background: '#080A08',
      surface: '#141810',
      text: '#F0F8F0',
      textMuted: '#90B090',
      glow: '#00FF7F'
    },
    ambiance: {
      lighting: 'dawn',
      mood: 'renewed',
      scent: 'spring flowers',
      sound: 'birdsong',
      temperature: 'cool'
    },
    decorations: ['dark eggs', 'spring hares', 'balance scales', 'new growth'],
    specialEffects: ['blooming', 'light balance'],
    isHoliday: true,
    season: 'spring'
  },
  {
    id: 'gothic-easter',
    name: 'Gothic Easter',
    category: 'holiday',
    description: 'Resurrection themes with dark aesthetics',
    colors: {
      primary: '#201820',
      secondary: '#141014',
      accent: '#DDA0DD',
      background: '#0A080A',
      surface: '#181018',
      text: '#F8F0F8',
      textMuted: '#B098B0',
      glow: '#DA70D6'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'transcendent',
      scent: 'lilies',
      sound: 'cathedral bells',
      temperature: 'cool'
    },
    decorations: ['dark lilies', 'thorned crowns', 'resurrection imagery', 'black eggs'],
    specialEffects: ['rising light', 'veil lifting'],
    isHoliday: true,
    season: 'spring'
  },
  {
    id: 'beltane-fire',
    name: 'Beltane Fire Festival',
    category: 'holiday',
    description: 'May Day celebration with passionate flames',
    colors: {
      primary: '#2A1008',
      secondary: '#1A0804',
      accent: '#FF4500',
      background: '#100402',
      surface: '#220A06',
      text: '#FFF8F0',
      textMuted: '#D0A090',
      glow: '#FF6347'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'passionate',
      scent: 'hawthorn',
      sound: 'drums and dancing',
      temperature: 'warm'
    },
    decorations: ['maypole', 'flower crowns', 'bonfires', 'green man'],
    specialEffects: ['leaping flames', 'ribbon dance'],
    isHoliday: true,
    season: 'spring'
  },
  {
    id: 'walpurgis-night',
    name: 'Walpurgisnacht',
    category: 'holiday',
    description: 'Night of witches gathering',
    colors: {
      primary: '#180820',
      secondary: '#100418',
      accent: '#9400D3',
      background: '#080210',
      surface: '#120618',
      text: '#F8E8FF',
      textMuted: '#B890D0',
      glow: '#8B00FF'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'wild',
      scent: 'broom flower',
      sound: 'revelry',
      temperature: 'cool'
    },
    decorations: ['broom stacks', 'witch gatherings', 'mountain peaks', 'devil masks'],
    specialEffects: ['flying figures', 'wild dance'],
    isHoliday: true,
    season: 'spring'
  },
  {
    id: 'mothers-memorial',
    name: "Mother's Memorial",
    category: 'holiday',
    description: 'Gothic tribute to mothers past and present',
    colors: {
      primary: '#201820',
      secondary: '#141014',
      accent: '#FF69B4',
      background: '#0A080A',
      surface: '#181018',
      text: '#FFF8F8',
      textMuted: '#C098A0',
      glow: '#FFB6C1'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'loving',
      scent: 'carnations',
      sound: 'lullabies',
      temperature: 'warm'
    },
    decorations: ['mourning jewelry', 'mother portraits', 'dark flowers', 'memory boxes'],
    specialEffects: ['loving glow', 'memory wisps'],
    isHoliday: true,
    season: 'spring'
  },

  // Summer Holidays (91-95)
  {
    id: 'litha-solstice',
    name: 'Litha Solstice',
    category: 'holiday',
    description: 'Midsummer celebration at peak power',
    colors: {
      primary: '#2A2008',
      secondary: '#1A1404',
      accent: '#FFD700',
      background: '#100A02',
      surface: '#221806',
      text: '#FFFFF0',
      textMuted: '#D0C088',
      glow: '#FFFF00'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'powerful',
      scent: 'sunflowers',
      sound: 'summer drums',
      temperature: 'warm'
    },
    decorations: ['sun wheels', 'bonfires', 'summer flowers', 'faerie doors'],
    specialEffects: ['sun power', 'golden hour eternal'],
    isHoliday: true,
    season: 'summer'
  },
  {
    id: 'gothic-fourth',
    name: 'Gothic Independence',
    category: 'holiday',
    description: 'Dark patriotic celebration',
    colors: {
      primary: '#1A0A18',
      secondary: '#100510',
      accent: '#FF0000',
      background: '#080208',
      surface: '#140610',
      text: '#F8F8FF',
      textMuted: '#A8A8C0',
      glow: '#FF4444'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'celebratory',
      scent: 'gunpowder',
      sound: 'explosions',
      temperature: 'warm'
    },
    decorations: ['dark flags', 'skull eagles', 'black sparklers', 'gothic americana'],
    specialEffects: ['dark fireworks', 'smoke clouds'],
    isHoliday: true,
    season: 'summer'
  },
  {
    id: 'lammas-harvest',
    name: 'Lammas First Harvest',
    category: 'holiday',
    description: 'First harvest celebration',
    colors: {
      primary: '#2A2010',
      secondary: '#1A1408',
      accent: '#DAA520',
      background: '#100A04',
      surface: '#221808',
      text: '#FFF8E0',
      textMuted: '#C0A878',
      glow: '#FFD700'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'grateful',
      scent: 'fresh bread',
      sound: 'harvest songs',
      temperature: 'warm'
    },
    decorations: ['wheat sheaves', 'bread loaves', 'corn dollies', 'first fruits'],
    specialEffects: ['grain falling', 'abundance glow'],
    isHoliday: true,
    season: 'summer'
  },
  {
    id: 'gothic-beach',
    name: 'Gothic Beach Day',
    category: 'holiday',
    description: 'Dark summer by the sea',
    colors: {
      primary: '#0A1820',
      secondary: '#050F14',
      accent: '#20B2AA',
      background: '#020810',
      surface: '#081018',
      text: '#F0F8FF',
      textMuted: '#88B0C0',
      glow: '#40E0D0'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'mysterious',
      scent: 'sea salt',
      sound: 'crashing waves',
      temperature: 'cool'
    },
    decorations: ['black umbrellas', 'skull shells', 'dark tide pools', 'moonlit waves'],
    specialEffects: ['wave motion', 'phosphorescence'],
    isHoliday: true,
    season: 'summer'
  },
  {
    id: 'summer-storms',
    name: 'Summer Storm Chamber',
    category: 'holiday',
    description: 'Power of summer thunderstorms',
    colors: {
      primary: '#141820',
      secondary: '#0A1018',
      accent: '#4169E1',
      background: '#040810',
      surface: '#0C1018',
      text: '#E8F0FF',
      textMuted: '#88A0C8',
      glow: '#00BFFF'
    },
    ambiance: {
      lighting: 'storm',
      mood: 'electric',
      scent: 'ozone',
      sound: 'thunder rolling',
      temperature: 'cool'
    },
    decorations: ['lightning rods', 'storm clouds', 'rain curtains', 'thunder drums'],
    specialEffects: ['lightning strikes', 'rain sheets'],
    isHoliday: true,
    season: 'summer'
  },

  // Autumn Holidays (96-100)
  {
    id: 'mabon-equinox',
    name: 'Mabon Equinox',
    category: 'holiday',
    description: 'Autumn equinox balance celebration',
    colors: {
      primary: '#2A1810',
      secondary: '#1A1008',
      accent: '#CD853F',
      background: '#100804',
      surface: '#221408',
      text: '#FFF8E8',
      textMuted: '#C0A080',
      glow: '#D2691E'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'balanced',
      scent: 'apple cider',
      sound: 'falling leaves',
      temperature: 'cool'
    },
    decorations: ['cornucopia', 'autumn leaves', 'balance scales', 'wine grapes'],
    specialEffects: ['leaf fall', 'light balance'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'gothic-thanksgiving',
    name: 'Gothic Thanksgiving',
    category: 'holiday',
    description: 'Dark gratitude feast',
    colors: {
      primary: '#281810',
      secondary: '#181008',
      accent: '#8B4513',
      background: '#0E0804',
      surface: '#201008',
      text: '#FFF0E8',
      textMuted: '#C09880',
      glow: '#A0522D'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'grateful',
      scent: 'roasting feast',
      sound: 'family gathering',
      temperature: 'warm'
    },
    decorations: ['dark turkey', 'black candles', 'autumn arrangements', 'gothic table'],
    specialEffects: ['feast steam', 'warm glow'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'blood-moon-harvest',
    name: 'Blood Moon Harvest',
    category: 'holiday',
    description: 'Harvest under the blood moon',
    colors: {
      primary: '#2A0810',
      secondary: '#1A0408',
      accent: '#B22222',
      background: '#100204',
      surface: '#22060A',
      text: '#FFE8EC',
      textMuted: '#C88898',
      glow: '#DC143C'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'primal',
      scent: 'earth and blood',
      sound: 'wolf howls',
      temperature: 'cold'
    },
    decorations: ['blood moon imagery', 'harvest scythes', 'red offerings', 'wolf totems'],
    specialEffects: ['red moonlight', 'wolf shadows'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'ancestor-night',
    name: 'Ancestor Night',
    category: 'holiday',
    description: 'Honoring those who came before',
    colors: {
      primary: '#181820',
      secondary: '#101018',
      accent: '#9370DB',
      background: '#080810',
      surface: '#121218',
      text: '#F8F8FF',
      textMuted: '#A0A0C0',
      glow: '#BA55D3'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'reverent',
      scent: 'memorial flowers',
      sound: 'ancestral whispers',
      temperature: 'cold'
    },
    decorations: ['ancestor altar', 'family photos', 'memorial candles', 'heirloom items'],
    specialEffects: ['spirit presence', 'veil thinning'],
    isHoliday: true,
    season: 'autumn'
  },
  {
    id: 'dark-harvest-moon',
    name: 'Dark Harvest Moon',
    category: 'holiday',
    description: 'Final harvest under the full moon',
    colors: {
      primary: '#201810',
      secondary: '#141008',
      accent: '#FFA500',
      background: '#0A0804',
      surface: '#181008',
      text: '#FFF8F0',
      textMuted: '#C8B090',
      glow: '#FF8C00'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'completion',
      scent: 'harvest fields',
      sound: 'night crickets',
      temperature: 'cool'
    },
    decorations: ['harvest moon', 'gathered crops', 'storage preparations', 'gratitude offerings'],
    specialEffects: ['orange moonrise', 'firefly dance'],
    isHoliday: true,
    season: 'autumn'
  },

  // Additional Luxury Themes (101-115)
  {
    id: 'versailles-midnight',
    name: 'Versailles at Midnight',
    category: 'royal',
    description: 'French palace luxury in darkness',
    colors: {
      primary: '#1A1828',
      secondary: '#0F1018',
      accent: '#FFD700',
      background: '#080810',
      surface: '#141220',
      text: '#FFF8F0',
      textMuted: '#C8C0A8',
      glow: '#FFE066'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'opulent',
      scent: 'perfumed court',
      sound: 'baroque music',
      temperature: 'warm'
    },
    decorations: ['gilded mirrors', 'chandeliers', 'velvet thrones', 'marble columns'],
    specialEffects: ['mirror reflections', 'golden sparkle'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'black-diamond',
    name: 'Black Diamond Suite',
    category: 'royal',
    description: 'Ultimate luxury in obsidian and gems',
    colors: {
      primary: '#0A0A0E',
      secondary: '#050508',
      accent: '#E8E8F0',
      background: '#020204',
      surface: '#080808',
      text: '#F8F8F8',
      textMuted: '#A0A0A0',
      glow: '#FFFFFF'
    },
    ambiance: {
      lighting: 'starlight',
      mood: 'exclusive',
      scent: 'black orchid',
      sound: 'crystal silence',
      temperature: 'cool'
    },
    decorations: ['black diamonds', 'crystal displays', 'obsidian surfaces', 'platinum accents'],
    specialEffects: ['diamond sparkle', 'light refraction'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'venetian-masque',
    name: 'Venetian Masquerade',
    category: 'baroque',
    description: 'Venice carnival in gothic splendor',
    colors: {
      primary: '#201828',
      secondary: '#14101C',
      accent: '#E6BE8A',
      background: '#0A0810',
      surface: '#181020',
      text: '#FFF8F0',
      textMuted: '#C8B8A0',
      glow: '#DAA520'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'mysterious',
      scent: 'venetian perfume',
      sound: 'carnival music',
      temperature: 'cool'
    },
    decorations: ['elaborate masks', 'feathered fans', 'carnival costumes', 'canal imagery'],
    specialEffects: ['mask reveals', 'gondola movement'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'art-nouveau-darkness',
    name: 'Art Nouveau Darkness',
    category: 'art-nouveau',
    description: 'Flowing organic forms in shadow',
    colors: {
      primary: '#1A2020',
      secondary: '#101414',
      accent: '#2E8B57',
      background: '#080A0A',
      surface: '#141818',
      text: '#F0F8F8',
      textMuted: '#90B0A8',
      glow: '#3CB371'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'organic',
      scent: 'lily and absinthe',
      sound: 'art salon',
      temperature: 'cool'
    },
    decorations: ['flowing lines', 'nature motifs', 'stained glass', 'organic shapes'],
    specialEffects: ['flowing forms', 'natural movement'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'steampunk-manor',
    name: 'Steampunk Manor',
    category: 'steampunk',
    description: 'Victorian meets industrial revolution',
    colors: {
      primary: '#28201A',
      secondary: '#1A1410',
      accent: '#B87333',
      background: '#100C08',
      surface: '#201810',
      text: '#F8F0E0',
      textMuted: '#B8A080',
      glow: '#CD7F32'
    },
    ambiance: {
      lighting: 'firelight',
      mood: 'inventive',
      scent: 'steam and oil',
      sound: 'gear turning',
      temperature: 'warm'
    },
    decorations: ['brass gears', 'steam pipes', 'clockwork', 'goggles'],
    specialEffects: ['steam bursts', 'gear rotation'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gothic-spa',
    name: 'Gothic Spa Retreat',
    category: 'nature-gothic',
    description: 'Dark relaxation sanctuary',
    colors: {
      primary: '#18201E',
      secondary: '#101414',
      accent: '#4682B4',
      background: '#080A0A',
      surface: '#141818',
      text: '#F0F8F8',
      textMuted: '#90A8A8',
      glow: '#5F9EA0'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'serene',
      scent: 'eucalyptus and stone',
      sound: 'water flowing',
      temperature: 'warm'
    },
    decorations: ['dark pools', 'volcanic stone', 'bamboo screens', 'meditation altars'],
    specialEffects: ['steam rising', 'water ripples'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'phantom-opera',
    name: 'Phantom Opera House',
    category: 'romantic-gothic',
    description: 'Underground lair beneath the stage',
    colors: {
      primary: '#1A1018',
      secondary: '#100810',
      accent: '#B8860B',
      background: '#080408',
      surface: '#140A10',
      text: '#FFF8F0',
      textMuted: '#C8A8A0',
      glow: '#DAA520'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'dramatic',
      scent: 'roses and lake',
      sound: 'opera singing',
      temperature: 'cool'
    },
    decorations: ['opera masks', 'candelabras', 'underground lake', 'red curtains'],
    specialEffects: ['chandelier fall', 'mask reveal'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'dark-fairytale',
    name: 'Dark Fairytale',
    category: 'mystical',
    description: 'Brothers Grimm aesthetic',
    colors: {
      primary: '#1A1820',
      secondary: '#101018',
      accent: '#9ACD32',
      background: '#080810',
      surface: '#141418',
      text: '#F8F8F0',
      textMuted: '#A8A890',
      glow: '#ADFF2F'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'enchanted',
      scent: 'forest and magic',
      sound: 'enchanted whispers',
      temperature: 'cool'
    },
    decorations: ['spinning wheels', 'poison apples', 'enchanted mirrors', 'thorny vines'],
    specialEffects: ['magic sparkles', 'transformation'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gothic-bordello',
    name: 'Gothic Bordello',
    category: 'romantic-gothic',
    description: 'Victorian red light luxury',
    colors: {
      primary: '#2A0818',
      secondary: '#1A0410',
      accent: '#DC143C',
      background: '#100208',
      surface: '#220610',
      text: '#FFF0F4',
      textMuted: '#D08898',
      glow: '#FF1493'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'seductive',
      scent: 'perfume and sin',
      sound: 'jazz piano',
      temperature: 'warm'
    },
    decorations: ['red velvet', 'gilt mirrors', 'fainting couches', 'beaded curtains'],
    specialEffects: ['candle flicker', 'curtain sway'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'haunted-ballroom',
    name: 'Haunted Ballroom',
    category: 'classic-gothic',
    description: 'Eternal dance of the dead',
    colors: {
      primary: '#E0E0E8',
      secondary: '#C0C0D0',
      accent: '#B8B8C8',
      background: '#F0F0F8',
      surface: '#FFFFFF',
      text: '#2A2A40',
      textMuted: '#6A6A88',
      glow: '#E8E8FF'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'haunting',
      scent: 'ancient perfume',
      sound: 'ghostly waltz',
      temperature: 'cold'
    },
    decorations: ['transparent dancers', 'dusty chandeliers', 'faded grandeur', 'old programs'],
    specialEffects: ['ghost dancers', 'time loop'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'underground-kingdom',
    name: 'Underground Kingdom',
    category: 'mystical',
    description: 'Subterranean gothic realm',
    colors: {
      primary: '#1A1A28',
      secondary: '#101018',
      accent: '#00CED1',
      background: '#08080E',
      surface: '#141420',
      text: '#E8E8F8',
      textMuted: '#9090B0',
      glow: '#40E0D0'
    },
    ambiance: {
      lighting: 'ethereal',
      mood: 'otherworldly',
      scent: 'mineral and water',
      sound: 'underground echoes',
      temperature: 'cool'
    },
    decorations: ['crystal formations', 'underground pools', 'phosphorescent fungi', 'cave thrones'],
    specialEffects: ['crystal glow', 'dripping water'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'gothic-greenhouse',
    name: 'Gothic Greenhouse',
    category: 'nature-gothic',
    description: 'Victorian conservatory of dark plants',
    colors: {
      primary: '#182018',
      secondary: '#101410',
      accent: '#228B22',
      background: '#080A08',
      surface: '#141814',
      text: '#F0F8F0',
      textMuted: '#90A890',
      glow: '#32CD32'
    },
    ambiance: {
      lighting: 'twilight',
      mood: 'verdant',
      scent: 'exotic blooms',
      sound: 'dripping water',
      temperature: 'warm'
    },
    decorations: ['carnivorous plants', 'black roses', 'iron framework', 'misting systems'],
    specialEffects: ['plant movement', 'mist clouds'],
    isHoliday: false,
    season: 'spring'
  },
  {
    id: 'absinthe-salon',
    name: 'Absinthe Salon',
    category: 'victorian',
    description: 'Green fairy aesthetic',
    colors: {
      primary: '#102018',
      secondary: '#081410',
      accent: '#00FF00',
      background: '#040A08',
      surface: '#0C1810',
      text: '#E8FFE8',
      textMuted: '#88C888',
      glow: '#7FFF00'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'intoxicating',
      scent: 'wormwood',
      sound: 'cafe murmurs',
      temperature: 'warm'
    },
    decorations: ['absinthe fountains', 'sugar spoons', 'green bottles', 'art posters'],
    specialEffects: ['louche effect', 'fairy visions'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'clocktower-midnight',
    name: 'Clocktower at Midnight',
    category: 'steampunk',
    description: 'Gothic clockwork reaches midnight',
    colors: {
      primary: '#1A1820',
      secondary: '#101018',
      accent: '#B87333',
      background: '#080810',
      surface: '#141218',
      text: '#F8F0E8',
      textMuted: '#B8A8A0',
      glow: '#CD7F32'
    },
    ambiance: {
      lighting: 'moonlight',
      mood: 'timeless',
      scent: 'metal and oil',
      sound: 'clock chiming',
      temperature: 'cool'
    },
    decorations: ['massive gears', 'clock faces', 'pendulums', 'bell mechanisms'],
    specialEffects: ['midnight strike', 'gear rotation'],
    isHoliday: false,
    season: 'all'
  },
  {
    id: 'ravens-court',
    name: "Raven's Court",
    category: 'royal',
    description: 'Dark monarchy aesthetic',
    colors: {
      primary: '#141418',
      secondary: '#0A0A10',
      accent: '#4B0082',
      background: '#040408',
      surface: '#0E0E12',
      text: '#F0F0F8',
      textMuted: '#9090A8',
      glow: '#8B008B'
    },
    ambiance: {
      lighting: 'candlelight',
      mood: 'regal',
      scent: 'dark incense',
      sound: 'court music',
      temperature: 'cool'
    },
    decorations: ['raven throne', 'black crown', 'royal banners', 'court jesters'],
    specialEffects: ['feather fall', 'crown glow'],
    isHoliday: false,
    season: 'all'
  }
];

// Category metadata
export const THEME_CATEGORIES: Record<ThemeCategory, { name: string; icon: string; description: string }> = {
  'classic-gothic': { name: 'Classic Gothic', icon: '🏰', description: 'Traditional gothic aesthetics' },
  'victorian': { name: 'Victorian', icon: '🎩', description: '19th century elegance' },
  'romantic-gothic': { name: 'Romantic Gothic', icon: '🥀', description: 'Dark romance and passion' },
  'dark-academia': { name: 'Dark Academia', icon: '📚', description: 'Scholarly darkness' },
  'witchy': { name: 'Witchy', icon: '🧙‍♀️', description: 'Magical and mystical' },
  'vampire': { name: 'Vampire', icon: '🧛', description: 'Immortal elegance' },
  'celestial': { name: 'Celestial', icon: '✨', description: 'Cosmic wonder' },
  'nature-gothic': { name: 'Nature Gothic', icon: '🌿', description: 'Dark natural beauty' },
  'royal': { name: 'Royal', icon: '👑', description: 'Regal luxury' },
  'holiday': { name: 'Holiday', icon: '🎃', description: 'Seasonal celebrations' },
  'seasonal': { name: 'Seasonal', icon: '🍂', description: 'Time of year themes' },
  'mystical': { name: 'Mystical', icon: '🔮', description: 'Otherworldly magic' },
  'steampunk': { name: 'Steampunk', icon: '⚙️', description: 'Victorian technology' },
  'art-nouveau': { name: 'Art Nouveau', icon: '🎨', description: 'Organic elegance' },
  'baroque': { name: 'Baroque', icon: '🎭', description: 'Ornate grandeur' }
};

// Helper functions
export function getThemesByCategory(category: ThemeCategory): GothicTheme[] {
  return GOTHIC_THEMES.filter(theme => theme.category === category);
}

export function getHolidayThemes(): GothicTheme[] {
  return GOTHIC_THEMES.filter(theme => theme.isHoliday);
}

export function getSeasonalThemes(season: 'spring' | 'summer' | 'autumn' | 'winter'): GothicTheme[] {
  return GOTHIC_THEMES.filter(theme => theme.season === season || theme.season === 'all');
}

export function getRandomTheme(): GothicTheme {
  return GOTHIC_THEMES[Math.floor(Math.random() * GOTHIC_THEMES.length)];
}

export function searchThemes(query: string): GothicTheme[] {
  const lowerQuery = query.toLowerCase();
  return GOTHIC_THEMES.filter(theme =>
    theme.name.toLowerCase().includes(lowerQuery) ||
    theme.description.toLowerCase().includes(lowerQuery) ||
    theme.decorations.some(d => d.toLowerCase().includes(lowerQuery))
  );
}

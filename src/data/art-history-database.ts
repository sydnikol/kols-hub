/**
 * COMPREHENSIVE ART & HISTORY DATABASE
 * =====================================
 * Art movements, artists, historical periods, figures, and cultural knowledge
 * For Sydney's AI Teacher integration
 */

// ===== HISTORICAL PERIODS =====
export interface HistoricalPeriod {
  id: string;
  name: string;
  timeframe: string;
  startYear: number;
  endYear: number;
  region: string;
  description: string;
  keyEvents: { year: number; event: string }[];
  characteristics: string[];
  keyFigures: string[];
  culturalAchievements: string[];
  tags: string[];
}

export const HISTORICAL_PERIODS: HistoricalPeriod[] = [
  {
    id: 'period-001',
    name: 'Ancient Egypt',
    timeframe: '3100 BCE - 30 BCE',
    startYear: -3100,
    endYear: -30,
    region: 'North Africa',
    description: 'One of the longest-lasting civilizations, known for pyramids, hieroglyphics, and complex religion',
    keyEvents: [
      { year: -3100, event: 'Unification of Upper and Lower Egypt under Narmer' },
      { year: -2560, event: 'Great Pyramid of Giza constructed' },
      { year: -1332, event: 'Reign of Tutankhamun begins' },
      { year: -30, event: 'Death of Cleopatra, Roman annexation' }
    ],
    characteristics: ['Divine kingship', 'Monumental architecture', 'Complex afterlife beliefs', 'Hieroglyphic writing'],
    keyFigures: ['Ramesses II', 'Cleopatra VII', 'Tutankhamun', 'Hatshepsut', 'Nefertiti'],
    culturalAchievements: ['Pyramids', 'Mummification', 'Papyrus writing', 'Medicine', 'Mathematics'],
    tags: ['ancient', 'africa', 'pyramids', 'pharaohs']
  },
  {
    id: 'period-002',
    name: 'Classical Greece',
    timeframe: '500 BCE - 323 BCE',
    startYear: -500,
    endYear: -323,
    region: 'Mediterranean',
    description: 'Birth of democracy, philosophy, and Western art traditions',
    keyEvents: [
      { year: -490, event: 'Battle of Marathon - Persian Wars' },
      { year: -461, event: 'Age of Pericles begins in Athens' },
      { year: -399, event: 'Trial and execution of Socrates' },
      { year: -323, event: 'Death of Alexander the Great' }
    ],
    characteristics: ['Democracy', 'Philosophy', 'Olympic Games', 'Theatre', 'Rationalism'],
    keyFigures: ['Socrates', 'Plato', 'Aristotle', 'Alexander the Great', 'Pericles', 'Homer'],
    culturalAchievements: ['Philosophy', 'Democracy', 'Theatre', 'Sculpture', 'Architecture (Parthenon)'],
    tags: ['ancient', 'democracy', 'philosophy', 'mediterranean']
  },
  {
    id: 'period-003',
    name: 'Roman Empire',
    timeframe: '27 BCE - 476 CE',
    startYear: -27,
    endYear: 476,
    region: 'Europe/Mediterranean',
    description: 'Vast empire that shaped Western law, engineering, and governance',
    keyEvents: [
      { year: -27, event: 'Augustus becomes first Roman Emperor' },
      { year: 79, event: 'Eruption of Vesuvius destroys Pompeii' },
      { year: 313, event: 'Edict of Milan legalizes Christianity' },
      { year: 476, event: 'Fall of Western Roman Empire' }
    ],
    characteristics: ['Engineering', 'Law', 'Military organization', 'Road networks', 'Latin language'],
    keyFigures: ['Julius Caesar', 'Augustus', 'Marcus Aurelius', 'Constantine', 'Nero'],
    culturalAchievements: ['Aqueducts', 'Colosseum', 'Roman law', 'Concrete architecture', 'Roads'],
    tags: ['ancient', 'empire', 'law', 'engineering']
  },
  {
    id: 'period-004',
    name: 'Medieval Period',
    timeframe: '500 CE - 1500 CE',
    startYear: 500,
    endYear: 1500,
    region: 'Europe',
    description: 'Age of feudalism, castles, and the Church\'s dominance',
    keyEvents: [
      { year: 800, event: 'Charlemagne crowned Holy Roman Emperor' },
      { year: 1066, event: 'Norman Conquest of England' },
      { year: 1215, event: 'Magna Carta signed' },
      { year: 1347, event: 'Black Death arrives in Europe' }
    ],
    characteristics: ['Feudalism', 'Chivalry', 'Gothic architecture', 'Monasticism', 'Crusades'],
    keyFigures: ['Charlemagne', 'William the Conqueror', 'Joan of Arc', 'Thomas Aquinas', 'Geoffrey Chaucer'],
    culturalAchievements: ['Cathedrals', 'Illuminated manuscripts', 'Universities', 'Guilds', 'Troubadour poetry'],
    tags: ['medieval', 'feudalism', 'church', 'castles']
  },
  {
    id: 'period-005',
    name: 'Renaissance',
    timeframe: '1400 - 1600',
    startYear: 1400,
    endYear: 1600,
    region: 'Europe (Italy origin)',
    description: 'Rebirth of classical learning, humanism, and artistic innovation',
    keyEvents: [
      { year: 1440, event: 'Gutenberg invents printing press' },
      { year: 1492, event: 'Columbus reaches Americas' },
      { year: 1503, event: 'Leonardo begins Mona Lisa' },
      { year: 1517, event: 'Martin Luther posts 95 Theses' }
    ],
    characteristics: ['Humanism', 'Patronage', 'Scientific inquiry', 'Perspective in art', 'Classical revival'],
    keyFigures: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Galileo', 'Shakespeare', 'Machiavelli'],
    culturalAchievements: ['Sistine Chapel', 'Printing revolution', 'Scientific method foundations', 'Perspective art'],
    tags: ['renaissance', 'art', 'humanism', 'italy']
  },
  {
    id: 'period-006',
    name: 'Enlightenment',
    timeframe: '1685 - 1815',
    startYear: 1685,
    endYear: 1815,
    region: 'Europe/Americas',
    description: 'Age of Reason emphasizing science, individual rights, and democracy',
    keyEvents: [
      { year: 1687, event: 'Newton publishes Principia' },
      { year: 1776, event: 'American Declaration of Independence' },
      { year: 1789, event: 'French Revolution begins' },
      { year: 1791, event: 'US Bill of Rights ratified' }
    ],
    characteristics: ['Reason', 'Individual rights', 'Scientific revolution', 'Secularism', 'Social contract'],
    keyFigures: ['Isaac Newton', 'John Locke', 'Voltaire', 'Benjamin Franklin', 'Thomas Jefferson', 'Immanuel Kant'],
    culturalAchievements: ['Constitutional democracy', 'Scientific method', 'Encyclopedias', 'Human rights concepts'],
    tags: ['enlightenment', 'reason', 'revolution', 'democracy']
  },
  {
    id: 'period-007',
    name: 'Industrial Revolution',
    timeframe: '1760 - 1840',
    startYear: 1760,
    endYear: 1840,
    region: 'Britain/Europe/Americas',
    description: 'Transformation from agrarian to industrial economies',
    keyEvents: [
      { year: 1769, event: 'James Watt improves steam engine' },
      { year: 1793, event: 'Eli Whitney invents cotton gin' },
      { year: 1825, event: 'First public railway opens' },
      { year: 1837, event: 'Telegraph invented' }
    ],
    characteristics: ['Mechanization', 'Urbanization', 'Factory system', 'Mass production', 'Coal power'],
    keyFigures: ['James Watt', 'Eli Whitney', 'Robert Fulton', 'Charles Dickens', 'Karl Marx'],
    culturalAchievements: ['Steam power', 'Railways', 'Factory production', 'Labor movements'],
    tags: ['industrial', 'technology', 'factories', 'capitalism']
  },
  {
    id: 'period-008',
    name: 'Civil Rights Era (USA)',
    timeframe: '1954 - 1968',
    startYear: 1954,
    endYear: 1968,
    region: 'United States',
    description: 'Movement for African American equality and end to segregation',
    keyEvents: [
      { year: 1954, event: 'Brown v. Board of Education decision' },
      { year: 1955, event: 'Rosa Parks and Montgomery Bus Boycott' },
      { year: 1963, event: 'March on Washington, I Have a Dream speech' },
      { year: 1964, event: 'Civil Rights Act passed' },
      { year: 1968, event: 'Assassination of Martin Luther King Jr.' }
    ],
    characteristics: ['Nonviolent protest', 'Legal challenges', 'Grassroots organizing', 'Coalition building'],
    keyFigures: ['Martin Luther King Jr.', 'Rosa Parks', 'Malcolm X', 'John Lewis', 'Medgar Evers', 'Fannie Lou Hamer'],
    culturalAchievements: ['Civil Rights Act', 'Voting Rights Act', 'Desegregation', 'Expanded democracy'],
    tags: ['civil-rights', 'equality', 'american', 'protest']
  }
];

// ===== FAMOUS ARTISTS DATABASE =====
export interface Artist {
  id: string;
  name: string;
  birthYear: number;
  deathYear?: number;
  nationality: string;
  movement: string[];
  medium: string[];
  biography: string;
  style: string;
  majorWorks: { title: string; year: number; description: string }[];
  influences: string[];
  influenced: string[];
  quotes?: string[];
  tags: string[];
}

export const FAMOUS_ARTISTS: Artist[] = [
  {
    id: 'artist-001',
    name: 'Leonardo da Vinci',
    birthYear: 1452,
    deathYear: 1519,
    nationality: 'Italian',
    movement: ['Renaissance', 'High Renaissance'],
    medium: ['Oil painting', 'Drawing', 'Sculpture', 'Architecture'],
    biography: 'The quintessential Renaissance man - painter, sculptor, architect, musician, mathematician, engineer, inventor, anatomist, and writer',
    style: 'Sfumato technique, realistic human anatomy, masterful use of light and shadow',
    majorWorks: [
      { title: 'Mona Lisa', year: 1503, description: 'Enigmatic portrait with revolutionary sfumato technique' },
      { title: 'The Last Supper', year: 1498, description: 'Dramatic depiction of Christ\'s final meal with apostles' },
      { title: 'Vitruvian Man', year: 1490, description: 'Study of ideal human proportions' }
    ],
    influences: ['Verrocchio', 'Ancient Greek art', 'Nature'],
    influenced: ['Raphael', 'Michelangelo', 'All of Western art'],
    quotes: ['Learning never exhausts the mind', 'Simplicity is the ultimate sophistication'],
    tags: ['renaissance', 'master', 'polymath', 'inventor']
  },
  {
    id: 'artist-002',
    name: 'Frida Kahlo',
    birthYear: 1907,
    deathYear: 1954,
    nationality: 'Mexican',
    movement: ['Surrealism', 'Magic Realism', 'Folk Art'],
    medium: ['Oil painting'],
    biography: 'Mexican artist known for self-portraits exploring identity, chronic pain, and Mexican folk culture',
    style: 'Vivid colors, symbolic imagery, unflinching self-examination, Mexican folk art influences',
    majorWorks: [
      { title: 'The Two Fridas', year: 1939, description: 'Double self-portrait exploring dual identity' },
      { title: 'Self-Portrait with Thorn Necklace', year: 1940, description: 'Symbolic self-portrait with hummingbird' },
      { title: 'The Broken Column', year: 1944, description: 'Expression of physical and emotional pain' }
    ],
    influences: ['Mexican folk art', 'Pre-Columbian art', 'Diego Rivera'],
    influenced: ['Feminist art movement', 'Contemporary self-portraiture', 'Chicano art'],
    quotes: ['I paint myself because I am often alone and I am the subject I know best', 'Feet, what do I need them for if I have wings to fly?'],
    tags: ['mexican', 'feminist', 'surrealism', 'disability']
  },
  {
    id: 'artist-003',
    name: 'Vincent van Gogh',
    birthYear: 1853,
    deathYear: 1890,
    nationality: 'Dutch',
    movement: ['Post-Impressionism', 'Expressionism'],
    medium: ['Oil painting', 'Drawing'],
    biography: 'Post-Impressionist master who created bold, emotional works despite mental illness and poverty',
    style: 'Bold colors, dramatic brushwork, emotional intensity, swirling compositions',
    majorWorks: [
      { title: 'The Starry Night', year: 1889, description: 'Swirling night sky over village' },
      { title: 'Sunflowers', year: 1888, description: 'Vibrant still life series' },
      { title: 'Cafe Terrace at Night', year: 1888, description: 'Night scene of outdoor cafe' }
    ],
    influences: ['Impressionists', 'Japanese prints', 'Millet'],
    influenced: ['Expressionism', 'Fauvism', 'Modern art'],
    quotes: ['I dream my painting and I paint my dream', 'What is done in love is done well'],
    tags: ['post-impressionism', 'emotional', 'mental-health', 'dutch']
  },
  {
    id: 'artist-004',
    name: 'Jean-Michel Basquiat',
    birthYear: 1960,
    deathYear: 1988,
    nationality: 'American',
    movement: ['Neo-Expressionism', 'Street Art'],
    medium: ['Painting', 'Drawing', 'Graffiti'],
    biography: 'Brooklyn-born artist of Haitian and Puerto Rican descent who rose from street artist to art world star',
    style: 'Raw, energetic, text and symbols, social commentary, African diaspora themes',
    majorWorks: [
      { title: 'Untitled (Skull)', year: 1981, description: 'Iconic skull painting' },
      { title: 'Hollywood Africans', year: 1983, description: 'Commentary on Black representation' },
      { title: 'Riding with Death', year: 1988, description: 'Final major work, skeletal figure' }
    ],
    influences: ['Cy Twombly', 'Jean Dubuffet', 'Robert Rauschenberg', 'Jazz', 'Hip-hop'],
    influenced: ['Contemporary street art', 'Hip-hop visual culture', 'Neo-expressionism'],
    quotes: ['I dont think about art when Im working. I try to think about life', 'Believe it or not, I can actually draw'],
    tags: ['neo-expressionism', 'black-artist', 'street-art', 'new-york']
  },
  {
    id: 'artist-005',
    name: 'Yayoi Kusama',
    birthYear: 1929,
    nationality: 'Japanese',
    movement: ['Pop Art', 'Minimalism', 'Feminist Art', 'Environmental Art'],
    medium: ['Painting', 'Sculpture', 'Installation', 'Performance'],
    biography: 'Japanese contemporary artist known for polka dots, infinity rooms, and avant-garde installations',
    style: 'Polka dots, infinity nets, immersive environments, pumpkins, repetitive patterns',
    majorWorks: [
      { title: 'Infinity Mirror Rooms', year: 1965, description: 'Immersive mirrored environments' },
      { title: 'Pumpkin', year: 1994, description: 'Giant polka-dotted pumpkin sculptures' },
      { title: 'Infinity Nets', year: 1958, description: 'Large-scale net paintings' }
    ],
    influences: ['Georgia O\'Keeffe', 'Surrealism', 'Japanese traditions'],
    influenced: ['Installation art', 'Immersive experiences', 'Contemporary art'],
    quotes: ['Polka dots are a way to infinity', 'I want to live forever'],
    tags: ['japanese', 'contemporary', 'infinity', 'feminist']
  },
  {
    id: 'artist-006',
    name: 'Kara Walker',
    birthYear: 1969,
    nationality: 'American',
    movement: ['Contemporary Art', 'Installation Art'],
    medium: ['Silhouette', 'Installation', 'Drawing', 'Film'],
    biography: 'American artist exploring race, gender, sexuality, and violence through striking silhouettes',
    style: 'Black paper silhouettes, room-sized installations, historical narratives, provocative imagery',
    majorWorks: [
      { title: 'A Subtlety', year: 2014, description: 'Massive sugar sphinx installation' },
      { title: 'Gone: An Historical Romance', year: 1994, description: 'Silhouette installation on slavery' },
      { title: 'The End of Uncle Tom', year: 1995, description: 'Confrontational silhouette work' }
    ],
    influences: ['Victorian silhouettes', 'Historical narratives', 'Race theory'],
    influenced: ['Contemporary discussions of race', 'Installation art'],
    quotes: ['Art can\'t change the world on its own but it can change consciousness'],
    tags: ['contemporary', 'black-artist', 'race', 'silhouette']
  },
  {
    id: 'artist-007',
    name: 'Kehinde Wiley',
    birthYear: 1977,
    nationality: 'American',
    movement: ['Contemporary Art', 'Portraiture'],
    medium: ['Oil painting'],
    biography: 'Los Angeles-born artist known for vibrant portraits of Black individuals in poses from classical art',
    style: 'Ornate backgrounds, classical poses, contemporary Black subjects, vibrant patterns',
    majorWorks: [
      { title: 'Portrait of Barack Obama', year: 2018, description: 'Official presidential portrait' },
      { title: 'Napoleon Leading the Army', year: 2005, description: 'Hip-hop figure as Napoleon' },
      { title: 'Rumors of War', year: 2019, description: 'Monumental equestrian sculpture' }
    ],
    influences: ['Old Masters', 'Hip-hop culture', 'West African textiles'],
    influenced: ['Contemporary portraiture', 'Representation in art'],
    tags: ['contemporary', 'black-artist', 'portraiture', 'classical']
  }
];

// ===== ART TECHNIQUES DATABASE =====
export interface ArtTechnique {
  id: string;
  name: string;
  category: 'drawing' | 'painting' | 'sculpture' | 'printmaking' | 'digital' | 'mixed-media';
  description: string;
  materials: string[];
  steps: string[];
  tips: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  famousExamples?: string[];
  tags: string[];
}

export const ART_TECHNIQUES: ArtTechnique[] = [
  {
    id: 'tech-001',
    name: 'Contour Drawing',
    category: 'drawing',
    description: 'Drawing the outline/edges of a subject without looking at the paper',
    materials: ['Paper', 'Pencil or pen'],
    steps: ['Choose a subject', 'Place pencil on paper', 'Look only at subject edges', 'Draw slowly following edges', 'Dont lift pencil'],
    tips: ['Start with simple objects', 'Go slowly', 'Accept imperfection', 'Focus on observation'],
    difficulty: 'beginner',
    tags: ['drawing', 'observation', 'beginner']
  },
  {
    id: 'tech-002',
    name: 'Gesture Drawing',
    category: 'drawing',
    description: 'Quick sketches capturing movement and essence of a subject',
    materials: ['Paper', 'Charcoal or pencil', 'Timer'],
    steps: ['Set timer (30 sec to 2 min)', 'Capture essential movement', 'Use flowing lines', 'Dont focus on details', 'Practice repeatedly'],
    tips: ['Use whole arm not just wrist', 'Start with the line of action', 'Capture energy not accuracy'],
    difficulty: 'beginner',
    famousExamples: ['Egon Schiele sketches', 'Degas dancer studies'],
    tags: ['drawing', 'figure', 'movement']
  },
  {
    id: 'tech-003',
    name: 'Wet-on-Wet (Alla Prima)',
    category: 'painting',
    description: 'Applying wet paint onto wet paint for blending',
    materials: ['Oil or acrylic paints', 'Canvas or paper', 'Brushes', 'Palette'],
    steps: ['Apply base layer of paint', 'While still wet add new colors', 'Blend edges where colors meet', 'Work quickly before drying'],
    tips: ['Use medium to extend drying time', 'Plan color placement', 'Work from dark to light'],
    difficulty: 'intermediate',
    famousExamples: ['Monet\'s Water Lilies', 'Bob Ross paintings'],
    tags: ['painting', 'oil', 'blending']
  },
  {
    id: 'tech-004',
    name: 'Glazing',
    category: 'painting',
    description: 'Applying thin transparent layers of paint over dried layers',
    materials: ['Oil or acrylic paints', 'Glazing medium', 'Canvas', 'Soft brushes'],
    steps: ['Complete underpainting', 'Wait for complete drying', 'Mix thin glaze with medium', 'Apply in thin even layers', 'Build up gradually'],
    tips: ['Patience is key', 'Use transparent pigments', 'Test on scrap first'],
    difficulty: 'advanced',
    famousExamples: ['Vermeer\'s luminous paintings', 'Titian\'s portraits'],
    tags: ['painting', 'oil', 'luminosity']
  },
  {
    id: 'tech-005',
    name: 'Cross-Hatching',
    category: 'drawing',
    description: 'Creating tone and texture through intersecting parallel lines',
    materials: ['Paper', 'Pen or pencil'],
    steps: ['Draw parallel lines', 'Add second layer at angle', 'Vary density for values', 'Add more layers for darker areas'],
    tips: ['Keep lines consistent', 'Vary angle for interest', 'Start light build up gradually'],
    difficulty: 'beginner',
    famousExamples: ['Durer engravings', 'Rembrandt etchings'],
    tags: ['drawing', 'shading', 'texture']
  },
  {
    id: 'tech-006',
    name: 'Color Theory Basics',
    category: 'painting',
    description: 'Understanding how colors interact and affect each other',
    materials: ['Color wheel', 'Paints', 'Paper'],
    steps: ['Learn primary colors', 'Mix secondary colors', 'Explore complementary pairs', 'Practice color harmonies', 'Understand warm/cool'],
    tips: ['Keep a color mixing journal', 'Observe colors in nature', 'Limit palette when learning'],
    difficulty: 'beginner',
    tags: ['color', 'theory', 'fundamental']
  },
  {
    id: 'tech-007',
    name: 'Collage',
    category: 'mixed-media',
    description: 'Creating art by assembling different materials',
    materials: ['Paper', 'Magazines', 'Scissors', 'Glue', 'Canvas or board'],
    steps: ['Gather materials', 'Plan composition', 'Cut/tear pieces', 'Arrange before gluing', 'Layer and glue down'],
    tips: ['Consider texture and pattern', 'Mix different papers', 'Add paint or drawing'],
    difficulty: 'beginner',
    famousExamples: ['Romare Bearden collages', 'Hannah Hoch photomontage'],
    tags: ['mixed-media', 'accessible', 'creative']
  }
];

// ===== CULTURAL MOVEMENTS =====
export interface CulturalMovement {
  id: string;
  name: string;
  period: string;
  region: string;
  description: string;
  characteristics: string[];
  keyFigures: string[];
  impact: string[];
  relatedArt: string[];
  tags: string[];
}

export const CULTURAL_MOVEMENTS: CulturalMovement[] = [
  {
    id: 'cult-001',
    name: 'Harlem Renaissance',
    period: '1920s-1930s',
    region: 'United States (Harlem, New York)',
    description: 'African American cultural, artistic, and intellectual flourishing',
    characteristics: ['Pride in Black identity', 'Jazz and blues', 'Literature', 'Visual arts', 'Political activism'],
    keyFigures: ['Langston Hughes', 'Zora Neale Hurston', 'Duke Ellington', 'Aaron Douglas', 'Josephine Baker'],
    impact: ['Foundation for Civil Rights Movement', 'Black artistic tradition', 'Jazz as American art form'],
    relatedArt: ['Jazz music', 'Blues', 'Modernist literature', 'African-inspired visual art'],
    tags: ['black-culture', 'jazz', 'literature', 'american']
  },
  {
    id: 'cult-002',
    name: 'Beat Generation',
    period: '1950s-1960s',
    region: 'United States',
    description: 'Literary movement rejecting mainstream American values',
    characteristics: ['Spontaneous prose', 'Jazz influences', 'Eastern spirituality', 'Drug experimentation', 'Sexual liberation'],
    keyFigures: ['Jack Kerouac', 'Allen Ginsberg', 'William S. Burroughs', 'Gregory Corso'],
    impact: ['Influenced 1960s counterculture', 'Poetry revival', 'Free expression in art'],
    relatedArt: ['Confessional poetry', 'Jazz', 'Abstract Expressionism'],
    tags: ['counterculture', 'literature', 'american', 'rebellion']
  },
  {
    id: 'cult-003',
    name: 'Afrofuturism',
    period: '1990s-present (roots in earlier decades)',
    region: 'Global (African Diaspora)',
    description: 'Cultural movement combining science fiction, history, and fantasy with African diaspora culture',
    characteristics: ['Sci-fi aesthetics', 'African mythology', 'Technology', 'Alternative histories', 'Empowerment'],
    keyFigures: ['Sun Ra', 'Octavia Butler', 'Samuel R. Delany', 'Janelle Monae', 'Wangechi Mutu'],
    impact: ['Black Panther (film)', 'Music videos', 'Contemporary art', 'Literature'],
    relatedArt: ['Science fiction', 'Funk and electronic music', 'Digital art', 'Fashion'],
    tags: ['black-culture', 'sci-fi', 'contemporary', 'empowerment']
  },
  {
    id: 'cult-004',
    name: 'Gothic Subculture',
    period: '1970s-present',
    region: 'Global (originated UK)',
    description: 'Subculture embracing dark aesthetics, music, and literature',
    characteristics: ['Dark fashion', 'Post-punk music', 'Victorian influences', 'Horror aesthetics', 'Individualism'],
    keyFigures: ['Siouxsie Sioux', 'Robert Smith', 'Peter Murphy', 'Anne Rice'],
    impact: ['Fashion industry', 'Music genres', 'Film aesthetics', 'Literature'],
    relatedArt: ['Post-punk music', 'Gothic literature', 'Victorian revival', 'Dark romanticism'],
    tags: ['goth', 'subculture', 'music', 'fashion']
  },
  {
    id: 'cult-005',
    name: 'Queer Art Movement',
    period: '1970s-present',
    region: 'Global',
    description: 'Art by and for LGBTQ+ communities, challenging norms and celebrating identity',
    characteristics: ['Identity exploration', 'Political activism', 'Camp aesthetics', 'Body politics', 'Community building'],
    keyFigures: ['David Wojnarowicz', 'Keith Haring', 'Catherine Opie', 'Zanele Muholi', 'Felix Gonzalez-Torres'],
    impact: ['Visibility', 'AIDS activism', 'Gender discourse', 'Mainstream acceptance'],
    relatedArt: ['Photography', 'Performance art', 'Installation', 'Video art'],
    tags: ['lgbtq', 'identity', 'activism', 'contemporary']
  }
];

// Helper functions
export function searchArtHistory(query: string) {
  const q = query.toLowerCase();
  const results: any[] = [];

  results.push(...HISTORICAL_PERIODS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.keyFigures.some(f => f.toLowerCase().includes(q))
  ).map(p => ({ ...p, type: 'period' })));

  results.push(...FAMOUS_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.movement.some(m => m.toLowerCase().includes(q)) ||
    a.nationality.toLowerCase().includes(q)
  ).map(a => ({ ...a, type: 'artist' })));

  results.push(...ART_TECHNIQUES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  ).map(t => ({ ...t, type: 'technique' })));

  results.push(...CULTURAL_MOVEMENTS.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q)
  ).map(m => ({ ...m, type: 'movement' })));

  return results;
}

export function getArtistsByMovement(movement: string) {
  return FAMOUS_ARTISTS.filter(a =>
    a.movement.some(m => m.toLowerCase().includes(movement.toLowerCase()))
  );
}

export function getTechniquesByCategory(category: string) {
  return ART_TECHNIQUES.filter(t => t.category === category);
}

export function getHistoricalPeriodByYear(year: number) {
  return HISTORICAL_PERIODS.find(p => year >= p.startYear && year <= p.endYear);
}

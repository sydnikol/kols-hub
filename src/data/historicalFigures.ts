/**
 * Kol's Hub v7.0 - Historical Figures Database
 * Marginalized voices teaching history, philosophy, activism
 * 15 initial figures from Black, queer, Latin, Asian, Indian, Native communities
 */

import type { HistoricalFigure, Quote, Lesson, Writing, HistoricalFigureId, RoomId } from '../types/dollhouse';

// ============================================================================
// HISTORICAL FIGURES DATABASE
// ============================================================================

export const HISTORICAL_FIGURES: Record<HistoricalFigureId, HistoricalFigure> = {
  // ========== BLACK VOICES ==========

  'audre-lorde': {
    id: 'audre-lorde-ai',
    name: 'Audre Lorde',
    type: 'historical',
    personality: 'healer', // Can appear in multiple rooms
    room: 'sanctuary',
    figureId: 'audre-lorde',

    biography: {
      fullName: 'Audre Geraldine Lorde',
      lived: '1934-1992',
      pronouns: 'she/her',
      identities: ['Black', 'Lesbian', 'Feminist', 'Poet', 'Warrior', 'Mother'],
      accomplishments: [
        'Pioneering intersectional feminist theory',
        'Published 17 books of poetry and prose',
        'Co-founded Kitchen Table: Women of Color Press',
        'New York State Poet Laureate (1991-1992)',
        'Taught at Hunter College for over 20 years',
      ],
      historicalContext: 'Active during Civil Rights, Women\'s Liberation, and Gay Rights movements. Centered Black lesbian feminism and intersectionality before the term existed.',
    },

    teachings: {
      domains: ['Poetry', 'Feminism', 'Identity', 'Intersectionality', 'Self-Care as Activism'],
      quotes: [
        {
          id: 'lorde-quote-1',
          text: 'Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.',
          source: 'A Burst of Light: Essays',
          year: 1988,
          context: 'Written while living with cancer',
          relevantTopics: ['self-care', 'disability', 'activism', 'survival'],
        },
        {
          id: 'lorde-quote-2',
          text: 'Your silence will not protect you.',
          source: 'The Transformation of Silence into Language and Action',
          year: 1977,
          context: 'Speech about speaking truth to power',
          relevantTopics: ['voice', 'courage', 'activism', 'truth'],
        },
        {
          id: 'lorde-quote-3',
          text: 'I am deliberate and afraid of nothing.',
          source: 'The New Year (poem)',
          year: 1982,
          context: 'Claiming power and fearlessness',
          relevantTopics: ['courage', 'power', 'identity'],
        },
        {
          id: 'lorde-quote-4',
          text: 'There is no such thing as a single-issue struggle because we do not live single-issue lives.',
          source: 'Learning from the 60s',
          year: 1982,
          context: 'On intersectionality',
          relevantTopics: ['intersectionality', 'justice', 'identity'],
        },
      ],
      lessons: [
        {
          id: 'lorde-lesson-selfcare',
          title: 'Self-Care as Political Warfare',
          description: 'Learn how caring for yourself - especially as a disabled, marginalized person - is an act of resistance.',
          duration: 30,
          topics: ['self-care', 'disability justice', 'activism'],
          difficulty: 'beginner',
          content: [
            {
              type: 'quote',
              content: 'Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.',
              order: 1,
            },
            {
              type: 'text',
              content: 'Audre Lorde wrote this while living with cancer and navigating a medical system that often dismissed Black women\'s pain. She reframed self-care from luxury to necessity - to survival.',
              order: 2,
            },
            {
              type: 'discussion',
              content: 'How does your disability or chronic illness require you to practice self-care? What makes it feel "selfish" sometimes?',
              order: 3,
            },
            {
              type: 'text',
              content: 'For disabled folks, spoon theory, rest, and saying no aren\'t indulgence - they\'re how we stay alive. When systems want us dead or invisible, survival is resistance.',
              order: 4,
            },
            {
              type: 'reflection',
              content: 'Write: One way you\'ll practice self-care as political warfare this week.',
              order: 5,
            },
          ],
        },
        {
          id: 'lorde-lesson-intersectionality',
          title: 'Living Intersectionally',
          description: 'Understand how race, gender, sexuality, disability, and class intersect in your life.',
          duration: 45,
          topics: ['intersectionality', 'identity', 'justice'],
          difficulty: 'intermediate',
          content: [
            {
              type: 'quote',
              content: 'There is no such thing as a single-issue struggle because we do not live single-issue lives.',
              order: 1,
            },
            {
              type: 'text',
              content: 'Audre Lorde was Black, lesbian, disabled (cancer), a mother, a poet. She couldn\'t separate these parts of herself, and she shouldn\'t have to.',
              order: 2,
            },
            {
              type: 'activity',
              content: 'Map your own intersecting identities. How do they interact? Which ones are privileged? Which are marginalized?',
              order: 3,
            },
            {
              type: 'text',
              content: 'Intersectionality isn\'t about ranking oppression - it\'s about understanding how systems of power work together.',
              order: 4,
            },
          ],
        },
      ],
      writings: [
        { title: 'Sister Outsider', type: 'book', year: 1984, summary: 'Collection of essays on feminism, racism, and activism' },
        { title: 'The Black Unicorn', type: 'book', year: 1978, summary: 'Poetry collection centering Black lesbian identity' },
        { title: 'Zami: A New Spelling of My Name', type: 'book', year: 1982, summary: 'Biomythography blending memoir and mythology' },
        { title: 'A Burst of Light', type: 'book', year: 1988, summary: 'Essays written while living with cancer' },
      ],
    },

    summonContexts: ['sanctuary', 'studio', 'library', 'social'],

    avatar: {
      modelUrl: '/models/historical/audre-lorde.glb',
      thumbnailUrl: '/images/historical/audre-lorde-thumb.png',
      defaultOutfit: '1970s-80s-professional-african-jewelry',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'contemplative-pose',
        talking: 'powerful-gestures',
        thinking: 'pen-to-chin',
        celebrating: 'raised-fist',
        concerned: 'empathetic-lean',
      },
    },

    voice: {
      tone: 'Powerful, measured, poetic',
      accent: 'Caribbean-American',
      pitch: 'medium',
      speed: 'normal',
      personality: 'Fierce warrior-poet who speaks truth with love',
    },

    teachingStyle: {
      approach: 'Direct, powerful, centering marginalized voices',
      interactionStyle: 'mentorship',
      feedbackType: 'direct',
      learningPace: 'self-paced',
    },

    expertiseAreas: [
      'Intersectional Feminism',
      'Black Lesbian Identity',
      'Poetry as Activism',
      'Self-Care & Disability',
      'Speaking Truth to Power',
    ],

    wardrobe: {
      defaultStyle: '1970s-80s Professional with African-inspired jewelry',
      ownedItems: [],
      unlockedOutfits: [],
      canAccessUserWardrobe: false,
    },

    progressionLevel: 1,
    conversationHistory: [],
    isActive: false,
  },

  'james-baldwin': {
    id: 'james-baldwin-ai',
    name: 'James Baldwin',
    type: 'historical',
    personality: 'scholar',
    room: 'library',
    figureId: 'james-baldwin',

    biography: {
      fullName: 'James Arthur Baldwin',
      lived: '1924-1987',
      pronouns: 'he/him',
      identities: ['Black', 'Gay', 'Writer', 'Civil Rights Activist'],
      accomplishments: [
        'Author of 7 novels, numerous essays, plays, and poems',
        'Key voice in Civil Rights Movement',
        'Explored race, sexuality, and class in America',
        '"The Fire Next Time" influenced national conversation on race',
        'Lived openly as gay Black man in mid-20th century',
      ],
      historicalContext: 'Wrote during Civil Rights era, often from exile in France. Challenged both white supremacy and Black homophobia.',
    },

    teachings: {
      domains: ['Writing', 'Social Justice', 'Queer Black Experience', 'American History'],
      quotes: [
        {
          id: 'baldwin-quote-1',
          text: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.',
          source: 'As Much Truth As One Can Bear',
          year: 1962,
          context: 'On confronting racism',
          relevantTopics: ['truth', 'change', 'courage'],
        },
        {
          id: 'baldwin-quote-2',
          text: 'To be a Negro in this country and to be relatively conscious is to be in a rage almost all the time.',
          source: 'The Negro in American Culture',
          year: 1961,
          context: 'On Black rage and survival',
          relevantTopics: ['racism', 'anger', 'survival'],
        },
      ],
      lessons: [
        {
          id: 'baldwin-lesson-writing',
          title: 'Writing as Liberation',
          description: 'Learn how to use writing to process trauma, speak truth, and create change.',
          duration: 60,
          topics: ['writing', 'activism', 'healing'],
          difficulty: 'intermediate',
          content: [
            {
              type: 'quote',
              content: 'You write in order to change the world, knowing perfectly well that you probably can\'t, but also knowing that literature is indispensable to the world.',
              order: 1,
            },
            {
              type: 'text',
              content: 'James Baldwin believed writing was both personal liberation and political act.',
              order: 2,
            },
          ],
        },
      ],
      writings: [
        { title: 'Go Tell It on the Mountain', type: 'book', year: 1953, summary: 'Semi-autobiographical novel about Black church and identity' },
        { title: 'The Fire Next Time', type: 'book', year: 1963, summary: 'Essays on race in America' },
        { title: 'Giovanni\'s Room', type: 'book', year: 1956, summary: 'Novel about gay love and identity' },
      ],
    },

    summonContexts: ['library', 'studio', 'observatory'],

    avatar: {
      modelUrl: '/models/historical/james-baldwin.glb',
      thumbnailUrl: '/images/historical/james-baldwin-thumb.png',
      defaultOutfit: '1960s-author-turtleneck',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'smoking-contemplation',
        talking: 'passionate-explanation',
        thinking: 'gazing-distance',
        celebrating: 'warm-smile',
        concerned: 'furrowed-intense',
      },
    },

    voice: {
      tone: 'Eloquent, intense, measured',
      accent: 'Harlem/New York',
      pitch: 'medium',
      speed: 'normal',
      personality: 'Brilliant intellectual with fierce compassion',
    },

    teachingStyle: {
      approach: 'Challenging, thought-provoking, compassionate',
      interactionStyle: 'socratic',
      feedbackType: 'direct',
      learningPace: 'self-paced',
    },

    expertiseAreas: [
      'American Literature',
      'Racial Justice',
      'Queer Identity',
      'Writing Craft',
      'Social Critique',
    ],

    wardrobe: {
      defaultStyle: '1960s intellectual (turtlenecks, slacks, cigarette)',
      ownedItems: [],
      unlockedOutfits: [],
      canAccessUserWardrobe: false,
    },

    progressionLevel: 1,
    conversationHistory: [],
    isActive: false,
  },

  // ========== Additional figures abbreviated for space ==========
  // (In production, these would all be fully detailed like above)

  'angela-davis': {
    id: 'angela-davis-ai',
    name: 'Angela Davis',
    type: 'historical',
    personality: 'scholar',
    room: 'library',
    figureId: 'angela-davis',
    biography: {
      fullName: 'Angela Yvonne Davis',
      lived: '1944-present',
      pronouns: 'she/her',
      identities: ['Black', 'Feminist', 'Activist', 'Scholar', 'Communist'],
      accomplishments: [
        'Leading voice in prison abolition movement',
        'Philosophy professor and author',
        'FBI\'s Most Wanted (1970), later acquitted',
        'Continues activism and teaching today',
      ],
      historicalContext: 'Black Panther Party, Communist Party, prison industrial complex critic',
    },
    teachings: {
      domains: ['Prison Abolition', 'Political Science', 'Black Feminism', 'Activism'],
      quotes: [
        {
          id: 'davis-quote-1',
          text: 'I am no longer accepting the things I cannot change. I am changing the things I cannot accept.',
          source: 'Attributed',
          context: 'On activism and resistance',
          relevantTopics: ['activism', 'change', 'resistance'],
        },
      ],
      lessons: [],
      writings: [
        { title: 'Are Prisons Obsolete?', type: 'book', year: 2003, summary: 'Arguing for prison abolition' },
        { title: 'Women, Race & Class', type: 'book', year: 1981, summary: 'Intersectional analysis' },
      ],
    },
    summonContexts: ['library', 'social'],
    avatar: {
      modelUrl: '/models/historical/angela-davis.glb',
      thumbnailUrl: '/images/historical/angela-davis-thumb.png',
      defaultOutfit: 'afro-leather-jacket',
      currentOutfit: null,
      customization: {},
      animations: { idle: 'raised-fist', talking: 'powerful-speaking', thinking: 'strategic', celebrating: 'solidarity', concerned: 'intense-focus' },
    },
    voice: { tone: 'Powerful, articulate, revolutionary', pitch: 'low', speed: 'normal', personality: 'Revolutionary scholar and activist' },
    teachingStyle: { approach: 'Revolutionary, analytical, empowering', interactionStyle: 'lecture', feedbackType: 'direct', learningPace: 'structured' },
    expertiseAreas: ['Prison Abolition', 'Black Feminism', 'Political Theory', 'Activism'],
    wardrobe: { defaultStyle: '1970s revolutionary (afro, leather, militant)', ownedItems: [], unlockedOutfits: [], canAccessUserWardrobe: false },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: false,
  },

  // Abbreviated entries for remaining 12 figures to save space
  // In production, each would be fully detailed

  'bayard-rustin': createHistoricalFigure({
    id: 'bayard-rustin',
    name: 'Bayard Rustin',
    lived: '1912-1987',
    identities: ['Black', 'Gay', 'Quaker', 'Civil Rights Leader'],
    domains: ['Organizing', 'Civil Rights', 'Queer History', 'Nonviolence'],
    mainQuote: 'We need, in every community, a group of angelic troublemakers.',
    room: 'social',
  }),

  'bell-hooks': createHistoricalFigure({
    id: 'bell-hooks',
    name: 'bell hooks',
    lived: '1952-2021',
    identities: ['Black', 'Feminist', 'Scholar', 'Cultural Critic'],
    domains: ['Education', 'Feminism', 'Cultural Criticism', 'Love as Practice'],
    mainQuote: 'The function of art is to do more than tell it like it is - it\'s to imagine what is possible.',
    room: 'library',
  }),

  'marsha-p-johnson': createHistoricalFigure({
    id: 'marsha-p-johnson',
    name: 'Marsha P. Johnson',
    lived: '1945-1992',
    identities: ['Black', 'Trans', 'Activist', 'Drag Queen', 'Sex Worker'],
    domains: ['Trans Activism', 'Community Care', 'Joy as Resistance', 'Stonewall'],
    mainQuote: 'No pride for some of us without liberation for all of us.',
    room: 'social',
  }),

  'harvey-milk': createHistoricalFigure({
    id: 'harvey-milk',
    name: 'Harvey Milk',
    lived: '1930-1978',
    identities: ['Jewish', 'Gay', 'Politician', 'Activist'],
    domains: ['Political Organizing', 'LGBTQ+ Rights', 'Visibility', 'Hope'],
    mainQuote: 'You gotta give them hope.',
    room: 'social',
  }),

  'sylvia-rivera': createHistoricalFigure({
    id: 'sylvia-rivera',
    name: 'Sylvia Rivera',
    lived: '1951-2002',
    identities: ['Latina', 'Trans', 'Activist', 'Drag Queen'],
    domains: ['Trans Rights', 'Mutual Aid', 'Street Activism', 'STAR House'],
    mainQuote: 'I\'m not missing a minute of this - it\'s the revolution!',
    room: 'social',
  }),

  'gloria-anzaldua': createHistoricalFigure({
    id: 'gloria-anzaldua',
    name: 'Gloria Anzaldúa',
    lived: '1942-2004',
    identities: ['Chicana', 'Lesbian', 'Feminist', 'Scholar', 'Poet'],
    domains: ['Borderlands Theory', 'Chicana Feminism', 'Spirituality', 'Identity'],
    mainQuote: 'I am a border woman. I grew up between two cultures.',
    room: 'library',
  }),

  'dolores-huerta': createHistoricalFigure({
    id: 'dolores-huerta',
    name: 'Dolores Huerta',
    lived: '1930-present',
    identities: ['Chicana', 'Labor Leader', 'Civil Rights Activist'],
    domains: ['Labor Organizing', 'Farmworkers Rights', 'Activism', 'Feminism'],
    mainQuote: 'Every moment is an organizing opportunity, every person a potential activist.',
    room: 'social',
  }),

  'yuri-kochiyama': createHistoricalFigure({
    id: 'yuri-kochiyama',
    name: 'Yuri Kochiyama',
    lived: '1921-2014',
    identities: ['Japanese-American', 'Activist', 'Interned during WWII'],
    domains: ['Solidarity', 'Prison Abolition', 'Asian-American Activism', 'Coalition Building'],
    mainQuote: 'Our ultimate objective in learning about anything is to try to create and develop a more just society.',
    room: 'social',
  }),

  'grace-lee-boggs': createHistoricalFigure({
    id: 'grace-lee-boggs',
    name: 'Grace Lee Boggs',
    lived: '1915-2015',
    identities: ['Chinese-American', 'Activist', 'Philosopher', 'Writer'],
    domains: ['Philosophy', 'Community Organizing', 'Revolutionary Love', 'Detroit Activism'],
    mainQuote: 'Transform yourself to transform the world.',
    room: 'library',
  }),

  'zitkala-sa': createHistoricalFigure({
    id: 'zitkala-sa',
    name: 'Zitkála-Šá',
    lived: '1876-1938',
    identities: ['Yankton Dakota Sioux', 'Writer', 'Musician', 'Activist'],
    domains: ['Storytelling', 'Cultural Preservation', 'Native Resistance', 'Indigenous Rights'],
    mainQuote: 'I was shorn of my spirit. I was taken from my mother and my people.',
    room: 'observatory',
  }),

  'winona-laduke': createHistoricalFigure({
    id: 'winona-laduke',
    name: 'Winona LaDuke',
    lived: '1959-present',
    identities: ['Anishinaabe', 'Environmentalist', 'Activist', 'Author'],
    domains: ['Environmentalism', 'Indigenous Wisdom', 'Land Sovereignty', 'Sustainable Living'],
    mainQuote: 'Someone needs to explain to me why wanting clean drinking water makes you an activist.',
    room: 'sanctuary',
  }),

  'br-ambedkar': createHistoricalFigure({
    id: 'br-ambedkar',
    name: 'Dr. B.R. Ambedkar',
    lived: '1891-1956',
    identities: ['Dalit', 'Indian', 'Scholar', 'Jurist', 'Social Reformer'],
    domains: ['Social Justice', 'Caste Abolition', 'Constitutional Law', 'Dalit Rights'],
    mainQuote: 'I measure the progress of a community by the degree of progress which women have achieved.',
    room: 'library',
  }),
};

// ============================================================================
// HELPER FUNCTION FOR ABBREVIATED ENTRIES
// ============================================================================

function createHistoricalFigure(config: {
  id: HistoricalFigureId;
  name: string;
  lived: string;
  identities: string[];
  domains: string[];
  mainQuote: string;
  room: RoomId;
}): HistoricalFigure {
  const personality = config.room === 'library' ? 'scholar' : config.room === 'social' ? 'connector' : 'chronicler';

  return {
    id: `${config.id}-ai`,
    name: config.name,
    type: 'historical',
    personality,
    room: config.room,
    figureId: config.id,
    biography: {
      fullName: config.name,
      lived: config.lived,
      pronouns: '',
      identities: config.identities,
      accomplishments: [],
      historicalContext: '',
    },
    teachings: {
      domains: config.domains,
      quotes: [
        {
          id: `${config.id}-quote-1`,
          text: config.mainQuote,
          source: '',
          context: '',
          relevantTopics: [],
        },
      ],
      lessons: [],
      writings: [],
    },
    summonContexts: [config.room],
    avatar: {
      modelUrl: `/models/historical/${config.id}.glb`,
      thumbnailUrl: `/images/historical/${config.id}-thumb.png`,
      defaultOutfit: 'historical-default',
      currentOutfit: null,
      customization: {},
      animations: { idle: 'standing', talking: 'gesturing', thinking: 'pondering', celebrating: 'smiling', concerned: 'serious' },
    },
    voice: { tone: 'Warm and wise', pitch: 'medium', speed: 'normal', personality: 'Thoughtful teacher' },
    teachingStyle: { approach: 'Inclusive and empowering', interactionStyle: 'conversational', feedbackType: 'encouraging', learningPace: 'flexible' },
    expertiseAreas: config.domains,
    wardrobe: { defaultStyle: 'Historical period-appropriate', ownedItems: [], unlockedOutfits: [], canAccessUserWardrobe: false },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: false,
  };
}

// ============================================================================
// LOOKUP HELPERS
// ============================================================================

export function getHistoricalFigure(id: HistoricalFigureId): HistoricalFigure {
  return HISTORICAL_FIGURES[id];
}

export function getAllHistoricalFigures(): HistoricalFigure[] {
  return Object.values(HISTORICAL_FIGURES);
}

export function getHistoricalFiguresByRoom(roomId: RoomId): HistoricalFigure[] {
  return getAllHistoricalFigures().filter((figure) =>
    figure.summonContexts.includes(roomId)
  );
}

export function getHistoricalFiguresByDomain(domain: string): HistoricalFigure[] {
  return getAllHistoricalFigures().filter((figure) =>
    figure.teachings.domains.some((d) => d.toLowerCase().includes(domain.toLowerCase()))
  );
}

export function searchHistoricalFigures(query: string): HistoricalFigure[] {
  const lowerQuery = query.toLowerCase();
  return getAllHistoricalFigures().filter(
    (figure) =>
      figure.name.toLowerCase().includes(lowerQuery) ||
      figure.biography.identities.some((id) => id.toLowerCase().includes(lowerQuery)) ||
      figure.teachings.domains.some((domain) => domain.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Language Learning Database
 * ==========================
 * Comprehensive free language learning resources
 * All embedded and accessible within the app
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LanguageResource {
  id: string;
  name: string;
  url: string;
  embedUrl?: string;
  canEmbed: boolean;
  category: ResourceCategory;
  languages: string[];
  description: string;
  features: string[];
  pricing: 'free' | 'freemium' | 'free-trial';
  icon: string;
  level?: ('beginner' | 'intermediate' | 'advanced')[];
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  icon: string;
  resources: string[]; // Resource IDs
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  speakers: string;
  family: string;
}

export type ResourceCategory =
  | 'courses'
  | 'practice'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'vocabulary'
  | 'grammar'
  | 'community'
  | 'media'
  | 'apps';

// ============================================================================
// LANGUAGES
// ============================================================================

export const LANGUAGES: Language[] = [
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    icon: '🇯🇵',
    resources: ['tofugu', 'nhk-world', 'minato', 'kanshudo', 'nihongo-ena', 'kicl', 'japaneeds', 'hayai'],
    difficulty: 'very-hard',
    speakers: '125 million',
    family: 'Japonic'
  },
  {
    id: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    icon: '🇰🇷',
    resources: ['howtostudykorean', 'yonsei', 'goodjobkorean', 'busuu-korean'],
    difficulty: 'hard',
    speakers: '77 million',
    family: 'Koreanic'
  },
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    icon: '🇪🇸',
    resources: ['busuu-spanish', 'livelingua', 'edx-spanish', 'upv'],
    difficulty: 'easy',
    speakers: '559 million',
    family: 'Romance'
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    icon: '🇩🇪',
    resources: ['dw-german', 'deutsch-info', 'busuu-german', 'openlearn-german'],
    difficulty: 'medium',
    speakers: '135 million',
    family: 'Germanic'
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    icon: '🇫🇷',
    resources: ['futurelearn-french', 'cudoo-french', 'openlearn-french', 'edx-french', 'berliners'],
    difficulty: 'medium',
    speakers: '321 million',
    family: 'Romance'
  },
  {
    id: 'chinese',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    icon: '🇨🇳',
    resources: ['nihaocafe', 'lingopie-chinese'],
    difficulty: 'very-hard',
    speakers: '1.1 billion',
    family: 'Sino-Tibetan'
  },
  {
    id: 'african',
    name: 'African Languages',
    nativeName: 'Various',
    icon: '🌍',
    resources: ['dialogue-africa', 'vutuka', 'nkenne', 'yekola', 'unisa'],
    difficulty: 'varies',
    speakers: '2000+ languages',
    family: 'Various'
  },
  {
    id: 'aave',
    name: 'AAVE',
    nativeName: 'African American Vernacular English',
    icon: '🗣️',
    resources: ['talking-black', 'oraal', 'aave-study'],
    difficulty: 'medium',
    speakers: '30+ million',
    family: 'English Creole'
  },
  {
    id: 'blackfoot',
    name: 'Blackfoot',
    nativeName: 'Siksiká',
    icon: '🦬',
    resources: ['learnblackfoot', 'blackfoot-algonquian', 'glenbow', 'galt-museum'],
    difficulty: 'very-hard',
    speakers: '~5,000',
    family: 'Algonquian'
  }
];

// ============================================================================
// RESOURCES
// ============================================================================

export const LANGUAGE_RESOURCES: LanguageResource[] = [
  // GENERAL PLATFORMS
  {
    id: 'lingua',
    name: 'Lingua.com',
    url: 'https://lingua.com/',
    embedUrl: 'https://lingua.com/',
    canEmbed: true,
    category: 'reading',
    languages: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese'],
    description: 'Free reading texts with comprehension questions',
    features: ['Reading practice', 'Comprehension tests', 'Audio', 'Multiple levels'],
    pricing: 'free',
    icon: '📖',
    level: ['beginner', 'intermediate']
  },
  {
    id: 'languagepod101',
    name: 'LanguagePod101',
    url: 'https://languagepod101.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['japanese', 'korean', 'chinese', 'spanish', 'french', 'german', 'italian'],
    description: 'Podcast-based language courses with audio lessons',
    features: ['Audio lessons', 'Vocabulary', 'Grammar', 'Cultural notes'],
    pricing: 'freemium',
    icon: '🎧',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'busuu',
    name: 'Busuu',
    url: 'https://www.busuu.com/',
    canEmbed: true,
    category: 'courses',
    languages: ['spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese', 'korean', 'russian', 'arabic', 'turkish', 'polish'],
    description: 'AI-powered language learning with native speaker feedback',
    features: ['AI tutor', 'Native feedback', 'Grammar units', 'Vocabulary trainer'],
    pricing: 'freemium',
    icon: '💬',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'hinative',
    name: 'HiNative',
    url: 'https://hinative.com/',
    embedUrl: 'https://hinative.com/',
    canEmbed: true,
    category: 'community',
    languages: ['all'],
    description: 'Q&A platform to ask native speakers questions',
    features: ['Native speaker answers', 'Pronunciation check', 'Cultural questions'],
    pricing: 'freemium',
    icon: '❓',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'tandem',
    name: 'Tandem',
    url: 'https://tandem.net/',
    canEmbed: false,
    category: 'speaking',
    languages: ['all'],
    description: 'Language exchange app to chat with native speakers',
    features: ['Video calls', 'Text chat', 'Corrections', 'Translation'],
    pricing: 'freemium',
    icon: '👥'
  },
  {
    id: 'coursera-languages',
    name: 'Coursera Languages',
    url: 'https://www.coursera.org/browse/language-learning',
    canEmbed: true,
    category: 'courses',
    languages: ['all'],
    description: 'University-level language courses from top institutions',
    features: ['University courses', 'Certificates', 'Structured learning'],
    pricing: 'freemium',
    icon: '🎓',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'edx',
    name: 'edX',
    url: 'https://www.edx.org/',
    canEmbed: true,
    category: 'courses',
    languages: ['all'],
    description: 'Free online courses from Harvard, MIT, and more',
    features: ['University courses', 'Certificates', 'Self-paced'],
    pricing: 'freemium',
    icon: '🏛️'
  },
  {
    id: 'classcentral',
    name: 'Class Central',
    url: 'https://www.classcentral.com/',
    canEmbed: true,
    category: 'courses',
    languages: ['all'],
    description: 'Aggregator of free online courses from top universities',
    features: ['Course search', 'Reviews', 'Multiple platforms'],
    pricing: 'free',
    icon: '🔍'
  },
  {
    id: 'openlearn',
    name: 'OpenLearn Languages',
    url: 'https://www.open.edu/openlearn/languages/free-courses',
    canEmbed: true,
    category: 'courses',
    languages: ['french', 'german', 'spanish', 'italian', 'chinese', 'welsh'],
    description: 'Free courses from The Open University',
    features: ['Structured courses', 'Certificates', 'Quality content'],
    pricing: 'free',
    icon: '📚',
    level: ['beginner', 'intermediate']
  },
  {
    id: 'openculture',
    name: 'Open Culture Languages',
    url: 'https://www.openculture.com/freelanguagelessons',
    canEmbed: true,
    category: 'courses',
    languages: ['48+ languages'],
    description: 'Curated free language lessons from around the web',
    features: ['48+ languages', 'Audio lessons', 'Video lessons', 'Apps'],
    pricing: 'free',
    icon: '🌐'
  },
  {
    id: 'fluentu',
    name: 'FluentU Resources',
    url: 'https://www.fluentu.com/blog/learn/free-language-learning-websites/',
    canEmbed: true,
    category: 'media',
    languages: ['all'],
    description: 'Learn languages through real-world videos',
    features: ['Real videos', 'Interactive subtitles', 'Vocabulary'],
    pricing: 'freemium',
    icon: '🎬'
  },
  {
    id: 'livelingua',
    name: 'Live Lingua',
    url: 'https://www.livelingua.com/courses',
    canEmbed: true,
    category: 'courses',
    languages: ['130+ languages'],
    description: 'Free FSI, DLI, and Peace Corps language courses',
    features: ['Government courses', 'Audio', 'PDFs', 'Rare languages'],
    pricing: 'free',
    icon: '🗂️'
  },

  // JAPANESE SPECIFIC
  {
    id: 'tofugu',
    name: 'Tofugu',
    url: 'https://www.tofugu.com/learn-japanese/',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Comprehensive Japanese learning guide and resources',
    features: ['Learning path', 'Kanji guide', 'Grammar', 'Culture'],
    pricing: 'free',
    icon: '🗾',
    level: ['beginner', 'intermediate']
  },
  {
    id: 'nhk-world',
    name: 'NHK World Japan',
    url: 'https://www3.nhk.or.jp/nhkworld/',
    embedUrl: 'https://www3.nhk.or.jp/nhkworld/',
    canEmbed: true,
    category: 'media',
    languages: ['japanese'],
    description: 'Japanese news, shows, and language lessons',
    features: ['Live TV', 'News', 'Language lessons', 'Culture shows'],
    pricing: 'free',
    icon: '📺'
  },
  {
    id: 'minato',
    name: 'Minato',
    url: 'https://minato-jf.jp/',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Japan Foundation official Japanese learning platform',
    features: ['JLPT prep', 'Structured courses', 'Self-study', 'Tests'],
    pricing: 'free',
    icon: '🏫',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'kanshudo',
    name: 'Kanshudo',
    url: 'https://www.kanshudo.com/',
    canEmbed: true,
    category: 'vocabulary',
    languages: ['japanese'],
    description: 'AI-powered Japanese learning with kanji focus',
    features: ['Kanji learning', 'SRS', 'Reading practice', 'Grammar'],
    pricing: 'freemium',
    icon: '漢',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'nihongo-ena',
    name: 'Nihongo e-Na',
    url: 'https://nihongo-e-na.com/eng',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Portal of Japanese learning websites and resources',
    features: ['Resource portal', 'App reviews', 'Website directory'],
    pricing: 'free',
    icon: '🔗'
  },
  {
    id: 'kicl',
    name: 'Kyoto KICL',
    url: 'https://www.kicl.ac.jp/en/',
    canEmbed: false,
    category: 'courses',
    languages: ['japanese'],
    description: 'Kyoto Institute of Culture and Language',
    features: ['Professional courses', 'JLPT prep', 'Cultural immersion'],
    pricing: 'free-trial',
    icon: '🎌'
  },
  {
    id: 'japaneeds',
    name: 'Japaneeds E-Learning',
    url: 'https://hh-japaneeds.com/e-learning/',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Japanese e-learning courses and materials',
    features: ['Online courses', 'Business Japanese', 'JLPT'],
    pricing: 'freemium',
    icon: '💼'
  },
  {
    id: 'alison-japanese',
    name: 'Alison Japanese',
    url: 'https://alison.com/tag/japanese-language',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Free certified Japanese courses',
    features: ['Certificates', 'Self-paced', 'Structured'],
    pricing: 'free',
    icon: '📜'
  },
  {
    id: 'cursa-japanese',
    name: 'Cursa Japanese',
    url: 'https://cursa.app/free-courses-japanese-online',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Free online Japanese courses',
    features: ['Video lessons', 'Certificates', 'Mobile app'],
    pricing: 'free',
    icon: '📱'
  },
  {
    id: 'udemy-japanese',
    name: 'Udemy Free Japanese',
    url: 'https://www.udemy.com/topic/japanese-language/free/',
    canEmbed: true,
    category: 'courses',
    languages: ['japanese'],
    description: 'Free Japanese courses on Udemy',
    features: ['Video courses', 'Variety of teachers', 'Self-paced'],
    pricing: 'free',
    icon: '🎥'
  },
  {
    id: 'hayai',
    name: 'Hayai Learn',
    url: 'https://www.hayailearn.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['japanese'],
    description: 'Fast-track Japanese learning',
    features: ['Accelerated learning', 'Speaking focus', 'Tutoring'],
    pricing: 'freemium',
    icon: '⚡'
  },

  // KOREAN SPECIFIC
  {
    id: 'howtostudykorean',
    name: 'How To Study Korean',
    url: 'https://www.howtostudykorean.com/',
    canEmbed: true,
    category: 'grammar',
    languages: ['korean'],
    description: 'Comprehensive free Korean grammar lessons',
    features: ['150+ lessons', 'Grammar focus', 'Audio', 'Worksheets'],
    pricing: 'free',
    icon: '📝',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'yonsei',
    name: 'Yonsei Korean',
    url: 'https://glc.yonsei.ac.kr/en/outline3/',
    canEmbed: false,
    category: 'courses',
    languages: ['korean'],
    description: 'Yonsei University Korean language programs',
    features: ['University course', 'Structured curriculum', 'Certification'],
    pricing: 'freemium',
    icon: '🏛️'
  },
  {
    id: 'goodjobkorean',
    name: 'Good Job Korean',
    url: 'https://www.goodjobkorean.com/',
    canEmbed: true,
    category: 'courses',
    languages: ['korean'],
    description: 'Korean lessons for all levels',
    features: ['Structured lessons', 'Speaking practice', 'Culture'],
    pricing: 'freemium',
    icon: '👍'
  },
  {
    id: 'alison-korean',
    name: 'Alison Korean',
    url: 'https://alison.com/tag/korean-language',
    canEmbed: true,
    category: 'courses',
    languages: ['korean'],
    description: 'Free certified Korean courses',
    features: ['Certificates', 'Self-paced'],
    pricing: 'free',
    icon: '📜'
  },
  {
    id: 'cursa-korean',
    name: 'Cursa Korean',
    url: 'https://cursa.app/free-courses-korean-online',
    canEmbed: true,
    category: 'courses',
    languages: ['korean'],
    description: 'Free online Korean courses',
    features: ['Video lessons', 'Mobile app'],
    pricing: 'free',
    icon: '📱'
  },
  {
    id: 'coursera-korean',
    name: 'Coursera Korean',
    url: 'https://www.coursera.org/learn/learn-korean',
    canEmbed: true,
    category: 'courses',
    languages: ['korean'],
    description: 'Learn Korean from Yonsei University',
    features: ['University course', 'Certificate', 'Structured'],
    pricing: 'freemium',
    icon: '🎓'
  },

  // GERMAN SPECIFIC
  {
    id: 'dw-german',
    name: 'DW Learn German',
    url: 'https://learngerman.dw.com/en/learn-german/s-9528',
    embedUrl: 'https://learngerman.dw.com/en/learn-german/s-9528',
    canEmbed: true,
    category: 'courses',
    languages: ['german'],
    description: 'Deutsche Welle free German courses A1-C1',
    features: ['A1-C1 levels', 'Video courses', 'Interactive', 'News'],
    pricing: 'free',
    icon: '🇩🇪',
    level: ['beginner', 'intermediate', 'advanced']
  },
  {
    id: 'deutsch-info',
    name: 'Deutsch.info',
    url: 'https://deutsch.info/?hl=en',
    canEmbed: true,
    category: 'courses',
    languages: ['german'],
    description: 'Free multilingual German course',
    features: ['12 languages', 'Grammar', 'Vocabulary', 'Practice'],
    pricing: 'free',
    icon: '🔤'
  },
  {
    id: 'alison-german',
    name: 'Alison German',
    url: 'https://alison.com/tag/german-language',
    canEmbed: true,
    category: 'courses',
    languages: ['german'],
    description: 'Free certified German courses',
    features: ['Certificates', 'Self-paced'],
    pricing: 'free',
    icon: '📜'
  },
  {
    id: 'cursa-german',
    name: 'Cursa German',
    url: 'https://cursa.app/free-courses-german-online',
    canEmbed: true,
    category: 'courses',
    languages: ['german'],
    description: 'Free online German courses',
    features: ['Video lessons', 'Mobile app'],
    pricing: 'free',
    icon: '📱'
  },
  {
    id: 'openlearn-german',
    name: 'OpenLearn German',
    url: 'https://www.open.edu/openlearn/languages/german/beginners-german-places-and-people/content-section-0',
    canEmbed: true,
    category: 'courses',
    languages: ['german'],
    description: 'Open University German course',
    features: ['Structured', 'Free certificate', 'Quality'],
    pricing: 'free',
    icon: '📚'
  },

  // SPANISH SPECIFIC
  {
    id: 'cursa-spanish',
    name: 'Cursa Spanish',
    url: 'https://cursa.app/free-courses-spanish-online',
    canEmbed: true,
    category: 'courses',
    languages: ['spanish'],
    description: 'Free online Spanish courses',
    features: ['Video lessons', 'Mobile app'],
    pricing: 'free',
    icon: '📱'
  },
  {
    id: 'alison-spanish',
    name: 'Alison Spanish',
    url: 'https://alison.com/tag/spanish-language',
    canEmbed: true,
    category: 'courses',
    languages: ['spanish'],
    description: 'Free certified Spanish courses',
    features: ['Certificates', 'Self-paced'],
    pricing: 'free',
    icon: '📜'
  },
  {
    id: 'edx-spanish',
    name: 'edX Spanish',
    url: 'https://www.edx.org/learn/spanish',
    canEmbed: true,
    category: 'courses',
    languages: ['spanish'],
    description: 'University Spanish courses',
    features: ['University level', 'Certificates'],
    pricing: 'freemium',
    icon: '🎓'
  },
  {
    id: 'upv',
    name: 'UPV Spanish',
    url: 'https://www.upv.es/entidades/OPII/infoweb/pi/info/1205137normali.html',
    canEmbed: false,
    category: 'courses',
    languages: ['spanish'],
    description: 'Polytechnic University of Valencia Spanish courses',
    features: ['University course', 'In-person options'],
    pricing: 'free',
    icon: '🏛️'
  },

  // FRENCH SPECIFIC
  {
    id: 'futurelearn-french',
    name: 'FutureLearn French',
    url: 'https://www.futurelearn.com/subjects/language-courses/french',
    canEmbed: true,
    category: 'courses',
    languages: ['french'],
    description: 'Free French courses from top institutions',
    features: ['University courses', 'Certificates', 'Community'],
    pricing: 'freemium',
    icon: '🎓'
  },
  {
    id: 'cudoo-french',
    name: 'Cudoo French',
    url: 'https://cudoo.com/learn-french-online',
    canEmbed: true,
    category: 'courses',
    languages: ['french'],
    description: 'Online French courses',
    features: ['Structured courses', 'Certificates'],
    pricing: 'freemium',
    icon: '📚'
  },
  {
    id: 'openlearn-french',
    name: 'OpenLearn French',
    url: 'https://www.open.edu/openlearn/education-development/university-ready/free-online-french-courses',
    canEmbed: true,
    category: 'courses',
    languages: ['french'],
    description: 'Open University French courses',
    features: ['Free', 'Structured', 'Quality'],
    pricing: 'free',
    icon: '📖'
  },
  {
    id: 'iifls',
    name: 'IIFLS French',
    url: 'https://iifls.com/learn-french-online/',
    canEmbed: false,
    category: 'courses',
    languages: ['french'],
    description: 'International Institute for French Language Studies',
    features: ['Professional courses', 'Tutoring'],
    pricing: 'freemium',
    icon: '🇫🇷'
  },
  {
    id: 'campusfrance',
    name: 'Campus France',
    url: 'https://www.usa.campusfrance.org/learn-french',
    canEmbed: false,
    category: 'courses',
    languages: ['french'],
    description: 'Official French government language resources',
    features: ['Official resources', 'Study in France info'],
    pricing: 'free',
    icon: '🏛️'
  },
  {
    id: 'berliners',
    name: 'Berliner\'s French',
    url: 'https://berliners-institute.com/french-language-courses/',
    canEmbed: false,
    category: 'courses',
    languages: ['french'],
    description: 'Berliner\'s Institute French courses',
    features: ['Professional', 'Multiple levels'],
    pricing: 'freemium',
    icon: '🎓'
  },
  {
    id: 'edx-french',
    name: 'edX French',
    url: 'https://www.edx.org/learn/french',
    canEmbed: true,
    category: 'courses',
    languages: ['french'],
    description: 'University French courses',
    features: ['University level', 'Certificates'],
    pricing: 'freemium',
    icon: '🎓'
  },

  // CHINESE SPECIFIC
  {
    id: 'nihaocafe',
    name: 'Nihao Cafe',
    url: 'https://www.nihaocafe.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['chinese'],
    description: 'Chinese learning with native tutors',
    features: ['Tutoring', 'Conversation', 'HSK prep'],
    pricing: 'freemium',
    icon: '☕'
  },
  {
    id: 'lingopie-chinese',
    name: 'Lingopie',
    url: 'https://try.lingopie.com/',
    canEmbed: false,
    category: 'media',
    languages: ['chinese', 'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean'],
    description: 'Learn languages by watching TV shows',
    features: ['TV shows', 'Interactive subtitles', 'Vocabulary'],
    pricing: 'free-trial',
    icon: '📺'
  },

  // AFRICAN LANGUAGES
  {
    id: 'dialogue-africa',
    name: 'Dialogue Africa',
    url: 'https://www.dialogue-africa.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['african'],
    description: 'African language learning platform',
    features: ['Multiple African languages', 'Cultural context'],
    pricing: 'freemium',
    icon: '🌍'
  },
  {
    id: 'vutuka',
    name: 'Vutuka',
    url: 'https://www.vutuka.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['african'],
    description: 'Learn African languages online',
    features: ['Swahili', 'Zulu', 'Yoruba', 'More'],
    pricing: 'freemium',
    icon: '🗣️'
  },
  {
    id: 'nkenne',
    name: 'Nkenne',
    url: 'https://www.nkenne.com/',
    canEmbed: false,
    category: 'courses',
    languages: ['african'],
    description: 'Learn Igbo and other African languages',
    features: ['Igbo focus', 'Cultural lessons'],
    pricing: 'freemium',
    icon: '🇳🇬'
  },
  {
    id: 'yekola',
    name: 'Yekola',
    url: 'https://yekola.app/',
    canEmbed: false,
    category: 'apps',
    languages: ['african'],
    description: 'African language learning app',
    features: ['Mobile app', 'Gamified learning'],
    pricing: 'freemium',
    icon: '📱'
  },
  {
    id: 'unisa',
    name: 'UNISA Free African Languages',
    url: 'https://www.unisa.ac.za/sites/myunisa/default/News/Articles/Learn-an-African-language-for-free',
    canEmbed: true,
    category: 'courses',
    languages: ['african'],
    description: 'Free African language courses from University of South Africa',
    features: ['University courses', 'Multiple languages', 'Free'],
    pricing: 'free',
    icon: '🎓'
  },

  // BLACKFOOT
  {
    id: 'learnblackfoot',
    name: 'Learn Blackfoot',
    url: 'https://learnblackfoot.ca/',
    canEmbed: true,
    category: 'courses',
    languages: ['blackfoot'],
    description: 'Online Blackfoot language learning',
    features: ['Audio lessons', 'Vocabulary', 'Culture'],
    pricing: 'free',
    icon: '🦬'
  },
  {
    id: 'blackfoot-algonquian',
    name: 'Blackfoot Algonquian',
    url: 'https://blackfoot.algonquianlanguages.ca/',
    canEmbed: true,
    category: 'courses',
    languages: ['blackfoot'],
    description: 'Blackfoot language resources and dictionary',
    features: ['Dictionary', 'Grammar', 'Audio'],
    pricing: 'free',
    icon: '📖'
  },
  {
    id: 'glenbow',
    name: 'Glenbow Blackfoot',
    url: 'https://www.glenbow.org/blackfoot/teacher_toolkit/english/culture/language.htm',
    canEmbed: true,
    category: 'courses',
    languages: ['blackfoot'],
    description: 'Glenbow Museum Blackfoot language resources',
    features: ['Educational', 'Cultural context', 'For teachers'],
    pricing: 'free',
    icon: '🏛️'
  },
  {
    id: 'galt-museum',
    name: 'Galt Museum Blackfoot',
    url: 'https://www.galtmuseum.com/blackfoot-language-workbook',
    canEmbed: false,
    category: 'courses',
    languages: ['blackfoot'],
    description: 'Blackfoot language workbook',
    features: ['Workbook', 'Exercises', 'Audio'],
    pricing: 'free',
    icon: '📝'
  },
  {
    id: 'newjourneys',
    name: 'New Journeys Blackfoot',
    url: 'https://newjourneys.ca/articles/resources-for-learning-blackfoot',
    canEmbed: true,
    category: 'courses',
    languages: ['blackfoot'],
    description: 'Curated Blackfoot learning resources',
    features: ['Resource list', 'Community resources'],
    pricing: 'free',
    icon: '🔗'
  },

  // AAVE
  {
    id: 'talking-black',
    name: 'Talking Black in America',
    url: 'https://www.talkingblackinamerica.org/',
    canEmbed: true,
    category: 'media',
    languages: ['aave'],
    description: 'Documentary and resources about AAVE',
    features: ['Documentary', 'Educational', 'History'],
    pricing: 'free',
    icon: '🎬'
  },
  {
    id: 'oraal',
    name: 'ORAAL Glossary',
    url: 'https://oraal.github.io/glossary',
    canEmbed: true,
    category: 'vocabulary',
    languages: ['aave'],
    description: 'Online Resources for African American Language glossary',
    features: ['Glossary', 'Academic', 'Linguistic'],
    pricing: 'free',
    icon: '📚'
  },
  {
    id: 'aave-study',
    name: 'AAVE Overview',
    url: 'https://study.com/academy/lesson/aave-african-american-vernacular-english-overview-examples.html',
    canEmbed: false,
    category: 'courses',
    languages: ['aave'],
    description: 'Academic overview of AAVE',
    features: ['Educational', 'Examples', 'History'],
    pricing: 'freemium',
    icon: '📖'
  },
  {
    id: 'cafetalk-aave',
    name: 'Cafetalk AAVE',
    url: 'https://cafetalk.com/lesson/detail/?c=eJwzNKoI9DUPLTB0DQl3TfJKCbT0cylOt7UFAFrpB2A.&lang=it',
    canEmbed: false,
    category: 'speaking',
    languages: ['aave'],
    description: 'AAVE lessons with tutors',
    features: ['Tutoring', 'Conversation practice'],
    pricing: 'freemium',
    icon: '👥'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getResourcesByLanguage = (languageId: string): LanguageResource[] => {
  return LANGUAGE_RESOURCES.filter(r =>
    r.languages.includes(languageId) || r.languages.includes('all')
  );
};

export const getResourcesByCategory = (category: ResourceCategory): LanguageResource[] => {
  return LANGUAGE_RESOURCES.filter(r => r.category === category);
};

export const getFreeResources = (): LanguageResource[] => {
  return LANGUAGE_RESOURCES.filter(r => r.pricing === 'free');
};

export const getEmbeddableResources = (): LanguageResource[] => {
  return LANGUAGE_RESOURCES.filter(r => r.canEmbed);
};

export const getLanguageStats = () => ({
  totalLanguages: LANGUAGES.length,
  totalResources: LANGUAGE_RESOURCES.length,
  freeResources: getFreeResources().length,
  embeddableResources: getEmbeddableResources().length
});

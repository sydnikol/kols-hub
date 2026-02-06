/**
 * OpenCulture & Free Learning Database
 * =====================================
 * Comprehensive free educational resources from OpenCulture and beyond
 */

// ============================================================================
// TYPES
// ============================================================================

export interface OpenCultureCategory {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  subcategories?: string[];
  itemCount?: string;
}

export interface FreeResource {
  id: string;
  name: string;
  url: string;
  embedUrl?: string;
  canEmbed: boolean;
  category: string;
  subcategory?: string;
  description: string;
  features: string[];
  icon: string;
  source: 'openculture' | 'other';
}

// ============================================================================
// OPENCULTURE CATEGORIES
// ============================================================================

export const OPENCULTURE_CATEGORIES: OpenCultureCategory[] = [
  // COURSES
  {
    id: 'free-courses',
    name: 'Free Online Courses',
    url: 'https://www.openculture.com/freeonlinecourses',
    icon: '🎓',
    description: '1,700+ free online courses from top universities',
    itemCount: '1,700+'
  },
  {
    id: 'online-degrees',
    name: 'Free Online Degrees',
    url: 'https://www.openculture.com/online-degrees',
    icon: '🎓',
    description: 'Free degree programs and certifications',
    itemCount: '100+'
  },
  {
    id: 'business-courses',
    name: 'Business Courses',
    url: 'https://www.openculture.com/business_free_courses',
    icon: '💼',
    description: 'Free business, MBA, and entrepreneurship courses'
  },
  {
    id: 'cs-textbooks',
    name: 'Computer Science Textbooks',
    url: 'https://www.openculture.com/free-computer-science-textbooks',
    icon: '💻',
    description: 'Free computer science textbooks and resources'
  },
  {
    id: 'physics-textbooks',
    name: 'Physics Textbooks',
    url: 'https://www.openculture.com/free-physics-textbooks',
    icon: '⚛️',
    description: 'Free physics textbooks and educational materials'
  },
  {
    id: 'textbooks',
    name: 'Free Textbooks',
    url: 'https://www.openculture.com/free_textbooks',
    icon: '📚',
    description: 'Free textbooks across all subjects'
  },

  // MEDIA
  {
    id: 'free-movies',
    name: 'Free Movies',
    url: 'https://www.openculture.com/freemoviesonline',
    icon: '🎬',
    description: '1,150+ free movies including classics and indie films',
    itemCount: '1,150+'
  },
  {
    id: 'audiobooks',
    name: 'Free Audio Books',
    url: 'https://www.openculture.com/freeaudiobooks',
    icon: '🎧',
    description: '1,000+ free audio books and spoken word',
    itemCount: '1,000+'
  },

  // ACADEMIC SUBJECTS
  {
    id: 'philosophy',
    name: 'Philosophy',
    url: 'https://www.openculture.com/category/philosophy',
    icon: '🤔',
    description: 'Philosophy courses, ebooks, and resources'
  },
  {
    id: 'philosophy-ebooks',
    name: 'Philosophy eBooks',
    url: 'https://www.openculture.com/free-philosophy-ebooks',
    icon: '📖',
    description: 'Free philosophy ebooks and texts'
  },
  {
    id: 'science',
    name: 'Science',
    url: 'https://www.openculture.com/category/science',
    icon: '🔬',
    description: 'Science courses, articles, and resources'
  },
  {
    id: 'physics',
    name: 'Physics',
    url: 'https://www.openculture.com/category/physics',
    icon: '⚛️',
    description: 'Physics education and resources'
  },
  {
    id: 'math',
    name: 'Mathematics',
    url: 'https://www.openculture.com/category/math',
    icon: '🔢',
    description: 'Math courses and educational content'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    url: 'https://www.openculture.com/category/chemistry',
    icon: '🧪',
    description: 'Chemistry courses and resources'
  },
  {
    id: 'biology',
    name: 'Biology',
    url: 'https://www.openculture.com/category/biology-2',
    icon: '🧬',
    description: 'Biology courses and educational content'
  },
  {
    id: 'neuroscience',
    name: 'Neuroscience',
    url: 'https://www.openculture.com/category/neuroscience',
    icon: '🧠',
    description: 'Neuroscience and brain science resources'
  },

  // ARTS & HUMANITIES
  {
    id: 'art',
    name: 'Art',
    url: 'https://www.openculture.com/category/art',
    icon: '🎨',
    description: 'Art history, techniques, and resources'
  },
  {
    id: 'architecture',
    name: 'Architecture',
    url: 'https://www.openculture.com/category/architecture-2',
    icon: '🏛️',
    description: 'Architecture courses and resources'
  },
  {
    id: 'design',
    name: 'Design',
    url: 'https://www.openculture.com/category/design-2',
    icon: '✏️',
    description: 'Design courses and creative resources'
  },
  {
    id: 'photography',
    name: 'Photography',
    url: 'https://www.openculture.com/category/photography-2',
    icon: '📷',
    description: 'Photography techniques and tutorials'
  },
  {
    id: 'film',
    name: 'Film',
    url: 'https://www.openculture.com/category/film',
    icon: '🎥',
    description: 'Film studies and cinema resources'
  },
  {
    id: 'animation',
    name: 'Animation',
    url: 'https://www.openculture.com/category/animation-2',
    icon: '🎞️',
    description: 'Animation techniques and history'
  },

  // MUSIC & PERFORMING ARTS
  {
    id: 'music',
    name: 'Music',
    url: 'https://www.openculture.com/category/music',
    icon: '🎵',
    description: 'Music education and history'
  },
  {
    id: 'jazz',
    name: 'Jazz',
    url: 'https://www.openculture.com/category/jazz',
    icon: '🎷',
    description: 'Jazz music history and education'
  },
  {
    id: 'opera',
    name: 'Opera',
    url: 'https://www.openculture.com/category/opera',
    icon: '🎭',
    description: 'Opera performances and education'
  },
  {
    id: 'dance',
    name: 'Dance',
    url: 'https://www.openculture.com/category/dance',
    icon: '💃',
    description: 'Dance performances and tutorials'
  },
  {
    id: 'theater',
    name: 'Theater',
    url: 'https://www.openculture.com/category/theater',
    icon: '🎪',
    description: 'Theater and performing arts'
  },

  // LITERATURE & LANGUAGE
  {
    id: 'poetry',
    name: 'Poetry',
    url: 'https://www.openculture.com/category/poetry',
    icon: '📜',
    description: 'Poetry readings and analysis'
  },
  {
    id: 'comics',
    name: 'Comics',
    url: 'https://www.openculture.com/category/comics',
    icon: '💬',
    description: 'Comics, graphic novels, and sequential art'
  },
  {
    id: 'coloring-books',
    name: 'Coloring Books',
    url: 'https://www.openculture.com/category/coloring-books',
    icon: '🖍️',
    description: 'Free coloring books for all ages'
  },

  // SOCIAL SCIENCES
  {
    id: 'politics',
    name: 'Politics',
    url: 'https://www.openculture.com/category/politics',
    icon: '🏛️',
    description: 'Political science and current affairs'
  },
  {
    id: 'law',
    name: 'Law',
    url: 'https://www.openculture.com/category/law',
    icon: '⚖️',
    description: 'Law courses and legal education'
  },
  {
    id: 'business',
    name: 'Business',
    url: 'https://www.openculture.com/category/business',
    icon: '📊',
    description: 'Business and economics resources'
  },

  // TECHNOLOGY
  {
    id: 'technology',
    name: 'Technology',
    url: 'https://www.openculture.com/category/technology',
    icon: '💾',
    description: 'Technology news and education'
  },
  {
    id: 'software',
    name: 'Software',
    url: 'https://www.openculture.com/category/software',
    icon: '💻',
    description: 'Software tutorials and resources'
  },
  {
    id: 'video-games',
    name: 'Video Games',
    url: 'https://www.openculture.com/category/video-games',
    icon: '🎮',
    description: 'Video game history and culture'
  },

  // LIFESTYLE
  {
    id: 'life',
    name: 'Life',
    url: 'https://www.openculture.com/category/life',
    icon: '🌱',
    description: 'Life skills and personal development'
  },
  {
    id: 'creativity',
    name: 'Creativity',
    url: 'https://www.openculture.com/category/creativity-2',
    icon: '💡',
    description: 'Creative thinking and innovation'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    url: 'https://www.openculture.com/category/fashion',
    icon: '👗',
    description: 'Fashion history and design'
  },
  {
    id: 'comedy',
    name: 'Comedy',
    url: 'https://www.openculture.com/category/comedy',
    icon: '😂',
    description: 'Comedy performances and history'
  },

  // MEDIA
  {
    id: 'television',
    name: 'Television',
    url: 'https://www.openculture.com/category/television',
    icon: '📺',
    description: 'TV history and classic shows'
  },
  {
    id: 'radio',
    name: 'Radio',
    url: 'https://www.openculture.com/category/radio-2',
    icon: '📻',
    description: 'Classic radio shows and podcasts'
  },
  {
    id: 'podcasts',
    name: 'Podcasts',
    url: 'https://www.openculture.com/category/podcast_articles_and_resources',
    icon: '🎙️',
    description: 'Podcast recommendations and resources'
  },
  {
    id: 'sci-fi',
    name: 'Sci-Fi',
    url: 'https://www.openculture.com/category/sci_fi',
    icon: '🚀',
    description: 'Science fiction media and literature'
  },

  // LEARNING
  {
    id: 'how-to-learn',
    name: 'How to Learn',
    url: 'https://www.openculture.com/category/how-to-learn-for-free',
    icon: '📚',
    description: 'Meta-learning and study techniques'
  }
];

// ============================================================================
// ADDITIONAL FREE RESOURCES
// ============================================================================

export const FREE_LEARNING_RESOURCES: FreeResource[] = [
  // Documentaries
  {
    id: 'topdocfilms',
    name: 'Top Documentary Films',
    url: 'https://topdocumentaryfilms.com/',
    embedUrl: 'https://topdocumentaryfilms.com/',
    canEmbed: true,
    category: 'documentaries',
    description: 'Free streaming documentaries on every topic',
    features: ['Free streaming', 'All genres', 'Curated collections'],
    icon: '🎬',
    source: 'other'
  },
  {
    id: 'documentaryheaven',
    name: 'Documentary Heaven',
    url: 'https://documentaryheaven.com/',
    embedUrl: 'https://documentaryheaven.com/',
    canEmbed: true,
    category: 'documentaries',
    description: 'Free documentary streaming site',
    features: ['Free documentaries', 'Multiple categories', 'User ratings'],
    icon: '📺',
    source: 'other'
  },

  // Educational
  {
    id: 'ted',
    name: 'TED',
    url: 'https://www.ted.com/',
    embedUrl: 'https://www.ted.com/',
    canEmbed: true,
    category: 'lectures',
    description: 'Ideas worth spreading - talks from experts worldwide',
    features: ['Expert talks', 'Subtitles', 'Playlists', 'Topics'],
    icon: '🎤',
    source: 'other'
  },
  {
    id: 'academicearth',
    name: 'Academic Earth',
    url: 'https://academicearth.org/',
    embedUrl: 'https://academicearth.org/',
    canEmbed: true,
    category: 'courses',
    description: 'Free university courses online',
    features: ['University lectures', 'Multiple subjects', 'Free access'],
    icon: '🌍',
    source: 'other'
  },
  {
    id: 'udacity',
    name: 'Udacity',
    url: 'https://www.udacity.com/',
    canEmbed: true,
    category: 'tech-courses',
    description: 'Tech-focused courses and nanodegrees',
    features: ['Tech courses', 'Projects', 'Free content available'],
    icon: '💻',
    source: 'other'
  },
  {
    id: 'codecademy',
    name: 'Codecademy',
    url: 'https://www.codecademy.com/',
    canEmbed: true,
    category: 'coding',
    description: 'Interactive coding courses',
    features: ['Interactive', 'Multiple languages', 'Free tier'],
    icon: '👨‍💻',
    source: 'other'
  },
  {
    id: 'unplugtv',
    name: 'Unplug The TV',
    url: 'https://unplugthetv.com/',
    canEmbed: true,
    category: 'random-learning',
    description: 'Random educational videos instead of TV',
    features: ['Random videos', 'Educational', 'Entertainment'],
    icon: '📺',
    source: 'other'
  },

  // Programming
  {
    id: 'htmldog',
    name: 'HTML Dog',
    url: 'https://htmldog.com/',
    embedUrl: 'https://htmldog.com/',
    canEmbed: true,
    category: 'web-dev',
    description: 'Free HTML, CSS, and JavaScript tutorials',
    features: ['HTML/CSS/JS', 'Beginner friendly', 'References'],
    icon: '🐕',
    source: 'other'
  },
  {
    id: 'learncodethehardway',
    name: 'Learn Code The Hard Way',
    url: 'https://learncodethehardway.org/',
    canEmbed: false,
    category: 'coding',
    description: 'Learn programming the hard way',
    features: ['Python', 'Ruby', 'C', 'Rigorous'],
    icon: '💪',
    source: 'other'
  },
  {
    id: 'codingbat',
    name: 'CodingBat',
    url: 'https://codingbat.com/java',
    embedUrl: 'https://codingbat.com/java',
    canEmbed: true,
    category: 'coding',
    description: 'Java and Python coding practice problems',
    features: ['Practice problems', 'Instant feedback', 'Progress tracking'],
    icon: '🦇',
    source: 'other'
  },
  {
    id: 'projecteuler',
    name: 'Project Euler',
    url: 'https://projecteuler.net/',
    embedUrl: 'https://projecteuler.net/',
    canEmbed: true,
    category: 'math-coding',
    description: 'Mathematical programming challenges',
    features: ['Math problems', 'Programming', 'Progressive difficulty'],
    icon: '🔢',
    source: 'other'
  },
  {
    id: 'pluralsight',
    name: 'Pluralsight Skills',
    url: 'https://www.pluralsight.com/product/skills-assessment',
    canEmbed: false,
    category: 'tech-courses',
    description: 'Tech skill assessments and courses',
    features: ['Skill assessment', 'Learning paths', 'Tech focus'],
    icon: '📊',
    source: 'other'
  },

  // How-To & DIY
  {
    id: 'instructables',
    name: 'Instructables',
    url: 'https://www.instructables.com/',
    embedUrl: 'https://www.instructables.com/',
    canEmbed: true,
    category: 'diy',
    description: 'DIY project tutorials and maker community',
    features: ['DIY projects', 'Step-by-step', 'Community'],
    icon: '🔧',
    source: 'other'
  },
  {
    id: 'wonderhowto',
    name: 'WonderHowTo',
    url: 'https://www.wonderhowto.com/',
    embedUrl: 'https://www.wonderhowto.com/',
    canEmbed: true,
    category: 'how-to',
    description: 'How-to guides for everything',
    features: ['Tutorials', 'Hacks', 'Tips'],
    icon: '❓',
    source: 'other'
  },
  {
    id: 'howstuffworks',
    name: 'HowStuffWorks',
    url: 'https://www.howstuffworks.com/',
    embedUrl: 'https://www.howstuffworks.com/',
    canEmbed: true,
    category: 'education',
    description: 'Explains how everything works',
    features: ['Explanations', 'Science', 'Technology'],
    icon: '⚙️',
    source: 'other'
  },
  {
    id: 'howcast',
    name: 'Howcast',
    url: 'https://howcast.com/',
    canEmbed: true,
    category: 'how-to',
    description: 'Video how-to guides',
    features: ['Video tutorials', 'Life skills', 'Entertainment'],
    icon: '🎬',
    source: 'other'
  },
  {
    id: 'thinktutorial',
    name: 'Think Tutorial',
    url: 'https://thinktutorial.com/',
    canEmbed: true,
    category: 'tutorials',
    description: 'Technology and software tutorials',
    features: ['Tech tutorials', 'Software', 'Tips'],
    icon: '💭',
    source: 'other'
  },

  // Literature & Reading
  {
    id: 'poemhunter',
    name: 'Poem Hunter',
    url: 'https://www.poemhunter.com/',
    embedUrl: 'https://www.poemhunter.com/',
    canEmbed: true,
    category: 'poetry',
    description: 'Large collection of poems',
    features: ['Poetry database', 'Poets', 'Analysis'],
    icon: '📜',
    source: 'other'
  },
  {
    id: 'bartleby',
    name: 'Bartleby',
    url: 'https://www.bartleby.com/',
    embedUrl: 'https://www.bartleby.com/',
    canEmbed: true,
    category: 'literature',
    description: 'Classic literature and reference works',
    features: ['Classics', 'Reference', 'Quotations'],
    icon: '📚',
    source: 'other'
  },
  {
    id: 'librivox',
    name: 'LibriVox',
    url: 'https://librivox.org/',
    embedUrl: 'https://librivox.org/',
    canEmbed: true,
    category: 'audiobooks',
    description: 'Free public domain audiobooks',
    features: ['Free audiobooks', 'Volunteer readers', 'Public domain'],
    icon: '🎧',
    source: 'other'
  },

  // Cooking
  {
    id: 'cookingforengineers',
    name: 'Cooking For Engineers',
    url: 'https://www.cookingforengineers.com/',
    embedUrl: 'https://www.cookingforengineers.com/',
    canEmbed: true,
    category: 'cooking',
    description: 'Recipes with engineering precision',
    features: ['Detailed recipes', 'Scientific approach', 'Diagrams'],
    icon: '👨‍🍳',
    source: 'other'
  },
  {
    id: 'reluctantgourmet',
    name: 'Reluctant Gourmet',
    url: 'https://www.reluctantgourmet.com/techniques/',
    embedUrl: 'https://www.reluctantgourmet.com/techniques/',
    canEmbed: true,
    category: 'cooking',
    description: 'Cooking techniques and tutorials',
    features: ['Techniques', 'Tips', 'Recipes'],
    icon: '🍳',
    source: 'other'
  },
  {
    id: 'supercook',
    name: 'Supercook',
    url: 'https://www.supercook.com/',
    embedUrl: 'https://www.supercook.com/',
    canEmbed: true,
    category: 'cooking',
    description: 'Find recipes with ingredients you have',
    features: ['Ingredient search', 'Recipe suggestions', 'Smart matching'],
    icon: '🥘',
    source: 'other'
  },
  {
    id: 'myfridgefood',
    name: 'My Fridge Food',
    url: 'https://myfridgefood.com/',
    embedUrl: 'https://myfridgefood.com/',
    canEmbed: true,
    category: 'cooking',
    description: 'Recipes based on what\'s in your fridge',
    features: ['Ingredient-based', 'Recipe finder', 'Easy to use'],
    icon: '🧊',
    source: 'other'
  },
  {
    id: 'bigoven',
    name: 'BigOven Leftovers',
    url: 'https://www.bigoven.com/use-up-leftovers',
    embedUrl: 'https://www.bigoven.com/use-up-leftovers',
    canEmbed: true,
    category: 'cooking',
    description: 'Use up leftovers with recipe ideas',
    features: ['Leftover recipes', 'Ingredient search', 'Meal planning'],
    icon: '♻️',
    source: 'other'
  },

  // Music Learning
  {
    id: 'howtoplaypiano',
    name: 'How to Play Piano',
    url: 'https://howtoplaypiano.ca/',
    embedUrl: 'https://howtoplaypiano.ca/',
    canEmbed: true,
    category: 'music',
    description: 'Free piano lessons for beginners',
    features: ['Piano lessons', 'Beginner friendly', 'Free'],
    icon: '🎹',
    source: 'other'
  },
  {
    id: 'ultimateguitar',
    name: 'Ultimate Guitar',
    url: 'https://www.ultimate-guitar.com/',
    embedUrl: 'https://www.ultimate-guitar.com/',
    canEmbed: true,
    category: 'music',
    description: 'Guitar tabs and chords',
    features: ['Guitar tabs', 'Chords', 'Large database'],
    icon: '🎸',
    source: 'other'
  },
  {
    id: 'justinguitar',
    name: 'JustinGuitar',
    url: 'https://www.justinguitar.com/',
    embedUrl: 'https://www.justinguitar.com/',
    canEmbed: true,
    category: 'music',
    description: 'Free guitar lessons from beginner to advanced',
    features: ['Video lessons', 'Structured course', 'Free'],
    icon: '🎶',
    source: 'other'
  },

  // Games & Learning
  {
    id: 'chesswebsite',
    name: 'The Chess Website',
    url: 'https://www.thechesswebsite.com/',
    embedUrl: 'https://www.thechesswebsite.com/',
    canEmbed: true,
    category: 'games',
    description: 'Learn chess strategies and tactics',
    features: ['Chess lessons', 'Openings', 'Strategy'],
    icon: '♟️',
    source: 'other'
  },
  {
    id: 'lizardpoint',
    name: 'Lizard Point',
    url: 'https://lizardpoint.com/',
    embedUrl: 'https://lizardpoint.com/',
    canEmbed: true,
    category: 'geography',
    description: 'Geography quizzes and games',
    features: ['Geography quizzes', 'Maps', 'Learning games'],
    icon: '🌍',
    source: 'other'
  },

  // Finance & Investing
  {
    id: 'investopedia',
    name: 'Investopedia',
    url: 'https://www.investopedia.com/investing-4427685',
    embedUrl: 'https://www.investopedia.com/investing-4427685',
    canEmbed: true,
    category: 'finance',
    description: 'Financial education and investing guides',
    features: ['Investment guides', 'Tutorials', 'Simulator'],
    icon: '📈',
    source: 'other'
  },

  // Specialty Sites
  {
    id: 'etymonline',
    name: 'Etymology Online',
    url: 'https://www.etymonline.com/',
    embedUrl: 'https://www.etymonline.com/',
    canEmbed: true,
    category: 'language',
    description: 'Word origins and history',
    features: ['Word origins', 'Etymology', 'Searchable'],
    icon: '📖',
    source: 'other'
  },
  {
    id: 'erowid',
    name: 'Erowid',
    url: 'https://www.erowid.org/',
    canEmbed: false,
    category: 'science',
    description: 'Psychoactive plants and chemicals information',
    features: ['Research', 'Educational', 'Harm reduction'],
    icon: '🌿',
    source: 'other'
  },
  {
    id: 'lesswrong',
    name: 'LessWrong',
    url: 'https://www.lesswrong.com/',
    embedUrl: 'https://www.lesswrong.com/',
    canEmbed: true,
    category: 'rationality',
    description: 'Rationality and decision making community',
    features: ['Rationality', 'AI Safety', 'Critical thinking'],
    icon: '🧠',
    source: 'other'
  },
  {
    id: 'photonet',
    name: 'Photo.net',
    url: 'https://www.photo.net/',
    embedUrl: 'https://www.photo.net/',
    canEmbed: true,
    category: 'photography',
    description: 'Photography community and learning',
    features: ['Photography', 'Community', 'Tutorials'],
    icon: '📷',
    source: 'other'
  },
  {
    id: 'kcblackhistory',
    name: 'KC Black History',
    url: 'https://kcblackhistory.org/',
    embedUrl: 'https://kcblackhistory.org/',
    canEmbed: true,
    category: 'history',
    description: 'Kansas City Black history resources',
    features: ['Black history', 'Local history', 'Educational'],
    icon: '📜',
    source: 'other'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCategoriesByType = (type: 'courses' | 'media' | 'subjects' | 'arts' | 'tech') => {
  const typeMap: Record<string, string[]> = {
    courses: ['free-courses', 'online-degrees', 'business-courses', 'how-to-learn'],
    media: ['free-movies', 'audiobooks', 'television', 'radio', 'podcasts'],
    subjects: ['science', 'physics', 'math', 'chemistry', 'biology', 'neuroscience', 'philosophy', 'law', 'politics'],
    arts: ['art', 'architecture', 'design', 'photography', 'film', 'animation', 'music', 'dance', 'theater'],
    tech: ['technology', 'software', 'video-games', 'cs-textbooks']
  };

  const ids = typeMap[type] || [];
  return OPENCULTURE_CATEGORIES.filter(c => ids.includes(c.id));
};

export const getResourcesByCategory = (category: string): FreeResource[] => {
  return FREE_LEARNING_RESOURCES.filter(r => r.category === category);
};

export const getEmbeddableResources = (): FreeResource[] => {
  return FREE_LEARNING_RESOURCES.filter(r => r.canEmbed);
};

export const searchResources = (query: string): FreeResource[] => {
  const lower = query.toLowerCase();
  return FREE_LEARNING_RESOURCES.filter(r =>
    r.name.toLowerCase().includes(lower) ||
    r.description.toLowerCase().includes(lower) ||
    r.category.toLowerCase().includes(lower)
  );
};

export const getOpenCultureStats = () => ({
  totalCategories: OPENCULTURE_CATEGORIES.length,
  totalResources: FREE_LEARNING_RESOURCES.length,
  embeddableResources: getEmbeddableResources().length
});

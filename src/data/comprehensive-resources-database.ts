/**
 * COMPREHENSIVE RESOURCES DATABASE
 * =================================
 * Educational lectures, PDFs, textbooks, language learning, and more
 * For Sydney's AI Teacher integration
 */

// ===== EDUCATIONAL LECTURES DATABASE =====
export interface Lecture {
  id: string;
  title: string;
  instructor: string;
  institution: string;
  subject: string;
  topic: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  keyPoints: string[];
  prerequisites?: string[];
  tags: string[];
}

export const LECTURE_SUBJECTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Psychology', 'Philosophy', 'History', 'Literature', 'Economics',
  'Political Science', 'Sociology', 'Anthropology', 'Art History',
  'Music Theory', 'Linguistics', 'Astronomy', 'Environmental Science',
  'Neuroscience', 'Medicine', 'Engineering', 'Architecture', 'Law'
];

export const EDUCATIONAL_LECTURES: Lecture[] = [
  // Computer Science
  { id: 'cs-001', title: 'Introduction to Algorithms', instructor: 'MIT OpenCourseWare', institution: 'MIT', subject: 'Computer Science', topic: 'Algorithms', duration: '1h 20m', level: 'intermediate', description: 'Fundamental algorithmic techniques and data structures', keyPoints: ['Big O notation', 'Sorting algorithms', 'Search algorithms', 'Dynamic programming'], tags: ['algorithms', 'programming', 'data-structures'] },
  { id: 'cs-002', title: 'Machine Learning Fundamentals', instructor: 'Stanford Online', institution: 'Stanford', subject: 'Computer Science', topic: 'Machine Learning', duration: '2h', level: 'intermediate', description: 'Core concepts of machine learning and AI', keyPoints: ['Supervised learning', 'Neural networks', 'Training models', 'Evaluation metrics'], tags: ['ml', 'ai', 'data-science'] },
  { id: 'cs-003', title: 'Web Development Basics', instructor: 'freeCodeCamp', institution: 'freeCodeCamp', subject: 'Computer Science', topic: 'Web Development', duration: '45m', level: 'beginner', description: 'HTML, CSS, and JavaScript fundamentals', keyPoints: ['HTML structure', 'CSS styling', 'JavaScript basics', 'Responsive design'], tags: ['web', 'html', 'css', 'javascript'] },

  // Mathematics
  { id: 'math-001', title: 'Linear Algebra', instructor: 'Gilbert Strang', institution: 'MIT', subject: 'Mathematics', topic: 'Linear Algebra', duration: '1h 30m', level: 'intermediate', description: 'Vectors, matrices, and linear transformations', keyPoints: ['Matrix operations', 'Eigenvalues', 'Vector spaces', 'Linear transformations'], tags: ['math', 'algebra', 'vectors'] },
  { id: 'math-002', title: 'Calculus Made Easy', instructor: 'Khan Academy', institution: 'Khan Academy', subject: 'Mathematics', topic: 'Calculus', duration: '1h', level: 'beginner', description: 'Introduction to derivatives and integrals', keyPoints: ['Limits', 'Derivatives', 'Integrals', 'Applications'], tags: ['calculus', 'derivatives', 'integrals'] },
  { id: 'math-003', title: 'Statistics for Data Science', instructor: 'Harvard Online', institution: 'Harvard', subject: 'Mathematics', topic: 'Statistics', duration: '1h 15m', level: 'intermediate', description: 'Statistical methods for analyzing data', keyPoints: ['Probability', 'Distributions', 'Hypothesis testing', 'Regression'], tags: ['statistics', 'data', 'probability'] },

  // Physics
  { id: 'phys-001', title: 'Classical Mechanics', instructor: 'Walter Lewin', institution: 'MIT', subject: 'Physics', topic: 'Mechanics', duration: '1h 45m', level: 'intermediate', description: 'Newtons laws and motion', keyPoints: ['Forces', 'Motion', 'Energy', 'Momentum'], tags: ['physics', 'mechanics', 'motion'] },
  { id: 'phys-002', title: 'Quantum Mechanics Introduction', instructor: 'Leonard Susskind', institution: 'Stanford', subject: 'Physics', topic: 'Quantum Mechanics', duration: '2h', level: 'advanced', description: 'Foundations of quantum physics', keyPoints: ['Wave functions', 'Uncertainty principle', 'Superposition', 'Entanglement'], tags: ['quantum', 'physics', 'advanced'] },

  // Psychology
  { id: 'psych-001', title: 'Introduction to Psychology', instructor: 'Yale Online', institution: 'Yale', subject: 'Psychology', topic: 'General Psychology', duration: '1h', level: 'beginner', description: 'Overview of psychological concepts', keyPoints: ['Cognition', 'Behavior', 'Development', 'Mental health'], tags: ['psychology', 'mind', 'behavior'] },
  { id: 'psych-002', title: 'Cognitive Behavioral Therapy Basics', instructor: 'Mental Health Foundation', institution: 'Various', subject: 'Psychology', topic: 'Therapy', duration: '45m', level: 'beginner', description: 'Understanding CBT techniques', keyPoints: ['Thought patterns', 'Behavioral change', 'Coping strategies', 'Self-help tools'], tags: ['cbt', 'therapy', 'mental-health'] },

  // Philosophy
  { id: 'phil-001', title: 'Introduction to Philosophy', instructor: 'Yale Philosophy', institution: 'Yale', subject: 'Philosophy', topic: 'General Philosophy', duration: '1h 20m', level: 'beginner', description: 'Major philosophical questions and thinkers', keyPoints: ['Ethics', 'Epistemology', 'Metaphysics', 'Logic'], tags: ['philosophy', 'ethics', 'thinking'] },
  { id: 'phil-002', title: 'Existentialism Explained', instructor: 'Philosophy Tube', institution: 'Independent', subject: 'Philosophy', topic: 'Existentialism', duration: '50m', level: 'intermediate', description: 'Sartre, Camus, and existentialist thought', keyPoints: ['Existence precedes essence', 'Absurdism', 'Authenticity', 'Freedom'], tags: ['existentialism', 'sartre', 'camus'] },

  // History
  { id: 'hist-001', title: 'World War II Overview', instructor: 'History Channel', institution: 'Various', subject: 'History', topic: 'World War II', duration: '2h', level: 'beginner', description: 'Comprehensive overview of WWII', keyPoints: ['Causes', 'Major battles', 'Holocaust', 'Aftermath'], tags: ['wwii', 'history', 'war'] },
  { id: 'hist-002', title: 'African American History', instructor: 'Harvard', institution: 'Harvard', subject: 'History', topic: 'American History', duration: '1h 30m', level: 'intermediate', description: 'History of Black Americans from slavery to civil rights', keyPoints: ['Slavery', 'Reconstruction', 'Civil Rights Movement', 'Modern era'], tags: ['black-history', 'civil-rights', 'american'] },
  { id: 'hist-003', title: 'Indigenous American History', instructor: 'Native Voices', institution: 'Smithsonian', subject: 'History', topic: 'Native American History', duration: '1h 15m', level: 'intermediate', description: 'History of Native American peoples', keyPoints: ['Pre-colonization', 'Treaties', 'Resistance', 'Modern sovereignty'], tags: ['native-american', 'indigenous', 'history'] },

  // Art History
  { id: 'art-001', title: 'Renaissance Art', instructor: 'Khan Academy', institution: 'Khan Academy', subject: 'Art History', topic: 'Renaissance', duration: '1h', level: 'beginner', description: 'Art of the Italian Renaissance', keyPoints: ['Leonardo', 'Michelangelo', 'Perspective', 'Humanism'], tags: ['renaissance', 'art', 'italy'] },
  { id: 'art-002', title: 'Modern Art Movements', instructor: 'MoMA', institution: 'MoMA', subject: 'Art History', topic: 'Modern Art', duration: '1h 30m', level: 'intermediate', description: 'From Impressionism to Contemporary', keyPoints: ['Impressionism', 'Cubism', 'Abstract', 'Pop Art'], tags: ['modern-art', 'movements', 'contemporary'] },

  // Music Theory
  { id: 'music-001', title: 'Music Theory Fundamentals', instructor: 'Berklee Online', institution: 'Berklee', subject: 'Music Theory', topic: 'Basics', duration: '1h', level: 'beginner', description: 'Notes, scales, and basic harmony', keyPoints: ['Notes', 'Scales', 'Intervals', 'Chords'], tags: ['music-theory', 'basics', 'harmony'] },
  { id: 'music-002', title: 'Jazz Harmony', instructor: 'Berklee', institution: 'Berklee', subject: 'Music Theory', topic: 'Jazz', duration: '1h 20m', level: 'advanced', description: 'Advanced jazz chord progressions', keyPoints: ['Extensions', 'Substitutions', 'Voicings', 'Improvisation'], tags: ['jazz', 'harmony', 'advanced'] },

  // Neuroscience
  { id: 'neuro-001', title: 'How the Brain Works', instructor: 'MIT Brain & Cognitive', institution: 'MIT', subject: 'Neuroscience', topic: 'Brain Function', duration: '1h 30m', level: 'intermediate', description: 'Overview of brain structure and function', keyPoints: ['Neurons', 'Brain regions', 'Memory', 'Consciousness'], tags: ['brain', 'neuroscience', 'cognition'] },

  // Economics
  { id: 'econ-001', title: 'Microeconomics Principles', instructor: 'Khan Academy', institution: 'Khan Academy', subject: 'Economics', topic: 'Microeconomics', duration: '1h', level: 'beginner', description: 'Supply, demand, and market behavior', keyPoints: ['Supply and demand', 'Elasticity', 'Market structures', 'Consumer choice'], tags: ['economics', 'microeconomics', 'markets'] },
  { id: 'econ-002', title: 'Personal Finance Basics', instructor: 'Various', institution: 'Various', subject: 'Economics', topic: 'Personal Finance', duration: '45m', level: 'beginner', description: 'Budgeting, saving, and investing fundamentals', keyPoints: ['Budgeting', 'Saving', 'Investing', 'Debt management'], tags: ['finance', 'budgeting', 'investing'] }
];

// ===== TEXTBOOKS DATABASE =====
export interface Textbook {
  id: string;
  title: string;
  authors: string[];
  edition?: string;
  subject: string;
  level: 'high-school' | 'undergraduate' | 'graduate' | 'professional';
  chapters: { number: number; title: string; topics: string[] }[];
  description: string;
  pageCount: number;
  year: number;
  tags: string[];
}

export const TEXTBOOK_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Psychology', 'Economics', 'Statistics', 'Engineering', 'Medicine',
  'Law', 'Business', 'Accounting', 'Marketing', 'Philosophy'
];

export const REFERENCE_TEXTBOOKS: Textbook[] = [
  {
    id: 'txt-001',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    edition: '4th',
    subject: 'Computer Science',
    level: 'undergraduate',
    chapters: [
      { number: 1, title: 'The Role of Algorithms', topics: ['Algorithm basics', 'Efficiency', 'Analysis'] },
      { number: 2, title: 'Getting Started', topics: ['Insertion sort', 'Loop invariants', 'Analyzing algorithms'] },
      { number: 3, title: 'Growth of Functions', topics: ['Asymptotic notation', 'Big O', 'Omega', 'Theta'] },
      { number: 4, title: 'Divide and Conquer', topics: ['Merge sort', 'Recurrences', 'Master theorem'] }
    ],
    description: 'The definitive guide to algorithms, covering fundamental techniques',
    pageCount: 1312,
    year: 2022,
    tags: ['algorithms', 'programming', 'classic']
  },
  {
    id: 'txt-002',
    title: 'Calculus: Early Transcendentals',
    authors: ['James Stewart'],
    edition: '9th',
    subject: 'Mathematics',
    level: 'undergraduate',
    chapters: [
      { number: 1, title: 'Functions and Models', topics: ['Functions', 'Models', 'Transformations'] },
      { number: 2, title: 'Limits and Derivatives', topics: ['Limits', 'Continuity', 'Derivatives intro'] },
      { number: 3, title: 'Differentiation Rules', topics: ['Product rule', 'Quotient rule', 'Chain rule'] },
      { number: 4, title: 'Applications of Differentiation', topics: ['Optimization', 'Related rates', 'Curve sketching'] }
    ],
    description: 'Comprehensive calculus textbook for university courses',
    pageCount: 1368,
    year: 2020,
    tags: ['calculus', 'mathematics', 'classic']
  },
  {
    id: 'txt-003',
    title: 'Psychology',
    authors: ['David G. Myers', 'C. Nathan DeWall'],
    edition: '13th',
    subject: 'Psychology',
    level: 'undergraduate',
    chapters: [
      { number: 1, title: 'Thinking Critically', topics: ['Scientific method', 'Research methods', 'Critical thinking'] },
      { number: 2, title: 'Biology of Mind', topics: ['Neurons', 'Brain structure', 'Neurotransmitters'] },
      { number: 3, title: 'Consciousness', topics: ['Sleep', 'Dreams', 'Altered states'] },
      { number: 4, title: 'Nature, Nurture, and Diversity', topics: ['Genetics', 'Environment', 'Culture'] }
    ],
    description: 'Bestselling introduction to psychology',
    pageCount: 896,
    year: 2021,
    tags: ['psychology', 'intro', 'comprehensive']
  },
  {
    id: 'txt-004',
    title: 'Physics for Scientists and Engineers',
    authors: ['Raymond A. Serway', 'John W. Jewett'],
    edition: '10th',
    subject: 'Physics',
    level: 'undergraduate',
    chapters: [
      { number: 1, title: 'Physics and Measurement', topics: ['Units', 'Dimensions', 'Vectors'] },
      { number: 2, title: 'Motion in One Dimension', topics: ['Position', 'Velocity', 'Acceleration'] },
      { number: 3, title: 'Vectors', topics: ['Vector components', 'Unit vectors', 'Operations'] },
      { number: 4, title: 'Motion in Two Dimensions', topics: ['Projectile motion', 'Circular motion'] }
    ],
    description: 'Comprehensive physics textbook with calculus-based approach',
    pageCount: 1344,
    year: 2018,
    tags: ['physics', 'engineering', 'comprehensive']
  },
  {
    id: 'txt-005',
    title: 'Campbell Biology',
    authors: ['Lisa A. Urry', 'Michael L. Cain', 'Steven A. Wasserman'],
    edition: '12th',
    subject: 'Biology',
    level: 'undergraduate',
    chapters: [
      { number: 1, title: 'Evolution and the Themes of Biology', topics: ['Evolution', 'Scientific inquiry', 'Themes'] },
      { number: 2, title: 'Chemical Context of Life', topics: ['Elements', 'Bonds', 'Water'] },
      { number: 3, title: 'Carbon and Molecular Diversity', topics: ['Carbon chemistry', 'Macromolecules'] },
      { number: 4, title: 'A Tour of the Cell', topics: ['Cell structure', 'Organelles', 'Membranes'] }
    ],
    description: 'The gold standard in biology education',
    pageCount: 1488,
    year: 2020,
    tags: ['biology', 'comprehensive', 'classic']
  }
];

// ===== LANGUAGE LEARNING RESOURCES =====
export interface LanguageResource {
  id: string;
  language: string;
  nativeName: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'conversation' | 'culture' | 'writing';
  title: string;
  content: string;
  examples: string[];
  exercises?: string[];
  tags: string[];
}

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish', nativeName: 'Espanol', family: 'Romance' },
  { code: 'fr', name: 'French', nativeName: 'Francais', family: 'Romance' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', family: 'Germanic' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', family: 'Romance' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugues', family: 'Romance' },
  { code: 'ja', name: 'Japanese', nativeName: 'Nihongo', family: 'Japonic' },
  { code: 'ko', name: 'Korean', nativeName: 'Hangugeo', family: 'Koreanic' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: 'Putonghua', family: 'Sinitic' },
  { code: 'ar', name: 'Arabic', nativeName: 'Al-Arabiyyah', family: 'Semitic' },
  { code: 'ru', name: 'Russian', nativeName: 'Russkiy', family: 'Slavic' },
  { code: 'hi', name: 'Hindi', nativeName: 'Hindi', family: 'Indo-Aryan' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', family: 'Bantu' },
  { code: 'asl', name: 'American Sign Language', nativeName: 'ASL', family: 'Sign' }
];

export const LANGUAGE_LESSONS: LanguageResource[] = [
  // Spanish
  { id: 'es-a1-001', language: 'Spanish', nativeName: 'Espanol', level: 'A1', category: 'vocabulary', title: 'Greetings & Introductions', content: 'Basic Spanish greetings and how to introduce yourself', examples: ['Hola - Hello', 'Buenos dias - Good morning', 'Me llamo... - My name is...', 'Mucho gusto - Nice to meet you'], exercises: ['Practice saying hello at different times of day', 'Introduce yourself to a partner'], tags: ['greetings', 'basics', 'introductions'] },
  { id: 'es-a1-002', language: 'Spanish', nativeName: 'Espanol', level: 'A1', category: 'grammar', title: 'Present Tense -AR Verbs', content: 'Conjugating regular -AR verbs in present tense', examples: ['hablar (to speak): hablo, hablas, habla, hablamos, hablais, hablan', 'trabajar (to work): trabajo, trabajas...'], exercises: ['Conjugate: cantar, bailar, estudiar'], tags: ['verbs', 'present-tense', 'conjugation'] },
  { id: 'es-b1-001', language: 'Spanish', nativeName: 'Espanol', level: 'B1', category: 'grammar', title: 'Subjunctive Mood Introduction', content: 'When and how to use the subjunctive in Spanish', examples: ['Quiero que vengas - I want you to come', 'Es importante que estudies - Its important that you study'], tags: ['subjunctive', 'intermediate', 'mood'] },

  // French
  { id: 'fr-a1-001', language: 'French', nativeName: 'Francais', level: 'A1', category: 'vocabulary', title: 'Essential French Phrases', content: 'Key phrases for beginners', examples: ['Bonjour - Hello/Good day', 'Merci - Thank you', 'Sil vous plait - Please', 'Au revoir - Goodbye'], tags: ['basics', 'phrases', 'essential'] },
  { id: 'fr-a1-002', language: 'French', nativeName: 'Francais', level: 'A1', category: 'pronunciation', title: 'French Sounds', content: 'Mastering difficult French pronunciations', examples: ['The French R (guttural)', 'Nasal vowels: an, en, in, on, un', 'Silent letters'], tags: ['pronunciation', 'sounds', 'accent'] },

  // Japanese
  { id: 'ja-a1-001', language: 'Japanese', nativeName: 'Nihongo', level: 'A1', category: 'writing', title: 'Hiragana Basics', content: 'Learning the hiragana syllabary', examples: ['a-i-u-e-o row', 'ka-ki-ku-ke-ko row', 'Writing stroke order'], tags: ['hiragana', 'writing', 'basics'] },
  { id: 'ja-a1-002', language: 'Japanese', nativeName: 'Nihongo', level: 'A1', category: 'grammar', title: 'Basic Sentence Structure', content: 'Japanese SOV sentence order', examples: ['Watashi wa gakusei desu - I am a student', 'Kore wa hon desu - This is a book'], tags: ['grammar', 'sentence', 'structure'] },

  // ASL
  { id: 'asl-a1-001', language: 'American Sign Language', nativeName: 'ASL', level: 'A1', category: 'vocabulary', title: 'Fingerspelling Alphabet', content: 'The ASL manual alphabet', examples: ['A through Z handshapes', 'Numbers 1-10', 'Common fingerspelled words'], tags: ['fingerspelling', 'alphabet', 'basics'] },
  { id: 'asl-a1-002', language: 'American Sign Language', nativeName: 'ASL', level: 'A1', category: 'grammar', title: 'ASL Sentence Structure', content: 'Topic-comment structure in ASL', examples: ['STORE I GO (I go to the store)', 'PIZZA YOU LIKE? (Do you like pizza?)'], tags: ['grammar', 'structure', 'syntax'] }
];

// ===== PDF/DOCUMENT RESOURCES =====
export interface DocumentResource {
  id: string;
  title: string;
  author: string;
  type: 'pdf' | 'ebook' | 'article' | 'paper' | 'guide' | 'manual';
  subject: string;
  description: string;
  pageCount: number;
  year: number;
  license: 'public-domain' | 'creative-commons' | 'open-access' | 'fair-use';
  topics: string[];
  tags: string[];
}

export const DOCUMENT_RESOURCES: DocumentResource[] = [
  // Public Domain Classics
  { id: 'doc-001', title: 'The Art of War', author: 'Sun Tzu', type: 'ebook', subject: 'Philosophy/Strategy', description: 'Ancient Chinese military treatise on strategy', pageCount: 68, year: -500, license: 'public-domain', topics: ['Strategy', 'Leadership', 'Tactics', 'Philosophy'], tags: ['classic', 'strategy', 'chinese'] },
  { id: 'doc-002', title: 'Meditations', author: 'Marcus Aurelius', type: 'ebook', subject: 'Philosophy', description: 'Stoic philosophy from the Roman emperor', pageCount: 180, year: 180, license: 'public-domain', topics: ['Stoicism', 'Ethics', 'Self-improvement', 'Leadership'], tags: ['stoicism', 'philosophy', 'classic'] },
  { id: 'doc-003', title: 'The Republic', author: 'Plato', type: 'ebook', subject: 'Philosophy', description: 'Socratic dialogue on justice and the ideal state', pageCount: 380, year: -375, license: 'public-domain', topics: ['Justice', 'Government', 'Education', 'Soul'], tags: ['plato', 'philosophy', 'political'] },

  // Open Educational Resources
  { id: 'doc-004', title: 'OpenStax College Physics', author: 'OpenStax', type: 'pdf', subject: 'Physics', description: 'Free college physics textbook', pageCount: 1400, year: 2022, license: 'creative-commons', topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'], tags: ['physics', 'textbook', 'free'] },
  { id: 'doc-005', title: 'Think Python', author: 'Allen B. Downey', type: 'pdf', subject: 'Computer Science', description: 'Introduction to Python programming', pageCount: 234, year: 2015, license: 'creative-commons', topics: ['Python', 'Programming', 'Algorithms', 'Data structures'], tags: ['python', 'programming', 'beginner'] },

  // Disability & Health Resources
  { id: 'doc-006', title: 'Understanding EDS', author: 'Ehlers-Danlos Society', type: 'guide', subject: 'Health', description: 'Comprehensive guide to Ehlers-Danlos Syndromes', pageCount: 45, year: 2023, license: 'open-access', topics: ['hEDS', 'Symptoms', 'Management', 'Diagnosis'], tags: ['eds', 'chronic-illness', 'guide'] },
  { id: 'doc-007', title: 'POTS Patient Guide', author: 'Dysautonomia International', type: 'guide', subject: 'Health', description: 'Living with Postural Orthostatic Tachycardia Syndrome', pageCount: 32, year: 2023, license: 'open-access', topics: ['POTS', 'Symptoms', 'Treatment', 'Lifestyle'], tags: ['pots', 'dysautonomia', 'chronic-illness'] },
  { id: 'doc-008', title: 'Spoon Theory Explained', author: 'Christine Miserandino', type: 'article', subject: 'Health', description: 'The famous metaphor for chronic illness energy management', pageCount: 5, year: 2003, license: 'fair-use', topics: ['Chronic illness', 'Energy management', 'Disability', 'Self-advocacy'], tags: ['spoon-theory', 'chronic-illness', 'advocacy'] },

  // Creative & Art
  { id: 'doc-009', title: 'Color Theory Fundamentals', author: 'Various Artists', type: 'guide', subject: 'Art', description: 'Understanding color for artists and designers', pageCount: 48, year: 2020, license: 'creative-commons', topics: ['Color wheel', 'Harmony', 'Psychology', 'Application'], tags: ['color', 'art', 'design'] },
  { id: 'doc-010', title: 'Figure Drawing Basics', author: 'Art Academy', type: 'guide', subject: 'Art', description: 'Human anatomy for artists', pageCount: 120, year: 2019, license: 'creative-commons', topics: ['Anatomy', 'Proportions', 'Gesture', 'Poses'], tags: ['drawing', 'figure', 'anatomy'] }
];

// ===== EDUCATIONAL VIDEOS/COURSES =====
export interface EducationalVideo {
  id: string;
  title: string;
  creator: string;
  platform: string;
  subject: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  chapters?: string[];
  tags: string[];
}

export const EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  { id: 'vid-001', title: 'Crash Course World History', creator: 'John Green', platform: 'YouTube/Crash Course', subject: 'History', duration: '40 episodes', level: 'beginner', description: 'Engaging world history from ancient civilizations to modern day', chapters: ['Agricultural Revolution', 'Mesopotamia', 'Egypt', 'Greece', 'Rome', 'Islam', 'Renaissance'], tags: ['history', 'engaging', 'comprehensive'] },
  { id: 'vid-002', title: 'Crash Course Psychology', creator: 'Hank Green', platform: 'YouTube/Crash Course', subject: 'Psychology', duration: '40 episodes', level: 'beginner', description: 'Introduction to psychological concepts', chapters: ['Intro', 'Research Methods', 'Brain', 'Consciousness', 'Learning', 'Memory'], tags: ['psychology', 'engaging', 'intro'] },
  { id: 'vid-003', title: '3Blue1Brown: Essence of Linear Algebra', creator: 'Grant Sanderson', platform: 'YouTube', subject: 'Mathematics', duration: '16 episodes', level: 'intermediate', description: 'Visual approach to linear algebra concepts', chapters: ['Vectors', 'Linear combinations', 'Matrices', 'Determinants', 'Eigenvalues'], tags: ['math', 'visual', 'linear-algebra'] },
  { id: 'vid-004', title: 'The Coding Train', creator: 'Daniel Shiffman', platform: 'YouTube', subject: 'Computer Science', duration: 'Ongoing', level: 'beginner', description: 'Creative coding tutorials with enthusiasm', chapters: ['p5.js', 'Processing', 'Machine Learning', 'Algorithms'], tags: ['coding', 'creative', 'fun'] },
  { id: 'vid-005', title: 'Philosophy Tube', creator: 'Abigail Thorn', platform: 'YouTube', subject: 'Philosophy', duration: 'Ongoing', level: 'intermediate', description: 'Theatrical explorations of philosophical concepts', chapters: ['Ethics', 'Politics', 'Identity', 'Society'], tags: ['philosophy', 'theatrical', 'lgbtq'] }
];

// Helper functions
export function searchEducationalResources(query: string, type?: string) {
  const q = query.toLowerCase();
  const results: any[] = [];

  if (!type || type === 'lecture') {
    results.push(...EDUCATIONAL_LECTURES.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.subject.toLowerCase().includes(q) ||
      l.topic.toLowerCase().includes(q)
    ).map(l => ({ ...l, resourceType: 'lecture' })));
  }

  if (!type || type === 'textbook') {
    results.push(...REFERENCE_TEXTBOOKS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    ).map(t => ({ ...t, resourceType: 'textbook' })));
  }

  if (!type || type === 'language') {
    results.push(...LANGUAGE_LESSONS.filter(l =>
      l.language.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    ).map(l => ({ ...l, resourceType: 'language' })));
  }

  if (!type || type === 'document') {
    results.push(...DOCUMENT_RESOURCES.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.subject.toLowerCase().includes(q)
    ).map(d => ({ ...d, resourceType: 'document' })));
  }

  if (!type || type === 'video') {
    results.push(...EDUCATIONAL_VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.subject.toLowerCase().includes(q)
    ).map(v => ({ ...v, resourceType: 'video' })));
  }

  return results;
}

export function getResourcesBySubject(subject: string) {
  return {
    lectures: EDUCATIONAL_LECTURES.filter(l => l.subject.toLowerCase() === subject.toLowerCase()),
    textbooks: REFERENCE_TEXTBOOKS.filter(t => t.subject.toLowerCase() === subject.toLowerCase()),
    documents: DOCUMENT_RESOURCES.filter(d => d.subject.toLowerCase() === subject.toLowerCase()),
    videos: EDUCATIONAL_VIDEOS.filter(v => v.subject.toLowerCase() === subject.toLowerCase())
  };
}

export function getLanguageResources(language: string, level?: string) {
  return LANGUAGE_LESSONS.filter(l =>
    l.language.toLowerCase() === language.toLowerCase() &&
    (!level || l.level === level)
  );
}

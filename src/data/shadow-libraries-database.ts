// Shadow Libraries & Open Knowledge Database
// Comprehensive collection of open access libraries, research archives, and knowledge repositories

export interface ShadowLibrary {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'books' | 'research' | 'art' | 'archive' | 'meta' | 'analysis';
  features: string[];
  contentTypes: string[];
  accessType: 'free' | 'donation' | 'registration';
  searchable: boolean;
  icon: string;
  status: 'active' | 'mirror' | 'archive';
}

export interface KnowledgeResource {
  id: string;
  title: string;
  source: string;
  type: 'article' | 'essay' | 'guide' | 'directory';
  url: string;
  description: string;
  topics: string[];
}

export const SHADOW_LIBRARIES: ShadowLibrary[] = [
  // Primary Shadow Libraries
  {
    id: 'libgen-main',
    name: 'Library Genesis (LibGen)',
    description: 'The largest free library in human history. Contains millions of books, articles, comics, and magazines.',
    url: 'https://libgen.li/',
    category: 'books',
    features: [
      'Millions of books and textbooks',
      'Scientific articles and papers',
      'Comics and magazines',
      'Fiction and non-fiction',
      'Multiple download formats',
      'ISBN search',
      'Author search',
      'Full-text search'
    ],
    contentTypes: ['books', 'textbooks', 'articles', 'comics', 'magazines', 'fiction'],
    accessType: 'free',
    searchable: true,
    icon: '📚',
    status: 'active'
  },
  {
    id: 'libgen-la',
    name: 'Library Genesis (Mirror)',
    description: 'Alternative LibGen mirror with same content database. Use if main site is unavailable.',
    url: 'https://libgen.la/',
    category: 'books',
    features: [
      'LibGen mirror site',
      'Same database as main',
      'Alternative access point',
      'Full search capabilities'
    ],
    contentTypes: ['books', 'textbooks', 'articles', 'comics', 'magazines'],
    accessType: 'free',
    searchable: true,
    icon: '📖',
    status: 'mirror'
  },
  {
    id: 'z-library',
    name: 'Z-Library',
    description: 'World\'s largest ebook library with over 11 million books and 84 million articles.',
    url: 'https://z-lib.id/',
    category: 'books',
    features: [
      '11+ million books',
      '84+ million articles',
      'Multiple formats (EPUB, PDF, MOBI)',
      'Personal bookshelves',
      'Reading lists',
      'Book recommendations',
      'Send to Kindle feature',
      'Advanced search filters'
    ],
    contentTypes: ['ebooks', 'articles', 'academic papers', 'magazines'],
    accessType: 'registration',
    searchable: true,
    icon: '📕',
    status: 'active'
  },
  {
    id: 'sci-hub',
    name: 'Sci-Hub',
    description: 'The first pirate website providing mass and public access to research papers. Over 85 million papers.',
    url: 'https://sci-hub.al/',
    category: 'research',
    features: [
      '85+ million research papers',
      'DOI lookup',
      'Direct PDF access',
      'Bypasses paywalls',
      'Scientific journals',
      'Academic papers',
      'Peer-reviewed research'
    ],
    contentTypes: ['research papers', 'scientific articles', 'journals', 'academic papers'],
    accessType: 'free',
    searchable: true,
    icon: '🔬',
    status: 'active'
  },
  {
    id: 'memory-world',
    name: 'Memory of the World',
    description: 'Collective online library focused on the politics of public access to knowledge.',
    url: 'https://library.memoryoftheworld.org/',
    category: 'archive',
    features: [
      'Political philosophy collection',
      'Critical theory texts',
      'Art and culture books',
      'Academic works',
      'Community curated',
      'Calibre-based catalog',
      'OPDS feed support'
    ],
    contentTypes: ['philosophy', 'theory', 'art', 'culture', 'politics'],
    accessType: 'free',
    searchable: true,
    icon: '🌍',
    status: 'active'
  },
  {
    id: 'ubu-web',
    name: 'UbuWeb',
    description: 'A completely free web resource dedicated to all strains of avant-garde, ethnopoetics, and outsider arts.',
    url: 'https://www.ubu.com/',
    category: 'art',
    features: [
      'Avant-garde art archive',
      'Sound poetry',
      'Visual poetry',
      'Conceptual writing',
      'Film and video art',
      'Ethnopoetics',
      'Historical recordings',
      'Artist interviews'
    ],
    contentTypes: ['sound', 'video', 'text', 'film', 'poetry', 'art'],
    accessType: 'free',
    searchable: true,
    icon: '🎨',
    status: 'active'
  },
  {
    id: 'shadow-libraries-guide',
    name: 'Shadow Libraries Guide',
    description: 'Comprehensive directory and guide to shadow libraries and open access resources.',
    url: 'https://shadowlibraries.github.io/',
    category: 'meta',
    features: [
      'Library directory',
      'Access guides',
      'Mirror lists',
      'Status updates',
      'Community resources',
      'Tool recommendations'
    ],
    contentTypes: ['guides', 'directories', 'resources'],
    accessType: 'free',
    searchable: false,
    icon: '🗺️',
    status: 'active'
  },
  {
    id: 'monoskop-shadow',
    name: 'Monoskop Shadow Libraries',
    description: 'Wiki documenting the history, politics, and resources of shadow libraries.',
    url: 'https://monoskop.org/Shadow_libraries',
    category: 'meta',
    features: [
      'Historical documentation',
      'Political analysis',
      'Library listings',
      'Academic references',
      'Timeline of shadow libraries',
      'Related projects'
    ],
    contentTypes: ['wiki', 'documentation', 'history'],
    accessType: 'free',
    searchable: true,
    icon: '📜',
    status: 'active'
  }
];

export const KNOWLEDGE_RESOURCES: KnowledgeResource[] = [
  {
    id: 'eflux-shadow',
    title: 'Shadow Libraries',
    source: 'e-flux journal',
    type: 'essay',
    url: 'https://www.e-flux.com/journal/37/61228/shadow-libraries',
    description: 'Academic essay exploring the concept, ethics, and impact of shadow libraries on knowledge access.',
    topics: ['philosophy', 'access', 'knowledge politics', 'digital rights']
  },
  {
    id: 'claremont-shadow',
    title: 'Shadow Libraries and Access to Knowledge',
    source: 'Claremont Law Journal',
    type: 'article',
    url: 'https://claremontlawjournal.sites.pomona.edu/?p=459',
    description: 'Legal analysis of shadow libraries and their role in democratizing access to knowledge.',
    topics: ['law', 'copyright', 'access rights', 'education']
  },
  {
    id: 'bookscouter-guide',
    title: 'What Are Shadow Libraries?',
    source: 'BookScouter Blog',
    type: 'guide',
    url: 'https://bookscouter.com/blog/shadow-libraries/',
    description: 'Introductory guide explaining shadow libraries, their history, and how they work.',
    topics: ['introduction', 'history', 'how-to', 'overview']
  }
];

// Additional Open Access Resources
export const OPEN_ACCESS_RESOURCES = [
  {
    id: 'anna-archive',
    name: 'Anna\'s Archive',
    url: 'https://annas-archive.org/',
    description: 'Search engine for shadow libraries. Aggregates LibGen, Sci-Hub, and more.',
    category: 'meta'
  },
  {
    id: 'project-gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    description: 'Over 60,000 free public domain ebooks.',
    category: 'books'
  },
  {
    id: 'internet-archive',
    name: 'Internet Archive',
    url: 'https://archive.org/',
    description: 'Non-profit library of millions of free books, movies, software, music, and more.',
    category: 'archive'
  },
  {
    id: 'open-library',
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    description: 'Universal catalog of books with lending library functionality.',
    category: 'books'
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    url: 'https://arxiv.org/',
    description: 'Open access to over 2 million scholarly articles in physics, mathematics, and more.',
    category: 'research'
  },
  {
    id: 'doaj',
    name: 'DOAJ',
    url: 'https://doaj.org/',
    description: 'Directory of Open Access Journals - community-curated online directory.',
    category: 'research'
  },
  {
    id: 'core',
    name: 'CORE',
    url: 'https://core.ac.uk/',
    description: 'Aggregator of open access research papers from repositories worldwide.',
    category: 'research'
  },
  {
    id: 'unpaywall',
    name: 'Unpaywall',
    url: 'https://unpaywall.org/',
    description: 'Browser extension and database finding free versions of research papers.',
    category: 'research'
  },
  {
    id: 'base-search',
    name: 'BASE',
    url: 'https://www.base-search.net/',
    description: 'Bielefeld Academic Search Engine - 300+ million documents from 10,000+ sources.',
    category: 'research'
  },
  {
    id: 'oapen',
    name: 'OAPEN',
    url: 'https://www.oapen.org/',
    description: 'Open access platform for peer-reviewed academic books.',
    category: 'books'
  }
];

// Search categories for UI
export const LIBRARY_CATEGORIES = [
  { id: 'all', name: 'All Libraries', icon: '🏛️' },
  { id: 'books', name: 'Books & Ebooks', icon: '📚' },
  { id: 'research', name: 'Research Papers', icon: '🔬' },
  { id: 'art', name: 'Art & Media', icon: '🎨' },
  { id: 'archive', name: 'Archives', icon: '📜' },
  { id: 'meta', name: 'Directories & Guides', icon: '🗺️' }
];

// Content type filters
export const CONTENT_TYPES = [
  'books',
  'textbooks',
  'ebooks',
  'articles',
  'research papers',
  'scientific articles',
  'journals',
  'magazines',
  'comics',
  'fiction',
  'philosophy',
  'theory',
  'art',
  'sound',
  'video',
  'film',
  'poetry'
];

// Statistics for display
export const LIBRARY_STATS = {
  totalBooks: '50,000,000+',
  totalArticles: '100,000,000+',
  totalLibraries: SHADOW_LIBRARIES.length + OPEN_ACCESS_RESOURCES.length,
  categories: LIBRARY_CATEGORIES.length,
  contentTypes: CONTENT_TYPES.length
};

export default {
  SHADOW_LIBRARIES,
  KNOWLEDGE_RESOURCES,
  OPEN_ACCESS_RESOURCES,
  LIBRARY_CATEGORIES,
  CONTENT_TYPES,
  LIBRARY_STATS
};

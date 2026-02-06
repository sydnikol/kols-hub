// Actual Media Content from Shadow Libraries
// Direct embedded content and curated collections

export interface MediaItem {
  id: string;
  title: string;
  author?: string;
  type: 'book' | 'article' | 'video' | 'audio' | 'film' | 'poetry' | 'art';
  source: string;
  embedUrl: string;
  directUrl: string;
  description: string;
  year?: number;
  genre?: string[];
  language?: string;
  duration?: string;
  pages?: number;
}

export interface MediaCollection {
  id: string;
  name: string;
  source: string;
  description: string;
  embedUrl: string;
  items: MediaItem[];
}

// UbuWeb Collections - Avant-garde Art & Media
export const UBUWEB_COLLECTIONS: MediaCollection[] = [
  {
    id: 'ubu-film',
    name: 'UbuWeb Film & Video',
    source: 'UbuWeb',
    description: 'Avant-garde and experimental films from the 20th and 21st centuries',
    embedUrl: 'https://www.ubu.com/film/index.html',
    items: [
      {
        id: 'ubu-warhol-empire',
        title: 'Empire',
        author: 'Andy Warhol',
        type: 'film',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/film/warhol_empire.html',
        directUrl: 'https://www.ubu.com/film/warhol_empire.html',
        description: 'Warhol\'s 8-hour static shot of the Empire State Building',
        year: 1964,
        genre: ['experimental', 'avant-garde'],
        duration: '8 hours'
      },
      {
        id: 'ubu-brakhage',
        title: 'Dog Star Man',
        author: 'Stan Brakhage',
        type: 'film',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/film/brakhage_dog.html',
        directUrl: 'https://www.ubu.com/film/brakhage_dog.html',
        description: 'Groundbreaking experimental film exploring cosmic themes',
        year: 1964,
        genre: ['experimental', 'avant-garde'],
        duration: '75 min'
      },
      {
        id: 'ubu-mekas',
        title: 'Walden',
        author: 'Jonas Mekas',
        type: 'film',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/film/mekas_walden.html',
        directUrl: 'https://www.ubu.com/film/mekas_walden.html',
        description: 'Diary film documenting New York underground art scene',
        year: 1969,
        genre: ['documentary', 'diary film'],
        duration: '180 min'
      }
    ]
  },
  {
    id: 'ubu-sound',
    name: 'UbuWeb Sound',
    source: 'UbuWeb',
    description: 'Sound poetry, experimental music, and audio art',
    embedUrl: 'https://www.ubu.com/sound/index.html',
    items: [
      {
        id: 'ubu-cage-silence',
        title: '4\'33"',
        author: 'John Cage',
        type: 'audio',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/sound/cage.html',
        directUrl: 'https://www.ubu.com/sound/cage.html',
        description: 'The famous silent composition',
        year: 1952,
        genre: ['experimental', 'conceptual'],
        duration: '4:33'
      },
      {
        id: 'ubu-schwitters',
        title: 'Ursonate',
        author: 'Kurt Schwitters',
        type: 'audio',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/sound/schwitters.html',
        directUrl: 'https://www.ubu.com/sound/schwitters.html',
        description: 'Dadaist sound poem masterpiece',
        year: 1932,
        genre: ['dada', 'sound poetry'],
        duration: '40 min'
      },
      {
        id: 'ubu-ginsberg',
        title: 'Howl',
        author: 'Allen Ginsberg',
        type: 'audio',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/sound/ginsberg.html',
        directUrl: 'https://www.ubu.com/sound/ginsberg.html',
        description: 'Reading of the iconic Beat poem',
        year: 1956,
        genre: ['beat poetry', 'reading'],
        duration: '25 min'
      }
    ]
  },
  {
    id: 'ubu-visual-poetry',
    name: 'UbuWeb Visual Poetry',
    source: 'UbuWeb',
    description: 'Concrete poetry and visual text experiments',
    embedUrl: 'https://www.ubu.com/vp/index.html',
    items: [
      {
        id: 'ubu-gomringer',
        title: 'Silencio',
        author: 'Eugen Gomringer',
        type: 'poetry',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/vp/gomringer.html',
        directUrl: 'https://www.ubu.com/vp/gomringer.html',
        description: 'Foundational concrete poem',
        year: 1954,
        genre: ['concrete poetry']
      },
      {
        id: 'ubu-decampos',
        title: 'Poesia Concreta',
        author: 'Augusto de Campos',
        type: 'poetry',
        source: 'UbuWeb',
        embedUrl: 'https://www.ubu.com/vp/decampos.html',
        directUrl: 'https://www.ubu.com/vp/decampos.html',
        description: 'Brazilian concrete poetry collection',
        year: 1956,
        genre: ['concrete poetry', 'brazilian']
      }
    ]
  }
];

// Library Genesis - Popular Books Categories
export const LIBGEN_CATEGORIES = [
  {
    id: 'libgen-fiction',
    name: 'Fiction',
    embedUrl: 'https://libgen.li/index.php?req=fiction&columns%5B%5D=t&columns%5B%5D=a&columns%5B%5D=s&columns%5B%5D=y&columns%5B%5D=p&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&res=25&covers=on&gmode=on&filesuns=all',
    description: 'Novels, short stories, and literary fiction',
    icon: '📖'
  },
  {
    id: 'libgen-scifi',
    name: 'Science Fiction',
    embedUrl: 'https://libgen.li/index.php?req=science+fiction&columns%5B%5D=t&columns%5B%5D=a&topics%5B%5D=f',
    description: 'Sci-fi novels and collections',
    icon: '🚀'
  },
  {
    id: 'libgen-philosophy',
    name: 'Philosophy',
    embedUrl: 'https://libgen.li/index.php?req=philosophy&columns%5B%5D=t&columns%5B%5D=a',
    description: 'Philosophy texts and critical theory',
    icon: '🤔'
  },
  {
    id: 'libgen-programming',
    name: 'Programming',
    embedUrl: 'https://libgen.li/index.php?req=programming&columns%5B%5D=t&columns%5B%5D=a',
    description: 'Computer science and coding books',
    icon: '💻'
  },
  {
    id: 'libgen-art',
    name: 'Art & Design',
    embedUrl: 'https://libgen.li/index.php?req=art+design&columns%5B%5D=t&columns%5B%5D=a',
    description: 'Art history, design, and visual arts',
    icon: '🎨'
  },
  {
    id: 'libgen-history',
    name: 'History',
    embedUrl: 'https://libgen.li/index.php?req=history&columns%5B%5D=t&columns%5B%5D=a',
    description: 'Historical texts and analysis',
    icon: '📜'
  },
  {
    id: 'libgen-psychology',
    name: 'Psychology',
    embedUrl: 'https://libgen.li/index.php?req=psychology&columns%5B%5D=t&columns%5B%5D=a',
    description: 'Psychology and mental health resources',
    icon: '🧠'
  },
  {
    id: 'libgen-comics',
    name: 'Comics & Manga',
    embedUrl: 'https://libgen.li/index.php?req=comics&columns%5B%5D=t&columns%5B%5D=a&topics%5B%5D=c',
    description: 'Comics, graphic novels, and manga',
    icon: '💥'
  }
];

// Sci-Hub Subject Areas
export const SCIHUB_SUBJECTS = [
  {
    id: 'scihub-physics',
    name: 'Physics',
    searchUrl: 'https://sci-hub.al/',
    description: 'Physics research papers and journals',
    icon: '⚛️',
    exampleDoi: '10.1038/nature12373'
  },
  {
    id: 'scihub-biology',
    name: 'Biology',
    searchUrl: 'https://sci-hub.al/',
    description: 'Biological sciences and life sciences',
    icon: '🧬',
    exampleDoi: '10.1126/science.1230422'
  },
  {
    id: 'scihub-medicine',
    name: 'Medicine',
    searchUrl: 'https://sci-hub.al/',
    description: 'Medical research and clinical studies',
    icon: '⚕️',
    exampleDoi: '10.1056/NEJMoa1200690'
  },
  {
    id: 'scihub-cs',
    name: 'Computer Science',
    searchUrl: 'https://sci-hub.al/',
    description: 'AI, ML, and computing research',
    icon: '🖥️',
    exampleDoi: '10.1145/3065386'
  },
  {
    id: 'scihub-chemistry',
    name: 'Chemistry',
    searchUrl: 'https://sci-hub.al/',
    description: 'Chemical sciences research',
    icon: '🧪',
    exampleDoi: '10.1021/ja00051a040'
  },
  {
    id: 'scihub-math',
    name: 'Mathematics',
    searchUrl: 'https://sci-hub.al/',
    description: 'Mathematical research papers',
    icon: '📐',
    exampleDoi: '10.2307/1970890'
  }
];

// Z-Library Collections
export const ZLIB_FEATURED = [
  {
    id: 'zlib-popular',
    name: 'Most Popular Books',
    embedUrl: 'https://z-lib.id/',
    description: 'Trending and most downloaded titles',
    icon: '🔥'
  },
  {
    id: 'zlib-new',
    name: 'New Releases',
    embedUrl: 'https://z-lib.id/',
    description: 'Recently added books',
    icon: '✨'
  },
  {
    id: 'zlib-textbooks',
    name: 'Textbooks',
    embedUrl: 'https://z-lib.id/',
    description: 'Academic textbooks for students',
    icon: '📚'
  }
];

// Memory of the World - Curated Collections
export const MEMORY_WORLD_COLLECTIONS = [
  {
    id: 'mow-theory',
    name: 'Critical Theory',
    embedUrl: 'https://library.memoryoftheworld.org/',
    description: 'Frankfurt School, post-structuralism, cultural studies',
    authors: ['Adorno', 'Foucault', 'Butler', 'Deleuze'],
    icon: '📕'
  },
  {
    id: 'mow-feminism',
    name: 'Feminist Theory',
    embedUrl: 'https://library.memoryoftheworld.org/',
    description: 'Feminist philosophy and gender studies',
    authors: ['bell hooks', 'Judith Butler', 'Angela Davis'],
    icon: '♀️'
  },
  {
    id: 'mow-marxism',
    name: 'Marxism & Socialism',
    embedUrl: 'https://library.memoryoftheworld.org/',
    description: 'Political economy and socialist theory',
    authors: ['Marx', 'Lenin', 'Gramsci', 'Luxemburg'],
    icon: '⚒️'
  },
  {
    id: 'mow-art',
    name: 'Art Theory',
    embedUrl: 'https://library.memoryoftheworld.org/',
    description: 'Aesthetics, art history, visual culture',
    authors: ['Benjamin', 'Berger', 'Krauss'],
    icon: '🎭'
  }
];

// Internet Archive Featured Collections
export const ARCHIVE_ORG_COLLECTIONS = [
  {
    id: 'archive-books',
    name: 'Open Library',
    embedUrl: 'https://openlibrary.org/',
    description: 'Borrow from millions of library books',
    icon: '📚'
  },
  {
    id: 'archive-audio',
    name: 'Audio Archive',
    embedUrl: 'https://archive.org/details/audio',
    description: 'Free music, podcasts, and audio recordings',
    icon: '🎵'
  },
  {
    id: 'archive-video',
    name: 'Moving Image Archive',
    embedUrl: 'https://archive.org/details/movies',
    description: 'Free movies, documentaries, and videos',
    icon: '🎬'
  },
  {
    id: 'archive-software',
    name: 'Software Archive',
    embedUrl: 'https://archive.org/details/software',
    description: 'Vintage software and games',
    icon: '💾'
  },
  {
    id: 'archive-wayback',
    name: 'Wayback Machine',
    embedUrl: 'https://web.archive.org/',
    description: 'Browse 700+ billion archived web pages',
    icon: '⏰'
  }
];

// Project Gutenberg Top Books
export const GUTENBERG_TOP_BOOKS: MediaItem[] = [
  {
    id: 'gut-pride',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/1342',
    directUrl: 'https://www.gutenberg.org/ebooks/1342.html.images',
    description: 'Classic romance novel',
    year: 1813,
    language: 'English'
  },
  {
    id: 'gut-frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/84',
    directUrl: 'https://www.gutenberg.org/ebooks/84.html.images',
    description: 'Gothic science fiction classic',
    year: 1818,
    language: 'English'
  },
  {
    id: 'gut-dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/345',
    directUrl: 'https://www.gutenberg.org/ebooks/345.html.images',
    description: 'The classic vampire novel',
    year: 1897,
    language: 'English'
  },
  {
    id: 'gut-moby',
    title: 'Moby Dick',
    author: 'Herman Melville',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/2701',
    directUrl: 'https://www.gutenberg.org/ebooks/2701.html.images',
    description: 'Epic tale of obsession',
    year: 1851,
    language: 'English'
  },
  {
    id: 'gut-alice',
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/11',
    directUrl: 'https://www.gutenberg.org/ebooks/11.html.images',
    description: 'Fantasy classic',
    year: 1865,
    language: 'English'
  },
  {
    id: 'gut-sherlock',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/1661',
    directUrl: 'https://www.gutenberg.org/ebooks/1661.html.images',
    description: 'Detective stories collection',
    year: 1892,
    language: 'English'
  },
  {
    id: 'gut-war-peace',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/2600',
    directUrl: 'https://www.gutenberg.org/ebooks/2600.html.images',
    description: 'Epic Russian novel',
    year: 1869,
    language: 'English'
  },
  {
    id: 'gut-crime',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    type: 'book',
    source: 'Project Gutenberg',
    embedUrl: 'https://www.gutenberg.org/ebooks/2554',
    directUrl: 'https://www.gutenberg.org/ebooks/2554.html.images',
    description: 'Psychological masterpiece',
    year: 1866,
    language: 'English'
  }
];

// Quick Access Links for Direct Embedding
export const QUICK_ACCESS_LIBRARIES = [
  {
    id: 'qa-libgen',
    name: 'Library Genesis',
    url: 'https://libgen.li/',
    icon: '📚',
    description: 'Search millions of books'
  },
  {
    id: 'qa-zlib',
    name: 'Z-Library',
    url: 'https://z-lib.id/',
    icon: '📕',
    description: '11M+ books, 84M+ articles'
  },
  {
    id: 'qa-scihub',
    name: 'Sci-Hub',
    url: 'https://sci-hub.al/',
    icon: '🔬',
    description: 'Research papers by DOI'
  },
  {
    id: 'qa-ubu',
    name: 'UbuWeb',
    url: 'https://www.ubu.com/',
    icon: '🎨',
    description: 'Avant-garde art & media'
  },
  {
    id: 'qa-memory',
    name: 'Memory of the World',
    url: 'https://library.memoryoftheworld.org/',
    icon: '🌍',
    description: 'Critical theory & philosophy'
  },
  {
    id: 'qa-anna',
    name: 'Anna\'s Archive',
    url: 'https://annas-archive.org/',
    icon: '🔍',
    description: 'Search all shadow libraries'
  },
  {
    id: 'qa-gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    icon: '📖',
    description: '60K+ free public domain books'
  },
  {
    id: 'qa-archive',
    name: 'Internet Archive',
    url: 'https://archive.org/',
    icon: '🏛️',
    description: 'Universal digital library'
  }
];

export default {
  UBUWEB_COLLECTIONS,
  LIBGEN_CATEGORIES,
  SCIHUB_SUBJECTS,
  ZLIB_FEATURED,
  MEMORY_WORLD_COLLECTIONS,
  ARCHIVE_ORG_COLLECTIONS,
  GUTENBERG_TOP_BOOKS,
  QUICK_ACCESS_LIBRARIES
};

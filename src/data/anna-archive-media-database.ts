/**
 * Anna's Archive Complete Media Database
 * =======================================
 * Comprehensive database of all media types available through Anna's Archive
 *
 * Source Libraries: LibGen, Sci-Hub, Z-Library, Internet Archive, DuXiu, MagzDB, Nexus/STC, HathiTrust
 * Metadata Sources: Open Library, WorldCat, Google Books
 *
 * As of January 2026:
 * - 61,654,285 books
 * - 95,687,150 papers
 * - ~1.1 petabytes total (torrents)
 * - Estimated 16% of world's books preserved
 *
 * File Formats: PDF, EPUB, MOBI, AZW3, DJVU, CBR, CBZ, MP3, M4B
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MediaType =
  | 'book'
  | 'paper'
  | 'magazine'
  | 'comic'
  | 'audiobook'
  | 'textbook'
  | 'fiction'
  | 'non-fiction'
  | 'reference'
  | 'manual'
  | 'journal'
  | 'thesis'
  | 'dissertation';

export type FileFormat =
  | 'pdf'
  | 'epub'
  | 'mobi'
  | 'azw3'
  | 'djvu'
  | 'cbr'
  | 'cbz'
  | 'fb2'
  | 'txt'
  | 'rtf'
  | 'doc'
  | 'docx'
  | 'mp3'
  | 'm4b'
  | 'ogg';

export type ContentCategory =
  | 'science'
  | 'technology'
  | 'programming'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'medicine'
  | 'psychology'
  | 'philosophy'
  | 'history'
  | 'art'
  | 'music'
  | 'literature'
  | 'poetry'
  | 'fiction'
  | 'fantasy'
  | 'sci-fi'
  | 'mystery'
  | 'romance'
  | 'horror'
  | 'thriller'
  | 'comics'
  | 'manga'
  | 'graphic-novels'
  | 'children'
  | 'young-adult'
  | 'self-help'
  | 'business'
  | 'economics'
  | 'law'
  | 'religion'
  | 'occult'
  | 'esoteric'
  | 'crafts'
  | 'cooking'
  | 'health'
  | 'fitness'
  | 'sports'
  | 'travel'
  | 'languages'
  | 'education'
  | 'reference';

export type SourceLibrary =
  | 'libgen'
  | 'sci-hub'
  | 'z-library'
  | 'internet-archive'
  | 'duxiu'
  | 'magzdb'
  | 'nexus-stc'
  | 'hathitrust'
  | 'open-library'
  | 'project-gutenberg';

export interface AnnaArchiveMedia {
  id: string;
  md5?: string;
  title: string;
  author: string;
  authors?: string[];
  publisher?: string;
  year?: number;
  language: string;
  languages?: string[];
  mediaType: MediaType;
  category: ContentCategory;
  subcategories?: ContentCategory[];
  fileFormats: FileFormat[];
  fileSize?: string;
  fileSizeBytes?: number;
  pages?: number;
  duration?: string; // For audiobooks
  isbn?: string;
  isbn13?: string;
  doi?: string; // For papers
  description?: string;
  coverUrl?: string;
  sources: SourceLibrary[];
  downloadUrl?: string;
  mirrorUrls?: string[];
  torrentUrl?: string;
  tags: string[];
  rating?: number;
  downloadCount?: number;
  dateAdded?: string;
  lastUpdated?: string;
  series?: string;
  seriesNumber?: number;
  edition?: string;
}

export interface AnnaArchiveCollection {
  id: string;
  name: string;
  description: string;
  mediaType: MediaType;
  categories: ContentCategory[];
  itemCount: number;
  totalSize: string;
  torrentUrl?: string;
  magnetLink?: string;
  dateCreated: string;
  seeders?: number;
  leechers?: number;
}

export interface SearchOptions {
  query?: string;
  mediaType?: MediaType[];
  category?: ContentCategory[];
  language?: string[];
  format?: FileFormat[];
  source?: SourceLibrary[];
  yearFrom?: number;
  yearTo?: number;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'popular' | 'size';
  limit?: number;
  offset?: number;
}

// ============================================================================
// CURATED CONTENT COLLECTIONS
// ============================================================================

export const ANNA_ARCHIVE_COLLECTIONS: AnnaArchiveCollection[] = [
  // ==================== BOOKS ====================
  {
    id: 'libgen-fiction-2024',
    name: 'LibGen Fiction Collection 2024',
    description: 'Complete fiction library including novels, short stories, and literary works from around the world',
    mediaType: 'fiction',
    categories: ['fiction', 'literature', 'fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'thriller'],
    itemCount: 3500000,
    totalSize: '2.4 TB',
    torrentUrl: 'https://annas-archive.li/torrents/libgen-fiction',
    dateCreated: '2024-12-01',
    seeders: 450,
    leechers: 89
  },
  {
    id: 'libgen-nonfiction-2024',
    name: 'LibGen Non-Fiction Collection 2024',
    description: 'Comprehensive non-fiction library covering all academic and practical subjects',
    mediaType: 'non-fiction',
    categories: ['science', 'technology', 'history', 'philosophy', 'psychology', 'business', 'self-help'],
    itemCount: 4200000,
    totalSize: '3.8 TB',
    torrentUrl: 'https://annas-archive.li/torrents/libgen-nonfiction',
    dateCreated: '2024-12-01',
    seeders: 520,
    leechers: 112
  },
  {
    id: 'textbooks-stem-2024',
    name: 'STEM Textbooks Collection',
    description: 'University-level textbooks for Science, Technology, Engineering, and Mathematics',
    mediaType: 'textbook',
    categories: ['science', 'technology', 'mathematics', 'physics', 'chemistry', 'biology', 'programming'],
    itemCount: 850000,
    totalSize: '1.2 TB',
    torrentUrl: 'https://annas-archive.li/torrents/textbooks-stem',
    dateCreated: '2024-11-15',
    seeders: 380,
    leechers: 67
  },

  // ==================== PAPERS ====================
  {
    id: 'sci-hub-2024',
    name: 'Sci-Hub Complete Papers Archive',
    description: 'Scientific papers and research articles from all major publishers and journals',
    mediaType: 'paper',
    categories: ['science', 'medicine', 'technology', 'physics', 'chemistry', 'biology'],
    itemCount: 95687150,
    totalSize: '85 TB',
    torrentUrl: 'https://annas-archive.li/torrents/sci-hub',
    dateCreated: '2024-12-15',
    seeders: 890,
    leechers: 234
  },
  {
    id: 'arxiv-papers-2024',
    name: 'arXiv Papers Collection',
    description: 'Open access papers from arXiv covering physics, mathematics, computer science, and more',
    mediaType: 'paper',
    categories: ['science', 'mathematics', 'physics', 'programming', 'technology'],
    itemCount: 2500000,
    totalSize: '500 GB',
    torrentUrl: 'https://annas-archive.li/torrents/arxiv',
    dateCreated: '2024-11-01',
    seeders: 340,
    leechers: 45
  },

  // ==================== MAGAZINES ====================
  {
    id: 'magzdb-complete',
    name: 'MagzDB Magazine Archive',
    description: 'Thousands of magazines covering technology, science, arts, and entertainment',
    mediaType: 'magazine',
    categories: ['technology', 'science', 'art', 'music', 'sports', 'business'],
    itemCount: 450000,
    totalSize: '800 GB',
    torrentUrl: 'https://annas-archive.li/torrents/magzdb',
    dateCreated: '2024-10-01',
    seeders: 180,
    leechers: 34
  },
  {
    id: 'vintage-magazines',
    name: 'Vintage Magazines Collection (1900-1980)',
    description: 'Historical magazines and periodicals from the 20th century',
    mediaType: 'magazine',
    categories: ['history', 'art', 'science', 'literature'],
    itemCount: 125000,
    totalSize: '250 GB',
    torrentUrl: 'https://annas-archive.li/torrents/vintage-mags',
    dateCreated: '2024-08-15',
    seeders: 95,
    leechers: 12
  },

  // ==================== COMICS & GRAPHIC NOVELS ====================
  {
    id: 'comics-marvel-dc',
    name: 'Comics Collection - Marvel & DC',
    description: 'Superhero comics from Marvel and DC spanning decades of publication',
    mediaType: 'comic',
    categories: ['comics', 'graphic-novels'],
    itemCount: 85000,
    totalSize: '450 GB',
    torrentUrl: 'https://annas-archive.li/torrents/comics-marvel-dc',
    dateCreated: '2024-09-01',
    seeders: 420,
    leechers: 78
  },
  {
    id: 'manga-collection',
    name: 'Manga Complete Collection',
    description: 'Japanese manga including popular series and indie works, translated and original',
    mediaType: 'comic',
    categories: ['manga', 'comics', 'graphic-novels'],
    itemCount: 320000,
    totalSize: '1.8 TB',
    torrentUrl: 'https://annas-archive.li/torrents/manga',
    dateCreated: '2024-10-15',
    seeders: 680,
    leechers: 156
  },
  {
    id: 'indie-comics',
    name: 'Independent & Alternative Comics',
    description: 'Underground, indie, and alternative comics from around the world',
    mediaType: 'comic',
    categories: ['comics', 'graphic-novels', 'art'],
    itemCount: 45000,
    totalSize: '180 GB',
    torrentUrl: 'https://annas-archive.li/torrents/indie-comics',
    dateCreated: '2024-07-01',
    seeders: 85,
    leechers: 15
  },

  // ==================== AUDIOBOOKS ====================
  {
    id: 'audiobooks-fiction',
    name: 'Audiobooks - Fiction Collection',
    description: 'Narrated fiction including bestsellers, classics, and genre fiction',
    mediaType: 'audiobook',
    categories: ['fiction', 'fantasy', 'sci-fi', 'mystery', 'thriller', 'romance'],
    itemCount: 75000,
    totalSize: '2.5 TB',
    torrentUrl: 'https://annas-archive.li/torrents/audiobooks-fiction',
    dateCreated: '2024-11-01',
    seeders: 210,
    leechers: 45
  },
  {
    id: 'audiobooks-nonfiction',
    name: 'Audiobooks - Non-Fiction Collection',
    description: 'Narrated non-fiction including self-help, business, history, and science',
    mediaType: 'audiobook',
    categories: ['non-fiction', 'self-help', 'business', 'history', 'science'],
    itemCount: 45000,
    totalSize: '1.2 TB',
    torrentUrl: 'https://annas-archive.li/torrents/audiobooks-nonfiction',
    dateCreated: '2024-10-01',
    seeders: 145,
    leechers: 28
  },
  {
    id: 'librivox-public-domain',
    name: 'LibriVox Public Domain Audiobooks',
    description: 'Free public domain audiobooks read by volunteers',
    mediaType: 'audiobook',
    categories: ['fiction', 'literature', 'poetry', 'history', 'philosophy'],
    itemCount: 18000,
    totalSize: '450 GB',
    torrentUrl: 'https://annas-archive.li/torrents/librivox',
    dateCreated: '2024-06-01',
    seeders: 320,
    leechers: 52
  },

  // ==================== SPECIALIZED COLLECTIONS ====================
  {
    id: 'programming-books',
    name: 'Programming & Software Development',
    description: 'Books on programming languages, software development, and computer science',
    mediaType: 'textbook',
    categories: ['programming', 'technology', 'science'],
    itemCount: 125000,
    totalSize: '280 GB',
    torrentUrl: 'https://annas-archive.li/torrents/programming',
    dateCreated: '2024-12-01',
    seeders: 560,
    leechers: 98
  },
  {
    id: 'medical-library',
    name: 'Medical & Healthcare Library',
    description: 'Medical textbooks, clinical guides, and healthcare resources',
    mediaType: 'textbook',
    categories: ['medicine', 'health', 'biology', 'psychology'],
    itemCount: 180000,
    totalSize: '420 GB',
    torrentUrl: 'https://annas-archive.li/torrents/medical',
    dateCreated: '2024-11-15',
    seeders: 290,
    leechers: 56
  },
  {
    id: 'occult-esoteric',
    name: 'Occult & Esoteric Library',
    description: 'Books on occultism, mysticism, esoteric traditions, and spirituality',
    mediaType: 'book',
    categories: ['occult', 'esoteric', 'religion', 'philosophy'],
    itemCount: 45000,
    totalSize: '85 GB',
    torrentUrl: 'https://annas-archive.li/torrents/occult',
    dateCreated: '2024-09-01',
    seeders: 180,
    leechers: 34
  },
  {
    id: 'art-design',
    name: 'Art, Design & Photography',
    description: 'Books on visual arts, graphic design, photography, and art history',
    mediaType: 'book',
    categories: ['art', 'crafts'],
    itemCount: 95000,
    totalSize: '350 GB',
    torrentUrl: 'https://annas-archive.li/torrents/art-design',
    dateCreated: '2024-10-01',
    seeders: 145,
    leechers: 28
  },
  {
    id: 'cookbooks-collection',
    name: 'Cookbooks & Culinary Arts',
    description: 'Recipes, cooking techniques, and culinary traditions from around the world',
    mediaType: 'book',
    categories: ['cooking'],
    itemCount: 35000,
    totalSize: '120 GB',
    torrentUrl: 'https://annas-archive.li/torrents/cookbooks',
    dateCreated: '2024-08-01',
    seeders: 210,
    leechers: 38
  },
  {
    id: 'crafts-diy',
    name: 'Crafts, DIY & Maker Resources',
    description: 'Sewing, woodworking, electronics, and maker project books',
    mediaType: 'book',
    categories: ['crafts'],
    itemCount: 28000,
    totalSize: '95 GB',
    torrentUrl: 'https://annas-archive.li/torrents/crafts-diy',
    dateCreated: '2024-07-15',
    seeders: 125,
    leechers: 22
  },
  {
    id: 'childrens-books',
    name: 'Children\'s Books Collection',
    description: 'Picture books, chapter books, and educational materials for children',
    mediaType: 'book',
    categories: ['children', 'education'],
    itemCount: 65000,
    totalSize: '180 GB',
    torrentUrl: 'https://annas-archive.li/torrents/childrens',
    dateCreated: '2024-09-15',
    seeders: 175,
    leechers: 32
  },
  {
    id: 'young-adult',
    name: 'Young Adult Fiction',
    description: 'YA novels including fantasy, sci-fi, romance, and contemporary fiction',
    mediaType: 'fiction',
    categories: ['young-adult', 'fantasy', 'romance', 'sci-fi'],
    itemCount: 48000,
    totalSize: '145 GB',
    torrentUrl: 'https://annas-archive.li/torrents/young-adult',
    dateCreated: '2024-10-01',
    seeders: 265,
    leechers: 48
  },
  {
    id: 'classic-literature',
    name: 'Classic Literature Collection',
    description: 'Literary classics from ancient times to the 20th century',
    mediaType: 'fiction',
    categories: ['literature', 'fiction', 'poetry'],
    itemCount: 125000,
    totalSize: '85 GB',
    torrentUrl: 'https://annas-archive.li/torrents/classics',
    dateCreated: '2024-06-15',
    seeders: 380,
    leechers: 65
  },
  {
    id: 'language-learning',
    name: 'Language Learning Resources',
    description: 'Textbooks, courses, and materials for learning languages',
    mediaType: 'textbook',
    categories: ['languages', 'education'],
    itemCount: 42000,
    totalSize: '180 GB',
    torrentUrl: 'https://annas-archive.li/torrents/languages',
    dateCreated: '2024-08-01',
    seeders: 195,
    leechers: 35
  }
];

// ============================================================================
// SAMPLE CURATED MEDIA ITEMS
// ============================================================================

export const CURATED_MEDIA: AnnaArchiveMedia[] = [
  // ==================== PROGRAMMING BOOKS ====================
  {
    id: 'prog-001',
    title: 'The Art of Computer Programming, Volumes 1-4A',
    author: 'Donald Knuth',
    publisher: 'Addison-Wesley',
    year: 2011,
    language: 'English',
    mediaType: 'textbook',
    category: 'programming',
    fileFormats: ['pdf', 'epub'],
    fileSize: '145 MB',
    pages: 3168,
    description: 'The bible of all fundamental algorithms and the work that taught many of today\'s software developers most of what they know about computer programming.',
    sources: ['libgen', 'z-library'],
    tags: ['algorithms', 'computer-science', 'programming', 'classics'],
    rating: 5.0
  },
  {
    id: 'prog-002',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson, Gerald Jay Sussman',
    publisher: 'MIT Press',
    year: 1996,
    language: 'English',
    mediaType: 'textbook',
    category: 'programming',
    fileFormats: ['pdf', 'epub'],
    fileSize: '12 MB',
    pages: 657,
    description: 'A legendary introduction to programming using Scheme, teaching fundamental concepts of computer science.',
    sources: ['libgen', 'z-library', 'open-library'],
    tags: ['programming', 'lisp', 'scheme', 'computer-science', 'mit'],
    rating: 4.9
  },
  {
    id: 'prog-003',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    year: 2008,
    language: 'English',
    mediaType: 'book',
    category: 'programming',
    fileFormats: ['pdf', 'epub', 'mobi'],
    fileSize: '8.5 MB',
    pages: 464,
    description: 'Writing clean, maintainable code that works. Essential reading for any software developer.',
    sources: ['libgen', 'z-library'],
    tags: ['programming', 'best-practices', 'software-development', 'agile'],
    rating: 4.7
  },
  {
    id: 'prog-004',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Gang of Four',
    authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
    publisher: 'Addison-Wesley',
    year: 1994,
    language: 'English',
    mediaType: 'textbook',
    category: 'programming',
    fileFormats: ['pdf', 'epub'],
    fileSize: '15 MB',
    pages: 416,
    description: 'The classic catalog of design patterns for object-oriented software development.',
    sources: ['libgen', 'z-library'],
    tags: ['design-patterns', 'oop', 'software-architecture', 'classics'],
    rating: 4.8
  },

  // ==================== SCIENCE ====================
  {
    id: 'sci-001',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    publisher: 'Bantam Books',
    year: 1988,
    language: 'English',
    mediaType: 'book',
    category: 'science',
    subcategories: ['physics'],
    fileFormats: ['pdf', 'epub', 'mobi'],
    fileSize: '4.2 MB',
    pages: 212,
    description: 'A landmark volume in science writing exploring the mysteries of the universe.',
    sources: ['libgen', 'z-library'],
    tags: ['physics', 'cosmology', 'popular-science', 'classics'],
    rating: 4.8
  },
  {
    id: 'sci-002',
    title: 'The Feynman Lectures on Physics',
    author: 'Richard Feynman',
    authors: ['Richard Feynman', 'Robert Leighton', 'Matthew Sands'],
    publisher: 'Addison-Wesley',
    year: 1964,
    language: 'English',
    mediaType: 'textbook',
    category: 'physics',
    fileFormats: ['pdf'],
    fileSize: '125 MB',
    pages: 1552,
    description: 'Perhaps the most popular physics textbook ever written, covering mechanics, electromagnetism, and quantum mechanics.',
    sources: ['libgen', 'open-library'],
    tags: ['physics', 'textbook', 'classics', 'caltech'],
    rating: 5.0
  },

  // ==================== FICTION ====================
  {
    id: 'fic-001',
    title: '1984',
    author: 'George Orwell',
    publisher: 'Secker & Warburg',
    year: 1949,
    language: 'English',
    mediaType: 'fiction',
    category: 'literature',
    subcategories: ['sci-fi'],
    fileFormats: ['pdf', 'epub', 'mobi', 'fb2'],
    fileSize: '1.2 MB',
    pages: 328,
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    sources: ['libgen', 'z-library', 'project-gutenberg'],
    tags: ['dystopia', 'classic', 'political', 'must-read'],
    rating: 4.9
  },
  {
    id: 'fic-002',
    title: 'Dune',
    author: 'Frank Herbert',
    publisher: 'Chilton Books',
    year: 1965,
    language: 'English',
    mediaType: 'fiction',
    category: 'sci-fi',
    series: 'Dune',
    seriesNumber: 1,
    fileFormats: ['pdf', 'epub', 'mobi'],
    fileSize: '2.8 MB',
    pages: 412,
    description: 'A science fiction masterpiece set on the desert planet Arrakis.',
    sources: ['libgen', 'z-library'],
    tags: ['sci-fi', 'space-opera', 'classic', 'desert', 'politics'],
    rating: 4.9
  },
  {
    id: 'fic-003',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    publisher: 'Allen & Unwin',
    year: 1954,
    language: 'English',
    mediaType: 'fiction',
    category: 'fantasy',
    fileFormats: ['pdf', 'epub', 'mobi'],
    fileSize: '8.5 MB',
    pages: 1178,
    description: 'The epic fantasy that defined the genre, following Frodo\'s quest to destroy the One Ring.',
    sources: ['libgen', 'z-library'],
    tags: ['fantasy', 'epic', 'classic', 'adventure', 'must-read'],
    rating: 4.9
  },

  // ==================== COMICS & MANGA ====================
  {
    id: 'comic-001',
    title: 'Watchmen',
    author: 'Alan Moore',
    authors: ['Alan Moore', 'Dave Gibbons'],
    publisher: 'DC Comics',
    year: 1986,
    language: 'English',
    mediaType: 'comic',
    category: 'comics',
    subcategories: ['graphic-novels'],
    fileFormats: ['cbr', 'cbz', 'pdf'],
    fileSize: '450 MB',
    pages: 416,
    description: 'The groundbreaking graphic novel that deconstructed the superhero genre.',
    sources: ['libgen'],
    tags: ['superhero', 'deconstruction', 'classic', 'dc-comics', 'masterpiece'],
    rating: 4.9
  },
  {
    id: 'manga-001',
    title: 'Berserk (Complete)',
    author: 'Kentaro Miura',
    publisher: 'Hakusensha',
    year: 1989,
    language: 'English',
    languages: ['English', 'Japanese'],
    mediaType: 'comic',
    category: 'manga',
    fileFormats: ['cbz', 'pdf'],
    fileSize: '15 GB',
    pages: 12000,
    description: 'Dark fantasy manga following the mercenary Guts on his quest for revenge.',
    sources: ['libgen'],
    tags: ['dark-fantasy', 'action', 'seinen', 'medieval', 'epic'],
    rating: 4.9
  },

  // ==================== AUDIOBOOKS ====================
  {
    id: 'audio-001',
    title: 'The Hitchhiker\'s Guide to the Galaxy',
    author: 'Douglas Adams',
    publisher: 'BBC Audiobooks',
    year: 2005,
    language: 'English',
    mediaType: 'audiobook',
    category: 'sci-fi',
    fileFormats: ['mp3', 'm4b'],
    fileSize: '340 MB',
    duration: '5h 51m',
    description: 'The comedic sci-fi classic, narrated by Stephen Fry.',
    sources: ['libgen'],
    tags: ['comedy', 'sci-fi', 'classic', 'british', 'satire'],
    rating: 4.8
  },
  {
    id: 'audio-002',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    publisher: 'Audible Studios',
    year: 2021,
    language: 'English',
    mediaType: 'audiobook',
    category: 'sci-fi',
    fileFormats: ['mp3', 'm4b'],
    fileSize: '680 MB',
    duration: '16h 10m',
    description: 'A lone astronaut must save Earth from extinction. Narrated by Ray Porter.',
    sources: ['libgen'],
    tags: ['sci-fi', 'space', 'survival', 'science', 'aliens'],
    rating: 4.9
  },

  // ==================== OCCULT & ESOTERIC ====================
  {
    id: 'occ-001',
    title: 'The Key of Solomon the King',
    author: 'S.L. MacGregor Mathers (translator)',
    publisher: 'Weiser Books',
    year: 1889,
    language: 'English',
    mediaType: 'book',
    category: 'occult',
    subcategories: ['esoteric'],
    fileFormats: ['pdf', 'epub'],
    fileSize: '8 MB',
    pages: 128,
    description: 'The most famous grimoire of ceremonial magic, attributed to King Solomon.',
    sources: ['libgen', 'internet-archive'],
    tags: ['grimoire', 'ceremonial-magic', 'solomon', 'classic', 'esoteric'],
    rating: 4.5
  },
  {
    id: 'occ-002',
    title: 'Hoodoo Herb and Root Magic',
    author: 'Catherine Yronwode',
    publisher: 'Lucky Mojo Curio Company',
    year: 2002,
    language: 'English',
    mediaType: 'book',
    category: 'occult',
    fileFormats: ['pdf'],
    fileSize: '12 MB',
    pages: 224,
    description: 'A comprehensive guide to folk magic herbs, roots, and minerals.',
    sources: ['libgen'],
    tags: ['hoodoo', 'folk-magic', 'herbs', 'rootwork', 'african-american'],
    rating: 4.7
  },

  // ==================== CRAFTS & DIY ====================
  {
    id: 'craft-001',
    title: 'The Complete Book of Sewing',
    author: 'DK Publishing',
    publisher: 'DK',
    year: 2016,
    language: 'English',
    mediaType: 'book',
    category: 'crafts',
    fileFormats: ['pdf', 'epub'],
    fileSize: '95 MB',
    pages: 400,
    description: 'Comprehensive guide to sewing with step-by-step instructions and patterns.',
    sources: ['libgen'],
    tags: ['sewing', 'crafts', 'diy', 'fashion', 'patterns'],
    rating: 4.6
  },
  {
    id: 'craft-002',
    title: 'The Art of Electronics',
    author: 'Paul Horowitz, Winfield Hill',
    publisher: 'Cambridge University Press',
    year: 2015,
    language: 'English',
    mediaType: 'textbook',
    category: 'technology',
    subcategories: ['crafts'],
    fileFormats: ['pdf'],
    fileSize: '45 MB',
    pages: 1220,
    edition: '3rd Edition',
    description: 'The bible of electronics, covering everything from basic circuits to advanced design.',
    sources: ['libgen', 'z-library'],
    tags: ['electronics', 'circuits', 'engineering', 'diy', 'maker'],
    rating: 4.9
  },

  // ==================== PAPERS ====================
  {
    id: 'paper-001',
    title: 'Attention Is All You Need',
    author: 'Ashish Vaswani et al.',
    publisher: 'Google Research',
    year: 2017,
    language: 'English',
    mediaType: 'paper',
    category: 'technology',
    subcategories: ['programming'],
    fileFormats: ['pdf'],
    fileSize: '1.2 MB',
    pages: 15,
    doi: '10.48550/arXiv.1706.03762',
    description: 'The paper that introduced the Transformer architecture, revolutionizing NLP and AI.',
    sources: ['sci-hub', 'libgen'],
    tags: ['machine-learning', 'transformers', 'nlp', 'ai', 'landmark'],
    rating: 5.0
  },
  {
    id: 'paper-002',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    author: 'Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton',
    publisher: 'NIPS',
    year: 2012,
    language: 'English',
    mediaType: 'paper',
    category: 'technology',
    fileFormats: ['pdf'],
    fileSize: '800 KB',
    pages: 9,
    description: 'The AlexNet paper that sparked the deep learning revolution in computer vision.',
    sources: ['sci-hub'],
    tags: ['deep-learning', 'cnn', 'computer-vision', 'imagenet', 'landmark'],
    rating: 5.0
  }
];

// ============================================================================
// LANGUAGE SUPPORT
// ============================================================================

export const SUPPORTED_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Vietnamese',
  'Thai', 'Indonesian', 'Malay', 'Turkish', 'Polish', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Czech', 'Hungarian', 'Romanian', 'Greek',
  'Hebrew', 'Persian', 'Ukrainian', 'Serbian', 'Croatian', 'Bulgarian',
  'Slovak', 'Slovenian', 'Lithuanian', 'Latvian', 'Estonian'
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function searchMedia(options: SearchOptions): AnnaArchiveMedia[] {
  let results = [...CURATED_MEDIA];

  if (options.query) {
    const query = options.query.toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (options.mediaType && options.mediaType.length > 0) {
    results = results.filter(item => options.mediaType!.includes(item.mediaType));
  }

  if (options.category && options.category.length > 0) {
    results = results.filter(item =>
      options.category!.includes(item.category) ||
      item.subcategories?.some(sub => options.category!.includes(sub))
    );
  }

  if (options.language && options.language.length > 0) {
    results = results.filter(item =>
      options.language!.includes(item.language) ||
      item.languages?.some(lang => options.language!.includes(lang))
    );
  }

  if (options.format && options.format.length > 0) {
    results = results.filter(item =>
      item.fileFormats.some(fmt => options.format!.includes(fmt))
    );
  }

  if (options.source && options.source.length > 0) {
    results = results.filter(item =>
      item.sources.some(src => options.source!.includes(src))
    );
  }

  if (options.yearFrom) {
    results = results.filter(item => item.year && item.year >= options.yearFrom!);
  }

  if (options.yearTo) {
    results = results.filter(item => item.year && item.year <= options.yearTo!);
  }

  // Sorting
  switch (options.sortBy) {
    case 'newest':
      results.sort((a, b) => (b.year || 0) - (a.year || 0));
      break;
    case 'oldest':
      results.sort((a, b) => (a.year || 0) - (b.year || 0));
      break;
    case 'popular':
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'size':
      results.sort((a, b) => (b.fileSizeBytes || 0) - (a.fileSizeBytes || 0));
      break;
    default:
      // relevance - keep current order
      break;
  }

  // Pagination
  const offset = options.offset || 0;
  const limit = options.limit || 50;
  results = results.slice(offset, offset + limit);

  return results;
}

export function getCollectionsByCategory(category: ContentCategory): AnnaArchiveCollection[] {
  return ANNA_ARCHIVE_COLLECTIONS.filter(col => col.categories.includes(category));
}

export function getCollectionsByMediaType(mediaType: MediaType): AnnaArchiveCollection[] {
  return ANNA_ARCHIVE_COLLECTIONS.filter(col => col.mediaType === mediaType);
}

export function getMediaByCategory(category: ContentCategory): AnnaArchiveMedia[] {
  return CURATED_MEDIA.filter(
    item => item.category === category || item.subcategories?.includes(category)
  );
}

export function getMediaByFormat(format: FileFormat): AnnaArchiveMedia[] {
  return CURATED_MEDIA.filter(item => item.fileFormats.includes(format));
}

export function getTotalStats() {
  return {
    totalBooks: 61654285,
    totalPapers: 95687150,
    totalSize: '1.1 PB',
    worldBooksPreserved: '16%',
    sources: [
      'LibGen (Library Genesis)',
      'Sci-Hub',
      'Z-Library',
      'Internet Archive',
      'DuXiu',
      'MagzDB',
      'Nexus/STC',
      'HathiTrust',
      'Open Library (metadata)',
      'WorldCat (metadata)',
      'Google Books (metadata)'
    ],
    lastUpdated: '2026-01-15'
  };
}

export function generateSearchUrl(query: string, filters?: Partial<SearchOptions>): string {
  let url = `https://annas-archive.li/search?q=${encodeURIComponent(query)}`;

  if (filters?.language && filters.language.length > 0) {
    url += `&lang=${filters.language[0].toLowerCase()}`;
  }

  if (filters?.format && filters.format.length > 0) {
    url += `&ext=${filters.format.join(',')}`;
  }

  return url;
}

export function generateDownloadUrl(md5: string): string {
  return `https://annas-archive.li/md5/${md5}`;
}

export function generateTorrentUrl(collectionId: string): string {
  const collection = ANNA_ARCHIVE_COLLECTIONS.find(c => c.id === collectionId);
  return collection?.torrentUrl || `https://annas-archive.li/torrents/${collectionId}`;
}

// ============================================================================
// ROOM INTEGRATION FOR GOTHIC MANSION
// ============================================================================

export const ROOM_MEDIA_MAPPING: Record<string, ContentCategory[]> = {
  'grand-library': ['literature', 'fiction', 'history', 'philosophy', 'poetry'],
  'study-den': ['programming', 'technology', 'science', 'mathematics'],
  'music-conservatory': ['music', 'art'],
  'art-gallery': ['art', 'graphic-novels', 'comics'],
  'occult-chamber': ['occult', 'esoteric', 'religion'],
  'laboratory': ['science', 'chemistry', 'biology', 'medicine'],
  'observatory': ['physics', 'science'],
  'servants-quarters': ['cooking', 'crafts'],
  'nursery': ['children', 'young-adult', 'education'],
  'game-room': ['comics', 'manga', 'fantasy', 'sci-fi']
};

export function getMediaForRoom(roomId: string): AnnaArchiveMedia[] {
  const categories = ROOM_MEDIA_MAPPING[roomId] || [];
  return CURATED_MEDIA.filter(
    item => categories.includes(item.category) ||
    item.subcategories?.some(sub => categories.includes(sub))
  );
}

export function getCollectionsForRoom(roomId: string): AnnaArchiveCollection[] {
  const categories = ROOM_MEDIA_MAPPING[roomId] || [];
  return ANNA_ARCHIVE_COLLECTIONS.filter(
    col => col.categories.some(cat => categories.includes(cat))
  );
}

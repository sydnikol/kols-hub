/**
 * COMPREHENSIVE LIBRE RESOURCES DATABASE
 * =======================================
 * All free, open-source, and public domain resources
 * Embedded directly into Kol's Hub
 */

// ============================================
// LITERATURE & EBOOKS
// ============================================
export const LIBRE_LITERATURE = {
  projectGutenberg: {
    name: "Project Gutenberg",
    description: "Over 70,000 free eBooks - classics, literature, reference",
    baseUrl: "https://www.gutenberg.org",
    apiEndpoint: "https://gutendex.com/books/",
    embedType: "iframe",
    categories: ["fiction", "non-fiction", "poetry", "drama", "philosophy", "history"],
    features: ["epub", "kindle", "html", "plain-text"],
    totalItems: 70000,
    license: "Public Domain"
  },
  libraryGenesis: {
    name: "Library Genesis",
    description: "Academic papers, textbooks, fiction, comics, magazines",
    mirrors: [
      "https://libgen.is",
      "https://libgen.rs",
      "https://libgen.st"
    ],
    categories: ["textbooks", "fiction", "comics", "magazines", "academic"],
    searchFields: ["title", "author", "isbn", "publisher"],
    license: "Various"
  },
  annasArchive: {
    name: "Anna's Archive",
    description: "Search engine for shadow libraries - books, papers, magazines",
    baseUrl: "https://annas-archive.org",
    embedType: "search",
    sources: ["libgen", "scihub", "zlib", "openlib"],
    totalItems: 30000000,
    categories: ["books", "papers", "standards", "magazines"],
    license: "Various/Public Domain"
  },
  standardEbooks: {
    name: "Standard Ebooks",
    description: "Beautifully formatted public domain ebooks",
    baseUrl: "https://standardebooks.org",
    apiEndpoint: "https://standardebooks.org/opds",
    features: ["professional-formatting", "modern-typography", "epub3"],
    categories: ["classics", "fiction", "poetry", "philosophy"],
    license: "Public Domain"
  },
  manyBooks: {
    name: "ManyBooks",
    description: "50,000+ free ebooks in multiple formats",
    baseUrl: "https://manybooks.net",
    formats: ["epub", "mobi", "pdf", "txt"],
    categories: ["fiction", "non-fiction", "young-adult", "romance", "mystery"],
    totalItems: 50000,
    license: "Public Domain/Creative Commons"
  },
  openLibrary: {
    name: "Open Library",
    description: "Internet Archive's open, editable library catalog",
    baseUrl: "https://openlibrary.org",
    apiEndpoint: "https://openlibrary.org/api",
    features: ["borrow", "read-online", "lists", "reviews"],
    totalItems: 4000000,
    license: "Various"
  },
  wikisource: {
    name: "Wikisource",
    description: "Free library of source texts",
    baseUrl: "https://wikisource.org",
    languages: 70,
    features: ["proofread", "scanned", "multilingual"],
    license: "Public Domain/CC"
  },
  wikibooks: {
    name: "Wikibooks & Cookbook",
    description: "Open-content textbooks and cookbooks",
    baseUrl: "https://wikibooks.org",
    cookbookUrl: "https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents",
    categories: ["textbooks", "how-to", "recipes", "computing"],
    license: "CC BY-SA"
  }
};

// ============================================
// AUDIO & AUDIOBOOKS
// ============================================
export const LIBRE_AUDIO = {
  librivox: {
    name: "LibriVox",
    description: "Free public domain audiobooks read by volunteers",
    baseUrl: "https://librivox.org",
    apiEndpoint: "https://librivox.org/api/feed/audiobooks",
    formats: ["mp3", "ogg", "m4b"],
    totalBooks: 18000,
    languages: 40,
    license: "Public Domain"
  },
  freeMusicArchive: {
    name: "Free Music Archive",
    description: "High-quality, legal audio downloads",
    baseUrl: "https://freemusicarchive.org",
    genres: ["electronic", "rock", "hip-hop", "classical", "jazz", "folk", "experimental"],
    licenses: ["CC0", "CC BY", "CC BY-SA", "CC BY-NC"],
    totalTracks: 150000
  },
  freesound: {
    name: "Freesound",
    description: "Collaborative database of Creative Commons sounds",
    baseUrl: "https://freesound.org",
    apiEndpoint: "https://freesound.org/apiv2",
    categories: ["field-recordings", "synthesized", "samples", "loops", "effects"],
    totalSounds: 500000,
    license: "CC0/CC BY/CC BY-NC"
  },
  jamendo: {
    name: "Jamendo",
    description: "Free music streaming and licensing platform",
    baseUrl: "https://www.jamendo.com",
    features: ["streaming", "download", "licensing"],
    genres: ["all"],
    license: "CC"
  },
  musopen: {
    name: "Musopen",
    description: "Free classical music recordings and sheet music",
    baseUrl: "https://musopen.org",
    categories: ["recordings", "sheet-music", "textbooks"],
    license: "Public Domain/CC"
  }
};

// ============================================
// IMAGES & ART
// ============================================
export const LIBRE_IMAGES = {
  unsplash: {
    name: "Unsplash",
    description: "Beautiful free images and photos",
    baseUrl: "https://unsplash.com",
    apiEndpoint: "https://api.unsplash.com",
    totalPhotos: 4000000,
    license: "Unsplash License (free commercial use)",
    embedType: "api"
  },
  pexels: {
    name: "Pexels",
    description: "Free stock photos and videos",
    baseUrl: "https://www.pexels.com",
    apiEndpoint: "https://api.pexels.com/v1",
    features: ["photos", "videos"],
    license: "Pexels License (free commercial use)"
  },
  pixabay: {
    name: "Pixabay",
    description: "Free images, videos, music, sound effects",
    baseUrl: "https://pixabay.com",
    apiEndpoint: "https://pixabay.com/api/",
    mediaTypes: ["photos", "illustrations", "vectors", "videos", "music", "sound-effects"],
    totalItems: 2900000,
    license: "Pixabay License (free commercial use)"
  },
  wikimediaCommons: {
    name: "Wikimedia Commons",
    description: "90+ million free media files",
    baseUrl: "https://commons.wikimedia.org",
    apiEndpoint: "https://commons.wikimedia.org/w/api.php",
    mediaTypes: ["images", "audio", "video", "documents"],
    totalItems: 90000000,
    license: "Various CC/PD"
  },
  openGameArt: {
    name: "OpenGameArt",
    description: "Free game assets - sprites, textures, sounds, music",
    baseUrl: "https://opengameart.org",
    categories: ["2d-art", "3d-art", "textures", "music", "sound-effects"],
    formats: ["png", "svg", "obj", "blend", "ogg", "wav"],
    license: "CC0/CC BY/GPL"
  },
  publicDomainPictures: {
    name: "Public Domain Pictures",
    description: "Free public domain photos",
    baseUrl: "https://www.publicdomainpictures.net",
    license: "CC0 Public Domain"
  },
  ccSearch: {
    name: "CC Search (Openverse)",
    description: "Search engine for Creative Commons content",
    baseUrl: "https://search.creativecommons.org",
    alternateUrl: "https://openverse.org",
    sources: ["flickr", "wikimedia", "europeana", "met", "nypl"],
    license: "Various CC"
  }
};

// ============================================
// MUSEUMS & CULTURAL INSTITUTIONS
// ============================================
export const LIBRE_MUSEUMS = {
  smithsonianOpenAccess: {
    name: "Smithsonian Open Access",
    description: "4.5+ million digital items from Smithsonian collections",
    baseUrl: "https://www.si.edu/openaccess",
    apiEndpoint: "https://api.si.edu/openaccess/api/v1.0",
    totalItems: 4500000,
    categories: ["art", "science", "history", "culture"],
    license: "CC0"
  },
  metropolitanMuseum: {
    name: "Metropolitan Museum of Art",
    description: "Open Access images of artworks",
    baseUrl: "https://www.metmuseum.org/art/collection",
    apiEndpoint: "https://collectionapi.metmuseum.org/public/collection/v1",
    totalItems: 470000,
    license: "CC0"
  },
  rijksmuseum: {
    name: "Rijksmuseum",
    description: "Dutch masters and more - high-res images",
    baseUrl: "https://www.rijksmuseum.nl",
    apiEndpoint: "https://www.rijksmuseum.nl/api",
    features: ["high-resolution", "masterpieces", "dutch-art"],
    license: "CC0"
  },
  clevelandMuseum: {
    name: "Cleveland Museum of Art",
    description: "Open Access collection images",
    baseUrl: "https://www.clevelandart.org/open-access",
    apiEndpoint: "https://openaccess-api.clevelandart.org/api",
    totalItems: 61000,
    license: "CC0"
  },
  artInstituteChicago: {
    name: "Art Institute of Chicago",
    description: "High-quality images of artworks",
    baseUrl: "https://www.artic.edu/collection",
    apiEndpoint: "https://api.artic.edu/api/v1",
    totalItems: 120000,
    license: "CC0"
  },
  europeana: {
    name: "Europeana",
    description: "European cultural heritage collections",
    baseUrl: "https://www.europeana.eu",
    apiEndpoint: "https://api.europeana.eu/record/v2",
    totalItems: 50000000,
    sources: ["museums", "libraries", "archives"],
    license: "Various"
  },
  dpla: {
    name: "Digital Public Library of America",
    description: "Free access to America's heritage",
    baseUrl: "https://dp.la",
    apiEndpoint: "https://api.dp.la/v2",
    totalItems: 47000000,
    license: "Various"
  },
  publicDomainReview: {
    name: "Public Domain Review",
    description: "Curated collections of interesting PD works",
    baseUrl: "https://publicdomainreview.org",
    features: ["essays", "collections", "curated"],
    license: "Public Domain"
  },
  openCulture: {
    name: "Open Culture",
    description: "Free cultural and educational media",
    baseUrl: "https://www.openculture.com",
    categories: ["courses", "movies", "ebooks", "audiobooks", "textbooks"],
    license: "Various Free"
  }
};

// ============================================
// EDUCATION & ACADEMIC
// ============================================
export const LIBRE_EDUCATION = {
  khanAcademy: {
    name: "Khan Academy",
    description: "Free world-class education",
    baseUrl: "https://www.khanacademy.org",
    embedType: "iframe",
    subjects: ["math", "science", "computing", "economics", "arts", "test-prep"],
    features: ["videos", "exercises", "progress-tracking"],
    license: "CC BY-NC-SA"
  },
  mitOpenCourseWare: {
    name: "MIT OpenCourseWare",
    description: "Free MIT course materials",
    baseUrl: "https://ocw.mit.edu",
    totalCourses: 2500,
    subjects: ["engineering", "science", "humanities", "business"],
    features: ["lecture-notes", "videos", "assignments", "exams"],
    license: "CC BY-NC-SA"
  },
  coursera: {
    name: "Coursera (Free Courses)",
    description: "University courses - audit for free",
    baseUrl: "https://www.coursera.org",
    partners: ["stanford", "yale", "michigan", "google", "ibm"],
    features: ["videos", "quizzes", "certificates-paid"],
    license: "Various"
  },
  arxiv: {
    name: "arXiv",
    description: "Open access scientific papers",
    baseUrl: "https://arxiv.org",
    apiEndpoint: "https://export.arxiv.org/api/query",
    categories: ["physics", "mathematics", "cs", "biology", "economics", "statistics"],
    totalPapers: 2300000,
    license: "Various Open"
  },
  pubmedCentral: {
    name: "PubMed Central",
    description: "Free full-text biomedical and life sciences",
    baseUrl: "https://www.ncbi.nlm.nih.gov/pmc",
    apiEndpoint: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
    totalArticles: 8000000,
    license: "Various Open Access"
  },
  biorxiv: {
    name: "bioRxiv & medRxiv",
    description: "Preprint servers for biology and medicine",
    bioUrl: "https://www.biorxiv.org",
    medUrl: "https://www.medrxiv.org",
    apiEndpoint: "https://api.biorxiv.org",
    license: "CC BY"
  },
  plos: {
    name: "PLOS (Public Library of Science)",
    description: "Open access peer-reviewed journals",
    baseUrl: "https://plos.org",
    journals: ["PLOS ONE", "PLOS Biology", "PLOS Medicine", "PLOS Genetics"],
    license: "CC BY"
  },
  fossilBank: {
    name: "Fossil Bank / Paleobiology DB",
    description: "Fossil occurrence data",
    baseUrl: "https://paleobiodb.org",
    apiEndpoint: "https://paleobiodb.org/data1.2",
    license: "CC BY"
  },
  csVideoCourses: {
    name: "CS Video Courses",
    description: "Free computer science video lectures",
    sources: [
      { name: "MIT 6.006", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" },
      { name: "Stanford CS229", url: "https://cs229.stanford.edu/" },
      { name: "Harvard CS50", url: "https://cs50.harvard.edu/" }
    ],
    license: "Various CC"
  }
};

// ============================================
// REFERENCE & INFORMATION
// ============================================
export const LIBRE_REFERENCE = {
  wikipedia: {
    name: "Wikipedia",
    description: "The free encyclopedia",
    baseUrl: "https://wikipedia.org",
    apiEndpoint: "https://en.wikipedia.org/w/api.php",
    languages: 300,
    articles: 60000000,
    embedType: "api",
    license: "CC BY-SA"
  },
  wiktionary: {
    name: "Wiktionary",
    description: "Free dictionary in every language",
    baseUrl: "https://wiktionary.org",
    apiEndpoint: "https://en.wiktionary.org/w/api.php",
    entries: 7000000,
    license: "CC BY-SA"
  },
  wikihow: {
    name: "WikiHow",
    description: "How-to guides for everything",
    baseUrl: "https://www.wikihow.com",
    articles: 200000,
    features: ["step-by-step", "illustrations", "videos"],
    license: "CC BY-NC-SA"
  },
  openStreetMap: {
    name: "OpenStreetMap",
    description: "Free editable map of the world",
    baseUrl: "https://www.openstreetmap.org",
    apiEndpoint: "https://api.openstreetmap.org/api/0.6",
    embedType: "iframe",
    license: "ODbL"
  },
  openFoodFacts: {
    name: "Open Food Facts",
    description: "Free food products database",
    baseUrl: "https://world.openfoodfacts.org",
    apiEndpoint: "https://world.openfoodfacts.org/api/v0",
    products: 2500000,
    license: "ODbL"
  }
};

// ============================================
// SOFTWARE & DEVELOPMENT
// ============================================
export const LIBRE_SOFTWARE = {
  // Creative Software
  blender: {
    name: "Blender",
    description: "3D creation suite - modeling, animation, rendering",
    website: "https://www.blender.org",
    downloadUrl: "https://www.blender.org/download/",
    category: "3d-graphics",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  gimp: {
    name: "GIMP",
    description: "GNU Image Manipulation Program",
    website: "https://www.gimp.org",
    downloadUrl: "https://www.gimp.org/downloads/",
    category: "image-editing",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  inkscape: {
    name: "Inkscape",
    description: "Professional vector graphics editor",
    website: "https://inkscape.org",
    downloadUrl: "https://inkscape.org/release/",
    category: "vector-graphics",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  krita: {
    name: "Krita",
    description: "Digital painting and illustration",
    website: "https://krita.org",
    downloadUrl: "https://krita.org/en/download/",
    category: "digital-art",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  audacity: {
    name: "Audacity",
    description: "Free audio editor and recorder",
    website: "https://www.audacityteam.org",
    downloadUrl: "https://www.audacityteam.org/download/",
    category: "audio-editing",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  obsStudio: {
    name: "OBS Studio",
    description: "Free streaming and recording software",
    website: "https://obsproject.com",
    downloadUrl: "https://obsproject.com/download",
    category: "streaming",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  // Productivity
  libreOffice: {
    name: "LibreOffice",
    description: "Free office suite - Writer, Calc, Impress",
    website: "https://www.libreoffice.org",
    downloadUrl: "https://www.libreoffice.org/download/download/",
    apps: ["Writer", "Calc", "Impress", "Draw", "Base", "Math"],
    category: "office-suite",
    platforms: ["windows", "mac", "linux"],
    license: "MPL"
  },
  // Game Development
  godotEngine: {
    name: "Godot Engine",
    description: "Open source game engine",
    website: "https://godotengine.org",
    downloadUrl: "https://godotengine.org/download",
    features: ["2d", "3d", "gdscript", "c#", "visual-scripting"],
    category: "game-engine",
    platforms: ["windows", "mac", "linux"],
    license: "MIT"
  },
  // Utilities
  qbittorrent: {
    name: "qBittorrent",
    description: "Free BitTorrent client",
    website: "https://www.qbittorrent.org",
    downloadUrl: "https://www.qbittorrent.org/download.php",
    category: "torrent-client",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  nextcloud: {
    name: "Nextcloud",
    description: "Self-hosted cloud storage and collaboration",
    website: "https://nextcloud.com",
    downloadUrl: "https://nextcloud.com/install/",
    features: ["files", "calendar", "contacts", "mail", "talk"],
    category: "cloud-storage",
    license: "AGPL"
  }
};

// ============================================
// SOFTWARE REPOSITORIES
// ============================================
export const LIBRE_REPOSITORIES = {
  fosshub: {
    name: "FossHub",
    description: "Free and open source software downloads",
    baseUrl: "https://www.fosshub.com",
    categories: ["audio", "development", "graphics", "internet", "utilities"],
    license: "Various FOSS"
  },
  sourceforge: {
    name: "SourceForge",
    description: "Open source software repository",
    baseUrl: "https://sourceforge.net",
    projects: 500000,
    categories: ["development", "games", "multimedia", "office", "internet"],
    license: "Various"
  },
  ninite: {
    name: "Ninite",
    description: "Install and update multiple apps at once",
    baseUrl: "https://ninite.com",
    features: ["batch-install", "auto-update", "no-toolbars"],
    platforms: ["windows"],
    license: "Freeware"
  },
  github: {
    name: "GitHub",
    description: "World's largest code repository",
    baseUrl: "https://github.com",
    apiEndpoint: "https://api.github.com",
    repos: 200000000,
    features: ["git-hosting", "issues", "actions", "packages"],
    license: "Various"
  },
  npmRegistry: {
    name: "npm Registry",
    description: "JavaScript package manager",
    baseUrl: "https://www.npmjs.com",
    apiEndpoint: "https://registry.npmjs.org",
    packages: 2000000,
    license: "Various"
  },
  pypi: {
    name: "PyPI",
    description: "Python Package Index",
    baseUrl: "https://pypi.org",
    apiEndpoint: "https://pypi.org/pypi",
    packages: 500000,
    license: "Various"
  },
  srht: {
    name: "Sourcehut (sr.ht)",
    description: "Minimalist software forge",
    baseUrl: "https://sr.ht",
    features: ["git", "hg", "lists", "builds", "pages"],
    license: "Various FOSS"
  }
};

// ============================================
// DATASETS & MACHINE LEARNING
// ============================================
export const LIBRE_DATASETS = {
  kaggle: {
    name: "Kaggle Datasets",
    description: "Data science datasets and competitions",
    baseUrl: "https://www.kaggle.com/datasets",
    totalDatasets: 200000,
    categories: ["ml", "analytics", "visualization"],
    license: "Various"
  },
  dataGov: {
    name: "Data.gov",
    description: "US Government open data",
    baseUrl: "https://data.gov",
    apiEndpoint: "https://catalog.data.gov/api/3",
    datasets: 300000,
    license: "Public Domain"
  },
  huggingFace: {
    name: "Hugging Face Datasets",
    description: "ML datasets hub",
    baseUrl: "https://huggingface.co/datasets",
    categories: ["nlp", "vision", "audio", "tabular"],
    totalDatasets: 100000,
    license: "Various"
  },
  uciML: {
    name: "UCI Machine Learning Repository",
    description: "Classic ML datasets",
    baseUrl: "https://archive.ics.uci.edu/ml",
    datasets: 600,
    license: "Various"
  },
  awsOpenData: {
    name: "AWS Open Data Registry",
    description: "Public datasets on AWS",
    baseUrl: "https://registry.opendata.aws",
    categories: ["genomics", "satellite", "climate", "census"],
    license: "Various"
  },
  googleDatasetSearch: {
    name: "Google Dataset Search",
    description: "Search engine for datasets",
    baseUrl: "https://datasetsearch.research.google.com",
    license: "Various"
  },
  openML: {
    name: "OpenML",
    description: "Machine learning platform",
    baseUrl: "https://www.openml.org",
    apiEndpoint: "https://www.openml.org/api/v1",
    datasets: 20000,
    license: "Various"
  }
};

// ============================================
// LIBRE GAMES
// ============================================
export const LIBRE_GAMES = {
  // Strategy
  zeroAD: {
    name: "0 A.D.",
    description: "Free RTS game of ancient warfare",
    website: "https://play0ad.com",
    downloadUrl: "https://play0ad.com/download/",
    genre: "rts",
    platforms: ["windows", "mac", "linux"],
    license: "GPL/CC BY-SA"
  },
  battleForWesnoth: {
    name: "Battle for Wesnoth",
    description: "Turn-based strategy with fantasy theme",
    website: "https://www.wesnoth.org",
    downloadUrl: "https://www.wesnoth.org/",
    genre: "turn-based-strategy",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    license: "GPL"
  },
  freeciv: {
    name: "Freeciv",
    description: "Free Civilization clone",
    website: "https://freeciv.org",
    downloadUrl: "https://freeciv.org/download/",
    genre: "4x-strategy",
    platforms: ["windows", "mac", "linux", "web"],
    license: "GPL"
  },
  openTTD: {
    name: "OpenTTD",
    description: "Transport Tycoon Deluxe clone",
    website: "https://www.openttd.org",
    downloadUrl: "https://www.openttd.org/downloads/openttd-releases/latest",
    genre: "simulation",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  widelands: {
    name: "Widelands",
    description: "Free real-time strategy game",
    website: "https://www.widelands.org",
    downloadUrl: "https://www.widelands.org/wiki/Download/",
    genre: "rts",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  // RPG
  stendhal: {
    name: "Stendhal",
    description: "Free multiplayer online RPG",
    website: "https://stendhalgame.org",
    downloadUrl: "https://stendhalgame.org/download.html",
    genre: "mmorpg",
    platforms: ["windows", "mac", "linux", "web"],
    license: "GPL"
  },
  // Adventure/Action
  minetest: {
    name: "Minetest",
    description: "Free voxel game engine (Minecraft-like)",
    website: "https://www.minetest.net",
    downloadUrl: "https://www.minetest.net/downloads/",
    genre: "sandbox",
    platforms: ["windows", "mac", "linux", "android"],
    license: "LGPL"
  },
  superTux: {
    name: "SuperTux",
    description: "Free side-scrolling platformer",
    website: "https://www.supertux.org",
    downloadUrl: "https://www.supertux.org/download.html",
    genre: "platformer",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  xonotic: {
    name: "Xonotic",
    description: "Free fast-paced arena FPS",
    website: "https://xonotic.org",
    downloadUrl: "https://xonotic.org/download/",
    genre: "fps",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  // Simulation
  endlessSky: {
    name: "Endless Sky",
    description: "Free space exploration and trading game",
    website: "https://endless-sky.github.io",
    downloadUrl: "https://endless-sky.github.io/",
    genre: "space-sim",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  flightgear: {
    name: "FlightGear",
    description: "Free flight simulator",
    website: "https://www.flightgear.org",
    downloadUrl: "https://www.flightgear.org/download/",
    genre: "flight-sim",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  // Engines
  solarusEngine: {
    name: "Solarus Engine",
    description: "Action-RPG game engine (Zelda-like)",
    website: "https://www.solarus-games.org",
    downloadUrl: "https://www.solarus-games.org/en/solarus/download",
    genre: "action-rpg",
    platforms: ["windows", "mac", "linux"],
    license: "GPL"
  },
  libreGameWiki: {
    name: "Libre Game Wiki",
    description: "Wiki for free and open source games",
    website: "https://libregamewiki.org",
    license: "CC BY-SA"
  }
};

// ============================================
// TABLETOP & RPG RESOURCES
// ============================================
export const LIBRE_TABLETOP = {
  // Open RPG Systems
  fateCoreSRD: {
    name: "Fate Core System",
    description: "Generic RPG system - narrative focused",
    website: "https://fate-srd.com",
    embedUrl: "https://fate-srd.com/fate-core",
    features: ["aspects", "fate-points", "skills", "stunts"],
    variants: ["Fate Core", "Fate Accelerated", "Fate Condensed"],
    license: "CC BY"
  },
  openD6: {
    name: "OpenD6",
    description: "D6 System - flexible skill-based RPG",
    website: "http://opend6project.org",
    variants: ["D6 Adventure", "D6 Fantasy", "D6 Space"],
    mechanics: ["attribute-dice", "wild-die", "character-points"],
    license: "OGL"
  },
  fudgeRPG: {
    name: "FUDGE RPG",
    description: "Free-form Universal Do-it-yourself Gaming Engine",
    website: "http://www.fudgerpg.com",
    features: ["trait-ladder", "fudge-dice", "customizable"],
    license: "OGL"
  },
  pathfinderSRD: {
    name: "Pathfinder SRD",
    description: "Pathfinder 1e & 2e System Reference Documents",
    pf1Url: "https://www.d20pfsrd.com",
    pf2Url: "https://2e.aonprd.com",
    features: ["classes", "spells", "feats", "monsters", "items"],
    license: "OGL/ORC"
  },
  openAdventure: {
    name: "Open Adventure",
    description: "Rules-light fantasy RPG",
    website: "https://github.com/openadventure/Open-Adventure",
    features: ["simple-rules", "d6-based", "fantasy"],
    license: "CC BY-SA"
  },
  d20SRD: {
    name: "D&D 5e SRD",
    description: "5th Edition System Reference Document",
    website: "https://www.5esrd.com",
    alternateUrl: "https://5e.tools",
    features: ["basic-rules", "monsters", "spells", "items"],
    license: "CC BY 4.0 / OGL"
  },
  // D&D Tools
  dndBeyond: {
    name: "D&D Beyond (Free Content)",
    description: "Official D&D digital toolset",
    website: "https://www.dndbeyond.com",
    freeFeatures: ["basic-rules", "character-builder-basic", "dice-roller"],
    embedType: "link"
  },
  instantArmory: {
    name: "Instant Armory",
    description: "Random magic item generator",
    website: "https://www.kassoon.com/dnd/instant-armory/",
    features: ["random-items", "customizable"],
    embedType: "iframe"
  },
  mightyDice: {
    name: "Mighty Dice",
    description: "Online dice roller",
    website: "https://www.wizards.com/dnd/dice/dice.htm",
    features: ["all-dice", "roll-history"],
    embedType: "component"
  },
  rpgen: {
    name: "RPGen",
    description: "Random generators for RPGs",
    website: "https://rpgen.io",
    generators: ["names", "npcs", "quests", "dungeons", "treasure"],
    embedType: "iframe"
  },
  pocketBard: {
    name: "Pocket Bard",
    description: "D&D spell and ability reference",
    website: "https://pocketbard.app",
    features: ["spells", "class-abilities", "conditions"],
    embedType: "link"
  },
  portraitWorks: {
    name: "Portrait Works",
    description: "Character portrait generator",
    website: "https://www.artbreeder.com",
    features: ["ai-portraits", "fantasy-styles"],
    embedType: "link"
  },
  fiveESpells: {
    name: "D&D 5e Spells",
    description: "Comprehensive spell database",
    website: "https://www.dnd-spells.com",
    features: ["filters", "spell-cards", "class-lists"],
    embedType: "iframe"
  },
  reroll: {
    name: "Reroll",
    description: "Character portrait creator",
    website: "https://reroll.co",
    features: ["character-art", "tokens", "customization"],
    embedType: "link"
  },
  encounterGenerator: {
    name: "Encounter Generator",
    description: "Combat encounter builder",
    website: "https://koboldplus.club",
    features: ["cr-calculator", "random-encounters", "party-balance"],
    embedType: "iframe"
  },
  sketchbook: {
    name: "Sketchbook (Autodesk)",
    description: "Free digital drawing app",
    website: "https://www.sketchbook.com",
    platforms: ["windows", "mac", "ios", "android"],
    license: "Freeware"
  },
  dungeonScrawl: {
    name: "Dungeon Scrawl",
    description: "Free dungeon map maker",
    website: "https://dungeonscrawl.com",
    features: ["grid-maps", "export-png", "layers"],
    embedType: "iframe",
    license: "Free"
  },
  anDice: {
    name: "AnDice",
    description: "Android dice roller app",
    website: "https://play.google.com/store/apps/details?id=com.mig.andice",
    platforms: ["android"],
    license: "Free"
  },
  homebrewery: {
    name: "Homebrewery",
    description: "Create D&D-style documents",
    website: "https://homebrewery.naturalcrit.com",
    features: ["markdown", "phb-style", "export-pdf"],
    embedType: "iframe",
    license: "MIT"
  },
  naturalCrit: {
    name: "Natural Crit (GM Binder)",
    description: "Document creation tools",
    website: "https://www.gmbinder.com",
    features: ["markdown", "custom-styles", "sharing"],
    embedType: "iframe",
    license: "Free"
  },
  fantasyNameGenerators: {
    name: "Fantasy Name Generators",
    description: "Names for everything fantasy",
    website: "https://www.fantasynamegenerators.com",
    categories: ["characters", "places", "items", "descriptions"],
    embedType: "iframe"
  },
  inkarnate: {
    name: "Inkarnate",
    description: "Fantasy map making tool",
    website: "https://inkarnate.com",
    features: ["world-maps", "battle-maps", "assets"],
    embedType: "link",
    license: "Freemium"
  },
  fastCharacter: {
    name: "Fast Character",
    description: "Quick 5e character generator",
    website: "https://fastcharacter.com",
    features: ["random-gen", "all-classes", "equipment"],
    embedType: "iframe"
  },
  koboldPlus: {
    name: "Kobold Plus Club",
    description: "Encounter difficulty calculator",
    website: "https://koboldplus.club",
    features: ["cr-calculator", "party-manager", "encounter-builder"],
    embedType: "iframe"
  },
  driveThruRPG: {
    name: "DriveThruRPG (Free)",
    description: "RPG marketplace with free content",
    website: "https://www.drivethrurpg.com",
    freeUrl: "https://www.drivethrurpg.com/browse.php?pwyw=true",
    features: ["free-pdfs", "pay-what-you-want"],
    embedType: "link"
  }
};

// ============================================
// CLASSIC GAMES & BOARD GAMES
// ============================================
export const CLASSIC_GAMES = {
  // Card Games
  standardPlayingCards: {
    name: "Standard Playing Cards",
    description: "52-card deck games",
    games: [
      { name: "Poker", players: "2-10", type: "betting" },
      { name: "Blackjack", players: "1-7", type: "casino" },
      { name: "Bridge", players: "4", type: "trick-taking" },
      { name: "Hearts", players: "4", type: "trick-taking" },
      { name: "Spades", players: "4", type: "trick-taking" },
      { name: "Rummy", players: "2-6", type: "matching" },
      { name: "Go Fish", players: "2-6", type: "matching" },
      { name: "War", players: "2", type: "comparing" },
      { name: "Crazy Eights", players: "2-7", type: "shedding" },
      { name: "Solitaire", players: "1", type: "patience" },
      { name: "Canasta", players: "2-6", type: "matching" },
      { name: "Cribbage", players: "2-4", type: "scoring" },
      { name: "Euchre", players: "4", type: "trick-taking" },
      { name: "Pinochle", players: "2-4", type: "trick-taking" }
    ],
    embedType: "component",
    assets: {
      deckUrl: "https://deckofcardsapi.com/api/deck",
      svgDeck: "/assets/cards/standard-deck.svg"
    }
  },
  // Classic Board Games
  classicBoardGames: {
    name: "Classic Board Games",
    description: "Public domain board games",
    games: [
      {
        name: "Chess",
        players: "2",
        type: "strategy",
        embedUrl: "https://lichess.org/embed",
        rules: "https://en.wikipedia.org/wiki/Rules_of_chess"
      },
      {
        name: "Checkers/Draughts",
        players: "2",
        type: "strategy",
        rules: "https://en.wikipedia.org/wiki/English_draughts"
      },
      {
        name: "Go",
        players: "2",
        type: "strategy",
        embedUrl: "https://online-go.com/embed",
        rules: "https://en.wikipedia.org/wiki/Rules_of_Go"
      },
      {
        name: "Backgammon",
        players: "2",
        type: "race",
        rules: "https://en.wikipedia.org/wiki/Backgammon"
      },
      {
        name: "Mancala",
        players: "2",
        type: "count-capture",
        rules: "https://en.wikipedia.org/wiki/Mancala"
      },
      {
        name: "Nine Men's Morris",
        players: "2",
        type: "alignment",
        rules: "https://en.wikipedia.org/wiki/Nine_men%27s_morris"
      },
      {
        name: "Reversi/Othello",
        players: "2",
        type: "strategy",
        rules: "https://en.wikipedia.org/wiki/Reversi"
      },
      {
        name: "Dominoes",
        players: "2-4",
        type: "tile",
        rules: "https://en.wikipedia.org/wiki/Dominoes"
      },
      {
        name: "Mahjong",
        players: "4",
        type: "tile",
        rules: "https://en.wikipedia.org/wiki/Mahjong"
      }
    ]
  },
  // Tabletop Simulator
  tabletopSimulator: {
    name: "Tabletop Simulator",
    description: "Play any board game virtually",
    website: "https://www.tabletopsimulator.com",
    steamUrl: "https://store.steampowered.com/app/286160/Tabletop_Simulator/",
    features: ["physics", "custom-games", "workshop", "vr-support"],
    workshopUrl: "https://steamcommunity.com/app/286160/workshop/",
    freeAlternatives: [
      { name: "Tabletopia", url: "https://tabletopia.com", free: true },
      { name: "Board Game Arena", url: "https://boardgamearena.com", free: true },
      { name: "Screentop.gg", url: "https://screentop.gg", free: true }
    ]
  }
};

// ============================================
// COMICS & GRAPHIC NOVELS
// ============================================
export const LIBRE_COMICS = {
  comicBookPlus: {
    name: "Comic Book Plus",
    description: "Golden age public domain comics",
    baseUrl: "https://comicbookplus.com",
    categories: ["golden-age", "silver-age", "horror", "sci-fi", "romance"],
    totalComics: 35000,
    license: "Public Domain"
  },
  digitalComicMuseum: {
    name: "Digital Comic Museum",
    description: "Free public domain comic books",
    baseUrl: "https://digitalcomicmuseum.com",
    categories: ["superhero", "western", "war", "crime", "horror"],
    totalComics: 20000,
    license: "Public Domain"
  },
  internetArchiveComics: {
    name: "Internet Archive Comics",
    description: "Comics collection on Internet Archive",
    baseUrl: "https://archive.org/details/comics",
    features: ["borrow", "read-online", "download"],
    license: "Various"
  }
};

// ============================================
// INTERNET ARCHIVE (COMPREHENSIVE)
// ============================================
export const INTERNET_ARCHIVE = {
  name: "Internet Archive",
  description: "Digital library of Internet sites and cultural artifacts",
  baseUrl: "https://archive.org",
  apiEndpoint: "https://archive.org/advancedsearch.php",
  collections: {
    waybackMachine: {
      name: "Wayback Machine",
      url: "https://web.archive.org",
      description: "Historical web pages"
    },
    texts: {
      name: "Texts & Books",
      url: "https://archive.org/details/texts",
      items: 40000000
    },
    audio: {
      name: "Audio Archive",
      url: "https://archive.org/details/audio",
      items: 15000000
    },
    video: {
      name: "Moving Images",
      url: "https://archive.org/details/movies",
      items: 8000000
    },
    software: {
      name: "Software Archive",
      url: "https://archive.org/details/software",
      items: 500000
    },
    games: {
      name: "Classic Games",
      url: "https://archive.org/details/classicpcgames",
      features: ["dos-games", "arcade", "console"]
    }
  },
  embedType: "iframe",
  license: "Various"
};

// ============================================
// EXPORT ALL
// ============================================
export const LIBRE_RESOURCES_COMPLETE = {
  literature: LIBRE_LITERATURE,
  audio: LIBRE_AUDIO,
  images: LIBRE_IMAGES,
  museums: LIBRE_MUSEUMS,
  education: LIBRE_EDUCATION,
  reference: LIBRE_REFERENCE,
  software: LIBRE_SOFTWARE,
  repositories: LIBRE_REPOSITORIES,
  datasets: LIBRE_DATASETS,
  games: LIBRE_GAMES,
  tabletop: LIBRE_TABLETOP,
  classicGames: CLASSIC_GAMES,
  comics: LIBRE_COMICS,
  internetArchive: INTERNET_ARCHIVE
};

export default LIBRE_RESOURCES_COMPLETE;

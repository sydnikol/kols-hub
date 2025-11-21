/**
 * Entertainment & Distraction Library Service
 * Curated content for pain management, creativity, and relaxation
 */

export interface CreativeIdea {
  id: string;
  title: string;
  category: 'art' | 'music' | 'writing' | 'craft' | 'digital' | 'performance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  materials: string[];
  timeRequired: string;
  steps: string[];
  inspiration: string;
  tags: string[];
  savedBy?: boolean;
  completedBy?: boolean;
}

export interface DistractionContent {
  id: string;
  title: string;
  type: 'video' | 'music' | 'podcast' | 'audiobook' | 'game' | 'meditation' | 'asmr';
  category: 'calming' | 'funny' | 'educational' | 'inspiring' | 'immersive';
  painLevel: 'mild' | 'moderate' | 'severe'; // Recommended for pain level
  duration: string;
  description: string;
  url?: string;
  provider?: 'youtube' | 'spotify' | 'netflix' | 'internal' | 'other';
  thumbnailUrl?: string;
  saved?: boolean;
  lastAccessed?: Date;
  effectivenessRating?: number; // 1-5, how well it distracted
}

export interface WatchList {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary' | 'anime' | 'youtube_playlist';
  genre: string[];
  mood: 'uplifting' | 'relaxing' | 'exciting' | 'thought-provoking' | 'funny';
  platform: string[];
  description: string;
  episodeCount?: number;
  currentEpisode?: number;
  thumbnailUrl?: string;
  rating?: number;
  watched?: boolean;
  inProgress?: boolean;
}

class EntertainmentLibraryService {
  private readonly STORAGE_KEY = 'entertainment_library';

  // ============= CREATIVE IDEAS =============

  getCreativeIdeas(): CreativeIdea[] {
    return [
      {
        id: 'paint_galaxy',
        title: 'Paint a Galaxy on Canvas',
        category: 'art',
        difficulty: 'beginner',
        description: 'Create a stunning galaxy painting using simple sponge and paint techniques',
        materials: ['Canvas', 'Acrylic paint (black, white, purple, blue, pink)', 'Sponges', 'Brushes', 'Water'],
        timeRequired: '1-2 hours',
        steps: [
          'Paint canvas completely black and let dry',
          'Use sponge to dab on purple and blue clouds',
          'Add pink highlights with lighter touches',
          'Splatter white paint for stars',
          'Use toothbrush for fine star dust',
          'Add larger stars with white paint dots',
        ],
        inspiration: 'The cosmos holds infinite beauty - bring it into your space',
        tags: ['painting', 'space', 'relaxing', 'therapeutic'],
      },
      {
        id: 'write_story',
        title: 'Write a Short Fantasy Story',
        category: 'writing',
        difficulty: 'intermediate',
        description: 'Craft a 1000-word fantasy tale set in a magical world',
        materials: ['Notebook or computer', 'Imagination', 'Quiet space'],
        timeRequired: '1-3 hours',
        steps: [
          'Choose a magical setting (enchanted forest, crystal castle, floating islands)',
          'Create a protagonist with a unique magical ability',
          'Introduce a conflict or quest',
          'Add 2-3 interesting side characters',
          'Build to a climactic moment',
          'Resolve the conflict with character growth',
        ],
        inspiration: 'Every great story starts with "What if...?"',
        tags: ['writing', 'fantasy', 'creative', 'storytelling'],
      },
      {
        id: 'origami_crane',
        title: 'Origami Paper Crane Collection',
        category: 'craft',
        difficulty: 'beginner',
        description: 'Fold 100 origami cranes for peace and meditation',
        materials: ['Origami paper or square paper', 'Patience', 'Optional: string for hanging'],
        timeRequired: '30 mins - ongoing',
        steps: [
          'Start with a square piece of paper',
          'Fold into preliminary bird base',
          'Create the wings with reverse folds',
          'Shape the head and tail',
          'Repeat - each crane gets easier!',
        ],
        inspiration: 'Japanese legend says 1000 cranes grants a wish',
        tags: ['origami', 'meditative', 'peaceful', 'hands-on'],
      },
      {
        id: 'digital_art',
        title: 'Create Digital Character Art',
        category: 'digital',
        difficulty: 'advanced',
        description: 'Design an original character using digital art tools',
        materials: ['Drawing tablet or iPad', 'Digital art software (Procreate, Photoshop, Krita)', 'Stylus'],
        timeRequired: '3-6 hours',
        steps: [
          'Sketch basic body proportions',
          'Add clothing and accessories',
          'Refine line art',
          'Choose color palette',
          'Apply base colors',
          'Add shading and highlights',
          'Final details and effects',
        ],
        inspiration: 'Your imagination is the only limit',
        tags: ['digital art', 'character design', 'illustration'],
      },
      {
        id: 'song_write',
        title: 'Write and Record a Song',
        category: 'music',
        difficulty: 'intermediate',
        description: 'Create an original song from melody to recording',
        materials: ['Instrument (optional)', 'Recording device', 'Lyrics notebook', 'Music software (optional)'],
        timeRequired: '2-4 hours',
        steps: [
          'Choose a theme or emotion to express',
          'Create a simple chord progression',
          'Hum or play melody ideas',
          'Write lyrics that match the melody',
          'Record a rough demo',
          'Refine and re-record',
        ],
        inspiration: 'Music is the language of the soul',
        tags: ['music', 'songwriting', 'creative', 'performance'],
      },
      {
        id: 'polymer_clay',
        title: 'Sculpt Miniature Polymer Clay Charms',
        category: 'craft',
        difficulty: 'beginner',
        description: 'Create tiny cute polymer clay charms',
        materials: ['Polymer clay', 'Clay tools', 'Oven', 'Jump rings (optional)', 'Gloss (optional)'],
        timeRequired: '1-2 hours',
        steps: [
          'Condition the clay by kneading',
          'Shape into miniature food, animals, or objects',
          'Add fine details with tools',
          'Bake according to package instructions',
          'Apply gloss if desired',
          'Add jump rings for charms',
        ],
        inspiration: 'Small creations bring big joy',
        tags: ['polymer clay', 'miniatures', 'cute', 'handmade'],
      },
      {
        id: 'watercolor_flowers',
        title: 'Watercolor Botanical Art',
        category: 'art',
        difficulty: 'intermediate',
        description: 'Paint delicate watercolor flowers and leaves',
        materials: ['Watercolor paper', 'Watercolor paints', 'Brushes', 'Water', 'Pencil'],
        timeRequired: '2-3 hours',
        steps: [
          'Sketch light flower outlines in pencil',
          'Wet the paper for soft edges',
          'Layer light washes of color',
          'Add darker details while wet',
          'Let dry between layers',
          'Add final details and highlights',
        ],
        inspiration: 'Capture nature\'s delicate beauty on paper',
        tags: ['watercolor', 'flowers', 'botanical', 'peaceful'],
      },
      {
        id: 'poetry_journal',
        title: 'Start a Poetry Journal',
        category: 'writing',
        difficulty: 'beginner',
        description: 'Create daily poems about your experiences and emotions',
        materials: ['Journal', 'Pen', 'Quiet space', 'Inspiration'],
        timeRequired: '15-30 minutes daily',
        steps: [
          'Choose a theme or emotion',
          'Freewrite without judgment',
          'Experiment with different styles (haiku, free verse, rhyme)',
          'Read poetry for inspiration',
          'Edit and refine if desired',
          'Date each entry',
        ],
        inspiration: 'Poetry transforms pain into beauty',
        tags: ['poetry', 'writing', 'self-expression', 'therapeutic'],
      },
      {
        id: 'embroidery',
        title: 'Hand Embroidery Sampler',
        category: 'craft',
        difficulty: 'beginner',
        description: 'Learn basic embroidery stitches on a sampler',
        materials: ['Embroidery hoop', 'Fabric', 'Embroidery floss', 'Needle', 'Pattern (optional)'],
        timeRequired: '2-4 hours',
        steps: [
          'Secure fabric in hoop',
          'Transfer or draw pattern',
          'Practice basic stitches (backstitch, satin, French knot)',
          'Follow color guide',
          'Complete design',
          'Frame or display',
        ],
        inspiration: 'Every stitch is a meditation',
        tags: ['embroidery', 'needlework', 'handc raft', 'meditative'],
      },
      {
        id: 'digital_collage',
        title: 'Create Surreal Digital Collage',
        category: 'digital',
        difficulty: 'intermediate',
        description: 'Combine photos and elements into dreamlike compositions',
        materials: ['Photo editing software', 'Stock photos or personal images', 'Digital art tools'],
        timeRequired: '2-4 hours',
        steps: [
          'Gather inspiration images',
          'Choose a theme or concept',
          'Cut out elements',
          'Layer and arrange',
          'Blend edges seamlessly',
          'Add effects and color grading',
        ],
        inspiration: 'Reality is your canvas, imagination your brush',
        tags: ['digital art', 'collage', 'surreal', 'creative'],
      },
      {
        id: 'ukulele_song',
        title: 'Learn Your First Ukulele Song',
        category: 'music',
        difficulty: 'beginner',
        description: 'Master a simple ukulele song from start to finish',
        materials: ['Ukulele', 'Tuner', 'Chord chart', 'Song tabs'],
        timeRequired: '1-2 weeks of practice',
        steps: [
          'Tune your ukulele',
          'Learn basic chords (C, G, Am, F)',
          'Practice strumming patterns',
          'Start with a 3-chord song',
          'Practice transitions',
          'Play along with recording',
        ],
        inspiration: 'Music is therapy you can hold',
        tags: ['ukulele', 'music', 'learning', 'fun'],
      },
      {
        id: 'zine_making',
        title: 'Create a Personal Zine',
        category: 'craft',
        difficulty: 'intermediate',
        description: 'Make a hand-made magazine about your interests',
        materials: ['Paper', 'Pens/markers', 'Magazines for collage', 'Stapler', 'Scissors'],
        timeRequired: '3-5 hours',
        steps: [
          'Choose theme',
          'Plan page layout',
          'Create content (writing, art, collage)',
          'Design cover',
          'Fold and assemble pages',
          'Staple or bind',
        ],
        inspiration: 'Your story deserves to be told',
        tags: ['zine', 'publishing', 'creative', 'DIY'],
      },
      {
        id: 'stop_motion',
        title: 'Stop Motion Animation Short',
        category: 'digital',
        difficulty: 'advanced',
        description: 'Create a short stop motion animation video',
        materials: ['Phone/camera', 'Tripod', 'Figures/objects', 'Lighting', 'Stop motion app'],
        timeRequired: '4-8 hours',
        steps: [
          'Write simple story',
          'Set up scene',
          'Take first photo',
          'Move object slightly',
          'Repeat 100+ times',
          'Compile in app',
          'Add music/sound',
        ],
        inspiration: 'Bring imagination to life, frame by frame',
        tags: ['animation', 'stop motion', 'filmmaking', 'creative'],
      },
      {
        id: 'calligraphy',
        title: 'Modern Calligraphy Practice',
        category: 'art',
        difficulty: 'beginner',
        description: 'Learn beautiful hand lettering',
        materials: ['Brush pens', 'Practice sheets', 'Paper', 'Guides'],
        timeRequired: '1-2 hours',
        steps: [
          'Study letterform basics',
          'Practice pressure control',
          'Start with lowercase alphabet',
          'Work on uppercase',
          'Practice connections',
          'Create quote or phrase',
        ],
        inspiration: 'Transform words into art',
        tags: ['calligraphy', 'lettering', 'art', 'mindful'],
      },
      {
        id: 'world_building',
        title: 'Build a Fantasy World',
        category: 'writing',
        difficulty: 'advanced',
        description: 'Create a detailed fictional world with maps and lore',
        materials: ['Notebook', 'Pens', 'Optional: drawing supplies for maps'],
        timeRequired: 'Ongoing project',
        steps: [
          'Design geography and map',
          'Create cultures and societies',
          'Develop magic system or technology',
          'Write history and legends',
          'Design creatures and flora',
          'Document everything',
        ],
        inspiration: 'Build worlds that others can escape to',
        tags: ['world-building', 'fantasy', 'creative writing', 'immersive'],
      },
    ];
  }

  // ============= PAIN DISTRACTION CONTENT =============

  getDistractionContent(): DistractionContent[] {
    return [
      {
        id: 'lofi_beats',
        title: 'Lo-Fi Beats to Relax/Study',
        type: 'music',
        category: 'calming',
        painLevel: 'mild',
        duration: 'Continuous',
        description: 'Chill lo-fi hip hop beats perfect for relaxation and focus',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'ocean_sounds',
        title: 'Ocean Waves - 10 Hours',
        type: 'meditation',
        category: 'calming',
        painLevel: 'moderate',
        duration: '10 hours',
        description: 'Natural ocean wave sounds for deep relaxation and pain relief',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'funny_animals',
        title: 'Funny Animal Compilation',
        type: 'video',
        category: 'funny',
        painLevel: 'mild',
        duration: '20-30 minutes',
        description: 'Hilarious animal videos to lift your spirits',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'nature_doc',
        title: 'Planet Earth Documentary',
        type: 'video',
        category: 'educational',
        painLevel: 'moderate',
        duration: '45-60 minutes',
        description: 'Stunning nature documentary with soothing narration',
        provider: 'netflix',
        saved: false,
      },
      {
        id: 'guided_meditation',
        title: 'Guided Meditation for Pain Relief',
        type: 'meditation',
        category: 'calming',
        painLevel: 'severe',
        duration: '20 minutes',
        description: 'Specially designed meditation to help manage chronic pain',
        provider: 'internal',
        saved: false,
      },
      {
        id: 'asmr_rain',
        title: 'ASMR Rain on Tent',
        type: 'asmr',
        category: 'calming',
        painLevel: 'moderate',
        duration: '3 hours',
        description: 'Gentle rain sounds on tent for deep relaxation',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'comedy_special',
        title: 'Stand-Up Comedy Special',
        type: 'video',
        category: 'funny',
        painLevel: 'mild',
        duration: '60 minutes',
        description: 'Laugh therapy with top comedians',
        provider: 'netflix',
        saved: false,
      },
      {
        id: 'audiobook_fantasy',
        title: 'Fantasy Audiobook - The Hobbit',
        type: 'audiobook',
        category: 'immersive',
        painLevel: 'moderate',
        duration: '11 hours',
        description: 'Escape into Middle Earth with this classic tale',
        provider: 'other',
        saved: false,
      },
      {
        id: 'puzzle_game',
        title: 'Relaxing Puzzle Game',
        type: 'game',
        category: 'calming',
        painLevel: 'mild',
        duration: '15-30 minutes',
        description: 'Gentle puzzle game with beautiful visuals',
        provider: 'internal',
        saved: false,
      },
      {
        id: 'inspirational_talk',
        title: 'Motivational TED Talk Playlist',
        type: 'video',
        category: 'inspiring',
        painLevel: 'mild',
        duration: '1-2 hours',
        description: 'Uplifting talks to inspire and motivate',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'jazz_cafe',
        title: 'Cozy Jazz Café Ambience',
        type: 'music',
        category: 'calming',
        painLevel: 'moderate',
        duration: 'Continuous',
        description: 'Smooth jazz with café background sounds',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'nature_walk',
        title: '4K Virtual Nature Walks',
        type: 'video',
        category: 'calming',
        painLevel: 'moderate',
        duration: '30-60 minutes',
        description: 'Peaceful walking tours through forests and beaches',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'asmr_soap',
        title: 'ASMR Soap Cutting',
        type: 'asmr',
        category: 'calming',
        painLevel: 'mild',
        duration: '20 minutes',
        description: 'Satisfying soap cutting sounds',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'binaural_beats',
        title: 'Binaural Beats for Pain Relief',
        type: 'meditation',
        category: 'calming',
        painLevel: 'severe',
        duration: '1 hour',
        description: 'Therapeutic sound frequencies for pain management',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'cat_videos',
        title: 'Funny Cat Compilation 2024',
        type: 'video',
        category: 'funny',
        painLevel: 'mild',
        duration: '15 minutes',
        description: 'Adorable and hilarious cat moments',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'space_sounds',
        title: 'NASA Space Sounds',
        type: 'meditation',
        category: 'immersive',
        painLevel: 'moderate',
        duration: '2 hours',
        description: 'Real recordings from space missions',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'cooking_show',
        title: 'Relaxing Cooking Show',
        type: 'video',
        category: 'calming',
        painLevel: 'mild',
        duration: '30 minutes',
        description: 'Peaceful cooking videos with no talking',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'true_crime',
        title: 'True Crime Podcast',
        type: 'podcast',
        category: 'immersive',
        painLevel: 'mild',
        duration: '45 minutes',
        description: 'Engaging true crime stories',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'guided_imagery',
        title: 'Guided Imagery: Beach Paradise',
        type: 'meditation',
        category: 'calming',
        painLevel: 'severe',
        duration: '25 minutes',
        description: 'Mental escape to a peaceful beach',
        provider: 'internal',
        saved: false,
      },
      {
        id: 'piano_covers',
        title: 'Peaceful Piano Covers',
        type: 'music',
        category: 'calming',
        painLevel: 'moderate',
        duration: 'Continuous',
        description: 'Beautiful piano versions of popular songs',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'satisfying_videos',
        title: 'Oddly Satisfying Compilation',
        type: 'video',
        category: 'calming',
        painLevel: 'mild',
        duration: '20 minutes',
        description: 'Perfectly satisfying visual sequences',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'harry_potter',
        title: 'Harry Potter Audiobook',
        type: 'audiobook',
        category: 'immersive',
        painLevel: 'moderate',
        duration: '8 hours',
        description: 'Escape to Hogwarts',
        provider: 'other',
        saved: false,
      },
      {
        id: 'thunderstorm',
        title: 'Thunderstorm with Rain',
        type: 'meditation',
        category: 'calming',
        painLevel: 'moderate',
        duration: '8 hours',
        description: 'Natural thunderstorm sounds for relaxation',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'art_time lapse',
        title: 'Digital Art Timelapse',
        type: 'video',
        category: 'inspiring',
        painLevel: 'mild',
        duration: '10-15 minutes',
        description: 'Watch beautiful art come to life',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'meditation_music',
        title: 'Tibetan Singing Bowls',
        type: 'meditation',
        category: 'calming',
        painLevel: 'severe',
        duration: '1 hour',
        description: 'Deep healing vibrations',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'baby_animals',
        title: 'Baby Animals Being Cute',
        type: 'video',
        category: 'funny',
        painLevel: 'mild',
        duration: '20 minutes',
        description: 'Pure wholesome cuteness',
        provider: 'youtube',
        saved: false,
      },
      {
        id: 'ambient_space',
        title: 'Ambient Space Music',
        type: 'music',
        category: 'calming',
        painLevel: 'moderate',
        duration: 'Continuous',
        description: 'Ethereal space-inspired ambient music',
        provider: 'spotify',
        saved: false,
      },
      {
        id: 'history_doc',
        title: 'History Documentary Series',
        type: 'video',
        category: 'educational',
        painLevel: 'mild',
        duration: '45 minutes',
        description: 'Fascinating historical deep dives',
        provider: 'netflix',
        saved: false,
      },
      {
        id: 'body_scan',
        title: 'Body Scan Meditation for Pain',
        type: 'meditation',
        category: 'calming',
        painLevel: 'severe',
        duration: '30 minutes',
        description: 'Systematic relaxation technique',
        provider: 'internal',
        saved: false,
      },
      {
        id: 'crafting_videos',
        title: 'Satisfying Crafting Videos',
        type: 'video',
        category: 'inspiring',
        painLevel: 'mild',
        duration: '25 minutes',
        description: 'Watch skilled artisans create',
        provider: 'youtube',
        saved: false,
      },
    ];
  }

  // ============= WATCH LIST =============

  getWatchList(): WatchList[] {
    return [
      {
        id: 'ghibli_spirited',
        title: 'Spirited Away',
        type: 'anime',
        genre: ['Fantasy', 'Adventure', 'Coming of Age'],
        mood: 'thought-provoking',
        platform: ['Netflix', 'HBO Max'],
        description: 'A young girl navigates a magical bathhouse to save her parents',
        rating: 9.5,
        watched: false,
      },
      {
        id: 'office',
        title: 'The Office',
        type: 'series',
        genre: ['Comedy', 'Mockumentary'],
        mood: 'funny',
        platform: ['Peacock', 'Netflix'],
        description: 'Hilarious workplace comedy perfect for binge-watching',
        episodeCount: 201,
        currentEpisode: 1,
        rating: 9.0,
        inProgress: false,
      },
      {
        id: 'cosmos',
        title: 'Cosmos: A Spacetime Odyssey',
        type: 'documentary',
        genre: ['Science', 'Educational'],
        mood: 'thought-provoking',
        platform: ['Disney+', 'Hulu'],
        description: 'Explore the universe with stunning visuals and Neil deGrasse Tyson',
        episodeCount: 13,
        rating: 9.3,
        watched: false,
      },
      {
        id: 'great_british',
        title: 'The Great British Baking Show',
        type: 'series',
        genre: ['Reality', 'Cooking'],
        mood: 'relaxing',
        platform: ['Netflix'],
        description: 'Wholesome baking competition with no drama',
        episodeCount: 40,
        rating: 8.6,
        inProgress: false,
      },
      {
        id: 'your_name',
        title: 'Your Name (Kimi no Na wa)',
        type: 'anime',
        genre: ['Romance', 'Fantasy', 'Drama'],
        mood: 'uplifting',
        platform: ['Crunchyroll', 'Funimation'],
        description: 'Beautiful anime about two teens who mysteriously swap bodies',
        rating: 9.0,
        watched: false,
      },
      {
        id: 'planet_earth',
        title: 'Planet Earth II',
        type: 'documentary',
        genre: ['Nature', 'Wildlife'],
        mood: 'relaxing',
        platform: ['BBC iPlayer', 'AMC+'],
        description: 'Breathtaking wildlife documentary with incredible cinematography',
        episodeCount: 6,
        rating: 9.5,
        watched: false,
      },
      {
        id: 'good_place',
        title: 'The Good Place',
        type: 'series',
        genre: ['Comedy', 'Fantasy', 'Philosophy'],
        mood: 'funny',
        platform: ['Netflix'],
        description: 'Clever comedy about the afterlife with heart and humor',
        episodeCount: 50,
        rating: 8.8,
        inProgress: false,
      },
      {
        id: 'atla',
        title: 'Avatar: The Last Airbender',
        type: 'anime',
        genre: ['Adventure', 'Fantasy', 'Action'],
        mood: 'exciting',
        platform: ['Netflix', 'Paramount+'],
        description: 'Epic animated series about a boy who can control all elements',
        episodeCount: 61,
        rating: 9.3,
        inProgress: false,
      },
      {
        id: 'schitts_creek',
        title: 'Schitt\'s Creek',
        type: 'series',
        genre: ['Comedy', 'Family'],
        mood: 'funny',
        platform: ['Netflix'],
        description: 'Heartwarming comedy about a wealthy family who loses everything',
        episodeCount: 80,
        rating: 8.5,
        inProgress: false,
      },
      {
        id: 'demon_slayer',
        title: 'Demon Slayer: Kimetsu no Yaiba',
        type: 'anime',
        genre: ['Action', 'Fantasy', 'Drama'],
        mood: 'exciting',
        platform: ['Crunchyroll', 'Netflix'],
        description: 'Stunning action anime about a boy fighting demons',
        episodeCount: 44,
        rating: 8.7,
        inProgress: false,
      },
      {
        id: 'great_pottery',
        title: 'The Great Pottery Throw Down',
        type: 'series',
        genre: ['Reality', 'Art'],
        mood: 'relaxing',
        platform: ['HBO Max'],
        description: 'Relaxing pottery competition',
        episodeCount: 32,
        rating: 8.3,
        inProgress: false,
      },
      {
        id: 'blue_planet',
        title: 'Blue Planet II',
        type: 'documentary',
        genre: ['Nature', 'Ocean'],
        mood: 'relaxing',
        platform: ['BBC iPlayer', 'Netflix'],
        description: 'Breathtaking underwater cinematography',
        episodeCount: 7,
        rating: 9.3,
        inProgress: false,
      },
      {
        id: 'community',
        title: 'Community',
        type: 'series',
        genre: ['Comedy', 'Satire'],
        mood: 'funny',
        platform: ['Netflix', 'Hulu'],
        description: 'Meta comedy about a quirky community college study group',
        episodeCount: 110,
        rating: 8.5,
        inProgress: false,
      },
      {
        id: 'my_neighbor_totoro',
        title: 'My Neighbor Totoro',
        type: 'anime',
        genre: ['Fantasy', 'Family'],
        mood: 'uplifting',
        platform: ['HBO Max'],
        description: 'Magical Ghibli film about forest spirits',
        rating: 8.1,
        watched: false,
      },
      {
        id: 'chef_table',
        title: 'Chef\'s Table',
        type: 'documentary',
        genre: ['Food', 'Art'],
        mood: 'inspiring',
        platform: ['Netflix'],
        description: 'Beautiful documentary series about world-class chefs',
        episodeCount: 30,
        rating: 8.5,
        inProgress: false,
      },
      {
        id: 'parks_rec',
        title: 'Parks and Recreation',
        type: 'series',
        genre: ['Comedy', 'Mockumentary'],
        mood: 'funny',
        platform: ['Peacock', 'Netflix'],
        description: 'Wholesome workplace comedy with lovable characters',
        episodeCount: 125,
        rating: 8.6,
        inProgress: false,
      },
      {
        id: 'fullmetal',
        title: 'Fullmetal Alchemist: Brotherhood',
        type: 'anime',
        genre: ['Action', 'Fantasy', 'Drama'],
        mood: 'thought-provoking',
        platform: ['Crunchyroll', 'Netflix'],
        description: 'Epic anime about two brothers and alchemy',
        episodeCount: 64,
        rating: 9.1,
        inProgress: false,
      },
      {
        id: 'jeopardy',
        title: 'Jeopardy!',
        type: 'series',
        genre: ['Game Show', 'Trivia'],
        mood: 'exciting',
        platform: ['Hulu', 'ABC'],
        description: 'Classic trivia game show',
        episodeCount: 8000,
        rating: 8.0,
        inProgress: false,
      },
      {
        id: 'abstract',
        title: 'Abstract: The Art of Design',
        type: 'documentary',
        genre: ['Art', 'Design'],
        mood: 'inspiring',
        platform: ['Netflix'],
        description: 'Explore the minds of world-leading designers',
        episodeCount: 14,
        rating: 8.4,
        inProgress: false,
      },
      {
        id: 'breaking_bad',
        title: 'Breaking Bad',
        type: 'series',
        genre: ['Drama', 'Crime'],
        mood: 'exciting',
        platform: ['Netflix', 'AMC+'],
        description: 'Intense drama about a chemistry teacher turned drug manufacturer',
        episodeCount: 62,
        rating: 9.5,
        inProgress: false,
      },
      {
        id: 'haikyuu',
        title: 'Haikyuu!!',
        type: 'anime',
        genre: ['Sports', 'Action'],
        mood: 'uplifting',
        platform: ['Crunchyroll', 'Netflix'],
        description: 'Inspiring volleyball anime',
        episodeCount: 85,
        rating: 8.7,
        inProgress: false,
      },
      {
        id: 'our_planet',
        title: 'Our Planet',
        type: 'documentary',
        genre: ['Nature', 'Environmental'],
        mood: 'thought-provoking',
        platform: ['Netflix'],
        description: 'Stunning nature documentary narrated by David Attenborough',
        episodeCount: 8,
        rating: 9.3,
        inProgress: false,
      },
      {
        id: 'bojack',
        title: 'BoJack Horseman',
        type: 'series',
        genre: ['Comedy', 'Drama', 'Animation'],
        mood: 'thought-provoking',
        platform: ['Netflix'],
        description: 'Dark comedy about a washed-up actor',
        episodeCount: 77,
        rating: 8.8,
        inProgress: false,
      },
      {
        id: 'attack_on_titan',
        title: 'Attack on Titan',
        type: 'anime',
        genre: ['Action', 'Drama', 'Mystery'],
        mood: 'exciting',
        platform: ['Crunchyroll', 'Hulu'],
        description: 'Intense action anime about humanity fighting giants',
        episodeCount: 87,
        rating: 9.0,
        inProgress: false,
      },
      {
        id: 'ted_lasso',
        title: 'Ted Lasso',
        type: 'series',
        genre: ['Comedy', 'Sports', 'Drama'],
        mood: 'uplifting',
        platform: ['Apple TV+'],
        description: 'Heartwarming comedy about an American football coach in England',
        episodeCount: 34,
        rating: 8.8,
        inProgress: false,
      },
      {
        id: 'cosmos_new',
        title: 'Cosmos: Possible Worlds',
        type: 'documentary',
        genre: ['Science', 'Space'],
        mood: 'thought-provoking',
        platform: ['Disney+', 'Hulu'],
        description: 'Latest installment of the Cosmos series',
        episodeCount: 13,
        rating: 8.4,
        inProgress: false,
      },
      {
        id: 'brooklyn99',
        title: 'Brooklyn Nine-Nine',
        type: 'series',
        genre: ['Comedy', 'Crime'],
        mood: 'funny',
        platform: ['Netflix', 'Hulu', 'Peacock'],
        description: 'Hilarious police sitcom',
        episodeCount: 153,
        rating: 8.4,
        inProgress: false,
      },
    ];
  }

  // ============= GAMES LIBRARY =============

  getGames(): Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    playable: boolean;
  }> {
    return [
      {
        id: 'memory_match',
        title: 'Memory Match',
        category: 'Puzzle',
        description: 'Classic card matching game to train your memory',
        playable: true,
      },
      {
        id: 'word_search',
        title: 'Word Search',
        category: 'Word',
        description: 'Find hidden words in a letter grid',
        playable: true,
      },
      {
        id: 'sudoku',
        title: 'Sudoku',
        category: 'Logic',
        description: 'Number placement puzzle game',
        playable: true,
      },
      {
        id: 'color_fill',
        title: 'Color Fill',
        category: 'Relaxing',
        description: 'Meditative coloring game',
        playable: true,
      },
      {
        id: 'trivia',
        title: 'Trivia Challenge',
        category: 'Knowledge',
        description: 'Test your knowledge across various topics',
        playable: true,
      },
      {
        id: 'breathing_game',
        title: 'Breathing Exercise Game',
        category: 'Wellness',
        description: 'Gamified breathing exercises for anxiety and pain',
        playable: true,
      },
    ];
  }

  // ============= STORAGE =============

  private async loadData(): Promise<{
    savedIdeas: string[];
    savedContent: string[];
    savedShows: string[];
    contentRatings: Record<string, number>;
  }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return {
          savedIdeas: [],
          savedContent: [],
          savedShows: [],
          contentRatings: {},
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load entertainment data:', error);
      return {
        savedIdeas: [],
        savedContent: [],
        savedShows: [],
        contentRatings: {},
      };
    }
  }

  private async saveData(data: any): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async toggleSaveIdea(ideaId: string): Promise<void> {
    const data = await this.loadData();
    const index = data.savedIdeas.indexOf(ideaId);

    if (index > -1) {
      data.savedIdeas.splice(index, 1);
    } else {
      data.savedIdeas.push(ideaId);
    }

    await this.saveData(data);
  }

  async toggleSaveContent(contentId: string): Promise<void> {
    const data = await this.loadData();
    const index = data.savedContent.indexOf(contentId);

    if (index > -1) {
      data.savedContent.splice(index, 1);
    } else {
      data.savedContent.push(contentId);
    }

    await this.saveData(data);
  }

  async rateContent(contentId: string, rating: number): Promise<void> {
    const data = await this.loadData();
    data.contentRatings[contentId] = rating;
    await this.saveData(data);
  }

  async getSavedIdeas(): Promise<string[]> {
    const data = await this.loadData();
    return data.savedIdeas;
  }

  async getSavedContent(): Promise<string[]> {
    const data = await this.loadData();
    return data.savedContent;
  }
}

export const entertainmentLibraryService = new EntertainmentLibraryService();

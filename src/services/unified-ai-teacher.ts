/**
 * UNIFIED AI TEACHER SERVICE
 * ===========================
 * Connects AI teaching capabilities across all creative and educational features:
 * - Music Hub & Practice
 * - Creative Studio (Writing, Art, Poetry)
 * - Photo Portfolio
 * - Virtual Wardrobe & Fashion Hub
 * - Sewing Studio
 * - Education Portal & College Credits
 * - Language Learning
 * - Skill Development
 */

export interface AITeacherContext {
  domain: TeachingDomain;
  currentTopic?: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  sessionHistory: TeachingSession[];
}

export type TeachingDomain =
  | 'music'
  | 'creative-writing'
  | 'poetry'
  | 'visual-art'
  | 'photography'
  | 'fashion'
  | 'sewing'
  | 'wardrobe-styling'
  | 'language-learning'
  | 'skill-development'
  | 'college-prep'
  | 'general-education';

export interface TeachingSession {
  id: string;
  domain: TeachingDomain;
  topic: string;
  startTime: Date;
  endTime?: Date;
  progress: number;
  lessonsCompleted: string[];
  notes: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'project' | 'quiz' | 'tutorial' | 'video';
  domain: TeachingDomain;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  content: string;
  objectives: string[];
}

// AI Teacher curriculum for each domain
export const CURRICULUM: Record<TeachingDomain, {
  name: string;
  icon: string;
  description: string;
  topics: { id: string; title: string; lessons: string[] }[];
  skills: string[];
}> = {
  'music': {
    name: 'Music & Practice',
    icon: '🎵',
    description: 'Learn music theory, instrument practice, and composition',
    topics: [
      { id: 'theory', title: 'Music Theory Basics', lessons: ['Notes & Scales', 'Chords & Progressions', 'Rhythm & Time Signatures', 'Key Signatures'] },
      { id: 'guitar', title: 'Guitar Mastery', lessons: ['Basic Chords', 'Fingerpicking', 'Strumming Patterns', 'Barre Chords', 'Lead Guitar'] },
      { id: 'piano', title: 'Piano Fundamentals', lessons: ['Hand Position', 'Reading Sheet Music', 'Chord Inversions', 'Scales Practice'] },
      { id: 'vocals', title: 'Vocal Training', lessons: ['Breathing Techniques', 'Pitch Control', 'Vocal Range', 'Performance Tips'] },
      { id: 'production', title: 'Music Production', lessons: ['DAW Basics', 'Mixing', 'Mastering', 'Beat Making'] }
    ],
    skills: ['Rhythm', 'Pitch Recognition', 'Music Reading', 'Composition', 'Performance']
  },
  'creative-writing': {
    name: 'Creative Writing',
    icon: '✍️',
    description: 'Master storytelling, prose, and creative expression',
    topics: [
      { id: 'fundamentals', title: 'Writing Fundamentals', lessons: ['Show vs Tell', 'Character Development', 'Plot Structure', 'Dialogue'] },
      { id: 'fiction', title: 'Fiction Writing', lessons: ['World Building', 'Point of View', 'Conflict & Tension', 'Scene Construction'] },
      { id: 'journaling', title: 'Journaling Practice', lessons: ['Daily Prompts', 'Reflection Techniques', 'Gratitude Writing', 'Stream of Consciousness'] },
      { id: 'editing', title: 'Self-Editing', lessons: ['Revision Strategies', 'Grammar Deep Dive', 'Style Refinement', 'Beta Reading'] }
    ],
    skills: ['Storytelling', 'Grammar', 'Voice Development', 'Revision', 'Publishing']
  },
  'poetry': {
    name: 'Poetry Corner',
    icon: '📜',
    description: 'Explore poetic forms, techniques, and self-expression',
    topics: [
      { id: 'forms', title: 'Poetic Forms', lessons: ['Free Verse', 'Sonnets', 'Haiku', 'Villanelle', 'Spoken Word'] },
      { id: 'devices', title: 'Literary Devices', lessons: ['Metaphor & Simile', 'Imagery', 'Alliteration', 'Personification', 'Symbolism'] },
      { id: 'rhythm', title: 'Rhythm & Meter', lessons: ['Iambic Pentameter', 'Rhyme Schemes', 'Cadence', 'Line Breaks'] },
      { id: 'voice', title: 'Finding Your Voice', lessons: ['Personal Themes', 'Emotional Honesty', 'Unique Perspective', 'Performance'] }
    ],
    skills: ['Imagery', 'Rhythm', 'Emotion', 'Form Mastery', 'Performance']
  },
  'visual-art': {
    name: 'Visual Arts',
    icon: '🎨',
    description: 'Learn drawing, painting, and digital art techniques',
    topics: [
      { id: 'fundamentals', title: 'Art Fundamentals', lessons: ['Line & Shape', 'Value & Contrast', 'Color Theory', 'Composition'] },
      { id: 'drawing', title: 'Drawing Skills', lessons: ['Sketching', 'Perspective', 'Figure Drawing', 'Portraits'] },
      { id: 'digital', title: 'Digital Art', lessons: ['Software Basics', 'Digital Painting', 'Vector Art', 'Photo Manipulation'] },
      { id: 'styles', title: 'Art Styles', lessons: ['Realism', 'Abstract', 'Impressionism', 'Your Style'] }
    ],
    skills: ['Observation', 'Color Mixing', 'Composition', 'Digital Tools', 'Style Development']
  },
  'photography': {
    name: 'Photo Portfolio',
    icon: '📷',
    description: 'Master photography from basics to professional techniques',
    topics: [
      { id: 'camera', title: 'Camera Basics', lessons: ['Exposure Triangle', 'Aperture', 'Shutter Speed', 'ISO', 'Focus Modes'] },
      { id: 'composition', title: 'Composition', lessons: ['Rule of Thirds', 'Leading Lines', 'Framing', 'Negative Space'] },
      { id: 'lighting', title: 'Lighting', lessons: ['Natural Light', 'Golden Hour', 'Studio Lighting', 'Flash Photography'] },
      { id: 'editing', title: 'Photo Editing', lessons: ['Lightroom Basics', 'Color Grading', 'Retouching', 'Presets'] },
      { id: 'genres', title: 'Photography Genres', lessons: ['Portrait', 'Landscape', 'Street', 'Product', 'Self-Portraits'] }
    ],
    skills: ['Technical Camera Use', 'Lighting', 'Composition', 'Editing', 'Portfolio Building']
  },
  'fashion': {
    name: 'Fashion & Style',
    icon: '👗',
    description: 'Develop personal style and fashion knowledge',
    topics: [
      { id: 'basics', title: 'Fashion Basics', lessons: ['Color Coordination', 'Body Types', 'Fabric Knowledge', 'Fit & Proportion'] },
      { id: 'style', title: 'Personal Style', lessons: ['Style Quiz', 'Capsule Wardrobe', 'Signature Pieces', 'Style Evolution'] },
      { id: 'occasions', title: 'Dressing for Occasions', lessons: ['Casual', 'Business', 'Formal', 'Creative Expression'] },
      { id: 'trends', title: 'Fashion Trends', lessons: ['Trend Spotting', 'Sustainable Fashion', 'Thrifting', 'Statement Pieces'] },
      { id: 'affirming', title: 'Gender-Affirming Fashion', lessons: ['Finding Affirming Pieces', 'Layering Techniques', 'Confidence Building', 'Community Resources'] }
    ],
    skills: ['Color Theory', 'Styling', 'Trend Awareness', 'Self-Expression', 'Confidence']
  },
  'sewing': {
    name: 'Sewing Studio',
    icon: '🧵',
    description: 'Learn sewing from basics to advanced garment construction',
    topics: [
      { id: 'basics', title: 'Sewing Basics', lessons: ['Machine Setup', 'Hand Stitches', 'Fabric Types', 'Cutting Techniques'] },
      { id: 'patterns', title: 'Working with Patterns', lessons: ['Reading Patterns', 'Taking Measurements', 'Pattern Alterations', 'Grading'] },
      { id: 'construction', title: 'Garment Construction', lessons: ['Seams & Finishes', 'Zippers', 'Buttonholes', 'Hemming'] },
      { id: 'projects', title: 'Project Ideas', lessons: ['Simple Skirt', 'Basic Top', 'Pants', 'Dress', 'Cosplay Basics'] },
      { id: 'advanced', title: 'Advanced Techniques', lessons: ['Tailoring', 'Draping', 'Corsetry', 'Embellishments'] }
    ],
    skills: ['Machine Operation', 'Pattern Reading', 'Garment Construction', 'Fitting', 'Design']
  },
  'wardrobe-styling': {
    name: 'Wardrobe Styling',
    icon: '👔',
    description: 'Organize and style your wardrobe effectively',
    topics: [
      { id: 'audit', title: 'Wardrobe Audit', lessons: ['Inventory Taking', 'Keep/Donate/Repair', 'Gaps Analysis', 'Budget Planning'] },
      { id: 'organize', title: 'Organization', lessons: ['Closet Layout', 'Storage Solutions', 'Seasonal Rotation', 'Outfit Planning'] },
      { id: 'outfits', title: 'Outfit Creation', lessons: ['Mix & Match', 'Layering', 'Accessorizing', 'Day-to-Night'] },
      { id: 'maintenance', title: 'Garment Care', lessons: ['Washing', 'Ironing', 'Storage', 'Repairs'] }
    ],
    skills: ['Organization', 'Color Coordination', 'Outfit Planning', 'Garment Care', 'Shopping Smart']
  },
  'language-learning': {
    name: 'Language Learning',
    icon: '🌍',
    description: 'Learn new languages with AI-powered instruction',
    topics: [
      { id: 'spanish', title: 'Spanish', lessons: ['Basics & Greetings', 'Grammar Foundations', 'Vocabulary Building', 'Conversation Practice'] },
      { id: 'french', title: 'French', lessons: ['Pronunciation', 'Essential Phrases', 'Grammar', 'Culture'] },
      { id: 'japanese', title: 'Japanese', lessons: ['Hiragana/Katakana', 'Basic Kanji', 'Grammar Patterns', 'Polite Forms'] },
      { id: 'asl', title: 'ASL (American Sign Language)', lessons: ['Alphabet', 'Common Signs', 'Sentence Structure', 'Deaf Culture'] },
      { id: 'methods', title: 'Learning Methods', lessons: ['Immersion Techniques', 'Spaced Repetition', 'Conversation Practice', 'Media Consumption'] }
    ],
    skills: ['Vocabulary', 'Grammar', 'Pronunciation', 'Listening', 'Speaking', 'Cultural Understanding']
  },
  'skill-development': {
    name: 'Skill Development',
    icon: '🎯',
    description: 'Build technical, creative, and soft skills',
    topics: [
      { id: 'technical', title: 'Technical Skills', lessons: ['Coding Basics', 'Data Analysis', 'Software Tools', 'Automation'] },
      { id: 'creative', title: 'Creative Skills', lessons: ['Design Thinking', 'Problem Solving', 'Innovation', 'Brainstorming'] },
      { id: 'soft', title: 'Soft Skills', lessons: ['Communication', 'Leadership', 'Time Management', 'Emotional Intelligence'] },
      { id: 'business', title: 'Business Skills', lessons: ['Project Management', 'Marketing Basics', 'Finance 101', 'Entrepreneurship'] }
    ],
    skills: ['Learning to Learn', 'Goal Setting', 'Practice Habits', 'Skill Stacking', 'Portfolio Building']
  },
  'college-prep': {
    name: 'College & Credits',
    icon: '🎓',
    description: 'Prepare for college and earn credits',
    topics: [
      { id: 'applications', title: 'College Applications', lessons: ['Essay Writing', 'Application Strategy', 'Interview Prep', 'Financial Aid'] },
      { id: 'testing', title: 'Test Preparation', lessons: ['SAT/ACT Strategies', 'Study Plans', 'Practice Tests', 'Test Day Tips'] },
      { id: 'credits', title: 'Earning Credits', lessons: ['CLEP Exams', 'AP Classes', 'Dual Enrollment', 'Portfolio Credits'] },
      { id: 'study', title: 'Study Skills', lessons: ['Note Taking', 'Memory Techniques', 'Time Management', 'Research Skills'] }
    ],
    skills: ['Test Taking', 'Essay Writing', 'Research', 'Study Habits', 'Self-Advocacy']
  },
  'general-education': {
    name: 'General Education',
    icon: '📚',
    description: 'Broad educational topics and lifelong learning',
    topics: [
      { id: 'humanities', title: 'Humanities', lessons: ['History Overview', 'Philosophy Basics', 'Literature', 'Art History'] },
      { id: 'sciences', title: 'Sciences', lessons: ['Biology Basics', 'Chemistry Intro', 'Physics Concepts', 'Earth Science'] },
      { id: 'math', title: 'Mathematics', lessons: ['Algebra Review', 'Geometry', 'Statistics', 'Practical Math'] },
      { id: 'life-skills', title: 'Life Skills', lessons: ['Financial Literacy', 'Health & Wellness', 'Critical Thinking', 'Digital Literacy'] }
    ],
    skills: ['Critical Thinking', 'Research', 'Analysis', 'Communication', 'Problem Solving']
  }
};

// AI Teacher prompts for each domain
export const TEACHING_PROMPTS: Record<TeachingDomain, string> = {
  'music': `You are Sydney's personal music teacher. Help with music theory, instrument practice (guitar, piano, vocals), composition, and music production. Be encouraging and break down complex concepts. Suggest practice exercises and songs to learn. Reference their practice sessions and progress.`,

  'creative-writing': `You are Sydney's creative writing mentor. Help with storytelling, prose, journaling, and finding their voice. Provide writing prompts, constructive feedback, and encouragement. Reference their writing projects and word count goals.`,

  'poetry': `You are Sydney's poetry guide. Help explore poetic forms, literary devices, rhythm, and emotional expression. Provide prompts, analyze poems together, and encourage their unique voice. Be sensitive to the personal nature of poetry.`,

  'visual-art': `You are Sydney's art instructor. Help with drawing fundamentals, digital art, color theory, and developing their artistic style. Suggest exercises, reference their art projects, and provide constructive feedback.`,

  'photography': `You are Sydney's photography teacher. Help with camera techniques, composition, lighting, and photo editing. Suggest shooting exercises, provide feedback on their photos, and help build their portfolio.`,

  'fashion': `You are Sydney's personal stylist and fashion educator. Help with personal style development, color coordination, outfit planning, and gender-affirming fashion choices. Be supportive and celebrate their self-expression.`,

  'sewing': `You are Sydney's sewing instructor. Help with sewing techniques, pattern reading, garment construction, and project ideas. Be patient with technical questions and suggest projects at their skill level.`,

  'wardrobe-styling': `You are Sydney's wardrobe consultant. Help organize their closet, create outfits from existing pieces, plan capsule wardrobes, and style for different occasions. Reference their wardrobe items.`,

  'language-learning': `You are Sydney's language tutor. Help learn new languages through conversation practice, grammar explanations, vocabulary building, and cultural context. Be patient and encouraging with mistakes.`,

  'skill-development': `You are Sydney's skill development coach. Help identify skills to build, create learning plans, track progress, and stay motivated. Connect skills to their goals and interests.`,

  'college-prep': `You are Sydney's college preparation advisor. Help with college applications, essay writing, test prep, and earning college credits through CLEP/AP. Be encouraging about their academic journey.`,

  'general-education': `You are Sydney's lifelong learning companion. Help explore various subjects, explain concepts clearly, and make learning enjoyable. Connect topics to their interests and real-world applications.`
};

// Integration with existing features
export interface FeatureIntegration {
  featureName: string;
  pagePath: string;
  dataSource: string;
  aiTeacherTopics: string[];
}

export const FEATURE_INTEGRATIONS: FeatureIntegration[] = [
  {
    featureName: 'Music Sanctuary',
    pagePath: '/entertainment/music',
    dataSource: 'MusicSanctuary',
    aiTeacherTopics: ['music-theory', 'guitar', 'piano', 'vocals', 'production']
  },
  {
    featureName: 'Creative Arts Dashboard',
    pagePath: '/creative-arts',
    dataSource: 'CreativeArtsDashboardPage',
    aiTeacherTopics: ['writing', 'poetry', 'art', 'music-practice']
  },
  {
    featureName: 'Fashion Hub',
    pagePath: '/fashion',
    dataSource: 'FashionHubPage',
    aiTeacherTopics: ['style', 'trends', 'affirming-fashion']
  },
  {
    featureName: 'Virtual Wardrobe',
    pagePath: '/wardrobe',
    dataSource: 'VirtualWardrobePage',
    aiTeacherTopics: ['outfit-creation', 'color-coordination', 'styling']
  },
  {
    featureName: 'Sewing Studio',
    pagePath: '/sewing',
    dataSource: 'SewingStudioPage',
    aiTeacherTopics: ['sewing-basics', 'patterns', 'construction']
  },
  {
    featureName: 'Skills Development Hub',
    pagePath: '/skills',
    dataSource: 'SkillsDevelopmentHubPage',
    aiTeacherTopics: ['technical', 'creative', 'soft-skills', 'business']
  },
  {
    featureName: 'Education Portal',
    pagePath: '/education',
    dataSource: 'LearningHubPage',
    aiTeacherTopics: ['study-skills', 'test-prep', 'college-credits']
  }
];

// AI Teacher Session Manager
class UnifiedAITeacher {
  private currentContext: AITeacherContext | null = null;
  private sessions: TeachingSession[] = [];

  constructor() {
    this.loadSessions();
  }

  private loadSessions() {
    const saved = localStorage.getItem('ai_teacher_sessions');
    if (saved) {
      this.sessions = JSON.parse(saved);
    }
  }

  private saveSessions() {
    localStorage.setItem('ai_teacher_sessions', JSON.stringify(this.sessions));
  }

  startSession(domain: TeachingDomain, topic: string): TeachingSession {
    const session: TeachingSession = {
      id: `session_${Date.now()}`,
      domain,
      topic,
      startTime: new Date(),
      progress: 0,
      lessonsCompleted: [],
      notes: []
    };
    this.sessions.push(session);
    this.saveSessions();
    return session;
  }

  endSession(sessionId: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.endTime = new Date();
      this.saveSessions();
    }
  }

  updateProgress(sessionId: string, progress: number, lessonCompleted?: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.progress = progress;
      if (lessonCompleted) {
        session.lessonsCompleted.push(lessonCompleted);
      }
      this.saveSessions();
    }
  }

  getSessionsByDomain(domain: TeachingDomain): TeachingSession[] {
    return this.sessions.filter(s => s.domain === domain);
  }

  getTotalLearningTime(domain?: TeachingDomain): number {
    const relevantSessions = domain
      ? this.sessions.filter(s => s.domain === domain)
      : this.sessions;

    return relevantSessions.reduce((total, session) => {
      const end = session.endTime ? new Date(session.endTime) : new Date();
      const start = new Date(session.startTime);
      return total + (end.getTime() - start.getTime()) / 1000 / 60; // minutes
    }, 0);
  }

  getRecommendedTopics(domain: TeachingDomain): string[] {
    const curriculum = CURRICULUM[domain];
    if (!curriculum || !curriculum.topics) {
      return [];
    }

    const completedLessons = this.sessions
      .filter(s => s.domain === domain)
      .flatMap(s => s.lessonsCompleted || []);

    // Find topics with incomplete lessons
    const recommendations: string[] = [];
    for (const topic of curriculum.topics) {
      if (!topic || !topic.lessons) continue;
      const incompleteLessons = topic.lessons.filter(l => !completedLessons.includes(l));
      if (incompleteLessons.length > 0) {
        recommendations.push(topic.title);
      }
    }
    return recommendations.slice(0, 3);
  }

  generateTeachingPrompt(domain: TeachingDomain, userMessage: string): string {
    const basePrompt = TEACHING_PROMPTS[domain] || 'You are a helpful learning assistant.';
    const curriculum = CURRICULUM[domain] || { name: 'General', topics: [], skills: [] };
    const sessions = this.getSessionsByDomain(domain);
    const totalTime = this.getTotalLearningTime(domain);

    return `${basePrompt}

CURRICULUM CONTEXT:
- Domain: ${curriculum.name || 'General'}
- Available Topics: ${(curriculum.topics || []).map(t => t?.title || 'Unknown').join(', ')}
- Key Skills: ${(curriculum.skills || []).join(', ')}

STUDENT PROGRESS:
- Total Learning Time: ${Math.round(totalTime)} minutes
- Sessions Completed: ${sessions.length}
- Lessons Completed: ${sessions.flatMap(s => s.lessonsCompleted).length}

USER MESSAGE: ${userMessage}

Respond as their dedicated teacher for ${curriculum.name}. Be encouraging, specific, and helpful.`;
  }

  getAllProgress(): Record<TeachingDomain, { sessions: number; minutes: number; lessons: number }> {
    const progress: Record<string, { sessions: number; minutes: number; lessons: number }> = {};

    for (const domain of Object.keys(CURRICULUM) as TeachingDomain[]) {
      const sessions = this.getSessionsByDomain(domain);
      progress[domain] = {
        sessions: sessions.length,
        minutes: Math.round(this.getTotalLearningTime(domain)),
        lessons: sessions.flatMap(s => s.lessonsCompleted).length
      };
    }

    return progress as Record<TeachingDomain, { sessions: number; minutes: number; lessons: number }>;
  }
}

// Export singleton instance
export const unifiedAITeacher = new UnifiedAITeacher();

// Quick access functions
export const startLearningSession = (domain: TeachingDomain, topic: string) =>
  unifiedAITeacher.startSession(domain, topic);

export const getTeachingPrompt = (domain: TeachingDomain, message: string) =>
  unifiedAITeacher.generateTeachingPrompt(domain, message);

export const getLearningProgress = () =>
  unifiedAITeacher.getAllProgress();

export const getRecommendations = (domain: TeachingDomain) =>
  unifiedAITeacher.getRecommendedTopics(domain);

export default unifiedAITeacher;

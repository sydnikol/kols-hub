/**
 * Sample Education Data & Starter Courses
 * Pre-populated recommendations based on Kol's interests
 */

export const STARTER_COURSES = [
  // Writing & Poetry (Kol's primary skill)
  {
    id: 'clep-comp-001',
    platform: 'Modern States',
    courseName: 'College Composition',
    provider: 'CLEP',
    creditType: 'CLEP' as const,
    creditHours: 6,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 2400,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['writing', 'english', 'poetry', 'communication'],
    notes: 'Perfect for your writing and poetry skills! This exam covers both Composition I and II.',
    resumeReady: false
  },
  {
    id: 'clep-lit-001',
    platform: 'Modern States',
    courseName: 'American Literature',
    provider: 'CLEP',
    creditType: 'CLEP' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['literature', 'writing', 'poetry', 'analysis'],
    notes: 'Combines with your poetry background beautifully',
    resumeReady: false
  },

  // Psychology & Mental Health
  {
    id: 'sophia-psych-001',
    platform: 'Sophia Learning',
    courseName: 'Introduction to Psychology',
    provider: 'Sophia',
    creditType: 'ACE' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['psychology', 'mental health', 'behavior', 'advocacy'],
    notes: 'Supports your mental health advocacy and personal understanding',
    resumeReady: false
  },
  {
    id: 'clep-psych-001',
    platform: 'Modern States',
    courseName: 'Introductory Psychology',
    provider: 'CLEP',
    creditType: 'CLEP' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['psychology', 'mental health', 'trauma', 'accessibility'],
    notes: 'Free exam prep through Modern States!',
    resumeReady: false
  },

  // Photography & Visual Arts
  {
    id: 'coursera-photo-001',
    platform: 'Coursera',
    courseName: 'Photography Basics and Beyond Specialization',
    provider: 'Michigan State University',
    creditType: 'Portfolio' as const,
    creditHours: 0,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 0,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['photography', 'visual arts', 'composition', 'modeling'],
    notes: 'Professional certificate to boost your photography portfolio',
    resumeReady: false
  },

  // Communication & Advocacy
  {
    id: 'sophia-comm-001',
    platform: 'Sophia Learning',
    courseName: 'Communication at Work',
    provider: 'Sophia',
    creditType: 'ACE' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['communication', 'advocacy', 'professional', 'activism'],
    notes: 'Essential for advocacy and community organizing',
    resumeReady: false
  },

  // Social Justice & Sociology
  {
    id: 'clep-soc-001',
    platform: 'Modern States',
    courseName: 'Introductory Sociology',
    provider: 'CLEP',
    creditType: 'CLEP' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['sociology', 'social justice', 'activism', 'community'],
    notes: 'Foundation for understanding social structures and activism',
    resumeReady: false
  },

  // Business & Entrepreneurship (for creative business)
  {
    id: 'sophia-bus-001',
    platform: 'Sophia Learning',
    courseName: 'Introduction to Business',
    provider: 'Sophia',
    creditType: 'ACE' as const,
    creditHours: 3,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 1200,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['business', 'entrepreneurship', 'creative business'],
    notes: 'For monetizing your creative work and building passive income',
    resumeReady: false
  },

  // Digital Marketing (for portfolio building)
  {
    id: 'google-analytics-001',
    platform: 'Google Skillshop',
    courseName: 'Google Analytics Certification',
    provider: 'Google',
    creditType: 'Portfolio' as const,
    creditHours: 0,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 0,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['marketing', 'analytics', 'digital', 'portfolio'],
    notes: 'FREE 4-hour cert that looks great on resumes',
    resumeReady: false
  },

  // Disability Studies (aligns with advocacy)
  {
    id: 'edx-disability-001',
    platform: 'edX',
    courseName: 'Disability Awareness and Support',
    provider: 'Davidson College',
    creditType: 'Portfolio' as const,
    creditHours: 0,
    progress: 0,
    timeSpent: 0,
    startDate: new Date().toISOString(),
    costSavings: 0,
    status: 'not-started' as const,
    difficulty: 'beginner' as const,
    tags: ['disability', 'accessibility', 'advocacy', 'support'],
    notes: 'Audit for FREE, directly relevant to your lived experience and advocacy',
    resumeReady: false
  }
];

// Sample Resume Entries
export const SAMPLE_RESUME_ENTRIES = [
  {
    id: 'resume-poetry-001',
    type: 'achievement' as const,
    title: 'Published Poet',
    organization: 'Independent',
    description: 'Published poetry exploring themes of trauma, resilience, and social justice',
    startDate: '2015-01-01',
    ongoing: true,
    skills: ['creative writing', 'poetry', 'storytelling', 'trauma-informed'],
    verified: false,
    autoGenerated: false
  },
  {
    id: 'resume-photo-001',
    type: 'skill' as const,
    title: 'Photography & Visual Arts',
    organization: 'Self-Employed',
    description: 'Professional photography including portrait, modeling, and artistic composition',
    startDate: '2016-01-01',
    ongoing: true,
    skills: ['photography', 'visual composition', 'modeling', 'artistic direction'],
    verified: false,
    autoGenerated: false
  },
  {
    id: 'resume-advocacy-001',
    type: 'volunteer' as const,
    title: 'Disability Rights Advocate',
    organization: 'Community Organizing',
    description: 'Advocate for accessibility, disability rights, and trauma-informed care in Kansas City area',
    startDate: '2018-01-01',
    ongoing: true,
    skills: ['advocacy', 'public speaking', 'community organizing', 'accessibility'],
    verified: false,
    autoGenerated: false
  }
];

// Weekly Learning Goals (Low Pressure)
export const WEEKLY_LEARNING_GOALS = [
  {
    week: 1,
    theme: 'Exploration Week',
    goal: 'Browse 3 free course platforms and bookmark 1 course that interests you',
    pressure: 'zero',
    time: '15 minutes total'
  },
  {
    week: 2,
    theme: 'Gentle Start',
    goal: 'Watch one intro video from your bookmarked course',
    pressure: 'minimal',
    time: '10-20 minutes'
  },
  {
    week: 3,
    theme: 'Building Rhythm',
    goal: 'Complete 1-2 lessons at your own pace',
    pressure: 'low',
    time: '30 minutes this week'
  },
  {
    week: 4,
    theme: 'Consistency Check-In',
    goal: 'Reflect on what worked. Adjust as needed. No guilt.',
    pressure: 'none',
    time: '5 minutes'
  }
];

// Auto-Learning Tracker
export const AUTO_TRACKING_EVENTS = [
  'app_opened',
  'course_viewed',
  'lesson_started',
  'lesson_completed',
  'certificate_earned',
  'skill_practiced',
  'portfolio_updated'
];

// Celebration Milestones (Low-Pressure)
export const CELEBRATION_MILESTONES = [
  { credits: 3, message: 'First course complete! You saved $1,200 💜' },
  { credits: 6, message: 'Two courses down! That\'s $2,400 saved!' },
  { credits: 12, message: 'One semester complete! $4,800 in savings!' },
  { credits: 30, message: 'Halfway to Associate\'s! $12,000 saved!' },
  { credits: 60, message: '🎓 Associate\'s degree equivalent! $24,000 saved!' },
  { credits: 90, message: 'Three-quarters there! $36,000 saved!' },
  { credits: 120, message: '🎓🎓 Bachelor\'s degree equivalent! $48,000 saved!' }
];

export default {
  STARTER_COURSES,
  SAMPLE_RESUME_ENTRIES,
  WEEKLY_LEARNING_GOALS,
  AUTO_TRACKING_EVENTS,
  CELEBRATION_MILESTONES
};
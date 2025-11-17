export type LearningIdea = {
  id: number;
  category: string;
  title: string;
  learning_objective: string;
  suggested_activity: string;
  code_template: string;
  source: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimated_time_min: number;
};

export type SewingIdea = {
  id: number;
  title: string;
  category: string;
  difficulty_1_easy_5_hard: 1 | 2 | 3 | 4 | 5;
  time_estimate_hours: number;
  recommended_fabric: string;
  notions: string;
  sensory_notes: string;
  tags: string;
};

export type MentalHealthIdea = {
  text: string;
  effort: 1 | 2 | 3;
  category: string;
  categoryTitle: string;
};

export type CreativeIdea = {
  id: string;
  medium: "TV" | "Comic" | "Movie";
  title: string;
  logline: string;
  tone: string;
  themes: string[];
  tags: string[];
  rating: "G" | "PG" | "PG‑13" | "R";
};

export type HoodooRitual = {
  id: number;
  title: string;
  description: string;
  difficulty: "Simple" | "Moderate" | "Complex";
  supplies: string[];
  time_minutes: number;
  category: string;
  safety_notes?: string;
};

export type HearingCase = {
  id: string;
  title: string;
  status: "draft" | "active" | "completed";
  claimant: string;
  createdAt: string;
  updatedAt?: string;
};

export type HearingEvidence = {
  id: string;
  caseId: string;
  tag: string;
  notes: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
};

export type MediaItem = {
  id: string;
  title: string;
  type: "movie" | "tv" | "game" | "comic" | "boardgame";
  platform?: string;
  url?: string;
  thumbnail?: string;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  notes?: string;
  isFavorite?: boolean;
};

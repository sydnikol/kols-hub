// Dream Journal and Interpretation System exports
// Gothic Dollhouse Dream Module

// Main Components
export { DreamJournal, default as DreamJournalDefault } from './DreamJournal';
export { DreamInterpreter } from './DreamInterpreter';
export { DreamPatterns } from './DreamPatterns';
export { DreamGallery } from './DreamGallery';

// Types and Constants (re-exported from DreamJournal)
export type { DreamEntry } from './DreamJournal';
export {
  DREAM_STORAGE_KEY,
  moonPhases,
  dreamMoods,
  emotionTags,
  getMoonPhase,
} from './DreamJournal';

// Default export
export { DreamJournal as default } from './DreamJournal';

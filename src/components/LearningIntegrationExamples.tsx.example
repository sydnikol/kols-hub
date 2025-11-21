// Example integration in existing components
// Add to any component where learning should trigger

import { learningService } from '../services/learningService';
import { useLearningTrigger, learningTriggers } from './LearningTooltip';

// EXAMPLE 1: In Photo Upload Component
const handlePhotoUpload = async (file: File) => {
  // ... existing upload logic ...
  
  // Trigger passive learning
  await learningService.triggerFromAction('photo_uploaded', {
    fileSize: file.size,
    timestamp: new Date()
  });
  
  // Show learning tooltip
  triggerLearning(
    learningTriggers.photoUpload.skill,
    learningTriggers.photoUpload.explanation,
    learningTriggers.photoUpload.example
  );
};

// EXAMPLE 2: In Theme Creator Component
const handleThemeSave = async (theme: any) => {
  // ... existing save logic ...
  
  // Record learning moment
  await learningService.recordLearningMoment({
    pathwayId: 'creative_mastery',
    moduleId: 'digital_design',
    trigger: 'theme_created',
    skillPracticed: 'color_theory',
    contextNote: `Created theme: ${theme.name}`,
    portfolioPiece: {
      type: 'design',
      title: theme.name,
      description: `Gothic UI theme with ${Object.keys(theme.colors).length} color variations`
    }
  });
  
  triggerLearning(
    learningTriggers.themeCreation.skill,
    learningTriggers.themeCreation.explanation,
    learningTriggers.themeCreation.example
  );
};

// EXAMPLE 3: In Medication Tracker Component
const handleMedicationLog = async (med: any) => {
  // ... existing logging ...
  
  await learningService.triggerFromAction('medication_logged', {
    medication: med.name,
    time: new Date()
  });
  
  triggerLearning(
    learningTriggers.medicationTracking.skill,
    learningTriggers.medicationTracking.explanation,
    learningTriggers.medicationTracking.example
  );
};

// EXAMPLE 4: In Journal Component
const handleJournalSave = async (entry: string) => {
  // ... existing save logic ...
  
  await learningService.recordLearningMoment({
    pathwayId: 'writing_mastery',
    moduleId: 'narrative_storytelling',
    trigger: 'journal_entry',
    skillPracticed: 'personal_narrative',
    contextNote: `${entry.length} words`,
    portfolioPiece: entry.length > 500 ? {
      type: 'writing',
      title: `Journal Entry ${new Date().toLocaleDateString()}`,
      description: entry.substring(0, 200) + '...'
    } : undefined
  });
  
  triggerLearning(
    learningTriggers.journalEntry.skill,
    learningTriggers.journalEntry.explanation,
    learningTriggers.journalEntry.example
  );
};

// EXAMPLE 5: In Anime Tracker Component
const handleAnimeEpisodeWatched = async (anime: any, episode: number) => {
  // ... existing tracking ...
  
  await learningService.triggerFromAction('anime_tracked', {
    title: anime.title,
    episode: episode
  });
  
  // Show Japanese learning tip every 3 episodes
  if (episode % 3 === 0) {
    triggerLearning(
      learningTriggers.animeTracking.skill,
      learningTriggers.animeTracking.explanation,
      learningTriggers.animeTracking.example
    );
  }
};

// EXAMPLE 6: In Drama Tracker Component
const handleDramaEpisodeWatched = async (drama: any, episode: number) => {
  // ... existing tracking ...
  
  await learningService.triggerFromAction('drama_tracked', {
    title: drama.title,
    episode: episode
  });
  
  if (episode % 3 === 0) {
    triggerLearning(
      learningTriggers.dramaTracking.skill,
      learningTriggers.dramaTracking.explanation,
      learningTriggers.dramaTracking.example
    );
  }
};

// EXAMPLE 7: In Outfit Planner Component
const handleOutfitSave = async (outfit: any) => {
  // ... existing save logic ...
  
  await learningService.recordLearningMoment({
    pathwayId: 'fashion_aesthetic',
    moduleId: 'outfit_curation',
    trigger: 'outfit_planned',
    skillPracticed: 'color_coordination',
    contextNote: `${outfit.items.length} items, ${outfit.occasion}`,
    portfolioPiece: {
      type: 'design',
      title: `Outfit: ${outfit.name || outfit.occasion}`,
      description: outfit.items.join(', ')
    }
  });
  
  triggerLearning(
    learningTriggers.outfitPlanning.skill,
    learningTriggers.outfitPlanning.explanation,
    learningTriggers.outfitPlanning.example
  );
};

// EXAMPLE 8: In Ritual Planner Component
const handleRitualPerformed = async (ritual: any) => {
  // ... existing logging ...
  
  await learningService.recordLearningMoment({
    pathwayId: 'spiritual_ancestral',
    moduleId: 'hoodoo_practice',
    trigger: 'ritual_performed',
    skillPracticed: 'ritual_design',
    contextNote: `${ritual.type} ritual, ${ritual.intention}`,
    portfolioPiece: {
      type: 'project',
      title: ritual.name,
      description: `Ritual for ${ritual.intention} using ${ritual.elements.join(', ')}`
    }
  });
  
  triggerLearning(
    learningTriggers.ritualPlanning.skill,
    learningTriggers.ritualPlanning.explanation,
    learningTriggers.ritualPlanning.example
  );
};

// EXAMPLE 9: In any component with LearningTooltip
const MyComponent = () => {
  const { triggerLearning, LearningTooltipComponent } = useLearningTrigger();
  
  return (
    <div>
      {/* ... existing UI ... */}
      
      {/* Add learning tooltip at root level */}
      <LearningTooltipComponent />
    </div>
  );
};

// EXAMPLE 10: Batch learning moment recording
const recordMultipleLearningMoments = async (actions: string[]) => {
  await Promise.all(
    actions.map(action => learningService.triggerFromAction(action, {}))
  );
};

export {
  handlePhotoUpload,
  handleThemeSave,
  handleMedicationLog,
  handleJournalSave,
  handleAnimeEpisodeWatched,
  handleDramaEpisodeWatched,
  handleOutfitSave,
  handleRitualPerformed,
  recordMultipleLearningMoments
};

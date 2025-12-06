/**
 * 🚀 AUTO LIBRARY FILLER
 * Automatically fills all libraries with AI-generated content on first load
 */

import { libraryGenerator } from './libraryContentGenerator';
import { geminiAI } from './geminiAIService';
import { avatarStyleGenerator } from './avatarStyleGenerator';
import toast from 'react-hot-toast';

export class AutoLibraryFiller {
  private static instance: AutoLibraryFiller;
  private isInitialized = false;

  static getInstance(): AutoLibraryFiller {
    if (!AutoLibraryFiller.instance) {
      AutoLibraryFiller.instance = new AutoLibraryFiller();
    }
    return AutoLibraryFiller.instance;
  }

  /**
   * Initialize and fill all libraries
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('📚 Libraries already filled');
      return;
    }

    const isFirstLoad = !localStorage.getItem('librariesFilled');

    if (isFirstLoad) {
      console.log('🎨 First load detected - filling all libraries...');
      await this.fillAllLibraries();
      localStorage.setItem('librariesFilled', 'true');
      localStorage.setItem('librariesFilledDate', new Date().toISOString());
    }

    this.isInitialized = true;
  }

  /**
   * Fill all libraries with comprehensive content
   */
  async fillAllLibraries() {
    try {
      // Show loading toast
      const loadingToast = toast.loading('🤖 Generating AI-powered content for all libraries...', {
        duration: 10000,
      });

      // Generate local content first (instant)
      console.log('📦 Generating local library content...');
      const localContent = libraryGenerator.fillAllLibraries();

      // Generate AI content in background (takes longer)
      console.log('🤖 Generating AI-enhanced content...');
      this.generateAIContentAsync();

      toast.success(
        `✅ Libraries filled! ${localContent.total}+ items generated`,
        { id: loadingToast }
      );

      console.log('✨ All libraries filled successfully!');
      console.log(`   📚 Total items: ${localContent.total}`);

      return localContent;
    } catch (error) {
      console.error('❌ Error filling libraries:', error);
      toast.error('Failed to fill some libraries - using fallback content');
    }
  }

  /**
   * Generate AI content asynchronously in the background
   */
  private async generateAIContentAsync() {
    try {
      console.log('🎨 Generating AI avatar styles...');
      const avatarStyles = await avatarStyleGenerator.generateStyles();
      localStorage.setItem('avatarStyles', JSON.stringify(avatarStyles));
      console.log(`   ✅ ${avatarStyles.length} avatar styles generated`);

      console.log('🎨 Generating AI theme palettes...');
      const themes = await geminiAI.generateThemePalettes('modern and accessible');
      if (themes.palettes) {
        localStorage.setItem('aiThemePalettes', JSON.stringify(themes.palettes));
        console.log(`   ✅ ${themes.palettes.length} theme palettes generated`);
      }

      console.log('💪 Generating workout plans...');
      const workouts = await geminiAI.generateWorkoutPlans('all levels');
      if (workouts.length > 0) {
        localStorage.setItem('workoutPlans', JSON.stringify(workouts));
        console.log(`   ✅ ${workouts.length} workout plans generated`);
      }

      console.log('🍽️ Generating meal plans...');
      const mealPlans = await geminiAI.generateMealPlans(14, 'balanced');
      if (mealPlans.days) {
        localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
        console.log(`   ✅ ${mealPlans.days.length}-day meal plan generated`);
      }

      console.log('🎓 Generating learning courses...');
      const courses = await geminiAI.generateCourses('personal development');
      if (courses.length > 0) {
        localStorage.setItem('learningCourses', JSON.stringify(courses));
        console.log(`   ✅ ${courses.length} courses generated`);
      }

      // Optional: Generate even more AI content
      console.log('📚 Generating AI book recommendations...');
      const aiBooks = await geminiAI.generateBooks(50, 'diverse genres');
      if (aiBooks.length > 0) {
        // Merge with existing books
        const existingBooks = JSON.parse(localStorage.getItem('bookLibrary') || '[]');
        localStorage.setItem('bookLibrary', JSON.stringify([...existingBooks, ...aiBooks]));
        console.log(`   ✅ ${aiBooks.length} AI books added`);
      }

      toast.success('🎉 AI-enhanced content generation complete!', { duration: 3000 });
      console.log('✨ All AI content generated successfully!');
    } catch (error) {
      console.error('⚠️ Some AI content generation failed:', error);
      // Non-blocking - local content is already available
    }
  }

  /**
   * Regenerate all content (for manual refresh)
   */
  async regenerateAllContent() {
    const confirmed = confirm(
      'This will regenerate ALL library content. Current content will be replaced. Continue?'
    );

    if (!confirmed) return;

    localStorage.removeItem('librariesFilled');
    this.isInitialized = false;
    await this.initialize();

    toast.success('All content regenerated!');
  }

  /**
   * Get library statistics
   */
  getLibraryStats() {
    return {
      books: JSON.parse(localStorage.getItem('bookLibrary') || '[]').length,
      podcasts: JSON.parse(localStorage.getItem('podcastSubscriptions') || '[]').length,
      recipes: JSON.parse(localStorage.getItem('cookingRecipes') || '[]').length,
      media: JSON.parse(localStorage.getItem('mediaLibrary') || '[]').length,
      ideas: JSON.parse(localStorage.getItem('creativeIdeas') || '[]').length,
      avatarStyles: JSON.parse(localStorage.getItem('avatarStyles') || '[]').length,
      themePalettes: JSON.parse(localStorage.getItem('aiThemePalettes') || '[]').length,
      workouts: JSON.parse(localStorage.getItem('workoutPlans') || '[]').length,
      courses: JSON.parse(localStorage.getItem('learningCourses') || '[]').length,
      filledDate: localStorage.getItem('librariesFilledDate'),
    };
  }

  /**
   * Check if libraries are filled
   */
  isFilled(): boolean {
    return localStorage.getItem('librariesFilled') === 'true';
  }
}

export const autoLibraryFiller = AutoLibraryFiller.getInstance();
export default autoLibraryFiller;

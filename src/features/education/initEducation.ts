/**
 * Education Initialization
 * Seeds database with starter courses and resume entries
 */

import { db } from '../../services/db';
import { STARTER_COURSES, SAMPLE_RESUME_ENTRIES } from './starterData';

export async function initializeEducation() {
  try {
    // Check if already initialized
    const existingCourses = await db.education.count();
    
    if (existingCourses === 0) {
      // Add starter courses
      await db.education.bulkAdd(STARTER_COURSES);
      console.log('✅ Education: Added starter courses');
      
      // Add sample resume entries
      await db.resume.bulkAdd(SAMPLE_RESUME_ENTRIES);
      console.log('✅ Education: Added resume entries');
      
      // Log evolution
      await db.evolution.add({
        timestamp: new Date(),
        event: 'Education system initialized',
        category: 'education',
        data: {
          coursesAdded: STARTER_COURSES.length,
          resumeEntriesAdded: SAMPLE_RESUME_ENTRIES.length
        }
      });
      
      return {
        success: true,
        message: 'Education system initialized successfully'
      };
    } else {
      console.log('📚 Education: Already initialized');
      return {
        success: true,
        message: 'Education system already initialized'
      };
    }
  } catch (error) {
    console.error('❌ Education initialization error:', error);
    return {
      success: false,
      message: 'Failed to initialize education system',
      error
    };
  }
}

// Auto-run on import
initializeEducation();

export default initializeEducation;
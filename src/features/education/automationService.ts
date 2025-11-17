/**
 * Passive Learning Automation
 * Tracks patterns and suggests low-pressure next steps
 */

import { db } from '../../services/db';
import { EducationService } from './educationService';

export class PassiveLearningAutomation {
  
  // Analyze learning patterns
  static async analyzePatterns() {
    const courses = await db.education.toArray();
    const evolution = await db.evolution.where('category').equals('education').toArray();
    
    // Find best time of day for learning
    const learningEvents = evolution.filter(e => 
      e.event.includes('lesson') || e.event.includes('course')
    );
    
    const timeOfDayPattern = this.findOptimalTimeOfDay(learningEvents);
    const energyPattern = this.analyzeEnergyLevels();
    const completionPattern = this.analyzeCompletionRates(courses);
    
    return {
      bestTimeOfDay: timeOfDayPattern,
      avgEnergyLevel: energyPattern,
      completionRate: completionPattern,
      recommendations: this.generateRecommendations(courses)
    };
  }
  
  // Find when user is most productive
  private static findOptimalTimeOfDay(events: any[]) {
    const hourCounts: { [hour: number]: number } = {};
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const bestHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (!bestHour) return 'afternoon';
    
    const hour = parseInt(bestHour[0]);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
  
  // Analyze energy patterns from mood tracking
  private static async analyzeEnergyLevels() {
    const moodRecords = await db.mood.orderBy('timestamp').reverse().limit(30).toArray();
    
    if (moodRecords.length === 0) return 5; // default medium energy
    
    const avgEnergy = moodRecords.reduce((sum, m) => sum + m.energy, 0) / moodRecords.length;
    return Math.round(avgEnergy);
  }
  
  // Check completion rates
  private static analyzeCompletionRates(courses: any[]) {
    const completed = courses.filter(c => c.status === 'completed').length;
    const total = courses.filter(c => c.status !== 'not-started').length;
    
    if (total === 0) return 0;
    return (completed / total) * 100;
  }
  
  // Generate personalized recommendations
  private static generateRecommendations(courses: any[]) {
    const recommendations = [];
    const inProgress = courses.filter(c => c.status === 'in-progress');
    const notStarted = courses.filter(c => c.status === 'not-started');
    
    // If no courses started
    if (inProgress.length === 0 && notStarted.length > 0) {
      recommendations.push({
        type: 'start',
        action: 'Start your first course',
        course: notStarted[0],
        reason: 'Low commitment, high value',
        effort: 'Just watch the intro video (10 minutes)'
      });
    }
    
    // If courses stalled
    const stalledCourses = inProgress.filter(c => {
      const daysSinceUpdate = (Date.now() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate > 7 && c.progress < 50;
    });
    
    if (stalledCourses.length > 0) {
      recommendations.push({
        type: 'continue',
        action: 'Maybe revisit this course?',
        course: stalledCourses[0],
        reason: 'You started this a while ago - no pressure though!',
        effort: 'Even 15 minutes helps'
      });
    }
    
    // If nearly complete
    const nearlyDone = inProgress.filter(c => c.progress >= 75);
    if (nearlyDone.length > 0) {
      recommendations.push({
        type: 'finish',
        action: 'You\'re so close!',
        course: nearlyDone[0],
        reason: `Only ${100 - nearlyDone[0].progress}% left`,
        effort: 'One final push = college credit!'
      });
    }
    
    // Quick wins available
    const quickCerts = notStarted.filter(c => 
      c.tags.includes('quick') || c.difficulty === 'beginner'
    );
    
    if (quickCerts.length > 0) {
      recommendations.push({
        type: 'quick-win',
        action: 'Quick certificate opportunity',
        course: quickCerts[0],
        reason: 'Low effort, big resume impact',
        effort: '3-6 hours total'
      });
    }
    
    return recommendations.slice(0, 3); // Max 3 suggestions
  }
  
  // Auto-log learning time (passive)
  static async autoLogLearningTime(minutes: number) {
    const inProgressCourses = await db.education
      .where('status')
      .equals('in-progress')
      .toArray();
    
    if (inProgressCourses.length > 0) {
      // Distribute time across active courses
      const timePerCourse = minutes / inProgressCourses.length;
      
      for (const course of inProgressCourses) {
        await EducationService.logLearningTime(course.id!.toString(), timePerCourse);
      }
      
      // Log evolution
      await db.evolution.add({
        timestamp: new Date(),
        event: `Auto-logged ${minutes} minutes of learning`,
        category: 'education',
        data: { minutes, courses: inProgressCourses.length }
      });
    }
  }
  
  // Check for celebration milestones
  static async checkMilestones() {
    const courses = await db.education.where('status').equals('completed').toArray();
    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
    
    const milestones = [3, 6, 12, 30, 60, 90, 120];
    const preferences = await db.preferences.where('key').equals('lastCelebrated').first();
    const lastCelebrated = preferences?.value || 0;
    
    // Find next milestone
    const nextMilestone = milestones.find(m => m > lastCelebrated && totalCredits >= m);
    
    if (nextMilestone) {
      // Update preference
      await db.preferences.put({
        key: 'lastCelebrated',
        value: nextMilestone,
        updatedAt: new Date()
      });
      
      // Return celebration message
      const messages: { [key: number]: string } = {
        3: '🎉 First course complete! You saved $1,200 💜',
        6: '🎉 Two courses down! That\'s $2,400 saved!',
        12: '🎉 One semester complete! $4,800 in savings!',
        30: '🎉 Halfway to Associate\'s! $12,000 saved!',
        60: '🎓 Associate\'s degree equivalent! $24,000 saved!',
        90: '🎉 Three-quarters there! $36,000 saved!',
        120: '🎓🎓 Bachelor\'s degree equivalent! $48,000 saved!'
      };
      
      return {
        celebrate: true,
        milestone: nextMilestone,
        message: messages[nextMilestone],
        totalCredits,
        totalSavings: totalCredits * 400
      };
    }
    
    return { celebrate: false };
  }
  
  // Daily gentle check-in
  static async getDailyCheckIn() {
    const patterns = await this.analyzePatterns();
    const milestone = await this.checkMilestones();
    const courses = await db.education.toArray();
    const progress = EducationService.calculateDegreeProgress(courses);
    
    return {
      greeting: this.getContextualGreeting(),
      patterns,
      milestone,
      progress,
      suggestions: patterns.recommendations,
      encouragement: this.getEncouragement(progress)
    };
  }
  
  private static getContextualGreeting() {
    const hour = new Date().getHours();
    const greetings = [
      'Hey, just checking in - no pressure 💜',
      'Hope you\'re having a good day! Quick education update:',
      'Your learning journey progress (when you\'re ready):',
      'Gentle reminder: You\'re doing great 💜'
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  private static getEncouragement(progress: any) {
    if (progress.completedCredits === 0) {
      return 'No courses started yet - that\'s totally okay! Start when you\'re ready 💜';
    }
    
    if (progress.completedCredits < 30) {
      return `You've saved $${progress.moneySaved.toLocaleString()} so far - amazing! 🎉`;
    }
    
    if (progress.completedCredits < 60) {
      return `You're ${progress.associateDegree.toFixed(0)}% toward an Associate's degree! 🎓`;
    }
    
    return `You're crushing this! ${progress.bachelorsDegree.toFixed(0)}% toward a Bachelor's! 🎓🎓`;
  }
  
  // Background automation (runs every app open)
  static async runBackgroundTasks() {
    try {
      // Check milestones
      const milestone = await this.checkMilestones();
      
      // Auto-log passive learning (if app was open)
      // This would integrate with app activity tracking
      
      // Return any important updates
      return {
        milestone: milestone.celebrate ? milestone : null,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Background automation error:', error);
      return null;
    }
  }
}

export default PassiveLearningAutomation;
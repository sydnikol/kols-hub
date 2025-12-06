/**
 * Google Fit API Service
 * Complete integration for KOL Hub Health & Fitness features
 * Project: kol-music
 */

export interface FitnessData {
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRate?: number[];
  sleepMinutes?: number;
  weight?: number;
}

export interface WorkoutSession {
  id: string;
  activityType: string;
  startTime: string;
  endTime: string;
  duration: number;
  calories: number;
  distance?: number;
  heartRate?: {
    average: number;
    max: number;
    min: number;
  };
}

export interface SleepSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  stages: {
    awake: number;
    light: number;
    deep: number;
    rem: number;
  };
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export class GoogleFitService {
  private accessToken: string | null = null;
  private baseUrl = 'https://www.googleapis.com/fitness/v1/users/me';

  constructor() {
    this.accessToken = localStorage.getItem('google_fit_access_token');
  }

  /**
   * Set access token from OAuth flow
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('google_fit_access_token', token);
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * ACTIVITY DATA
   */

  /**
   * Get daily steps
   */
  async getDailySteps(date?: Date): Promise<number> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const response = await fetch(
      `${this.baseUrl}/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 }, // 1 day
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime()
        })
      }
    );

    const data = await response.json();

    if (data.bucket && data.bucket[0]?.dataset[0]?.point) {
      const points = data.bucket[0].dataset[0].point;
      return points.reduce((sum: number, point: any) =>
        sum + (point.value[0]?.intVal || 0), 0
      );
    }

    return 0;
  }

  /**
   * Get weekly steps (last 7 days)
   */
  async getWeeklySteps(): Promise<{ date: string; steps: number }[]> {
    const results = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const steps = await this.getDailySteps(date);
      results.push({
        date: date.toISOString().split('T')[0],
        steps
      });
    }

    return results;
  }

  /**
   * Get calories burned
   */
  async getDailyCalories(date?: Date): Promise<number> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const response = await fetch(
      `${this.baseUrl}/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.calories.expended'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime()
        })
      }
    );

    const data = await response.json();

    if (data.bucket && data.bucket[0]?.dataset[0]?.point) {
      const points = data.bucket[0].dataset[0].point;
      return points.reduce((sum: number, point: any) =>
        sum + (point.value[0]?.fpVal || 0), 0
      );
    }

    return 0;
  }

  /**
   * Get distance traveled (meters)
   */
  async getDailyDistance(date?: Date): Promise<number> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const response = await fetch(
      `${this.baseUrl}/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.distance.delta'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime()
        })
      }
    );

    const data = await response.json();

    if (data.bucket && data.bucket[0]?.dataset[0]?.point) {
      const points = data.bucket[0].dataset[0].point;
      return points.reduce((sum: number, point: any) =>
        sum + (point.value[0]?.fpVal || 0), 0
      );
    }

    return 0;
  }

  /**
   * Get active minutes
   */
  async getDailyActiveMinutes(date?: Date): Promise<number> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const response = await fetch(
      `${this.baseUrl}/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{
            dataTypeName: 'com.google.active_minutes'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime()
        })
      }
    );

    const data = await response.json();

    if (data.bucket && data.bucket[0]?.dataset[0]?.point) {
      const points = data.bucket[0].dataset[0].point;
      return points.reduce((sum: number, point: any) =>
        sum + (point.value[0]?.intVal || 0), 0
      );
    }

    return 0;
  }

  /**
   * HEART RATE DATA
   */

  /**
   * Get heart rate data for a period
   */
  async getHeartRateData(startTime: Date, endTime: Date): Promise<number[]> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/dataSources/` +
      `derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/` +
      `datasets/${startTime.getTime()}000000-${endTime.getTime()}000000`,
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      }
    );

    const data = await response.json();

    if (data.point) {
      return data.point.map((point: any) => point.value[0]?.fpVal || 0);
    }

    return [];
  }

  /**
   * Get average heart rate for the day
   */
  async getDailyAverageHeartRate(date?: Date): Promise<number> {
    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const heartRates = await this.getHeartRateData(startTime, endTime);

    if (heartRates.length === 0) return 0;

    const sum = heartRates.reduce((a, b) => a + b, 0);
    return Math.round(sum / heartRates.length);
  }

  /**
   * SLEEP DATA
   */

  /**
   * Get sleep sessions
   */
  async getSleepSessions(startDate: Date, endDate: Date): Promise<SleepSession[]> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/sessions?` +
      `startTime=${startDate.toISOString()}&` +
      `endTime=${endDate.toISOString()}&` +
      `activityType=72`, // 72 = sleep
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      }
    );

    const data = await response.json();

    if (!data.session) return [];

    return data.session.map((session: any) => {
      const duration = (session.endTimeMillis - session.startTimeMillis) / 1000 / 60;

      return {
        id: session.id,
        startTime: new Date(parseInt(session.startTimeMillis)).toISOString(),
        endTime: new Date(parseInt(session.endTimeMillis)).toISOString(),
        duration,
        stages: this.estimateSleepStages(duration),
        quality: this.calculateSleepQuality(duration)
      };
    });
  }

  /**
   * WORKOUT SESSIONS
   */

  /**
   * Get workout sessions
   */
  async getWorkoutSessions(startDate: Date, endDate: Date): Promise<WorkoutSession[]> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/sessions?` +
      `startTime=${startDate.toISOString()}&` +
      `endTime=${endDate.toISOString()}`,
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      }
    );

    const data = await response.json();

    if (!data.session) return [];

    return data.session
      .filter((session: any) => session.activityType !== 72) // Exclude sleep
      .map((session: any) => ({
        id: session.id,
        activityType: this.getActivityName(session.activityType),
        startTime: new Date(parseInt(session.startTimeMillis)).toISOString(),
        endTime: new Date(parseInt(session.endTimeMillis)).toISOString(),
        duration: (session.endTimeMillis - session.startTimeMillis) / 1000 / 60,
        calories: 0, // Would need to fetch from session details
        distance: 0
      }));
  }

  /**
   * BODY DATA
   */

  /**
   * Get weight data
   */
  async getWeight(date?: Date): Promise<number | null> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const targetDate = date || new Date();
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);

    const response = await fetch(
      `${this.baseUrl}/dataSources/` +
      `derived:com.google.weight:com.google.android.gms:merge_weight/` +
      `datasets/${startTime.getTime()}000000-${endTime.getTime()}000000`,
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      }
    );

    const data = await response.json();

    if (data.point && data.point.length > 0) {
      // Get the most recent weight entry
      const latestPoint = data.point[data.point.length - 1];
      return latestPoint.value[0]?.fpVal || null;
    }

    return null;
  }

  /**
   * COMPREHENSIVE DASHBOARD DATA
   */

  /**
   * Get complete fitness data for dashboard
   */
  async getDashboardData(date?: Date): Promise<FitnessData> {
    const [steps, calories, distance, activeMinutes, heartRate, weight] =
      await Promise.all([
        this.getDailySteps(date),
        this.getDailyCalories(date),
        this.getDailyDistance(date),
        this.getDailyActiveMinutes(date),
        this.getDailyAverageHeartRate(date),
        this.getWeight(date)
      ]);

    return {
      steps,
      calories: Math.round(calories),
      distance: Math.round(distance),
      activeMinutes,
      heartRate: heartRate > 0 ? [heartRate] : undefined,
      weight: weight || undefined
    };
  }

  /**
   * Get sleep data for last night
   */
  async getLastNightSleep(): Promise<SleepSession | null> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0); // Start from 6 PM yesterday
    today.setHours(12, 0, 0, 0); // Until noon today

    const sessions = await this.getSleepSessions(yesterday, today);
    return sessions.length > 0 ? sessions[0] : null;
  }

  /**
   * PIXEL WATCH INTEGRATION
   */

  /**
   * Get real-time data from Pixel Watch
   */
  async getPixelWatchData(): Promise<{
    heartRate: number;
    steps: number;
    calories: number;
  }> {
    // Get current day data
    const data = await this.getDashboardData();
    const currentHR = await this.getDailyAverageHeartRate();

    return {
      heartRate: currentHR,
      steps: data.steps,
      calories: data.calories
    };
  }

  /**
   * SPOON THEORY AUTOMATION
   * Calculate energy level based on activity
   */
  async calculateEnergySpoons(): Promise<{
    totalSpoons: number;
    usedSpoons: number;
    remainingSpoons: number;
    recommendation: string;
  }> {
    const data = await this.getDashboardData();

    // Base spoons (default 12 for chronic illness management)
    const totalSpoons = 12;

    // Calculate spoons used based on activity
    const stepsSpoons = Math.min(4, (data.steps / 10000) * 4); // Max 4 spoons for steps
    const activeSpoons = Math.min(3, (data.activeMinutes / 60) * 3); // Max 3 for activity
    const caloriesSpoons = Math.min(3, (data.calories / 2000) * 3); // Max 3 for calories

    const usedSpoons = Math.round(stepsSpoons + activeSpoons + caloriesSpoons);
    const remainingSpoons = Math.max(0, totalSpoons - usedSpoons);

    let recommendation = '';
    if (remainingSpoons <= 2) {
      recommendation = '⚠️ Low energy - prioritize rest';
    } else if (remainingSpoons <= 5) {
      recommendation = '✅ Moderate energy - gentle activities okay';
    } else {
      recommendation = '💪 Good energy - normal activities fine';
    }

    return {
      totalSpoons,
      usedSpoons,
      remainingSpoons,
      recommendation
    };
  }

  /**
   * HELPER METHODS
   */

  private estimateSleepStages(totalMinutes: number) {
    // Rough estimation based on typical sleep cycles
    return {
      awake: Math.round(totalMinutes * 0.05),
      light: Math.round(totalMinutes * 0.50),
      deep: Math.round(totalMinutes * 0.25),
      rem: Math.round(totalMinutes * 0.20)
    };
  }

  private calculateSleepQuality(minutes: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (minutes < 300) return 'poor';      // < 5 hours
    if (minutes < 420) return 'fair';      // 5-7 hours
    if (minutes < 540) return 'good';      // 7-9 hours
    return 'excellent';                     // 9+ hours
  }

  private getActivityName(activityType: number): string {
    const activities: { [key: number]: string } = {
      1: 'Biking',
      7: 'Walking',
      8: 'Running',
      9: 'Aerobics',
      10: 'Badminton',
      11: 'Baseball',
      12: 'Basketball',
      72: 'Sleep',
      82: 'Strength Training',
      96: 'Yoga'
    };
    return activities[activityType] || `Activity ${activityType}`;
  }
}

// Singleton instance
export const googleFitService = new GoogleFitService();
export default googleFitService;

/**
 * AUTOMATION ENGINE - CRON-BASED JOB SCHEDULER
 * Handles recurring jobs, time-based conditions, and action execution
 */

import { CronJob } from 'cron';
import { z } from 'zod';

// Job schema validation
export const JobSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  schedule: z.string(), // Cron expression
  action: z.string(), // Action type
  params: z.record(z.any()).optional(),
  enabled: z.boolean().default(true),
  timeWindow: z.object({
    start: z.number().min(0).max(23).optional(), // Hour (0-23)
    end: z.number().min(0).max(23).optional(),
  }).optional(),
  conditions: z.object({
    energyLevel: z.enum(['low', 'medium', 'high']).optional(),
    painLevel: z.number().min(0).max(10).optional(),
    weather: z.enum(['sunny', 'cloudy', 'stormy']).optional(),
  }).optional(),
  category: z.enum([
    'health',
    'caregivers',
    'mental-health',
    'home',
    'relationships',
    'advocacy'
  ]).optional(),
  tags: z.array(z.string()).optional(),
});

export type AutomationJob = z.infer<typeof JobSchema>;

export interface JobExecution {
  jobId: string;
  timestamp: Date;
  success: boolean;
  error?: string;
  duration?: number;
}

export class AutomationEngine {
  private static instance: AutomationEngine;
  private jobs: Map<string, CronJob> = new Map();
  private jobConfigs: Map<string, AutomationJob> = new Map();
  private executionLog: JobExecution[] = [];
  private isRunning: boolean = false;

  private constructor() {
    this.loadJobs();
  }

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  /**
   * Load jobs from storage/config
   */
  private async loadJobs() {
    // In production, load from database or config file
    // For now, load built-in automation templates
    const templates = await import('../templates/AutomationTemplates');

    for (const job of templates.AUTOMATION_TEMPLATES) {
      try {
        const validated = JobSchema.parse(job);
        this.jobConfigs.set(validated.id, validated);
      } catch (error) {
        console.error(`Invalid job config: ${job.id}`, error);
      }
    }
  }

  /**
   * Start the automation engine
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Automation engine already running');
      return;
    }

    console.log('🚀 Starting Automation Engine...');

    for (const [id, config] of this.jobConfigs.entries()) {
      if (config.enabled) {
        this.scheduleJob(config);
      }
    }

    this.isRunning = true;
    console.log(`✅ Automation Engine started with ${this.jobs.size} active jobs`);
  }

  /**
   * Stop the automation engine
   */
  stop() {
    console.log('🛑 Stopping Automation Engine...');

    for (const [id, job] of this.jobs.entries()) {
      job.stop();
    }

    this.jobs.clear();
    this.isRunning = false;
    console.log('✅ Automation Engine stopped');
  }

  /**
   * Schedule a single job
   */
  private scheduleJob(config: AutomationJob) {
    try {
      const job = new CronJob(
        config.schedule,
        async () => {
          await this.executeJob(config);
        },
        null,
        true,
        'America/New_York' // Adjust timezone as needed
      );

      this.jobs.set(config.id, job);
      console.log(`✅ Scheduled: ${config.name} (${config.schedule})`);
    } catch (error) {
      console.error(`❌ Failed to schedule ${config.name}:`, error);
    }
  }

  /**
   * Execute a job with all checks and error handling
   */
  private async executeJob(config: AutomationJob) {
    const startTime = Date.now();

    console.log(`▶️ Executing: ${config.name}`);

    // Check time window
    if (config.timeWindow) {
      const now = new Date();
      const hour = now.getHours();

      if (config.timeWindow.start !== undefined && hour < config.timeWindow.start) {
        console.log(`⏰ Outside time window (too early): ${config.name}`);
        return;
      }

      if (config.timeWindow.end !== undefined && hour >= config.timeWindow.end) {
        console.log(`⏰ Outside time window (too late): ${config.name}`);
        return;
      }
    }

    // Check conditions (energy, pain, weather)
    if (config.conditions) {
      const conditionsMet = await this.checkConditions(config.conditions);
      if (!conditionsMet) {
        console.log(`⚠️ Conditions not met: ${config.name}`);
        return;
      }
    }

    // Execute the action
    try {
      const actionModule = await import(`../actions/${config.action}`);
      const result = await actionModule.execute(config.params || {});

      const duration = Date.now() - startTime;

      this.logExecution({
        jobId: config.id,
        timestamp: new Date(),
        success: true,
        duration,
      });

      console.log(`✅ Success: ${config.name} (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;

      this.logExecution({
        jobId: config.id,
        timestamp: new Date(),
        success: false,
        error: error.message,
        duration,
      });

      console.error(`❌ Failed: ${config.name}`, error);

      // Retry logic could go here
    }
  }

  /**
   * Check if conditions are met for job execution
   */
  private async checkConditions(conditions: AutomationJob['conditions']): Promise<boolean> {
    // In production, fetch real sensor data
    // For now, always return true

    if (conditions?.energyLevel) {
      // const currentEnergy = await this.getEnergyLevel();
      // if (currentEnergy !== conditions.energyLevel) return false;
    }

    if (conditions?.painLevel !== undefined) {
      // const currentPain = await this.getPainLevel();
      // if (currentPain > conditions.painLevel) return false;
    }

    if (conditions?.weather) {
      // const currentWeather = await this.getBodyWeather();
      // if (currentWeather !== conditions.weather) return false;
    }

    return true;
  }

  /**
   * Log job execution
   */
  private logExecution(execution: JobExecution) {
    this.executionLog.push(execution);

    // Keep only last 1000 executions
    if (this.executionLog.length > 1000) {
      this.executionLog = this.executionLog.slice(-1000);
    }

    // In production, also log to Notion or database
  }

  /**
   * Add a new job
   */
  async addJob(config: AutomationJob) {
    const validated = JobSchema.parse(config);
    this.jobConfigs.set(validated.id, validated);

    if (validated.enabled && this.isRunning) {
      this.scheduleJob(validated);
    }

    console.log(`➕ Added job: ${validated.name}`);
  }

  /**
   * Remove a job
   */
  removeJob(id: string) {
    const job = this.jobs.get(id);
    if (job) {
      job.stop();
      this.jobs.delete(id);
    }

    this.jobConfigs.delete(id);
    console.log(`➖ Removed job: ${id}`);
  }

  /**
   * Enable/disable a job
   */
  toggleJob(id: string, enabled: boolean) {
    const config = this.jobConfigs.get(id);
    if (!config) return;

    config.enabled = enabled;

    if (enabled && this.isRunning) {
      this.scheduleJob(config);
    } else if (!enabled) {
      const job = this.jobs.get(id);
      if (job) {
        job.stop();
        this.jobs.delete(id);
      }
    }

    console.log(`${enabled ? '✅' : '⏸️'} ${enabled ? 'Enabled' : 'Disabled'}: ${config.name}`);
  }

  /**
   * Get execution log
   */
  getExecutionLog(limit: number = 100): JobExecution[] {
    return this.executionLog.slice(-limit);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): AutomationJob[] {
    return Array.from(this.jobConfigs.values());
  }

  /**
   * Get jobs by category
   */
  getJobsByCategory(category: AutomationJob['category']): AutomationJob[] {
    return Array.from(this.jobConfigs.values()).filter(
      job => job.category === category
    );
  }

  /**
   * Get engine stats
   */
  getStats() {
    const totalJobs = this.jobConfigs.size;
    const activeJobs = this.jobs.size;
    const recentExecutions = this.executionLog.slice(-100);
    const successRate = recentExecutions.length > 0
      ? (recentExecutions.filter(e => e.success).length / recentExecutions.length) * 100
      : 0;

    return {
      totalJobs,
      activeJobs,
      isRunning: this.isRunning,
      successRate: successRate.toFixed(1) + '%',
      totalExecutions: this.executionLog.length,
      recentExecutions: recentExecutions.length,
    };
  }
}

import {
  HydrationLog,
  SodiumIntakeLog,
  DailyNutritionSummary,
  AlertRule,
} from '../models/HealthModels';

export class HydrationTrackingService {
  private hydrationLogs: HydrationLog[];
  private sodiumLogs: SodiumIntakeLog[];
  private dailySummaries: Map<string, DailyNutritionSummary>;
  private alertRules: Map<string, AlertRule>;

  // Default thresholds
  private readonly DEFAULT_MIN_FLUIDS_ML = 2000;
  private readonly DEFAULT_MAX_FLUIDS_ML = 4000;
  private readonly DEFAULT_MIN_SODIUM_MG = 4000;
  private readonly DEFAULT_MAX_SODIUM_MG = 8000;

  constructor() {
    this.hydrationLogs = [];
    this.sodiumLogs = [];
    this.dailySummaries = new Map();
    this.alertRules = new Map();
    this.initializeDefaultAlerts();
  }

  private initializeDefaultAlerts(): void {
    // Default alert rules
    const defaultRules: Partial<AlertRule>[] = [
      {
        type: 'sodium',
        condition: 'sodium < 4000',
        message: '⚠️ Salt intake low. Aim ≥ 4,000 mg today.',
        severity: 'warning',
        enabled: true,
      },
      {
        type: 'hydration',
        condition: 'fluids < 2000',
        message: '💧 Fluids low. Aim for 2–3L/day + electrolytes.',
        severity: 'warning',
        enabled: true,
      },
      {
        type: 'hydration',
        condition: 'fluids > 4000',
        message: '💧 Fluid intake very high. Monitor for overhydration.',
        severity: 'info',
        enabled: true,
      },
    ];

    defaultRules.forEach((rule, index) => {
      this.alertRules.set(`default-${index}`, {
        id: `default-${index}`,
        userId: 'system',
        ...rule,
      } as AlertRule);
    });
  }

  // Hydration Logging
  async logHydration(log: HydrationLog): Promise<HydrationLog> {
    this.hydrationLogs.push(log);
    await this.updateDailySummary(log.userId, log.logged_at);
    return log;
  }

  async logSodiumIntake(log: SodiumIntakeLog): Promise<SodiumIntakeLog> {
    this.sodiumLogs.push(log);
    await this.updateDailySummary(log.userId, log.logged_at);
    return log;
  }

  private async updateDailySummary(userId: string, date: Date): Promise<void> {
    const dateKey = this.getDateKey(userId, date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Calculate totals for the day
    const dayHydrationLogs = this.hydrationLogs.filter(
      (log) =>
        log.userId === userId &&
        log.logged_at >= startOfDay &&
        log.logged_at <= endOfDay
    );

    const daySodiumLogs = this.sodiumLogs.filter(
      (log) =>
        log.userId === userId &&
        log.logged_at >= startOfDay &&
        log.logged_at <= endOfDay
    );

    const total_fluids_ml = dayHydrationLogs.reduce(
      (sum, log) => sum + log.volume_ml,
      0
    );

    const sodium_from_hydration = dayHydrationLogs.reduce(
      (sum, log) => sum + log.sodium_mg,
      0
    );

    const sodium_from_intake = daySodiumLogs.reduce(
      (sum, log) => sum + log.sodium_mg,
      0
    );

    const total_sodium_mg = sodium_from_hydration + sodium_from_intake;

    const electrolyte_packet_count = dayHydrationLogs.filter(
      (log) =>
        log.source === 'electrolyte_drink' ||
        log.source === 'pedialyte' ||
        log.source === 'LMNT' ||
        log.source === 'nuun'
    ).length;

    // Check thresholds
    const below_min =
      total_fluids_ml < this.DEFAULT_MIN_FLUIDS_ML ||
      total_sodium_mg < this.DEFAULT_MIN_SODIUM_MG;

    const above_max =
      total_fluids_ml > this.DEFAULT_MAX_FLUIDS_ML ||
      total_sodium_mg > this.DEFAULT_MAX_SODIUM_MG;

    // Trigger alerts
    const alerts_triggered = this.checkAlerts(total_fluids_ml, total_sodium_mg);

    const summary: DailyNutritionSummary = {
      id: dateKey,
      userId,
      date: startOfDay,
      total_fluids_ml,
      total_sodium_mg,
      electrolyte_packet_count,
      below_min,
      above_max,
      alerts_triggered,
    };

    this.dailySummaries.set(dateKey, summary);

    // Log alerts
    if (alerts_triggered.length > 0) {
      console.log(`[${userId}] Daily nutrition alerts:`, alerts_triggered);
    }
  }

  private checkAlerts(fluids_ml: number, sodium_mg: number): string[] {
    const triggered: string[] = [];
    const activeRules = Array.from(this.alertRules.values()).filter((r) => r.enabled);

    for (const rule of activeRules) {
      let shouldTrigger = false;

      if (rule.type === 'hydration') {
        if (rule.condition.includes('< ')) {
          const threshold = parseInt(rule.condition.split('< ')[1]);
          shouldTrigger = fluids_ml < threshold;
        } else if (rule.condition.includes('> ')) {
          const threshold = parseInt(rule.condition.split('> ')[1]);
          shouldTrigger = fluids_ml > threshold;
        }
      } else if (rule.type === 'sodium') {
        if (rule.condition.includes('< ')) {
          const threshold = parseInt(rule.condition.split('< ')[1]);
          shouldTrigger = sodium_mg < threshold;
        } else if (rule.condition.includes('> ')) {
          const threshold = parseInt(rule.condition.split('> ')[1]);
          shouldTrigger = sodium_mg > threshold;
        }
      }

      if (shouldTrigger) {
        triggered.push(rule.message);
      }
    }

    return triggered;
  }

  private getDateKey(userId: string, date: Date): string {
    return `${userId}-${date.toISOString().split('T')[0]}`;
  }

  // Retrieval Methods
  async getDailySummary(userId: string, date: Date): Promise<DailyNutritionSummary | undefined> {
    const dateKey = this.getDateKey(userId, date);
    return this.dailySummaries.get(dateKey);
  }

  async getHydrationLogs(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<HydrationLog[]> {
    let logs = this.hydrationLogs.filter((log) => log.userId === userId);

    if (dateRange) {
      logs = logs.filter(
        (log) =>
          log.logged_at >= dateRange.start && log.logged_at <= dateRange.end
      );
    }

    return logs.sort((a, b) => b.logged_at.getTime() - a.logged_at.getTime());
  }

  async getSodiumLogs(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<SodiumIntakeLog[]> {
    let logs = this.sodiumLogs.filter((log) => log.userId === userId);

    if (dateRange) {
      logs = logs.filter(
        (log) =>
          log.logged_at >= dateRange.start && log.logged_at <= dateRange.end
      );
    }

    return logs.sort((a, b) => b.logged_at.getTime() - a.logged_at.getTime());
  }

  async getWeeklySummary(userId: string): Promise<{
    avg_fluids_ml: number;
    avg_sodium_mg: number;
    days_below_target: number;
    days_above_target: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const summaries: DailyNutritionSummary[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const summary = await this.getDailySummary(userId, new Date(d));
      if (summary) {
        summaries.push(summary);
      }
    }

    if (summaries.length === 0) {
      return {
        avg_fluids_ml: 0,
        avg_sodium_mg: 0,
        days_below_target: 0,
        days_above_target: 0,
      };
    }

    const avg_fluids_ml =
      summaries.reduce((sum, s) => sum + s.total_fluids_ml, 0) / summaries.length;
    const avg_sodium_mg =
      summaries.reduce((sum, s) => sum + s.total_sodium_mg, 0) / summaries.length;
    const days_below_target = summaries.filter((s) => s.below_min).length;
    const days_above_target = summaries.filter((s) => s.above_max).length;

    return {
      avg_fluids_ml,
      avg_sodium_mg,
      days_below_target,
      days_above_target,
    };
  }

  // Alert Management
  async addAlertRule(rule: AlertRule): Promise<AlertRule> {
    this.alertRules.set(rule.id, rule);
    return rule;
  }

  async getUserAlertRules(userId: string): Promise<AlertRule[]> {
    return Array.from(this.alertRules.values()).filter(
      (r) => r.userId === userId || r.userId === 'system'
    );
  }
}

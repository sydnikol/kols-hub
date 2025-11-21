/**
 * React Hooks for AI Life Manager
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { aiLifeManager } from '../services/aiLifeManager';
import type {
  AIInsight,
  AIRole,
  DailyReport,
  CrisisDetection,
  HealthCorrelation,
  RoleId
} from '../services/aiLifeManager';

// ============================================================================
// useAIManager - Main hook for AI Life Manager
// ============================================================================

export function useAIManager() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    loadInsights();
    loadDailyReport();

    // Subscribe to insight updates
    const handleInsightsUpdate = (newInsights: AIInsight[]) => {
      setInsights(newInsights);
    };

    aiLifeManager.on('insights:updated', handleInsightsUpdate);

    return () => {
      aiLifeManager.off('insights:updated', handleInsightsUpdate);
    };
  }, []);

  const loadInsights = async () => {
    try {
      const insights = await aiLifeManager.generateInsights();
      setInsights(insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyReport = async () => {
    try {
      const report = await aiLifeManager.generateDailyReport();
      setDailyReport(report);
    } catch (error) {
      console.error('Failed to load daily report:', error);
    }
  };

  const dismissInsight = useCallback((insightId: string) => {
    aiLifeManager.dismissInsight(insightId);
    setInsights(prev => prev.filter(i => i.id !== insightId));
  }, []);

  const refreshInsights = useCallback(async () => {
    setLoading(true);
    await loadInsights();
  }, []);

  const refreshDailyReport = useCallback(async () => {
    await loadDailyReport();
  }, []);

  const recordFeedback = useCallback((insightId: string, rating: number) => {
    aiLifeManager.recordFeedback(insightId, rating);
  }, []);

  return {
    insights,
    dailyReport,
    loading,
    dismissInsight,
    refreshInsights,
    refreshDailyReport,
    recordFeedback
  };
}

// ============================================================================
// useAIInsights - Hook for specific types of insights
// ============================================================================

export function useAIInsights(filters?: {
  role?: RoleId;
  type?: AIInsight['type'];
  priority?: AIInsight['priority'];
}) {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    loadFilteredInsights();

    const handleUpdate = (newInsights: AIInsight[]) => {
      loadFilteredInsights();
    };

    aiLifeManager.on('insights:updated', handleUpdate);

    return () => {
      aiLifeManager.off('insights:updated', handleUpdate);
    };
  }, [filters]);

  const loadFilteredInsights = async () => {
    const allInsights = await aiLifeManager.generateInsights();

    let filtered = allInsights;

    if (filters?.role) {
      filtered = filtered.filter(i => i.role === filters.role);
    }

    if (filters?.type) {
      filtered = filtered.filter(i => i.type === filters.type);
    }

    if (filters?.priority) {
      filtered = filtered.filter(i => i.priority === filters.priority);
    }

    setInsights(filtered);
  };

  return insights;
}

// ============================================================================
// useAIRoles - Manage AI roles
// ============================================================================

export function useAIRoles() {
  const [roles, setRoles] = useState<AIRole[]>([]);

  useEffect(() => {
    setRoles(aiLifeManager.getRoles());
  }, []);

  const toggleRole = useCallback((roleId: RoleId, active: boolean) => {
    aiLifeManager.toggleRole(roleId, active);
    setRoles(aiLifeManager.getRoles());
  }, []);

  const getRole = useCallback((roleId: RoleId) => {
    return aiLifeManager.getRole(roleId);
  }, []);

  const activeRoles = useMemo(() => {
    return roles.filter(r => r.active);
  }, [roles]);

  const inactiveRoles = useMemo(() => {
    return roles.filter(r => !r.active);
  }, [roles]);

  return {
    roles,
    activeRoles,
    inactiveRoles,
    toggleRole,
    getRole
  };
}

// ============================================================================
// useCrisisDetection - Monitor for crisis situations
// ============================================================================

export function useCrisisDetection() {
  const [crisis, setCrisis] = useState<CrisisDetection | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    checkCrisis();

    // Listen for crisis events
    const handleCrisisDetected = (detectedCrisis: CrisisDetection) => {
      setCrisis(detectedCrisis);
    };

    aiLifeManager.on('crisis:detected', handleCrisisDetected);

    return () => {
      aiLifeManager.off('crisis:detected', handleCrisisDetected);
    };
  }, []);

  const checkCrisis = async () => {
    setMonitoring(true);
    try {
      const result = await aiLifeManager.detectCrisis();
      setCrisis(result);
    } catch (error) {
      console.error('Crisis detection failed:', error);
    } finally {
      setMonitoring(false);
    }
  };

  return {
    crisis,
    monitoring,
    checkCrisis
  };
}

// ============================================================================
// useHealthCorrelations - Analyze health data correlations
// ============================================================================

export function useHealthCorrelations() {
  const [correlations, setCorrelations] = useState<HealthCorrelation[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeCorrelations = async () => {
    setAnalyzing(true);
    try {
      const results = await aiLifeManager.analyzeHealthCorrelations();
      setCorrelations(results);
    } catch (error) {
      console.error('Correlation analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeCorrelations();
  }, []);

  return {
    correlations,
    analyzing,
    refresh: analyzeCorrelations
  };
}

// ============================================================================
// useDailyReport - Get daily intelligence report
// ============================================================================

export function useDailyReport() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const dailyReport = await aiLifeManager.generateDailyReport();
      setReport(dailyReport);
    } catch (error) {
      console.error('Failed to load daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return {
    report,
    loading,
    refresh: loadReport
  };
}

// ============================================================================
// useAIEventBus - Subscribe to AI events
// ============================================================================

export function useAIEventBus(event: string, callback: (data: any) => void) {
  useEffect(() => {
    aiLifeManager.on(event, callback);

    return () => {
      aiLifeManager.off(event, callback);
    };
  }, [event, callback]);
}

// ============================================================================
// useAINotifications - Get real-time AI notifications
// ============================================================================

export function useAINotifications() {
  const [notifications, setNotifications] = useState<AIInsight[]>([]);

  useEffect(() => {
    // Get existing insights
    const existing = aiLifeManager.getActiveInsights();
    setNotifications(existing.filter(i => i.priority === 'high' || i.priority === 'urgent'));

    // Listen for new high-priority insights
    const handleInsights = (insights: AIInsight[]) => {
      const highPriority = insights.filter(i => i.priority === 'high' || i.priority === 'urgent');
      setNotifications(prev => [...prev, ...highPriority]);
    };

    aiLifeManager.on('insights:updated', handleInsights);

    return () => {
      aiLifeManager.off('insights:updated', handleInsights);
    };
  }, []);

  const dismiss = useCallback((notificationId: string) => {
    aiLifeManager.dismissInsight(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const dismissAll = useCallback(() => {
    notifications.forEach(n => aiLifeManager.dismissInsight(n.id));
    setNotifications([]);
  }, [notifications]);

  return {
    notifications,
    dismiss,
    dismissAll,
    count: notifications.length
  };
}

// ============================================================================
// useAILearning - Access AI learning data
// ============================================================================

export function useAILearning() {
  const [learningData, setLearningData] = useState(aiLifeManager.getLearningData());

  useEffect(() => {
    // Refresh learning data periodically
    const interval = setInterval(() => {
      setLearningData(aiLifeManager.getLearningData());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return learningData;
}

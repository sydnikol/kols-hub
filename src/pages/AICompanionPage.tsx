import React, { useState, useEffect } from 'react';
import { Heart, Brain, TrendingUp, AlertCircle, CheckCircle, Star, Sparkles, Activity, DollarSign, Target, Clock, Smile, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import aiEngine from '../services/ai-automation-engine';
import { appPluginSystem } from '../services/app-integration-plugins';
import { crossPlatformSync } from '../services/cross-platform-sync';
import { maxAutomation } from '../services/max-automation';

/**
 * AI Personal Companion
 *
 * Your all-in-one intelligent assistant that acts as:
 * - Personal Assistant: Manages your schedule, tasks, and reminders
 * - Health Aide: Monitors your wellbeing, habits, and health metrics
 * - Partner: Supports your goals and celebrates your wins
 * - Nurse: Tracks medications, symptoms, and health appointments
 * - Manager: Optimizes your time, finances, and productivity
 */

const AICompanionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'health' | 'care' | 'automation'>('dashboard');
  const [insights, setInsights] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [companionMessage, setCompanionMessage] = useState('');

  useEffect(() => {
    // Start all automation systems
    console.log('🤖 Initializing AI systems...');
    appPluginSystem.start();
    crossPlatformSync.start();
    maxAutomation.start();

    loadInsights();
    analyzeHealthStatus();
    generateCompanionMessage();

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      loadInsights();
      analyzeHealthStatus();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      appPluginSystem.stop();
      crossPlatformSync.stop();
      maxAutomation.stop();
    };
  }, []);

  const loadInsights = () => {
    const allInsights = aiEngine.getInsights();
    setInsights(allInsights);
  };

  const analyzeHealthStatus = () => {
    // Analyze across all health-related features
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const wellnessActivities = JSON.parse(localStorage.getItem('wellnessActivities') || '[]');
    const sleepData = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');

    const today = new Date().toISOString().split('T')[0];
    const completedHabitsToday = habits.filter((h: any) =>
      h.completedDates.includes(today)
    ).length;

    const avgMood = wellnessActivities.length > 0
      ? wellnessActivities.reduce((sum: any, a: any) => sum + a.mood, 0) / wellnessActivities.length
      : 0;

    const missedMeds = medications.filter((m: any) =>
      m.active && !m.takenToday
    ).length;

    setHealthStatus({
      habitsComplete: completedHabitsToday,
      totalHabits: habits.length,
      avgMood: avgMood.toFixed(1),
      missedMedications: missedMeds,
      overallScore: calculateHealthScore(completedHabitsToday, habits.length, avgMood, missedMeds)
    });
  };

  const calculateHealthScore = (completed: number, total: number, mood: number, missed: number): number => {
    const habitScore = total > 0 ? (completed / total) * 40 : 0;
    const moodScore = (mood / 5) * 40;
    const medScore = missed === 0 ? 20 : Math.max(0, 20 - (missed * 5));
    return Math.round(habitScore + moodScore + medScore);
  };

  const generateCompanionMessage = () => {
    const hour = new Date().getHours();
    const messages = {
      morning: [
        "Good morning! I've prepared your day. You have great potential today - let's make it count! ☀️",
        "Rise and shine! I've analyzed your schedule and you're set up for success. I'm here to support you every step.",
        "Morning! Your health metrics look good. I've prioritized your tasks - let's tackle the important stuff first!"
      ],
      afternoon: [
        "How's your day going? I'm monitoring your progress and you're doing well. Stay hydrated and take breaks!",
        "Afternoon check-in! You've completed several tasks. I'm proud of your consistency. Keep it up!",
        "Hi there! I've been optimizing your schedule. You have some breathing room later - perfect for self-care."
      ],
      evening: [
        "Evening! Let's review your day together. You've accomplished a lot. Time to wind down and recharge.",
        "Great work today! I've prepared your evening routine. Remember, rest is productive too.",
        "Your day was productive! I've set up tomorrow for you. For now, focus on relaxation and wellness."
      ],
      night: [
        "It's getting late. I care about your sleep health - consider winding down soon for optimal rest.",
        "Night owl mode detected! I respect your rhythm, but don't forget your body needs rest to be amazing tomorrow.",
        "Late night productivity? I admire your drive, but quality sleep helps you perform better. I'm here if you need me."
      ]
    };

    let timeOfDay: keyof typeof messages;
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const messageArray = messages[timeOfDay];
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    setCompanionMessage(randomMessage);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'high': return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'medium': return <Activity className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'achievement': return <Star className="w-5 h-5 text-yellow-500" />;
      default: return <Brain className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'finance': return <DollarSign className="w-4 h-4" />;
      case 'personal': return <Target className="w-4 h-4" />;
      case 'productivity': return <Clock className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const dismissInsight = (id: string) => {
    aiEngine.dismissInsight(id);
    loadInsights();
    toast.success('Insight dismissed');
  };

  const proactiveCareChecks = [
    {
      id: 'hydration',
      title: 'Stay Hydrated',
      description: 'Drink water regularly throughout the day',
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      status: 'active'
    },
    {
      id: 'posture',
      title: 'Posture Check',
      description: 'Sit up straight and stretch your shoulders',
      icon: <Shield className="w-5 h-5 text-green-500" />,
      status: 'active'
    },
    {
      id: 'eye-rest',
      title: '20-20-20 Rule',
      description: 'Every 20 min, look 20 feet away for 20 seconds',
      icon: <Activity className="w-5 h-5 text-purple-500" />,
      status: 'active'
    },
    {
      id: 'movement',
      title: 'Move Your Body',
      description: 'Stand up and walk around every hour',
      icon: <Activity className="w-5 h-5 text-orange-500" />,
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20">
      {/* Header with AI Companion Greeting */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Your AI Companion</h1>
            <p className="text-sm opacity-90">Personal Assistant • Health Aide • Partner • Manager</p>
          </div>
        </div>

        {/* Personal Message */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Smile className="w-6 h-6 flex-shrink-0 mt-1" />
            <p className="text-white">{companionMessage}</p>
          </div>
        </div>

        {/* Quick Health Status */}
        {healthStatus && (
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xl font-bold">{healthStatus.overallScore}%</div>
              <div className="text-xs opacity-90">Health</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xl font-bold">{healthStatus.habitsComplete}/{healthStatus.totalHabits}</div>
              <div className="text-xs opacity-90">Habits</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Smile className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xl font-bold">{healthStatus.avgMood}/5</div>
              <div className="text-xs opacity-90">Mood</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Activity className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xl font-bold">{insights.length}</div>
              <div className="text-xs opacity-90">Insights</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Brain },
            { id: 'insights', label: 'AI Insights', icon: Sparkles },
            { id: 'health', label: 'Health Care', icon: Heart },
            { id: 'care', label: 'Proactive Care', icon: Shield },
            { id: 'automation', label: 'Automation', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Today's Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Overall Well-being Score</span>
                  <span className="font-bold text-2xl text-purple-600">{healthStatus?.overallScore || 0}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Active Insights</span>
                  <span className="font-bold text-lg">{insights.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Automation Rules Active</span>
                  <span className="font-bold text-lg">{aiEngine.getRules().filter(r => r.enabled).length}</span>
                </div>
              </div>
            </div>

            {/* Priority Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Priority Actions
              </h3>
              <div className="space-y-3">
                {insights.filter(i => i.priority === 'high' || i.priority === 'critical').slice(0, 3).map(insight => (
                  <div key={insight.id} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    {getPriorityIcon(insight.priority)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
                {insights.filter(i => i.priority === 'high' || i.priority === 'critical').length === 0 && (
                  <p className="text-gray-500 text-center py-4">No urgent actions - you're doing great! ⭐</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500 opacity-50" />
                <p className="text-gray-500">I'm analyzing your data to provide personalized insights...</p>
                <p className="text-sm text-gray-400 mt-2">Check back in a few minutes!</p>
              </div>
            ) : (
              insights.map(insight => (
                <div key={insight.id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 flex items-center">
                            {getCategoryIcon(insight.category)}
                            <span className="ml-1">{insight.category}</span>
                          </span>
                        </div>
                        <p className="text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-900 mb-2">Suggested Actions:</p>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm text-purple-700 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                    <span>{new Date(insight.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Health Monitoring
              </h3>
              <div className="space-y-4">
                {healthStatus && (
                  <>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Overall Health Score</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                              style={{ width: `${healthStatus.overallScore}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-4 text-2xl font-bold text-green-600">{healthStatus.overallScore}%</span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        {healthStatus.overallScore >= 80 ? "Excellent! You're taking great care of yourself." :
                         healthStatus.overallScore >= 60 ? "Good progress! A few small improvements can boost this." :
                         "I'm here to help you improve. Let's work together on this."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Habits Completed</p>
                        <p className="text-2xl font-bold text-blue-600">{healthStatus.habitsComplete}/{healthStatus.totalHabits}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Average Mood</p>
                        <p className="text-2xl font-bold text-purple-600">{healthStatus.avgMood}/5</p>
                      </div>
                    </div>

                    {healthStatus.missedMedications > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
                        <h4 className="font-semibold text-red-900">Medication Reminder</h4>
                        <p className="text-sm text-red-700">
                          You have {healthStatus.missedMedications} medication(s) to take today.
                          Your health is important to me!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Proactive Care Reminders
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                I care about your wellbeing. Here are gentle reminders throughout your day:
              </p>
              <div className="space-y-3">
                {proactiveCareChecks.map(check => (
                  <div key={check.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {check.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{check.title}</h4>
                      <p className="text-sm text-gray-600">{check.description}</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Active Automation Rules
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These are the ways I'm working behind the scenes to make your life easier:
              </p>
              <div className="space-y-3">
                {aiEngine.getRules().filter(r => r.enabled).map(rule => (
                  <div key={rule.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Trigger: {rule.trigger.type} • Actions: {rule.actions.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Executed {rule.runCount} time{rule.runCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Enabled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICompanionPage;

/**
 * UI COMPONENT TEMPLATES
 * Pre-built templates for generating UI components with gothic/alt aesthetic
 */

export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'form' | 'dashboard' | 'tracker' | 'card' | 'list' | 'modal' | 'navigation';
  description: string;
  props: ComponentProp[];
  code: (props: Record<string, any>) => string;
  preview?: string;
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'color' | 'icon';
  default?: any;
  required?: boolean;
  description?: string;
  options?: string[];
}

// Form Templates
export const FORM_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'health-tracker-form',
    name: 'Health Tracker Form',
    category: 'form',
    description: 'Form for logging health data (vitals, meds, symptoms)',
    props: [
      { name: 'title', type: 'string', default: 'Health Log', required: true },
      { name: 'fields', type: 'array', default: ['BP', 'HR', 'O2'], required: true },
      { name: 'submitLabel', type: 'string', default: 'Save Entry' },
      { name: 'accentColor', type: 'color', default: 'purple' },
    ],
    code: (props) => `
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export const ${props.componentName || 'HealthTrackerForm'}: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your save logic here
  };

  return (
    <div className="bg-gradient-to-br from-${props.accentColor}-900/30 to-indigo-900/30 p-6 rounded-xl border border-${props.accentColor}-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-${props.accentColor}-400" />
        <h2 className="text-2xl font-bold text-white">${props.title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        ${props.fields.map((field: string) => `
        <div>
          <label className="block text-${props.accentColor}-300 mb-2 text-sm font-semibold">
            ${field}
          </label>
          <input
            type="text"
            value={formData.${field.toLowerCase()} || ''}
            onChange={(e) => setFormData({ ...formData, ${field.toLowerCase()}: e.target.value })}
            className="w-full bg-black/40 border border-${props.accentColor}-500/30 rounded-lg px-4 py-3 text-white placeholder-${props.accentColor}-400/50 focus:outline-none focus:border-${props.accentColor}-500/60 transition-colors"
            placeholder="Enter ${field}"
          />
        </div>`).join('\n        ')}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-${props.accentColor}-600 to-${props.accentColor}-700 hover:from-${props.accentColor}-500 hover:to-${props.accentColor}-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-${props.accentColor}-500/20"
        >
          ${props.submitLabel}
        </button>
      </form>
    </div>
  );
};
`,
  },
  {
    id: 'crisis-support-form',
    name: 'Crisis Support Form',
    category: 'form',
    description: 'Quick crisis support with grounding techniques',
    props: [
      { name: 'title', type: 'string', default: 'Crisis Support' },
      { name: 'techniques', type: 'array', default: ['5-4-3-2-1', 'Box Breath', 'Cold Water'] },
      { name: 'emergencyContact', type: 'string', default: '911' },
    ],
    code: (props) => `
import React, { useState } from 'react';
import { Shield, Phone } from 'lucide-react';

export const CrisisSupportForm: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState('');

  const techniques = ${JSON.stringify(props.techniques)};

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 p-6 rounded-xl border border-red-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">${props.title}</h2>
        </div>
        <a
          href="tel:${props.emergencyContact}"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-bold transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call ${props.emergencyContact}
        </a>
      </div>

      <div className="space-y-3">
        <p className="text-purple-300 mb-4">Choose a grounding technique:</p>
        {techniques.map((technique: string) => (
          <button
            key={technique}
            onClick={() => setSelectedTechnique(technique)}
            className={\`w-full text-left bg-black/40 hover:bg-purple-900/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white transition-all \${selectedTechnique === technique ? 'border-purple-500 bg-purple-900/40' : ''}\`}
          >
            {technique}
          </button>
        ))}
      </div>

      {selectedTechnique && (
        <div className="mt-6 p-4 bg-purple-900/40 rounded-lg border border-purple-500/30">
          <p className="text-purple-300 text-sm">
            Starting: <span className="font-bold text-white">{selectedTechnique}</span>
          </p>
        </div>
      )}
    </div>
  );
};
`,
  },
];

// Dashboard Templates
export const DASHBOARD_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'health-dashboard',
    name: 'Health Dashboard',
    category: 'dashboard',
    description: 'Comprehensive health metrics dashboard',
    props: [
      { name: 'title', type: 'string', default: 'Health Overview' },
      { name: 'metrics', type: 'array', default: ['BP', 'HR', 'O2', 'Hydration'] },
      { name: 'layout', type: 'string', default: '2-column', options: ['1-column', '2-column', '3-column', '4-column'] },
    ],
    code: (props) => `
import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplets, TrendingUp } from 'lucide-react';

interface MetricData {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

export const HealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', icon: Heart },
    { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', icon: Activity },
    { label: 'O2 Saturation', value: '98', unit: '%', trend: 'up', icon: TrendingUp },
    { label: 'Hydration', value: '2.4', unit: 'L', trend: 'down', icon: Droplets },
  ]);

  const gridCols = {
    '1-column': 'grid-cols-1',
    '2-column': 'grid-cols-1 md:grid-cols-2',
    '3-column': 'grid-cols-1 md:grid-cols-3',
    '4-column': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          ${props.title}
        </h1>

        <div className={\`grid \${gridCols['${props.layout}']} gap-6\`}>
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-purple-400" />
                  <span className={\`text-xs px-2 py-1 rounded \${
                    metric.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                    metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }\`}>
                    {metric.trend}
                  </span>
                </div>
                <h3 className="text-purple-300 text-sm mb-2">{metric.label}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{metric.value}</span>
                  <span className="text-purple-400 text-sm">{metric.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
`,
  },
];

// Tracker Templates
export const TRACKER_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    category: 'tracker',
    description: 'Daily habit tracking with streak counter',
    props: [
      { name: 'title', type: 'string', default: 'Daily Habits' },
      { name: 'habits', type: 'array', default: ['Meds', 'Hydration', 'Stretch', 'Journal'] },
      { name: 'showStreak', type: 'boolean', default: true },
    ],
    code: (props) => `
import React, { useState } from 'react';
import { CheckCircle, Circle, Flame } from 'lucide-react';

interface Habit {
  name: string;
  completed: boolean;
  streak: number;
}

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(
    ${JSON.stringify(props.habits)}.map(name => ({ name, completed: false, streak: 0 }))
  );

  const toggleHabit = (index: number) => {
    const updated = [...habits];
    updated[index].completed = !updated[index].completed;
    if (updated[index].completed) {
      updated[index].streak += 1;
    }
    setHabits(updated);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-6">${props.title}</h2>

      <div className="space-y-3">
        {habits.map((habit, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-black/40 hover:bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 transition-all cursor-pointer"
            onClick={() => toggleHabit(idx)}
          >
            <div className="flex items-center gap-3">
              {habit.completed ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <Circle className="w-6 h-6 text-purple-400" />
              )}
              <span className={\`text-white font-semibold \${habit.completed ? 'line-through opacity-60' : ''}\`}>
                {habit.name}
              </span>
            </div>

            ${props.showStreak ? `
            {habit.streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-bold">{habit.streak}</span>
              </div>
            )}
            ` : ''}
          </div>
        ))}
      </div>
    </div>
  );
};
`,
  },
];

// Card Templates
export const CARD_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'stat-card',
    name: 'Stat Card',
    category: 'card',
    description: 'Display key metric or statistic',
    props: [
      { name: 'title', type: 'string', default: 'Total Steps' },
      { name: 'value', type: 'string', default: '8,432' },
      { name: 'subtitle', type: 'string', default: 'Today' },
      { name: 'icon', type: 'icon', default: 'Activity' },
      { name: 'trend', type: 'string', default: 'up', options: ['up', 'down', 'stable'] },
    ],
    code: (props) => `
import React from 'react';
import { ${props.icon}, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard: React.FC = () => {
  const Icon = ${props.icon};

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-purple-400" />
        <span className={\`text-xs px-2 py-1 rounded flex items-center gap-1 \${
          '${props.trend}' === 'up' ? 'bg-green-500/20 text-green-400' :
          '${props.trend}' === 'down' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }\`}>
          {'${props.trend}' === 'up' && <TrendingUp className="w-3 h-3" />}
          {'${props.trend}' === 'down' && <TrendingDown className="w-3 h-3" />}
          {'${props.trend}' === 'stable' && <Minus className="w-3 h-3" />}
          {'${props.trend}'}
        </span>
      </div>
      <h3 className="text-purple-300 text-sm mb-2">${props.title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">${props.value}</span>
      </div>
      <p className="text-purple-400 text-xs mt-2">${props.subtitle}</p>
    </div>
  );
};
`,
  },
];

// List Templates
export const LIST_TEMPLATES: ComponentTemplate[] = [
  {
    id: 'medication-list',
    name: 'Medication List',
    category: 'list',
    description: 'List of medications with check-off',
    props: [
      { name: 'title', type: 'string', default: 'Today\'s Medications' },
      { name: 'medications', type: 'array', default: ['Morning Med 1', 'Morning Med 2', 'Evening Med 1'] },
      { name: 'showTime', type: 'boolean', default: true },
    ],
    code: (props) => `
import React, { useState } from 'react';
import { Pill, CheckCircle, Circle, Clock } from 'lucide-react';

interface Medication {
  name: string;
  time: string;
  taken: boolean;
}

export const MedicationList: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>(
    ${JSON.stringify(props.medications)}.map((name, idx) => ({
      name,
      time: idx < 2 ? '8:00 AM' : '8:00 PM',
      taken: false,
    }))
  );

  const toggleMed = (index: number) => {
    const updated = [...meds];
    updated[index].taken = !updated[index].taken;
    setMeds(updated);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Pill className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">${props.title}</h2>
      </div>

      <div className="space-y-3">
        {meds.map((med, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-black/40 hover:bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 transition-all cursor-pointer"
            onClick={() => toggleMed(idx)}
          >
            <div className="flex items-center gap-3">
              {med.taken ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <Circle className="w-6 h-6 text-purple-400" />
              )}
              <span className={\`text-white font-semibold \${med.taken ? 'line-through opacity-60' : ''}\`}>
                {med.name}
              </span>
            </div>

            ${props.showTime ? `
            <div className="flex items-center gap-2 text-purple-400 text-sm">
              <Clock className="w-4 h-4" />
              {med.time}
            </div>
            ` : ''}
          </div>
        ))}
      </div>
    </div>
  );
};
`,
  },
];

// All templates combined
export const ALL_TEMPLATES: ComponentTemplate[] = [
  ...FORM_TEMPLATES,
  ...DASHBOARD_TEMPLATES,
  ...TRACKER_TEMPLATES,
  ...CARD_TEMPLATES,
  ...LIST_TEMPLATES,
];

export const TEMPLATE_CATEGORIES = {
  form: FORM_TEMPLATES,
  dashboard: DASHBOARD_TEMPLATES,
  tracker: TRACKER_TEMPLATES,
  card: CARD_TEMPLATES,
  list: LIST_TEMPLATES,
};

export const CATEGORY_INFO = [
  { id: 'form', label: 'Forms', count: FORM_TEMPLATES.length, description: 'Data entry forms' },
  { id: 'dashboard', label: 'Dashboards', count: DASHBOARD_TEMPLATES.length, description: 'Metric overviews' },
  { id: 'tracker', label: 'Trackers', count: TRACKER_TEMPLATES.length, description: 'Habit & goal tracking' },
  { id: 'card', label: 'Cards', count: CARD_TEMPLATES.length, description: 'Info display cards' },
  { id: 'list', label: 'Lists', count: LIST_TEMPLATES.length, description: 'Item lists' },
];

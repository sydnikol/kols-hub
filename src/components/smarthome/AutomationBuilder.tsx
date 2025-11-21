/**
 * AUTOMATION BUILDER COMPONENT
 *
 * Visual automation builder with health data triggers
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Clock,
  Zap,
  Activity,
  MapPin,
  Sunrise,
  Sunset,
  Save,
  Play,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import type {
  Automation,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
  SmartThingsDevice,
  CapabilityType,
} from '../../services/smartThingsService';
import {
  getDevices,
  saveAutomation,
  updateAutomation,
  deleteAutomation,
  executeAutomation,
} from '../../services/smartThingsService';

interface AutomationBuilderProps {
  automation?: Automation;
  onSave?: (automation: Automation) => void;
  onCancel?: () => void;
}

export const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  automation,
  onSave,
  onCancel,
}) => {
  const [devices, setDevices] = useState<SmartThingsDevice[]>([]);
  const [name, setName] = useState(automation?.name || '');
  const [description, setDescription] = useState(automation?.description || '');
  const [enabled, setEnabled] = useState(automation?.enabled ?? true);
  const [trigger, setTrigger] = useState<AutomationTrigger>(
    automation?.trigger || {
      type: 'time',
      time: '08:00',
    }
  );
  const [conditions, setConditions] = useState<AutomationCondition[]>(
    automation?.conditions || []
  );
  const [actions, setActions] = useState<AutomationAction[]>(automation?.actions || []);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const devicesData = await getDevices();
      setDevices(devicesData);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !trigger || actions.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const automationData = {
      name,
      description,
      enabled,
      trigger,
      conditions,
      actions,
    };

    try {
      let savedAutomation: Automation;
      if (automation?.automationId) {
        await updateAutomation(automation.automationId, automationData);
        savedAutomation = { ...automation, ...automationData };
      } else {
        savedAutomation = await saveAutomation(automationData);
      }

      onSave?.(savedAutomation);
    } catch (error) {
      console.error('Failed to save automation:', error);
      alert('Failed to save automation');
    }
  };

  const handleDelete = async () => {
    if (!automation?.automationId) return;

    if (confirm('Are you sure you want to delete this automation?')) {
      try {
        await deleteAutomation(automation.automationId);
        onCancel?.();
      } catch (error) {
        console.error('Failed to delete automation:', error);
        alert('Failed to delete automation');
      }
    }
  };

  const handleTest = async () => {
    if (!automation?.automationId) {
      alert('Please save the automation first');
      return;
    }

    try {
      await executeAutomation(automation.automationId);
      alert('Automation executed successfully!');
    } catch (error) {
      console.error('Failed to execute automation:', error);
      alert('Failed to execute automation');
    }
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        deviceId: devices[0]?.deviceId || '',
        capability: 'switch',
        command: 'on',
        arguments: [],
      },
    ]);
  };

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    setActions(newActions);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        type: 'time',
        timeRange: { start: '00:00', end: '23:59' },
      },
    ]);
  };

  const updateCondition = (index: number, updates: Partial<AutomationCondition>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {automation ? 'Edit Automation' : 'New Automation'}
        </h2>
        <div className="flex gap-2">
          {automation && (
            <>
              <button
                onClick={handleTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Test
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Good Morning Routine"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enabled
          </label>
        </div>
      </div>

      {/* Trigger */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trigger</h3>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trigger Type
              </label>
              <select
                value={trigger.type}
                onChange={e =>
                  setTrigger({
                    type: e.target.value as any,
                    ...(e.target.value === 'time' && { time: '08:00' }),
                    ...(e.target.value === 'health' && {
                      healthMetric: 'pain',
                      healthThreshold: 5,
                      comparison: 'above',
                    }),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="time">Time</option>
                <option value="health">Health Metric</option>
                <option value="device">Device State</option>
                <option value="sunrise">Sunrise</option>
                <option value="sunset">Sunset</option>
              </select>
            </div>

            {trigger.type === 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={trigger.time || '08:00'}
                  onChange={e => setTrigger({ ...trigger, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {trigger.type === 'health' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Health Metric
                  </label>
                  <select
                    value={trigger.healthMetric}
                    onChange={e =>
                      setTrigger({ ...trigger, healthMetric: e.target.value as any })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pain">Pain Level</option>
                    <option value="energy">Energy Level</option>
                    <option value="mood">Mood Level</option>
                    <option value="anxiety">Anxiety Level</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comparison
                    </label>
                    <select
                      value={trigger.comparison}
                      onChange={e =>
                        setTrigger({ ...trigger, comparison: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                      <option value="equals">Equals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={trigger.healthThreshold}
                      onChange={e =>
                        setTrigger({ ...trigger, healthThreshold: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {trigger.type === 'device' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device
                  </label>
                  <select
                    value={trigger.deviceId}
                    onChange={e => setTrigger({ ...trigger, deviceId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select device...</option>
                    {devices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attribute
                  </label>
                  <input
                    type="text"
                    value={trigger.attribute || ''}
                    onChange={e => setTrigger({ ...trigger, attribute: e.target.value })}
                    placeholder="e.g., switch, level, temperature"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conditions (Optional)
          </h3>
          <button
            onClick={addCondition}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Condition
          </button>
        </div>

        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Condition {index + 1}
                </span>
                <button
                  onClick={() => removeCondition(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <select
                  value={condition.type}
                  onChange={e =>
                    updateCondition(index, {
                      type: e.target.value as any,
                      ...(e.target.value === 'time' && {
                        timeRange: { start: '00:00', end: '23:59' },
                      }),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="time">Time Range</option>
                  <option value="device">Device State</option>
                </select>

                {condition.type === 'time' && condition.timeRange && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={condition.timeRange.start}
                        onChange={e =>
                          updateCondition(index, {
                            timeRange: { ...condition.timeRange!, start: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={condition.timeRange.end}
                        onChange={e =>
                          updateCondition(index, {
                            timeRange: { ...condition.timeRange!, end: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
          <button
            onClick={addAction}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Action
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((action, index) => {
            const device = devices.find(d => d.deviceId === action.deviceId);

            return (
              <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Action {index + 1}
                  </span>
                  <button
                    onClick={() => removeAction(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Device
                    </label>
                    <select
                      value={action.deviceId}
                      onChange={e => updateAction(index, { deviceId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">Select device...</option>
                      {devices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Capability
                      </label>
                      <select
                        value={action.capability}
                        onChange={e =>
                          updateAction(index, { capability: e.target.value as CapabilityType })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="switch">Switch</option>
                        <option value="switchLevel">Level</option>
                        <option value="colorControl">Color</option>
                        <option value="lock">Lock</option>
                        <option value="thermostatMode">Thermostat Mode</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Command
                      </label>
                      <input
                        type="text"
                        value={action.command}
                        onChange={e => updateAction(index, { command: e.target.value })}
                        placeholder="e.g., on, off, setLevel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Delay (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={(action.delay || 0) / 1000}
                      onChange={e =>
                        updateAction(index, { delay: parseInt(e.target.value) * 1000 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Automation
        </button>
      </div>
    </div>
  );
};

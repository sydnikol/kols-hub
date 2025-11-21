/**
 * SAMSUNG SMARTTHINGS SERVICE
 *
 * Comprehensive smart home integration with health-aware automation
 * - Device discovery and control
 * - Health-based environment optimization
 * - Scenes and routines
 * - Real-time device status
 * - Voice control integration
 */

import { db } from '../utils/database';
import { getRecentBodyWeather } from './healthService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type DeviceType =
  | 'light'
  | 'switch'
  | 'dimmer'
  | 'thermostat'
  | 'lock'
  | 'sensor'
  | 'camera'
  | 'outlet'
  | 'fan'
  | 'blind'
  | 'airPurifier'
  | 'humidifier'
  | 'speaker';

export type DeviceStatus = 'online' | 'offline' | 'error';
export type CapabilityType =
  | 'switch'
  | 'switchLevel'
  | 'colorControl'
  | 'colorTemperature'
  | 'thermostatMode'
  | 'thermostatCoolingSetpoint'
  | 'thermostatHeatingSetpoint'
  | 'lock'
  | 'motionSensor'
  | 'contactSensor'
  | 'temperatureMeasurement'
  | 'relativeHumidityMeasurement'
  | 'airQualitySensor'
  | 'energyMeter'
  | 'powerMeter';

export interface SmartThingsDevice {
  deviceId: string;
  name: string;
  label: string;
  type: DeviceType;
  roomId?: string;
  locationId: string;
  status: DeviceStatus;
  capabilities: CapabilityType[];
  attributes: Record<string, any>;
  manufacturer?: string;
  model?: string;
  lastUpdated?: Date;
}

export interface Room {
  roomId: string;
  name: string;
  locationId: string;
  devices: string[]; // device IDs
}

export interface Scene {
  sceneId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  devices: SceneDeviceAction[];
  healthTrigger?: HealthTrigger;
  createdAt: Date;
  favorite: boolean;
}

export interface SceneDeviceAction {
  deviceId: string;
  capability: CapabilityType;
  command: string;
  arguments?: any[];
}

export interface Automation {
  automationId: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: Date;
  lastTriggered?: Date;
}

export type TriggerType =
  | 'time'
  | 'device'
  | 'health'
  | 'location'
  | 'sunrise'
  | 'sunset';

export interface AutomationTrigger {
  type: TriggerType;
  deviceId?: string;
  capability?: CapabilityType;
  attribute?: string;
  value?: any;
  time?: string; // HH:mm format
  healthMetric?: 'pain' | 'energy' | 'mood' | 'anxiety';
  healthThreshold?: number;
  comparison?: 'above' | 'below' | 'equals';
}

export interface AutomationCondition {
  type: 'device' | 'time' | 'health';
  deviceId?: string;
  capability?: CapabilityType;
  attribute?: string;
  value?: any;
  comparison?: 'equals' | 'above' | 'below';
  timeRange?: { start: string; end: string };
}

export interface AutomationAction {
  deviceId: string;
  capability: CapabilityType;
  command: string;
  arguments?: any[];
  delay?: number; // milliseconds
}

export interface HealthTrigger {
  metric: 'pain' | 'energy' | 'mood' | 'anxiety' | 'crisis';
  threshold: number;
  comparison: 'above' | 'below' | 'equals';
  autoActivate: boolean;
}

export interface EnergyUsage {
  deviceId: string;
  timestamp: Date;
  power: number; // watts
  energy: number; // kWh
}

export interface SmartThingsConfig {
  personalAccessToken: string;
  apiUrl?: string;
  locationId?: string;
  webhookUrl?: string;
}

// ============================================================================
// SMARTTHINGS API CLIENT
// ============================================================================

class SmartThingsAPI {
  private baseUrl = 'https://api.smartthings.com/v1';
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error('SmartThings Personal Access Token not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `SmartThings API error: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Devices
  async getDevices(locationId?: string): Promise<any> {
    const params = locationId ? `?locationId=${locationId}` : '';
    return this.request(`/devices${params}`);
  }

  async getDevice(deviceId: string): Promise<any> {
    return this.request(`/devices/${deviceId}`);
  }

  async getDeviceStatus(deviceId: string): Promise<any> {
    return this.request(`/devices/${deviceId}/status`);
  }

  async executeDeviceCommand(
    deviceId: string,
    capability: string,
    command: string,
    args: any[] = []
  ): Promise<any> {
    return this.request(`/devices/${deviceId}/commands`, {
      method: 'POST',
      body: JSON.stringify({
        commands: [{
          component: 'main',
          capability,
          command,
          arguments: args,
        }],
      }),
    });
  }

  // Locations
  async getLocations(): Promise<any> {
    return this.request('/locations');
  }

  async getLocation(locationId: string): Promise<any> {
    return this.request(`/locations/${locationId}`);
  }

  // Rooms
  async getRooms(locationId: string): Promise<any> {
    return this.request(`/locations/${locationId}/rooms`);
  }

  // Scenes
  async getScenes(locationId: string): Promise<any> {
    return this.request(`/scenes?locationId=${locationId}`);
  }

  async executeScene(sceneId: string): Promise<any> {
    return this.request(`/scenes/${sceneId}/execute`, {
      method: 'POST',
    });
  }

  // Rules (Automations)
  async getRules(locationId: string): Promise<any> {
    return this.request(`/rules?locationId=${locationId}`);
  }

  async createRule(rule: any): Promise<any> {
    return this.request('/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async updateRule(ruleId: string, rule: any): Promise<any> {
    return this.request(`/rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  async deleteRule(ruleId: string): Promise<any> {
    return this.request(`/rules/${ruleId}`, {
      method: 'DELETE',
    });
  }

  async executeRule(ruleId: string): Promise<any> {
    return this.request(`/rules/${ruleId}/execute`, {
      method: 'POST',
    });
  }
}

const api = new SmartThingsAPI();

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

// Configuration
export async function getSmartThingsConfig(): Promise<SmartThingsConfig | null> {
  const configData = localStorage.getItem('smartthings_config');
  if (!configData) return null;

  const config = JSON.parse(configData);
  if (config.personalAccessToken) {
    api.setToken(config.personalAccessToken);
  }
  return config;
}

export async function setSmartThingsConfig(config: SmartThingsConfig): Promise<void> {
  localStorage.setItem('smartthings_config', JSON.stringify(config));
  if (config.personalAccessToken) {
    api.setToken(config.personalAccessToken);
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await api.getLocations();
    return true;
  } catch (error) {
    console.error('SmartThings connection test failed:', error);
    return false;
  }
}

// Device Management
export async function discoverDevices(locationId?: string): Promise<SmartThingsDevice[]> {
  try {
    const response = await api.getDevices(locationId);
    const devices: SmartThingsDevice[] = [];

    for (const device of response.items || []) {
      const status = await api.getDeviceStatus(device.deviceId);

      devices.push({
        deviceId: device.deviceId,
        name: device.name,
        label: device.label || device.name,
        type: mapDeviceType(device.type),
        roomId: device.roomId,
        locationId: device.locationId,
        status: device.status === 'ONLINE' ? 'online' : 'offline',
        capabilities: device.components?.[0]?.capabilities?.map((c: any) => c.id) || [],
        attributes: status.components?.main || {},
        manufacturer: device.manufacturerName,
        model: device.deviceModel,
        lastUpdated: new Date(),
      });
    }

    // Cache devices locally
    localStorage.setItem('smartthings_devices', JSON.stringify(devices));

    await db.logEvolution('Discovered SmartThings devices', 'smarthome', { count: devices.length });

    return devices;
  } catch (error) {
    console.error('Failed to discover devices:', error);
    throw error;
  }
}

export async function getDevices(): Promise<SmartThingsDevice[]> {
  const cached = localStorage.getItem('smartthings_devices');
  if (cached) {
    return JSON.parse(cached);
  }
  return discoverDevices();
}

export async function getDevice(deviceId: string): Promise<SmartThingsDevice | null> {
  const devices = await getDevices();
  return devices.find(d => d.deviceId === deviceId) || null;
}

export async function getDevicesByRoom(roomId: string): Promise<SmartThingsDevice[]> {
  const devices = await getDevices();
  return devices.filter(d => d.roomId === roomId);
}

export async function refreshDeviceStatus(deviceId: string): Promise<SmartThingsDevice> {
  try {
    const device = await api.getDevice(deviceId);
    const status = await api.getDeviceStatus(deviceId);

    const updatedDevice: SmartThingsDevice = {
      deviceId: device.deviceId,
      name: device.name,
      label: device.label || device.name,
      type: mapDeviceType(device.type),
      roomId: device.roomId,
      locationId: device.locationId,
      status: device.status === 'ONLINE' ? 'online' : 'offline',
      capabilities: device.components?.[0]?.capabilities?.map((c: any) => c.id) || [],
      attributes: status.components?.main || {},
      manufacturer: device.manufacturerName,
      model: device.deviceModel,
      lastUpdated: new Date(),
    };

    // Update cache
    const devices = await getDevices();
    const index = devices.findIndex(d => d.deviceId === deviceId);
    if (index !== -1) {
      devices[index] = updatedDevice;
      localStorage.setItem('smartthings_devices', JSON.stringify(devices));
    }

    return updatedDevice;
  } catch (error) {
    console.error('Failed to refresh device status:', error);
    throw error;
  }
}

// Device Control
export async function controlDevice(
  deviceId: string,
  capability: CapabilityType,
  command: string,
  args: any[] = []
): Promise<void> {
  try {
    await api.executeDeviceCommand(deviceId, capability, command, args);

    await db.logEvolution('Device controlled', 'smarthome', {
      deviceId,
      capability,
      command,
      args
    });

    // Refresh device status after a short delay
    setTimeout(() => refreshDeviceStatus(deviceId), 1000);
  } catch (error) {
    console.error('Failed to control device:', error);
    throw error;
  }
}

export async function turnOn(deviceId: string): Promise<void> {
  await controlDevice(deviceId, 'switch', 'on');
}

export async function turnOff(deviceId: string): Promise<void> {
  await controlDevice(deviceId, 'switch', 'off');
}

export async function setLevel(deviceId: string, level: number): Promise<void> {
  await controlDevice(deviceId, 'switchLevel', 'setLevel', [level]);
}

export async function setColor(deviceId: string, hue: number, saturation: number): Promise<void> {
  await controlDevice(deviceId, 'colorControl', 'setColor', [{ hue, saturation }]);
}

export async function setColorTemperature(deviceId: string, temperature: number): Promise<void> {
  await controlDevice(deviceId, 'colorTemperature', 'setColorTemperature', [temperature]);
}

export async function setThermostat(
  deviceId: string,
  mode: 'heat' | 'cool' | 'auto' | 'off',
  temperature?: number
): Promise<void> {
  await controlDevice(deviceId, 'thermostatMode', 'setThermostatMode', [mode]);

  if (temperature !== undefined) {
    if (mode === 'heat') {
      await controlDevice(deviceId, 'thermostatHeatingSetpoint', 'setHeatingSetpoint', [temperature]);
    } else if (mode === 'cool') {
      await controlDevice(deviceId, 'thermostatCoolingSetpoint', 'setCoolingSetpoint', [temperature]);
    }
  }
}

export async function lockDoor(deviceId: string): Promise<void> {
  await controlDevice(deviceId, 'lock', 'lock');
}

export async function unlockDoor(deviceId: string): Promise<void> {
  await controlDevice(deviceId, 'lock', 'unlock');
}

// Rooms
export async function getRooms(locationId: string): Promise<Room[]> {
  try {
    const response = await api.getRooms(locationId);
    const devices = await getDevices();

    const rooms: Room[] = (response.items || []).map((room: any) => ({
      roomId: room.roomId,
      name: room.name,
      locationId: room.locationId,
      devices: devices.filter(d => d.roomId === room.roomId).map(d => d.deviceId),
    }));

    localStorage.setItem('smartthings_rooms', JSON.stringify(rooms));

    return rooms;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
}

// Scenes
export async function getScenes(): Promise<Scene[]> {
  const cached = localStorage.getItem('smartthings_scenes');
  if (cached) {
    return JSON.parse(cached);
  }
  return [];
}

export async function saveScene(scene: Omit<Scene, 'sceneId' | 'createdAt'>): Promise<Scene> {
  const scenes = await getScenes();
  const newScene: Scene = {
    ...scene,
    sceneId: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };

  scenes.push(newScene);
  localStorage.setItem('smartthings_scenes', JSON.stringify(scenes));

  await db.logEvolution('Scene created', 'smarthome', { scene: newScene.name });

  return newScene;
}

export async function executeScene(sceneId: string): Promise<void> {
  const scenes = await getScenes();
  const scene = scenes.find(s => s.sceneId === sceneId);

  if (!scene) {
    throw new Error('Scene not found');
  }

  // Execute all device actions
  for (const action of scene.devices) {
    try {
      await controlDevice(action.deviceId, action.capability, action.command, action.arguments);
    } catch (error) {
      console.error(`Failed to execute action for device ${action.deviceId}:`, error);
    }
  }

  await db.logEvolution('Scene executed', 'smarthome', { scene: scene.name });
}

export async function deleteScene(sceneId: string): Promise<void> {
  const scenes = await getScenes();
  const filtered = scenes.filter(s => s.sceneId !== sceneId);
  localStorage.setItem('smartthings_scenes', JSON.stringify(filtered));
}

// Automations
export async function getAutomations(): Promise<Automation[]> {
  const cached = localStorage.getItem('smartthings_automations');
  if (cached) {
    return JSON.parse(cached);
  }
  return [];
}

export async function saveAutomation(
  automation: Omit<Automation, 'automationId' | 'createdAt'>
): Promise<Automation> {
  const automations = await getAutomations();
  const newAutomation: Automation = {
    ...automation,
    automationId: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };

  automations.push(newAutomation);
  localStorage.setItem('smartthings_automations', JSON.stringify(automations));

  await db.logEvolution('Automation created', 'smarthome', { automation: newAutomation.name });

  return newAutomation;
}

export async function updateAutomation(
  automationId: string,
  updates: Partial<Automation>
): Promise<void> {
  const automations = await getAutomations();
  const index = automations.findIndex(a => a.automationId === automationId);

  if (index !== -1) {
    automations[index] = { ...automations[index], ...updates };
    localStorage.setItem('smartthings_automations', JSON.stringify(automations));
  }
}

export async function deleteAutomation(automationId: string): Promise<void> {
  const automations = await getAutomations();
  const filtered = automations.filter(a => a.automationId !== automationId);
  localStorage.setItem('smartthings_automations', JSON.stringify(filtered));
}

export async function executeAutomation(automationId: string): Promise<void> {
  const automations = await getAutomations();
  const automation = automations.find(a => a.automationId === automationId);

  if (!automation) {
    throw new Error('Automation not found');
  }

  // Check conditions
  if (automation.conditions && automation.conditions.length > 0) {
    const conditionsMet = await checkConditions(automation.conditions);
    if (!conditionsMet) {
      console.log('Automation conditions not met, skipping execution');
      return;
    }
  }

  // Execute actions
  for (const action of automation.actions) {
    try {
      if (action.delay) {
        await new Promise(resolve => setTimeout(resolve, action.delay));
      }
      await controlDevice(action.deviceId, action.capability, action.command, action.arguments);
    } catch (error) {
      console.error(`Failed to execute automation action:`, error);
    }
  }

  // Update last triggered
  await updateAutomation(automationId, { lastTriggered: new Date() });

  await db.logEvolution('Automation executed', 'smarthome', { automation: automation.name });
}

// Health-Aware Automation
export async function checkHealthTriggers(): Promise<void> {
  const scenes = await getScenes();
  const healthScenes = scenes.filter(s => s.healthTrigger);

  if (healthScenes.length === 0) return;

  try {
    const recentWeather = await getRecentBodyWeather(1);
    if (recentWeather.length === 0) return;

    const latest = recentWeather[0];

    for (const scene of healthScenes) {
      if (!scene.healthTrigger || !scene.healthTrigger.autoActivate) continue;

      const trigger = scene.healthTrigger;
      let shouldActivate = false;

      const value = latest[`${trigger.metric}Level` as keyof typeof latest] as number;

      if (typeof value === 'number') {
        switch (trigger.comparison) {
          case 'above':
            shouldActivate = value > trigger.threshold;
            break;
          case 'below':
            shouldActivate = value < trigger.threshold;
            break;
          case 'equals':
            shouldActivate = value === trigger.threshold;
            break;
        }
      }

      if (shouldActivate) {
        console.log(`Health trigger activated for scene: ${scene.name}`);
        await executeScene(scene.sceneId);
      }
    }
  } catch (error) {
    console.error('Failed to check health triggers:', error);
  }
}

// Energy Monitoring
export async function getEnergyUsage(
  deviceId: string,
  startDate: Date,
  endDate: Date
): Promise<EnergyUsage[]> {
  // This would typically fetch from SmartThings API or local cache
  // For now, return empty array as placeholder
  return [];
}

export async function getTotalEnergyUsage(startDate: Date, endDate: Date): Promise<number> {
  const devices = await getDevices();
  let total = 0;

  for (const device of devices) {
    const usage = await getEnergyUsage(device.deviceId, startDate, endDate);
    total += usage.reduce((sum, u) => sum + u.energy, 0);
  }

  return total;
}

// Preset Scenes
export async function createPresetScenes(): Promise<void> {
  const devices = await getDevices();
  const lights = devices.filter(d => d.type === 'light' || d.type === 'dimmer');
  const thermostats = devices.filter(d => d.type === 'thermostat');
  const locks = devices.filter(d => d.type === 'lock');

  const presets: Omit<Scene, 'sceneId' | 'createdAt'>[] = [
    {
      name: 'Good Morning',
      description: 'Gentle wake-up routine',
      icon: 'sunrise',
      color: '#FDB813',
      favorite: true,
      devices: [
        ...lights.map(d => ({
          deviceId: d.deviceId,
          capability: 'switchLevel' as CapabilityType,
          command: 'setLevel',
          arguments: [30],
        })),
        ...thermostats.map(d => ({
          deviceId: d.deviceId,
          capability: 'thermostatMode' as CapabilityType,
          command: 'setThermostatMode',
          arguments: ['heat'],
        })),
      ],
    },
    {
      name: 'High Pain Day',
      description: 'Calming environment for pain management',
      icon: 'heart-pulse',
      color: '#9333EA',
      favorite: true,
      devices: [
        ...lights.map(d => ({
          deviceId: d.deviceId,
          capability: 'switchLevel' as CapabilityType,
          command: 'setLevel',
          arguments: [20],
        })),
        ...thermostats.map(d => ({
          deviceId: d.deviceId,
          capability: 'thermostatCoolingSetpoint' as CapabilityType,
          command: 'setCoolingSetpoint',
          arguments: [68],
        })),
      ],
      healthTrigger: {
        metric: 'pain',
        threshold: 7,
        comparison: 'above',
        autoActivate: true,
      },
    },
    {
      name: 'Good Energy',
      description: 'Bright and energizing',
      icon: 'zap',
      color: '#10B981',
      favorite: false,
      devices: lights.map(d => ({
        deviceId: d.deviceId,
        capability: 'switchLevel' as CapabilityType,
        command: 'setLevel',
        arguments: [100],
      })),
      healthTrigger: {
        metric: 'energy',
        threshold: 7,
        comparison: 'above',
        autoActivate: false,
      },
    },
    {
      name: 'Crisis Mode',
      description: 'Safe and calming environment',
      icon: 'shield-alert',
      color: '#DC2626',
      favorite: true,
      devices: [
        ...lights.map(d => ({
          deviceId: d.deviceId,
          capability: 'switchLevel' as CapabilityType,
          command: 'setLevel',
          arguments: [15],
        })),
        ...locks.map(d => ({
          deviceId: d.deviceId,
          capability: 'lock' as CapabilityType,
          command: 'lock',
          arguments: [],
        })),
      ],
      healthTrigger: {
        metric: 'crisis',
        threshold: 1,
        comparison: 'equals',
        autoActivate: true,
      },
    },
    {
      name: 'Bedtime',
      description: 'Sleep optimization routine',
      icon: 'moon',
      color: '#6366F1',
      favorite: true,
      devices: [
        ...lights.map(d => ({
          deviceId: d.deviceId,
          capability: 'switch' as CapabilityType,
          command: 'off',
          arguments: [],
        })),
        ...locks.map(d => ({
          deviceId: d.deviceId,
          capability: 'lock' as CapabilityType,
          command: 'lock',
          arguments: [],
        })),
        ...thermostats.map(d => ({
          deviceId: d.deviceId,
          capability: 'thermostatCoolingSetpoint' as CapabilityType,
          command: 'setCoolingSetpoint',
          arguments: [65],
        })),
      ],
    },
    {
      name: 'Medication Reminder',
      description: 'Soft purple light notification',
      icon: 'pill',
      color: '#A855F7',
      favorite: false,
      devices: lights.slice(0, 1).map(d => ({
        deviceId: d.deviceId,
        capability: 'colorControl' as CapabilityType,
        command: 'setColor',
        arguments: [{ hue: 75, saturation: 100 }],
      })),
    },
    {
      name: 'Emergency',
      description: 'All lights on, unlock door',
      icon: 'siren',
      color: '#EF4444',
      favorite: false,
      devices: [
        ...lights.map(d => ({
          deviceId: d.deviceId,
          capability: 'switch' as CapabilityType,
          command: 'on',
          arguments: [],
        })),
        ...locks.map(d => ({
          deviceId: d.deviceId,
          capability: 'lock' as CapabilityType,
          command: 'unlock',
          arguments: [],
        })),
      ],
    },
  ];

  for (const preset of presets) {
    await saveScene(preset);
  }
}

// Helper Functions
function mapDeviceType(apiType: string): DeviceType {
  const typeMap: Record<string, DeviceType> = {
    'Light': 'light',
    'Switch': 'switch',
    'Dimmer': 'dimmer',
    'Thermostat': 'thermostat',
    'Lock': 'lock',
    'Motion Sensor': 'sensor',
    'Contact Sensor': 'sensor',
    'Camera': 'camera',
    'Outlet': 'outlet',
    'Fan': 'fan',
    'Shade': 'blind',
    'Air Purifier': 'airPurifier',
    'Humidifier': 'humidifier',
    'Speaker': 'speaker',
  };

  return typeMap[apiType] || 'switch';
}

async function checkConditions(conditions: AutomationCondition[]): Promise<boolean> {
  for (const condition of conditions) {
    if (condition.type === 'device') {
      const device = await getDevice(condition.deviceId!);
      if (!device) return false;

      const value = device.attributes[condition.attribute!]?.value;
      if (value === undefined) return false;

      switch (condition.comparison) {
        case 'equals':
          if (value !== condition.value) return false;
          break;
        case 'above':
          if (value <= condition.value) return false;
          break;
        case 'below':
          if (value >= condition.value) return false;
          break;
      }
    } else if (condition.type === 'time') {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (condition.timeRange) {
        if (currentTime < condition.timeRange.start || currentTime > condition.timeRange.end) {
          return false;
        }
      }
    }
  }

  return true;
}

// Start health monitoring
let healthMonitorInterval: NodeJS.Timeout | null = null;

export function startHealthMonitoring() {
  if (healthMonitorInterval) return;

  // Check health triggers every 5 minutes
  healthMonitorInterval = setInterval(() => {
    checkHealthTriggers();
  }, 5 * 60 * 1000);

  console.log('SmartThings health monitoring started');
}

export function stopHealthMonitoring() {
  if (healthMonitorInterval) {
    clearInterval(healthMonitorInterval);
    healthMonitorInterval = null;
    console.log('SmartThings health monitoring stopped');
  }
}

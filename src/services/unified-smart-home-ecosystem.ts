/**
 * UNIFIED SMART HOME ECOSYSTEM
 *
 * Consolidates all smart home functionality:
 * - SmartHomePage, GoogleHomeDashboard
 * - SmartThings integration
 * - Home Assistant integration
 * - Device automation and scenes
 *
 * Cross-system connections:
 * - Health: Medication reminders via speakers, emergency alerts
 * - Entertainment: Media control, ambient lighting
 * - Energy: Usage tracking, cost optimization
 * - Security: Motion detection, door locks
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'switch' | 'thermostat' | 'lock' | 'camera' | 'doorbell' | 'sensor' | 'speaker' | 'tv' | 'plug' | 'vacuum' | 'blinds' | 'fan' | 'other';
  brand: string;
  model?: string;
  platform: 'smartthings' | 'google_home' | 'alexa' | 'homekit' | 'home_assistant' | 'matter' | 'zigbee' | 'zwave' | 'wifi' | 'other';
  room: string;
  status: 'online' | 'offline' | 'unknown';
  state: Record<string, any>; // Device-specific state
  capabilities: string[];
  lastSeen?: Date;
  firmwareVersion?: string;
  batteryLevel?: number;
  energyUsage?: {
    currentWatts: number;
    dailyKwh: number;
    monthlyKwh: number;
    costPerMonth: number;
  };
  linkedAutomations: string[];
  favorite: boolean;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  type: 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'garage' | 'outdoor' | 'basement' | 'attic' | 'other';
  floor?: number;
  devices: string[];
  defaultScene?: string;
  climate?: {
    targetTemp: number;
    currentTemp?: number;
    humidity?: number;
    mode: 'heat' | 'cool' | 'auto' | 'off';
  };
  occupancy?: {
    occupied: boolean;
    lastMotion?: Date;
    presenceSensors: string[];
  };
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  deviceStates: Array<{
    deviceId: string;
    state: Record<string, any>;
  }>;
  rooms?: string[];
  triggers?: Array<{
    type: 'time' | 'sunrise' | 'sunset' | 'device' | 'location' | 'voice' | 'manual';
    config: Record<string, any>;
  }>;
  conditions?: Array<{
    type: 'time' | 'device' | 'weather' | 'presence';
    config: Record<string, any>;
  }>;
  active: boolean;
  lastActivated?: Date;
  activationCount: number;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: {
    type: 'time' | 'device_state' | 'location' | 'sunrise' | 'sunset' | 'webhook' | 'voice' | 'event';
    config: Record<string, any>;
  };
  conditions: Array<{
    type: 'time_range' | 'device_state' | 'day_of_week' | 'presence' | 'weather' | 'custom';
    config: Record<string, any>;
    operator?: 'and' | 'or';
  }>;
  actions: Array<{
    type: 'device' | 'scene' | 'notification' | 'delay' | 'webhook' | 'speak' | 'custom';
    config: Record<string, any>;
    delay?: number;
  }>;
  lastTriggered?: Date;
  triggerCount: number;
  errorCount: number;
  lastError?: string;
  linkedHealthEvent?: string;
  linkedEntertainment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyUsage {
  date: Date;
  totalKwh: number;
  cost: number;
  byDevice: Array<{
    deviceId: string;
    kwh: number;
    cost: number;
  }>;
  byRoom: Array<{
    roomId: string;
    kwh: number;
    cost: number;
  }>;
  peakHour: number;
  peakUsage: number;
}

export interface SecurityEvent {
  id: string;
  type: 'motion' | 'door_open' | 'door_close' | 'lock' | 'unlock' | 'alarm' | 'camera' | 'glass_break' | 'smoke' | 'co' | 'water_leak' | 'other';
  deviceId: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  details: Record<string, any>;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  mediaUrl?: string;
  linkedAutomation?: string;
}

export interface ClimateSchedule {
  id: string;
  name: string;
  enabled: boolean;
  thermostatIds: string[];
  schedule: Array<{
    dayOfWeek: number; // 0-6, Sunday = 0
    time: string; // HH:MM
    targetTemp: number;
    mode: 'heat' | 'cool' | 'auto';
  }>;
  awayMode: {
    enabled: boolean;
    heatTemp: number;
    coolTemp: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  aliases: string[];
  action: {
    type: 'device' | 'scene' | 'automation' | 'query' | 'custom';
    config: Record<string, any>;
  };
  response?: string;
  platform: 'google' | 'alexa' | 'siri' | 'all';
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

// ============================================================================
// UNIFIED SMART HOME ECOSYSTEM CLASS
// ============================================================================

class UnifiedSmartHomeEcosystem {
  private static instance: UnifiedSmartHomeEcosystem;
  private devices: Map<string, SmartDevice> = new Map();
  private rooms: Map<string, Room> = new Map();
  private scenes: Map<string, Scene> = new Map();
  private automations: Map<string, Automation> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private energyHistory: EnergyUsage[] = [];
  private climateSchedules: Map<string, ClimateSchedule> = new Map();
  private voiceCommands: Map<string, VoiceCommand> = new Map();

  // Platform connections
  private smartThingsToken?: string;
  private googleHomeToken?: string;
  private homeAssistantUrl?: string;
  private homeAssistantToken?: string;

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
    this.startAutomationEngine();
  }

  static getInstance(): UnifiedSmartHomeEcosystem {
    if (!UnifiedSmartHomeEcosystem.instance) {
      UnifiedSmartHomeEcosystem.instance = new UnifiedSmartHomeEcosystem();
    }
    return UnifiedSmartHomeEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - medication reminders via speakers
    eventBus.on('health:medication:due', (data: any) => {
      this.announceMedication(data);
    });

    // Health emergency - flash lights, unlock doors
    eventBus.on('health:emergency', (data: any) => {
      this.handleEmergency(data);
    });

    // Entertainment integration - set ambiance
    eventBus.on('entertainment:playing', (data: any) => {
      this.setEntertainmentMode(data);
    });

    // Sleep tracking - bedroom automation
    eventBus.on('health:sleep:bedtime', () => {
      this.activateSleepMode();
    });

    eventBus.on('health:sleep:wakeup', () => {
      this.activateWakeMode();
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_smart_home_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.devices) data.devices.forEach((d: SmartDevice) => this.devices.set(d.id, d));
        if (data.rooms) data.rooms.forEach((r: Room) => this.rooms.set(r.id, r));
        if (data.scenes) data.scenes.forEach((s: Scene) => this.scenes.set(s.id, s));
        if (data.automations) data.automations.forEach((a: Automation) => this.automations.set(a.id, a));
        if (data.securityEvents) this.securityEvents = data.securityEvents;
        if (data.energyHistory) this.energyHistory = data.energyHistory;
        if (data.climateSchedules) data.climateSchedules.forEach((c: ClimateSchedule) => this.climateSchedules.set(c.id, c));
        if (data.voiceCommands) data.voiceCommands.forEach((v: VoiceCommand) => this.voiceCommands.set(v.id, v));
        if (data.tokens) {
          this.smartThingsToken = data.tokens.smartThings;
          this.googleHomeToken = data.tokens.googleHome;
          this.homeAssistantUrl = data.tokens.homeAssistantUrl;
          this.homeAssistantToken = data.tokens.homeAssistantToken;
        }
      }
    } catch (error) {
      console.error('[SmartHome] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        devices: Array.from(this.devices.values()),
        rooms: Array.from(this.rooms.values()),
        scenes: Array.from(this.scenes.values()),
        automations: Array.from(this.automations.values()),
        securityEvents: this.securityEvents.slice(-500),
        energyHistory: this.energyHistory.slice(-365),
        climateSchedules: Array.from(this.climateSchedules.values()),
        voiceCommands: Array.from(this.voiceCommands.values()),
        tokens: {
          smartThings: this.smartThingsToken,
          googleHome: this.googleHomeToken,
          homeAssistantUrl: this.homeAssistantUrl,
          homeAssistantToken: this.homeAssistantToken
        }
      };
      localStorage.setItem('unified_smart_home_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[SmartHome] Failed to save to storage:', error);
    }
  }

  private startAutomationEngine(): void {
    // Check time-based automations every minute
    setInterval(() => {
      this.checkTimeBasedAutomations();
    }, 60000);

    // Check sunrise/sunset automations
    setInterval(() => {
      this.checkSunAutomations();
    }, 300000); // Every 5 minutes
  }

  // ============================================================================
  // PLATFORM CONNECTIONS
  // ============================================================================

  async connectSmartThings(token: string): Promise<boolean> {
    try {
      this.smartThingsToken = token;
      await this.syncSmartThingsDevices();
      this.saveToStorage();
      eventBus.emit('smarthome:platform:connected', { platform: 'smartthings' });
      return true;
    } catch (error) {
      console.error('[SmartHome] SmartThings connection failed:', error);
      return false;
    }
  }

  async connectGoogleHome(token: string): Promise<boolean> {
    try {
      this.googleHomeToken = token;
      await this.syncGoogleHomeDevices();
      this.saveToStorage();
      eventBus.emit('smarthome:platform:connected', { platform: 'google_home' });
      return true;
    } catch (error) {
      console.error('[SmartHome] Google Home connection failed:', error);
      return false;
    }
  }

  async connectHomeAssistant(url: string, token: string): Promise<boolean> {
    try {
      this.homeAssistantUrl = url;
      this.homeAssistantToken = token;
      await this.syncHomeAssistantDevices();
      this.saveToStorage();
      eventBus.emit('smarthome:platform:connected', { platform: 'home_assistant' });
      return true;
    } catch (error) {
      console.error('[SmartHome] Home Assistant connection failed:', error);
      return false;
    }
  }

  private async syncSmartThingsDevices(): Promise<void> {
    // Simulated sync - in production would call SmartThings API
    console.log('[SmartHome] Syncing SmartThings devices...');
  }

  private async syncGoogleHomeDevices(): Promise<void> {
    // Simulated sync - in production would call Google Home API
    console.log('[SmartHome] Syncing Google Home devices...');
  }

  private async syncHomeAssistantDevices(): Promise<void> {
    // Simulated sync - in production would call Home Assistant API
    console.log('[SmartHome] Syncing Home Assistant devices...');
  }

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  async addDevice(device: Omit<SmartDevice, 'id' | 'linkedAutomations' | 'createdAt' | 'updatedAt'>): Promise<SmartDevice> {
    const newDevice: SmartDevice = {
      ...device,
      id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      linkedAutomations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.devices.set(newDevice.id, newDevice);

    // Add to room
    const room = this.rooms.get(device.room);
    if (room && !room.devices.includes(newDevice.id)) {
      room.devices.push(newDevice.id);
      this.rooms.set(room.id, room);
    }

    this.saveToStorage();
    eventBus.emit('smarthome:device:added', newDevice);
    return newDevice;
  }

  async controlDevice(deviceId: string, command: Record<string, any>): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) return false;

    try {
      // Update local state
      device.state = { ...device.state, ...command };
      device.updatedAt = new Date();
      device.lastSeen = new Date();
      this.devices.set(deviceId, device);

      // Send command to appropriate platform
      switch (device.platform) {
        case 'smartthings':
          await this.sendSmartThingsCommand(device, command);
          break;
        case 'google_home':
          await this.sendGoogleHomeCommand(device, command);
          break;
        case 'home_assistant':
          await this.sendHomeAssistantCommand(device, command);
          break;
        default:
          console.log(`[SmartHome] Simulating command for ${device.name}:`, command);
      }

      this.saveToStorage();
      eventBus.emit('smarthome:device:controlled', { device, command });
      return true;
    } catch (error) {
      console.error(`[SmartHome] Failed to control device ${deviceId}:`, error);
      return false;
    }
  }

  private async sendSmartThingsCommand(device: SmartDevice, command: Record<string, any>): Promise<void> {
    if (!this.smartThingsToken) throw new Error('SmartThings not connected');
    // In production: Call SmartThings API
    console.log(`[SmartHome] SmartThings command to ${device.name}:`, command);
  }

  private async sendGoogleHomeCommand(device: SmartDevice, command: Record<string, any>): Promise<void> {
    if (!this.googleHomeToken) throw new Error('Google Home not connected');
    // In production: Call Google Home API
    console.log(`[SmartHome] Google Home command to ${device.name}:`, command);
  }

  private async sendHomeAssistantCommand(device: SmartDevice, command: Record<string, any>): Promise<void> {
    if (!this.homeAssistantUrl || !this.homeAssistantToken) throw new Error('Home Assistant not connected');
    // In production: Call Home Assistant API
    console.log(`[SmartHome] Home Assistant command to ${device.name}:`, command);
  }

  getDevice(deviceId: string): SmartDevice | undefined {
    return this.devices.get(deviceId);
  }

  getAllDevices(): SmartDevice[] {
    return Array.from(this.devices.values());
  }

  getDevicesByRoom(roomId: string): SmartDevice[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return room.devices.map(id => this.devices.get(id)).filter((d): d is SmartDevice => !!d);
  }

  getDevicesByType(type: SmartDevice['type']): SmartDevice[] {
    return Array.from(this.devices.values()).filter(d => d.type === type);
  }

  getOfflineDevices(): SmartDevice[] {
    return Array.from(this.devices.values()).filter(d => d.status === 'offline');
  }

  getLowBatteryDevices(threshold: number = 20): SmartDevice[] {
    return Array.from(this.devices.values()).filter(d => d.batteryLevel !== undefined && d.batteryLevel <= threshold);
  }

  // ============================================================================
  // ROOM MANAGEMENT
  // ============================================================================

  async addRoom(room: Omit<Room, 'id' | 'devices' | 'createdAt' | 'updatedAt'>): Promise<Room> {
    const newRoom: Room = {
      ...room,
      id: `room_${Date.now()}`,
      devices: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.rooms.set(newRoom.id, newRoom);
    this.saveToStorage();

    eventBus.emit('smarthome:room:added', newRoom);
    return newRoom;
  }

  async setRoomClimate(roomId: string, climate: Room['climate']): Promise<Room | null> {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.climate = climate;
    room.updatedAt = new Date();
    this.rooms.set(roomId, room);

    // Control thermostats in room
    const thermostats = this.getDevicesByRoom(roomId).filter(d => d.type === 'thermostat');
    for (const thermostat of thermostats) {
      await this.controlDevice(thermostat.id, {
        targetTemperature: climate?.targetTemp,
        mode: climate?.mode
      });
    }

    this.saveToStorage();
    return room;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  // ============================================================================
  // SCENES
  // ============================================================================

  async createScene(scene: Omit<Scene, 'id' | 'active' | 'lastActivated' | 'activationCount' | 'createdAt' | 'updatedAt'>): Promise<Scene> {
    const newScene: Scene = {
      ...scene,
      id: `scene_${Date.now()}`,
      active: false,
      activationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.scenes.set(newScene.id, newScene);
    this.saveToStorage();

    eventBus.emit('smarthome:scene:created', newScene);
    return newScene;
  }

  async activateScene(sceneId: string): Promise<boolean> {
    const scene = this.scenes.get(sceneId);
    if (!scene) return false;

    try {
      // Apply all device states
      for (const deviceState of scene.deviceStates) {
        await this.controlDevice(deviceState.deviceId, deviceState.state);
      }

      scene.active = true;
      scene.lastActivated = new Date();
      scene.activationCount++;
      scene.updatedAt = new Date();
      this.scenes.set(sceneId, scene);

      // Deactivate other scenes in same rooms
      if (scene.rooms) {
        for (const otherScene of this.scenes.values()) {
          if (otherScene.id !== sceneId && otherScene.active) {
            const hasOverlap = otherScene.rooms?.some(r => scene.rooms?.includes(r));
            if (hasOverlap) {
              otherScene.active = false;
              this.scenes.set(otherScene.id, otherScene);
            }
          }
        }
      }

      this.saveToStorage();
      eventBus.emit('smarthome:scene:activated', scene);
      return true;
    } catch (error) {
      console.error(`[SmartHome] Failed to activate scene ${sceneId}:`, error);
      return false;
    }
  }

  getAllScenes(): Scene[] {
    return Array.from(this.scenes.values());
  }

  getFavoriteScenes(): Scene[] {
    return Array.from(this.scenes.values()).filter(s => s.favorite);
  }

  // ============================================================================
  // AUTOMATIONS
  // ============================================================================

  async createAutomation(automation: Omit<Automation, 'id' | 'lastTriggered' | 'triggerCount' | 'errorCount' | 'createdAt' | 'updatedAt'>): Promise<Automation> {
    const newAutomation: Automation = {
      ...automation,
      id: `automation_${Date.now()}`,
      triggerCount: 0,
      errorCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.automations.set(newAutomation.id, newAutomation);
    this.saveToStorage();

    eventBus.emit('smarthome:automation:created', newAutomation);
    return newAutomation;
  }

  async triggerAutomation(automationId: string): Promise<boolean> {
    const automation = this.automations.get(automationId);
    if (!automation || !automation.enabled) return false;

    try {
      // Check conditions
      const conditionsMet = await this.checkConditions(automation.conditions);
      if (!conditionsMet) {
        console.log(`[SmartHome] Automation ${automation.name} conditions not met`);
        return false;
      }

      // Execute actions
      for (const action of automation.actions) {
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay));
        }

        await this.executeAction(action);
      }

      automation.lastTriggered = new Date();
      automation.triggerCount++;
      automation.updatedAt = new Date();
      this.automations.set(automationId, automation);

      this.saveToStorage();
      eventBus.emit('smarthome:automation:triggered', automation);
      return true;
    } catch (error) {
      console.error(`[SmartHome] Automation ${automationId} failed:`, error);
      automation.errorCount++;
      automation.lastError = error instanceof Error ? error.message : String(error);
      this.automations.set(automationId, automation);
      this.saveToStorage();
      return false;
    }
  }

  private async checkConditions(conditions: Automation['conditions']): Promise<boolean> {
    if (conditions.length === 0) return true;

    for (const condition of conditions) {
      const met = await this.evaluateCondition(condition);
      if (condition.operator === 'or' && met) return true;
      if (condition.operator !== 'or' && !met) return false;
    }

    return true;
  }

  private async evaluateCondition(condition: Automation['conditions'][0]): Promise<boolean> {
    switch (condition.type) {
      case 'time_range': {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [startHour, startMin] = condition.config.start.split(':').map(Number);
        const [endHour, endMin] = condition.config.end.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      }
      case 'device_state': {
        const device = this.devices.get(condition.config.deviceId);
        if (!device) return false;
        return device.state[condition.config.property] === condition.config.value;
      }
      case 'day_of_week': {
        const today = new Date().getDay();
        return condition.config.days.includes(today);
      }
      case 'presence': {
        // Check occupancy sensors
        const room = this.rooms.get(condition.config.roomId);
        return room?.occupancy?.occupied === condition.config.occupied;
      }
      default:
        return true;
    }
  }

  private async executeAction(action: Automation['actions'][0]): Promise<void> {
    switch (action.type) {
      case 'device':
        await this.controlDevice(action.config.deviceId, action.config.state);
        break;
      case 'scene':
        await this.activateScene(action.config.sceneId);
        break;
      case 'notification':
        eventBus.emit('notification:send', {
          type: 'smart_home',
          title: action.config.title,
          message: action.config.message
        });
        break;
      case 'speak':
        await this.speakOnDevices(action.config.message, action.config.deviceIds);
        break;
      default:
        console.log(`[SmartHome] Unknown action type: ${action.type}`);
    }
  }

  private checkTimeBasedAutomations(): void {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const automation of this.automations.values()) {
      if (!automation.enabled || automation.trigger.type !== 'time') continue;
      if (automation.trigger.config.time === currentTime) {
        this.triggerAutomation(automation.id);
      }
    }
  }

  private checkSunAutomations(): void {
    // Simplified - in production would use actual sunrise/sunset times
    const now = new Date();
    const hour = now.getHours();

    for (const automation of this.automations.values()) {
      if (!automation.enabled) continue;
      if (automation.trigger.type === 'sunrise' && hour === 6) {
        this.triggerAutomation(automation.id);
      }
      if (automation.trigger.type === 'sunset' && hour === 18) {
        this.triggerAutomation(automation.id);
      }
    }
  }

  getAllAutomations(): Automation[] {
    return Array.from(this.automations.values());
  }

  getEnabledAutomations(): Automation[] {
    return Array.from(this.automations.values()).filter(a => a.enabled);
  }

  // ============================================================================
  // SECURITY
  // ============================================================================

  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'acknowledged'>): Promise<SecurityEvent> {
    const newEvent: SecurityEvent = {
      ...event,
      id: `security_${Date.now()}`,
      acknowledged: false
    };

    this.securityEvents.push(newEvent);
    this.saveToStorage();

    // Critical events trigger notifications
    if (event.severity === 'critical') {
      eventBus.emit('notification:urgent', {
        type: 'security',
        title: 'Security Alert',
        message: `${event.type} detected on ${this.devices.get(event.deviceId)?.name || 'Unknown device'}`
      });

      // Trigger emergency protocol if needed
      if (['smoke', 'co', 'glass_break'].includes(event.type)) {
        eventBus.emit('health:emergency', { source: 'smart_home', event });
      }
    }

    eventBus.emit('smarthome:security:event', newEvent);
    return newEvent;
  }

  async acknowledgeSecurityEvent(eventId: string, acknowledgedBy?: string): Promise<SecurityEvent | null> {
    const event = this.securityEvents.find(e => e.id === eventId);
    if (!event) return null;

    event.acknowledged = true;
    event.acknowledgedAt = new Date();
    event.acknowledgedBy = acknowledgedBy;

    this.saveToStorage();
    return event;
  }

  getSecurityEvents(options?: { unacknowledged?: boolean; severity?: SecurityEvent['severity']; limit?: number }): SecurityEvent[] {
    let events = [...this.securityEvents];

    if (options?.unacknowledged) {
      events = events.filter(e => !e.acknowledged);
    }
    if (options?.severity) {
      events = events.filter(e => e.severity === options.severity);
    }

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (options?.limit) {
      events = events.slice(0, options.limit);
    }

    return events;
  }

  async armSecuritySystem(mode: 'away' | 'home' | 'night'): Promise<void> {
    // Control all locks and arm sensors
    const locks = this.getDevicesByType('lock');
    for (const lock of locks) {
      await this.controlDevice(lock.id, { locked: true });
    }

    // Enable motion sensors based on mode
    const sensors = this.getDevicesByType('sensor');
    for (const sensor of sensors) {
      const shouldArm = mode === 'away' || (mode === 'night' && sensor.room !== 'bedroom');
      await this.controlDevice(sensor.id, { armed: shouldArm });
    }

    eventBus.emit('smarthome:security:armed', { mode });
  }

  async disarmSecuritySystem(): Promise<void> {
    const sensors = this.getDevicesByType('sensor');
    for (const sensor of sensors) {
      await this.controlDevice(sensor.id, { armed: false });
    }

    eventBus.emit('smarthome:security:disarmed', {});
  }

  // ============================================================================
  // ENERGY MANAGEMENT
  // ============================================================================

  async recordEnergyUsage(usage: Omit<EnergyUsage, 'date'>): Promise<void> {
    const record: EnergyUsage = {
      ...usage,
      date: new Date()
    };

    this.energyHistory.push(record);
    this.saveToStorage();

    // Track cost in finance
    eventBus.emit('finance:expense', {
      amount: usage.cost,
      category: 'utilities',
      description: `Energy usage: ${usage.totalKwh.toFixed(2)} kWh`,
      recurring: true
    });

    eventBus.emit('smarthome:energy:recorded', record);
  }

  getEnergyHistory(days: number = 30): EnergyUsage[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.energyHistory
      .filter(e => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getTopEnergyConsumers(limit: number = 5): Array<{ device: SmartDevice; monthlyKwh: number; cost: number }> {
    return Array.from(this.devices.values())
      .filter(d => d.energyUsage)
      .map(d => ({
        device: d,
        monthlyKwh: d.energyUsage!.monthlyKwh,
        cost: d.energyUsage!.costPerMonth
      }))
      .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
      .slice(0, limit);
  }

  // ============================================================================
  // VOICE COMMANDS
  // ============================================================================

  async addVoiceCommand(command: Omit<VoiceCommand, 'id' | 'usageCount' | 'createdAt'>): Promise<VoiceCommand> {
    const newCommand: VoiceCommand = {
      ...command,
      id: `voice_${Date.now()}`,
      usageCount: 0,
      createdAt: new Date()
    };

    this.voiceCommands.set(newCommand.id, newCommand);
    this.saveToStorage();

    return newCommand;
  }

  async executeVoiceCommand(phrase: string): Promise<{ success: boolean; response?: string }> {
    const normalizedPhrase = phrase.toLowerCase().trim();

    for (const command of this.voiceCommands.values()) {
      const allPhrases = [command.phrase, ...command.aliases].map(p => p.toLowerCase());
      if (allPhrases.some(p => normalizedPhrase.includes(p))) {
        try {
          switch (command.action.type) {
            case 'device':
              await this.controlDevice(command.action.config.deviceId, command.action.config.state);
              break;
            case 'scene':
              await this.activateScene(command.action.config.sceneId);
              break;
            case 'automation':
              await this.triggerAutomation(command.action.config.automationId);
              break;
          }

          command.usageCount++;
          command.lastUsed = new Date();
          this.voiceCommands.set(command.id, command);
          this.saveToStorage();

          return { success: true, response: command.response || 'Done' };
        } catch (error) {
          return { success: false, response: 'Command failed' };
        }
      }
    }

    return { success: false, response: 'Command not recognized' };
  }

  // ============================================================================
  // HEALTH INTEGRATION
  // ============================================================================

  private async announceMedication(data: any): Promise<void> {
    const speakers = this.getDevicesByType('speaker').filter(s => s.status === 'online');
    if (speakers.length === 0) return;

    const message = `Reminder: It's time to take your ${data.medicationName}`;
    await this.speakOnDevices(message, speakers.map(s => s.id));

    // Flash lights gently
    const lights = this.getDevicesByType('light').filter(l => l.state.on);
    for (const light of lights.slice(0, 3)) {
      const originalBrightness = light.state.brightness || 100;
      await this.controlDevice(light.id, { brightness: 50 });
      setTimeout(() => this.controlDevice(light.id, { brightness: originalBrightness }), 500);
    }
  }

  private async handleEmergency(data: any): Promise<void> {
    console.log('[SmartHome] Emergency protocol activated');

    // Flash all lights red
    const lights = this.getDevicesByType('light');
    for (const light of lights) {
      await this.controlDevice(light.id, { on: true, color: '#FF0000', brightness: 100 });
    }

    // Unlock all doors
    const locks = this.getDevicesByType('lock');
    for (const lock of locks) {
      await this.controlDevice(lock.id, { locked: false });
    }

    // Announce emergency
    const speakers = this.getDevicesByType('speaker');
    await this.speakOnDevices('Emergency alert. Help has been requested.', speakers.map(s => s.id));

    eventBus.emit('smarthome:emergency:activated', data);
  }

  private async speakOnDevices(message: string, deviceIds: string[]): Promise<void> {
    for (const deviceId of deviceIds) {
      const device = this.devices.get(deviceId);
      if (device?.type === 'speaker' && device.status === 'online') {
        // In production: Use platform-specific TTS
        console.log(`[SmartHome] Speaking on ${device.name}: "${message}"`);
      }
    }
  }

  // ============================================================================
  // ENTERTAINMENT INTEGRATION
  // ============================================================================

  private async setEntertainmentMode(data: any): Promise<void> {
    if (data.type === 'movie') {
      // Dim lights for movie mode
      const livingRoomLights = this.getDevicesByRoom('living_room').filter(d => d.type === 'light');
      for (const light of livingRoomLights) {
        await this.controlDevice(light.id, { brightness: 20 });
      }
    }
  }

  private async activateSleepMode(): Promise<void> {
    const bedroomScene = Array.from(this.scenes.values()).find(s => s.name.toLowerCase().includes('sleep') || s.name.toLowerCase().includes('night'));
    if (bedroomScene) {
      await this.activateScene(bedroomScene.id);
    } else {
      // Default: dim all lights, lock doors
      const lights = this.getDevicesByType('light');
      for (const light of lights) {
        await this.controlDevice(light.id, { on: false });
      }
      await this.armSecuritySystem('night');
    }
  }

  private async activateWakeMode(): Promise<void> {
    const morningScene = Array.from(this.scenes.values()).find(s => s.name.toLowerCase().includes('morning') || s.name.toLowerCase().includes('wake'));
    if (morningScene) {
      await this.activateScene(morningScene.id);
    } else {
      // Default: turn on bedroom lights gradually
      const bedroomLights = this.getDevicesByRoom('bedroom').filter(d => d.type === 'light');
      for (const light of bedroomLights) {
        await this.controlDevice(light.id, { on: true, brightness: 50 });
      }
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  getSmartHomeStats(): {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    totalRooms: number;
    totalScenes: number;
    totalAutomations: number;
    activeAutomations: number;
    energyThisMonth: number;
    energyCostThisMonth: number;
    securityEventsToday: number;
  } {
    const devices = Array.from(this.devices.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonthEnergy = this.energyHistory.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length,
      offlineDevices: devices.filter(d => d.status === 'offline').length,
      totalRooms: this.rooms.size,
      totalScenes: this.scenes.size,
      totalAutomations: this.automations.size,
      activeAutomations: Array.from(this.automations.values()).filter(a => a.enabled).length,
      energyThisMonth: thisMonthEnergy.reduce((sum, e) => sum + e.totalKwh, 0),
      energyCostThisMonth: thisMonthEnergy.reduce((sum, e) => sum + e.cost, 0),
      securityEventsToday: this.securityEvents.filter(e => new Date(e.timestamp) >= today).length
    };
  }
}

// Export singleton instance
export const smartHomeEcosystem = UnifiedSmartHomeEcosystem.getInstance();

// Export convenience functions
export const addDevice = (d: Parameters<typeof smartHomeEcosystem.addDevice>[0]) => smartHomeEcosystem.addDevice(d);
export const controlDevice = (id: string, cmd: Record<string, any>) => smartHomeEcosystem.controlDevice(id, cmd);
export const activateScene = (id: string) => smartHomeEcosystem.activateScene(id);
export const getAllDevices = () => smartHomeEcosystem.getAllDevices();
export const getAllRooms = () => smartHomeEcosystem.getAllRooms();
export const getSmartHomeStats = () => smartHomeEcosystem.getSmartHomeStats();

/**
 * Google Home & Assistant Integration
 * Provides voice control and smart home capabilities
 */

export interface VoiceCommand {
  command: string;
  parameters?: Record<string, any>;
  timestamp: number;
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  type: 'light' | 'switch' | 'thermostat' | 'lock' | 'sensor' | 'custom';
  state: any;
  room?: string;
}

export interface AssistantResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface GoogleHomePlugin {
  /**
   * Initialize Google Assistant integration
   */
  initialize(): Promise<{ success: boolean; assistantAvailable: boolean }>;

  /**
   * Register voice command handlers
   */
  registerVoiceCommands(commands: string[]): Promise<{ success: boolean; registered: number }>;

  /**
   * Execute a voice command
   */
  executeVoiceCommand(options: { command: string; parameters?: Record<string, any> }): Promise<AssistantResponse>;

  /**
   * Get list of connected smart home devices
   */
  getSmartDevices(): Promise<{ devices: SmartHomeDevice[] }>;

  /**
   * Control a smart home device
   */
  controlDevice(options: {
    deviceId: string;
    action: string;
    value?: any;
  }): Promise<AssistantResponse>;

  /**
   * Register the app with Google Home for routines
   */
  registerForRoutines(): Promise<{ success: boolean }>;

  /**
   * Trigger a Google Home routine
   */
  triggerRoutine(options: { routineName: string }): Promise<AssistantResponse>;

  /**
   * Send a broadcast message to all Google Home devices
   */
  broadcast(options: { message: string; rooms?: string[] }): Promise<{ success: boolean }>;

  /**
   * Set up automation triggers
   */
  createAutomation(options: {
    trigger: string;
    action: string;
    conditions?: Record<string, any>;
  }): Promise<{ automationId: string }>;

  /**
   * Cast content to Google Hub/Nest Hub
   */
  castToHub(options: {
    deviceId: string;
    content: {
      type: 'dashboard' | 'image' | 'video' | 'web';
      url?: string;
      data?: any;
    };
  }): Promise<{ success: boolean }>;

  /**
   * Listen for voice commands
   */
  addListener(
    eventName: 'voiceCommand',
    listenerFunc: (data: VoiceCommand) => void
  ): Promise<void>;

  /**
   * Listen for device state changes
   */
  addListener(
    eventName: 'deviceStateChanged',
    listenerFunc: (data: { deviceId: string; state: any }) => void
  ): Promise<void>;

  /**
   * Remove all listeners
   */
  removeAllListeners(): Promise<void>;
}

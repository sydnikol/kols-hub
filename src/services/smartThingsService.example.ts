/**
 * SMARTTHINGS SERVICE - USAGE EXAMPLES
 *
 * Quick reference for using the SmartThings service in other components
 */

import {
  // Configuration
  getSmartThingsConfig,
  setSmartThingsConfig,
  testConnection,

  // Device Management
  discoverDevices,
  getDevices,
  getDevice,
  getDevicesByRoom,
  refreshDeviceStatus,

  // Device Control
  controlDevice,
  turnOn,
  turnOff,
  setLevel,
  setColor,
  setColorTemperature,
  setThermostat,
  lockDoor,
  unlockDoor,

  // Rooms
  getRooms,

  // Scenes
  getScenes,
  saveScene,
  executeScene,
  deleteScene,

  // Automations
  getAutomations,
  saveAutomation,
  updateAutomation,
  deleteAutomation,
  executeAutomation,

  // Health Integration
  checkHealthTriggers,
  startHealthMonitoring,
  stopHealthMonitoring,

  // Presets
  createPresetScenes,

  // Energy
  getEnergyUsage,
  getTotalEnergyUsage,

  // Types
  type SmartThingsDevice,
  type Scene,
  type Automation,
  type Room,
} from './smartThingsService';

// ============================================================================
// EXAMPLE 1: Initial Setup
// ============================================================================

async function setupSmartThings() {
  // Configure with Personal Access Token
  await setSmartThingsConfig({
    personalAccessToken: 'YOUR_PAT_HERE',
  });

  // Test connection
  const connected = await testConnection();
  if (connected) {
    console.log('Successfully connected to SmartThings!');

    // Discover all devices
    const devices = await discoverDevices();
    console.log(`Found ${devices.length} devices`);

    // Create preset scenes
    await createPresetScenes();

    // Start health monitoring
    startHealthMonitoring();
  }
}

// ============================================================================
// EXAMPLE 2: Control Devices
// ============================================================================

async function controlDevicesExample() {
  // Get all devices
  const devices = await getDevices();

  // Find a specific light
  const livingRoomLight = devices.find(d => d.label === 'Living Room Light');
  if (livingRoomLight) {
    // Turn on
    await turnOn(livingRoomLight.deviceId);

    // Set brightness to 50%
    await setLevel(livingRoomLight.deviceId, 50);

    // Set color (warm white)
    await setColor(livingRoomLight.deviceId, 30, 50);

    // Turn off
    await turnOff(livingRoomLight.deviceId);
  }

  // Control thermostat
  const thermostat = devices.find(d => d.type === 'thermostat');
  if (thermostat) {
    // Set to cooling mode at 72°F
    await setThermostat(thermostat.deviceId, 'cool', 72);

    // Set to heating mode at 68°F
    await setThermostat(thermostat.deviceId, 'heat', 68);
  }

  // Lock doors
  const frontDoor = devices.find(d => d.label === 'Front Door');
  if (frontDoor) {
    await lockDoor(frontDoor.deviceId);
  }
}

// ============================================================================
// EXAMPLE 3: Create and Execute Scenes
// ============================================================================

async function scenesExample() {
  const devices = await getDevices();
  const lights = devices.filter(d => d.type === 'light');

  // Create a "Movie Time" scene
  const movieScene = await saveScene({
    name: 'Movie Time',
    description: 'Dim lights for movie watching',
    icon: 'film',
    color: '#6366F1',
    favorite: true,
    devices: lights.map(light => ({
      deviceId: light.deviceId,
      capability: 'switchLevel',
      command: 'setLevel',
      arguments: [10], // 10% brightness
    })),
  });

  // Execute the scene
  await executeScene(movieScene.sceneId);

  // Create a health-triggered scene
  const migraineScene = await saveScene({
    name: 'Migraine Relief',
    description: 'Dark and quiet for migraine',
    icon: 'heart-pulse',
    color: '#9333EA',
    favorite: true,
    devices: [
      ...lights.map(light => ({
        deviceId: light.deviceId,
        capability: 'switch',
        command: 'off',
      })),
    ],
    healthTrigger: {
      metric: 'pain',
      threshold: 8,
      comparison: 'above',
      autoActivate: true, // Auto-activate when pain > 8
    },
  });
}

// ============================================================================
// EXAMPLE 4: Create Automations
// ============================================================================

async function automationsExample() {
  const devices = await getDevices();

  // Morning routine automation
  const morningRoutine = await saveAutomation({
    name: 'Morning Routine',
    description: 'Gentle wake-up at 7 AM',
    enabled: true,
    trigger: {
      type: 'time',
      time: '07:00',
    },
    actions: [
      // Turn on bedroom light at 20%
      {
        deviceId: devices.find(d => d.label === 'Bedroom Light')!.deviceId,
        capability: 'switchLevel',
        command: 'setLevel',
        arguments: [20],
      },
      // Wait 5 minutes
      {
        deviceId: devices.find(d => d.label === 'Bedroom Light')!.deviceId,
        capability: 'switchLevel',
        command: 'setLevel',
        arguments: [50],
        delay: 5 * 60 * 1000, // 5 minutes in milliseconds
      },
    ],
  });

  // Health-based automation
  const highPainAutomation = await saveAutomation({
    name: 'High Pain Environment',
    description: 'Auto-adjust environment when pain is high',
    enabled: true,
    trigger: {
      type: 'health',
      healthMetric: 'pain',
      threshold: 7,
      comparison: 'above',
    },
    conditions: [
      // Only during daytime
      {
        type: 'time',
        timeRange: {
          start: '08:00',
          end: '22:00',
        },
      },
    ],
    actions: [
      // Dim all lights
      ...devices
        .filter(d => d.type === 'light')
        .map(light => ({
          deviceId: light.deviceId,
          capability: 'switchLevel' as const,
          command: 'setLevel',
          arguments: [15],
        })),
      // Cool the room
      {
        deviceId: devices.find(d => d.type === 'thermostat')!.deviceId,
        capability: 'thermostatCoolingSetpoint',
        command: 'setCoolingSetpoint',
        arguments: [68],
        delay: 2000,
      },
    ],
  });

  // Execute automation manually
  await executeAutomation(morningRoutine.automationId);
}

// ============================================================================
// EXAMPLE 5: Health Integration
// ============================================================================

async function healthIntegrationExample() {
  // Manually check health triggers (normally runs automatically)
  await checkHealthTriggers();

  // In your health tracking component:
  async function onHealthUpdate(painLevel: number, energyLevel: number) {
    // Health data is saved to database, then triggers are checked
    // automatically if health monitoring is enabled

    // You can also manually trigger scenes based on health:
    const scenes = await getScenes();

    if (painLevel >= 7) {
      const painScene = scenes.find(s => s.name === 'High Pain Day');
      if (painScene) {
        await executeScene(painScene.sceneId);
      }
    }

    if (energyLevel >= 8) {
      const energyScene = scenes.find(s => s.name === 'Good Energy');
      if (energyScene) {
        await executeScene(energyScene.sceneId);
      }
    }
  }
}

// ============================================================================
// EXAMPLE 6: Room-Based Control
// ============================================================================

async function roomControlExample() {
  const config = await getSmartThingsConfig();
  if (!config?.locationId) return;

  // Get all rooms
  const rooms = await getRooms(config.locationId);

  // Control all devices in a room
  const bedroom = rooms.find(r => r.name === 'Bedroom');
  if (bedroom) {
    const bedroomDevices = await getDevicesByRoom(bedroom.roomId);

    // Turn off all devices in bedroom
    for (const device of bedroomDevices) {
      if (device.capabilities.includes('switch')) {
        await turnOff(device.deviceId);
      }
    }
  }
}

// ============================================================================
// EXAMPLE 7: Energy Monitoring
// ============================================================================

async function energyMonitoringExample() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // Last 7 days
  const endDate = new Date();

  // Get total energy usage
  const totalEnergy = await getTotalEnergyUsage(startDate, endDate);
  console.log(`Total energy used: ${totalEnergy} kWh`);

  // Get usage per device
  const devices = await getDevices();
  for (const device of devices) {
    const usage = await getEnergyUsage(device.deviceId, startDate, endDate);
    if (usage.length > 0) {
      const totalDeviceEnergy = usage.reduce((sum, u) => sum + u.energy, 0);
      console.log(`${device.label}: ${totalDeviceEnergy} kWh`);
    }
  }
}

// ============================================================================
// EXAMPLE 8: Advanced Device Control
// ============================================================================

async function advancedControlExample() {
  const devices = await getDevices();

  // Color cycling for notification
  const light = devices.find(d => d.capabilities.includes('colorControl'));
  if (light) {
    const colors = [
      { hue: 0, saturation: 100 }, // Red
      { hue: 120, saturation: 100 }, // Green
      { hue: 240, saturation: 100 }, // Blue
    ];

    for (const color of colors) {
      await setColor(light.deviceId, color.hue, color.saturation);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
  }

  // Gradual dimming
  const dimmableLight = devices.find(d => d.capabilities.includes('switchLevel'));
  if (dimmableLight) {
    for (let level = 100; level >= 0; level -= 10) {
      await setLevel(dimmableLight.deviceId, level);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 seconds
    }
  }
}

// ============================================================================
// EXAMPLE 9: Crisis Support Integration
// ============================================================================

async function crisisIntegrationExample() {
  // When crisis mode is activated in CrisisSupportPage
  async function activateCrisisMode() {
    const scenes = await getScenes();
    const crisisScene = scenes.find(s => s.name === 'Crisis Mode');

    if (crisisScene) {
      // Execute crisis scene
      await executeScene(crisisScene.sceneId);
    } else {
      // Create crisis scene on the fly
      const devices = await getDevices();
      const lights = devices.filter(d => d.type === 'light');
      const locks = devices.filter(d => d.type === 'lock');

      await saveScene({
        name: 'Crisis Mode',
        description: 'Safe and calming environment',
        icon: 'shield-alert',
        color: '#DC2626',
        favorite: true,
        devices: [
          // Dim all lights
          ...lights.map(light => ({
            deviceId: light.deviceId,
            capability: 'switchLevel' as const,
            command: 'setLevel',
            arguments: [15],
          })),
          // Lock all doors
          ...locks.map(lock => ({
            deviceId: lock.deviceId,
            capability: 'lock' as const,
            command: 'lock',
            arguments: [],
          })),
        ],
      });
    }
  }

  // Deactivate crisis mode
  async function deactivateCrisisMode() {
    const devices = await getDevices();
    const lights = devices.filter(d => d.type === 'light');

    // Return lights to normal
    for (const light of lights) {
      await setLevel(light.deviceId, 50);
    }
  }
}

// ============================================================================
// EXAMPLE 10: Medication Reminder Integration
// ============================================================================

async function medicationReminderExample() {
  const devices = await getDevices();
  const reminderLight = devices.find(d => d.label === 'Medication Light');

  if (reminderLight) {
    // Flash purple light 3 times
    for (let i = 0; i < 3; i++) {
      // Purple color
      await setColor(reminderLight.deviceId, 75, 100);
      await turnOn(reminderLight.deviceId);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Turn off
      await turnOff(reminderLight.deviceId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Leave on at low brightness
    await setLevel(reminderLight.deviceId, 30);
    await setColor(reminderLight.deviceId, 75, 50);
  }
}

// ============================================================================
// Export all examples for testing
// ============================================================================

export const examples = {
  setupSmartThings,
  controlDevicesExample,
  scenesExample,
  automationsExample,
  healthIntegrationExample,
  roomControlExample,
  energyMonitoringExample,
  advancedControlExample,
  crisisIntegrationExample,
  medicationReminderExample,
};

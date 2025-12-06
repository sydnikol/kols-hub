/**
 * AUTO-INITIALIZE NEW RELIC ON APP STARTUP
 * This file is called when the app starts to ensure New Relic is ready
 */

import { newRelicIntegration } from '../services/newrelic-integration';

export function initializeNewRelic(): void {
  // Check if already initialized from localStorage
  if (newRelicIntegration.isReady()) {
    console.log('✅ New Relic already initialized from localStorage');
    return;
  }

  // Initialize with hardcoded credentials
  newRelicIntegration.initialize({
    accountId: '7395271',
    apiKey: '<YOUR_NEW_RELIC_API_KEY>',
    appName: 'Unified Mega App',
    region: 'US'
  });

  console.log('✅ New Relic initialized successfully');
  console.log('📊 Dashboard: https://onenr.io/0vwBYzoDKQp');
  console.log('🔄 Auto-sync: Every 60 seconds');
}

// Auto-initialize on import
initializeNewRelic();

/**
 * 🖤 PLATFORM SERVICE
 * Cross-platform compatibility layer for Web, Desktop, Android, and iOS
 * Ensures all features work seamlessly across all platforms
 */

import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

export type Platform = 'web' | 'desktop' | 'android' | 'ios';

class PlatformService {
  private platform: Platform = 'web';
  private isCapacitor: boolean = false;
  private isElectron: boolean = false;

  constructor() {
    this.detectPlatform();
  }

  /**
   * Detect the current platform
   */
  private detectPlatform() {
    // Check if running in Capacitor (mobile)
    this.isCapacitor = Capacitor.isNativePlatform();

    // Check if running in Electron (desktop)
    this.isElectron = !!(window as any).electron || !!(window as any).process?.type;

    if (this.isCapacitor) {
      const platform = Capacitor.getPlatform();
      this.platform = platform === 'android' ? 'android' : 'ios';
    } else if (this.isElectron) {
      this.platform = 'desktop';
    } else {
      this.platform = 'web';
    }

    console.log('🖤 Platform detected:', this.platform);
  }

  /**
   * Get current platform
   */
  getPlatform(): Platform {
    return this.platform;
  }

  /**
   * Check if running on mobile (Android or iOS)
   */
  isMobile(): boolean {
    return this.platform === 'android' || this.platform === 'ios';
  }

  /**
   * Check if running on Android
   */
  isAndroid(): boolean {
    return this.platform === 'android';
  }

  /**
   * Check if running on iOS
   */
  isIOS(): boolean {
    return this.platform === 'ios';
  }

  /**
   * Check if running on desktop
   */
  isDesktop(): boolean {
    return this.platform === 'desktop';
  }

  /**
   * Check if running on web
   */
  isWeb(): boolean {
    return this.platform === 'web';
  }

  /**
   * Check if offline functionality is available
   */
  isOfflineCapable(): boolean {
    return 'serviceWorker' in navigator && 'indexedDB' in window;
  }

  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Initialize platform-specific features
   */
  async initialize() {
    console.log('🖤 Initializing platform features...');

    if (this.isCapacitor) {
      await this.initializeCapacitor();
    }

    if (this.isElectron) {
      await this.initializeElectron();
    }

    // Register service worker for offline support on all platforms
    if (this.isOfflineCapable()) {
      await this.registerServiceWorker();
    }

    // Listen to network changes
    this.setupNetworkListeners();

    console.log('✅ Platform initialized successfully');
  }

  /**
   * Initialize Capacitor plugins for mobile
   */
  private async initializeCapacitor() {
    try {
      // Setup status bar (Android/iOS)
      if (this.isAndroid() || this.isIOS()) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0a0a0f' });
      }

      // Setup app state listeners
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed:', isActive ? 'active' : 'background');
        this.handleAppStateChange(isActive);
      });

      // Setup back button handler (Android)
      if (this.isAndroid()) {
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('Back button pressed, can go back:', canGoBack);
          this.handleBackButton(canGoBack);
        });
      }

      // Setup keyboard listeners
      Keyboard.addListener('keyboardWillShow', (info) => {
        console.log('Keyboard will show:', info.keyboardHeight);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        console.log('Keyboard will hide');
      });

      console.log('✅ Capacitor plugins initialized');
    } catch (error) {
      console.error('❌ Capacitor initialization error:', error);
    }
  }

  /**
   * Initialize Electron features for desktop
   */
  private async initializeElectron() {
    try {
      console.log('✅ Electron features initialized');
    } catch (error) {
      console.error('❌ Electron initialization error:', error);
    }
  }

  /**
   * Register service worker for offline support
   */
  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service worker update found');
        });
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
      }
    }
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Network: Online');
      this.handleNetworkChange(true);
    });

    window.addEventListener('offline', () => {
      console.log('📴 Network: Offline');
      this.handleNetworkChange(false);
    });
  }

  /**
   * Handle app state changes (mobile)
   */
  private handleAppStateChange(isActive: boolean) {
    // Emit custom event for app state changes
    window.dispatchEvent(new CustomEvent('kolAppStateChange', {
      detail: { isActive }
    }));
  }

  /**
   * Handle back button press (Android)
   */
  private handleBackButton(canGoBack: boolean) {
    if (canGoBack) {
      window.history.back();
    } else {
      // Emit event to ask user if they want to exit
      window.dispatchEvent(new CustomEvent('kolBackButtonExit'));
    }
  }

  /**
   * Handle network status changes
   */
  private handleNetworkChange(isOnline: boolean) {
    // Emit custom event for network changes
    window.dispatchEvent(new CustomEvent('kolNetworkChange', {
      detail: { isOnline }
    }));
  }

  /**
   * Provide haptic feedback (mobile only)
   */
  async hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.isMobile()) return;

    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light :
                         style === 'heavy' ? ImpactStyle.Heavy :
                         ImpactStyle.Medium;

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  /**
   * Get safe area insets (for notch/rounded corners)
   */
  getSafeAreaInsets() {
    if (!this.isMobile()) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    // Get safe area from CSS env variables
    const getEnvValue = (name: string) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`env(${name})`)
        .trim();
      return value ? parseInt(value) : 0;
    };

    return {
      top: getEnvValue('safe-area-inset-top'),
      bottom: getEnvValue('safe-area-inset-bottom'),
      left: getEnvValue('safe-area-inset-left'),
      right: getEnvValue('safe-area-inset-right'),
    };
  }

  /**
   * Check if feature is supported on current platform
   */
  isFeatureSupported(feature: string): boolean {
    const featureMap: Record<string, Platform[]> = {
      'haptics': ['android', 'ios'],
      'statusBar': ['android', 'ios'],
      'keyboard': ['android', 'ios'],
      'backButton': ['android'],
      'notifications': ['web', 'desktop', 'android', 'ios'],
      'pwa': ['web', 'android'],
      'offlineMode': ['web', 'desktop', 'android', 'ios'],
      'music': ['web', 'desktop', 'android', 'ios'],
      '3d': ['web', 'desktop'],
    };

    const supportedPlatforms = featureMap[feature] || [];
    return supportedPlatforms.includes(this.platform);
  }

  /**
   * Get platform-specific CSS classes
   */
  getPlatformClasses(): string {
    return `platform-${this.platform} ${this.isMobile() ? 'platform-mobile' : ''} ${this.isOnline() ? 'platform-online' : 'platform-offline'}`;
  }

  /**
   * Exit app (mobile only)
   */
  async exitApp() {
    if (!this.isMobile()) {
      console.warn('Exit app is only available on mobile');
      return;
    }

    try {
      await CapacitorApp.exitApp();
    } catch (error) {
      console.error('Failed to exit app:', error);
    }
  }
}

// Export singleton instance
export const platformService = new PlatformService();

// Export types
export type { Platform };

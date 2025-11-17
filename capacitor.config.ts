import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kol.megaapp',
  appName: 'KOL Personal OS',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'app.kolhub.local',
    cleartext: true,
    // Allow network requests for development
    allowNavigation: [
      'http://localhost',
      'https://localhost',
      'http://192.168.*',
      'https://192.168.*'
    ]
  },
  
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0a0a0f',
    scrollEnabled: true,
    allowsLinkPreview: true,
    limitsNavigationsToAppBoundDomains: false
  },
  
  android: {
    backgroundColor: '#0a0a0f',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true, // Enable for debugging
    loggingBehavior: 'debug',
    
    // Enable hardware acceleration
    hardwareAccelerated: true,
    
    // Build configuration
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#7c3aed',
      splashFullScreen: true,
      splashImmersive: true
    },
    
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0f',
      overlay: false
    },
    
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    
    App: {
      handleBackButton: true
    },
    
    Haptics: {
      enabled: true
    },
    
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#7c3aed',
      sound: 'beep.wav'
    },
    
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  
  // Cordova preferences for additional configuration
  cordova: {
    preferences: {
      ScrollEnabled: 'true',
      BackupWebStorage: 'local',
      DisallowOverscroll: 'true',
      EnableViewportScale: 'false',
      KeyboardDisplayRequiresUserAction: 'false',
      SuppressesIncrementalRendering: 'false',
      AndroidPersistentFileLocation: 'Internal',
      LoadUrlTimeoutValue: '700000',
      SplashScreenDelay: '2000',
      AutoHideSplashScreen: 'true',
      FadeSplashScreenDuration: '500',
      ShowSplashScreenSpinner: 'false',
      // Android specific
      AndroidXEnabled: 'true',
      GradlePluginKotlinEnabled: 'true',
      AndroidXMigration: 'true'
    }
  }
};

export default config;

// Build script for generating mobile app downloads
// Run with: node Scripts/build-mobile-downloads.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Mobile App Downloads...\n');

// Create downloads directory
const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
  console.log('✅ Created downloads directory');
}

// Build steps
const steps = [
  {
    name: 'Building web assets',
    command: 'npm run build',
    description: 'Compiling React app for production'
  },
  {
    name: 'Syncing Capacitor',
    command: 'npx cap sync',
    description: 'Updating mobile platforms with latest code'
  }
];

try {
  for (const step of steps) {
    console.log(`\n📦 ${step.name}...`);
    console.log(`   ${step.description}`);
    execSync(step.command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${step.name} complete!`);
  }

  // Create README for downloads
  const readme = `# Mobile App Downloads

## Quick Install (Recommended)

The easiest way to install the KOL app on your mobile device:

1. **Open your phone's browser** (Safari for iOS, Chrome for Android)
2. **Navigate to this website** 
3. **Tap "Install"** when prompted
   - iOS: Tap Share → Add to Home Screen
   - Android: Tap menu → Install app

No downloads needed! Works offline after installation.

## Native App Files (Advanced)

If you want to build native APK (Android) or IPA (iOS) files:

### Android APK
\`\`\`bash
npm run build:android
\`\`\`
Find APK: \`android/app/build/outputs/apk/debug/app-debug.apk\`

### iOS IPA  
\`\`\`bash
npm run build:ios
\`\`\`
Archive in Xcode to create IPA file.

## Requirements

- **Android**: Android Studio + Java JDK
- **iOS**: Xcode (Mac only) + Apple Developer Account

## Documentation

See MOBILE-SETUP.txt for detailed instructions.
`;

  fs.writeFileSync(path.join(downloadsDir, 'README.md'), readme);
  console.log('\n✅ Created downloads README');

  // Create quick reference JSON
  const buildInfo = {
    buildDate: new Date().toISOString(),
    version: require('../package.json').version,
    platforms: {
      web: {
        url: 'Install via browser (recommended)',
        method: 'PWA - Add to Home Screen'
      },
      android: {
        buildCommand: 'npm run build:android',
        outputPath: 'android/app/build/outputs/apk/',
        requirements: 'Android Studio, Java JDK'
      },
      ios: {
        buildCommand: 'npm run build:ios',
        outputPath: 'Archive in Xcode',
        requirements: 'Xcode (Mac), Apple Developer Account'
      }
    },
    features: [
      'Progressive Web App (PWA)',
      'Offline support',
      'Cross-platform compatibility',
      'Auto-updates',
      'Native app feel'
    ]
  };

  fs.writeFileSync(
    path.join(downloadsDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  console.log('✅ Created build info JSON');

  console.log('\n🎉 Mobile download assets ready!');
  console.log('\n📱 Users can now:');
  console.log('   1. Install via browser (PWA) - RECOMMENDED');
  console.log('   2. Build native APK with: npm run build:android');
  console.log('   3. Build native IPA with: npm run build:ios');
  console.log('\n✨ Check public/downloads/ for files\n');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
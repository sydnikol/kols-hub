import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  ai: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-support-hub',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  wearables: {
    fitbit: {
      clientId: process.env.FITBIT_CLIENT_ID || '',
      clientSecret: process.env.FITBIT_CLIENT_SECRET || '',
    },
    apple: {
      teamId: process.env.APPLE_HEALTH_TEAM_ID || '',
    },
  },
  telemedicine: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      apiKey: process.env.TWILIO_API_KEY || '',
      apiSecret: process.env.TWILIO_API_SECRET || '',
    },
  },
  voice: {
    deepgramApiKey: process.env.DEEPGRAM_API_KEY || '',
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  },
  plugins: {
    directory: process.env.PLUGIN_DIR || './plugins',
    enabled: process.env.ENABLE_PLUGINS === 'true',
  },
  localization: {
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,es,fr,de,zh,ja').split(','),
  },
};

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID?: string
  readonly VITE_SPOTIFY_CLIENT_SECRET?: string
  readonly VITE_YOUTUBE_API_KEY?: string
  readonly VITE_SOUNDCLOUD_CLIENT_ID?: string
  readonly VITE_SOUNDCLOUD_CLIENT_SECRET?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_ANTHROPIC_API_KEY?: string
  readonly NODE_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'framer-motion-3d' {
  export * from 'framer-motion'
}

declare module '*.json' {
  const value: any
  export default value
}

// Window interface extensions for Capacitor and platform detection
interface Window {
  platform?: string;
  Capacitor?: any;
  chronoJournal?: any;
}

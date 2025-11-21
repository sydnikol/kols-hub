import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize Education System
// DISABLED: This was blocking app startup
// import './features/education/initEducation'

// Initialize App with Seed Data
import { autoInitialize } from './utils/initializeApp'

// Initialize Dev Console (development only)
if (import.meta.env.DEV) {
  import('./utils/devConsole')
}

// Platform detection and initialization
console.log('🖤 KOL Hub: Initializing application...')
console.log('Platform:', window.platform)

// Auto-initialize app on first run (loads seed data)
// DISABLED: This was blocking app startup
// autoInitialize().then(result => {
//   if (result.success) {
//     console.log('🖤 KOL Hub: Initialization complete -', result.message)
//   } else {
//     console.error('🖤 KOL Hub: Initialization failed -', result.error)
//   }
// })
console.log('🖤 KOL Hub: Skipping auto-initialization for faster startup')

// Initialize Capacitor plugins if on mobile
if (window.Capacitor) {
  import('@capacitor/app').then(({ App: CapApp }) => {
    console.log('🖤 KOL Hub: Capacitor initialized')
    
    // Handle app state changes
    CapApp.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive)
    })
    
    // Handle back button on Android
    CapApp.addListener('backButton', () => {
      console.log('Back button pressed')
      // Handle navigation
    })
  }).catch(err => {
    console.warn('Capacitor initialization failed:', err)
  })
}

// Render the app
const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  console.log('🖤 KOL Hub: Application mounted successfully')
} else {
  console.error('🖤 KOL Hub: Root element not found!')
}

// Handle unhandled errors
window.addEventListener('error', (event) => {
  console.error('🖤 KOL Hub: Unhandled error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('🖤 KOL Hub: Unhandled promise rejection:', event.reason)
})

// Log app readiness
console.log('🖤 KOL Hub: Ready to evolve with you')
console.log('Version: 3.0.0')
console.log('Built with: React + TypeScript + Vite')
console.log('🖤 "One hand on the keyboard, one hand on the altar"')

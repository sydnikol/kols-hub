import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize Education System
import './features/education/initEducation'

// Platform detection and initialization
console.log('🖤 KOL Hub: Initializing application...')
console.log('Platform:', window.platform)

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

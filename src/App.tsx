import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu, X, Home, Heart, Brain, Book, Gamepad2, Music, Users, Wrench, Sparkles } from 'lucide-react';

// ChronoMuse - Main 3D AI Companion & Luxury Apartment
import { ChronoMuseApartment } from './features/chronomuse';

// Health & Wellness
import MedicationDashboard from './components/health/MedicationDashboard';
import HealthTracker from './components/HealthTracker';
import { VitalsTracker } from './components/VitalsTracker';

// Mental Health & Support
import MentalHealthPage from './pages/MentalHealthPage';

// Education & Learning  
import EducationPage from './pages/EducationPage';
import LearningHubPage from './pages/LearningHubPage';

// Entertainment & Creativity
import EntertainmentHubPage from './pages/EntertainmentHubPage';
// TODO: Create DnDBeyond component or remove usage
// import { DnDBeyondHub } from './components/DnDBeyond';
import { MusicSanctuary } from './components/MusicSanctuary';
import { GameLibrary } from './components/GameLibrary';

// Community & Activism
import KollectivePage from './pages/KollectivePage';

// Lifestyle & Daily Living
import KitchenWitchPage from './pages/KitchenWitchPage';
import SewingStudioPage from './pages/SewingStudioPage';
import HearingCompanionPage from './pages/HearingCompanionPage';

// Ideas & Organization
import IdeasVaultPage from './pages/IdeasVaultPage';

// Avatar & Identity
import AvatarDressingRoom from './components/avatar/AvatarDressingRoom';

// Finance & Resources
import FinanceTracker from './components/FinanceTracker';
import { PassiveIncomeEngine } from './components/PassiveIncomeEngine';

// Spiritual & Reflective
import SpiritualReflection from './components/SpiritualReflection';
import { DreamJournal } from './components/DreamJournal';

// System Components
import { ThemeManager } from './components/ThemeManager';
import { PluginSystem } from './components/PluginSystem';
import SelfEvolvingLog from './components/SelfEvolvingLog';

// Mobile Downloads
import MobileDownloads from './components/MobileDownloads';

// Styles
import './styles/App.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  const navigation: NavItem[] = [
    // Core
    { path: '/', label: 'ChronoMuse Home', icon: <Home className="w-5 h-5" />, category: 'core' },
    
    // Health & Wellness
    { path: '/health', label: 'Health Overview', icon: <Heart className="w-5 h-5" />, category: 'health' },
    { path: '/health/medications', label: 'Medications', icon: <Heart className="w-5 h-5" />, category: 'health' },
    { path: '/health/vitals', label: 'Vitals Tracking', icon: <Heart className="w-5 h-5" />, category: 'health' },
    { path: '/mental-health', label: 'Mental Health', icon: <Brain className="w-5 h-5" />, category: 'health' },
    
    // Education & Learning
    { path: '/education', label: 'Education Hub', icon: <Book className="w-5 h-5" />, category: 'learning' },
    { path: '/learning', label: 'Passive Learning', icon: <Book className="w-5 h-5" />, category: 'learning' },
    
    // Entertainment & Creativity
    { path: '/entertainment', label: 'Entertainment Hub', icon: <Sparkles className="w-5 h-5" />, category: 'entertainment' },
    { path: '/dnd', label: 'D&D Beyond', icon: <Gamepad2 className="w-5 h-5" />, category: 'entertainment' },
    { path: '/music', label: 'Music Sanctuary', icon: <Music className="w-5 h-5" />, category: 'entertainment' },
    { path: '/games', label: 'Game Library', icon: <Gamepad2 className="w-5 h-5" />, category: 'entertainment' },
    
    // Community & Activism
    { path: '/kollective', label: 'The Kollective', icon: <Users className="w-5 h-5" />, category: 'community' },
    
    // Lifestyle
    { path: '/kitchen', label: 'Kitchen Witch', icon: <Sparkles className="w-5 h-5" />, category: 'lifestyle' },
    { path: '/sewing', label: 'Sewing Studio', icon: <Wrench className="w-5 h-5" />, category: 'lifestyle' },
    { path: '/hearing', label: 'Hearing Companion', icon: <Heart className="w-5 h-5" />, category: 'lifestyle' },
    
    // Personal
    { path: '/ideas', label: 'Ideas Vault', icon: <Sparkles className="w-5 h-5" />, category: 'personal' },
    { path: '/avatar', label: 'Avatar Room', icon: <Sparkles className="w-5 h-5" />, category: 'personal' },
    { path: '/spiritual', label: 'Spiritual Reflection', icon: <Sparkles className="w-5 h-5" />, category: 'personal' },
    { path: '/dreams', label: 'Dream Journal', icon: <Brain className="w-5 h-5" />, category: 'personal' },
    
    // Finance
    { path: '/finance', label: 'Finance Tracker', icon: <Wrench className="w-5 h-5" />, category: 'finance' },
    { path: '/income', label: 'Passive Income', icon: <Wrench className="w-5 h-5" />, category: 'finance' },
    
    // System
    { path: '/themes', label: 'Theme Manager', icon: <Wrench className="w-5 h-5" />, category: 'system' },
    { path: '/plugins', label: 'Plugin System', icon: <Wrench className="w-5 h-5" />, category: 'system' },
    { path: '/evolution', label: 'Evolution Log', icon: <Wrench className="w-5 h-5" />, category: 'system' },
    
    // Mobile
    { path: '/downloads', label: 'Mobile Downloads', icon: <Wrench className="w-5 h-5" />, category: 'system' },
  ];

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'core', label: 'Core' },
    { id: 'health', label: 'Health & Wellness' },
    { id: 'learning', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'community', label: 'Community' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'personal', label: 'Personal' },
    { id: 'finance', label: 'Finance' },
    { id: 'system', label: 'System' },
  ];

  const filteredNav = currentCategory === 'all' 
    ? navigation 
    : navigation.filter(item => item.category === currentCategory);

  useEffect(() => {
    // Initialize offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('✅ Service Worker registered:', reg.scope))
        .catch(err => console.error('❌ Service Worker registration failed:', err));
    }
    
    // Log app initialization
    console.log('🖤 KOL Personal OS Initialized - Gothic Futurism Edition');
    console.log('📱 Platform:', navigator.platform);
    console.log('🌐 Online:', navigator.onLine);
  }, []);

  return (
    <Router>
      <div className="app-container w-full min-h-screen bg-black text-white overflow-x-hidden">
        {/* Toast Notifications - Gothic Style */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'linear-gradient(135deg, #1a0633 0%, #0a0118 100%)',
              color: '#a78bfa',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              boxShadow: '0 0 20px rgba(167, 139, 250, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#a78bfa',
                secondary: '#1a0633',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#1a0633',
              },
            },
          }}
        />

        {/* Navigation Header - Collapsible Gothic Menu */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-xl border-b border-purple-500/30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                KOL - Your Self-Evolving Personal OS
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="hidden sm:inline">{navigator.onLine ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Expandable Navigation Menu */}
          {menuOpen && (
            <div className="border-t border-purple-500/30 bg-black/50 backdrop-blur-xl">
              {/* Category Filter */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                      currentCategory === cat.id
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Navigation Links */}
              <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                {filteredNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/30 hover:from-purple-800/40 hover:to-indigo-800/40 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                  >
                    <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="pt-16">
          <Routes>
            {/* Core - ChronoMuse Luxury Apartment */}
            <Route path="/" element={<ChronoMuseApartment />} />
            <Route path="/chronomuse" element={<ChronoMuseApartment />} />

            {/* Health & Wellness */}
            <Route path="/health" element={<HealthTracker />} />
            <Route path="/health/medications" element={<MedicationDashboard />} />
            <Route path="/health/vitals" element={<VitalsTracker />} />
            <Route path="/mental-health" element={<MentalHealthPage />} />

            {/* Education & Learning */}
            <Route path="/education" element={<EducationPage />} />
            <Route path="/learning" element={<LearningHubPage />} />

            {/* Entertainment & Creativity */}
            <Route path="/entertainment" element={<EntertainmentHubPage />} />
            {/* TODO: Re-enable when DnDBeyond component is created */}
            {/* <Route path="/dnd" element={<DnDBeyondHub />} /> */}
            <Route path="/music" element={<MusicSanctuary />} />
            <Route path="/games" element={<GameLibrary />} />

            {/* Community & Activism */}
            <Route path="/kollective" element={<KollectivePage />} />

            {/* Lifestyle */}
            <Route path="/kitchen" element={<KitchenWitchPage />} />
            <Route path="/sewing" element={<SewingStudioPage />} />
            <Route path="/hearing" element={<HearingCompanionPage />} />

            {/* Personal */}
            <Route path="/ideas" element={<IdeasVaultPage />} />
            <Route path="/avatar" element={<AvatarDressingRoom />} />
            <Route path="/spiritual" element={<SpiritualReflection />} />
            <Route path="/dreams" element={<DreamJournal />} />

            {/* Finance */}
            <Route path="/finance" element={<FinanceTracker />} />
            <Route path="/income" element={<PassiveIncomeEngine />} />

            {/* System */}
            <Route path="/themes" element={<ThemeManager />} />
            <Route path="/plugins" element={<PluginSystem />} />
            <Route path="/evolution" element={<SelfEvolvingLog />} />

            {/* Mobile */}
            <Route path="/downloads" element={<MobileDownloads />} />

            {/* Fallback */}
            <Route path="*" element={<ChronoMuseApartment />} />
          </Routes>
        </main>

        {/* Footer - Status Bar */}
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-xl border-t border-purple-500/30 px-4 py-2 text-xs text-purple-300 flex justify-between items-center z-40">
          <span>🖤 Gothic Futurism Edition v1.0</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;

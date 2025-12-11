import React, { useState, useEffect, Suspense } from 'react';
import { IntegrationProvider } from './contexts/IntegrationContext';

// Lazy loaded pages
const AuthCallbackPage = React.lazy(() => import('./pages/AuthCallbackPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const IntegrationsStatusPage = React.lazy(() => import('./pages/IntegrationsStatusPage'));
const RealMoneyDashboard = React.lazy(() => import('./pages/RealMoneyDashboard'));
const ChronoMusePage = React.lazy(() => import('./pages/ChronoMusePage'));
const HealthDashboardPage = React.lazy(() => import('./pages/HealthDashboardPage'));
const MentalHealthPage = React.lazy(() => import('./pages/MentalHealthPage'));
const MentalHealthDashboard = React.lazy(() => import('./pages/MentalHealthDashboard'));
const LearningHubPage = React.lazy(() => import('./pages/LearningHubPage'));
const FinanceDashboardPage = React.lazy(() => import('./pages/FinanceDashboardPage'));
const CreativeArtsDashboardPage = React.lazy(() => import('./pages/CreativeArtsDashboardPage'));
const RelationshipDashboardPage = React.lazy(() => import('./pages/RelationshipDashboardPage'));
const KollectivePage = React.lazy(() => import('./pages/KollectivePage'));
const IdeasVaultPage = React.lazy(() => import('./pages/IdeasVaultPage'));
const GamingHubPage = React.lazy(() => import('./pages/GamingHubPage'));
const BoardGamesPage = React.lazy(() => import('./pages/BoardGamesPage'));
const AutomationPage = React.lazy(() => import('./pages/AutomationPage'));
const AIPassiveIncomePage = React.lazy(() => import('./pages/AIPassiveIncomePage'));
const PassiveIncomeBuilderPage = React.lazy(() => import('./pages/PassiveIncomeBuilderPage'));
const PassiveIncomeDashboardPage = React.lazy(() => import('./pages/PassiveIncomeDashboardPage'));
const ContentMonetizationPage = React.lazy(() => import('./pages/ContentMonetizationPage'));
const RealMoneyActionPlan = React.lazy(() => import('./pages/RealMoneyActionPlan'));
const ContentGenerationHub = React.lazy(() => import('./pages/ContentGenerationHub'));
const MegaFeatureDashboard = React.lazy(() => import('./pages/MegaFeatureDashboard'));
const HuluStreamingHub = React.lazy(() => import('./pages/HuluStreamingHub'));
const EnterpriseMonitoringDashboard = React.lazy(() => import('./pages/EnterpriseMonitoringDashboard'));
const MCPServersHub = React.lazy(() => import('./pages/MCPServersHub'));
const MobileDownloads = React.lazy(() => import('./components/MobileDownloads'));
const InworldAIHub = React.lazy(() => import('./pages/InworldAIHub'));
const ZapierAutomationHub = React.lazy(() => import('./pages/ZapierAutomationHub'));
const AIConfigurationHub = React.lazy(() => import('./pages/AIConfigurationHub'));
const AICharacterHub = React.lazy(() => import('./pages/AICharacterHub'));
const ClaudeChatPage = React.lazy(() => import('./pages/ClaudeChatPage'));
const AdvocacyHubPage = React.lazy(() => import('./pages/AdvocacyHubPage'));
const CaregiverDashboardPage = React.lazy(() => import('./pages/CaregiverDashboardPage'));
const CarManagementHubPage = React.lazy(() => import('./pages/CarManagementHubPage'));
const CertificationsHubPage = React.lazy(() => import('./pages/CertificationsHubPage'));
const CommunityEventsHubPage = React.lazy(() => import('./pages/CommunityEventsHubPage'));
const CookingHubPage = React.lazy(() => import('./pages/CookingHubPage'));
const CourseManagementHubPage = React.lazy(() => import('./pages/CourseManagementHubPage'));
const CrisisSupportPage = React.lazy(() => import('./pages/CrisisSupportPage'));
const DebtManagementHubPage = React.lazy(() => import('./pages/DebtManagementHubPage'));
const DisabilityAccommodationsHubPage = React.lazy(() => import('./pages/DisabilityAccommodationsHubPage'));
const EmergencyPrepHubPage = React.lazy(() => import('./pages/EmergencyPrepHubPage'));
const EmploymentHubPage = React.lazy(() => import('./pages/EmploymentHubPage'));
const EntertainmentHubPage = React.lazy(() => import('./pages/EntertainmentHubPage'));
const EntertainmentLibraryPage = React.lazy(() => import('./pages/EntertainmentLibraryPage'));
const ExpenseTrackingHubPage = React.lazy(() => import('./pages/ExpenseTrackingHubPage'));
const FashionHubPage = React.lazy(() => import('./pages/FashionHubPage'));
const FitnessHubPage = React.lazy(() => import('./pages/FitnessHubPage'));
const FoodHubPage = React.lazy(() => import('./pages/FoodHubPage'));
const GardeningHubPage = React.lazy(() => import('./pages/GardeningHubPage'));
const GoalsHubPage = React.lazy(() => import('./pages/GoalsHubPage'));
const GoogleEcosystemPage = React.lazy(() => import('./pages/GoogleEcosystemPage'));
const HabitsHubPage = React.lazy(() => import('./pages/HabitsHubPage'));
const HearingCompanionPage = React.lazy(() => import('./pages/HearingCompanionPage'));
const HobbiesHubPage = React.lazy(() => import('./pages/HobbiesHubPage'));
const HomeMaintenanceHubPage = React.lazy(() => import('./pages/HomeMaintenanceHubPage'));
const HomeManagementHubPage = React.lazy(() => import('./pages/HomeManagementHubPage'));
const HousingHubPage = React.lazy(() => import('./pages/HousingHubPage'));
const IdentityHubPage = React.lazy(() => import('./pages/IdentityHubPage'));
const InvestmentsHubPage = React.lazy(() => import('./pages/InvestmentsHubPage'));
const JournalingHubPage = React.lazy(() => import('./pages/JournalingHubPage'));
const KitchenWitchPage = React.lazy(() => import('./pages/KitchenWitchPage'));
const LegalResourcesHubPage = React.lazy(() => import('./pages/LegalResourcesHubPage'));
const MediaLibraryPage = React.lazy(() => import('./pages/MediaLibraryPage'));
const MedicalAdvocacyHubPage = React.lazy(() => import('./pages/MedicalAdvocacyHubPage'));
const MedicalPortalsHubPage = React.lazy(() => import('./pages/MedicalPortalsHubPage'));
const MemoriesHubPage = React.lazy(() => import('./pages/MemoriesHubPage'));
const MentorshipHubPage = React.lazy(() => import('./pages/MentorshipHubPage'));
const NetworkingHubPage = React.lazy(() => import('./pages/NetworkingHubPage'));
const NutritionHubPage = React.lazy(() => import('./pages/NutritionHubPage'));
const PetCareHubPage = React.lazy(() => import('./pages/PetCareHubPage'));
const PixelWatchPage = React.lazy(() => import('./pages/PixelWatchPage'));
const PodcastsHubPage = React.lazy(() => import('./pages/PodcastsHubPage'));
const ReadingHubPage = React.lazy(() => import('./pages/ReadingHubPage'));
const ResearchHubPage = React.lazy(() => import('./pages/ResearchHubPage'));
const SavingsGoalsHubPage = React.lazy(() => import('./pages/SavingsGoalsHubPage'));
const SewingStudioPage = React.lazy(() => import('./pages/SewingStudioPage'));
const SkillsDevelopmentHubPage = React.lazy(() => import('./pages/SkillsDevelopmentHubPage'));
const SleepTrackingHubPage = React.lazy(() => import('./pages/SleepTrackingHubPage'));
const SocialConnectionHubPage = React.lazy(() => import('./pages/SocialConnectionHubPage'));
const SpiritualityHubPage = React.lazy(() => import('./pages/SpiritualityHubPage'));
const StreamingHubPage = React.lazy(() => import('./pages/StreamingHubPage'));
const StudyTrackingHubPage = React.lazy(() => import('./pages/StudyTrackingHubPage'));
const TherapyHubPage = React.lazy(() => import('./pages/TherapyHubPage'));
const TimeManagementHubPage = React.lazy(() => import('./pages/TimeManagementHubPage'));
const TransportationHubPage = React.lazy(() => import('./pages/TransportationHubPage'));
const TravelHubPage = React.lazy(() => import('./pages/TravelHubPage'));
const UIGeneratorPage = React.lazy(() => import('./pages/UIGeneratorPage'));
const VolunteerHubPage = React.lazy(() => import('./pages/VolunteerHubPage'));
const WellnessHubPage = React.lazy(() => import('./pages/WellnessHubPage'));
const BudgetingHubPage = React.lazy(() => import('./pages/BudgetingHubPage'));
const SyncBackupPage = React.lazy(() => import('./pages/SyncBackupPage'));
const UnifiedDashboard = React.lazy(() => import('./pages/UnifiedDashboard'));
const CaregiverDashboard = React.lazy(() => import('./pages/CaregiverDashboard'));
const VirtualWardrobePage = React.lazy(() => import('./pages/VirtualWardrobePage'));
const AncestryPage = React.lazy(() => import('./pages/AncestryPage'));
const PhoneContactsPage = React.lazy(() => import('./pages/PhoneContactsPage'));
const AILifeManagerPage = React.lazy(() => import('./pages/AILifeManagerPage'));
const Mobile3DAvatarPage = React.lazy(() => import('./pages/Mobile3DAvatarPage'));
const ThemeStudioPage = React.lazy(() => import('./pages/ThemeStudioPage'));
const SmartHomePage = React.lazy(() => import('./pages/SmartHomePage'));
const DnDPage = React.lazy(() => import('./pages/DnDPage'));
const AllFeaturesHub = React.lazy(() => import('./pages/AllFeaturesHub'));
const HealthLogsHub = React.lazy(() => import('./pages/health/HealthLogsHub'));
const TrendsCorrelationsPage = React.lazy(() => import('./pages/health/TrendsCorrelationsPage'));
const SelfAdvocacyHub = React.lazy(() => import('./pages/advocacy/SelfAdvocacyHub'));
const AIAvatarTeacherPage = React.lazy(() => import('./pages/AIAvatarTeacherPage'));
const GothicApartmentPage = React.lazy(() => import('./pages/GothicApartmentPage'));
const PhoneConnectorPage = React.lazy(() => import('./pages/PhoneConnectorPage'));
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Heart, Brain, Music, Palette, Book,
  DollarSign, Users, Settings, Moon, Sun, Wifi, WifiOff,
  Calendar, Pill, Activity, Shield, Code, Gamepad2,
  Sparkles, Package, MessageSquare, MessageCircle, ChevronRight, Phone, LogIn, LogOut, User
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useIntegrations } from './contexts/IntegrationContext';

// Import components normally - they're needed for initial render
import MedicationTracker from './components/MedicationTracker';
import AvatarDressingRoom from './components/avatar/AvatarDressingRoom';

// Import all pages














// Additional Hub Pages













































































// Header component with auth
const AppHeader: React.FC<{
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isOnline: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}> = ({ darkMode, setDarkMode, isOnline, sidebarOpen, setSidebarOpen }) => {
  const { isAuthenticated, user, login, logout } = useIntegrations();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 via-black/90 to-pink-900/90 backdrop-blur-lg border-b border-purple-500/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-purple-800/50 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-2">
            <Sparkles className="text-purple-400" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kol's Hub
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Online/Offline Indicator */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="text-green-400" size={20} />
            ) : (
              <WifiOff className="text-yellow-400" size={20} />
            )}
            <span className="text-sm hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Auth Status */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-900/30 rounded-lg border border-green-500/30">
                <User size={16} className="text-green-400" />
                <span className="text-sm text-green-300">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-800/50 transition-colors text-red-400"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <LogIn size={18} />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-purple-800/50 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentCategory, setCurrentCategory] = useState('all');

  // Navigation structure with 9,000+ features organized
  const navigationCategories = [
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      routes: [
        { path: '/health', name: 'Health Dashboard', icon: Activity },
        { path: '/health/logs', name: 'Health Logs Hub', icon: Activity },
        { path: '/health/trends', name: 'Trends & Correlations', icon: Activity },
        { path: '/medications', name: 'Medication Tracker', icon: Pill },
        { path: '/vitals', name: 'Vitals Monitor', icon: Activity },
        { path: '/mental-health', name: 'Mental Health', icon: Brain },
        { path: '/emergency', name: 'Emergency Support', icon: Shield },
        { path: '/contacts', name: 'Phone Contacts', icon: Phone },
      ]
    },
    {
      id: 'ai',
      name: 'AI & Companion',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      routes: [
        { path: '/ai-config', name: 'AI Configuration Hub', icon: Settings },
        { path: '/claude-chat', name: 'Claude AI Chat', icon: MessageCircle },
        { path: '/ai-characters', name: 'AI Character Hub', icon: MessageCircle },
        { path: '/ai-life-manager', name: 'AI Life Manager', icon: Brain },
        { path: '/chronomuse', name: 'ChronoMuse AI', icon: Sparkles },
        { path: '/inworld-ai', name: 'Inworld AI Characters', icon: Users },
        { path: '/mcp-servers', name: 'MCP Servers', icon: Brain },
        { path: '/avatar', name: '3D Avatar', icon: Users },
        { path: '/ai-avatar-teacher', name: 'AI Avatar Teacher', icon: Users },
        { path: '/gothic-apartment', name: 'Gothic Apartment', icon: Home },
        { path: '/sanctum', name: 'Sanctum Rooms', icon: Home },
      ]
    },
    {
      id: 'creative',
      name: 'Creative & Music',
      icon: Music,
      color: 'from-blue-500 to-cyan-500',
      routes: [
        { path: '/music', name: 'Music Hub', icon: Music },
        { path: '/creative', name: 'Creative Studio', icon: Palette },
        { path: '/poetry', name: 'Poetry Corner', icon: Book },
        { path: '/photography', name: 'Photo Portfolio', icon: Palette },
        { path: '/wardrobe', name: 'Virtual Wardrobe', icon: Heart },
        { path: '/fashion', name: 'Fashion Hub', icon: Sparkles },
        { path: '/sewing', name: 'Sewing Studio', icon: Palette },
      ]
    },
    {
      id: 'advocacy',
      name: 'Advocacy & Support',
      icon: Users,
      color: 'from-green-500 to-teal-500',
      routes: [
        { path: '/advocacy', name: 'Advocacy Tools', icon: MessageSquare },
        { path: '/advocacy/hub', name: 'Self-Advocacy Hub', icon: MessageSquare },
        { path: '/scripts', name: 'Self-Advocacy Scripts', icon: Book },
        { path: '/handbooks', name: 'Support Handbooks', icon: Shield },
        { path: '/community', name: 'Community Organizing', icon: Users },
      ]
    },
    {
      id: 'education',
      name: 'Education & Learning',
      icon: Book,
      color: 'from-yellow-500 to-orange-500',
      routes: [
        { path: '/education', name: 'Education Portal', icon: Book },
        { path: '/credits', name: 'College Credits', icon: Calendar },
        { path: '/languages', name: 'Language Learning', icon: MessageSquare },
        { path: '/skills', name: 'Skill Development', icon: Code },
      ]
    },
    {
      id: 'financial',
      name: 'Financial & Income',
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      routes: [
        { path: '/financial', name: 'Financial Manager', icon: DollarSign },
        { path: '/real-money', name: 'Real Money Dashboard', icon: DollarSign },
        { path: '/real-money-plan', name: '$1,500/Day Action Plan', icon: Sparkles },
        { path: '/content-generation-hub', name: 'Content Generation Hub', icon: Code },
        { path: '/zapier-automation', name: 'Zapier Automation', icon: Code },
        { path: '/passive-income', name: 'Passive Income', icon: Package },
        { path: '/income-builder', name: 'Income Builder', icon: DollarSign },
        { path: '/benefits', name: 'Disability Benefits', icon: Shield },
        { path: '/budget', name: 'Spoon-Cost Budget', icon: Activity },
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming & Entertainment',
      icon: Gamepad2,
      color: 'from-pink-500 to-purple-500',
      routes: [
        { path: '/gaming', name: 'Gaming Hub', icon: Gamepad2 },
        { path: '/dnd', name: 'D&D Game', icon: Gamepad2 },
        { path: '/campaigns', name: 'Campaign Manager', icon: Book },
        { path: '/hulu-streaming', name: 'Hulu Streaming Hub', icon: Activity },
        { path: '/entertainment-library', name: 'Entertainment Library', icon: Music },
        { path: '/entertainment', name: 'Entertainment Hub', icon: Music },
      ]
    },
    {
      id: 'automation',
      name: 'Automation & Tools',
      icon: Code,
      color: 'from-gray-500 to-blue-500',
      routes: [
        { path: '/automation', name: 'Task Automation', icon: Code },
        { path: '/enterprise-monitoring', name: 'Enterprise Monitoring', icon: Activity },
        { path: '/mcp-servers', name: 'MCP Servers', icon: Code },
        { path: '/smarthome', name: 'Smart Home', icon: Home },
        { path: '/developer', name: 'Developer Tools', icon: Code },
        { path: '/kolhub', name: 'KOL Hub (9000+ ideas)', icon: Sparkles },
        { path: '/ideas', name: 'Ideas Vault', icon: Sparkles },
      ]
    },
    {
      id: 'relationship',
      name: 'Relationships',
      icon: Users,
      color: 'from-red-500 to-pink-500',
      routes: [
        { path: '/relationships', name: 'Relationship Dashboard', icon: Heart },
        { path: '/kollective', name: 'Kollective', icon: Users },
        { path: '/ancestry', name: 'Family Heritage', icon: Users },
      ]
    },
    {
      id: 'settings',
      name: 'Settings & System',
      icon: Settings,
      color: 'from-gray-600 to-gray-800',
      routes: [
        { path: '/settings', name: 'Settings', icon: Settings },
        { path: '/integrations-status', name: 'Integrations', icon: Activity },
        { path: '/theme-studio', name: 'Theme Studio', icon: Palette },
        { path: '/backup', name: 'Backup & Sync', icon: Shield },
        { path: '/about', name: 'About KOL OS', icon: Sparkles },
      ]
    },
    {
      id: 'all-features',
      name: 'Browse All Features',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      routes: [
        { path: '/all-features', name: 'All 9,000+ Features', icon: Sparkles },
        { path: '/mega-dashboard', name: 'Mega Feature Dashboard (9,999,999+)', icon: Package },
      ]
    }
  ];

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast('Working offline', { icon: '📴' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize app services on mount - delayed to let UI render first
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Delay initialization to ensure UI renders first
        await new Promise(resolve => setTimeout(resolve, 100));

        const { appInitializer } = await import('./utils/appInitializer');

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Initialization timeout')), 10000)
        );

        await Promise.race([appInitializer.initialize(), timeoutPromise]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // App continues to work even if initialization fails
      }
    };

    initializeApp();
  }, []);

  return (
    <IntegrationProvider>
      <Router>
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <AppHeader
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isOnline={isOnline}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Sidebar Backdrop Overlay - Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ top: '64px' }}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed left-0 top-16 bottom-0 z-40 w-72 md:w-80 bg-gradient-to-b from-purple-950/95 via-black/95 to-pink-950/95 backdrop-blur-lg border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto shadow-2xl`}>
          <div className="p-4">
            {/* Category Filter */}
            <div className="mb-6">
              <select
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                className="w-full px-3 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Categories</option>
                {navigationCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-6">
              {navigationCategories
                .filter(cat => currentCategory === 'all' || cat.id === currentCategory)
                .map(category => (
                  <div key={category.id}>
                    <h3 className={`text-sm font-semibold mb-2 bg-gradient-to-r ${category.color} bg-clip-text text-transparent flex items-center`}>
                      <category.icon size={18} className="mr-2" />
                      {category.name}
                    </h3>
                    <div className="space-y-1 ml-6">
                      {category.routes.map(route => (
                        <NavLink
                          key={route.path}
                          to={route.path}
                          className={({ isActive }) => `
                            flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
                            ${isActive 
                              ? 'bg-purple-800/50 text-purple-300' 
                              : 'hover:bg-purple-900/30 text-gray-400 hover:text-white'
                            }
                          `}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <route.icon size={18} />
                          <span className="text-sm">{route.name}</span>
                          <ChevronRight size={14} className="ml-auto opacity-50" />
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-semibold mb-3">System Status</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Features Active</span>
                  <span className="text-green-400">9,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Used</span>
                  <span>42.3 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync</span>
                  <span>2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-purple-400">4.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`pt-20 transition-all ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-lg">Loading...</p>
                </div>
              </div>
            }>
            <Routes>
              <Route path="/" element={<UnifiedDashboard />} />
              <Route path="/dashboard" element={<UnifiedDashboard />} />
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/download" element={<MobileDownloads />} />

              {/* Health & Wellness */}
              <Route path="/health" element={<HealthDashboardPage />} />
              <Route path="/health/logs" element={<HealthLogsHub />} />
              <Route path="/health/trends" element={<TrendsCorrelationsPage />} />
              <Route path="/medications" element={<MedicationTracker />} />
              <Route path="/vitals" element={<HealthDashboardPage />} />
              <Route path="/mental-health" element={<MentalHealthPage />} />
              <Route path="/mental-health-dashboard" element={<MentalHealthDashboard />} />
              <Route path="/emergency" element={<CrisisSupportPage />} />
              <Route path="/contacts" element={<PhoneContactsPage />} />
              <Route path="/fitness" element={<FitnessHubPage />} />
              <Route path="/nutrition" element={<NutritionHubPage />} />
              <Route path="/sleep" element={<SleepTrackingHubPage />} />
              <Route path="/therapy" element={<TherapyHubPage />} />
              <Route path="/wellness" element={<WellnessHubPage />} />

              {/* AI & Companion */}
              <Route path="/ai-config" element={<AIConfigurationHub />} />
              <Route path="/claude-chat" element={<ClaudeChatPage />} />
              <Route path="/ai-characters" element={<AICharacterHub />} />
              <Route path="/ai-life-manager" element={<AILifeManagerPage />} />
              <Route path="/chronomuse" element={<ChronoMusePage />} />
              <Route path="/inworld-ai" element={<InworldAIHub />} />
              <Route path="/mcp-servers" element={<MCPServersHub />} />
              <Route path="/avatar" element={<AvatarDressingRoom />} />
              <Route path="/ai-avatar-teacher" element={<AIAvatarTeacherPage />} />
              <Route path="/gothic-apartment" element={<GothicApartmentPage />} />
              <Route path="/sanctum" element={<ChronoMusePage />} />

              {/* Creative & Music */}
              <Route path="/music" element={<ChronoMusePage />} />
              <Route path="/creative" element={<CreativeArtsDashboardPage />} />
              <Route path="/poetry" element={<CreativeArtsDashboardPage />} />
              <Route path="/photography" element={<MediaLibraryPage />} />
              <Route path="/media" element={<MediaLibraryPage />} />

              {/* Advocacy & Support */}
              <Route path="/advocacy" element={<AdvocacyHubPage />} />
              <Route path="/advocacy/hub" element={<SelfAdvocacyHub />} />
              <Route path="/scripts" element={<AdvocacyHubPage />} />
              <Route path="/handbooks" element={<AdvocacyHubPage />} />
              <Route path="/community" element={<CommunityEventsHubPage />} />
              <Route path="/medical-advocacy" element={<MedicalAdvocacyHubPage />} />
              <Route path="/caregiver" element={<CaregiverDashboardPage />} />

              {/* Education & Learning */}
              <Route path="/education" element={<LearningHubPage />} />
              <Route path="/credits" element={<CertificationsHubPage />} />
              <Route path="/certifications" element={<CertificationsHubPage />} />
              <Route path="/languages" element={<LearningHubPage />} />
              <Route path="/skills" element={<SkillsDevelopmentHubPage />} />
              <Route path="/courses" element={<CourseManagementHubPage />} />
              <Route path="/study" element={<StudyTrackingHubPage />} />
              <Route path="/research" element={<ResearchHubPage />} />

              {/* Financial & Income */}
              <Route path="/financial" element={<FinanceDashboardPage />} />
              <Route path="/real-money" element={<RealMoneyDashboard />} />
              <Route path="/passive-income" element={<AIPassiveIncomePage />} />
              <Route path="/income-builder" element={<PassiveIncomeBuilderPage />} />
              <Route path="/passive-income-dashboard" element={<PassiveIncomeDashboardPage />} />
              <Route path="/content-monetization" element={<ContentMonetizationPage />} />
              <Route path="/real-money-plan" element={<RealMoneyActionPlan />} />
              <Route path="/content-generation-hub" element={<ContentGenerationHub />} />
              <Route path="/zapier-automation" element={<ZapierAutomationHub />} />
              <Route path="/benefits" element={<DisabilityAccommodationsHubPage />} />
              <Route path="/budget" element={<BudgetingHubPage />} />
              <Route path="/expenses" element={<ExpenseTrackingHubPage />} />
              <Route path="/investments" element={<InvestmentsHubPage />} />
              <Route path="/debt" element={<DebtManagementHubPage />} />
              <Route path="/savings" element={<SavingsGoalsHubPage />} />

              {/* Gaming & Entertainment */}
              <Route path="/gaming" element={<GamingHubPage />} />
              <Route path="/boardgames" element={<BoardGamesPage />} />
              <Route path="/dnd" element={<DnDPage />} />
              <Route path="/campaigns" element={<DnDPage />} />
              <Route path="/hulu-streaming" element={<HuluStreamingHub />} />
              <Route path="/entertainment" element={<EntertainmentHubPage />} />
              <Route path="/entertainment-library" element={<EntertainmentLibraryPage />} />
              <Route path="/streaming" element={<StreamingHubPage />} />
              <Route path="/reading" element={<ReadingHubPage />} />
              <Route path="/podcasts" element={<PodcastsHubPage />} />

              {/* Automation & Tools */}
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/enterprise-monitoring" element={<EnterpriseMonitoringDashboard />} />
              <Route path="/mcp-servers" element={<MCPServersHub />} />
              <Route path="/developer" element={<UIGeneratorPage />} />
              <Route path="/kolhub" element={<GoogleEcosystemPage />} />
              <Route path="/ideas" element={<IdeasVaultPage />} />
              <Route path="/pixel-watch" element={<PixelWatchPage />} />
              <Route path="/smarthome" element={<SmartHomePage />} />

              {/* Relationships */}
              <Route path="/relationships" element={<RelationshipDashboardPage />} />
              <Route path="/kollective" element={<KollectivePage />} />
              <Route path="/social" element={<SocialConnectionHubPage />} />
              <Route path="/networking" element={<NetworkingHubPage />} />
              <Route path="/mentorship" element={<MentorshipHubPage />} />
              <Route path="/ancestry" element={<AncestryPage />} />

              {/* Life Management */}
              <Route path="/goals" element={<GoalsHubPage />} />
              <Route path="/habits" element={<HabitsHubPage />} />
              <Route path="/journaling" element={<JournalingHubPage />} />
              <Route path="/time-management" element={<TimeManagementHubPage />} />
              <Route path="/memories" element={<MemoriesHubPage />} />

              {/* Home & Living */}
              <Route path="/home" element={<HomeManagementHubPage />} />
              <Route path="/home-maintenance" element={<HomeMaintenanceHubPage />} />
              <Route path="/car" element={<CarManagementHubPage />} />
              <Route path="/housing" element={<HousingHubPage />} />
              <Route path="/cooking" element={<CookingHubPage />} />
              <Route path="/food" element={<FoodHubPage />} />
              <Route path="/gardening" element={<GardeningHubPage />} />
              <Route path="/pets" element={<PetCareHubPage />} />
              <Route path="/fashion" element={<FashionHubPage />} />
              <Route path="/wardrobe" element={<VirtualWardrobePage />} />
              <Route path="/sewing" element={<SewingStudioPage />} />

              {/* Resources & Support */}
              <Route path="/emergency-prep" element={<EmergencyPrepHubPage />} />
              <Route path="/employment" element={<EmploymentHubPage />} />
              <Route path="/legal" element={<LegalResourcesHubPage />} />
              <Route path="/medical-portals" element={<MedicalPortalsHubPage />} />
              <Route path="/transportation" element={<TransportationHubPage />} />
              <Route path="/travel" element={<TravelHubPage />} />
              <Route path="/identity" element={<IdentityHubPage />} />
              <Route path="/disability" element={<DisabilityAccommodationsHubPage />} />

              {/* Hobbies & Activities */}
              <Route path="/hobbies" element={<HobbiesHubPage />} />
              <Route path="/volunteer" element={<VolunteerHubPage />} />
              <Route path="/spirituality" element={<SpiritualityHubPage />} />
              <Route path="/kitchen-witch" element={<KitchenWitchPage />} />
              <Route path="/hearing" element={<HearingCompanionPage />} />

              {/* Sync & Backup */}
              <Route path="/sync" element={<SyncBackupPage />} />
              <Route path="/backup" element={<SyncBackupPage />} />
              <Route path="/integrations" element={<IntegrationsStatusPage />} />
              <Route path="/integrations-status" element={<IntegrationsStatusPage />} />

              {/* Theme Studio */}
              <Route path="/theme-studio" element={<ThemeStudioPage />} />

              {/* All Features Hub */}
              <Route path="/all-features" element={<AllFeaturesHub />} />
              <Route path="/mega-dashboard" element={<MegaFeatureDashboard />} />

              {/* Phone Integration */}
              <Route path="/phone-connector" element={<PhoneConnectorPage />} />

              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
            </Suspense>
          </div>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '',
            style: {
              background: darkMode ? '#1a0b2e' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            },
          }}
        />
        </div>
      </Router>
    </IntegrationProvider>
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Kol's Hub
          </h1>
          <p className="text-xl text-gray-400">
            "One hand on the keyboard, one hand on the altar"
          </p>
          <p className="mt-4 text-gray-500">
            Your Self-Evolving Digital Ecosystem • 9,000+ Features • Always Growing
          </p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            title="Medication Tracker"
            description="Import your med_list_20250930_181636.xls and track daily medications"
            icon={Pill}
            path="/medications"
            gradient="from-red-500 to-pink-500"
          />
          <QuickAccessCard
            title="ChronoMuse AI"
            description="Your gothic futurist AI companion with 6 sanctum rooms"
            icon={Brain}
            path="/chronomuse"
            gradient="from-purple-500 to-indigo-500"
          />
          <QuickAccessCard
            title="Health Dashboard"
            description="Comprehensive health tracking for EDS Type 3 and chronic conditions"
            icon={Heart}
            path="/health"
            gradient="from-green-500 to-teal-500"
          />
          <QuickAccessCard
            title="3D Avatar"
            description="Interactive Ready Player Me avatar (ID: 68e94e474099d80b93c9b714)"
            icon={Users}
            path="/avatar"
            gradient="from-blue-500 to-cyan-500"
          />
          <QuickAccessCard
            title="Music Hub"
            description="Spotify, YouTube, SoundCloud integration with mood playlists"
            icon={Music}
            path="/music"
            gradient="from-yellow-500 to-orange-500"
          />
          <QuickAccessCard
            title="KOL Hub"
            description="Browse 9,000+ feature ideas and contribute new ones"
            icon={Sparkles}
            path="/kolhub"
            gradient="from-pink-500 to-purple-500"
          />
        </div>

        {/* Stats Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 backdrop-blur-lg border border-purple-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">9,000+</div>
              <div className="text-sm text-gray-400">Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">10</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-sm text-gray-400">Offline</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">∞</div>
              <div className="text-sm text-gray-400">Evolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Access Card Component
interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  gradient: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  gradient 
}) => {
  return (
    <NavLink
      to={path}
      className="block p-6 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all hover:transform hover:scale-105"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} p-2 mb-4`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </NavLink>
  );
};

export default App;
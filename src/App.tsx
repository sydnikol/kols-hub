import React, { useState, useEffect, Suspense } from 'react';
import { IntegrationProvider } from './contexts/IntegrationContext';

// Lazy loaded pages
const AuthCallbackPage = React.lazy(() => import('./pages/AuthCallbackPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const IntegrationsStatusPage = React.lazy(() => import('./pages/IntegrationsStatusPage'));
const RealMoneyDashboard = React.lazy(() => import('./pages/RealMoneyDashboard'));
const ChronoMusePage = React.lazy(() => import('./pages/ChronoMusePage'));
const HealthDashboardPage = React.lazy(() => import('./pages/HealthDashboardPage'));
const HealthDashboard = React.lazy(() => import('./pages/HealthDashboard'));
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
const ComprehensiveDownloads = React.lazy(() => import('./components/ComprehensiveDownloads'));
const InworldAIHub = React.lazy(() => import('./pages/InworldAIHub'));
const ZapierAutomationHub = React.lazy(() => import('./pages/ZapierAutomationHub'));
const AIConfigurationHub = React.lazy(() => import('./pages/AIConfigurationHub'));
const AICharacterHub = React.lazy(() => import('./pages/AICharacterHub'));
const ClaudeChatPage = React.lazy(() => import('./pages/ClaudeChatPage'));
const AdvocacyHubPage = React.lazy(() => import('./pages/AdvocacyHubPage'));
// CaregiverDashboardPage removed - consolidated into CaregiverDashboard
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
const AnnaArchiveLibraryPage = React.lazy(() => import('./pages/AnnaArchiveLibraryPage'));
const FreeSoftwareCompliancePage = React.lazy(() => import('./pages/FreeSoftwareCompliancePage'));
const LibreResourcesHubPage = React.lazy(() => import('./pages/LibreResourcesHubPage'));
const LibreResourcesHub = React.lazy(() => import('./pages/LibreResourcesHub'));
const DirectAccessHubPage = React.lazy(() => import('./pages/DirectAccessHubPage'));
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
// VirtualWardrobePage removed - consolidated into FashionHubPage
const AncestryPage = React.lazy(() => import('./pages/AncestryPage'));
const PhoneContactsPage = React.lazy(() => import('./pages/PhoneContactsPage'));
const AILifeManagerPage = React.lazy(() => import('./pages/AILifeManagerPage'));
const Mobile3DAvatarPage = React.lazy(() => import('./pages/Mobile3DAvatarPage'));
const ThemeStudioPage = React.lazy(() => import('./pages/ThemeStudioPage'));
const SmartHomePage = React.lazy(() => import('./pages/SmartHomePage'));
const DnDPage = React.lazy(() => import('./pages/DnDPage'));
const AllFeaturesHub = React.lazy(() => import('./pages/AllFeaturesHub'));
const SimpleLanding = React.lazy(() => import('./pages/SimpleLanding'));
const HealthLogsHub = React.lazy(() => import('./pages/health/HealthLogsHub'));
const TrendsCorrelationsPage = React.lazy(() => import('./pages/health/TrendsCorrelationsPage'));
const SelfAdvocacyHub = React.lazy(() => import('./pages/advocacy/SelfAdvocacyHub'));
const AIAvatarTeacherPage = React.lazy(() => import('./pages/AIAvatarTeacherPage'));
const GothicApartmentPage = React.lazy(() => import('./pages/GothicApartmentPage'));
const GothicDollhousePage = React.lazy(() => import('./pages/GothicDollhousePage'));
const GothicBratzDollhousePage = React.lazy(() => import('./pages/GothicBratzDollhousePage'));
const GothicMansionGamePage = React.lazy(() => import('./pages/GothicMansionGamePage'));
const LivingRoomPage = React.lazy(() => import('./pages/LivingRoomPage'));
const AIToolsDirectoryPage = React.lazy(() => import('./pages/AIToolsDirectoryPage'));
const PhoneConnectorPage = React.lazy(() => import('./pages/PhoneConnectorPage'));
const PetCompanionSystem = React.lazy(() => import('./components/pets/PetCompanionSystem'));
const DailyActivityOracle = React.lazy(() => import('./components/oracle/DailyActivityOracle'));
const HoodooPracticeHub = React.lazy(() => import('./components/spiritual/HoodooPracticeHub'));
const GothicThemeGallery = React.lazy(() => import('./components/themes/GothicThemeGallery'));
const AchievementSystem = React.lazy(() => import('./components/achievements/AchievementSystem'));
const IdeasDiscoveryHub = React.lazy(() => import('./components/ideas/IdeasDiscoveryHub'));
const AICompanionsHub = React.lazy(() => import('./components/companions/AICompanionsHub'));
const AdventureGenerator = React.lazy(() => import('./components/dnd/AdventureGenerator'));
const EmergencyCardBuilder = React.lazy(() => import('./components/emergency/EmergencyCardBuilder'));
const FamilyTreeExplorer = React.lazy(() => import('./components/family/FamilyTreeExplorer'));
const DreamJournal = React.lazy(() => import('./components/dreams/DreamJournal'));
const HistoricalFiguresGallery = React.lazy(() => import('./components/history/HistoricalFiguresGallery'));
const PassiveLearningAcademy = React.lazy(() => import('./components/learning/PassiveLearningAcademy'));
const CaregiverSupportHandbook = React.lazy(() => import('./components/caregiver/CaregiverSupportHandbook'));
const MoodColoringStudio = React.lazy(() => import('./components/coloring/MoodColoringStudio'));
const AdaptiveMovementTracker = React.lazy(() => import('./components/movement/AdaptiveMovementTracker'));
const PartnerRelationshipHub = React.lazy(() => import('./components/partner/PartnerRelationshipHub'));
const SleepSanctuaryTracker = React.lazy(() => import('./components/sleep/SleepSanctuaryTracker'));
const AccessibilityToolkit = React.lazy(() => import('./components/accessibility/AccessibilityToolkit'));
const SewingProjectPlanner = React.lazy(() => import('./components/sewing/SewingProjectPlanner'));
const HouseholdManagementHub = React.lazy(() => import('./components/household/HouseholdManagementHub'));
const MusicActivityHub = React.lazy(() => import('./components/music/MusicActivityHub'));
const ReadingCompanion = React.lazy(() => import('./components/reading/ReadingCompanion'));
const GamingActivityPlanner = React.lazy(() => import('./components/gaming/GamingActivityPlanner'));
const CarMaintenanceTracker = React.lazy(() => import('./components/car/CarMaintenanceTracker'));
const ArtProjectStudio = React.lazy(() => import('./components/art/ArtProjectStudio'));
const PetCareCompanion = React.lazy(() => import('./components/pet/PetCareCompanion'));
const MentalHealthToolkit = React.lazy(() => import('./components/mentalhealth/MentalHealthToolkit'));
const FinancialPlanningHub = React.lazy(() => import('./components/financial/FinancialPlanningHub'));
const FoodNutritionGuide = React.lazy(() => import('./components/food/FoodNutritionGuide'));
const HealthWellnessCenter = React.lazy(() => import('./components/healthwellness/HealthWellnessCenter'));
const PassiveIncomeExplorer = React.lazy(() => import('./components/passiveincome/PassiveIncomeExplorer'));
const AutomationIdeasLab = React.lazy(() => import('./components/automation/AutomationIdeasLab'));
const EntertainmentDiscovery = React.lazy(() => import('./components/entertainment/EntertainmentDiscovery'));
const DnDAdventureHooks = React.lazy(() => import('./components/dnd/DnDAdventureHooks'));
const HoodooSpiritualGuide = React.lazy(() => import('./components/spiritual/HoodooSpiritualGuide'));
const HoodooRitualLibrary = React.lazy(() => import('./components/rituals/HoodooRitualLibrary'));
const AICharacterGallery = React.lazy(() => import('./components/characters/AICharacterGallery'));
const GothicThemeExplorer = React.lazy(() => import('./components/themes/GothicThemeExplorer'));
const PassiveIncomeCalculator = React.lazy(() => import('./components/income/PassiveIncomeCalculator'));
const PassiveIncomeExecutor = React.lazy(() => import('./components/income/PassiveIncomeExecutor'));
const CreativePracticeStudio = React.lazy(() => import('./components/studio/CreativePracticeStudio'));
const EmulatorHub = React.lazy(() => import('./components/gaming/EmulatorHub'));

// New Dollhouse Sorority Components
const LanguageLearningPage = React.lazy(() => import('./pages/LanguageLearningPage'));
const CommunicationHubPage = React.lazy(() => import('./pages/CommunicationHubPage'));
const StreamingHubFullPage = React.lazy(() => import('./pages/StreamingHubFullPage'));
const GameArcadePage = React.lazy(() => import('./pages/GameArcadePage'));
const SewingCraftsPage = React.lazy(() => import('./pages/SewingCraftsPage'));
const OpenCulturePage = React.lazy(() => import('./pages/OpenCulturePage'));
const DollGuideSystem = React.lazy(() => import('./components/dolls/DollGuideSystem'));
const UnifiedSearchComponent = React.lazy(() => import('./components/search/UnifiedSearch'));
const UniversalAppsPage = React.lazy(() => import('./pages/UniversalAppsPage'));
const ShadowLibraryPage = React.lazy(() => import('./pages/ShadowLibraryPage'));
const MediaPlayerPage = React.lazy(() => import('./pages/MediaPlayerPage'));
const UnifiedCommandCenter = React.lazy(() => import('./components/hub/UnifiedCommandCenter'));
const DollhouseWorld = React.lazy(() => import('./components/dollhouse/DollhouseWorld'));
const EmulatorHubPage = React.lazy(() => import('./pages/EmulatorHubPage'));
const AdaptiveSupportPage = React.lazy(() => import('./pages/AdaptiveSupportPage'));
const TorrentHubPage = React.lazy(() => import('./pages/TorrentHubPage'));

import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  Menu, X, Home, Heart, Brain, Music, Palette, Book,
  DollarSign, Users, Settings, Moon, Sun, Wifi, WifiOff,
  Calendar, Pill, Activity, Shield, Code, Gamepad2,
  Sparkles, Package, MessageSquare, MessageCircle, ChevronRight, Phone, LogIn, LogOut, User, Database, Zap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useIntegrations } from './contexts/IntegrationContext';

// Import components normally - they're needed for initial render
import MedicationTracker from './components/MedicationTracker';
import AvatarDressingRoom from './components/avatar/AvatarDressingRoom';
import QuickActionsWidget from './components/QuickActionsWidget';
import EmergencyQuickAccess from './components/EmergencyQuickAccess';

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
  const { isAuthenticated, isGuestUser, user, login, logout } = useIntegrations();
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
              {isGuestUser ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-purple-900/30 rounded-lg border border-purple-500/30">
                    <User size={16} className="text-purple-400" />
                    <span className="text-sm text-purple-300">Guest</span>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                    title="Upgrade to Google Account"
                  >
                    Upgrade
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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
        { path: '/emergency-cards', name: 'Emergency Card Builder', icon: Shield },
        { path: '/contacts', name: 'Phone Contacts', icon: Phone },
        { path: '/movement-tracker', name: 'Adaptive Movement Tracker', icon: Activity },
        { path: '/sleep-sanctuary', name: 'Sleep Sanctuary Tracker', icon: Moon },
        { path: '/accessibility-toolkit', name: 'Accessibility Toolkit', icon: Shield },
        { path: '/pet-care-companion', name: 'Pet Care Companion', icon: Heart },
        { path: '/mental-health-toolkit', name: 'Mental Health Toolkit', icon: Brain },
        { path: '/food-nutrition-guide', name: 'Food Nutrition Guide', icon: Activity },
        { path: '/health-wellness-center', name: 'Health Wellness Center', icon: Heart },
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
        { path: '/ai-tools', name: 'AI Tools Directory', icon: Sparkles },
        { path: '/ai-companions', name: 'AI Companions Hub', icon: MessageCircle },
        { path: '/avatar', name: '3D Avatar', icon: Users },
        { path: '/ai-avatar-teacher', name: 'AI Avatar Teacher', icon: Users },
        { path: '/gothic-apartment', name: 'Gothic Apartment', icon: Home },
        { path: '/gothic-dollhouse', name: 'Gothic Dollhouse', icon: Sparkles },
        { path: '/gothic-bratz-dollhouse', name: '🏰 Gothic Bratz Dollhouse', icon: Sparkles },
        { path: '/pet-companion', name: 'Pet Companions', icon: Heart },
        { path: '/activity-oracle', name: 'Activity Oracle', icon: Sparkles },
        { path: '/achievements', name: 'Achievements', icon: Sparkles },
        { path: '/dream-journal', name: 'Dream Journal', icon: Moon },
        { path: '/sanctum', name: 'Sanctum Rooms', icon: Home },
        { path: '/ai-character-gallery', name: 'AI Character Gallery', icon: Users },
        { path: '/hoodoo-spiritual-guide', name: 'Hoodoo Spiritual Guide', icon: Sparkles },
        { path: '/hoodoo-ritual-library', name: 'Hoodoo Ritual Library', icon: Sparkles },
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
        { path: '/sewing-projects', name: 'Sewing Project Planner', icon: Palette },
        { path: '/coloring-studio', name: 'Mood Coloring Studio', icon: Palette },
        { path: '/music-hub', name: 'Music Activity Hub', icon: Music },
        { path: '/art-studio', name: 'Art Project Studio', icon: Palette },
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
        { path: '/caregiver-handbook', name: 'Caregiver Support Handbook', icon: Heart },
      ]
    },
    {
      id: 'resources',
      name: 'Resources & Libraries',
      icon: Database,
      color: 'from-cyan-500 to-blue-500',
      routes: [
        { path: '/direct-access', name: 'Direct Access Hub (45+ Resources)', icon: Zap },
        { path: '/anna-archive', name: 'Anna\'s Archive Library', icon: Book },
        { path: '/libre-resources', name: 'Libre Resources Hub', icon: Heart },
        { path: '/free-software', name: 'Free Software Compliance', icon: Shield },
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
        { path: '/learning-academy', name: 'Passive Learning Academy', icon: Book },
        { path: '/historical-figures', name: 'Historical Figures Gallery', icon: Users },
        { path: '/reading-companion', name: 'Reading Companion', icon: Book },
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
        { path: '/financial-planning', name: 'Financial Planning Hub', icon: DollarSign },
        { path: '/passive-income-explorer', name: 'Passive Income Explorer', icon: DollarSign },
        { path: '/passive-income-calculator', name: 'Passive Income Calculator', icon: DollarSign },
        { path: '/income-executor', name: 'AI Income Executor', icon: DollarSign },
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming & Entertainment',
      icon: Gamepad2,
      color: 'from-pink-500 to-purple-500',
      routes: [
        { path: '/gaming', name: 'Gaming Hub', icon: Gamepad2 },
        { path: '/emulator', name: 'Retro Emulator', icon: Gamepad2 },
        { path: '/dnd', name: 'D&D Game', icon: Gamepad2 },
        { path: '/adventure-generator', name: 'Adventure Generator', icon: Gamepad2 },
        { path: '/campaigns', name: 'Campaign Manager', icon: Book },
        { path: '/hulu-streaming', name: 'Hulu Streaming Hub', icon: Activity },
        { path: '/entertainment-library', name: 'Entertainment Library', icon: Music },
        { path: '/entertainment', name: 'Entertainment Hub', icon: Music },
        { path: '/gaming-planner', name: 'Gaming Activity Planner', icon: Gamepad2 },
        { path: '/entertainment-discovery', name: 'Entertainment Discovery', icon: Music },
        { path: '/dnd-adventure-hooks', name: 'D&D Adventure Hooks', icon: Gamepad2 },
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
        { path: '/ideas-hub', name: 'Ideas Discovery Hub', icon: Sparkles },
        { path: '/hoodoo', name: 'Hoodoo Practice Hub', icon: Sparkles },
        { path: '/household-hub', name: 'Household Management Hub', icon: Home },
        { path: '/car-maintenance', name: 'Car Maintenance Tracker', icon: Activity },
        { path: '/automation-ideas', name: 'Automation Ideas Lab', icon: Code },
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
        { path: '/family-tree', name: 'Family Tree Explorer', icon: Users },
        { path: '/partner-hub', name: 'Partner Relationship Hub', icon: Heart },
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
        { path: '/theme-gallery', name: 'Theme Gallery', icon: Palette },
        { path: '/gothic-theme-explorer', name: 'Gothic Theme Explorer', icon: Palette },
        { path: '/backup', name: 'Backup & Sync', icon: Shield },
        { path: '/about', name: 'About KOL OS', icon: Sparkles },
      ]
    },
    {
      id: 'dollhouse',
      name: '🏰 Gothic Bratz Dollhouse',
      icon: Home,
      color: 'from-purple-600 to-pink-600',
      routes: [
        { path: '/gothic-bratz-dollhouse', name: 'Enter Dollhouse', icon: Home },
        { path: '/dollhouse/foyer', name: 'Grand Foyer (Dashboard)', icon: Home },
        { path: '/dollhouse/wardrobe', name: 'Wardrobe Palace', icon: Sparkles },
        { path: '/dollhouse/apothecary', name: 'Apothecary (Health)', icon: Heart },
        { path: '/dollhouse/gaming', name: 'Gaming Den', icon: Gamepad2 },
        { path: '/dollhouse/library', name: 'Library Study', icon: Book },
        { path: '/dollhouse/studio', name: 'Creative Studio', icon: Palette },
        { path: '/dollhouse/music', name: 'Music Room', icon: Music },
        { path: '/dollhouse/tarot', name: 'Fortune Teller Alcove', icon: Sparkles },
        { path: '/dollhouse/dreams', name: 'Dream Archives', icon: Moon },
        { path: '/dollhouse/ancestors', name: 'Ancestor Hall', icon: Users },
        { path: '/dollhouse/garden', name: 'Cloud Garden (Wellness)', icon: Sparkles },
        { path: '/dollhouse/observatory', name: 'Rooftop Observatory', icon: Moon },
        { path: '/dollhouse/kitchen', name: 'Kitchen Lab', icon: Activity },
        { path: '/dollhouse/pets', name: 'Pet Sanctuary', icon: Heart },
        { path: '/dollhouse/guests', name: 'Guest Quarters', icon: Users },
        { path: '/dollhouse/office', name: 'Office Hub', icon: Calendar },
      ]
    },
    {
      id: 'sorority',
      name: '✨ Sorority of Knowledge',
      icon: Book,
      color: 'from-purple-500 to-indigo-500',
      routes: [
        { path: '/universal-apps', name: '🚀 Universal App Launcher (80+)', icon: Sparkles },
        { path: '/language-learning', name: '🌍 Language Learning Hub', icon: MessageSquare },
        { path: '/openculture', name: '📚 Free Courses & Books', icon: Book },
        { path: '/sewing-crafts', name: '✂️ Sewing & Crafts', icon: Palette },
        { path: '/game-arcade', name: '🎮 Game Arcade', icon: Gamepad2 },
        { path: '/streaming-full', name: '📺 Streaming Hub', icon: Activity },
        { path: '/communication-hub', name: '💬 Communication Hub', icon: MessageCircle },
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
              <Route path="/" element={<GothicMansionGamePage />} />
              <Route path="/landing" element={<SimpleLanding />} />
              <Route path="/dashboard" element={<UnifiedDashboard />} />
              <Route path="/game" element={<GothicMansionGamePage />} />
              <Route path="/mansion" element={<GothicMansionGamePage />} />
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/download" element={<ComprehensiveDownloads />} />
              <Route path="/downloads" element={<ComprehensiveDownloads />} />

              {/* Health & Wellness - Core Pages */}
              <Route path="/health" element={<HealthDashboard />} />
              <Route path="/health/old" element={<HealthDashboardPage />} />
              <Route path="/health/logs" element={<HealthLogsHub />} />
              <Route path="/health/trends" element={<TrendsCorrelationsPage />} />
              <Route path="/health/er-visits" element={<HealthLogsHub />} />
              <Route path="/health/med-effects" element={<HealthLogsHub />} />
              <Route path="/health/appointment-notes" element={<HealthLogsHub />} />
              <Route path="/health/triggers" element={<HealthLogsHub />} />
              <Route path="/health/flare-journal" element={<HealthLogsHub />} />
              <Route path="/health/symptoms" element={<HealthLogsHub />} />
              <Route path="/health/documents" element={<HealthLogsHub />} />
              <Route path="/health/supplies" element={<HealthLogsHub />} />
              <Route path="/health/care-team" element={<HealthLogsHub />} />
              <Route path="/medications" element={<MedicationTracker />} />
              <Route path="/emergency" element={<CrisisSupportPage />} />
              <Route path="/emergency-cards" element={<EmergencyCardBuilder />} />
              <Route path="/contacts" element={<PhoneContactsPage />} />
              {/* Health Redirects - Consolidated to HealthDashboard */}
              <Route path="/vitals" element={<Navigate to="/health" replace />} />
              <Route path="/mental-health" element={<Navigate to="/health" replace />} />
              <Route path="/mental-health-dashboard" element={<Navigate to="/health" replace />} />
              <Route path="/fitness" element={<Navigate to="/health" replace />} />
              <Route path="/nutrition" element={<Navigate to="/health" replace />} />
              <Route path="/sleep" element={<Navigate to="/health" replace />} />
              <Route path="/therapy" element={<Navigate to="/health" replace />} />
              <Route path="/wellness" element={<Navigate to="/health" replace />} />

              {/* AI & Companion - Core Pages */}
              <Route path="/ai-config" element={<AIConfigurationHub />} />
              <Route path="/claude-chat" element={<ClaudeChatPage />} />
              <Route path="/ai-characters" element={<AICharacterHub />} />
              <Route path="/ai-tools" element={<AIToolsDirectoryPage />} />
              <Route path="/avatar" element={<AvatarDressingRoom />} />
              <Route path="/gothic-apartment" element={<GothicApartmentPage />} />
              <Route path="/achievements" element={<AchievementSystem />} />
              <Route path="/dream-journal" element={<DreamJournal />} />
              <Route path="/historical-figures" element={<HistoricalFiguresGallery />} />
              <Route path="/coloring-studio" element={<MoodColoringStudio />} />
              {/* AI Redirects - Consolidated to AICharacterHub */}
              <Route path="/ai-life-manager" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/chronomuse" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/ai-avatar-teacher" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/ai-companions" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/inworld-ai" element={<Navigate to="/ai-tools" replace />} />
              <Route path="/sanctum" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/music" element={<Navigate to="/ai-characters" replace />} />
              {/* Gothic Redirects */}
              <Route path="/gothic-dollhouse" element={<GothicDollhousePage />} />
              <Route path="/gothic-bratz-dollhouse" element={<GothicBratzDollhousePage />} />
              <Route path="/living-room" element={<LivingRoomPage />} />
              <Route path="/entertainment-center" element={<LivingRoomPage />} />
              <Route path="/bratz-dollhouse" element={<GothicBratzDollhousePage />} />
              <Route path="/dollhouse" element={<GothicBratzDollhousePage />} />
              {/* Dollhouse Room Direct Links */}
              <Route path="/dollhouse/foyer" element={<Navigate to="/gothic-bratz-dollhouse?room=grand-foyer" replace />} />
              <Route path="/dollhouse/ancestors" element={<Navigate to="/gothic-bratz-dollhouse?room=ancestor-hall" replace />} />
              <Route path="/dollhouse/wardrobe" element={<Navigate to="/gothic-bratz-dollhouse?room=wardrobe-palace" replace />} />
              <Route path="/dollhouse/library" element={<Navigate to="/gothic-bratz-dollhouse?room=library-study" replace />} />
              <Route path="/dollhouse/apothecary" element={<Navigate to="/gothic-bratz-dollhouse?room=apothecary" replace />} />
              <Route path="/dollhouse/office" element={<Navigate to="/gothic-bratz-dollhouse?room=office-hub" replace />} />
              <Route path="/dollhouse/gaming" element={<Navigate to="/gothic-bratz-dollhouse?room=gaming-den" replace />} />
              <Route path="/dollhouse/observatory" element={<Navigate to="/gothic-bratz-dollhouse?room=rooftop-observatory" replace />} />
              <Route path="/dollhouse/dreams" element={<Navigate to="/gothic-bratz-dollhouse?room=dream-archives" replace />} />
              <Route path="/dollhouse/tarot" element={<Navigate to="/gothic-bratz-dollhouse?room=fortune-teller-alcove" replace />} />
              <Route path="/dollhouse/garden" element={<Navigate to="/gothic-bratz-dollhouse?room=cloud-garden" replace />} />
              <Route path="/dollhouse/studio" element={<Navigate to="/gothic-bratz-dollhouse?room=creative-studio" replace />} />
              <Route path="/dollhouse/kitchen" element={<Navigate to="/gothic-bratz-dollhouse?room=kitchen-lab" replace />} />
              <Route path="/dollhouse/music" element={<Navigate to="/gothic-bratz-dollhouse?room=music-room" replace />} />
              <Route path="/dollhouse/pets" element={<Navigate to="/gothic-bratz-dollhouse?room=pet-sanctuary" replace />} />
              <Route path="/dollhouse/guests" element={<Navigate to="/gothic-bratz-dollhouse?room=guest-quarters" replace />} />
              <Route path="/theme-gallery" element={<Navigate to="/gothic-apartment" replace />} />
              {/* Activity Components - Keep unique ones */}
              <Route path="/pet-companion" element={<PetCompanionSystem />} />
              <Route path="/activity-oracle" element={<DailyActivityOracle />} />
              <Route path="/learning-academy" element={<PassiveLearningAcademy />} />
              <Route path="/caregiver-handbook" element={<CaregiverSupportHandbook />} />
              {/* Health-related redirects */}
              <Route path="/movement-tracker" element={<Navigate to="/health" replace />} />
              <Route path="/sleep-sanctuary" element={<Navigate to="/health" replace />} />
              <Route path="/mental-health-toolkit" element={<Navigate to="/health" replace />} />
              <Route path="/food-nutrition-guide" element={<Navigate to="/health" replace />} />
              <Route path="/health-wellness-center" element={<Navigate to="/health" replace />} />
              <Route path="/accessibility-toolkit" element={<Navigate to="/advocacy" replace />} />
              {/* Creative redirects */}
              <Route path="/sewing-projects" element={<Navigate to="/creative" replace />} />
              <Route path="/music-hub" element={<Navigate to="/creative" replace />} />
              <Route path="/art-studio" element={<Navigate to="/creative" replace />} />
              <Route path="/reading-companion" element={<Navigate to="/entertainment-library" replace />} />
              {/* Home redirects */}
              <Route path="/household-hub" element={<Navigate to="/home" replace />} />
              <Route path="/pet-care-companion" element={<Navigate to="/home" replace />} />
              <Route path="/car-maintenance" element={<Navigate to="/car" replace />} />
              {/* Relationship redirects */}
              <Route path="/partner-hub" element={<Navigate to="/relationships" replace />} />
              {/* Spirituality routes */}
              <Route path="/hoodoo" element={<HoodooPracticeHub />} />
              <Route path="/ideas-hub" element={<IdeasDiscoveryHub />} />
              {/* Gaming redirects */}
              <Route path="/gaming-planner" element={<Navigate to="/gaming" replace />} />

              {/* Creative & Music - Core Pages */}
              <Route path="/creative" element={<CreativeArtsDashboardPage />} />
              <Route path="/media" element={<MediaLibraryPage />} />
              <Route path="/practice-studio" element={<CreativePracticeStudio />} />
              <Route path="/emulator" element={<EmulatorHub />} />
              <Route path="/retro-gaming" element={<EmulatorHub />} />
              {/* Creative Redirects */}
              <Route path="/poetry" element={<Navigate to="/creative" replace />} />
              <Route path="/photography" element={<Navigate to="/media" replace />} />

              {/* Advocacy & Support - Core Pages */}
              <Route path="/advocacy" element={<AdvocacyHubPage />} />
              <Route path="/advocacy/self" element={<SelfAdvocacyHub />} />
              <Route path="/community" element={<CommunityEventsHubPage />} />
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              {/* Advocacy Redirects */}
              <Route path="/advocacy/hub" element={<Navigate to="/advocacy" replace />} />
              <Route path="/scripts" element={<Navigate to="/advocacy" replace />} />
              <Route path="/handbooks" element={<Navigate to="/advocacy" replace />} />
              <Route path="/medical-advocacy" element={<Navigate to="/advocacy" replace />} />
              <Route path="/self-advocacy" element={<Navigate to="/advocacy/self" replace />} />

              {/* Education & Learning - Core Pages */}
              <Route path="/education" element={<LearningHubPage />} />
              <Route path="/direct-access" element={<DirectAccessHubPage />} />
              <Route path="/anna-archive" element={<AnnaArchiveLibraryPage />} />
              <Route path="/libre-resources" element={<LibreResourcesHubPage />} />
              {/* Education Redirects */}
              <Route path="/credits" element={<Navigate to="/education" replace />} />
              <Route path="/certifications" element={<Navigate to="/education" replace />} />
              <Route path="/languages" element={<Navigate to="/education" replace />} />
              <Route path="/skills" element={<Navigate to="/education" replace />} />
              <Route path="/courses" element={<Navigate to="/education" replace />} />
              <Route path="/study" element={<Navigate to="/education" replace />} />
              <Route path="/research" element={<Navigate to="/education" replace />} />

              {/* Financial & Income - Core Pages */}
              <Route path="/financial" element={<FinanceDashboardPage />} />
              <Route path="/income-builder" element={<PassiveIncomeBuilderPage />} />
              <Route path="/content-generation-hub" element={<ContentGenerationHub />} />
              {/* Financial Redirects */}
              <Route path="/real-money" element={<Navigate to="/financial" replace />} />
              <Route path="/passive-income" element={<Navigate to="/financial" replace />} />
              <Route path="/passive-income-dashboard" element={<Navigate to="/financial" replace />} />
              <Route path="/content-monetization" element={<Navigate to="/financial" replace />} />
              <Route path="/real-money-plan" element={<Navigate to="/income-builder" replace />} />
              <Route path="/zapier-automation" element={<Navigate to="/automation" replace />} />
              <Route path="/benefits" element={<Navigate to="/advocacy" replace />} />
              <Route path="/budget" element={<Navigate to="/financial" replace />} />
              <Route path="/expenses" element={<Navigate to="/financial" replace />} />
              <Route path="/investments" element={<Navigate to="/financial" replace />} />
              <Route path="/debt" element={<Navigate to="/financial" replace />} />
              <Route path="/savings" element={<Navigate to="/financial" replace />} />
              <Route path="/financial-planning" element={<Navigate to="/financial" replace />} />
              <Route path="/passive-income-explorer" element={<Navigate to="/income-builder" replace />} />
              <Route path="/income-executor" element={<Navigate to="/income-builder" replace />} />

              {/* Gaming & Entertainment - Core Pages */}
              <Route path="/gaming" element={<GamingHubPage />} />
              <Route path="/dnd" element={<DnDPage />} />
              <Route path="/entertainment-library" element={<EntertainmentLibraryPage />} />
              {/* Gaming & Entertainment Redirects */}
              <Route path="/boardgames" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/adventure-generator" element={<Navigate to="/dnd" replace />} />
              <Route path="/campaigns" element={<Navigate to="/dnd" replace />} />
              <Route path="/hulu-streaming" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/entertainment" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/streaming" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/reading" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/podcasts" element={<Navigate to="/entertainment-library" replace />} />
              <Route path="/entertainment-discovery" element={<Navigate to="/entertainment-library" replace />} />

              {/* Automation & Tools - Core Pages */}
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/free-software" element={<FreeSoftwareCompliancePage />} />
              <Route path="/kolhub" element={<GoogleEcosystemPage />} />
              <Route path="/pixel-watch" element={<PixelWatchPage />} />
              {/* Automation Redirects */}
              <Route path="/enterprise-monitoring" element={<Navigate to="/automation" replace />} />
              <Route path="/mcp-servers" element={<Navigate to="/automation" replace />} />
              <Route path="/developer" element={<Navigate to="/automation" replace />} />
              <Route path="/ideas" element={<Navigate to="/goals" replace />} />
              <Route path="/smarthome" element={<Navigate to="/automation" replace />} />
              <Route path="/automation-ideas" element={<Navigate to="/automation" replace />} />
              <Route path="/dnd-adventure-hooks" element={<Navigate to="/dnd" replace />} />
              <Route path="/ai-character-gallery" element={<Navigate to="/ai-characters" replace />} />
              <Route path="/gothic-theme-explorer" element={<Navigate to="/gothic-apartment" replace />} />
              <Route path="/passive-income-calculator" element={<Navigate to="/income-builder" replace />} />
              {/* Spirituality Redirects */}
              <Route path="/hoodoo-spiritual-guide" element={<Navigate to="/spirituality" replace />} />
              <Route path="/hoodoo-ritual-library" element={<Navigate to="/spirituality" replace />} />

              {/* Relationships - Core Pages */}
              <Route path="/relationships" element={<RelationshipDashboardPage />} />
              <Route path="/ancestry" element={<AncestryPage />} />
              <Route path="/family-tree" element={<FamilyTreeExplorer />} />
              {/* Relationships Redirects */}
              <Route path="/kollective" element={<Navigate to="/community" replace />} />
              <Route path="/social" element={<Navigate to="/relationships" replace />} />
              <Route path="/networking" element={<Navigate to="/relationships" replace />} />
              <Route path="/mentorship" element={<Navigate to="/relationships" replace />} />

              {/* Life Management - Core Pages */}
              <Route path="/goals" element={<GoalsHubPage />} />
              {/* Life Management Redirects */}
              <Route path="/habits" element={<Navigate to="/goals" replace />} />
              <Route path="/journaling" element={<Navigate to="/goals" replace />} />
              <Route path="/time-management" element={<Navigate to="/goals" replace />} />
              <Route path="/memories" element={<Navigate to="/goals" replace />} />

              {/* Home & Living - Core Pages */}
              <Route path="/home" element={<HomeManagementHubPage />} />
              <Route path="/car" element={<CarManagementHubPage />} />
              <Route path="/housing" element={<HousingHubPage />} />
              <Route path="/wardrobe" element={<FashionHubPage />} />
              <Route path="/travel" element={<TravelHubPage />} />
              {/* Home Redirects */}
              <Route path="/home-maintenance" element={<Navigate to="/home" replace />} />
              <Route path="/cooking" element={<Navigate to="/home" replace />} />
              <Route path="/food" element={<Navigate to="/home" replace />} />
              <Route path="/gardening" element={<Navigate to="/home" replace />} />
              <Route path="/pets" element={<Navigate to="/home" replace />} />
              <Route path="/fashion" element={<Navigate to="/creative" replace />} />
              <Route path="/sewing" element={<Navigate to="/creative" replace />} />

              {/* Resources & Support - Core Pages */}
              <Route path="/emergency-prep" element={<EmergencyPrepHubPage />} />
              <Route path="/employment" element={<EmploymentHubPage />} />
              <Route path="/medical-portals" element={<MedicalPortalsHubPage />} />
              <Route path="/transportation" element={<TransportationHubPage />} />
              <Route path="/identity" element={<IdentityHubPage />} />
              {/* Resources Redirects */}
              <Route path="/legal" element={<Navigate to="/advocacy" replace />} />
              <Route path="/disability" element={<Navigate to="/advocacy" replace />} />

              {/* Hobbies & Activities - Core Pages */}
              <Route path="/hobbies" element={<HobbiesHubPage />} />
              <Route path="/volunteer" element={<VolunteerHubPage />} />
              <Route path="/spirituality" element={<SpiritualityHubPage />} />
              <Route path="/hearing" element={<HearingCompanionPage />} />
              {/* Hobbies Redirects */}
              <Route path="/kitchen-witch" element={<Navigate to="/spirituality" replace />} />

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

              {/* Consolidated Routes - Redirects to main hubs */}
              <Route path="/language-learning" element={<LanguageLearningPage />} />
              <Route path="/communication-hub" element={<Navigate to="/social" replace />} />
              <Route path="/streaming-full" element={<Navigate to="/streaming" replace />} />
              <Route path="/game-arcade" element={<Navigate to="/gaming" replace />} />
              <Route path="/sewing-crafts" element={<Navigate to="/sewing" replace />} />
              <Route path="/openculture" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/free-learning" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/universal-apps" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/apps" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/shadow-library" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/libraries" element={<Navigate to="/libre-resources" replace />} />
              <Route path="/media-player" element={<Navigate to="/entertainment" replace />} />
              <Route path="/watch" element={<Navigate to="/entertainment" replace />} />
              <Route path="/emulators" element={<Navigate to="/gaming" replace />} />
              <Route path="/emulator-hub" element={<Navigate to="/gaming" replace />} />
              {/* Libre Resources Hub - All free/open content */}
              <Route path="/libre-resources" element={<LibreResourcesHub />} />
              <Route path="/libre" element={<LibreResourcesHub />} />
              <Route path="/open-source" element={<LibreResourcesHub />} />

              {/* Adaptive Support Hub - Merged from adaptive-support-hub */}
              <Route path="/adaptive-support" element={<AdaptiveSupportPage />} />
              <Route path="/adaptive" element={<AdaptiveSupportPage />} />
              <Route path="/body-weather" element={<AdaptiveSupportPage />} />
              <Route path="/wardrobe-comfort" element={<AdaptiveSupportPage />} />
              <Route path="/daily-life" element={<AdaptiveSupportPage />} />

              {/* Torrent Hub - qBittorrent & PikaTorrent integrated */}
              <Route path="/torrents" element={<TorrentHubPage />} />
              <Route path="/torrent-hub" element={<TorrentHubPage />} />
              <Route path="/downloads-hub" element={<TorrentHubPage />} />

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

        {/* Quick Actions Floating Widget */}
        <QuickActionsWidget />

        {/* Emergency Quick Access */}
        <EmergencyQuickAccess />

        {/* AI Doll Guide System - Sorority of Knowledge */}
        <Suspense fallback={null}>
          <DollGuideSystem
            onNavigate={(path) => window.location.href = path}
          />
        </Suspense>

        {/* Unified Command Center - All Features Integrated */}
        <Suspense fallback={null}>
          <UnifiedCommandCenter />
        </Suspense>

        {/* Living Dollhouse World */}
        <Suspense fallback={null}>
          <DollhouseWorld />
        </Suspense>
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

        {/* Featured: Gothic Bratz Dollhouse */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 rounded-2xl border-2 border-purple-500/40 hover:border-purple-400/60 transition-all">
          <NavLink to="/gothic-bratz-dollhouse" className="block">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center text-5xl animate-pulse">
                🏰
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Gothic Bratz Dollhouse
                </h2>
                <p className="text-gray-300 mt-2">
                  Your 16-room luxury gothic sanctuary • 220+ AI Bratz dolls • 600+ wardrobe items •
                  Video game quality UI with achievements & unlockables
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-purple-600/40 rounded-full text-xs text-purple-200">16 Rooms</span>
                  <span className="px-3 py-1 bg-pink-600/40 rounded-full text-xs text-pink-200">220+ Dolls</span>
                  <span className="px-3 py-1 bg-indigo-600/40 rounded-full text-xs text-indigo-200">600+ Items</span>
                  <span className="px-3 py-1 bg-purple-600/40 rounded-full text-xs text-purple-200">Spoon Tracker</span>
                  <span className="px-3 py-1 bg-pink-600/40 rounded-full text-xs text-pink-200">Multiplayer</span>
                </div>
              </div>
              <ChevronRight size={32} className="text-purple-400" />
            </div>
          </NavLink>
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
          <QuickAccessCard
            title="Bratz Dollhouse"
            description="16 rooms, 220+ dolls, 600+ wardrobe items - your gothic sanctuary"
            icon={Home}
            path="/gothic-bratz-dollhouse"
            gradient="from-purple-600 to-pink-600"
          />
        </div>

        {/* Stats Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 backdrop-blur-lg border border-purple-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">9,000+</div>
              <div className="text-sm text-gray-400">Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">16</div>
              <div className="text-sm text-gray-400">Dollhouse Rooms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400">220+</div>
              <div className="text-sm text-gray-400">AI Bratz Dolls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-fuchsia-400">600+</div>
              <div className="text-sm text-gray-400">Wardrobe Items</div>
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
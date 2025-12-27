/**
 * PASSIVE INCOME EXECUTOR - USAGE EXAMPLE
 *
 * This file demonstrates how to use the PassiveIncomeExecutor component
 * in your application.
 */

import React from 'react';
import { PassiveIncomeExecutor } from './PassiveIncomeExecutor';

// EXAMPLE 1: Basic Usage
export const BasicExample = () => {
  return (
    <div>
      <PassiveIncomeExecutor />
    </div>
  );
};

// EXAMPLE 2: In a Route
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export const RouteExample = () => {
  return (
    <Router>
      <Routes>
        <Route path="/passive-income" element={<PassiveIncomeExecutor />} />
      </Routes>
    </Router>
  );
};

// EXAMPLE 3: With a Layout Wrapper
import { Box, Container } from '@mui/material';

export const LayoutExample = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <PassiveIncomeExecutor />
      </Box>
    </Container>
  );
};

// EXAMPLE 4: As a Tab in Your Main Dashboard
import { Tabs, Tab } from '@mui/material';

export const DashboardExample = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
        <Tab label="Dashboard" />
        <Tab label="Passive Income" />
        <Tab label="Settings" />
      </Tabs>

      {activeTab === 0 && <div>Dashboard Content</div>}
      {activeTab === 1 && <PassiveIncomeExecutor />}
      {activeTab === 2 && <div>Settings Content</div>}
    </div>
  );
};

/**
 * FEATURES INCLUDED IN PassiveIncomeExecutor:
 *
 * 1. HEADER SECTION:
 *    - Large earnings display with coin animations
 *    - Daily target progress bar
 *    - Trend indicator showing percentage change
 *
 * 2. QUICK STATS ROW:
 *    - Active Listings count
 *    - Products Created count
 *    - Queue Size
 *    - Success Rate percentage
 *
 * 3. AI RECOMMENDATIONS:
 *    - Trending suggestions (e.g., "Dark cottagecore trending")
 *    - Timing optimizations (e.g., "Queue 5 more for Friday")
 *    - Price optimizations (e.g., "Raise prices 15%")
 *
 * 4. MAIN TABS:
 *    - Execute Ideas: Browse and execute passive income ideas from JSON
 *    - My Art: View art library (embedded component)
 *    - Pipeline: View execution pipeline (embedded component)
 *    - Platforms: Manage platform connections (Etsy, Gumroad, etc.)
 *    - Analytics: View earnings charts and insights
 *
 * 5. EXECUTE IDEAS TAB:
 *    - Filter by kind (passive/active)
 *    - Sort by earnings, cost, or time
 *    - Execute button on each idea
 *    - Shows monthly income potential
 *
 * 6. PLATFORMS TAB:
 *    - Platform connection status
 *    - Earnings per platform
 *    - Listings count per platform
 *    - Connect/Disconnect/Sync buttons
 *
 * 7. EXECUTION MODAL:
 *    - Full Automation mode
 *    - Semi-Automated mode
 *    - Manual with AI Assist mode
 *
 * COLOR SCHEME:
 * - Gold/Amber: #f59e0b, #fbbf24 (money theme)
 * - Emerald: #10b981 (success theme)
 * - Gothic Dark: #0a0812, #1a1028 (background)
 *
 * ANIMATIONS:
 * - Coin spin animation on dollar signs
 * - Pulse glow on header card
 * - Shimmer effect on earnings display
 * - Float animation on decorative elements
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - React.memo for component memoization
 * - useMemo for expensive calculations
 * - useCallback for event handlers
 * - Lazy loading for sub-components (ArtLibrary, ExecutionPipeline)
 * - Only loads first 50 ideas from JSON for performance
 */

export default PassiveIncomeExecutor;

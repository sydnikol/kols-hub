/**
 * Integration Context
 *
 * Provides access to all integration services throughout the app
 * With robust error handling to prevent app crashes
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Lazy load services to prevent blocking
let integrationManager: any = null;
let authService: any = null;
let realMoneyConnector: any = null;

// Safe import function
const loadServices = async () => {
  try {
    const [intMgr, authSvc, moneyConn] = await Promise.all([
      import('../services/integration-manager').then(m => m.integrationManager).catch(() => null),
      import('../services/auth-service').then(m => m.authService).catch(() => null),
      import('../services/real-money-connector').then(m => m.realMoneyConnector).catch(() => null)
    ]);
    integrationManager = intMgr;
    authService = authSvc;
    realMoneyConnector = moneyConn;
    return true;
  } catch (error) {
    console.error('Failed to load integration services:', error);
    return false;
  }
};

interface IntegrationContextType {
  integrationManager: any;
  authService: any;
  realMoneyConnector: any;
  isAuthenticated: boolean;
  user: any | null;
  servicesLoaded: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getFinancialSnapshot: () => Promise<any>;
  getLearningSnapshot: () => Promise<any>;
  getInventorySnapshot: () => Promise<any>;
  getHealthData: () => Promise<any>;
  connectGoogleFit: () => Promise<boolean>;
  getRealBalance: () => number;
  withdrawMoney: (amount: number) => Promise<boolean>;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export const IntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  // Load services on mount
  useEffect(() => {
    const init = async () => {
      const loaded = await loadServices();
      setServicesLoaded(loaded);

      if (loaded && authService) {
        try {
          setIsAuthenticated(authService.isAuthenticated?.() || false);
          setUser(authService.getCurrentUser?.() || null);
        } catch (e) {
          console.error('Auth check failed:', e);
        }
      }
    };
    init();
  }, []);

  // Check auth status periodically
  useEffect(() => {
    if (!servicesLoaded || !authService) return;

    const checkAuth = () => {
      try {
        const authenticated = authService.isAuthenticated?.() || false;
        setIsAuthenticated(authenticated);
        setUser(authService.getCurrentUser?.() || null);
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    };

    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [servicesLoaded]);

  const login = async () => {
    if (authService?.loginWithGoogle) {
      await authService.loginWithGoogle();
    }
  };

  const logout = () => {
    if (authService?.logout) {
      authService.logout();
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const getFinancialSnapshot = async () => {
    return integrationManager?.getFinancialSnapshot?.() || null;
  };

  const getLearningSnapshot = async () => {
    return integrationManager?.getLearningSnapshot?.() || null;
  };

  const getInventorySnapshot = async () => {
    return integrationManager?.getInventorySnapshot?.() || null;
  };

  const getHealthData = async () => {
    return integrationManager?.getRealHealthData?.() || null;
  };

  const connectGoogleFit = async () => {
    return integrationManager?.connectGoogleFit?.() || false;
  };

  const getRealBalance = () => {
    return realMoneyConnector?.getRealBalance?.() || 0;
  };

  const withdrawMoney = async (amount: number) => {
    return realMoneyConnector?.withdrawToBank?.(amount) || false;
  };

  const value: IntegrationContextType = {
    integrationManager,
    authService,
    realMoneyConnector,
    isAuthenticated,
    user,
    servicesLoaded,
    login,
    logout,
    getFinancialSnapshot,
    getLearningSnapshot,
    getInventorySnapshot,
    getHealthData,
    connectGoogleFit,
    getRealBalance,
    withdrawMoney
  };

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  );
};

/**
 * Hook to use integration services
 */
export const useIntegrations = (): IntegrationContextType => {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegrations must be used within IntegrationProvider');
  }
  return context;
};

export default IntegrationContext;

import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

// Loading component for auth check
const AuthLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
      <p className="text-pink-300">Checking authentication...</p>
    </div>
  </div>
);

// Protected Route Component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  // Check if Auth0 is configured
  const isConfigured = Boolean(
    import.meta.env.VITE_AUTH0_DOMAIN &&
    import.meta.env.VITE_AUTH0_CLIENT_ID
  );

  // If Auth0 is not configured, allow access (development mode)
  if (!isConfigured) {
    console.warn('Auth0 not configured - allowing access in development mode');
    return <>{children}</>;
  }

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    localStorage.setItem('auth_return_to', location.pathname);
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

// HOC for protecting components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { returnTo?: string }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const isConfigured = Boolean(
      import.meta.env.VITE_AUTH0_DOMAIN &&
      import.meta.env.VITE_AUTH0_CLIENT_ID
    );

    // If Auth0 is not configured, render component directly
    if (!isConfigured) {
      return <Component {...props} />;
    }

    const AuthenticatedComponent = withAuthenticationRequired(
      () => <Component {...props} />,
      {
        onRedirecting: () => <AuthLoading />,
        returnTo: options?.returnTo || window.location.pathname,
      }
    );

    return <AuthenticatedComponent />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ProtectedRoute;

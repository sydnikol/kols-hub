import { useState, useEffect } from 'react';

// Check if mobile immediately on module load
const checkIfMobile = (breakpoint: number = 768): boolean => {
  if (typeof window === 'undefined') return false;

  const isMobileWidth = window.innerWidth < breakpoint;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isCapacitor = !!(window as any).Capacitor;

  return isMobileWidth || isMobileUA || isCapacitor;
};

export function useIsMobile(breakpoint: number = 768): boolean {
  // Initialize with immediate check to avoid flash of wrong content
  const [isMobile, setIsMobile] = useState(() => checkIfMobile(breakpoint));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(checkIfMobile(breakpoint));
    };

    // Check immediately in case state wasn't set correctly
    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

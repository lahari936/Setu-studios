import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { sessionManager } from '../utils/sessionManager';

export const useSmoothNavigation = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const smoothNavigate = async (to: string, options?: { replace?: boolean }) => {
    if (isNavigating) return;

    setIsNavigating(true);

    try {
      // Preload data for the destination page
      await sessionManager.handlePageTransition(to);

      // Add a small delay for smooth transition effect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to the new page
      navigate(to, options);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to normal navigation
      navigate(to, options);
    } finally {
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  return {
    smoothNavigate,
    isNavigating
  };
};

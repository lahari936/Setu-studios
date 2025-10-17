import { supabase } from '../config/supabase';

export interface SessionData {
  user: any;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class SessionManager {
  private static instance: SessionManager;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startSessionMonitoring();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Start monitoring session validity
   */
  private startSessionMonitoring(): void {
    // Check session every 5 minutes
    this.sessionCheckInterval = setInterval(() => {
      this.checkSessionValidity();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if current session is valid
   */
  private async checkSessionValidity(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log('Session invalid, clearing storage');
        this.clearSessionData();
        return;
      }

      // Check if token is close to expiry (within 5 minutes)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry < 300) { // 5 minutes
        console.log('Token expiring soon, refreshing...');
        await this.refreshSession();
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }

  /**
   * Refresh the current session
   */
  public async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error('Session refresh failed:', error);
        this.clearSessionData();
        return false;
      }

      console.log('Session refreshed successfully');
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  }

  /**
   * Store session data in localStorage for persistence
   */
  public storeSessionData(sessionData: SessionData): void {
    try {
      const dataToStore = {
        ...sessionData,
        stored_at: Date.now()
      };
      
      localStorage.setItem('setu-studios-session', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  }

  /**
   * Retrieve session data from localStorage
   */
  public getStoredSessionData(): SessionData | null {
    try {
      const stored = localStorage.getItem('setu-studios-session');
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Check if data is not too old (24 hours max)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - data.stored_at > maxAge) {
        this.clearSessionData();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      this.clearSessionData();
      return null;
    }
  }

  /**
   * Clear all session-related data
   */
  public clearSessionData(): void {
    try {
      localStorage.removeItem('setu-studios-session');
      localStorage.removeItem('setu-studios-auth-token');
      localStorage.removeItem('user_preferences');
      
      // Clear any other auth-related items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('supabase')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  /**
   * Handle smooth page transitions
   */
  public async handlePageTransition(to: string): Promise<void> {
    // Preload critical resources for the destination page
    if (to === '/mentorship') {
      // Preload mentorship data
      this.preloadMentorshipData();
    } else if (to === '/services') {
      // Preload services data
      this.preloadServicesData();
    }
  }

  /**
   * Preload mentorship data
   */
  private async preloadMentorshipData(): Promise<void> {
    try {
      // This would typically fetch mentor data
      console.log('Preloading mentorship data...');
    } catch (error) {
      console.error('Failed to preload mentorship data:', error);
    }
  }

  /**
   * Preload services data
   */
  private async preloadServicesData(): Promise<void> {
    try {
      // This would typically fetch services data
      console.log('Preloading services data...');
    } catch (error) {
      console.error('Failed to preload services data:', error);
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}

export const sessionManager = SessionManager.getInstance();

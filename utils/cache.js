// Caching utilities untuk Altius Chat Widget
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.storage = this.getStorage();
    this.maxSize = 100; // Maximum number of cache entries
    this.defaultTTL = 300000; // 5 minutes default TTL
  }

  /**
   * Get appropriate storage (localStorage or sessionStorage)
   */
  getStorage() {
    try {
      // Try localStorage first
      if (window.localStorage) {
        return window.localStorage;
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    
    try {
      // Fallback to sessionStorage
      if (window.sessionStorage) {
        return window.sessionStorage;
      }
    } catch (e) {
      console.warn('sessionStorage not available:', e);
    }
    
    // Fallback to memory-only storage
    return null;
  }

  /**
   * Set cache entry
   */
  set(key, value, ttl = this.defaultTTL) {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
      expires: Date.now() + ttl
    };

    // Store in memory cache
    this.cache.set(key, entry);

    // Store in persistent storage if available
    if (this.storage) {
      try {
        this.storage.setItem(`widget_cache_${key}`, JSON.stringify(entry));
      } catch (e) {
        console.warn('Failed to store in persistent cache:', e);
      }
    }

    // Clean up if cache is too large
    this.cleanup();
  }

  /**
   * Get cache entry
   */
  get(key) {
    // Try memory cache first
    let entry = this.cache.get(key);

    // If not in memory, try persistent storage
    if (!entry && this.storage) {
      try {
        const stored = this.storage.getItem(`widget_cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          // Add to memory cache
          this.cache.set(key, entry);
        }
      } catch (e) {
        console.warn('Failed to retrieve from persistent cache:', e);
      }
    }

    // Check if entry exists and is not expired
    if (entry && Date.now() < entry.expires) {
      return entry.value;
    }

    // Remove expired entry
    if (entry) {
      this.delete(key);
    }

    return null;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    this.cache.delete(key);
    
    if (this.storage) {
      try {
        this.storage.removeItem(`widget_cache_${key}`);
      } catch (e) {
        console.warn('Failed to delete from persistent cache:', e);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    
    if (this.storage) {
      try {
        // Remove all widget cache entries
        const keys = Object.keys(this.storage);
        keys.forEach(key => {
          if (key.startsWith('widget_cache_')) {
            this.storage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Failed to clear persistent cache:', e);
      }
    }
  }

  /**
   * Clean up expired entries and limit cache size
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];
    const allKeys = Array.from(this.cache.keys());

    // Find expired entries
    allKeys.forEach(key => {
      const entry = this.cache.get(key);
      if (entry && now >= entry.expires) {
        expiredKeys.push(key);
      }
    });

    // Remove expired entries
    expiredKeys.forEach(key => this.delete(key));

    // Limit cache size
    if (this.cache.size > this.maxSize) {
      const keysToRemove = allKeys
        .filter(key => !expiredKeys.includes(key))
        .slice(0, this.cache.size - this.maxSize);
      
      keysToRemove.forEach(key => this.delete(key));
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const expired = entries.filter(([_, entry]) => now >= entry.expires).length;
    const valid = entries.filter(([_, entry]) => now < entry.expires).length;

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize,
      storageType: this.storage ? this.storage.constructor.name : 'memory-only'
    };
  }

  /**
   * Cache with automatic refresh
   */
  async getOrSet(key, fetcher, ttl = this.defaultTTL) {
    // Try to get from cache
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch new data
    try {
      const value = await fetcher();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      console.error('Cache fetcher failed:', error);
      throw error;
    }
  }

  /**
   * Cache with stale-while-revalidate pattern
   */
  async getOrSetStale(key, fetcher, ttl = this.defaultTTL, staleTtl = ttl * 2) {
    const cached = this.get(key);
    
    if (cached !== null) {
      // Return cached value immediately
      const entry = this.cache.get(key);
      if (entry && Date.now() < entry.expires + staleTtl) {
        // Refresh in background if not too stale
        this.refreshInBackground(key, fetcher, ttl);
      }
      return cached;
    }

    // Fetch new data
    try {
      const value = await fetcher();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      console.error('Cache fetcher failed:', error);
      throw error;
    }
  }

  /**
   * Refresh cache entry in background
   */
  async refreshInBackground(key, fetcher, ttl) {
    try {
      const value = await fetcher();
      this.set(key, value, ttl);
    } catch (error) {
      console.warn('Background cache refresh failed:', error);
    }
  }

  /**
   * Cache user agent data
   */
  cacheUserAgentData(data) {
    this.set('user_agent_data', data, 3600000); // 1 hour
  }

  /**
   * Get cached user agent data
   */
  getCachedUserAgentData() {
    return this.get('user_agent_data');
  }

  /**
   * Cache session data
   */
  cacheSessionData(sessionId) {
    this.set('session_id', sessionId, 1800000); // 30 minutes
  }

  /**
   * Get cached session data
   */
  getCachedSessionData() {
    return this.get('session_id');
  }

  /**
   * Cache chat history
   */
  cacheChatHistory(history) {
    this.set('chat_history', history, 900000); // 15 minutes
  }

  /**
   * Get cached chat history
   */
  getCachedChatHistory() {
    return this.get('chat_history');
  }

  /**
   * Cache theme configuration
   */
  cacheThemeConfig(theme) {
    this.set('theme_config', theme, 86400000); // 24 hours
  }

  /**
   * Get cached theme configuration
   */
  getCachedThemeConfig() {
    return this.get('theme_config');
  }

  /**
   * Cache API responses
   */
  cacheApiResponse(endpoint, data, ttl = 300000) {
    const key = `api_${this.hashString(endpoint)}`;
    this.set(key, data, ttl);
  }

  /**
   * Get cached API response
   */
  getCachedApiResponse(endpoint) {
    const key = `api_${this.hashString(endpoint)}`;
    return this.get(key);
  }

  /**
   * Simple string hashing
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Preload important data
   */
  async preload() {
    // Preload user agent data if available
    const userAgentData = this.getCachedUserAgentData();
    if (userAgentData) {
      // Data is already cached
      return;
    }

    // Preload session data if available
    const sessionData = this.getCachedSessionData();
    if (sessionData) {
      // Session is already cached
      return;
    }

    // Preload theme config if available
    const themeConfig = this.getCachedThemeConfig();
    if (themeConfig) {
      // Theme is already cached
      return;
    }
  }

  /**
   * Export cache data
   */
  export() {
    const data = {};
    this.cache.forEach((entry, key) => {
      if (Date.now() < entry.expires) {
        data[key] = entry;
      }
    });
    return data;
  }

  /**
   * Import cache data
   */
  import(data) {
    Object.entries(data).forEach(([key, entry]) => {
      if (entry && entry.expires && Date.now() < entry.expires) {
        this.cache.set(key, entry);
      }
    });
  }
}

// Export cache manager
export const cacheManager = new CacheManager();

// Make available globally
window.widgetCache = cacheManager;

export default cacheManager; 
// Analytics dan monitoring untuk Altius Chat Widget
class WidgetAnalytics {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.isEnabled = true;
  }

  /**
   * Generate session ID untuk tracking
   */
  generateSessionId() {
    return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Track event
   */
  track(eventName, data = {}) {
    if (!this.isEnabled) return;

    const event = {
      event: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data: {
        ...data,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
      }
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Send event ke analytics endpoint
   */
  async sendEvent(event) {
    try {
      // Bisa dikirim ke Google Analytics, Mixpanel, atau custom endpoint
      if (window.gtag) {
        window.gtag('event', event.event, {
          event_category: 'chat_widget',
          event_label: event.data.message || '',
          value: 1
        });
      }

      // Custom endpoint (opsional)
      if (window.chat_analytics_endpoint) {
        await fetch(window.chat_analytics_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        });
      }
    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }

  /**
   * Track widget initialization
   */
  trackInit() {
    this.track('widget_init', {
      loadTime: Date.now() - this.startTime,
      theme: window.AltiusChatWidget?.config?.colors?.primary || 'default'
    });
  }

  /**
   * Track chat open
   */
  trackChatOpen() {
    this.track('chat_open', {
      timeSinceInit: Date.now() - this.startTime
    });
  }

  /**
   * Track chat close
   */
  trackChatClose() {
    this.track('chat_close', {
      sessionDuration: Date.now() - this.startTime
    });
  }

  /**
   * Track message sent
   */
  trackMessageSent(messageLength) {
    this.track('message_sent', {
      messageLength,
      messageCount: this.events.filter(e => e.event === 'message_sent').length + 1
    });
  }

  /**
   * Track message received
   */
  trackMessageReceived(responseTime) {
    this.track('message_received', {
      responseTime,
      messageCount: this.events.filter(e => e.event === 'message_received').length + 1
    });
  }

  /**
   * Track error
   */
  trackError(errorType, errorMessage) {
    this.track('error', {
      errorType,
      errorMessage,
      url: window.location.href
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        this.track('performance', {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        });
      }
    }
  }

  /**
   * Get analytics summary
   */
  getSummary() {
    const now = Date.now();
    const sessionDuration = now - this.startTime;
    
    return {
      sessionId: this.sessionId,
      sessionDuration,
      totalEvents: this.events.length,
      eventsByType: this.events.reduce((acc, event) => {
        acc[event.event] = (acc[event.event] || 0) + 1;
        return acc;
      }, {}),
      lastEvent: this.events[this.events.length - 1],
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Clear events
   */
  clear() {
    this.events = [];
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  /**
   * Monitor widget load time
   */
  measureLoadTime() {
    const startTime = performance.now();
    
    return {
      end: () => {
        const loadTime = performance.now() - startTime;
        this.metrics.loadTime = loadTime;
        return loadTime;
      }
    };
  }

  /**
   * Monitor API response times
   */
  measureApiCall(apiName) {
    const startTime = performance.now();
    
    return {
      end: (success = true) => {
        const duration = performance.now() - startTime;
        this.metrics[`api_${apiName}`] = {
          duration,
          success,
          timestamp: Date.now()
        };
        return duration;
      }
    };
  }

  /**
   * Monitor memory usage
   */
  measureMemory() {
    if ('memory' in performance) {
      this.metrics.memory = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Monitor DOM mutations
   */
  observeDOMChanges(target, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          callback(mutation);
        }
      });
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return this.metrics;
  }

  /**
   * Clear metrics
   */
  clear() {
    this.metrics = {};
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Error monitoring
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.setupErrorHandling();
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.captureError('javascript', event.error?.message || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError('promise', event.reason?.message || 'Unhandled Promise Rejection', {
        stack: event.reason?.stack
      });
    });
  }

  /**
   * Capture error
   */
  captureError(type, message, details = {}) {
    const error = {
      type,
      message,
      details,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(error);
    
    // Send to analytics if available
    if (window.widgetAnalytics) {
      window.widgetAnalytics.trackError(type, message);
    }

    console.error('Widget Error:', error);
  }

  /**
   * Get errors
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Clear errors
   */
  clear() {
    this.errors = [];
  }
}

// Export analytics utilities
export const analytics = new WidgetAnalytics();
export const performanceMonitor = new PerformanceMonitor();
export const errorMonitor = new ErrorMonitor();

// Make available globally
window.widgetAnalytics = analytics;
window.widgetPerformanceMonitor = performanceMonitor;
window.widgetErrorMonitor = errorMonitor;

export default {
  analytics,
  performanceMonitor,
  errorMonitor
}; 
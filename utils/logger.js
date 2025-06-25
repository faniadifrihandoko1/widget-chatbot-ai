// Logging utilities untuk Altius Chat Widget
class Logger {
  constructor() {
    this.isEnabled = true;
    this.logLevel = 'info'; // debug, info, warn, error
    this.maxLogs = 1000;
    this.logs = [];
    this.remoteLogging = false;
    this.remoteEndpoint = null;
    this.setupLogLevel();
  }

  /**
   * Setup log level from environment or localStorage
   */
  setupLogLevel() {
    // Check localStorage for log level
    try {
      const storedLevel = localStorage.getItem('widget_log_level');
      if (storedLevel && ['debug', 'info', 'warn', 'error'].includes(storedLevel)) {
        this.logLevel = storedLevel;
      }
    } catch (e) {
      // localStorage not available
    }

    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLogLevel = urlParams.get('widget_log_level');
    if (urlLogLevel && ['debug', 'info', 'warn', 'error'].includes(urlLogLevel)) {
      this.logLevel = urlLogLevel;
    }
  }

  /**
   * Set log level
   */
  setLogLevel(level) {
    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      this.logLevel = level;
      try {
        localStorage.setItem('widget_log_level', level);
      } catch (e) {
        // localStorage not available
      }
    }
  }

  /**
   * Get log level priority
   */
  getLogLevelPriority(level) {
    const priorities = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return priorities[level] || 0;
  }

  /**
   * Check if log level should be displayed
   */
  shouldLog(level) {
    return this.isEnabled && 
           this.getLogLevelPriority(level) >= this.getLogLevelPriority(this.logLevel);
  }

  /**
   * Add log entry
   */
  addLog(level, message, data = null) {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: window.session_id || 'unknown'
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Limit log size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    this.consoleOutput(level, message, data);

    // Remote logging
    if (this.remoteLogging && this.remoteEndpoint) {
      this.sendToRemote(logEntry);
    }
  }

  /**
   * Console output with styling
   */
  consoleOutput(level, message, data) {
    const styles = {
      debug: 'color: #6c757d; font-weight: bold;',
      info: 'color: #17a2b8; font-weight: bold;',
      warn: 'color: #ffc107; font-weight: bold;',
      error: 'color: #dc3545; font-weight: bold;'
    };

    const prefix = `[Altius Widget ${level.toUpperCase()}]`;
    const style = styles[level] || '';

    if (data) {
      console.group(`%c${prefix}`, style);
      console.log(message);
      console.log(data);
      console.groupEnd();
    } else {
      console.log(`%c${prefix}`, style, message);
    }
  }

  /**
   * Send log to remote endpoint
   */
  async sendToRemote(logEntry) {
    try {
      await fetch(this.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Don't log remote logging errors to avoid infinite loops
      console.warn('Remote logging failed:', error);
    }
  }

  /**
   * Debug logging
   */
  debug(message, data = null) {
    this.addLog('debug', message, data);
  }

  /**
   * Info logging
   */
  info(message, data = null) {
    this.addLog('info', message, data);
  }

  /**
   * Warning logging
   */
  warn(message, data = null) {
    this.addLog('warn', message, data);
  }

  /**
   * Error logging
   */
  error(message, data = null) {
    this.addLog('error', message, data);
  }

  /**
   * Log widget initialization
   */
  logInit(config) {
    this.info('Widget initialized', {
      version: '1.0.0',
      config: {
        theme: config?.colors?.primary,
        locale: config?.locale,
        features: Object.keys(config || {})
      }
    });
  }

  /**
   * Log API calls
   */
  logApiCall(endpoint, method, requestData, responseData, duration) {
    this.debug('API call', {
      endpoint,
      method,
      requestData,
      responseData,
      duration: `${duration}ms`
    });
  }

  /**
   * Log user interactions
   */
  logUserInteraction(action, data = {}) {
    this.info('User interaction', {
      action,
      timestamp: Date.now(),
      ...data
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric, value, unit = 'ms') {
    this.debug('Performance metric', {
      metric,
      value: `${value}${unit}`,
      timestamp: Date.now()
    });
  }

  /**
   * Log errors with context
   */
  logError(error, context = {}) {
    this.error('Error occurred', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }

  /**
   * Log security events
   */
  logSecurityEvent(event, details = {}) {
    this.warn('Security event', {
      event,
      details,
      timestamp: Date.now()
    });
  }

  /**
   * Get logs
   */
  getLogs(level = null, limit = null) {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  /**
   * Get logs by time range
   */
  getLogsByTimeRange(startTime, endTime) {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= startTime && logTime <= endTime;
    });
  }

  /**
   * Search logs
   */
  searchLogs(query) {
    const searchTerm = query.toLowerCase();
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(searchTerm) ||
      JSON.stringify(log.data).toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Clear logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs
   */
  export(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.logs, null, 2);
      case 'csv':
        return this.exportToCSV();
      case 'text':
        return this.exportToText();
      default:
        return JSON.stringify(this.logs, null, 2);
    }
  }

  /**
   * Export to CSV
   */
  exportToCSV() {
    const headers = ['timestamp', 'level', 'message', 'data', 'url'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.message,
      JSON.stringify(log.data),
      log.url
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Export to text
   */
  exportToText() {
    return this.logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
  }

  /**
   * Download logs
   */
  downloadLogs(format = 'json') {
    const content = this.export(format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `widget-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Enable remote logging
   */
  enableRemoteLogging(endpoint) {
    this.remoteLogging = true;
    this.remoteEndpoint = endpoint;
    this.info('Remote logging enabled', { endpoint });
  }

  /**
   * Disable remote logging
   */
  disableRemoteLogging() {
    this.remoteLogging = false;
    this.remoteEndpoint = null;
    this.info('Remote logging disabled');
  }

  /**
   * Get log statistics
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      recent: this.logs.slice(-10).length,
      oldest: this.logs[0]?.timestamp,
      newest: this.logs[this.logs.length - 1]?.timestamp
    };

    ['debug', 'info', 'warn', 'error'].forEach(level => {
      stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
    });

    return stats;
  }

  /**
   * Create log viewer
   */
  createLogViewer() {
    const viewer = document.createElement('div');
    viewer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      height: 300px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      overflow-y: auto;
      z-index: 1000000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    const logs = this.getLogs(null, 50);
    const logText = logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');

    viewer.textContent = logText;
    document.body.appendChild(viewer);

    return viewer;
  }
}

// Export logger
export const logger = new Logger();

// Make available globally
window.widgetLogger = logger;

export default logger; 
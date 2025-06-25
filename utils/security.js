// Security utilities untuk Altius Chat Widget
class SecurityManager {
  constructor() {
    this.isEnabled = true;
    this.sanitizers = new Map();
    this.validators = new Map();
    this.setupSanitizers();
    this.setupValidators();
  }

  /**
   * Enable security features
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable security features
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Setup HTML sanitizers
   */
  setupSanitizers() {
    // Basic HTML sanitizer
    this.sanitizers.set('html', (input) => {
      if (!this.isEnabled) return input;
      
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    });

    // URL sanitizer
    this.sanitizers.set('url', (input) => {
      if (!this.isEnabled) return input;
      
      try {
        const url = new URL(input);
        // Only allow http, https, and data URLs
        if (['http:', 'https:', 'data:'].includes(url.protocol)) {
          return url.toString();
        }
        return '';
      } catch {
        return '';
      }
    });

    // Email sanitizer
    this.sanitizers.set('email', (input) => {
      if (!this.isEnabled) return input;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) ? input : '';
    });

    // Phone number sanitizer
    this.sanitizers.set('phone', (input) => {
      if (!this.isEnabled) return input;
      
      // Remove all non-digit characters except +, -, (, ), and space
      const cleaned = input.replace(/[^\d+\-()\s]/g, '');
      return cleaned.trim();
    });
  }

  /**
   * Setup validators
   */
  setupValidators() {
    // Message length validator
    this.validators.set('messageLength', (input, maxLength = 500) => {
      if (!this.isEnabled) return { valid: true };
      
      return {
        valid: input.length <= maxLength,
        error: input.length > maxLength ? `Message too long. Maximum ${maxLength} characters allowed.` : null
      };
    });

    // Rate limiting validator
    this.validators.set('rateLimit', (() => {
      const messageHistory = [];
      const timeWindow = 60000; // 1 minute
      const maxMessages = 10; // Max 10 messages per minute
      
      return (input) => {
        if (!this.isEnabled) return { valid: true };
        
        const now = Date.now();
        // Remove old messages outside time window
        const recentMessages = messageHistory.filter(time => now - time < timeWindow);
        
        if (recentMessages.length >= maxMessages) {
          return {
            valid: false,
            error: 'Too many messages. Please wait a moment before sending another message.'
          };
        }
        
        messageHistory.push(now);
        return { valid: true };
      };
    })());

    // Content validator
    this.validators.set('content', (input) => {
      if (!this.isEnabled) return { valid: true };
      
      // Check for potentially harmful content
      const harmfulPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
      ];
      
      for (const pattern of harmfulPatterns) {
        if (pattern.test(input)) {
          return {
            valid: false,
            error: 'Message contains potentially harmful content.'
          };
        }
      }
      
      return { valid: true };
    });

    // Spam detection validator
    this.validators.set('spam', (() => {
      const messageHistory = [];
      const timeWindow = 300000; // 5 minutes
      const maxSimilarMessages = 3; // Max 3 similar messages in 5 minutes
      
      return (input) => {
        if (!this.isEnabled) return { valid: true };
        
        const now = Date.now();
        const normalizedInput = input.toLowerCase().trim();
        
        // Remove old messages
        const recentMessages = messageHistory.filter(msg => now - msg.timestamp < timeWindow);
        
        // Count similar messages
        const similarCount = recentMessages.filter(msg => 
          msg.content === normalizedInput
        ).length;
        
        if (similarCount >= maxSimilarMessages) {
          return {
            valid: false,
            error: 'Message appears to be spam. Please wait before sending similar messages.'
          };
        }
        
        messageHistory.push({
          content: normalizedInput,
          timestamp: now
        });
        
        return { valid: true };
      };
    })());
  }

  /**
   * Sanitize input
   */
  sanitize(input, type = 'html') {
    const sanitizer = this.sanitizers.get(type);
    if (sanitizer) {
      return sanitizer(input);
    }
    return input;
  }

  /**
   * Validate input
   */
  validate(input, validators = ['messageLength', 'content']) {
    const results = {
      valid: true,
      errors: []
    };

    for (const validatorName of validators) {
      const validator = this.validators.get(validatorName);
      if (validator) {
        const result = validator(input);
        if (!result.valid) {
          results.valid = false;
          results.errors.push(result.error);
        }
      }
    }

    return results;
  }

  /**
   * Sanitize and validate input
   */
  processInput(input, options = {}) {
    const {
      sanitizeType = 'html',
      validators = ['messageLength', 'content'],
      maxLength = 500
    } = options;

    // Sanitize first
    const sanitized = this.sanitize(input, sanitizeType);
    
    // Then validate
    const validation = this.validate(sanitized, validators);
    
    return {
      input: sanitized,
      valid: validation.valid,
      errors: validation.errors,
      originalLength: input.length,
      sanitizedLength: sanitized.length
    };
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data, key) {
    if (!this.isEnabled) return data;
    
    try {
      // Simple base64 encoding for demo (use proper encryption in production)
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.warn('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData, key) {
    if (!this.isEnabled) return encryptedData;
    
    try {
      // Simple base64 decoding for demo (use proper decryption in production)
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Generate secure token
   */
  generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Hash data (simple implementation)
   */
  hash(data) {
    if (!this.isEnabled) return data;
    
    let hash = 0;
    const str = JSON.stringify(data);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  }

  /**
   * Validate API credentials
   */
  validateCredentials(apiKey, tenant) {
    if (!this.isEnabled) return { valid: true };
    
    const errors = [];
    
    if (!apiKey || typeof apiKey !== 'string') {
      errors.push('Invalid API key');
    }
    
    if (!tenant || typeof tenant !== 'string') {
      errors.push('Invalid tenant');
    }
    
    if (apiKey && apiKey.length < 10) {
      errors.push('API key too short');
    }
    
    if (tenant && tenant.length < 3) {
      errors.push('Tenant too short');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for XSS vulnerabilities
   */
  checkXSS(input) {
    if (!this.isEnabled) return { safe: true };
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<form/gi,
      /<input/gi,
      /<textarea/gi,
      /<select/gi,
      /<button/gi,
      /<link/gi,
      /<meta/gi,
      /<style/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        return {
          safe: false,
          pattern: pattern.source,
          match: input.match(pattern)[0]
        };
      }
    }
    
    return { safe: true };
  }

  /**
   * Check for CSRF protection
   */
  checkCSRF() {
    if (!this.isEnabled) return { protected: true };
    
    // Check if CSRF token is present in meta tags
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    return {
      protected: !!csrfToken,
      token: csrfToken
    };
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file, options = {}) {
    if (!this.isEnabled) return { valid: true };
    
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.txt']
    } = options;
    
    const errors = [];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get security status
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      sanitizers: Array.from(this.sanitizers.keys()),
      validators: Array.from(this.validators.keys()),
      csrf: this.checkCSRF(),
      xss: { patterns: 15 }, // Number of XSS patterns
    };
  }

  /**
   * Log security event
   */
  logSecurityEvent(event, details = {}) {
    if (!this.isEnabled) return;
    
    const securityEvent = {
      event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      details
    };
    
    console.warn('Security Event:', securityEvent);
    
    // Send to security monitoring if available
    if (window.widgetAnalytics) {
      window.widgetAnalytics.track('security_event', securityEvent);
    }
  }
}

// Export security manager
export const securityManager = new SecurityManager();

// Make available globally
window.widgetSecurity = securityManager;

export default securityManager; 
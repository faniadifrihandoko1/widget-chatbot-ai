// Integration tests untuk Altius Chat Widget
import { jest } from '@jest/globals';

// Mock semua dependencies
jest.mock('../services/api.js');
jest.mock('../utils/helpers.js');
jest.mock('../utils/analytics.js');
jest.mock('../utils/accessibility.js');
jest.mock('../utils/i18n.js');
jest.mock('../utils/security.js');
jest.mock('../utils/cache.js');
jest.mock('../utils/logger.js');

// Import modules
import ChatWidget from '../components/ChatWidget.js';
import ChatAPIService from '../services/api.js';
import { accessibilityManager } from '../utils/accessibility.js';
import { analytics } from '../utils/analytics.js';
import { cacheManager } from '../utils/cache.js';
import { i18nManager } from '../utils/i18n.js';
import { logger } from '../utils/logger.js';
import { securityManager } from '../utils/security.js';

describe('Altius Chat Widget Integration Tests', () => {
  let widget;
  let apiService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="test-container"></div>
    `;
    
    // Setup window globals
    global.window = {
      chat_api_key: 'test-api-key',
      chat_api_tenant: 'test-tenant',
      personal_data: { name: 'Test User' },
      session_id: null,
    };
    
    // Create instances
    widget = new ChatWidget();
    apiService = new ChatAPIService();
  });

  afterEach(() => {
    // Cleanup
    if (widget) {
      widget.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('Widget Initialization', () => {
    test('should initialize all managers correctly', async () => {
      // Mock API responses
      ChatAPIService.prototype.initialize.mockResolvedValue({
        sessionId: 'test-session',
        userAgentData: {
          useragent_name: 'Test Agent',
          bot_name: 'Test Bot',
          bot_logo_url: 'test-logo.png'
        }
      });

      await widget.init();

      // Check if all managers were initialized
      expect(analytics.trackInit).toHaveBeenCalled();
      expect(accessibilityManager.enable).toHaveBeenCalled();
      expect(i18nManager.init).toHaveBeenCalled();
      expect(securityManager.enable).toHaveBeenCalled();
      expect(cacheManager.preload).toHaveBeenCalled();
      expect(logger.logInit).toHaveBeenCalled();
    });

    test('should handle initialization errors gracefully', async () => {
      // Mock API failure
      ChatAPIService.prototype.initialize.mockRejectedValue(new Error('API Error'));

      await widget.init();

      // Should still create widget even if API fails
      expect(widget.elements.widget).toBeTruthy();
      expect(logger.logError).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      // Initialize widget
      ChatAPIService.prototype.initialize.mockResolvedValue({
        sessionId: 'test-session',
        userAgentData: { useragent_name: 'Test Agent', bot_name: 'Test Bot' }
      });
      await widget.init();
    });

    test('should handle chat toggle correctly', () => {
      // Test opening chat
      widget.toggleChat();
      expect(widget.isOpen).toBe(true);
      expect(analytics.trackChatOpen).toHaveBeenCalled();
      expect(accessibilityManager.announce).toHaveBeenCalledWith('Chat opened');

      // Test closing chat
      widget.toggleChat();
      expect(widget.isOpen).toBe(false);
      expect(analytics.trackChatClose).toHaveBeenCalled();
      expect(accessibilityManager.announce).toHaveBeenCalledWith('Chat closed');
    });

    test('should handle message sending with all validations', async () => {
      // Mock API response
      ChatAPIService.prototype.sendMessage.mockResolvedValue('Test response');

      const message = 'Hello, world!';
      
      // Test message processing
      const processed = securityManager.processInput(message, {
        sanitizeType: 'html',
        validators: ['messageLength', 'content', 'spam']
      });

      expect(processed.valid).toBe(true);
      expect(securityManager.sanitize).toHaveBeenCalledWith(message, 'html');
      expect(securityManager.validate).toHaveBeenCalledWith(processed.input, ['messageLength', 'content', 'spam']);

      // Test sending message
      await widget.sendMessage();
      
      expect(analytics.trackMessageSent).toHaveBeenCalled();
      expect(cacheManager.cacheChatHistory).toHaveBeenCalled();
      expect(logger.logUserInteraction).toHaveBeenCalledWith('message_sent', expect.any(Object));
    });

    test('should handle invalid messages correctly', async () => {
      // Mock security validation failure
      securityManager.processInput.mockReturnValue({
        input: '',
        valid: false,
        errors: ['Message contains harmful content']
      });

      const message = '<script>alert("xss")</script>';
      
      await widget.sendMessage();
      
      expect(securityManager.logSecurityEvent).toHaveBeenCalled();
      expect(logger.logError).toHaveBeenCalled();
      expect(analytics.trackError).toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    test('should handle API calls with caching', async () => {
      // Mock API responses
      ChatAPIService.prototype.sendMessage.mockResolvedValue('Cached response');
      cacheManager.get.mockReturnValue('Cached response');

      const message = 'Test message';
      
      // First call should use cache
      const cachedResponse = cacheManager.getCachedApiResponse('/chat');
      expect(cachedResponse).toBe('Cached response');

      // Second call should hit API
      const apiResponse = await apiService.sendMessage(message, []);
      expect(apiResponse).toBe('Cached response');
      expect(cacheManager.cacheApiResponse).toHaveBeenCalled();
    });

    test('should handle API errors with retry logic', async () => {
      // Mock API failure
      ChatAPIService.prototype.sendMessage.mockRejectedValue(new Error('Network error'));

      try {
        await apiService.sendMessage('Test message', []);
      } catch (error) {
        expect(error.message).toBe('Network error');
        expect(logger.logError).toHaveBeenCalled();
        expect(analytics.trackError).toHaveBeenCalled();
      }
    });
  });

  describe('Internationalization', () => {
    test('should handle locale changes correctly', async () => {
      // Test locale detection
      const detectedLocale = i18nManager.detectLocale('en-US');
      expect(detectedLocale).toBe('en');

      // Test translation
      const translation = i18nManager.t('welcomeMessage');
      expect(translation).toBeTruthy();

      // Test locale change
      await i18nManager.setLocale('ja');
      expect(i18nManager.getCurrentLocale()).toBe('ja');
      expect(i18nManager.updateUI).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('should handle keyboard navigation correctly', () => {
      // Test focus management
      const focusableElements = accessibilityManager.getFocusableElements(document.body);
      expect(Array.isArray(focusableElements)).toBe(true);

      // Test ARIA labels
      accessibilityManager.addARIALabels();
      const bubble = document.querySelector('.ai-altius-altius-chat-bubble');
      expect(bubble?.getAttribute('aria-label')).toBeTruthy();
    });

    test('should announce events to screen readers', () => {
      accessibilityManager.announce('Test announcement');
      expect(accessibilityManager.announce).toHaveBeenCalledWith('Test announcement');
    });
  });

  describe('Performance Monitoring', () => {
    test('should track performance metrics', () => {
      // Test load time measurement
      const loadTimer = analytics.performanceMonitor.measureLoadTime();
      loadTimer.end();
      
      expect(analytics.performanceMonitor.getMetrics().loadTime).toBeDefined();

      // Test API call measurement
      const apiTimer = analytics.performanceMonitor.measureApiCall('test-api');
      apiTimer.end(true);
      
      expect(analytics.performanceMonitor.getMetrics()['api_test-api']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle various error types', () => {
      // Test JavaScript errors
      const error = new Error('Test error');
      analytics.errorMonitor.captureError('javascript', error.message, { stack: error.stack });
      
      expect(analytics.errorMonitor.getErrors().length).toBeGreaterThan(0);

      // Test security events
      securityManager.logSecurityEvent('xss_attempt', { pattern: '<script>' });
      expect(securityManager.logSecurityEvent).toHaveBeenCalled();
    });
  });

  describe('Caching Strategy', () => {
    test('should handle cache operations correctly', () => {
      // Test cache set/get
      cacheManager.set('test-key', 'test-value', 60000);
      const cachedValue = cacheManager.get('test-key');
      expect(cachedValue).toBe('test-value');

      // Test cache cleanup
      cacheManager.cleanup();
      expect(cacheManager.getStats().total).toBeLessThanOrEqual(cacheManager.maxSize);
    });

    test('should handle cache expiration', () => {
      // Set cache with short TTL
      cacheManager.set('expire-test', 'value', 1);
      
      // Wait for expiration
      setTimeout(() => {
        const expiredValue = cacheManager.get('expire-test');
        expect(expiredValue).toBeNull();
      }, 10);
    });
  });

  describe('Security Features', () => {
    test('should validate and sanitize inputs', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const processed = securityManager.processInput(maliciousInput, {
        sanitizeType: 'html',
        validators: ['content']
      });

      expect(processed.valid).toBe(false);
      expect(processed.errors.length).toBeGreaterThan(0);
    });

    test('should handle file upload validation', () => {
      const mockFile = {
        name: 'test.jpg',
        type: 'image/jpeg',
        size: 1024
      };

      const validation = securityManager.validateFileUpload(mockFile, {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      });

      expect(validation.valid).toBe(true);
    });
  });

  describe('Logging and Analytics', () => {
    test('should log all important events', () => {
      // Test various log levels
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(logger.getLogs().length).toBeGreaterThan(0);
      expect(logger.getStats().total).toBeGreaterThan(0);
    });

    test('should track user interactions', () => {
      analytics.track('user_interaction', { action: 'click', element: 'bubble' });
      expect(analytics.track).toHaveBeenCalledWith('user_interaction', expect.any(Object));
    });
  });

  describe('Memory Management', () => {
    test('should clean up resources properly', () => {
      // Test widget destruction
      widget.destroy();
      
      // Check if all managers are cleaned up
      expect(cacheManager.clear).toHaveBeenCalled();
      expect(logger.clear).toHaveBeenCalled();
      expect(analytics.performanceMonitor.clear).toHaveBeenCalled();
      expect(accessibilityManager.removeEventListenerSafe).toHaveBeenCalled();
    });
  });

  describe('Configuration Management', () => {
    test('should handle theme configuration', () => {
      const theme = {
        colors: { primary: '#test-color' },
        spacing: { md: '12px' }
      };

      cacheManager.cacheThemeConfig(theme);
      const cachedTheme = cacheManager.getCachedThemeConfig();
      expect(cachedTheme).toEqual(theme);
    });

    test('should handle user agent configuration', () => {
      const userAgentData = {
        useragent_name: 'Test Agent',
        bot_name: 'Test Bot'
      };

      cacheManager.cacheUserAgentData(userAgentData);
      const cachedData = cacheManager.getCachedUserAgentData();
      expect(cachedData).toEqual(userAgentData);
    });
  });
}); 
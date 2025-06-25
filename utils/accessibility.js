// Accessibility utilities untuk Altius Chat Widget
class AccessibilityManager {
  constructor() {
    this.isEnabled = true;
    this.focusableElements = [];
    this.currentFocusIndex = -1;
    this.originalTabIndex = new Map();
  }

  /**
   * Enable accessibility features
   */
  enable() {
    this.isEnabled = true;
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupARIALabels();
  }

  /**
   * Disable accessibility features
   */
  disable() {
    this.isEnabled = false;
    this.removeKeyboardNavigation();
    this.restoreTabIndex();
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    if (!this.isEnabled) return;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Remove keyboard navigation
   */
  removeKeyboardNavigation() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event) {
    if (!this.isEnabled) return;

    const widget = document.querySelector('.ai-altius-altius-chat-widget');
    if (!widget || !widget.contains(event.target)) return;

    switch (event.key) {
      case 'Escape':
        this.handleEscape(event);
        break;
      case 'Tab':
        this.handleTab(event);
        break;
      case 'Enter':
        this.handleEnter(event);
        break;
      case 'Space':
        this.handleSpace(event);
        break;
    }
  }

  /**
   * Handle Escape key
   */
  handleEscape(event) {
    const popup = document.querySelector('.ai-altius-altius-chat-popup');
    if (popup && popup.classList.contains('show')) {
      event.preventDefault();
      this.closeChat();
    }
  }

  /**
   * Handle Tab key
   */
  handleTab(event) {
    const popup = document.querySelector('.ai-altius-altius-chat-popup');
    if (popup && popup.classList.contains('show')) {
      this.trapFocus(event, popup);
    }
  }

  /**
   * Handle Enter key
   */
  handleEnter(event) {
    const target = event.target;
    
    if (target.classList.contains('ai-altius-altius-chat-bubble')) {
      event.preventDefault();
      this.toggleChat();
    } else if (target.classList.contains('ai-altius-altius-chat-send')) {
      event.preventDefault();
      this.sendMessage();
    } else if (target.classList.contains('ai-altius-altius-chat-close')) {
      event.preventDefault();
      this.closeChat();
    }
  }

  /**
   * Handle Space key
   */
  handleSpace(event) {
    const target = event.target;
    
    if (target.classList.contains('ai-altius-altius-chat-bubble') ||
        target.classList.contains('ai-altius-altius-chat-send') ||
        target.classList.contains('ai-altius-altius-chat-close')) {
      event.preventDefault();
      this.handleEnter(event);
    }
  }

  /**
   * Trap focus within popup
   */
  trapFocus(event, container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Get focusable elements
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return Array.from(container.querySelectorAll(focusableSelectors.join(', ')));
  }

  /**
   * Setup screen reader support
   */
  setupScreenReaderSupport() {
    if (!this.isEnabled) return;

    // Add live region for announcements
    this.createLiveRegion();
    
    // Add skip link
    this.createSkipLink();
  }

  /**
   * Create live region for screen reader announcements
   */
  createLiveRegion() {
    let liveRegion = document.getElementById('widget-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'widget-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }
  }

  /**
   * Announce message to screen reader
   */
  announce(message) {
    if (!this.isEnabled) return;

    const liveRegion = document.getElementById('widget-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Create skip link
   */
  createSkipLink() {
    let skipLink = document.getElementById('widget-skip-link');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.id = 'widget-skip-link';
      skipLink.href = '#widget-main-content';
      skipLink.textContent = 'Skip to chat widget';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1EC0AA;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000000;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.appendChild(skipLink);
    }
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    if (!this.isEnabled) return;

    // Store original tabindex values
    this.storeOriginalTabIndex();
    
    // Add focus indicators
    this.addFocusIndicators();
  }

  /**
   * Store original tabindex values
   */
  storeOriginalTabIndex() {
    const widget = document.querySelector('.ai-altius-altius-chat-widget');
    if (!widget) return;

    const elements = widget.querySelectorAll('[tabindex]');
    elements.forEach(element => {
      this.originalTabIndex.set(element, element.getAttribute('tabindex'));
    });
  }

  /**
   * Restore original tabindex values
   */
  restoreTabIndex() {
    this.originalTabIndex.forEach((tabindex, element) => {
      if (tabindex) {
        element.setAttribute('tabindex', tabindex);
      } else {
        element.removeAttribute('tabindex');
      }
    });
  }

  /**
   * Add focus indicators
   */
  addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-altius-altius-chat-widget *:focus {
        outline: 2px solid #1EC0AA !important;
        outline-offset: 2px !important;
      }
      
      .ai-altius-altius-chat-widget *:focus:not(:focus-visible) {
        outline: none !important;
      }
      
      .ai-altius-altius-chat-widget *:focus-visible {
        outline: 2px solid #1EC0AA !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup ARIA labels
   */
  setupARIALabels() {
    if (!this.isEnabled) return;

    // Add ARIA labels to interactive elements
    this.addARIALabels();
    
    // Add ARIA roles
    this.addARIARoles();
  }

  /**
   * Add ARIA labels
   */
  addARIALabels() {
    const widget = document.querySelector('.ai-altius-altius-chat-widget');
    if (!widget) return;

    // Chat bubble
    const bubble = widget.querySelector('.ai-altius-altius-chat-bubble');
    if (bubble) {
      bubble.setAttribute('aria-label', 'Open chat with Altius Assistant');
      bubble.setAttribute('role', 'button');
      bubble.setAttribute('tabindex', '0');
    }

    // Close button
    const closeBtn = widget.querySelector('.ai-altius-altius-chat-close');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', 'Close chat');
      closeBtn.setAttribute('role', 'button');
    }

    // Send button
    const sendBtn = widget.querySelector('.ai-altius-altius-chat-send');
    if (sendBtn) {
      sendBtn.setAttribute('aria-label', 'Send message');
      sendBtn.setAttribute('role', 'button');
    }

    // Input field
    const input = widget.querySelector('.ai-altius-altius-chat-input');
    if (input) {
      input.setAttribute('aria-label', 'Type your message');
      input.setAttribute('aria-describedby', 'input-instructions');
    }

    // Add input instructions
    const instructions = document.createElement('div');
    instructions.id = 'input-instructions';
    instructions.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    instructions.textContent = 'Press Enter to send your message';
    input?.parentNode?.appendChild(instructions);
  }

  /**
   * Add ARIA roles
   */
  addARIARoles() {
    const widget = document.querySelector('.ai-altius-altius-chat-widget');
    if (!widget) return;

    // Main widget container
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'Chat widget');

    // Popup container
    const popup = widget.querySelector('.ai-altius-altius-chat-popup');
    if (popup) {
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-modal', 'true');
      popup.setAttribute('aria-label', 'Chat conversation');
    }

    // Content area
    const content = widget.querySelector('.ai-altius-altius-chat-content');
    if (content) {
      content.setAttribute('role', 'log');
      content.setAttribute('aria-live', 'polite');
      content.setAttribute('aria-label', 'Chat messages');
    }

    // Status indicator
    const status = widget.querySelector('.ai-altius-altius-chat-status');
    if (status) {
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
    }
  }

  /**
   * Toggle chat (accessible version)
   */
  toggleChat() {
    const popup = document.querySelector('.ai-altius-altius-chat-popup');
    const bubble = document.querySelector('.ai-altius-altius-chat-bubble');
    
    if (popup && popup.classList.contains('show')) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  /**
   * Open chat (accessible version)
   */
  openChat() {
    const popup = document.querySelector('.ai-altius-altius-chat-popup');
    const bubble = document.querySelector('.ai-altius-altius-chat-bubble');
    
    if (popup && bubble) {
      popup.classList.add('show');
      bubble.classList.add('open');
      
      // Focus first focusable element
      const firstFocusable = this.getFocusableElements(popup)[0];
      if (firstFocusable) {
        firstFocusable.focus();
      }
      
      // Announce to screen reader
      this.announce('Chat opened');
    }
  }

  /**
   * Close chat (accessible version)
   */
  closeChat() {
    const popup = document.querySelector('.ai-altius-altius-chat-popup');
    const bubble = document.querySelector('.ai-altius-altius-chat-bubble');
    
    if (popup && bubble) {
      popup.classList.remove('show');
      bubble.classList.remove('open');
      
      // Focus back to bubble
      bubble.focus();
      
      // Announce to screen reader
      this.announce('Chat closed');
    }
  }

  /**
   * Send message (accessible version)
   */
  sendMessage() {
    const input = document.querySelector('.ai-altius-altius-chat-input');
    const sendBtn = document.querySelector('.ai-altius-altius-chat-send');
    
    if (input && input.value.trim()) {
      // Trigger send event
      const event = new Event('click');
      sendBtn?.dispatchEvent(event);
      
      // Announce to screen reader
      this.announce('Message sent');
    }
  }

  /**
   * Get accessibility status
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      focusableElements: this.getFocusableElements(document.querySelector('.ai-altius-altius-chat-widget')).length,
      hasLiveRegion: !!document.getElementById('widget-live-region'),
      hasSkipLink: !!document.getElementById('widget-skip-link'),
    };
  }
}

// Export accessibility manager
export const accessibilityManager = new AccessibilityManager();

// Make available globally
window.widgetAccessibility = accessibilityManager;

export default accessibilityManager; 
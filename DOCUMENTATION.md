# Altius Chat Widget - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Components](#components)
7. [Services](#services)
8. [Utilities](#utilities)
9. [Theming](#theming)
10. [Internationalization](#internationalization)
11. [Accessibility](#accessibility)
12. [Security](#security)
13. [Performance](#performance)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Troubleshooting](#troubleshooting)
17. [Examples](#examples)
18. [Contributing](#contributing)

## Overview

Altius Chat Widget adalah widget chat yang modular, maintainable, dan feature-rich yang dirancang untuk integrasi yang mudah dengan berbagai website. Widget ini mendukung responsive design, accessibility, internationalization, dan berbagai fitur keamanan.

### Key Features

- **Modular Architecture**: Struktur kode yang terorganisir dan mudah di-maintain
- **Responsive Design**: Mendukung berbagai ukuran layar
- **Accessibility**: WCAG 2.1 compliant dengan keyboard navigation
- **Internationalization**: Multi-language support
- **Security**: Input validation, XSS protection, rate limiting
- **Performance**: Caching, lazy loading, optimized animations
- **Analytics**: Built-in tracking dan monitoring
- **Customizable**: Theme system yang fleksibel

## Architecture

### File Structure

```
altius-chat-widget/
├── config/
│   ├── theme.js          # Theme configuration
│   └── constants.js      # Constants and defaults
├── services/
│   └── api.js           # API communication service
├── utils/
│   ├── helpers.js       # Helper functions
│   ├── analytics.js     # Analytics and monitoring
│   ├── accessibility.js # Accessibility features
│   ├── i18n.js         # Internationalization
│   ├── security.js     # Security utilities
│   ├── cache.js        # Caching system
│   └── logger.js       # Logging system
├── components/
│   └── ChatWidget.js   # Main widget component
├── styles/
│   └── chatWidget.css  # CSS styles
├── test/
│   ├── widget.test.js  # Unit tests
│   ├── integration.test.js # Integration tests
│   └── setup.js        # Test setup
├── index.js            # Main entry point
├── build.js           # Build script
├── dev-server.js      # Development server
├── deploy.js          # Deployment script
├── package.json       # Dependencies
└── README.md          # Documentation
```

### Design Patterns

- **Module Pattern**: Setiap file adalah modul independen
- **Service Layer**: Pemisahan logic bisnis dari UI
- **Observer Pattern**: Event-driven communication
- **Factory Pattern**: Pembuatan elemen DOM
- **Singleton Pattern**: Manager instances

## Installation

### Prerequisites

- Node.js 14+ (untuk development)
- Modern browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)

### Quick Start

1. **Include Widget**

```html
<script src="altius-chat-widget.min.js"></script>
```

2. **Setup Configuration**

```javascript
// Setup credentials
window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";
window.personal_data = { name: "User Name" };
```

3. **Widget akan auto-initialize**

### Advanced Installation

```javascript
// Manual initialization
import ChatWidget from './components/ChatWidget.js';
import { theme } from './config/theme.js';

const widget = new ChatWidget();
await widget.init();
```

## Configuration

### Basic Configuration

```javascript
window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";
window.personal_data = {
  name: "User Name",
  email: "user@example.com",
  id: "user-123"
};
```

### Advanced Configuration

```javascript
// Custom endpoints
window.chat_i18n_endpoint = "https://api.example.com/i18n";
window.chat_analytics_endpoint = "https://api.example.com/analytics";

// Custom settings
window.chat_settings = {
  locale: "id",
  theme: "custom",
  features: {
    analytics: true,
    accessibility: true,
    caching: true
  }
};
```

### Theme Configuration

```javascript
import { theme } from './config/theme.js';

// Customize theme
theme.colors.primary = "#your-color";
theme.spacing.md = "16px";
theme.typography.fontFamily = "Your Font, sans-serif";
```

## API Reference

### ChatWidget Class

#### Constructor
```javascript
const widget = new ChatWidget();
```

#### Methods

##### `init()`
Inisialisasi widget
```javascript
await widget.init();
```

##### `toggleChat()`
Toggle buka/tutup chat
```javascript
widget.toggleChat();
```

##### `sendMessage()`
Kirim pesan
```javascript
await widget.sendMessage();
```

##### `renderMessage(content, isUser, customTime)`
Render pesan
```javascript
widget.renderMessage("Hello", false, new Date());
```

##### `destroy()`
Hapus widget
```javascript
widget.destroy();
```

### ChatAPIService Class

#### Methods

##### `initialize()`
Inisialisasi service
```javascript
const { sessionId, userAgentData } = await apiService.initialize();
```

##### `sendMessage(prompt, chatHistory)`
Kirim pesan ke API
```javascript
const response = await apiService.sendMessage("Hello", []);
```

##### `createSession()`
Buat session baru
```javascript
const sessionId = await apiService.createSession();
```

## Components

### ChatWidget Component

Komponen utama yang mengelola UI dan logic widget.

```javascript
class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.apiService = new ChatAPIService();
  }
  
  async init() {
    // Initialize widget
  }
  
  createWidget() {
    // Create DOM elements
  }
  
  setupEventListeners() {
    // Setup event handlers
  }
}
```

### DOM Structure

```html
<div class="ai-altius-altius-chat-widget">
  <button class="ai-altius-altius-chat-bubble">
    <!-- Chat icon -->
  </button>
  
  <div class="ai-altius-altius-chat-popup">
    <div class="ai-altius-altius-chat-header">
      <!-- Header content -->
    </div>
    
    <div class="ai-altius-altius-chat-content">
      <!-- Messages -->
    </div>
    
    <div class="ai-altius-altius-chat-input-area">
      <!-- Input area -->
    </div>
  </div>
</div>
```

## Services

### API Service

Mengelola komunikasi dengan backend API.

```javascript
class ChatAPIService {
  async createSession() { /* ... */ }
  async sendMessage(prompt, chatHistory) { /* ... */ }
  async fetchUserAgentDetails() { /* ... */ }
}
```

### Analytics Service

Tracking dan monitoring widget usage.

```javascript
analytics.track('event_name', data);
analytics.trackInit();
analytics.trackChatOpen();
analytics.trackMessageSent(messageLength);
```

## Utilities

### Helper Functions

```javascript
import { 
  injectStyles, 
  createElement, 
  formatTime, 
  scrollToBottom 
} from './utils/helpers.js';

// Inject CSS
injectStyles(cssString);

// Create DOM element
const element = createElement('div', '<span>Content</span>');

// Format time
const time = formatTime(new Date());

// Scroll to bottom
scrollToBottom(element);
```

### Security Utilities

```javascript
import { securityManager } from './utils/security.js';

// Validate input
const result = securityManager.processInput(input, {
  sanitizeType: 'html',
  validators: ['messageLength', 'content', 'spam']
});

// Check for XSS
const xssCheck = securityManager.checkXSS(input);
```

### Cache Utilities

```javascript
import { cacheManager } from './utils/cache.js';

// Cache data
cacheManager.set('key', 'value', 60000);

// Get cached data
const value = cacheManager.get('key');

// Cache with automatic refresh
const data = await cacheManager.getOrSet('key', async () => {
  return await fetchData();
});
```

## Theming

### Theme Configuration

```javascript
const theme = {
  colors: {
    primary: "#1EC0AA",
    secondary: "#10b981",
    text: {
      primary: "#ffffff",
      secondary: "#374151"
    }
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px"
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      sm: "14px",
      base: "16px"
    }
  }
};
```

### Custom CSS

```css
/* Override default styles */
.ai-altius-altius-chat-widget {
  --primary-color: #your-color;
  --secondary-color: #your-secondary;
}

.ai-altius-altius-chat-bubble {
  background: var(--primary-color);
}
```

## Internationalization

### Setup i18n

```javascript
import { i18nManager } from './utils/i18n.js';

// Initialize with locale
await i18nManager.init('id');

// Get translation
const message = i18nManager.t('welcomeMessage');

// Change locale
await i18nManager.setLocale('en');
```

### Supported Languages

- Indonesian (id)
- English (en)
- Japanese (ja)

### Custom Translations

```javascript
// Add custom translations
i18nManager.translations.custom = {
  welcomeMessage: "Custom welcome message",
  sendButton: "Custom send button"
};
```

## Accessibility

### Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and live regions
- **Focus Management**: Proper focus trapping
- **High Contrast**: Support for high contrast mode
- **Skip Links**: Skip to main content

### Usage

```javascript
import { accessibilityManager } from './utils/accessibility.js';

// Enable accessibility
accessibilityManager.enable();

// Announce to screen reader
accessibilityManager.announce('Chat opened');

// Get accessibility status
const status = accessibilityManager.getStatus();
```

### ARIA Labels

```html
<button aria-label="Open chat with Altius Assistant" role="button">
  <!-- Chat icon -->
</button>

<div role="dialog" aria-modal="true" aria-label="Chat conversation">
  <!-- Chat content -->
</div>
```

## Security

### Features

- **Input Validation**: Validate all user inputs
- **XSS Protection**: Prevent cross-site scripting
- **Rate Limiting**: Prevent spam and abuse
- **Content Sanitization**: Sanitize HTML content
- **File Upload Validation**: Validate file uploads

### Usage

```javascript
import { securityManager } from './utils/security.js';

// Validate input
const result = securityManager.processInput(input, {
  sanitizeType: 'html',
  validators: ['messageLength', 'content', 'spam']
});

// Check for XSS
const xssCheck = securityManager.checkXSS(input);

// Validate file upload
const fileValidation = securityManager.validateFileUpload(file, {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
});
```

## Performance

### Optimizations

- **Lazy Loading**: Load components on demand
- **Caching**: Cache API responses and data
- **Debouncing**: Debounce input events
- **Throttling**: Throttle scroll events
- **CSS Animations**: Use CSS for animations

### Monitoring

```javascript
import { analytics } from './utils/analytics.js';

// Monitor performance
const loadTimer = analytics.performanceMonitor.measureLoadTime();
loadTimer.end();

// Monitor API calls
const apiTimer = analytics.performanceMonitor.measureApiCall('chat-api');
apiTimer.end(true);
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Test Coverage

```bash
npm run test:coverage
```

### Manual Testing

```bash
npm run dev
# Open http://localhost:3000
```

## Deployment

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

### Production

```html
<!-- Production version -->
<script src="altius-chat-widget.min.js"></script>
```

## Troubleshooting

### Common Issues

#### Widget tidak muncul
```javascript
// Check console for errors
console.log('Widget status:', window.AltiusChatWidget);

// Check API credentials
console.log('API key:', window.chat_api_key);
```

#### API tidak berfungsi
```javascript
// Check network tab
// Verify endpoints
// Check CORS settings
```

#### Styling tidak sesuai
```css
/* Override conflicting styles */
.ai-altius-altius-chat-widget {
  z-index: 999999 !important;
}
```

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('widget_log_level', 'debug');

// View logs
console.log('Widget logs:', window.widgetLogger.getLogs());
```

## Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat Widget Demo</title>
</head>
<body>
    <h1>Welcome to Chat Widget Demo</h1>
    
    <script>
        // Setup credentials
        window.chat_api_key = "demo-key";
        window.chat_api_tenant = "demo-tenant";
        window.personal_data = { name: "Demo User" };
    </script>
    
    <script src="altius-chat-widget.min.js"></script>
</body>
</html>
```

### Advanced Implementation

```javascript
import ChatWidget from './components/ChatWidget.js';
import { theme } from './config/theme.js';

// Customize theme
theme.colors.primary = "#ff6b6b";

// Initialize widget
const widget = new ChatWidget();
await widget.init();

// Listen for events
window.addEventListener('widgetLocaleChange', (event) => {
  console.log('Locale changed:', event.detail);
});
```

### Custom Styling

```css
/* Custom theme */
:root {
  --widget-primary: #ff6b6b;
  --widget-secondary: #4ecdc4;
  --widget-text: #2c3e50;
}

.ai-altius-altius-chat-widget {
  --primary-color: var(--widget-primary);
  --secondary-color: var(--widget-secondary);
  --text-color: var(--widget-text);
}
```

## Contributing

### Development Setup

1. **Clone repository**
```bash
git clone https://github.com/altius/chat-widget.git
cd chat-widget
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Run tests**
```bash
npm test
```

### Code Style

- Use ES6+ features
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update documentation
6. Submit pull request

### Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Build production files
5. Deploy to CDN

---

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Email: support@altius.com
- Documentation: https://docs.altius.com/widget
- Issues: https://github.com/altius/chat-widget/issues 
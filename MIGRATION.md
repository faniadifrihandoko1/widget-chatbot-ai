# Migration Guide - Altius Chat Widget v1.0.0

## Overview

Altius Chat Widget v1.0.0 adalah major release yang membawa perubahan signifikan dalam arsitektur dan API. Guide ini akan membantu Anda migrasi dari versi sebelumnya ke versi baru.

## Breaking Changes

### 1. File Structure Changes

**Before (v0.9.0):**
```
altius-chat-widget/
├── altius-chat-widget.min.js
└── index.html
```

**After (v1.0.0):**
```
altius-chat-widget/
├── config/
│   ├── theme.js
│   └── constants.js
├── services/
│   └── api.js
├── utils/
│   ├── helpers.js
│   ├── analytics.js
│   ├── accessibility.js
│   ├── i18n.js
│   ├── security.js
│   ├── cache.js
│   └── logger.js
├── components/
│   └── ChatWidget.js
├── styles/
│   └── chatWidget.css
├── test/
│   ├── widget.test.js
│   ├── integration.test.js
│   └── setup.js
├── index.js
├── build.js
├── dev-server.js
├── deploy.js
├── package.json
└── README.md
```

### 2. Configuration Changes

**Before (v0.9.0):**
```javascript
window.chat_config = {
  api_key: "your-api-key",
  tenant: "your-tenant",
  theme: "default",
  language: "id"
};
```

**After (v1.0.0):**
```javascript
// Separate global variables
window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";
window.personal_data = {
  name: "User Name",
  email: "user@example.com",
  id: "user-123"
};

// Optional custom settings
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

### 3. API Changes

**Before (v0.9.0):**
```javascript
// Manual initialization
window.AltiusChat.init();

// Direct API calls
window.AltiusChat.sendMessage("Hello");
```

**After (v1.0.0):**
```javascript
// Auto-initialization (recommended)
// Widget will auto-initialize when script loads

// Manual initialization (if needed)
window.AltiusChatWidget.init();

// API calls through service
const apiService = new ChatAPIService();
await apiService.sendMessage("Hello", chatHistory);
```

### 4. CSS Class Changes

**Before (v0.9.0):**
```css
.altius-chat-widget { /* styles */ }
.altius-chat-bubble { /* styles */ }
.altius-chat-popup { /* styles */ }
```

**After (v1.0.0):**
```css
.ai-altius-altius-chat-widget { /* styles */ }
.ai-altius-altius-chat-bubble { /* styles */ }
.ai-altius-altius-chat-popup { /* styles */ }
```

### 5. Event Changes

**Before (v0.9.0):**
```javascript
window.addEventListener('chatMessage', handler);
window.addEventListener('chatOpen', handler);
window.addEventListener('chatClose', handler);
```

**After (v1.0.0):**
```javascript
window.addEventListener('widgetLocaleChange', handler);
window.addEventListener('widgetError', handler);
window.addEventListener('widgetAnalytics', handler);
```

## Step-by-Step Migration

### Step 1: Update File References

**Before:**
```html
<script src="altius-chat-widget.min.js"></script>
```

**After:**
```html
<!-- For production (minified) -->
<script src="altius-chat-widget.min.js"></script>

<!-- For development (modular) -->
<script type="module" src="index.js"></script>
```

### Step 2: Update Configuration

**Before:**
```javascript
window.chat_config = {
  api_key: "your-api-key",
  tenant: "your-tenant",
  theme: {
    primary: "#1EC0AA",
    secondary: "#10b981"
  }
};
```

**After:**
```javascript
// Required configuration
window.chat_api_key = "your-api-key";
window.chat_api_tenant = "your-tenant";
window.personal_data = {
  name: "User Name",
  email: "user@example.com"
};

// Optional theme customization
window.AltiusChatWidget.config.colors.primary = "#1EC0AA";
window.AltiusChatWidget.config.colors.secondary = "#10b981";
```

### Step 3: Update Event Listeners

**Before:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('chatMessage', function(event) {
    console.log('Message:', event.detail);
  });
});
```

**After:**
```javascript
// Widget events are now more specific
window.addEventListener('widgetLocaleChange', function(event) {
  console.log('Locale changed:', event.detail);
});

// For message tracking, use analytics
window.widgetAnalytics.track('message_sent', { length: 10 });
```

### Step 4: Update Custom Styling

**Before:**
```css
.altius-chat-widget {
  --primary-color: #your-color;
}

.altius-chat-bubble {
  background: var(--primary-color);
}
```

**After:**
```css
.ai-altius-altius-chat-widget {
  --primary-color: #your-color;
}

.ai-altius-altius-chat-bubble {
  background: var(--primary-color);
}
```

### Step 5: Update API Integration

**Before:**
```javascript
// Direct API calls
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
});
```

**After:**
```javascript
// Use service layer
import ChatAPIService from './services/api.js';

const apiService = new ChatAPIService();
const response = await apiService.sendMessage('Hello', chatHistory);
```

## New Features to Adopt

### 1. Internationalization

```javascript
// Enable i18n
import { i18nManager } from './utils/i18n.js';

await i18nManager.init('id');
const message = i18nManager.t('welcomeMessage');
```

### 2. Analytics

```javascript
// Track events
import { analytics } from './utils/analytics.js';

analytics.track('user_interaction', { action: 'click' });
analytics.trackInit();
```

### 3. Security

```javascript
// Validate inputs
import { securityManager } from './utils/security.js';

const result = securityManager.processInput(input, {
  sanitizeType: 'html',
  validators: ['messageLength', 'content']
});
```

### 4. Caching

```javascript
// Use caching
import { cacheManager } from './utils/cache.js';

cacheManager.set('key', 'value', 60000);
const value = cacheManager.get('key');
```

### 5. Accessibility

```javascript
// Enable accessibility
import { accessibilityManager } from './utils/accessibility.js';

accessibilityManager.enable();
accessibilityManager.announce('Chat opened');
```

## Migration Checklist

### Configuration
- [ ] Update API key configuration
- [ ] Update tenant configuration
- [ ] Add personal data configuration
- [ ] Update theme configuration (if custom)
- [ ] Test configuration loading

### Files
- [ ] Update script references
- [ ] Update CSS class names
- [ ] Update file paths
- [ ] Test file loading

### Events
- [ ] Update event listeners
- [ ] Test event handling
- [ ] Update custom event handlers
- [ ] Test event flow

### Styling
- [ ] Update CSS selectors
- [ ] Test responsive design
- [ ] Update custom themes
- [ ] Test accessibility

### API
- [ ] Update API calls
- [ ] Test API integration
- [ ] Update error handling
- [ ] Test error scenarios

### Features
- [ ] Enable new features (i18n, analytics, etc.)
- [ ] Test new functionality
- [ ] Update documentation
- [ ] Train team on new features

## Testing Migration

### 1. Development Testing

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check for errors
npm run lint
```

### 2. Production Testing

```bash
# Build for production
npm run build

# Deploy
npm run deploy

# Test in production environment
```

### 3. Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 4. Feature Testing

- [ ] Chat functionality
- [ ] Message sending
- [ ] Responsive design
- [ ] Accessibility
- [ ] Internationalization
- [ ] Analytics
- [ ] Security features
- [ ] Performance

## Rollback Plan

If issues occur during migration:

### 1. Immediate Rollback

```html
<!-- Revert to old version -->
<script src="altius-chat-widget-v0.9.0.min.js"></script>
```

### 2. Configuration Rollback

```javascript
// Revert configuration
window.chat_config = {
  api_key: "your-api-key",
  tenant: "your-tenant",
  theme: "default"
};
```

### 3. CSS Rollback

```css
/* Revert CSS classes */
.altius-chat-widget { /* old styles */ }
```

## Support

### Documentation
- [Complete Documentation](DOCUMENTATION.md)
- [API Reference](DOCUMENTATION.md#api-reference)
- [Examples](DOCUMENTATION.md#examples)

### Help Resources
- **Email**: support@altius.com
- **GitHub Issues**: [github.com/altius/chat-widget/issues](https://github.com/altius/chat-widget/issues)
- **Discord**: [discord.gg/altius](https://discord.gg/altius)

### Migration Support
- **Migration Guide**: This document
- **Code Examples**: [examples/](examples/)
- **Video Tutorials**: [youtube.com/altius](https://youtube.com/altius)

## Timeline

### Recommended Migration Timeline

1. **Week 1**: Planning and preparation
2. **Week 2**: Development and testing
3. **Week 3**: Staging deployment
4. **Week 4**: Production deployment

### Critical Dates

- **End of Support**: v0.9.0 support ends on 2024-02-15
- **Security Updates**: v0.9.0 security updates end on 2024-01-31
- **New Features**: Only available in v1.0.0+

## Conclusion

Migration to v1.0.0 brings significant improvements in:
- **Architecture**: Modular and maintainable
- **Features**: Rich functionality
- **Security**: Enhanced protection
- **Performance**: Optimized performance
- **Accessibility**: Full compliance
- **Internationalization**: Multi-language support

Follow this guide carefully and test thoroughly to ensure a smooth migration experience. 
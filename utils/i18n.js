// Internationalization (i18n) untuk Altius Chat Widget
class I18nManager {
  constructor() {
    this.currentLocale = 'id';
    this.fallbackLocale = 'en';
    this.translations = {};
    this.loadedLocales = new Set();
  }

  /**
   * Initialize i18n
   */
  async init(locale = 'id') {
    this.currentLocale = locale;
    await this.loadTranslations(locale);
    this.setupLocaleDetection();
  }

  /**
   * Load translations for locale
   */
  async loadTranslations(locale) {
    if (this.loadedLocales.has(locale)) return;

    try {
      // Load from external file or use built-in translations
      const translations = await this.getTranslations(locale);
      this.translations[locale] = translations;
      this.loadedLocales.add(locale);
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}:`, error);
      // Fallback to built-in translations
      this.translations[locale] = this.getBuiltInTranslations(locale);
    }
  }

  /**
   * Get translations from external source or built-in
   */
  async getTranslations(locale) {
    // Try to load from external endpoint
    if (window.chat_i18n_endpoint) {
      try {
        const response = await fetch(`${window.chat_i18n_endpoint}/${locale}.json`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Failed to load external translations:', error);
      }
    }

    // Fallback to built-in translations
    return this.getBuiltInTranslations(locale);
  }

  /**
   * Get built-in translations
   */
  getBuiltInTranslations(locale) {
    const translations = {
      id: {
        // UI Elements
        chatTitle: 'Chat dengan Altius',
        onlineStatus: 'Online',
        offlineStatus: 'Offline',
        typingIndicator: 'Sedang mengetik...',
        
        // Messages
        welcomeMessage: 'Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu hari ini ?',
        placeholder: 'Ketik pesan Anda...',
        sendButton: 'Kirim',
        closeButton: 'Tutup',
        
        // Actions
        openChat: 'Buka chat',
        closeChat: 'Tutup chat',
        sendMessage: 'Kirim pesan',
        
        // Errors
        networkError: 'Gagal terhubung ke server. Coba lagi.',
        apiError: 'Terjadi kesalahan. Silakan coba lagi.',
        messageError: 'Gagal mengirim pesan. Coba lagi.',
        
        // Accessibility
        skipToChat: 'Lompat ke chat widget',
        chatOpened: 'Chat dibuka',
        chatClosed: 'Chat ditutup',
        messageSent: 'Pesan terkirim',
        messageReceived: 'Pesan diterima',
        
        // Time
        justNow: 'Baru saja',
        minutesAgo: 'menit yang lalu',
        hoursAgo: 'jam yang lalu',
        today: 'Hari ini',
        yesterday: 'Kemarin',
        
        // Status
        connecting: 'Menghubungkan...',
        connected: 'Terhubung',
        disconnected: 'Terputus',
        reconnecting: 'Menghubungkan ulang...',
        
        // Notifications
        newMessage: 'Pesan baru',
        unreadMessages: 'pesan belum dibaca',
        
        // Help
        helpText: 'Ketik pertanyaan Anda dan tekan Enter untuk mengirim',
        maxLength: 'Maksimal 500 karakter',
        
        // Footer
        poweredBy: 'Didukung oleh Altius AI',
        version: 'Versi',
      },
      
      en: {
        // UI Elements
        chatTitle: 'Chat with Altius',
        onlineStatus: 'Online',
        offlineStatus: 'Offline',
        typingIndicator: 'Typing...',
        
        // Messages
        welcomeMessage: 'Hello! I am your AI virtual assistant. How can I help you today?',
        placeholder: 'Type your message...',
        sendButton: 'Send',
        closeButton: 'Close',
        
        // Actions
        openChat: 'Open chat',
        closeChat: 'Close chat',
        sendMessage: 'Send message',
        
        // Errors
        networkError: 'Failed to connect to server. Please try again.',
        apiError: 'An error occurred. Please try again.',
        messageError: 'Failed to send message. Please try again.',
        
        // Accessibility
        skipToChat: 'Skip to chat widget',
        chatOpened: 'Chat opened',
        chatClosed: 'Chat closed',
        messageSent: 'Message sent',
        messageReceived: 'Message received',
        
        // Time
        justNow: 'Just now',
        minutesAgo: 'minutes ago',
        hoursAgo: 'hours ago',
        today: 'Today',
        yesterday: 'Yesterday',
        
        // Status
        connecting: 'Connecting...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        reconnecting: 'Reconnecting...',
        
        // Notifications
        newMessage: 'New message',
        unreadMessages: 'unread messages',
        
        // Help
        helpText: 'Type your question and press Enter to send',
        maxLength: 'Maximum 500 characters',
        
        // Footer
        poweredBy: 'Powered by Altius AI',
        version: 'Version',
      },
      
      ja: {
        // UI Elements
        chatTitle: 'Altiusとのチャット',
        onlineStatus: 'オンライン',
        offlineStatus: 'オフライン',
        typingIndicator: '入力中...',
        
        // Messages
        welcomeMessage: 'こんにちは！私はAI仮想アシスタントです。今日は何かお手伝いできることはありますか？',
        placeholder: 'メッセージを入力...',
        sendButton: '送信',
        closeButton: '閉じる',
        
        // Actions
        openChat: 'チャットを開く',
        closeChat: 'チャットを閉じる',
        sendMessage: 'メッセージを送信',
        
        // Errors
        networkError: 'サーバーへの接続に失敗しました。もう一度お試しください。',
        apiError: 'エラーが発生しました。もう一度お試しください。',
        messageError: 'メッセージの送信に失敗しました。もう一度お試しください。',
        
        // Accessibility
        skipToChat: 'チャットウィジェットにスキップ',
        chatOpened: 'チャットが開かれました',
        chatClosed: 'チャットが閉じられました',
        messageSent: 'メッセージが送信されました',
        messageReceived: 'メッセージを受信しました',
        
        // Time
        justNow: '今',
        minutesAgo: '分前',
        hoursAgo: '時間前',
        today: '今日',
        yesterday: '昨日',
        
        // Status
        connecting: '接続中...',
        connected: '接続済み',
        disconnected: '切断',
        reconnecting: '再接続中...',
        
        // Notifications
        newMessage: '新しいメッセージ',
        unreadMessages: '未読メッセージ',
        
        // Help
        helpText: '質問を入力してEnterキーを押して送信',
        maxLength: '最大500文字',
        
        // Footer
        poweredBy: 'Altius AI提供',
        version: 'バージョン',
      }
    };

    return translations[locale] || translations[this.fallbackLocale];
  }

  /**
   * Setup automatic locale detection
   */
  setupLocaleDetection() {
    // Detect from browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLocale = this.detectLocale(browserLang);
    
    if (detectedLocale && detectedLocale !== this.currentLocale) {
      this.setLocale(detectedLocale);
    }
  }

  /**
   * Detect locale from browser language
   */
  detectLocale(browserLang) {
    const supportedLocales = ['id', 'en', 'ja'];
    const langCode = browserLang.split('-')[0];
    
    if (supportedLocales.includes(langCode)) {
      return langCode;
    }
    
    return this.fallbackLocale;
  }

  /**
   * Set locale
   */
  async setLocale(locale) {
    if (locale === this.currentLocale) return;
    
    await this.loadTranslations(locale);
    this.currentLocale = locale;
    
    // Update UI elements
    this.updateUI();
    
    // Trigger locale change event
    this.triggerLocaleChangeEvent(locale);
  }

  /**
   * Get translation
   */
  t(key, params = {}) {
    const translation = this.translations[this.currentLocale]?.[key] || 
                       this.translations[this.fallbackLocale]?.[key] || 
                       key;
    
    return this.interpolate(translation, params);
  }

  /**
   * Interpolate parameters in translation
   */
  interpolate(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Update UI elements with new translations
   */
  updateUI() {
    const widget = document.querySelector('.ai-altius-altius-chat-widget');
    if (!widget) return;

    // Update title
    const title = widget.querySelector('.ai-altius-altius-chat-title');
    if (title) {
      title.textContent = this.t('chatTitle');
    }

    // Update status
    const status = widget.querySelector('.ai-altius-altius-chat-status');
    if (status) {
      const statusText = status.querySelector('span:last-child');
      if (statusText) {
        statusText.textContent = this.t('onlineStatus');
      }
    }

    // Update input placeholder
    const input = widget.querySelector('.ai-altius-altius-chat-input');
    if (input) {
      input.placeholder = this.t('placeholder');
    }

    // Update send button
    const sendBtn = widget.querySelector('.ai-altius-altius-chat-send');
    if (sendBtn) {
      sendBtn.setAttribute('aria-label', this.t('sendButton'));
    }

    // Update close button
    const closeBtn = widget.querySelector('.ai-altius-altius-chat-close');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', this.t('closeButton'));
    }

    // Update accessibility elements
    const skipLink = document.getElementById('widget-skip-link');
    if (skipLink) {
      skipLink.textContent = this.t('skipToChat');
    }
  }

  /**
   * Trigger locale change event
   */
  triggerLocaleChangeEvent(locale) {
    const event = new CustomEvent('widgetLocaleChange', {
      detail: { locale, previousLocale: this.currentLocale }
    });
    window.dispatchEvent(event);
  }

  /**
   * Format date/time according to locale
   */
  formatDateTime(date, format = 'time') {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (format === 'relative') {
      if (minutes < 1) return this.t('justNow');
      if (minutes < 60) return `${minutes} ${this.t('minutesAgo')}`;
      if (hours < 24) return `${hours} ${this.t('hoursAgo')}`;
      if (days === 1) return this.t('yesterday');
      if (days === 0) return this.t('today');
    }

    // Format based on locale
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(format === 'full' && {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    return date.toLocaleString(this.currentLocale, options);
  }

  /**
   * Get current locale
   */
  getCurrentLocale() {
    return this.currentLocale;
  }

  /**
   * Get supported locales
   */
  getSupportedLocales() {
    return Array.from(this.loadedLocales);
  }

  /**
   * Check if locale is supported
   */
  isLocaleSupported(locale) {
    return this.loadedLocales.has(locale);
  }

  /**
   * Get translation statistics
   */
  getStats() {
    return {
      currentLocale: this.currentLocale,
      fallbackLocale: this.fallbackLocale,
      loadedLocales: Array.from(this.loadedLocales),
      totalTranslations: Object.keys(this.translations[this.currentLocale] || {}).length,
    };
  }
}

// Export i18n manager
export const i18nManager = new I18nManager();

// Make available globally
window.widgetI18n = i18nManager;

export default i18nManager; 
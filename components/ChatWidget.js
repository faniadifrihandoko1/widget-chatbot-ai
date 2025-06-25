// Komponen utama Altius Chat Widget
import {
  CSS_CLASSES,
  DEFAULT_USER_AGENT_DATA,
  ELEMENT_IDS,
  WELCOME_MESSAGE,
} from "../config/constants.js";
import ChatAPIService from "../services/api.js";
import {
  addEventListenerSafe,
  addRippleEffect,
  createElement,
  formatTime,
  resetAnimation,
  scrollToBottom,
} from "../utils/helpers.js";

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.apiService = new ChatAPIService();
    this.userAgentData = { ...DEFAULT_USER_AGENT_DATA };
    this.widgetInitTime = new Date();

    // DOM elements
    this.elements = {
      widget: null,
      bubble: null,
      popup: null,
      close: null,
      input: null,
      send: null,
      content: null,
    };
  }

  /**
   * Inisialisasi widget chat
   */
  async init() {
    try {
      // Inisialisasi API service
      const { sessionId, userAgentData } = await this.apiService.initialize();

      if (userAgentData) {
        this.userAgentData = { ...DEFAULT_USER_AGENT_DATA, ...userAgentData };
      }

      // Buat dan tambahkan widget ke DOM
      this.createWidget();
      this.setupEventListeners();

      // Render pesan selamat datang
      this.renderMessage(WELCOME_MESSAGE, false, this.widgetInitTime);

      console.log("Altius Chat Widget initialized successfully");
    } catch (error) {
      console.error("Error initializing chat widget:", error);
    }
  }

  /**
   * Membuat struktur HTML widget
   */
  createWidget() {
    // Buat container utama
    this.elements.widget = createElement(CSS_CLASSES.WIDGET);

    // Buat bubble button
    this.elements.bubble = this.createBubbleButton();

    // Buat popup chat
    this.elements.popup = this.createChatPopup();

    // Gabungkan elemen
    this.elements.widget.appendChild(this.elements.bubble);
    this.elements.widget.appendChild(this.elements.popup);

    // Tambahkan ke body
    document.body.appendChild(this.elements.widget);
  }

  /**
   * Membuat tombol bubble chat
   */
  createBubbleButton() {
    const bubble = createElement(
      CSS_CLASSES.BUBBLE,
      `
      <svg class="${CSS_CLASSES.CHAT_ICON}" viewBox="0 0 24 24" width="24" height="24">
        <path fill="white" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/>
      </svg>
      <svg class="${CSS_CLASSES.CLOSE_ICON}" viewBox="0 0 24 24" width="24" height="24">
        <path fill="white" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `
    );

    bubble.id = ELEMENT_IDS.TOGGLE;
    return bubble;
  }

  /**
   * Membuat popup chat
   */
  createChatPopup() {
    const popup = createElement(CSS_CLASSES.POPUP);
    popup.id = ELEMENT_IDS.POPUP;

    // Header
    const header = this.createHeader();

    // Content area
    this.elements.content = createElement(CSS_CLASSES.CONTENT);
    this.elements.content.id = ELEMENT_IDS.CONTENT;

    // Input area
    const inputArea = this.createInputArea();

    // Close button
    this.elements.close = this.createCloseButton();

    // Gabungkan elemen
    popup.appendChild(header);
    popup.appendChild(this.elements.content);
    popup.appendChild(inputArea);
    popup.appendChild(this.elements.close);

    return popup;
  }

  /**
   * Membuat header chat
   */
  createHeader() {
    const header = createElement(CSS_CLASSES.HEADER);

    const logo = createElement(
      CSS_CLASSES.LOGO,
      `
      <img src="${this.userAgentData.bot_logo_url}" alt="${this.userAgentData.bot_name} Logo" class="${CSS_CLASSES.LOGO_IMG}" />
    `
    );

    const titleContainer = createElement(
      "",
      `
      <div style="display:flex;flex-direction:column;align-items:flex-start;">
        <div class="${CSS_CLASSES.TITLE}">${this.userAgentData.useragent_name}</div>
        <div class="${CSS_CLASSES.STATUS}">
          <span class="${CSS_CLASSES.STATUS_DOT}"></span>Online
        </div>
      </div>
    `
    );

    header.appendChild(logo);
    header.appendChild(titleContainer);

    return header;
  }

  /**
   * Membuat area input
   */
  createInputArea() {
    const inputArea = createElement(CSS_CLASSES.INPUT_AREA);

    this.elements.input = document.createElement("input");
    this.elements.input.type = "text";
    this.elements.input.className = CSS_CLASSES.INPUT;
    this.elements.input.id = ELEMENT_IDS.INPUT;
    this.elements.input.placeholder = "Ketik pesan Anda...";
    this.elements.input.maxLength = 500;

    this.elements.send = createElement(
      CSS_CLASSES.SEND,
      `
      <svg class="${CSS_CLASSES.SEND_ICON}" viewBox="0 0 24 24" width="6" height="6">
        <path fill="currentColor" d="M2 21l21-9-21-9v7l15 2-15 2z"/>
      </svg>
    `
    );
    this.elements.send.id = ELEMENT_IDS.SEND;

    inputArea.appendChild(this.elements.input);
    inputArea.appendChild(this.elements.send);

    return inputArea;
  }

  /**
   * Membuat tombol close
   */
  createCloseButton() {
    const close = createElement(
      CSS_CLASSES.CLOSE,
      `
      <svg class="${CSS_CLASSES.CLOSE_ICON}" viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `
    );
    close.id = ELEMENT_IDS.CLOSE;
    return close;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Toggle chat
    addEventListenerSafe(this.elements.bubble, "click", () =>
      this.toggleChat()
    );
    addEventListenerSafe(this.elements.close, "click", () => this.toggleChat());

    // Send message
    addEventListenerSafe(this.elements.send, "click", () => this.sendMessage());

    // Input events
    addEventListenerSafe(this.elements.input, "keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    addEventListenerSafe(this.elements.input, "input", () => {
      this.elements.send.disabled = !this.elements.input.value.trim();
    });

    // Close on outside click
    addEventListenerSafe(document, "click", (e) => {
      if (this.isOpen && !this.elements.widget.contains(e.target)) {
        this.toggleChat();
      }
    });

    // Prevent close on inside click
    addEventListenerSafe(this.elements.popup, "click", (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Toggle buka/tutup chat
   */
  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.elements.popup.classList.add("show");
      this.elements.bubble.classList.add("open");
      this.elements.input.focus();
    } else {
      this.elements.popup.classList.remove("show");
      this.elements.bubble.classList.remove("open");
    }
  }

  /**
   * Render pesan chat
   */
  renderMessage(content, isUser = false, customTime = null) {
    const messageElement = createElement(
      `${CSS_CLASSES.MESSAGE} ${isUser ? "user" : "bot"}`
    );

    // Reset animation
    resetAnimation(messageElement);

    // Header dengan nama agent dan waktu
    const header = createElement("ai-altius-altius-chat-message-header");

    const agentName = document.createElement("span");
    agentName.textContent = isUser ? "Anda" : this.userAgentData.bot_name;

    const timestamp = document.createElement("span");
    const now = customTime ? customTime : new Date();
    timestamp.textContent = formatTime(now);

    header.appendChild(agentName);
    header.appendChild(timestamp);

    // Content pesan
    const messageContent = createElement(
      "ai-altius-altius-chat-message-content"
    );
    messageContent.textContent = content;

    messageElement.appendChild(header);
    messageElement.appendChild(messageContent);

    this.elements.content.appendChild(messageElement);

    // Scroll ke bawah
    scrollToBottom(this.elements.content);
  }

  /**
   * Tampilkan indikator typing
   */
  showTypingIndicator() {
    const typingElement = createElement(
      CSS_CLASSES.TYPING,
      `
      <div class="${CSS_CLASSES.TYPING_DOT}"></div>
      <div class="${CSS_CLASSES.TYPING_DOT}"></div>
      <div class="${CSS_CLASSES.TYPING_DOT}"></div>
    `
    );
    typingElement.id = ELEMENT_IDS.TYPING;

    this.elements.content.appendChild(typingElement);
    scrollToBottom(this.elements.content);
  }

  /**
   * Sembunyikan indikator typing
   */
  hideTypingIndicator() {
    const typingElement = document.getElementById(ELEMENT_IDS.TYPING);
    if (typingElement) {
      typingElement.remove();
    }
  }

  /**
   * Kirim pesan
   */
  async sendMessage() {
    const message = this.elements.input.value.trim();
    if (!message) return;

    // Tambahkan efek ripple
    addRippleEffect(this.elements.send);

    // Render pesan user
    this.renderMessage(message, true);

    // Clear input dan disable send button
    this.elements.input.value = "";
    this.elements.send.disabled = true;

    // Tampilkan typing indicator
    this.showTypingIndicator();

    try {
      // Tambahkan ke chat history
      this.chatHistory.push({
        role: "user",
        content: message,
      });

      // Kirim ke API
      const botReply = await this.apiService.sendMessage(
        message,
        this.chatHistory
      );

      // Tambahkan balasan bot ke history
      this.chatHistory.push({
        role: "assistant",
        content: botReply,
      });

      // Render balasan bot
      this.renderMessage(botReply, false);
    } catch (error) {
      this.renderMessage(error.message, false);
    } finally {
      this.hideTypingIndicator();
      this.elements.send.disabled = false;
    }
  }

  /**
   * Update header elements dengan data user agent
   */
  updateHeaderElements() {
    const titleElement = this.elements.widget.querySelector(
      `.${CSS_CLASSES.TITLE}`
    );
    const logoElement = this.elements.widget.querySelector(
      `.${CSS_CLASSES.LOGO_IMG}`
    );

    if (titleElement) {
      titleElement.textContent = this.userAgentData.useragent_name;
    }

    if (logoElement) {
      logoElement.src = this.userAgentData.bot_logo_url;
      logoElement.alt = `${this.userAgentData.bot_name} Logo`;
    }
  }

  /**
   * Destroy widget
   */
  destroy() {
    if (this.elements.widget && this.elements.widget.parentNode) {
      this.elements.widget.parentNode.removeChild(this.elements.widget);
    }
  }
}

export default ChatWidget;

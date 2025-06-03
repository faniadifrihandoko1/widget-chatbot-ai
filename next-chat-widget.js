// Configuration
const defaultConfig = {
  position: "bottom-right",
  primaryColor: "#dc2626",
  textColor: "#ffffff",
  backgroundColor: "#f9fafb",
  borderRadius: "50px",
  apiEndpoint:
    "https://agiqubisaai-api-dev-fhf0cwfdbnhqcfda.southeastasia-01.azurewebsites.net/chat",
  welcomeMessage:
    "Halo! Selamat datang di Altius People. Ada yang bisa saya bantu?",
};

// Chat Authentication
class ChatAuth {
  constructor(config) {
    this.config = config;
    this.chatHistory = [
      {
        role: "assistant",
        content: config.welcomeMessage,
      },
    ];
  }

  async sendMessage(message) {
    const token = window.cakra_chat_api_key;
    if (!token) {
      throw new Error("No authentication token available");
    }

    this.chatHistory.push({
      role: "user",
      content: message,
    });

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "qubisa-token-key": token,
        },
        body: JSON.stringify({
          prompt: message,
          user_profile: window.cakra_personal_data,
          chat_history: this.chatHistory.filter((msg) => msg.role !== "system"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.response || "Maaf, terjadi kesalahan.";

      this.chatHistory.push({
        role: "assistant",
        content: botReply,
      });

      return botReply;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("❌ Gagal mengirim pesan. Coba lagi.");
    }
  }

  getChatHistory() {
    return [...this.chatHistory];
  }

  clearChatHistory() {
    this.chatHistory = [
      {
        role: "assistant",
        content: this.config.welcomeMessage,
      },
    ];
  }
}

// Chat UI
class ChatUI {
  constructor(config, auth) {
    this.config = config;
    this.auth = auth;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.setupEventListeners();
  }

  createWidget() {
    // Add styles
    const style = document.createElement("style");
    style.textContent = `
            .altius-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .altius-chat-bubble {
                width: 60px;
                height: 60px;
                background: ${this.config.primaryColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                border: none;
                outline: none;
            }
            .altius-chat-bubble:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            .altius-chat-bubble .altius-chat-icon {
                width: 24px;
                height: 24px;
                fill: white;
            }
            .altius-chat-popup {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            .altius-chat-popup.show {
                display: flex;
                transform: translateY(0);
                opacity: 1;
            }
            .altius-chat-header {
                background: ${this.config.primaryColor};
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .altius-chat-logo {
                width: 32px;
                height: 32px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: ${this.config.primaryColor};
                font-size: 14px;
            }
            .altius-chat-title {
                font-size: 16px;
                font-weight: 600;
            }
            .altius-chat-content {
                flex: 1;
                background: #f8fafc;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .altius-chat-message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
            }
            .altius-chat-message.bot {
                background: white;
                color: #374151;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            .altius-chat-message.user {
                background: ${this.config.primaryColor};
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .altius-chat-input-area {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 12px;
                align-items: center;
            }
            .altius-chat-input {
                flex: 1;
                border: 1px solid #d1d5db;
                border-radius: 24px;
                padding: 12px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease;
            }
            .altius-chat-input:focus {
                border-color: ${this.config.primaryColor};
            }
            .altius-chat-send {
                width: 40px;
                height: 40px;
                background: ${this.config.primaryColor};
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                outline: none;
            }
            .altius-chat-send:hover {
                background: #b91c1c;
                transform: scale(1.05);
            }
            .altius-chat-send:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
            }
            .altius-chat-send-icon {
                width: 18px;
                height: 18px;
                fill: white;
            }
            .altius-chat-close {
                position: absolute;
                bottom: -50px;
                right: 10px;
                width: 36px;
                height: 36px;
                background: #6b7280;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.2s ease;
                outline: none;
            }
            .altius-chat-close:hover {
                background: #4b5563;
                transform: scale(1.1);
            }
            .altius-close-icon {
                width: 16px;
                height: 16px;
                fill: white;
            }
            .altius-typing-indicator {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 12px 16px;
                background: white;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                align-self: flex-start;
                max-width: 80px;
            }
            .altius-typing-dot {
                width: 6px;
                height: 6px;
                background: #9ca3af;
                border-radius: 50%;
                animation: altius-typing 1.4s infinite ease-in-out;
            }
            .altius-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            .altius-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes altius-typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.5;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
            @media (max-width: 480px) {
                .altius-chat-popup {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    bottom: 80px;
                    right: 20px;
                    left: 20px;
                }
            }
        `;
    document.head.appendChild(style);

    // Create widget element
    const widget = document.createElement("div");
    widget.className = "altius-chat-widget";
    widget.innerHTML = `
            <button class="altius-chat-bubble" id="altius-chat-toggle">
                <svg class="altius-chat-icon" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="white" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                </svg>
            </button>
            <div class="altius-chat-popup" id="altius-chat-popup">
                <div class="altius-chat-header">
                    <div class="altius-chat-logo">AP</div>
                    <div class="altius-chat-title">Altius People</div>
                </div>
                <div class="altius-chat-content" id="altius-chat-content">
                    <div class="altius-chat-message bot">
                        ${this.config.welcomeMessage}
                    </div>
                </div>
                <div class="altius-chat-input-area">
                    <input 
                        type="text" 
                        class="altius-chat-input" 
                        id="altius-chat-input"
                        placeholder="Ketik pesan Anda..."
                        maxlength="500"
                    >
                    <button class="altius-chat-send" id="altius-chat-send">
                        <svg class="altius-chat-send-icon" viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                <button class="altius-chat-close" id="altius-chat-close">
                    <svg class="altius-close-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
    document.body.appendChild(widget);

    // Store references to DOM elements
    this.elements = {
      widget,
      toggle: document.getElementById("altius-chat-toggle"),
      popup: document.getElementById("altius-chat-popup"),
      close: document.getElementById("altius-chat-close"),
      input: document.getElementById("altius-chat-input"),
      send: document.getElementById("altius-chat-send"),
      content: document.getElementById("altius-chat-content"),
    };
  }

  setupEventListeners() {
    const { toggle, popup, close, input, send, widget } = this.elements;

    toggle.addEventListener("click", () => this.toggleChat());
    close.addEventListener("click", () => this.toggleChat());
    send.addEventListener("click", () => this.handleSendMessage());

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    input.addEventListener("input", () => {
      send.disabled = !input.value.trim();
    });

    document.addEventListener("click", (e) => {
      if (this.isOpen && !widget.contains(e.target)) {
        this.toggleChat();
      }
    });

    popup.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.elements.popup.classList.toggle("show", this.isOpen);
    if (this.isOpen) {
      this.elements.input.focus();
    }
  }

  addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `altius-chat-message ${isUser ? "user" : "bot"}`;
    messageDiv.textContent = content;
    this.elements.content.appendChild(messageDiv);
    this.elements.content.scrollTop = this.elements.content.scrollHeight;
  }

  showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "altius-typing-indicator";
    indicator.id = "altius-typing";
    indicator.innerHTML = `
            <div class="altius-typing-dot"></div>
            <div class="altius-typing-dot"></div>
            <div class="altius-typing-dot"></div>
        `;
    this.elements.content.appendChild(indicator);
    this.elements.content.scrollTop = this.elements.content.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById("altius-typing");
    if (indicator) {
      indicator.remove();
    }
  }

  async handleSendMessage() {
    const message = this.elements.input.value.trim();
    if (!message) return;

    this.addMessage(message, true);
    this.elements.input.value = "";
    this.elements.send.disabled = true;
    this.showTypingIndicator();

    try {
      const reply = await this.auth.sendMessage(message);
      this.addMessage(reply);
    } catch (error) {
      this.addMessage(error.message);
    } finally {
      this.hideTypingIndicator();
      this.elements.send.disabled = false;
    }
  }
}

// Main widget class
class AltiusChatWidget {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.auth = new ChatAuth(this.config);
    this.ui = null;
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.ui = new ChatUI(this.config, this.auth);
      });
    } else {
      this.ui = new ChatUI(this.config, this.auth);
    }
  }

  open() {
    if (this.ui) {
      this.ui.toggleChat();
    }
  }

  close() {
    if (this.ui && this.ui.isOpen) {
      this.ui.toggleChat();
    }
  }

  clearHistory() {
    if (this.auth) {
      this.auth.clearChatHistory();
      if (this.ui) {
        this.ui.elements.content.innerHTML = `
                    <div class="altius-chat-message bot">
                        ${this.config.welcomeMessage}
                    </div>
                `;
      }
    }
  }
}

// Initialize global instance
if (!window.AltiusChatWidget) {
  window.AltiusChatWidget = {
    version: "1.0.0",
    init: (config) => {
      const widget = new AltiusChatWidget(config);
      widget.init();
      return widget;
    },
  };
}

// Auto-initialize if script is loaded directly
if (
  document.currentScript &&
  document.currentScript.hasAttribute("data-auto-init")
) {
  window.AltiusChatWidget.init();
}

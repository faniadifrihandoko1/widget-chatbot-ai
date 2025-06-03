export class ChatUI {
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

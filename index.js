import { ChatAuth } from "./auth.js";
import { setConfig } from "./config.js";
import { ChatUI } from "./ui.js";

// Load styles
const loadStyles = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "styles.css";
  document.head.appendChild(link);
};

class AltiusChatWidget {
  constructor(config = {}) {
    this.config = setConfig(config);
    this.auth = new ChatAuth(this.config);
    this.ui = null;
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        loadStyles();
        this.ui = new ChatUI(this.config, this.auth);
      });
    } else {
      loadStyles();
      this.ui = new ChatUI(this.config, this.auth);
    }
  }

  // Public methods for external control
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

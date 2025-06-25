(() => {
  // Widget state
  let isOpen = false;
  let isLoading = false;
  const messages = [];

  // API endpoints
  const CREATE_SESSION_URL =
    'https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/create_session';
  const CHAT_URL =
    'https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/chat';

  // Load CSS
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'styles/chat-widget.css';
    document.head.appendChild(link);
  }

  // Create session if needed
  async function ensureSession() {
    if (!window.session_id || window.session_id === '') {
      try {
        const response = await fetch(CREATE_SESSION_URL, {
          method: 'GET',
          headers: {
            'qubisa-token-key': window.chat_api_key,
          },
        });

        if (response.ok) {
          const data = await response.json();
          window.session_id = data.session_id;
        } else {
          throw new Error('Failed to create session');
        }
      } catch (error) {
        console.error('Error creating session:', error);
        throw error;
      }
    }
  }

  // Send message to API
  async function sendMessage(message) {
    await ensureSession();

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'qubisa-token-key': window.chat_api_key,
        },
        body: JSON.stringify({
          session_id: window.session_id,
          prompt: message,
          user_profile: window.personal_data,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Maaf, terjadi kesalahan. Silakan coba lagi.';
    }
  }

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
    <div id="chat-widget">
      <div id="chat-window">
        <div class="header">
          <div class="avatar">V</div>
          <div class="title">
            <div class="title-text">Digital Assistant</div>
          </div>
        </div>
        <div id="chat-messages"></div>
        <div class="input-area">
          <div class="input-container">
            <input id="chat-input" type="text" placeholder="Type here..." />
            <button id="chat-send" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div id="chat-button">
        <span id="icon-chat" style="display: block;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#F44336"/>
            <path d="M34 16a2 2 0 0 0-2-2H16a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10l4 4v-4h2a2 2 0 0 0 2-2V16z" fill="white"/>
            <rect x="18" y="20" width="12" height="2" rx="1" fill="#F44336"/>
            <rect x="18" y="24" width="8" height="2" rx="1" fill="#F44336"/>
          </svg>
        </span>
        <span id="icon-close" style="display: none;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#F44336"/>
            <path d="M16 16L32 32M32 16L16 32" stroke="white" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </span>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    // Tambahkan initial chat setelah widget dimasukkan ke DOM
    addMessage(
      'Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu ?',
      false,
      true
    );
  }

  // Add message to chat
  function addMessage(message, isUser = false, initial = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const senderName = isUser ? 'You' : 'Assistant';
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const bubbleHeader = `<div class=\"bubble-header\"><span class=\"sender-label\">${senderName}</span><span class=\"bubble-time\">${time}</span></div>`;
    const bubbleContent = `<div class=\"bubble-content\">${message}</div>`;
    const messageHTML = `
    <div class=\"message${isUser ? ' user' : ''}\">
      <div class=\"bubble\">
        ${bubbleHeader}
        ${bubbleContent}
      </div>
    </div>
  `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Add loading indicator
  function addLoadingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const loadingHTML = `
    <div id="loading-indicator">
      <div class="content">
        <div class="bubble">
          <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    </div>
  `;

    messagesContainer.insertAdjacentHTML('beforeend', loadingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove loading indicator
  function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // Handle send message
  async function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send');
    const message = input.value.trim();

    if (!message || isLoading) return;

    // Add user message
    addMessage(message, true);
    input.value = '';

    // Show loading
    isLoading = true;
    sendButton.disabled = true;
    addLoadingIndicator();

    try {
      // Send to API
      const response = await sendMessage(message);

      // Remove loading and add bot response
      removeLoadingIndicator();
      addMessage(response);
    } catch (error) {
      removeLoadingIndicator();
      addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.');
    } finally {
      isLoading = false;
      sendButton.disabled = false;
    }
  }

  // Toggle chat window
  function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const iconChat = document.getElementById('icon-chat');
    const iconClose = document.getElementById('icon-close');
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    iconChat.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('chat-input').focus();
      }, 100);
    }
  }

  // Initialize widget
  function init() {
    // Check required variables
    if (!window.chat_api_key) {
      console.error('Altius Chat Widget: chat_api_key is required');
      return;
    }

    if (!window.personal_data) {
      console.error('Altius Chat Widget: personal_data is required');
      return;
    }

    // Load CSS
    loadCSS();

    // Create widget
    createWidget();

    // Add event listeners
    document
      .getElementById('chat-button')
      .addEventListener('click', toggleChat);
    document
      .getElementById('chat-send')
      .addEventListener('click', handleSendMessage);

    // Handle input events
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send');

    input.addEventListener('input', function () {
      sendButton.disabled = !this.value.trim() || isLoading;
    });

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    console.log('Altius Chat Widget initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

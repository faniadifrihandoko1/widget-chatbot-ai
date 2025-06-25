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

  // Global variables to store user agent data
  let userAgentData = {
    useragent_name: 'Altius People',
    bot_name: 'Altius Assistant',
    bot_logo_url:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU3OUJGRDU3NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU3OUJGRDU4NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTc5QkZENTU0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTc5QkZENTY0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4eA3aDAAAC80lEQVR42syYX4gNURzH5969yvpzlV3h5i7lxSJ3pVYiYhUR8i+51nq5m+wKJTx4ULIvlAehZCT/pkQibZKQF0rywAMpyp9CHrRErjbX5+Tc9prMzJmZM2ZOfc+ZO3fumc/5/c75nd+5RqVSMUIVy2xHYw3NRXAJpTX0tQmtNyIq6ZDWy1EvQBuTCWgYRdlHC7BTkgjY7nCtraTEREylUkHcO5X6ac2dd2i8USz90rVIwlrQPu/GobnJcLFlpuX8c3N5rHNwnrSYvawFfnASAJ3CShYtjxfQMuupV7s8sSFuCy6TlnIqSxhEQ5yAXrtGBq2LB9AyG6kXaxiEcsn4fH4y6lWJswxmBEG7T1vETlqppluZOF6eXbp3CE2TVL6mFRqOjqOz4fZi55eLQedqXtxkAxDXIx1+fgHt/NLb87Hq2UwAgFG2l+VtELkA0eEF2gLYHddF4mH66n2dW1kZ9aCDwJUdVzFg+2i2uZg+inJLWu2lUj4I5Bo+H0WjIwb7gHYAdtFXPsgPLtM0o9MRgYlE9hia5AXnmVFjzTaaE2iiJrjHaDNgj7Rk1HR0m2YaOhwS7Kuc261+4JTPJFhSpPD3AsJdQtsBex9mh/OKgx0B+n6FugC7GempDuvVyxWXVezrJzqEDgD3Q1eO4GbBFT7g7kqrPf+fhyYV936Sz7W5wllmAbVqywdx7xiaRa75nmGcQrsB++yR5IqQdQVdCzKn0y4HH6fvnqDZgHUqwIl+bsipsorPw3QB/itl/4Z2oRmAPVA4HuyhPo8GyTtDPU6Dai7GvQWagu32VRFwAXurAFZHfUQsGod5fSasBWvnyRtxEAdspRLcwKArUvYynwHkAwNivTo5//plTGsG7LovnxRLZbSVqznomT3u+j3x2S24EIn8bDpgYoV+DxzAiqX7oh+0XwbxQLvTXzsJFpxA8xowvUe9P/++nkSz5J2ZDOChyk6i/dDkAim81S1T/HMAdicLcAA0L93eCWS/F+BvAQYAY/cSG57y',
  };

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

  async function fetchUserAgentDetails() {
    const token = window.chat_api_key;
    const api_tenant = window.chat_api_tenant;
    if (!token) {
      console.warn('No authentication token available for user agent details');
      return;
    }

    try {
      const response = await fetch(
        `https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/detail_useragent/${token}`,
        {
          method: 'GET',
          headers: {
            'qubisa-api-key': api_tenant,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (
        data.success &&
        data.data &&
        data.data.detail_collection &&
        data.data.detail_collection.length > 0
      ) {
        const agentDetail = data.data.detail_collection[0];
        userAgentData = {
          useragent_name: agentDetail.useragent_name || 'Altius People',
          bot_name: agentDetail.bot_name || 'Altius Assistant',
          bot_logo_url:
            agentDetail.bot_logo_url ||
            'https://ui-avatars.com/api/?name=AI&background=19c6c2&color=fff',
        };
        updateHeaderElements();
        addMessage(
          'Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu ?',
          false,
          true
        );
      } else {
        addMessage(
          'Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu ?',
          false,
          true
        );
      }
    } catch (error) {
      addMessage(
        'Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu ?',
        false,
        true
      );
      console.error('Error fetching user agent details:', error);
    }
  }

  function updateHeaderElements() {
    const logo = document.getElementById('bot-logo');
    const name = document.getElementById('bot-name');
    if (logo) logo.src = userAgentData.bot_logo_url;
    if (name) name.textContent = userAgentData.bot_name;
  }

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
    <div id="chat-widget">
      <div id="chat-window">
        <div class="header">
          <div class="avatar avatar-card">
            <img id="bot-logo" src="${userAgentData.bot_logo_url}" alt="Bot Logo" />
            <span class="status-dot"></span>
          </div>
          <div class="title">
            <div class="title-text" id="bot-name">${userAgentData.bot_name}</div>
            <div class="bot-status">
              <span class="status-text">Online</span>
            </div>
          </div>
          <div class="header-menu" id="header-menu-btn" tabindex="0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="2" fill="#fff"/>
              <circle cx="12" cy="12" r="2" fill="#fff"/>
              <circle cx="12" cy="19" r="2" fill="#fff"/>
            </svg>
          </div>
          <div class="header-dropdown" id="header-dropdown" style="display:none;">
            <div class="dropdown-item" id="new-chat-btn">Chat Baru</div>
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
    setupHeaderMenu();
  }

  // Add message to chat
  function unescapeString(str) {
    // Convert escape sequences to real characters
    if (!str) return '';
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\f/g, '\f')
      .replace(/\\b/g, '\b')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  function addMessage(message, isUser = false, initial = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const senderName = isUser ? 'You' : userAgentData.bot_name;
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const bubbleHeader = `<div class="bubble-header"><span class="sender-label">${senderName}</span><span class="bubble-time">${time}</span></div>`;
    // Unescape escape sequences first
    const unescapedMessage = unescapeString(message);
    // Ganti newline dengan <br>
    const htmlMessage = unescapedMessage.replace(/\n/g, '<br>');
    const bubbleContent = `<div class="bubble-content">${htmlMessage}</div>`;
    const messageHTML = `
    <div class="message${isUser ? ' user' : ''}">
      <div class="bubble">
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

    // Pastikan session sudah dibuat sebelum fetch detail dan penggunaan widget
    ensureSession().then(() => {
      // Setelah session siap, fetch detail user agent dan tampilkan welcome message
      fetchUserAgentDetails();
    });

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
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function setupHeaderMenu() {
    const menuBtn = document.getElementById('header-menu-btn');
    const dropdown = document.getElementById('header-dropdown');
    if (!menuBtn || !dropdown) return;

    // Toggle menu
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Hide menu on click outside
    document.addEventListener('click', e => {
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    });

    // Prevent menu from closing when clicking inside
    dropdown.addEventListener('click', e => {
      e.stopPropagation();
    });

    // Chat Baru
    document.getElementById('new-chat-btn').addEventListener('click', () => {
      startNewChat();
      dropdown.style.display = 'none';
    });
  }

  // Fungsi untuk chat baru
  function startNewChat() {
    // Bersihkan chat, session, dan tampilkan welcome message baru
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) messagesContainer.innerHTML = '';
    window.session_id = '';
    ensureSession().then(() => {
      fetchUserAgentDetails();
    });
  }

  function formatMessageToHTML(message) {
    // Ganti blok kode markdown ```...``` dengan <pre>...</pre>
    message = message.replace(
      /```[a-zA-Z]*\\n([\\s\\S]*?)```/g,
      (match, code) => {
        return `<pre>${code.replace(/\\n/g, '<br>')}</pre>`;
      }
    );

    // Ganti # Heading markdown dengan <b> atau <h2>
    message = message.replace(/^### (.*)$/gm, '<b>$1</b>');
    message = message.replace(/^## (.*)$/gm, '<b>$1</b>');
    message = message.replace(/^# (.*)$/gm, '<b>$1</b>');

    // Ganti list markdown - item menjadi <ul><li>item</li></ul>
    // (Sederhana, tidak nested)
    if (message.match(/^- /m)) {
      message = message.replace(/(?:^|\n)- (.*?)(?=\n|$)/g, '<li>$1</li>');
      message = message.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    }
    // Ganti list markdown 1. item menjadi <ol><li>item</li></ol>
    if (message.match(/^[0-9]+\\. /m)) {
      message = message.replace(
        /(?:^|\n)[0-9]+\\. (.*?)(?=\n|$)/g,
        '<li>$1</li>'
      );
      message = message.replace(/(<li>[\s\S]*?<\/li>)/g, '<ol>$1</ol>');
    }

    // Ganti \n yang tersisa dengan <br>
    message = message.replace(/\\n/g, '<br>');

    return message;
  }
})();

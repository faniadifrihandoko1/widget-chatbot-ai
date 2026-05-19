(() => {
  // Widget state
  let isOpen = false;
  let isLoading = false;
  let isTemplateQuestionsVisible = true;
  let hasInteracted = false; // Track if user has sent a message
  let splashScreenShown = false; // Track if splash screen has been shown

  // Shadow DOM host/root
  let shadowHost = null;
  let root = null; // shadowRoot reference used for all DOM queries

  function createShadowHost() {
    if (shadowHost && root) return;
    shadowHost = document.createElement('div');
    shadowHost.id = 'altius-chat-widget-host';
    document.body.appendChild(shadowHost);
    root = shadowHost.attachShadow({ mode: 'open' });
  }

  // Shorthand DOM helpers scoped to shadow root
  function $(selector) {
    return root ? root.querySelector(selector) : null;
  }

  // Show splash screen
  function showSplashScreen(chatIconHTML) {
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer || splashScreenShown) return;

    // Determine greeting text based on username
    const greetingText = window.username ? `Hello, ${window.username}` : 'Hello';

    const splashHTML = `
      <div class="splash-screen">
        <div class="splash-content">
          <div class="splash-icon">
            ${chatIconHTML}
          </div>
          <div class="splash-text">
            <p class="splash-subtitle">${greetingText}</p>
          </div>
        </div>
      </div>
    `;

    messagesContainer.innerHTML = splashHTML;
    splashScreenShown = true;
  }

  // Hide splash screen
  function hideSplashScreen() {
    const splashScreen = $('.splash-screen');
    if (splashScreen) {
      splashScreen.style.opacity = '0';
      setTimeout(() => {
        if (splashScreen && splashScreen.parentNode) {
          splashScreen.parentNode.removeChild(splashScreen);
        }
      }, 300);
    }
  }

  // API base and endpoints
  const DEFAULT_API_BASE_URL =
    'https://agiai-api-dabae8aacehvgcf5.indonesiacentral-01.azurewebsites.net';
  // "https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net"

  // Trim any trailing slashes
  const API_BASE_URL = DEFAULT_API_BASE_URL.replace(/\/+$/, '');
  const CREATE_SESSION_URL = `${API_BASE_URL}/create_session`;
  const CHAT_URL = `${API_BASE_URL}/chat`;
  const DETAIL_USERAGENT_URL = `${API_BASE_URL}/detail_useragent_chat`;

  // Global variables to store user agent data
  let userAgentData = {
    useragent_name: 'Altius People',
    bot_name: 'Altius Assistant',
    bot_logo_url:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU3OUJGRDU3NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU3OUJGRDU4NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTc5QkZENTU0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTc5QkZENTY0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4eA3aDAAAC80lEQVR42syYX4gNURzH5969yvpzlV3h5i7lxSJ3pVYiYhUR8i+51nq5m+wKJTx4ULIvlAehZCT/pkQibZKQF0rywAMpyp9CHrRErjbX5+Tc9prMzJmZM2ZOfc+ZO3fumc/5/c75nd+5RqVSMUIVy2xHYw3NRXAJpTX0tQmtNyIq6ZDWy1EvQBuTCWgYRdlHC7BTkgjY7nCtraTEREylUkHcO5X6ac2dd2i8USz90rVIwlrQPu/GobnJcLFlpuX8c3N5rHNwnrSYvawFfnASAJ3CShYtjxfQMuupV7s8sSFuCy6TlnIqSxhEQ5yAXrtGBq2LB9AyG6kXaxiEcsn4fH4y6lWJswxmBEG7T1vETlqppluZOF6eXbp3CE2TVL6mFRqOjqOz4fZi55eLQedqXtxkAxDXIx1+fgHt/NLb87Hq2UwAgFG2l+VtELkA0eEF2gLYHddF4mH66n2dW1kZ9aCDwJUdVzFg+2i2uZg+inJLWu2lUj4I5Bo+H0WjIwb7gHYAdtFXPsgPLtM0o9MRgYlE9hia5AXnmVFjzTaaE2iiJrjHaDNgj7Rk1HR0m2YaOhwS7Kuc261+4JTPJFhSpPD3AsJdQtsBex9mh/OKgx0B+n6FugC7GempDuvVyxWXVezrJzqEDgD3Q1eO4GbBFT7g7kqrPf+fhyYV936Sz7W5wllmAbVqywdx7xiaRa75nmGcQrsB++yR5IqQdQVdCzKn0y4HH6fvnqDZgHUqwIl+bsipsorPw3QB/itl/4Z2oRmAPVA4HuyhPo8GyTtDPU6Dai7GvQWagu32VRFwAXurAFZHfUQsGod5fSasBWvnyRtxEAdspRLcwKArUvYynwHkAwNivTo5//plTGsG7LovnxRLZbSVqznomT3u+j3x2S24EIn8bDpgYoV+DxzAiqX7oh+0XwbxQLvTXzsJFpxA8xowvUe9P/++nkSz5J2ZDOChyk6i/dDkAim81S1T/HMAdicLcAA0L93eCWS/F+BvAQYAY/cSG57y',
    template_questions: [],
  };
  window.userAgentData = userAgentData;

  // Tambahkan global state untuk user agent detail
  window.userAgentDetailFetched = false;

  // Load CSS into shadow root
  function loadCSS() {
    // Use @import to ensure stylesheet loads within shadow root across browsers
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `@import url("styles/chat-widget-mobile.css");`;
    if (root) {
      root.appendChild(styleSheet);
    } else {
      document.head.appendChild(styleSheet);
    }

    // Add inline CSS for br reset (inside shadow root)
    addBrResetCSS();

    // Add polished loading styles for start session UX
    addLoadingStyles();

    // Add upload card styles
    addUploadStyles();
  }

  // Add inline CSS for br reset (scoped to shadow root)
  function addBrResetCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .chat-widget br {
        all: unset !important;
        display: block !important;
        margin: 2px 0 !important;
        padding: 0 !important;
        height: 0 !important;
        line-height: 1.2 !important;
        content: "" !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        color: inherit !important;
        background: none !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      .chat-widget .bubble-content br,
      .chat-widget .markdown-paragraph br,
      .chat-widget .code-block br,
      .chat-widget .message br,
      .chat-widget .bubble br,
      .chat-widget .template-question-item br {
        margin: 2px 0 !important;
        padding: 0 !important;
        height: 0 !important;
        line-height: 1.2 !important;
      }
    `;
    if (root) {
      root.appendChild(style);
    } else {
      document.head.appendChild(style);
    }
  }

  function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .session-create-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 1000;
        backdrop-filter: blur(5px);
      }
      .session-create-loading-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .session-create-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #19c6c2;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
      .session-create-loading-text {
        font-size: 16px;
        color: #333;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    if (root) {
      root.appendChild(style);
    } else {
      document.head.appendChild(style);
    }
  }

  function addUploadStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .file-upload-bubble { background: #fafafa; }
      .bubble .bubble-content .upload-card { width: 100%; max-width: 100%; }
      .upload-card, .upload-card * { box-sizing: border-box; }
      .upload-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px;
        width: 100%;
        max-width: 100%;
        margin: 0;
        overflow: hidden;
      }
      .upload-dropzone {
        border: 1px dashed #dbe1e6;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        background: #fff;
        transition: border-color 120ms ease, background 120ms ease;
        min-width: 0;
      }
      .upload-dropzone.dragover { border-color: #19c6c2; background: #f0fdfd; }
      .upload-icon { width: 22px; height: 22px; display: inline-block; color: #19c6c2; margin-bottom: 6px; }
      .upload-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 6px 0 4px; }
      .upload-subtitle { color: #55627a; font-size: 12px; line-height: 1.35; margin-bottom: 8px; word-break: break-word; }
      .upload-button {
        display: inline-flex; align-items: center; gap: 6px;
        background: #19c6c2; color: #fff; border: none; border-radius: 7px;
        padding: 7px 10px; font-weight: 700; font-size: 12px; cursor: pointer;
        transition: transform 80ms ease, box-shadow 120ms ease;
      }
      .upload-button:hover { box-shadow: 0 4px 12px rgba(25,198,194,0.22); transform: translateY(-1px); }
      .upload-note { color: #9aa4b2; font-size: 11px; margin-top: 8px; word-break: break-word; }
      .upload-status { color: #334155; font-size: 12px; margin-top: 8px; font-weight: 600; }
      .upload-error { color: #b91c1c; font-size: 12px; margin-top: 6px; }

      /* List styles */
      .upload-list-section { margin-top: 10px; }
      .upload-list-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
      .upload-list { display: grid; gap: 6px; width: 100%; }
      .upload-item { display: flex; flex-direction: column; gap: 6px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; width: 100%; box-sizing: border-box; overflow: hidden; }
      .upload-item-row { display: flex; align-items: center; gap: 8px; min-height: 26px; }
      .upload-item-name { flex: 1; min-width: 0; font-size: 13px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .upload-item-right { margin-left: auto; display: flex; align-items: center; gap: 6px; flex: 0 1 auto; min-width: 0; }
      .upload-chip-success { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; border-radius: 9999px; padding: 3px 6px; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: none; }
      .upload-chip-error { background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; border-radius: 9999px; padding: 3px 6px; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: none; }
      .upload-progress-wrap { display: none; width: 100%; height: 3px; background: #eef2f7; border-radius: 2px; overflow: hidden; }
      .upload-progress-bar { width: 0%; height: 100%; background: #19c6c2; transition: width 120ms ease; }
      .upload-remove { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 6px; background: #fee2e2; color: #b91c1c; cursor: pointer; flex: 0 0 auto; }
      .upload-remove:hover { background: #fecaca; }
    `;
    if (root) {
      root.appendChild(style);
    } else {
      document.head.appendChild(style);
    }
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
      const minChar = window.min_char;
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
          ...(minChar && { min_char: minChar }),
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

  async function fetchUserAgentDetails(showDefaultMessage = true) {
    const token = window.chat_api_key;
    if (!token) {
      console.warn('No authentication token available for user agent details');
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(DETAIL_USERAGENT_URL, {
        method: 'GET',
        headers: {
          'qubisa-token-key': token,
        },
      });

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

        // Parse template_question from JSON string to array
        let templateQuestions = [];
        if (agentDetail.template_question) {
          try {
            templateQuestions = JSON.parse(agentDetail.template_question);
          } catch (error) {
            console.warn('Failed to parse template_question:', error);
            templateQuestions = [];
          }
        }

        userAgentData = {
          useragent_name: agentDetail.useragent_name || 'Altius People',
          bot_name: agentDetail.bot_name || 'Altius Assistant',
          bot_logo_url:
            agentDetail.bot_logo_url ||
            `https://ui-avatars.com/api/?name=${getInitials(
              agentDetail.bot_name || 'Altius Assistant'
            )}&background=19c6c2&color=fff`,
          template_questions: templateQuestions,
        };
        updateHeaderElements();
        updateTemplateQuestions();
        if (showDefaultMessage) {
          addMessage('Hai, ada yang bisa dibantu hari ini?', false);
        }
      } else {
        if (showDefaultMessage) {
          addMessage('Hai, ada yang bisa dibantu hari ini?', false);
        }
      }
    } catch (error) {
      if (showDefaultMessage) {
        addMessage('Hai, ada yang bisa dibantu hari ini?', false);
      }
      console.error('Error fetching user agent details:', error);
      throw error;
    }
  }

  function updateHeaderElements() {
    const logo = $('.bot-logo');
    const name = $('.bot-name');
    if (logo) logo.src = userAgentData.bot_logo_url;
    if (name) name.textContent = userAgentData.bot_name;
    window.userAgentData = userAgentData;
    // Hide skeleton hanya jika session & detail user sudah siap
    if (isHeaderReady()) {
      hideHeaderSkeleton();
    }
  }

  function updateTemplateQuestions() {
    const templateQuestionsContainer = $('.template-questions');
    const templateQuestionsList = $('.template-questions-list');
    const toggleButton = $('.template-questions-toggle');
    const templateQuestionsContent = $('.template-questions-content');

    if (
      !templateQuestionsContainer ||
      !templateQuestionsList ||
      !toggleButton ||
      !templateQuestionsContent
    )
      return;

    if (
      userAgentData.template_questions &&
      userAgentData.template_questions.length > 0
    ) {
      templateQuestionsList.innerHTML = '';

      userAgentData.template_questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'template-question-item';
        questionElement.textContent = question;
        questionElement.addEventListener('click', () => {
          handleTemplateQuestionClick(question);
        });
        templateQuestionsList.appendChild(questionElement);
      });

      templateQuestionsContainer.style.display = 'block';
      // Show only if not yet interacted, otherwise hide by default
      if (!hasInteracted) {
        isTemplateQuestionsVisible = true;
      } else {
        isTemplateQuestionsVisible = false;
      }
      updateTemplateQuestionsVisibility();
    } else {
      templateQuestionsContainer.style.display = 'none';
    }
  }

  function toggleTemplateQuestions() {
    isTemplateQuestionsVisible = !isTemplateQuestionsVisible;
    updateTemplateQuestionsVisibility();
  }

  function updateTemplateQuestionsVisibility() {
    const templateQuestionsContent = $('.template-questions-content');
    const toggleButton = $('.template-questions-toggle');

    if (!templateQuestionsContent || !toggleButton) return;

    if (isTemplateQuestionsVisible) {
      templateQuestionsContent.style.display = 'block';
      toggleButton.classList.remove('collapsed');
    } else {
      templateQuestionsContent.style.display = 'none';
      toggleButton.classList.add('collapsed');
    }
  }

  function handleTemplateQuestionClick(question) {
    const input = $('.chat-input');
    if (!input) return;
    input.value = question;
    input.focus();

    // Trigger input event to enable send button
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);

    // Hide template questions after click
    isTemplateQuestionsVisible = false;
    updateTemplateQuestionsVisibility();
  }

  // Create widget HTML inside shadow root
  function createWidget() {
    // Determine which icon to use based on priority:
    // 1. window.iconUrl  -> Custom icon URL (highest priority)
    // 2. window.isAltius = true  -> Uses Altius mascot PNG
    // 3. window.isAltius = false -> Uses animated GIF (default)
    const isAltius = window.isAltius !== undefined ? window.isAltius : false;
    const chatIconHTML = window.iconUrl
      ? `<img src="${window.iconUrl}" alt="Chat Icon url" class="mascot-icon" />`
      : isAltius
        ? `<img src="https://altius.id/wp-content/uploads/2025/09/icon-Altius-mskot.png" alt="Altius Mascot" class="mascot-icon" />`
        : `<img src="https://altius.id/wp-content/uploads/2025/09/ezgif.com-animated-gif-maker2.gif" alt="Chat Icon" class="mascot-icon" />`;

    const widgetHTML = `
    <div class="chat-widget">
      <div class="chat-window">
        <div class="header">
          <div class="avatar avatar-card">
            <img class="bot-logo" src="${userAgentData.bot_logo_url}" alt="Logo" onerror="window.handleBotLogoError && window.handleBotLogoError(this)" />
            <span class="status-dot bot-status"></span>
          </div>
          <div class="title">
            <div class="title-text bot-name">${userAgentData.bot_name}</div>
            <div class="bot-status">
              <span class="status-text">Online</span>
            </div>
          </div>
          <div class="header-actions">
            <div class="header-menu header-menu-btn" tabindex="0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="2" fill="#fff"/>
                <circle cx="12" cy="12" r="2" fill="#fff"/>
                <circle cx="12" cy="19" r="2" fill="#fff"/>
              </svg>
            </div>
            <div class="header-close-btn" title="Tutup Chat">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
                <path d="M6 9l6 6 6-6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="header-dropdown" style="display:none;">
            <div class="dropdown-item new-chat-btn">Chat Baru</div>
          </div>
        </div>
        <div class="chat-messages"></div>
        <div class="template-questions" style="display: none;">
          <div class="template-questions-header">
            <div class="template-questions-title" >Pertanyaan Sering Diajukan:</div>
            <div class="template-questions-card-toggle">
            <button class="template-questions-toggle" title="Sembunyikan/Tampilkan pertanyaan">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            </div>
          </div>
          <div class="template-questions-content">
            <div class="template-questions-list"></div>
          </div>
        </div>
        <div class="input-area">
          <div class="input-container">
            <input class="chat-input" type="text" placeholder="Type here..." />
            <button class="chat-send" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="chat-button" title="Buka Chat">
        <span class="icon-chat" style="display: block;">
          ${chatIconHTML}
        </span>
      </div>
    </div>
  `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = widgetHTML.trim();
    const node = wrapper.firstElementChild;
    if (root) {
      root.appendChild(node);
    } else {
      document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }
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
      .replace(/\\(["'])/g, '$1')
      .replace(/\\\\/g, '\\');
  }

  function addMessage(message, isUser = false) {
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer) return;
    const senderName = isUser ? 'You' : userAgentData.bot_name;
    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const bubbleHeader = `<div class="bubble-header"><span class="sender-label">${senderName}</span><span class="bubble-time">${time}</span></div>`;
    // Unescape escape sequences first
    const unescapedMessage = unescapeString(message);

    // Apply markdown formatting for bot messages only
    let formattedMessage = unescapedMessage;
    if (!isUser) {
      formattedMessage = formatMessageToHTML(unescapedMessage);
    } else {
      // For user messages, just replace newlines with <br> with minimal spacing
      formattedMessage = unescapedMessage.replace(
        /\n/g,
        '<br style="margin: 2px 0; padding: 0; height: 0; line-height: 1.2;">'
      );
    }

    const bubbleContent = `<div class="bubble-content">${formattedMessage}</div>`;
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
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer) return;
    const loadingHTML = `
    <div class="loading-indicator">
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
    const loadingIndicator = $('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // Handle send message
  async function handleSendMessage() {
    if (window.altiusComposerLockedUpload) return;
    const input = $('.chat-input');
    const sendButton = $('.chat-send');
    if (!input || !sendButton) return;
    const message = input.value.trim();

    if (!message || isLoading) return;

    // Hide splash screen on first message
    if (!hasInteracted) {
      hideSplashScreen();
    }

    // Add user message
    addMessage(message, true);
    input.value = '';

    // Show loading
    isLoading = true;
    sendButton.disabled = true;
    addLoadingIndicator();

    // After first message, hide template questions and mark as interacted
    if (!hasInteracted) {
      hasInteracted = true;
      isTemplateQuestionsVisible = false;
      updateTemplateQuestionsVisibility();
    }

    try {
      // Send to API
      const response = await sendMessage(message);

      // Remove loading
      removeLoadingIndicator();

      // Detect token for file upload and render accordingly
      const FILE_UPLOAD_TOKEN = '[FILE_UPLOAD]';
      const hasUpload =
        typeof response === 'string' && response.includes(FILE_UPLOAD_TOKEN);
      const cleaned =
        typeof response === 'string'
          ? response.replace(FILE_UPLOAD_TOKEN, '').trim()
          : '';

      if (cleaned) {
        addMessage(cleaned);
      }
      if (hasUpload) {
        addFileUploadMessage();
        // Ensure composer stays disabled while user focuses on upload
        setComposerDisabledUpload(true);
      }
      if (!cleaned && !hasUpload) {
        // Fallback if response is empty
        addMessage('');
      }
    } catch (error) {
      removeLoadingIndicator();
      addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.');
    } finally {
      isLoading = false;
      sendButton.disabled = false;
    }
  }

  // Toggle chat window
  async function toggleChat() {
    const chatWindow = $('.chat-window');
    const iconChat = $('.icon-chat');
    const headerCloseBtn = $('.header-close-btn');
    if (!chatWindow || !iconChat || !headerCloseBtn) return;

    // Determine which icon to use based on window.isAltius flag
    const isAltius = window.isAltius !== undefined ? window.isAltius : false;
    const chatIconHTML = window.iconUrl
      ? `<img src="${window.iconUrl}" alt="Chat Icon url" class="mascot-icon" />`
      : isAltius
        ? `<img src="https://altius.id/wp-content/uploads/2025/09/icon-Altius-mskot.png" alt="Altius Mascot" class="mascot-icon" />`
        : `<img src="https://altius.id/wp-content/uploads/2025/09/ezgif.com-animated-gif-maker2.gif" alt="Chat Icon" class="mascot-icon" />`;
    if (!isOpen) {
      // Chat akan dibuka, cek session
      if (!window.session_id || window.session_id === '') {
        showChatMessagesSessionLoading();
        showHeaderSkeleton();
        try {
          await ensureSession();
        } catch (e) {
          hideChatMessagesSessionLoading();
          hideHeaderSkeleton();
          addMessage('Gagal membuat sesi chat. Silakan coba lagi.', false);
          // Update only the status area to error state
          const statusDot = $('.status-dot');
          const statusText = $('.status-text');
          if (statusDot) {
            statusDot.classList.remove('skeleton-loading');
            statusDot.style.background = '#f44336';
            statusDot.style.border = 'none';
            statusDot.style.width = '12px';
            statusDot.style.height = '12px';
            statusDot.style.marginRight = '6px';
            statusDot.style.display = 'inline-block';
          }
          if (statusText) {
            statusText.classList.remove('skeleton-loading');
            statusText.textContent = 'Gagal terhubung...';
            statusText.style.background = 'none';
            statusText.style.color = '#f44336';
            statusText.style.minWidth = '';
            statusText.style.minHeight = '';
            statusText.style.borderRadius = '';
            statusDot.style.display = 'inline-block';
          }
          return;
        }
        hideChatMessagesSessionLoading();
        window.userAgentDetailFetched = false; // Reset detail fetched for new session
      }
      // Setelah session siap, fetch detail user agent jika belum pernah
      if (!window.userAgentDetailFetched) {
        showChatMessagesSessionLoading('Memulai sesi chat...');
        showHeaderSkeleton();
        try {
          // Check if this is a new chat (no interaction yet)
          const showDefaultMessage = hasInteracted;
          await fetchUserAgentDetails(showDefaultMessage);
          window.userAgentDetailFetched = true;
        } catch (e) {
          addMessage('Gagal mengambil detail chat. Silakan coba lagi.', false);
        }
        hideChatMessagesSessionLoading();
      }
      // Hide skeleton hanya jika session & detail user sudah siap
      if (isHeaderReady()) {
        hideHeaderSkeleton();
      }
      // Reset status area to normal after success
      const statusDot = $('.status-dot');
      const statusText = $('.status-text');
      if (statusDot) {
        statusDot.style.background = '';
        statusDot.style.border = '';
        statusDot.style.width = '';
        statusDot.style.height = '';
        statusDot.style.marginRight = '';
        statusDot.style.display = '';
      }
      if (statusText) {
        statusText.style.color = '';
        statusText.textContent = 'Online';
        statusText.style.display = '';
      }
    }
    isOpen = !isOpen;

    if (isOpen) {
      chatWindow.style.display = 'flex';
      setTimeout(() => {
        chatWindow.classList.add('show');
        // Show splash screen only when chat opens for the first time and splash hasn't been shown
        if (!hasInteracted && !splashScreenShown) {
          showSplashScreen(chatIconHTML);
        }
      }, 10);
      iconChat.style.display = 'none';
      // Disable pointer events on chat button when chat is open
      const chatButton = $('.chat-button');
      if (chatButton) {
        chatButton.style.pointerEvents = 'none';
      }
    } else {
      chatWindow.classList.remove('show');
      setTimeout(() => {
        chatWindow.style.display = 'none';
      }, 300);
      iconChat.style.display = 'block';
      // Re-enable pointer events on chat button when chat is closed
      const chatButton = $('.chat-button');
      if (chatButton) {
        chatButton.style.pointerEvents = 'auto';
      }
    }
    if (isOpen) {
      setTimeout(() => {
        const input = $('.chat-input');
        const sendButton = $('.chat-send');
        if (input) {
          input.focus();
          ensureInputEditable();
          // Initialize send button state
          if (sendButton) {
            sendButton.disabled = !input.value.trim() || isLoading || !!window.altiusComposerLockedUpload;
          }
        }
        observeInputAttributes();
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

    // Create Shadow DOM host first
    createShadowHost();

    // Load CSS into shadow root
    loadCSS();

    // Create widget inside shadow root
    createWidget();

    // Ensure composer unlocked on first render
    try {
      setComposerDisabledUpload(false);
    } catch (_) {
      /* noop */
    }
    // Ensure placeholder reset on first render
    try {
      const inputInit = $('.chat-input');
      if (inputInit) {
        inputInit.placeholder = 'Type here...';
        inputInit.removeAttribute('data-prev-ph');
      }
    } catch (_) {
      /* noop */
    }

    // Tidak perlu ensureSession() di sini lagi
    // Tidak perlu fetchUserAgentDetails() di sini lagi

    // Add event listeners
    const chatButton = $('.chat-button');
    if (chatButton) chatButton.addEventListener('click', toggleChat);

    const headerCloseBtn = $('.header-close-btn');
    if (headerCloseBtn) headerCloseBtn.addEventListener('click', toggleChat);

    const sendBtn = $('.chat-send');
    if (sendBtn && !sendBtn.hasAttribute('data-listener-added')) {
      sendBtn.addEventListener('click', handleSendMessage);
      sendBtn.setAttribute('data-listener-added', 'true');
    }

    // Add template questions toggle event listener
    const templateQuestionsToggle = $('.template-questions-toggle');
    if (templateQuestionsToggle) {
      templateQuestionsToggle.addEventListener(
        'click',
        toggleTemplateQuestions
      );
    }

    // Handle input events
    const input = $('.chat-input');
    const sendButton = $('.chat-send');

    if (input && sendButton) {
      // Initialize send button state on load
      sendButton.disabled = !input.value.trim() || isLoading || !!window.altiusComposerLockedUpload;

      input.addEventListener('input', function () {
        sendButton.disabled =
          !this.value.trim() ||
          isLoading ||
          !!window.altiusComposerLockedUpload;
        if (window.altiusComposerLockedUpload) {
          sendButton.style.pointerEvents = 'none';
          sendButton.style.opacity = '0.6';
        } else {
          sendButton.style.pointerEvents = '';
          sendButton.style.opacity = '';
        }
      });

      input.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!window.altiusComposerLockedUpload) handleSendMessage();
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function setupHeaderMenu() {
    const menuBtn = $('.header-menu-btn');
    const dropdown = $('.header-dropdown');
    if (!menuBtn || !dropdown) return;

    // Toggle menu
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Hide menu on click outside (document)
    document.addEventListener('click', () => {
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    });

    // Prevent menu from closing when clicking inside dropdown
    dropdown.addEventListener('click', e => {
      e.stopPropagation();
    });

    // Chat Baru
    const newChatBtn = $('.new-chat-btn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        startNewChat();
        dropdown.style.display = 'none';
      });
    }
  }

  // Fungsi untuk chat baru
  function startNewChat() {
    // Bersihkan chat, session, dan tampilkan welcome message baru
    const messagesContainer = $('.chat-messages');
    if (messagesContainer) messagesContainer.innerHTML = '';
    window.session_id = '';
    hasInteracted = false; // Reset interaction state
    splashScreenShown = false; // Reset splash screen state
    isTemplateQuestionsVisible = true; // Show template questions again
    window.userAgentDetailFetched = false; // Reset detail fetched for new session
    // Pastikan composer kembali normal saat memulai chat baru
    try {
      setComposerDisabledUpload(false);
    } catch (_) {
      /* noop */
    }
    // Reset placeholder ke default
    try {
      const inputReset = $('.chat-input');
      if (inputReset) {
        inputReset.placeholder = 'Type here...';
        inputReset.removeAttribute('data-prev-ph');
      }
    } catch (_) {
      /* noop */
    }
    // Tidak perlu panggil ensureSession di sini, biarkan toggleChat handle
    // Tutup dan buka lagi chat agar flow session baru berjalan
    const chatWindow = $('.chat-window');
    if (chatWindow) chatWindow.style.display = 'none';
    isOpen = false;
    setTimeout(() => {
      toggleChat();
      // Show splash screen for new chat
      setTimeout(() => {
        const isAltius = window.isAltius !== undefined ? window.isAltius : false;
        const chatIconHTML = window.iconUrl
          ? `<img src="${window.iconUrl}" alt="Chat Icon url" class="mascot-icon" />`
          : isAltius
            ? `<img src="https://altius.id/wp-content/uploads/2025/09/icon-Altius-mskot.png" alt="Altius Mascot" class="mascot-icon" />`
            : `<img src="https://altius.id/wp-content/uploads/2025/09/ezgif.com-animated-gif-maker2.gif" alt="Chat Icon" class="mascot-icon" />`;
        showSplashScreen(chatIconHTML);
      }, 300);
    }, 200);
  }

  function formatMessageToHTML(message) {
    if (!message || !message.trim()) {
      return '<span style="font-style: italic; color: #9ca3af;">[Pesan kosong]</span>';
    }

    // First, unescape the message
    let processedMessage = unescapeString(message);

    // Handle code blocks with language specification
    processedMessage = processedMessage.replace(
      /```([a-zA-Z]*)\n([\s\S]*?)```/g,
      (match, language, code) => {
        return `<pre class="code-block"><code>${code.replace(
          /\n/g,
          '<br>'
        )}</code></pre>`;
      }
    );

    // Handle inline code
    processedMessage = processedMessage.replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>'
    );

    // Handle headings
    processedMessage = processedMessage.replace(
      /^### (.*)$/gm,
      '<h3 class="markdown-heading">$1</h3>'
    );
    processedMessage = processedMessage.replace(
      /^## (.*)$/gm,
      '<h2 class="markdown-heading">$1</h2>'
    );
    processedMessage = processedMessage.replace(
      /^# (.*)$/gm,
      '<h1 class="markdown-heading">$1</h1>'
    );

    // Handle horizontal rules
    processedMessage = processedMessage.replace(
      /^---$/gm,
      '<hr class="markdown-hr">'
    );

    // Handle bold text
    processedMessage = processedMessage.replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    );

    // Handle italic text
    processedMessage = processedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle ordered lists - convert numbered items to list items first
    processedMessage = processedMessage.replace(
      /(?:^|\n)(\d+)\.\s+(.*?)(?=\n|$)/g,
      '\n<li class="markdown-list-item">$2</li>'
    );

    // Handle unordered lists - convert dash items to list items first
    processedMessage = processedMessage.replace(
      /(?:^|\n)-\s+(.*?)(?=\n|$)/g,
      '\n<li class="markdown-list-item">$1</li>'
    );

    // Group consecutive ordered list items
    processedMessage = processedMessage.replace(
      /(\n<li class="markdown-list-item">.*?<\/li>)+/g,
      match => {
        return `\n<ol class="markdown-list">${match.replace(/\n/g, '')}</ol>\n`;
      }
    );

    // Group consecutive unordered list items
    processedMessage = processedMessage.replace(
      /(\n<li class="markdown-list-item">.*?<\/li>)+/g,
      match => {
        return `\n<ul class="markdown-list">${match.replace(/\n/g, '')}</ul>\n`;
      }
    );

    // Handle paragraphs (text that's not in lists, headings, or code blocks)
    processedMessage = processedMessage.replace(
      /^(?!<[hou][1-6l]|<pre|<hr|<ul|<ol)(.+)$/gm,
      '<p class="markdown-paragraph">$1</p>'
    );

    // Clean up empty paragraphs
    processedMessage = processedMessage.replace(
      /<p class="markdown-paragraph"><\/p>/g,
      ''
    );

    // Handle line breaks within paragraphs
    processedMessage = processedMessage.replace(
      /\n/g,
      '<br style="margin: 2px 0; padding: 0; height: 0; line-height: 1.2;">'
    );

    return processedMessage;
  }

  // Fungsi global untuk handle error gambar bot logo
  window.handleBotLogoError = function (img) {
    const botName =
      (window.userAgentData && window.userAgentData.bot_name) || 'AI';
    const initials = getInitials(botName);
    img.onerror = null; // Hindari infinite loop
    img.src = `https://ui-avatars.com/api/?name=${initials}&background=19c6c2&color=fff`;
  };

  function ensureInputEditable() {
    const input = $('.chat-input');
    if (input) {
      if (window.altiusComposerLockedUpload) return;
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
    }
  }

  function observeInputAttributes() {
    const input = $('.chat-input');
    if (!input) return;
    const observer = new MutationObserver(() => {
      if (window.altiusComposerLockedUpload) return;
      if (input.hasAttribute('readonly')) input.removeAttribute('readonly');
      if (input.hasAttribute('disabled')) input.removeAttribute('disabled');
    });
    observer.observe(input, { attributes: true });
  }

  // Tambahkan fungsi untuk loading create session di tengah chat-messages
  function showChatMessagesSessionLoading(text) {
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer) return;
    let loading = messagesContainer.querySelector('.session-create-loading');
    if (!loading) {
      loading = document.createElement('div');
      loading.className = 'session-create-loading';
      loading.innerHTML = `
        <div class="session-create-loading-inner">
          <div class="session-create-spinner"></div>
          <div class="session-create-loading-text">${text || 'Memulai sesi chat...'
        }</div>
        </div>
      `;
      messagesContainer.appendChild(loading);
    }
    loading.style.display = 'flex';
    const loadingText = loading.querySelector('.session-create-loading-text');
    if (loadingText) loadingText.textContent = text || 'Memulai sesi chat...';
  }
  function hideChatMessagesSessionLoading() {
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer) return;
    const loading = messagesContainer.querySelector('.session-create-loading');
    if (loading) loading.remove();
  }

  // State untuk skeleton header
  let isHeaderSkeletonLoading = false;
  function showHeaderSkeleton() {
    if (isHeaderSkeletonLoading) return;
    isHeaderSkeletonLoading = true;
    const logo = $('.bot-logo');
    const name = $('.bot-name');
    const statusDot = $('.status-dot');
    const statusText = $('.status-text');
    if (logo) {
      logo.classList.add('skeleton-loading');
      logo.src = '';
      logo.style.background = '#e0e0e0';
    }
    if (name) {
      name.classList.add('skeleton-loading');
      name.textContent = '';
      name.style.background = '#e0e0e0';
      name.style.minWidth = '100px';
      name.style.minHeight = '18px';
      name.style.borderRadius = '4px';
      name.style.display = 'inline-block';
    }
    if (statusDot) {
      statusDot.classList.add('skeleton-loading');
      statusDot.style.background = '#e0e0e0';
      statusDot.style.border = 'none';
      statusDot.style.width = '16px';
      statusDot.style.height = '16px';
      statusDot.style.marginRight = '6px';
      statusDot.style.display = 'inline-block';
    }
    if (statusText) {
      statusText.classList.add('skeleton-loading');
      statusText.textContent = '';
      statusText.style.background = '#e0e0e0';
      statusText.style.minWidth = '60px';
      statusText.style.minHeight = '14px';
      statusText.style.borderRadius = '4px';
      statusText.style.display = 'inline-block';
    }
  }
  function hideHeaderSkeleton() {
    if (!isHeaderSkeletonLoading) return;
    isHeaderSkeletonLoading = false;
    const logo = $('.bot-logo');
    const name = $('.bot-name');
    const statusDot = $('.status-dot');
    const statusText = $('.status-text');
    if (logo) {
      logo.classList.remove('skeleton-loading');
      logo.style.background = '';
    }
    if (name) {
      name.classList.remove('skeleton-loading');
      name.style.background = '';
      name.style.minWidth = '';
      name.style.minHeight = '';
      name.style.borderRadius = '';
      name.style.display = '';
    }
    if (statusDot) {
      statusDot.classList.remove('skeleton-loading');
      statusDot.style.background = '';
      statusDot.style.border = '';
      statusDot.style.width = '';
      statusDot.style.height = '';
      statusDot.style.marginRight = '';
      statusDot.style.display = '';
    }
    if (statusText) {
      statusText.classList.remove('skeleton-loading');
      statusText.style.background = '';
      statusText.style.minWidth = '';
      statusText.style.minHeight = '';
      statusText.style.borderRadius = '';
      statusText.style.display = '';
      statusText.textContent = 'Online';
    }
  }

  // Helper untuk cek apakah session & detail user sudah siap
  function isHeaderReady() {
    return (
      window.session_id &&
      window.session_id !== '' &&
      window.userAgentDetailFetched
    );
  }

  // Helper untuk mengambil inisial dari nama
  function getInitials(name) {
    if (!name) return 'AI';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Simple composer lock for FILE_UPLOAD flow
  function setComposerDisabledUpload(disabled) {
    window.altiusComposerLockedUpload = !!disabled;
    const input = $('.chat-input');
    const sendButton = $('.chat-send');
    if (input) {
      if (disabled) {
        input.setAttribute('data-prev-ph', input.placeholder || '');
        input.placeholder = 'Selesaikan upload file terlebih dahulu...';
      } else {
        const prev = input.getAttribute('data-prev-ph');
        input.placeholder = prev || 'Type here...';
        input.removeAttribute('data-prev-ph');
      }
      input.disabled = !!disabled;
      input.readOnly = !!disabled;
      input.style.pointerEvents = disabled ? 'none' : '';
      input.style.opacity = disabled ? '0.6' : '';
    }
    if (sendButton) {
      sendButton.disabled = !!disabled;
      sendButton.style.pointerEvents = disabled ? 'none' : '';
      sendButton.style.opacity = disabled ? '0.6' : '';
    }
  }

  function addFileUploadMessage() {
    const messagesContainer = $('.chat-messages');
    if (!messagesContainer) return;
    // Lock composer while upload UI is active
    setComposerDisabledUpload(true);

    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const bubbleHeader = `<div class="bubble-header"><span class="sender-label">${userAgentData.bot_name}</span><span class="bubble-time">${time}</span></div>`;

    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const html = `
      <div class="message">
        <div class="bubble file-upload-bubble">
          ${bubbleHeader}
          <div class="bubble-content">
            <div class="upload-card" id="${id}">
              <div class="upload-dropzone">
               
                <div class="upload-title">Upload File</div>
                <div class="upload-subtitle">Klik atau drag & drop file Anda di sini</div>
                <button class="upload-button" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 11.5L12 7l-4.5 4.5 1.41 1.41L11 10.83V17h2v-6.17l2.09 2.09 1.41-1.41z"/></svg>
                  PILIH FILE
                </button>
                <input class="upload-input" type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.csv,.xlsx" multiple hidden />
                <div class="upload-status" style="display:none;"></div>
                <div class="upload-error" style="display:none;"></div>
              
              </div>
              <div class="upload-list-section" style="display:none;">
                <div class="upload-list-title">File yang diupload:</div>
                <div class="upload-list"></div>
              </div>
              <div class="upload-send-section" style="display:none;flex-direction:column;align-items:center;gap:10px;margin-top:12px;">
                <div class="upload-ready-note" style="display:flex;align-items:center;gap:6px;color:#55627a;font-size:12px;">
                  <span style="font-size:14px">📁</span>
                  <span>File siap dikirim</span>
                </div>
                <button class="upload-button upload-send-btn" type="button" disabled>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  Kirim ke Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', html);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Wire events
    const card = root ? root.getElementById(id) : document.getElementById(id);
    if (!card) return;
    const dropzone = card.querySelector('.upload-dropzone');
    const selectBtn = card.querySelector('.upload-button');
    const input = card.querySelector('.upload-input');
    const status = card.querySelector('.upload-status');
    const err = card.querySelector('.upload-error');
    const listSection = card.querySelector('.upload-list-section');
    const list = card.querySelector('.upload-list');
    const sendBtn = card.querySelector('.upload-send-btn');
    const sendSection = card.querySelector('.upload-send-section');
    let isCardLocked = false;

    function setDisabled(el, disabled) {
      if (!el) return;
      try {
        el.disabled = !!disabled;
      } catch (_) {
        /* noop */
      }
      if (disabled) {
        el.style.opacity = '0.6';
        el.style.cursor = 'not-allowed';
        el.style.pointerEvents = 'none';
      } else {
        el.style.opacity = '';
        el.style.cursor = '';
        el.style.pointerEvents = '';
      }
    }

    function lockCard() {
      isCardLocked = true;
      setDisabled(sendBtn, true);
      if (sendBtn) {
        sendBtn.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Terkirim';
      }
      setDisabled(selectBtn, true);
      if (dropzone) dropzone.style.pointerEvents = 'none';
      if (dropzone) dropzone.style.opacity = '0.6';
      if (input) input.disabled = true;
      if (list)
        list
          .querySelectorAll('.upload-remove')
          .forEach(btn => setDisabled(btn, true));
      // Re-enable composer after this upload card is done
      setComposerDisabledUpload(false);
    }

    const MAX_MB = 10;
    const MAX_BYTES = MAX_MB * 1024 * 1024;
    const ACCEPTED_EXT = [
      'pdf',
      'doc',
      'docx',
      'txt',
      'jpg',
      'jpeg',
      'png',
      'csv',
      'xlsx',
    ];

    const files = [];

    function refreshSendState() {
      if (!sendBtn) return;
      const anyUploaded = files.some(f => f && f.uploaded && f.url);
      sendBtn.disabled = !anyUploaded || isLoading;
      if (sendSection) {
        sendSection.style.display = anyUploaded ? 'flex' : 'none';
      }
    }

    function showListSection() {
      if (!listSection) return;
      listSection.style.display = files.length ? 'block' : 'none';
    }

    function setError(msg) {
      if (!err) return;
      err.textContent = msg;
      err.style.display = 'block';
      if (status) status.style.display = 'none';
    }
    function clearInlineMsgs() {
      if (err) err.style.display = 'none';
      if (status) status.style.display = 'none';
    }

    function validate(file) {
      if (!file) return 'File tidak ditemukan';
      if (file.size > MAX_BYTES) return `Ukuran file melebihi ${MAX_MB}MB`;
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) return 'Format file tidak didukung';
      return '';
    }

    function truncateFilename(name, maxLen = 15) {
      if (!name || name.length <= maxLen) return name;

      // Find the last dot for extension
      const dot = name.lastIndexOf('.');
      const ext = dot > 0 ? name.slice(dot) : '';
      const base = dot > 0 ? name.slice(0, dot) : name;

      // If extension is too long or maxLen is too small, return original
      if (maxLen <= ext.length + 3 || maxLen < 8) return name;

      // Reserve space for extension and minimum 3 dots
      const minDots = 3;
      const reservedSpace = ext.length + minDots;
      const availableForBase = maxLen - reservedSpace;

      // If not enough space, use very short version
      if (availableForBase < 2) {
        return `${base.slice(0, 1)}...${ext}`;
      }

      // Take only a few characters from the beginning
      const startChars = Math.min(
        availableForBase,
        Math.floor(base.length * 0.3)
      ); // Take only 30% of original
      const start = base.slice(0, Math.max(2, startChars)); // Minimum 2 chars

      // Fill remaining space with dots
      const remainingSpace = maxLen - start.length - ext.length;
      const dots = '.'.repeat(Math.max(3, remainingSpace));

      return `${start}${dots}${ext}`;
    }

    function createItemHtml(idItem, file) {
      const displayName = truncateFilename(file.name, 32);
      return `
        <div class="upload-item" data-id="${idItem}"> 
          <div class="upload-item-row">
            <div class="upload-item-name" title="${file.name}">${displayName}</div>
            <div class="upload-item-right">
              <button class="upload-remove" title="Hapus" aria-label="Hapus file">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zm3-3h6l1 2H8l1-2z"/></svg>
              </button>
            </div>
          </div>
          <div class="upload-item-chips">
            <span class="upload-chip-success">Berhasil diupload</span>
            <span class="upload-chip-error">Gagal</span>
          </div>
          <div class="upload-progress-wrap"><div class="upload-progress-bar"></div></div>
        </div>
      `;
    }

    function performUpload(file, onProgress) {
      // Try host-provided uploader first
      try {
        if (typeof window.altiusUploadFile === 'function') {
          const result = window.altiusUploadFile(file, onProgress);
          if (result && typeof result.then === 'function') {
            return result;
          }
        }
      } catch (e) {
        // ignore and fallback to our implementation
      }

      // Built-in uploader: read file as data URL, POST to Altius API, simulate progress
      const API_URL = 'https://altiusapi.altius.id/upload/picture';
      const LOCATION = 'widget/chat';

      const readFileAsDataURL = f =>
        new Promise((resolve, reject) => {
          try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = err => reject(err);
            reader.readAsDataURL(f);
          } catch (err) {
            reject(err);
          }
        });

      const simulateTo = target => {
        // Smoothly progress up to a target percent
        return new Promise(resolve => {
          let current = 0;
          const step = () => {
            current = Math.min(
              target,
              current + Math.round(5 + Math.random() * 10)
            );
            try {
              onProgress && onProgress(current);
            } catch (_) {
              void 0;
            }
            if (current < target) setTimeout(step, 80);
            else resolve();
          };
          setTimeout(step, 60);
        });
      };

      return new Promise((resolve, reject) => {
        (async () => {
          try {
            // Progress up to 35% while reading
            const p1 = simulateTo(35);
            const dataUrl = await readFileAsDataURL(file);
            await p1;

            // Progress up to 90% while uploading
            const p2 = simulateTo(90);
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: LOCATION,
                image_data: String(dataUrl || ''),
              }),
            });
            await p2;

            if (!response.ok) {
              const text = await response.text().catch(() => '');
              throw new Error(
                text || `Upload failed with status ${response.status}`
              );
            }
            const json = await response.json().catch(() => ({}));
            const url = (json && (json.URL || json.url)) || '';
            try {
              onProgress && onProgress(100);
            } catch (_) {
              void 0;
            }
            resolve({ ok: true, url });
          } catch (err) {
            try {
              onProgress && onProgress(100);
            } catch (_) {
              void 0;
            }
            reject(err);
          }
        })();
      });
    }

    function addFile(file) {
      const msg = validate(file);
      if (msg) {
        setError(msg);
        return;
      }
      clearInlineMsgs();
      const idItem = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      files.push({ id: idItem, file, uploaded: false, url: '' });
      if (list)
        list.insertAdjacentHTML('beforeend', createItemHtml(idItem, file));
      showListSection();
      refreshSendState();
      // Start upload with progress UI
      if (list) {
        const node = list.querySelector(`.upload-item[data-id="${idItem}"]`);
        if (node) {
          const barWrap = node.querySelector('.upload-progress-wrap');
          const bar = node.querySelector('.upload-progress-bar');
          const chipSuccess = node.querySelector('.upload-chip-success');
          const chipError = node.querySelector('.upload-chip-error');
          if (barWrap && bar) {
            barWrap.style.display = 'block';
            const onProgress = percent => {
              bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
            };
            performUpload(file, onProgress)
              .then(result => {
                barWrap.style.display = 'none';
                if (chipSuccess) chipSuccess.style.display = 'inline-block';
                // Update file state
                const fobj = files.find(f => f.id === idItem);
                if (fobj) {
                  fobj.uploaded = true;
                  fobj.url = result && result.url ? result.url : '';
                }
                refreshSendState();
                // Show returned URL if available (kept hidden unless needed)
                if (status && result && result.url) {
                  status.style.display = 'block';
                  // status.innerHTML = `URL: <a href="${result.url}" target="_blank" rel="noopener noreferrer">${result.url}</a>`;
                }
                // Dispatch uploaded event with URL
                try {
                  const evtUploaded = new CustomEvent(
                    'altius-chat-file-uploaded',
                    {
                      detail: { file, url: result && result.url },
                    }
                  );
                  window.dispatchEvent(evtUploaded);
                } catch (_) {
                  void 0;
                }
              })
              .catch(error => {
                barWrap.style.display = 'none';
                if (chipError) chipError.style.display = 'inline-block';
                if (err) {
                  err.textContent = `Upload gagal${error && error.message ? `: ${error.message}` : ''
                    }`;
                  err.style.display = 'block';
                }
                refreshSendState();
              });
          }
        }
      }
      try {
        const evt = new CustomEvent('altius-chat-file-selected', {
          detail: { file },
        });
        window.dispatchEvent(evt);
      } catch (errDispatch) {
        console.warn(
          'Failed to dispatch altius-chat-file-selected event',
          errDispatch
        );
      }
    }

    // Remove handler (event delegation)
    if (list) {
      list.addEventListener('click', e => {
        if (isCardLocked) return;
        const btn = e.target.closest && e.target.closest('.upload-remove');
        if (!btn) return;
        const item = btn.closest('.upload-item');
        if (!item) return;
        const itemId = item.getAttribute('data-id');
        const idx = files.findIndex(f => f.id === itemId);
        if (idx !== -1) {
          const removed = files.splice(idx, 1)[0];
          item.remove();
          showListSection();
          refreshSendState();
          try {
            const evt = new CustomEvent('altius-chat-file-removed', {
              detail: { file: removed.file },
            });
            window.dispatchEvent(evt);
          } catch (errDispatch) {
            console.warn(
              'Failed to dispatch altius-chat-file-removed event',
              errDispatch
            );
          }
        }
      });
    }

    if (selectBtn) {
      selectBtn.addEventListener('click', () => {
        if (isCardLocked) return;
        return input && input.click();
      });
    }
    if (input) {
      input.addEventListener('change', () => {
        if (isCardLocked) return;
        if (!input.files) return;
        Array.from(input.files).forEach(f => addFile(f));
        // reset so selecting same file again will trigger change
        input.value = '';
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        if (isLoading) return;
        const payload = files
          .filter(f => f && f.uploaded && f.url)
          .map(f => ({ url: f.url }));
        if (!payload.length) {
          setError('Tidak ada file yang siap dikirim');
          return;
        }
        let sentOk = false;
        try {
          // Silent send: no user bubble, but still show AI response
          isLoading = true;
          refreshSendState();
          sendBtn.disabled = true;
          const readyNote = card.querySelector('.upload-ready-note');
          if (readyNote) readyNote.style.color = '#55627a';

          addLoadingIndicator();
          const messageText = `Berikut url kwitansinya : ${JSON.stringify(
            payload
          )}`;
          const response = await sendMessage(messageText);
          removeLoadingIndicator();

          const FILE_UPLOAD_TOKEN = '[FILE_UPLOAD]';
          const hasUpload =
            typeof response === 'string' &&
            response.includes(FILE_UPLOAD_TOKEN);
          const cleaned =
            typeof response === 'string'
              ? response.replace(FILE_UPLOAD_TOKEN, '').trim()
              : '';

          if (cleaned) {
            addMessage(cleaned);
          }
          if (hasUpload) {
            addFileUploadMessage();
          }
          if (!cleaned && !hasUpload) {
            addMessage('');
          }

          // Inline success indication
          if (readyNote) {
            readyNote.style.color = '#16a34a';
            readyNote.innerHTML =
              '<span style="font-size:14px">✅</span><span>Terkirim ke chat</span>';
          }
          sentOk = true;

          try {
            const evtSent = new CustomEvent('altius-chat-files-sent', {
              detail: { payload, messageText },
            });
            window.dispatchEvent(evtSent);
          } catch (_) {
            void 0;
          }
        } catch (e) {
          removeLoadingIndicator();
          setError('Gagal mengirim ke chat');
        } finally {
          isLoading = false;
          if (sentOk) {
            lockCard();
          } else {
            sendBtn.disabled = false;
          }
          refreshSendState();
        }
      });
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', e => {
        if (isCardLocked) return;
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => {
        if (isCardLocked) return;
        dropzone.classList.remove('dragover');
      });
      dropzone.addEventListener('drop', e => {
        if (isCardLocked) return;
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const dt = e.dataTransfer;
        if (!dt || !dt.files) return;
        Array.from(dt.files).forEach(f => addFile(f));
      });
    }
  }
})();

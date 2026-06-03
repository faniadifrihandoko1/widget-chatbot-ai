# Altius Chat Widget - Agent Documentation

This document provides a comprehensive technical overview and guidelines for understanding, maintaining, and extending the Altius Chat Widget, focusing specifically on `index.js` and its corresponding CSS (`styles/chat-widget.css`).

## 1. Architecture Overview

The widget is built using Vanilla JavaScript encapsulated within an Immediately Invoked Function Expression (IIFE) to prevent global scope pollution. 

### Shadow DOM
To ensure styling isolation and prevent conflicts with the host website's CSS, the widget injects itself into a **Shadow DOM** (`mode: 'open'`). 
- **Host Element:** `<div id="altius-chat-widget-host"></div>`
- **DOM Queries:** A helper function `$(selector)` is used throughout `index.js` to query elements specifically within the `shadowRoot`.
- **CSS Injection:** The main stylesheet `styles/chat-widget.css` is loaded via `@import` into a `<style>` tag appended directly to the Shadow DOM. Several inline fallback styles (like reset `br` tags, loading spinners, and upload cards) are also appended dynamically.

## 2. Global Variables & State Management

The widget relies on global `window` variables for initialization:
- `window.chat_api_key`: (Required) Used as the `qubisa-token-key` header for API authentication.
- `window.personal_data`: (Required) User profile data sent with chat prompts.
- `window.session_id`: Keeps track of the current chat session.
- `window.show_history`: Boolean to determine if the history sidebar should be rendered.
- `window.isAltius`: Boolean flag that alters default bot mascot icons.
- `window.icon_url` / `window.iconUrl`: Custom mascot/logo URL.

### Internal State (`index.js`)
- `isOpen`: Chat window visibility.
- `isLoading`: Tracks active API requests to disable input/send buttons.
- `hasInteracted`: Determines if the splash screen should be hidden.
- `splashScreenShown`: Prevents re-rendering the splash screen.
- `userAgentData`: Stores the bot's configuration fetched from the API (name, logo, brand color, theme, layout).

## 3. Core Features & Functions

### A. API Integration
The widget communicates with Azure-hosted endpoints (`https://agiai-api-dabae8aacehvgcf5.indonesiacentral-01.azurewebsites.net`):
1. **Create Session** (`/create_session`): Fetches a unique `session_id` if one doesn't exist.
2. **User Agent Detail** (`/detail_useragent_chat`): Fetches widget configuration including bot name, logo, brand color, dark mode preference, layout style, and FAQ templates.
3. **Chat History** (`/chat_sessions`): Retrieves previous chat sessions, categorized by "Hari ini", "Kemarin", and "Lebih lama".
4. **Chat** (`/chat`): Sends user prompts and receives AI responses.

### B. Chat & UI Interaction
- **Splash Screen:** Displayed when the chat is opened for the first time before the user interacts.
- **Header Actions:** Contains a dropdown menu for "Chat Baru" (New Chat), Dark Mode Toggle, and Fullscreen Toggle.
- **Template Questions:** FAQ buttons that populate the chat input box when clicked.
- **Markdown Parsing:** The widget includes a custom parser (`formatMessageToHTML`) that converts markdown formatting (bold, italics, code blocks, lists, headings) from the AI's response into HTML.

### C. File Upload Module
The widget supports file uploads, triggered when the AI response includes the special token `[FILE_UPLOAD]`.
- Renders a drag-and-drop file upload card.
- Supports `.pdf, .doc, .docx, .txt, .jpg, .jpeg, .png, .csv, .xlsx`.
- Enforces a 10MB size limit.
- Uploads images to `https://altiusapi.altius.id/upload/picture`.
- Simulates progress bars and gracefully locks the chat composer (`setComposerDisabledUpload`) until the upload process is completed or sent to the chat.

## 4. CSS Styling & Theming (`chat-widget.css`)

### A. Layout States
- **Normal View:** A floating widget (`bottom: 20px, right: 20px`) with a fixed width (`350px`) and height (`550px`).
- **Fullscreen View (`.chat-window.fullscreen`):** Takes up the entire screen. In this mode, the history sidebar (`.chat-sidebar`) becomes visible (width `280px`).

### B. Dynamic Brand Theming
The widget dynamically injects a CSS variable `--brand-color` into the `.chat-widget` container based on the `color_brand` returned from the API. This color is used for the header background, spinner borders, and active states.

### C. Dark Mode (`.dark-theme`)
When the API specifies dark mode (`darkmode: 'Y'`) or the user toggles it manually:
- The class `.dark-theme` is applied to `.chat-widget`.
- Backgrounds switch to `#111827` or `#1f2937`.
- Text colors invert to lighter shades (`#f9fafb`, `#d1d5db`).
- Border colors adapt to `#374151`.

### D. Message Bubbles
- **Bot Bubbles:** White background (`#fff`), border `#d1e7ff`, dark text.
- **User Bubbles:** Light blue background (`#e6f4ff`), border `#90caf9`.
- **Markdown Styling:** Includes specific styling for lists (`.markdown-list`), code blocks (`.code-block`), and headings (`.markdown-heading`) to ensure readability.

## 5. Extensibility & Future Maintenance Guidelines

1. **Modifying the Shadow DOM:** If external libraries (like SweetAlert or specific icon fonts) need to be used, remember they will not automatically penetrate the Shadow DOM. Their CSS must be manually injected via the `loadCSS()` function.
2. **Uploading Non-Images:** Currently, the upload module points to an endpoint named `/upload/picture`. If document processing (PDFs, DOCX) is fully integrated on the backend, ensure the endpoint supports non-image MIME types.
3. **Custom Event Dispatching:** The file upload module dispatches custom events (`altius-chat-file-selected`, `altius-chat-file-uploaded`, `altius-chat-files-sent`). External applications embedding this widget can listen to these events on the `window` object for further integration.
4. **State Reset:** Ensure that when `startNewChat()` is called, all internal states (session ID, uploaded files, skeleton loaders, and template questions visibility) are strictly reset to prevent data leakage between sessions.

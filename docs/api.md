# Altius Chat Widget - API Documentation

This document outlines the API endpoints consumed by the Altius Chat Widget inside `index.js`. All API interactions use standard `fetch` calls and handle JSON responses.

## Base URLs
- **Main Chat API Base:** `https://agiai-api-dabae8aacehvgcf5.indonesiacentral-01.azurewebsites.net` (Trailing slashes are automatically trimmed).
- **Upload API Base:** `https://altiusapi.altius.id`

---

## 1. Authentication
The main chat endpoints require an authentication token passed in the headers.
- **Header Key:** `qubisa-token-key`
- **Value Source:** `window.chat_api_key` (Required global variable passed to the widget).

---

## 2. Endpoints

### 2.1 Create Session
Generates a new session ID for a chat thread.

- **Endpoint:** `/create_session`
- **Method:** `GET`
- **Headers:** 
  ```json
  {
    "qubisa-token-key": "<window.chat_api_key>"
  }
  ```
- **Success Response:**
  ```json
  {
    "session_id": "string"
  }
  ```
- **Widget Behavior:** The returned `session_id` is saved to `window.session_id` and used for subsequent chat messages.

### 2.2 Get User Agent Details
Fetches the configuration and visual properties of the AI bot.

- **Endpoint:** `/detail_useragent_chat`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "qubisa-token-key": "<window.chat_api_key>"
  }
  ```
- **Success Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "detail_collection": [
        {
          "useragent_name": "string",
          "bot_name": "string",
          "bot_logo_url": "string (URL)",
          "template_question": "string (stringified JSON Array of FAQs)",
          "color_brand": "string (HEX color)",
          "darkmode": "string ('Y' or 'N')",
          "layout": "string ('full' or 'mini')"
        }
      ]
    }
  }
  ```
- **Widget Behavior:** Updates internal `userAgentData` state, re-renders header texts/logos, injects the `--brand-color` variable, applies dark mode if enabled, and configures the layout mode.

### 2.3 Send Chat Message
Sends the user's prompt to the AI and receives a response.

- **Endpoint:** `/chat`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "qubisa-token-key": "<window.chat_api_key>"
  }
  ```
- **Request Body:**
  ```json
  {
    "session_id": "<window.session_id>",
    "prompt": "string (user's input)",
    "user_profile": "object or string (from window.personal_data)",
    "min_char": "integer (optional, from window.min_char)"
  }
  ```
- **Success Response:**
  ```json
  {
    "response": "string (Markdown formatted text)"
  }
  ```
- **Widget Behavior:** Parses the markdown into HTML using `formatMessageToHTML`. If the `response` string contains `[FILE_UPLOAD]`, the widget triggers the upload card UI logic and locks the composer.

### 2.4 Get Chat Sessions History
Fetches the history of previous sessions for the sidebar (active only when `window.show_history` is true).

- **Endpoint:** `/chat_sessions`
- **Method:** `GET`
- **Query Parameters:** `page=1`, `page_size=10`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "qubisa-token-key": "<window.chat_api_key>"
  }
  ```
- **Success Response Structure:**
  ```json
  {
    "success": true,
    "data": [
      {
        "session_id": "string",
        "created_date": "string (ISO datetime)",
        "latest_user_message": "string"
      }
    ]
  }
  ```
- **Widget Behavior:** Groups the sessions dynamically into "Hari ini" (Today), "Kemarin" (Yesterday), and "Lebih lama" (Older) and lists them in the sidebar.

### 2.5 Get Session Chat History
Fetches the detailed message history for a specific session to continue the chat.

- **Endpoint:** `/chat_history`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "qubisa-token-key": "<window.chat_api_key>"
  }
  ```
- **Request Body:**
  ```json
  {
    "session_id": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "session_id": "alinehrisai_1758246494.923766",
    "chat_history": [
      {
        "role": "user",
        "content": "hari ini hari apa ya kak"
      },
      {
        "role": "assistant",
        "content": "Hari ini tanggal 19 September 2025, hari Jumat. Ada yang bisa saya bantu lagi?"
      }
    ]
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
    "detail": "Invalid or expired session_id"
  }
  ```
- **Widget Behavior:** Used to continue an existing chat session and display the detailed history of messages within that specific session.

### 2.6 Upload File
Uploads a user-selected file (image or document) to the server.

- **Endpoint:** `https://altiusapi.altius.id/upload/picture`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "location": "widget/chat",
    "image_data": "string (Base64 Data URL representation of the file)"
  }
  ```
- **Success Response:**
  ```json
  {
    "URL": "string (Direct URL to the uploaded file)",
    "url": "string (Fallback property name)"
  }
  ```
- **Widget Behavior:** 
  - Simulates a progress bar using `simulateTo()`.
  - Dispatches custom browser events (`altius-chat-file-selected`, `altius-chat-file-uploaded`).
  - The URL from the response is collected. Once the user clicks "Kirim ke Chat", the widget creates a system payload mapping (`[{"url": "..."}]`) and hits the **`/chat`** endpoint silently to feed the AI the uploaded file contexts.

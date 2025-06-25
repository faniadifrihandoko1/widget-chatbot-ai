// Konstanta dan data default untuk Altius Chat Widget

export const API_ENDPOINTS = {
  CREATE_SESSION:
    "https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/create_session",
  CHAT: "https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/chat",
  USER_AGENT_DETAILS:
    "https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/detail_useragent",
};

export const DEFAULT_USER_AGENT_DATA = {
  useragent_name: "Altius People",
  bot_name: "Altius Assistant",
  bot_logo_url:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU3OUJGRDU3NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU3OUJGRDU4NEI1MTExRjA5RUMzOUMyNkNDRjkyRTg0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTc5QkZENTU0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTc5QkZENTY0QjUxMTFGMDlFQzM5QzI2Q0NGOTJFODQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4eA3aDAAAC80lEQVR42syYX4gNURzH5969yvpzlV3h5i7lxSJ3pVYiYhUR8i+51nq5m+wKJTx4ULIvlAehZCT/pkQibZKQF0rywAMpyp9CHrRErjbX5+Tc9prMzJmZM2ZOfc+ZO3fumc/5/c75nd+5RqVSMUIVy2xHYw3NRXAJpTX0tQmtNyIq6ZDWy1EvQBuTCWgYRdlHC7BTkgjY7nCtraTEREylUkHcO5X6ac2dd2i8USz90rVIwlrQPu/GobnJcLFlpuX8c3N5rHNwnrSYvawFfnASAJ3CShYtjxfQMuupV7s8sSFuCy6TlnIqSxhEQ5yAXrtGBq2LB9AyG6kXaxiEcsn4fH4y6lWJswxmBEG7T1vETlqppluZOF6eXbp3CE2TVL6mFRqOjqOz4fZi55eLQedqXtxkAxDXIx1+fgHt/NLb87Hq2UwAgFG2l+VtELkA0eEF2gLYHddF4mH66n2dW1kZ9aCDwJUdVzFg+2i2uZg+inJLWu2lUj4I5Bo+H0WjIwb7gHYAdtFXPsgPLtM0o9MRgYlE9hia5AXnmVFjzTaaE2iiJrjHaDNgj7Rk1HR0m2YaOhwS7Kuc261+4JTPJFhSpPD3AsJdQtsBex9mh/OKgx0B+n6FugC7GempDuvVyxWXVezrJzqEDgD3Q1eO4GbBFT7g7kqrPf+fhyYV936Sz7W5wllmAbVqywdx7xiaRa75nmGcQrsB++yR5IqQdQVdCzKn0y4HH6fvnqDZgHUqwIl+bsipsorPw3QB/itl/4Z2oRmAPVA4HuyhPo8GyTtDPU6Dai7GvQWagu32VRFwAXurAFZHfUQsGod5fSasBWvnyRtxEAdspRLcwKArUvYynwHkAwNivTo5//plTGsG7LovnxRLZbSVqznomT3u+j3x2S24EIn8bDpgYoV+DxzAiqX7oh+0XwbxQLvTXzsJFpxA8xowvUe9P/++nkSz5J2ZDOChyk6i/dDkAim81S1T/HMAdicLcAA0L93eCWS/F+BvAQYAY/cSG57y",
};

export const WELCOME_MESSAGE =
  "Halo! Saya adalah asisten virtual AI anda. ada yang bisa saya bantu hari ini ?";

export const ERROR_MESSAGES = {
  NO_TOKEN: "No authentication token available",
  FETCH_ERROR: "❌ Gagal mengirim pesan. Coba lagi.",
  API_ERROR: "Maaf, terjadi kesalahan.",
};

export const CSS_CLASSES = {
  WIDGET: "ai-altius-altius-chat-widget",
  BUBBLE: "ai-altius-altius-chat-bubble",
  POPUP: "ai-altius-altius-chat-popup",
  HEADER: "ai-altius-altius-chat-header",
  CONTENT: "ai-altius-altius-chat-content",
  INPUT_AREA: "ai-altius-altius-chat-input-area",
  INPUT: "ai-altius-altius-chat-input",
  SEND: "ai-altius-altius-chat-send",
  CLOSE: "ai-altius-altius-chat-close",
  MESSAGE: "ai-altius-altius-chat-message",
  TYPING: "ai-altius-altius-typing-indicator",
  LOGO: "ai-altius-altius-chat-logo",
  TITLE: "ai-altius-altius-chat-title",
  STATUS: "ai-altius-altius-chat-status",
  STATUS_DOT: "ai-altius-altius-chat-status-dot",
  CHAT_ICON: "ai-altius-altius-chat-icon",
  CLOSE_ICON: "ai-altius-altius-close-icon",
  SEND_ICON: "ai-altius-altius-chat-send-icon",
  LOGO_IMG: "ai-altius-altius-logo-img",
  TYPING_DOT: "ai-altius-altius-typing-dot",
};

export const ELEMENT_IDS = {
  TOGGLE: "altius-chat-toggle",
  POPUP: "altius-chat-popup",
  CLOSE: "altius-chat-close",
  INPUT: "altius-chat-input",
  SEND: "altius-chat-send",
  CONTENT: "altius-chat-content",
  TYPING: "altius-typing",
};

export const ANIMATION_NAMES = {
  MESSAGE_SLIDE: "altius-message-slide",
  TYPING_FADE: "altius-typing-fade",
  TYPING: "altius-typing",
  CLOSE_BOUNCE: "altius-close-bounce",
  RIPPLE: "ripple",
  TITLE_SLIDE: "altius-title-slide",
};

export default {
  API_ENDPOINTS,
  DEFAULT_USER_AGENT_DATA,
  WELCOME_MESSAGE,
  ERROR_MESSAGES,
  CSS_CLASSES,
  ELEMENT_IDS,
  ANIMATION_NAMES,
};

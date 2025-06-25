// Service API untuk Altius Chat Widget
import { API_ENDPOINTS, ERROR_MESSAGES } from "../config/constants.js";

class ChatAPIService {
  constructor() {
    this.sessionId = null;
    this.userAgentData = null;
  }

  /**
   * Mengambil token dari window object
   * @returns {string|null} Token atau null jika tidak ada
   */
  getToken() {
    return window.chat_api_key || null;
  }

  /**
   * Mengambil tenant dari window object
   * @returns {string|null} Tenant atau null jika tidak ada
   */
  getTenant() {
    return window.chat_api_tenant || null;
  }

  /**
   * Membuat session baru
   * @returns {Promise<string|null>} Session ID atau null jika gagal
   */
  async createSession() {
    const token = this.getToken();
    if (!token) {
      console.warn(ERROR_MESSAGES.NO_TOKEN);
      return null;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_SESSION, {
        method: "GET",
        headers: {
          "qubisa-token-key": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.sessionId = data.session_id || null;
      window.session_id = this.sessionId;

      return this.sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      this.sessionId = null;
      window.session_id = null;
      return null;
    }
  }

  /**
   * Mengambil detail user agent dari API
   * @returns {Promise<Object|null>} Data user agent atau null jika gagal
   */
  async fetchUserAgentDetails() {
    const token = this.getToken();
    const tenant = this.getTenant();

    if (!token) {
      console.warn("No authentication token available for user agent details");
      return null;
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.USER_AGENT_DETAILS}/${token}`,
        {
          method: "GET",
          headers: {
            "qubisa-api-key": tenant,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("agent detail", data.data?.detail_collection?.[0]?.bot_name);

      if (
        data.success &&
        data.data &&
        data.data.detail_collection &&
        data.data.detail_collection.length > 0
      ) {
        const agentDetail = data.data.detail_collection[0];
        this.userAgentData = {
          useragent_name: agentDetail.useragent_name || "Altius People",
          bot_name: agentDetail.bot_name,
          bot_logo_url: agentDetail.bot_logo_url,
        };

        return this.userAgentData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user agent details:", error);
      return null;
    }
  }

  /**
   * Mengirim pesan ke API chat
   * @param {string} prompt - Pesan dari pengguna
   * @param {Array} chatHistory - Riwayat chat
   * @returns {Promise<string>} Respons dari bot
   */
  async sendMessage(prompt, chatHistory = []) {
    const token = this.getToken();
    if (!token) {
      throw new Error(ERROR_MESSAGES.NO_TOKEN);
    }

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "qubisa-token-key": token,
        },
        body: JSON.stringify({
          prompt: prompt,
          user_profile: window.personal_data,
          session_id: this.sessionId,
          chat_history: chatHistory.filter((msg) => msg.role !== "system"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || ERROR_MESSAGES.API_ERROR;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }
  }

  /**
   * Inisialisasi API service dengan session dan user agent details
   * @returns {Promise<Object>} Object berisi sessionId dan userAgentData
   */
  async initialize() {
    const [sessionId, userAgentData] = await Promise.all([
      this.createSession(),
      this.fetchUserAgentDetails(),
    ]);

    return {
      sessionId,
      userAgentData,
    };
  }

  /**
   * Mengambil data user agent yang tersimpan
   * @returns {Object|null} Data user agent
   */
  getUserAgentData() {
    return this.userAgentData;
  }

  /**
   * Mengambil session ID yang tersimpan
   * @returns {string|null} Session ID
   */
  getSessionId() {
    return this.sessionId;
  }
}

export default ChatAPIService;

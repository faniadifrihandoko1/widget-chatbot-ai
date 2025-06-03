export class ChatAuth {
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

    // Add user message to history
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

      // Add bot reply to history
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

import { ConversationChain } from "langchain/chains";
// import { ChatOpenAI } from "langchain/chat_models/openai"
import { BufferMemory } from "langchain/memory";
// import {
//   ChatPromptTemplate,
//   HumanMessagePromptTemplate,
//   SystemMessagePromptTemplate,
//   MessagesPlaceholder
// } from "langchain/prompts"

export class ChatService {
  constructor(userId) {
    this.userId = userId;
    this.chats = new Map();
  }

  async createChat(chatId) {
    this.chats.set(chatId, []);
    return this.chats.get(chatId);
  }

  async getOrCreateChat(chatId) {
    if (!this.chats.has(chatId)) {
      await this.createChat(chatId);
    }
    return this.chats.get(chatId);
  }

  async sendMessage(chatId, message, context = "") {
    const history = await this.getOrCreateChat(chatId);

    try {
      const prompt = this.formatPrompt(message, history, context);

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-r1:7b",
            prompt: prompt,
            stream: true,
          }),
        }
      );

      return response; // Return the stream directly
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  }

  formatPrompt(message, history, context) {
    const systemPrompt = `You are CHO-2, an advanced AI assistant. When you need to think or process something complex, wrap that section in <think> tags. ${context}`;

    const recentHistory = history
      .slice(-5)
      .map(
        (msg) =>
          `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    return `${systemPrompt}\n\nPrevious conversation:\n${recentHistory}\n\nHuman: ${message}\nAssistant:`;
  }
}

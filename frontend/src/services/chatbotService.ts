import { apiClient, ApiResponse } from './apiClient';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface SendChatResponse {
  reply: string;
  model: string;
}

export const chatbotService = {
  async sendMessage(
    message: string,
    history: ChatHistoryItem[] = []
  ): Promise<ApiResponse<SendChatResponse>> {
    return apiClient.post<SendChatResponse>('/chatbot/message', {
      message,
      history,
    });
  },
};

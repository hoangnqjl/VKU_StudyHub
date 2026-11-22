import { Request, Response } from 'express';
import { chatbotService } from './chatbot.service';
import { SendChatInput } from './chatbot.schema';

export const chatbotController = {
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, history = [] } = req.body as Partial<SendChatInput>;
      const result = await chatbotService.generateReply({
        message: (message || '').trim(),
        history,
      });
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const message = error?.message || 'Không thể kết nối tới trợ lý AI.';
      const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
      res.status(status).json({
        success: false,
        message,
      });
    }
  },
};

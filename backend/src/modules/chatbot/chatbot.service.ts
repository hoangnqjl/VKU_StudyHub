import { SendChatInput } from './chatbot.schema';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `Bạn là trợ lý AI hỗ trợ sinh viên của ứng dụng VKU StudyHub (Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn, VKU).
Nhiệm vụ của bạn:
- Hỗ trợ sinh viên giải đáp thắc mắc về học tập, tài liệu môn học, phương pháp học (Pomodoro, ghi chú, ôn thi).
- Hướng dẫn sử dụng các tính năng của VKU StudyHub: Tìm kiếm & chia sẻ tài liệu (Documents), Phòng học tập trung Pomodoro (Focus / Pomodoro Room), Radar tìm bạn học xung quanh (Radar).
- Trả lời ngắn gọn, rõ ràng, thân thiện bằng tiếng Việt (hoặc tiếng Anh nếu người dùng hỏi bằng tiếng Anh).`;

export const chatbotService = {
  async generateReply(input: SendChatInput): Promise<{ reply: string; model: string }> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY chưa được cấu hình trên server. Vui lòng thêm GEMINI_API_KEY vào file backend/.env.'
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const contents = [
      ...input.history.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      })),
      {
        role: 'user',
        parts: [{ text: input.message }],
      },
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Gemini API lỗi (${response.status}): ${errorText || response.statusText}`);
    }

    const data: any = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text || '')
        .join('')
        .trim() || 'Xin lỗi, tôi chưa thể tạo câu trả lời lúc này.';

    return {
      reply,
      model: GEMINI_MODEL,
    };
  },
};

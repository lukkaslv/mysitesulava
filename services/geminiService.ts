import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTherapyResponse = async (
  history: { role: string; text: string }[],
  newMessage: string,
  lang: 'ru' | 'ka' = 'ru'
): Promise<string> => {
  if (!apiKey) {
    return lang === 'ru' ? "ОШИБКА: КЛЮЧ_API_ОТСУТСТВУЕТ." : "შეცდომა: API_KEY_აკლია.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      Ты — цифровой ассистент психолога Луки Сулава.
      Луке 24 года. Он 8 лет работал на нелюбимой работе, прошел через боль и трансформацию, стал психологом.
      
      Твоя роль:
      - Отвечай на языке пользователя (${lang === 'ru' ? 'русский' : 'грузинский'}).
      - Стиль: лаконичный, "терминальный", прямой, эмпатичный.
      - Твоя задача: выслушать, валидировать чувства и задать один глубокий вопрос.
      - Не давай медицинских советов. Ограничь ответ 2-3 предложениями.
    `;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || (lang === 'ru' ? "СИСТЕМНАЯ_ОШИБКА: ДАННЫЕ_НЕ_ПОЛУЧЕНЫ" : "სისტემური_შეცდომა: მონაცემები_ვერ_მოიძებნა");
  } catch (error) {
    console.error("Gemini Request Failed:", error);
    return lang === 'ru' ? "ФАТАЛЬНАЯ_ОШИБКА: СВЯЗЬ_ПРЕРВАНА." : "ფატალური_შეცდომა: კავშირი_გაწყდა.";
  }
};
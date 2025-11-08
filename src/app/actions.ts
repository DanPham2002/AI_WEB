'use server';

import { z } from 'zod';
import { chatWithAI, type ChatWithAIInput } from '@/ai/flows/conversational-flow';

const GenerateSchema = z.object({
  prompt: z.string(),
  imageDataUri: z.string().optional(),
}).refine(data => data.prompt.length > 0 || !!data.imageDataUri, {
    message: "Yêu cầu không hợp lệ. Vui lòng nhập mô tả hoặc tải lên một hình ảnh.",
    path: ["prompt"],
});

type HandleChatResponse = {
  response?: string;
  isCode?: boolean;
  error?: string;
};

export async function handleChat(values: z.infer<typeof GenerateSchema>): Promise<HandleChatResponse> {
  const validatedFields = GenerateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message || 'Invalid input. Please check your prompt.' };
  }

  const input: ChatWithAIInput = {
    prompt: validatedFields.data.prompt,
    imageDataUri: validatedFields.data.imageDataUri,
  };

  try {
    const result = await chatWithAI(input);
    if (!result || !result.response) {
      return { error: 'AI không thể tạo phản hồi. Phản hồi trống.' };
    }
    return { response: result.response, isCode: result.isCode };
  } catch (e) {
    console.error('Lỗi khi gọi luồng chatWithAI:', e);
    return { error: 'Đã xảy ra lỗi không mong muốn khi tạo phản hồi. Vui lòng thử lại sau.' };
  }
}

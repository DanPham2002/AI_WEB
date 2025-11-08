'use server';

import { z } from 'zod';
import { generateNewComponent, type GenerateNewComponentInput } from '@/ai/flows/generate-new-component';

const GenerateSchema = z.object({
  prompt: z.string(),
  type: z.enum(['react_component', 'nestjs_endpoint']),
  imageDataUri: z.string().optional(),
}).refine(data => data.prompt.length > 0 || !!data.imageDataUri, {
    message: "Yêu cầu không hợp lệ. Vui lòng nhập mô tả hoặc tải lên một hình ảnh.",
    path: ["prompt"],
});


type HandleGenerateResponse = {
  code?: string;
  error?: string;
};

export async function handleGenerate(values: z.infer<typeof GenerateSchema>): Promise<HandleGenerateResponse> {
  const validatedFields = GenerateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message || 'Invalid input. Please check your prompt and selected type.' };
  }

  const input: GenerateNewComponentInput = {
    prompt: validatedFields.data.prompt,
    type: validatedFields.data.type,
    imageDataUri: validatedFields.data.imageDataUri,
  };

  try {
    const result = await generateNewComponent(input);
    if (!result || !result.code) {
      return { error: 'AI không thể tạo mã. Phản hồi trống.' };
    }
    return { code: result.code };
  } catch (e) {
    console.error('Lỗi khi gọi luồng generateNewComponent:', e);
    return { error: 'Đã xảy ra lỗi không mong muốn khi tạo mã. Vui lòng thử lại sau.' };
  }
}

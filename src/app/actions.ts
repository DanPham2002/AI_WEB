'use server';

import { z } from 'zod';
import { generateNewComponent, type GenerateNewComponentInput } from '@/ai/flows/generate-new-component';

const GenerateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
  type: z.enum(['react_component', 'nestjs_endpoint']),
  imageDataUri: z.string().optional(),
});

type HandleGenerateResponse = {
  code?: string;
  error?: string;
};

export async function handleGenerate(values: z.infer<typeof GenerateSchema>): Promise<HandleGenerateResponse> {
  const validatedFields = GenerateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input. Please check your prompt and selected type.' };
  }

  const input: GenerateNewComponentInput = {
    prompt: validatedFields.data.prompt,
    type: validatedFields.data.type,
    imageDataUri: validatedFields.data.imageDataUri,
  };

  try {
    const result = await generateNewComponent(input);
    if (!result || !result.code) {
      return { error: 'AI failed to generate code. The response was empty.' };
    }
    return { code: result.code };
  } catch (e) {
    console.error('Error calling generateNewComponent flow:', e);
    return { error: 'An unexpected error occurred while generating code. Please try again later.' };
  }
}

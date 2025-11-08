'use server';

/**
 * @fileOverview A conversational AI flow that can either chat or generate code.
 *
 * - chatWithAI - A function that handles conversation and code generation.
 * - ChatWithAIInput - The input type for the chatWithAI function.
 * - ChatWithAIOutput - The return type for the chatWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAIInputSchema = z.object({
  prompt: z.string().describe('The user\'s message or prompt.'),
  imageDataUri: z.optional(z.string()).describe("An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ChatWithAIInput = z.infer<typeof ChatWithAIInputSchema>;

const ChatWithAIOutputSchema = z.object({
  response: z.string().describe('The AI\'s response, which can be natural language text or a code block.'),
  isCode: z.boolean().describe('A boolean flag to indicate if the response is a code block.'),
});
export type ChatWithAIOutput = z.infer<typeof ChatWithAIOutputSchema>;

export async function chatWithAI(input: ChatWithAIInput): Promise<ChatWithAIOutput> {
  return conversationalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conversationalPrompt',
  input: {schema: ChatWithAIInputSchema},
  output: {schema: ChatWithAIOutputSchema},
  prompt: `You are a friendly and helpful AI assistant named Lifetex AI. You are an expert in software development, especially with Next.js, React, and Tailwind CSS.

Your capabilities:
1.  Engage in natural, helpful conversation.
2.  Answer questions about programming, technology, or any other topic.
3.  Generate high-quality React/Next.js component code or NestJS endpoint code based on a user's prompt.
4.  Analyze an image provided by the user to inform your response or code generation.

Instructions:
- If the user asks for code, or their prompt clearly describes a UI component or an endpoint, generate the code as requested. When you generate code, set the 'isCode' flag to true in your output. The response should contain ONLY the code, without any surrounding text or explanation.
- If the user is asking a question or just chatting, provide a helpful, natural language response. In this case, set the 'isCode' flag to false.
- Be concise and friendly.
- If an image is provided, use it as a visual reference.

{{#if imageDataUri}}
The user has provided an image for context. Use it as a visual reference for your response.
Image: {{media url=imageDataUri}}
{{/if}}

User prompt: {{{prompt}}}
`,
});

const conversationalFlow = ai.defineFlow(
  {
    name: 'conversationalFlow',
    inputSchema: ChatWithAIInputSchema,
    outputSchema: ChatWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

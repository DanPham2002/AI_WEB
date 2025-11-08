'use server';

/**
 * @fileOverview AI flow to generate new React components or NestJS endpoints based on a text prompt.
 *
 * - generateNewComponent - A function that handles the generation of a new component or endpoint.
 * - GenerateNewComponentInput - The input type for the generateNewComponent function.
 * - GenerateNewComponentOutput - The return type for the generateNewComponent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewComponentInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired component or endpoint.'),
  type: z.enum(['react_component', 'nestjs_endpoint']).describe('The type of code to generate.'),
});
export type GenerateNewComponentInput = z.infer<typeof GenerateNewComponentInputSchema>;

const GenerateNewComponentOutputSchema = z.object({
  code: z.string().describe('The generated code for the component or endpoint.'),
});
export type GenerateNewComponentOutput = z.infer<typeof GenerateNewComponentOutputSchema>;

export async function generateNewComponent(input: GenerateNewComponentInput): Promise<GenerateNewComponentOutput> {
  return generateNewComponentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewComponentPrompt',
  input: {schema: GenerateNewComponentInputSchema},
  output: {schema: GenerateNewComponentOutputSchema},
  prompt: `You are a code generation expert specializing in React components and NestJS endpoints.

You will generate code based on the user's prompt. Ensure the code is valid and follows best practices.

Type: {{type}}
Prompt: {{{prompt}}}

Here's the generated code:`,
});

const generateNewComponentFlow = ai.defineFlow(
  {
    name: 'generateNewComponentFlow',
    inputSchema: GenerateNewComponentInputSchema,
    outputSchema: GenerateNewComponentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

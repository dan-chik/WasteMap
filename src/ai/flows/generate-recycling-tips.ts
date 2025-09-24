// 'use server'
'use server';

/**
 * @fileOverview Generates personalized recycling tips for citizens based on their location and reported waste types.
 *
 * - generateRecyclingTips - A function that generates personalized recycling tips.
 * - GenerateRecyclingTipsInput - The input type for the generateRecyclingTips function.
 * - GenerateRecyclingTipsOutput - The return type for the generateRecyclingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecyclingTipsInputSchema = z.object({
  location: z
    .string()
    .describe('The location of the user, used to provide location-specific recycling tips.'),
  reportedWasteTypes: z
    .array(z.string())
    .describe(
      'An array of waste types the user has reported, used to tailor the recycling tips to their specific needs.'
    ),
});
export type GenerateRecyclingTipsInput = z.infer<typeof GenerateRecyclingTipsInputSchema>;

const GenerateRecyclingTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('An array of personalized recycling tips based on the user input.'),
});
export type GenerateRecyclingTipsOutput = z.infer<typeof GenerateRecyclingTipsOutputSchema>;

export async function generateRecyclingTips(input: GenerateRecyclingTipsInput): Promise<GenerateRecyclingTipsOutput> {
  return generateRecyclingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecyclingTipsPrompt',
  input: {schema: GenerateRecyclingTipsInputSchema},
  output: {schema: GenerateRecyclingTipsOutputSchema},
  prompt: `You are an expert in recycling practices. Generate personalized recycling tips for a user based on their location and the types of waste they commonly report.

Location: {{{location}}}
Reported Waste Types: {{#each reportedWasteTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Tips:
`, // Ensure Handlebars syntax is correctly used
});

const generateRecyclingTipsFlow = ai.defineFlow(
  {
    name: 'generateRecyclingTipsFlow',
    inputSchema: GenerateRecyclingTipsInputSchema,
    outputSchema: GenerateRecyclingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

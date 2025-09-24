'use server';

/**
 * @fileOverview A collector route optimization AI agent.
 *
 * - optimizeCollectorRoute - A function that optimizes the collector route.
 * - OptimizeCollectorRouteInput - The input type for the optimizeCollectorRoute function.
 * - OptimizeCollectorRouteOutput - The return type for the optimizeCollectorRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const OptimizeCollectorRouteInputSchema = z.object({
  binLocations: z
    .array(
      z.object({
        id: z.string().describe('The unique identifier of the bin.'),
        latitude: z.number().describe('The latitude of the bin.'),
        longitude: z.number().describe('The longitude of the bin.'),
        fillLevel: z
          .number()
          .min(0)
          .max(100)
          .describe('The current fill level of the bin (0-100).'),
      })
    )
    .describe('An array of bin locations with their fill levels.'),
  currentLocation: z
    .object({
      latitude: z.number().describe('The current latitude of the collector.'),
      longitude: z.number().describe('The current longitude of the collector.'),
    })
    .describe('The current location of the collector.'),
});
export type OptimizeCollectorRouteInput = z.infer<
  typeof OptimizeCollectorRouteInputSchema
>;

const OptimizeCollectorRouteOutputSchema = z.object({
  optimizedRoute: z
    .array(
      z.object({
        id: z.string().describe('The unique identifier of the bin.'),
        latitude: z.number().describe('The latitude of the bin.'),
        longitude: z.number().describe('The longitude of the bin.'),
        fillLevel: z
          .number()
          .min(0)
          .max(100)
          .describe('The current fill level of the bin (0-100).'),
      })
    )
    .describe(
      'An array of bin locations, sorted in the optimized collection order.'
    ),
  estimatedFuelSavings: z
    .number()
    .describe('The estimated fuel savings from the optimized route.'),
  estimatedTimeSavings: z
    .number()
    .describe('The estimated time savings from the optimized route.'),
});
export type OptimizeCollectorRouteOutput = z.infer<
  typeof OptimizeCollectorRouteOutputSchema
>;

export async function optimizeCollectorRoute(
  input: OptimizeCollectorRouteInput
): Promise<OptimizeCollectorRouteOutput> {
  return optimizeCollectorRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCollectorRoutePrompt',
  input: {schema: OptimizeCollectorRouteInputSchema},
  output: {schema: OptimizeCollectorRouteOutputSchema},
  prompt: `You are an AI assistant specialized in optimizing waste collection routes for collectors.

Given the current location of the collector and a list of bin locations with their fill levels, you will determine the most efficient route to collect the bins that are over 80% full, minimizing travel time and fuel consumption.

You will output the optimized route as an array of bin locations sorted in the order of collection, as well as the estimated fuel and time savings compared to a non-optimized route.

Consider the fill level of each bin, the distance between bins, and the collector's current location when determining the optimal route.

Bins Location: {{{binLocations}}}
Current Location: {{{currentLocation}}}
`,
});

const optimizeCollectorRouteFlow = ai.defineFlow(
  {
    name: 'optimizeCollectorRouteFlow',
    inputSchema: OptimizeCollectorRouteInputSchema,
    outputSchema: OptimizeCollectorRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

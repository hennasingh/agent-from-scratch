import type { ToolFn } from '../../types';
import { z } from 'zod';
import { openai } from '../ai';

export const generateImageToolDefinition = {
    name: 'generate_image',
    parameters: z.object({
        prompt: z.string().describe(
            `prompt for the image. Be sure to consider the user's original 
            message when making the prompt. If you are unsure, 
            then ask the user to provide more details.`),
    }),
    description: 'use this to generate an image',
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async ({ toolArgs, userMessage }) => {
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: toolArgs.prompt,
        n: 1,
        size: '1024x1024',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
        throw new Error('Image generation failed: missing URL in OpenAI response')
    }

    return imageUrl
}
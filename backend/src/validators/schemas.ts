import { z } from 'zod';

const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10);

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`)
    .trim(),
  sessionId: z.string().uuid().optional(),
});

export const getConversationSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type GetConversationInput = z.infer<typeof getConversationSchema>;

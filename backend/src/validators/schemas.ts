import { z } from 'zod';

const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10);
const MIN_MESSAGE_LENGTH = 1;

export const sanitizeMessage = (message: string): string => {
  return message
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ');
};

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(MIN_MESSAGE_LENGTH, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`)
    .transform(sanitizeMessage)
    .refine((msg) => msg.length >= MIN_MESSAGE_LENGTH, {
      message: 'Message cannot be empty after sanitization',
    }),
  sessionId: z.string().uuid().optional(),
});

export const getConversationSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID format'),
});

export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type GetConversationInput = z.infer<typeof getConversationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;


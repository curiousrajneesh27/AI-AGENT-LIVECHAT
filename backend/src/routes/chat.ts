import { Router, Request, Response } from 'express';
import { conversationService, messageService } from '../database/services';
import { generateAIReply } from '../llm/service';
import { validateBody } from '../middleware/validation';
import { chatMessageSchema } from '../validators/schemas';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
router.post('/message', validateBody(chatMessageSchema), async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    // Get or create conversation
    let conversationId = sessionId;
    if (!conversationId || !(await conversationService.exists(conversationId))) {
      const newConversation = await conversationService.create();
      conversationId = newConversation.id;
    }

    // Save user message
    const userMessage = await messageService.create(conversationId, 'user', message);

    // Get conversation history
    const history = await messageService.getRecentHistory(conversationId, 10);

    // Generate AI reply
    const llmResponse = await generateAIReply(
      history.slice(0, -1), // Exclude the message we just added
      message
    );

    if (!llmResponse.success) {
      // Return error but don't crash
      return res.status(500).json({
        success: false,
        error: llmResponse.error?.message || 'Failed to generate response',
        sessionId: conversationId,
      });
    }

    // Save AI reply
    const aiMessage = await messageService.create(
      conversationId,
      'ai',
      llmResponse.reply!
    );

    res.json({
      success: true,
      reply: llmResponse.reply,
      sessionId: conversationId,
      messageId: aiMessage.id,
      timestamp: aiMessage.created_at,
    });
  } catch (error) {
    console.error('Error in /chat/message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
    });
  }
});

/**
 * GET /api/chat/history/:conversationId
 * Get conversation history
 */
router.get('/history/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!(await conversationService.exists(conversationId))) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    const messages = await messageService.getByConversationId(conversationId);

    res.json({
      success: true,
      conversationId,
      messages: messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.created_at,
      })),
    });
  } catch (error) {
    console.error('Error in /chat/history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history',
    });
  }
});

/**
 * GET /api/chat/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;

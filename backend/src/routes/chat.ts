import { Router, Request, Response } from 'express';
import { conversationService, messageService } from '../database/services';
import { generateAIReply, getLLMStats } from '../llm/service';
import { validateBody } from '../middleware/validation';
import { chatMessageSchema } from '../validators/schemas';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get AI response with comprehensive error handling
 */
router.post('/message', validateBody(chatMessageSchema), async (req: Request, res: Response) => {
  const startTime = Date.now();
  
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

    // Handle LLM errors gracefully
    if (!llmResponse.success) {
      console.error('LLM Error:', llmResponse.error);
      
      return res.status(500).json({
        success: false,
        error: llmResponse.error?.message || 'Failed to generate AI response',
        sessionId: conversationId,
        retryable: llmResponse.error?.retryable || false,
      });
    }

    // Save AI reply
    const aiMessage = await messageService.create(
      conversationId,
      'ai',
      llmResponse.reply!
    );

    const responseTime = Date.now() - startTime;
    console.log(`✅ Message processed in ${responseTime}ms`);

    res.json({
      success: true,
      reply: llmResponse.reply,
      sessionId: conversationId,
      messageId: aiMessage.id,
      timestamp: aiMessage.created_at,
      metadata: {
        responseTime,
        tokensUsed: llmResponse.tokensUsed,
        model: llmResponse.model,
      },
    });
  } catch (error: any) {
    console.error('Error in /chat/message:', error);
    
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      metadata: {
        responseTime,
      },
    });
  }
});

/**
 * GET /api/chat/history/:conversationId
 * Get conversation history with validation
 */
router.get('/history/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    // Validate conversation ID format (basic UUID check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID format',
      });
    }

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
      messageCount: messages.length,
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
 * Health check endpoint with detailed system status
 */
router.get('/health', (req: Request, res: Response) => {
  const stats = getLLMStats();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    system: {
      llm: stats,
      database: 'connected',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    },
  });
});

/**
 * DELETE /api/chat/conversation/:conversationId
 * Delete a conversation and all its messages (for privacy/GDPR compliance)
 */
router.delete('/conversation/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    if (!(await conversationService.exists(conversationId))) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    await conversationService.delete(conversationId);

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
    });
  }
});

export default router;

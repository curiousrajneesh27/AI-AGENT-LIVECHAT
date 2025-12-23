/**
 * Channel interface for multi-channel support
 * This abstraction allows easy integration of WhatsApp, Instagram, SMS, etc.
 */
export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  isActive: boolean;
}

export type ChannelType = 'web' | 'whatsapp' | 'instagram' | 'sms' | 'email';

/**
 * Message metadata for channel-specific information
 */
export interface MessageMetadata {
  channelId?: string;
  channelType: ChannelType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  customData?: Record<string, any>;
}

/**
 * Enhanced message interface with metadata
 */
export interface EnhancedMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  metadata: MessageMetadata;
  created_at: string;
}

/**
 * Channel adapter interface for implementing new channels
 */
export interface ChannelAdapter {
  channelType: ChannelType;
  
  /**
   * Format message for specific channel
   */
  formatMessage(message: string): string;
  
  /**
   * Validate channel-specific requirements
   */
  validateMessage(message: string): boolean;
  
  /**
   * Handle channel-specific actions (e.g., typing indicators, read receipts)
   */
  sendTypingIndicator?(): Promise<void>;
  sendReadReceipt?(messageId: string): Promise<void>;
}

/**
 * Base channel adapter with common functionality
 */
export abstract class BaseChannelAdapter implements ChannelAdapter {
  abstract channelType: ChannelType;
  
  formatMessage(message: string): string {
    return message;
  }
  
  validateMessage(message: string): boolean {
    return message.trim().length > 0;
  }
}

/**
 * Web channel adapter (current implementation)
 */
export class WebChannelAdapter extends BaseChannelAdapter {
  channelType: ChannelType = 'web';
  
  formatMessage(message: string): string {
    // Web supports markdown and rich text
    return message;
  }
  
  validateMessage(message: string): boolean {
    const MAX_LENGTH = 2000;
    return super.validateMessage(message) && message.length <= MAX_LENGTH;
  }
}

/**
 * WhatsApp channel adapter (template for future implementation)
 */
export class WhatsAppChannelAdapter extends BaseChannelAdapter {
  channelType: ChannelType = 'whatsapp';
  
  formatMessage(message: string): string {
    // WhatsApp has specific formatting rules
    // Bold: *text*, Italic: _text_, Strikethrough: ~text~
    return message;
  }
  
  validateMessage(message: string): boolean {
    const WHATSAPP_MAX_LENGTH = 4096;
    return super.validateMessage(message) && message.length <= WHATSAPP_MAX_LENGTH;
  }
  
  async sendTypingIndicator(): Promise<void> {
    // Implementation for WhatsApp typing indicator
    console.log('WhatsApp typing indicator sent');
  }
  
  async sendReadReceipt(messageId: string): Promise<void> {
    // Implementation for WhatsApp read receipt
    console.log(`WhatsApp read receipt sent for message: ${messageId}`);
  }
}

/**
 * Channel factory for creating adapters
 */
export class ChannelFactory {
  private static adapters: Map<ChannelType, BaseChannelAdapter> = new Map([
    ['web', new WebChannelAdapter()],
    ['whatsapp', new WhatsAppChannelAdapter()],
  ]);
  
  static getAdapter(channelType: ChannelType): BaseChannelAdapter {
    const adapter = this.adapters.get(channelType);
    if (!adapter) {
      throw new Error(`Channel adapter not found for type: ${channelType}`);
    }
    return adapter;
  }
  
  static registerAdapter(channelType: ChannelType, adapter: BaseChannelAdapter): void {
    this.adapters.set(channelType, adapter);
  }
  
  static getSupportedChannels(): ChannelType[] {
    return Array.from(this.adapters.keys());
  }
}

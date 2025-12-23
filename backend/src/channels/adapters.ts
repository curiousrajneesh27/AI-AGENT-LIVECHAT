export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  isActive: boolean;
}

export type ChannelType = 'web' | 'whatsapp' | 'instagram' | 'sms' | 'email';

export interface MessageMetadata {
  channelId?: string;
  channelType: ChannelType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  customData?: Record<string, any>;
}

export interface EnhancedMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  metadata: MessageMetadata;
  created_at: string;
}

export interface ChannelAdapter {
  channelType: ChannelType;
  
  formatMessage(message: string): string;
  
  validateMessage(message: string): boolean;
  
  sendTypingIndicator?(): Promise<void>;
  sendReadReceipt?(messageId: string): Promise<void>;
}

export abstract class BaseChannelAdapter implements ChannelAdapter {
  abstract channelType: ChannelType;
  
  formatMessage(message: string): string {
    return message;
  }
  
  validateMessage(message: string): boolean {
    return message.trim().length > 0;
  }
}

export class WebChannelAdapter extends BaseChannelAdapter {
  channelType: ChannelType = 'web';
  
  formatMessage(message: string): string {
    return message;
  }
  
  validateMessage(message: string): boolean {
    const MAX_LENGTH = 2000;
    return super.validateMessage(message) && message.length <= MAX_LENGTH;
  }
}

export class WhatsAppChannelAdapter extends BaseChannelAdapter {
  channelType: ChannelType = 'whatsapp';
  
  formatMessage(message: string): string {
    return message;
  }
  
  validateMessage(message: string): boolean {
    const WHATSAPP_MAX_LENGTH = 4096;
    return super.validateMessage(message) && message.length <= WHATSAPP_MAX_LENGTH;
  }
  
  async sendTypingIndicator(): Promise<void> {
    console.log('WhatsApp typing indicator sent');
  }
  
  async sendReadReceipt(messageId: string): Promise<void> {
    console.log(`WhatsApp read receipt sent for message: ${messageId}`);
  }
}

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


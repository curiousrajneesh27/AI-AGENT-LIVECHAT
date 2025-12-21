import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from './db';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  created_at: string;
}

export const conversationService = {
  create: async (): Promise<Conversation> => {
    const id = uuidv4();
    await dbRun(
      'INSERT INTO conversations (id) VALUES (?)',
      id
    );
    
    const conversation = await conversationService.getById(id);
    return conversation!;
  },

  getById: async (id: string): Promise<Conversation | undefined> => {
    const row = await dbGet(
      'SELECT * FROM conversations WHERE id = ?',
      id
    );
    return row as Conversation | undefined;
  },

  exists: async (id: string): Promise<boolean> => {
    const conversation = await conversationService.getById(id);
    return conversation !== undefined;
  },

  updateTimestamp: async (id: string): Promise<void> => {
    await dbRun(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      id
    );
  }
};

export const messageService = {
  create: async (conversationId: string, sender: 'user' | 'ai', text: string): Promise<Message> => {
    const id = uuidv4();
    await dbRun(
      'INSERT INTO messages (id, conversation_id, sender, text) VALUES (?, ?, ?, ?)',
      id, conversationId, sender, text
    );
    
    // Update conversation timestamp
    await conversationService.updateTimestamp(conversationId);
    
    const message = await messageService.getById(id);
    return message!;
  },

  getById: async (id: string): Promise<Message | undefined> => {
    const row = await dbGet(
      'SELECT * FROM messages WHERE id = ?',
      id
    );
    return row as Message | undefined;
  },

  getByConversationId: async (conversationId: string, limit: number = 50): Promise<Message[]> => {
    const rows = await dbAll(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?',
      conversationId, limit
    );
    return rows as Message[];
  },

  getRecentHistory: async (conversationId: string, limit: number = 10): Promise<Message[]> => {
    const rows = await dbAll(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?',
      conversationId, limit
    );
    const messages = rows as Message[];
    return messages.reverse(); // Return in chronological order
  }
};

import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// Create database instance
const db = new sqlite3.Database(dbPath);

// Wrapper functions to promisify sqlite3 methods
export const dbRun = (sql: string, ...params: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const dbGet = (sql: string, ...params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, ...params: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const initDatabase = async () => {
  try {
    // Enable foreign keys
    await dbRun('PRAGMA foreign_keys = ON');

    // Create conversations table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for faster queries
    await dbRun(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
      ON messages(conversation_id)
    `);

    await dbRun(`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at 
      ON messages(created_at)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export default db;

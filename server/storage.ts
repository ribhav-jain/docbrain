import {
  users,
  documents,
  documentChunks,
  chatMessages,
  citations,
  type User,
  type UpsertUser,
  type Document,
  type InsertDocument,
  type DocumentChunk,
  type InsertDocumentChunk,
  type ChatMessage,
  type InsertChatMessage,
  type Citation,
  type InsertCitation,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users (for Replit Auth - from javascript_log_in_with_replit blueprint)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Documents
  getDocuments(userId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(
    id: string,
    data: Partial<Document>
  ): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;

  // Document Chunks
  getDocumentChunks(documentId: string): Promise<DocumentChunk[]>;
  createDocumentChunk(chunk: InsertDocumentChunk): Promise<DocumentChunk>;
  searchSimilarChunks(
    embedding: number[],
    limit: number
  ): Promise<DocumentChunk[]>;

  // Chat Messages
  getUserMessages(
    userId: string
  ): Promise<(ChatMessage & { citations?: Citation[] })[]>;
  createMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearUserMessages(userId: string): Promise<void>;

  // Citations
  createCitation(citation: InsertCitation): Promise<Citation>;
  getMessageCitations(messageId: string): Promise<Citation[]>;
}

export class DatabaseStorage implements IStorage {
  // Users (for Replit Auth - from javascript_log_in_with_replit blueprint)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.uploadDate));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc || undefined;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(doc).returning();
    return document;
  }

  async updateDocument(
    id: string,
    data: Partial<Document>
  ): Promise<Document | undefined> {
    const [doc] = await db
      .update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    return doc || undefined;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Document Chunks
  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    return await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.documentId, documentId));
  }

  async createDocumentChunk(
    chunk: InsertDocumentChunk
  ): Promise<DocumentChunk> {
    const [documentChunk] = await db
      .insert(documentChunks)
      .values(chunk)
      .returning();
    return documentChunk;
  }

  async searchSimilarChunks(
    embedding: number[],
    limit: number = 5
  ): Promise<DocumentChunk[]> {
    // Use pgvector cosine similarity search
    const embeddingString = `[${embedding.join(",")}]`;

    const chunks = await db.execute(sql`
      SELECT c.*, d.name as document_name, d.type as document_type
      FROM ${documentChunks} c
      JOIN ${documents} d ON c.document_id = d.id
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${embeddingString}::vector
      LIMIT ${limit}
    `);

    return chunks.rows as any[];
  }

  // Chat Messages
  async getUserMessages(
    userId: string
  ): Promise<(ChatMessage & { citations?: Citation[] })[]> {
    const msgs = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.timestamp);

    // Get citations for all messages
    const messagesWithCitations = await Promise.all(
      msgs.map(async (msg) => {
        const msgCitations = await this.getMessageCitations(msg.id);
        return {
          ...msg,
          citations: msgCitations.length > 0 ? msgCitations : undefined,
        };
      })
    );

    return messagesWithCitations;
  }

  async createMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [msg] = await db.insert(chatMessages).values(message).returning();
    return msg;
  }

  async clearUserMessages(userId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
  }

  // Citations
  async createCitation(citation: InsertCitation): Promise<Citation> {
    const [cite] = await db.insert(citations).values(citation).returning();
    return cite;
  }

  async getMessageCitations(messageId: string): Promise<Citation[]> {
    return await db
      .select()
      .from(citations)
      .where(eq(citations.messageId, messageId));
  }
}

export const storage = new DatabaseStorage();

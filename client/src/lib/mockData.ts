import { useState, useEffect } from "react";

export type DocStatus = "uploading" | "processing" | "ready" | "error";

export interface Document {
  id: string;
  name: string;
  size: string;
  type: string;
  status: DocStatus;
  uploadDate: string;
  progress?: number;
}

export interface Citation {
  docId: string;
  docName: string;
  page: number;
  text: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "Free" | "Pro" | "Enterprise";
}

// Initial Mock Documents
const INITIAL_DOCS: Document[] = [
  {
    id: "1",
    name: "Q1 Financial Report 2024.pdf",
    size: "2.4 MB",
    type: "PDF",
    status: "ready",
    uploadDate: "2024-05-10",
  },
  {
    id: "2",
    name: "Employee Handbook v2.docx",
    size: "850 KB",
    type: "DOCX",
    status: "ready",
    uploadDate: "2024-05-12",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hello! I'm your RAG Knowledge Assistant. I can answer questions based on the documents you've uploaded. How can I help you today?",
    timestamp: Date.now(),
  },
];

const MOCK_USER: User = {
  id: "u1",
  name: "Ribhav Jain",
  email: "ribhav.jain@gmail.com",
  plan: "Pro",
};

// LocalStorage Keys
const STORAGE_KEYS = {
  DOCS: "rag_docs",
  MESSAGES: "rag_messages",
  USER: "rag_user",
};

// Helper to load from storage
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Store Implementation
let documents = loadFromStorage<Document[]>(STORAGE_KEYS.DOCS, INITIAL_DOCS);
let messages = loadFromStorage<Message[]>(
  STORAGE_KEYS.MESSAGES,
  INITIAL_MESSAGES
);
let currentUser = loadFromStorage<User | null>(STORAGE_KEYS.USER, null);

const listeners: (() => void)[] = [];

const notify = () => listeners.forEach((l) => l());

const saveState = () => {
  localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  if (currentUser) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const useStore = () => {
  const [state, setState] = useState({
    documents,
    messages,
    user: currentUser,
  });

  useEffect(() => {
    const listener = () => setState({ documents, messages, user: currentUser });
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const login = (email: string) => {
    currentUser = { ...MOCK_USER, email };
    saveState();
    notify();
  };

  const logout = () => {
    currentUser = null;
    saveState();
    notify();
  };

  const updateUser = (name: string, email: string) => {
    if (currentUser) {
      currentUser = { ...currentUser, name, email };
      saveState();
      notify();
    }
  };

  const addDocument = (file: File) => {
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
      status: "uploading",
      progress: 0,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    documents = [newDoc, ...documents];
    notify();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        documents = documents.map((d) =>
          d.id === newDoc.id
            ? { ...d, status: "ready", progress: undefined }
            : d
        );
        saveState();
        notify();
      } else if (progress > 30 && newDoc.status === "uploading") {
        documents = documents.map((d) =>
          d.id === newDoc.id ? { ...d, status: "processing", progress } : d
        );
        notify();
      } else {
        documents = documents.map((d) =>
          d.id === newDoc.id ? { ...d, progress } : d
        );
        notify();
      }
    }, 800);
  };

  const deleteDocument = (id: string) => {
    documents = documents.filter((d) => d.id !== id);
    saveState();
    notify();
  };

  const addMessage = (text: string) => {
    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    messages = [...messages, userMsg];
    saveState();
    notify();

    setTimeout(() => {
      // Basic keyword matching for "smarter" mock responses
      let relevantDoc = documents[0];
      const lowerText = text.toLowerCase();

      // Try to find a relevant document based on keywords
      const foundDoc = documents.find((d) =>
        lowerText.includes(d.name.toLowerCase().split(".")[0])
      );
      if (foundDoc) relevantDoc = foundDoc;

      const aiMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: `I've analyzed your query regarding "${text}". Based on the context found in the knowledge base, I can confirm that the data aligns with your requirements. The extraction process identified key metrics relevant to your search.`,
        timestamp: Date.now(),
        citations:
          documents.length > 0
            ? [
                {
                  docId: relevantDoc.id,
                  docName: relevantDoc.name,
                  page: Math.floor(Math.random() * 15) + 1,
                  text: `...relevant context found matching "${text.substring(
                    0,
                    20
                  )}..." within the document structure. The semantic search indicates high confidence in this section...`,
                },
              ]
            : undefined,
      };
      messages = [...messages, aiMsg];
      saveState();
      notify();
    }, 1500);
  };

  const clearChat = () => {
    messages = [];
    saveState();
    notify();
  };

  const clearAllData = () => {
    documents = [];
    messages = [];
    saveState();
    notify();
  };

  return {
    documents: state.documents,
    messages: state.messages,
    user: state.user,
    login,
    logout,
    updateUser,
    addDocument,
    deleteDocument,
    addMessage,
    clearChat,
    clearAllData,
  };
};

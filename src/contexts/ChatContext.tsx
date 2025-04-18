// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../types/Message';

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearChat: () => void;
  sessions: ChatSession[];
  loadSession: (id: number) => void;
  deleteSession: (id: number) => void;
}

const defaultMessages: Message[] = [{
  id: 1,
  sender: 'bot',
  text: "Hi there, I'm MediBot—your virtual medical assistant. I can provide medical advice, analyze symptoms, and guide you during emergencies. How can I help you today?"
}];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? (JSON.parse(saved) as Message[]) : defaultMessages;
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    const parsed = saved ? (JSON.parse(saved) as ChatSession[]) : [];
    // sort so newest sessions appear first
    return parsed.sort((a, b) => b.id - a.id);
  });

  // persist messages
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // persist sessions
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  const clearChat = () => {
    // Create a title from the first user message (or fallback)
    const firstUserMsg = messages.find(m => m.sender === 'user')?.text || 'New Chat';
    const title = firstUserMsg.length > 20
      ? `${firstUserMsg.slice(0, 20)}…`
      : firstUserMsg;

    const newSession: ChatSession = {
      id: Date.now(),
      title,
      messages,
    };

    // prepend new session so newest are first
    setSessions(prev => [newSession, ...prev]);
    setMessages(defaultMessages);
  };

  const loadSession = (id: number) => {
    const session = sessions.find(s => s.id === id);
    if (session) setMessages(session.messages);
  };

  const deleteSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      clearChat,
      sessions,
      loadSession,
      deleteSession,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
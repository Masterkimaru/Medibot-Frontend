// src/components/ChatWindow.tsx
import React, { useRef, useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../types/Message';
import { sendChatMessage, analyzeImage } from '../services/api';
import { motion } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, setMessages } = useChat();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (msg: string) => {
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: msg,
    };
    setMessages([...messages, userMessage]);

    const loadingMessage: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      text: '🔍 Analyzing your symptoms...',
    };
    setMessages(prev => [...prev, loadingMessage]);
    setLoading(true);

    try {
      const response = await sendChatMessage(msg, [...messages, userMessage]);
      const botMessage: Message = {
        id: Date.now() + 2,
        sender: 'bot',
        text: response.response || 'Sorry, I did not understand that.',
      };

      setMessages(prev => {
        const withoutLoading = prev.filter(
          m => m.text !== '🔍 Analyzing your symptoms...'
        );
        return [...withoutLoading, botMessage];
      });
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        id: Date.now() + 3,
        sender: 'bot',
        text: '⚠️ Something went wrong. Please try again later.',
      };
      setMessages(prev => {
        const withoutLoading = prev.filter(
          m => m.text !== '🔍 Analyzing your symptoms...'
        );
        return [...withoutLoading, errorMessage];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (base64Image: string) => {
    const loadingMessage: Message = {
      id: Date.now() + 4,
      sender: 'bot',
      text: '🔍 Analyzing medical image...',
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await analyzeImage(base64Image);
      const analysisMessage: Message = {
        id: Date.now() + 5,
        sender: 'bot',
        text: response.response || 'Image analysis not available.',
      };
      setMessages(prev => {
        const withoutLoading = prev.filter(
          m => m.text !== '🔍 Analyzing medical image...'
        );
        return [...withoutLoading, analysisMessage];
      });
    } catch (err) {
      console.error('Error analyzing image:', err);
      const errorMessage: Message = {
        id: Date.now() + 6,
        sender: 'bot',
        text: '⚠️ Image analysis failed. Please try again later.',
      };
      setMessages(prev => {
        const withoutLoading = prev.filter(
          m => m.text !== '🔍 Analyzing medical image...'
        );
        return [...withoutLoading, errorMessage];
      });
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-transparent">
      <div className="flex-1 overflow-y-auto pb-28 md:pb-4 px-4 space-y-6">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static bottom-0 left-0 right-0 px-4 pb-4 bg-white dark:bg-gray-900 z-10"
      >
        <MessageInput 
          onSend={handleSend} 
          onImageUpload={handleImageUpload}
          disabled={loading} 
        />
      </motion.div>
    </div>
  );
};

export default ChatWindow;

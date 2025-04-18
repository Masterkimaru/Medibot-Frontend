// src/components/MessageInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPaperclip } from 'react-icons/fa';

interface Props {
  onSend: (msg: string) => void;
  onImageUpload: (base64: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<Props> = ({ onSend, onImageUpload, disabled }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null); // fallback for SpeechRecognition
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64Image = reader.result as string;
        // Remove the data URL prefix if present
        base64Image = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
        onImageUpload(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setText((prev) => prev + finalTranscript + ' ');
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, []);

  return (
    <div className="flex items-end space-x-2 w-full">
      <textarea
        ref={textareaRef}
        placeholder="Describe your signs and symptoms..."
        className="flex-1 p-2 border rounded-3xl focus:outline-none resize-none max-h-40 overflow-y-auto dark:bg-gray-800 dark:text-white"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
      />

      {/* Upload Image Icon */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        disabled={disabled}
        title="Upload image"
      >
        <FaPaperclip size={18} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mic Icon */}
      <button
        onClick={handleMicClick}
        className={`text-gray-500 hover:text-gray-700 focus:outline-none ${
          isRecording ? 'text-red-500 animate-pulse' : ''
        }`}
        disabled={disabled}
        title="Speak"
      >
        <FaMicrophone size={18} />
      </button>

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-3xl focus:outline-none disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;

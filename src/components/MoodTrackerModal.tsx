// src/components/MoodTrackerModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { trackMood } from '../services/api';

interface MoodTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodTrackerModal: React.FC<MoodTrackerModalProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [score, setScore] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse(null);

    try {
      const result = await trackMood(description, score, tags);
      setAiResponse(result.response);
    } catch (err) {
      console.error('Error tracking mood:', err);
      setAiResponse('An error occurred while processing your mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleClose = () => {
    // Clear all inputs and response
    setDescription('');
    setScore(5);
    setTags([]);
    setCurrentTag('');
    setAiResponse(null);
    onClose();
  };

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold text-blue-700 mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (/^\d+\./.test(line)) {
        return (
          <p key={index} className="ml-4 mb-1">
            {line}
          </p>
        );
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" // Added max-h and flex-col
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Mood Tracking</h3>
          <button 
            onClick={handleClose} // Changed to handleClose
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-grow"> {/* Scrollable container */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">How are you feeling?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mood Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags/Stressors</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="What is stressing you e.g work"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose} // Changed to handleClose
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Tracking...' : 'Track Mood'}
              </button>
            </div>
          </form>

          {aiResponse && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="prose max-w-none overflow-y-auto max-h-64"> {/* Scrollable response */}
                {formatResponse(aiResponse)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default MoodTrackerModal;
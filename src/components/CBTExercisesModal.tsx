// src/components/CBTExercisesModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { getCBTExercises } from '../services/api';

interface CBTExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CBTExercisesModal: React.FC<CBTExercisesModalProps> = ({ isOpen, onClose }) => {
  const [concern, setConcern] = useState('');
  const [triedStrategies, setTriedStrategies] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getCBTExercises(concern, triedStrategies, desiredOutcome);
      setAiResponse(result.response);
    } catch (err) {
      console.error('Error getting CBT exercises:', err);
      setAiResponse('An error occurred while generating exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConcern('');
    setTriedStrategies('');
    setDesiredOutcome('');
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
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">CBT Exercises</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {!aiResponse ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Main Concern</label>
                <textarea
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">What have you tried?</label>
                <textarea
                  value={triedStrategies}
                  onChange={(e) => setTriedStrategies(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Desired Outcome</label>
                <input
                  type="text"
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Get Exercises'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  {formatResponse(aiResponse)}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
                <button
                  onClick={() => setAiResponse(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Back to Form
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default CBTExercisesModal;
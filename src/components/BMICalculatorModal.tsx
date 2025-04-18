// src/components/BMICalculatorModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { calculateBMI } from '../services/api';

interface BMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getBMIMessages = (category: string): string => {
  if (category.includes('Underweight')) {
    return 'Consider consulting a nutritionist to help you gain weight safely and ensure you’re getting enough essential nutrients.';
  }
  if (category.includes('Normal')) {
    return 'Great job! Keep maintaining your current healthy habits and balanced diet.';
  }
  if (category.includes('Overweight')) {
    return 'Try incorporating more physical activity and monitor your diet. A fitness plan or talking with a dietitian could be helpful.';
  }
  if (category.includes('Obese')) {
    return 'It’s advisable to consult a medical professional. They can guide you on safe ways to manage your weight and improve your overall health.';
  }
  return '';
};

const BMICalculatorModal: React.FC<BMICalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setHeight('');
    setWeight('');
    setBmiResult(null);
    setCategory(null);
  };

  const isFormValid = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    return h > 0 && w > 0;
  };

  const handleCalculate = async () => {
    if (!isFormValid()) return;
    setLoading(true);
    try {
      const h = parseFloat(height);
      const w = parseFloat(weight);

      const result = await calculateBMI(w, h);
      setBmiResult(result.bmi);
      setCategory(result.category);
    } catch (error) {
      console.error('BMI calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = isOpen ? (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>

          {/* Weight First */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g. 70"
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g. 170"
              min="1"
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={!isFormValid() || loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              !isFormValid() || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>

          {bmiResult !== null && (
            <div className="mt-6 text-center">
              <p className="text-lg font-medium">
                Your BMI: <span className="text-blue-600">{bmiResult.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">{category}</p>
              <p className="text-sm text-gray-700 mt-2 italic">
                {getBMIMessages(category || '')}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  ) : null;

  return createPortal(
    <AnimatePresence>{modalContent}</AnimatePresence>,
    document.body
  );
};

export default BMICalculatorModal;

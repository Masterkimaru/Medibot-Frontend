// src/components/EmergencyModal.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaTimes } from 'react-icons/fa';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Request the user's location using the Geolocation API.
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocating(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Specify the emergency phone number as required.
  const emergencyPhoneNumber = '911';  // Change as needed.
  const handleCallEmergency = () => {
    window.location.href = `tel:${emergencyPhoneNumber}`;
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Icon */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-red-600 mb-4 text-center">
              Emergency Assistance
            </h2>
            <p className="text-center text-gray-700 mb-6">
              If you are in immediate danger or require urgent help, please call emergency services immediately.
            </p>

            {/* Optional location sharing */}
            {location ? (
              <p className="text-center text-sm text-gray-500 mb-4">
                Location: {location}
              </p>
            ) : (
              <button
                onClick={requestLocation}
                className="block w-full py-2 mb-4 bg-gray-200 hover:bg-gray-300 rounded transition text-gray-700"
              >
                {locating ? 'Locating...' : 'Share My Location (Optional)'}
              </button>
            )}

            {/* Emergency Call Button with FaPhoneAlt used */}
            <button
              onClick={handleCallEmergency}
              className="block w-full py-3 bg-red-600 text-white rounded-3xl text-lg hover:bg-red-700 transition"
            >
              <FaPhoneAlt className="mr-2 inline-block" />
              Call Emergency Services
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EmergencyModal;

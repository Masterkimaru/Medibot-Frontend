// src/components/UserSettingsModal.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaSave, FaUpload } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUsername(parsed.username || '');
      setAvatar(parsed.avatar || null);
    }
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarData = reader.result as string;
      setAvatar(avatarData);
      saveSettings({ username, avatar: avatarData });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveSettings({ username, avatar });
    onClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // Adjust route as needed
  };

  const saveSettings = (settings: { username: string; avatar: string | null }) => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              onClick={onClose}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-5">👤 User Settings</h2>

            {/* Avatar Section */}
            <div className="flex items-center gap-5 mb-6">
              <img
                src={avatar || '/avatar.png'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
              <label className="cursor-pointer px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-sm font-medium rounded-lg flex items-center gap-2 transition">
                <FaUpload className="text-gray-600" />
                Upload
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                <FaSignOutAlt /> Logout
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                <FaSave /> Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default UserSettingsModal;

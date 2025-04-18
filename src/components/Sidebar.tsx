// src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import {
  FaBars,
  FaPlus,
  FaCalculator,
  FaSmile,
  FaNotesMedical,
  FaBrain,
  FaHistory,
  FaTimes as FaClose,
  FaSignOutAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserSettingsModal from './UserSettingsModal';
import BMICalculatorModal from './BMICalculatorModal';
import MoodTrackerModal from './MoodTrackerModal';
import CBTExercisesModal from './CBTExercisesModal';
import SymptomTrackerModal from './SymptomTrackerModal';
import { getAuth, signOut } from 'firebase/auth';
import { useChat } from '../contexts/ChatContext';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
  user?: any;
  onProfileClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobile = false,
  onClose,
  user,
  onProfileClick,
}) => {
  const [isOpen, setIsOpen] = useState(mobile ? true : true);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBMIModal, setShowBMIModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showCBTModal, setShowCBTModal] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const { clearChat, sessions, loadSession, deleteSession } = useChat();

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.avatar) setLocalAvatar(settings.avatar);
    }
  }, [showSettings]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    if (user) setShowSettings(true);
    else if (onProfileClick) onProfileClick();
  };

  return (
    <>
      <motion.nav
        animate={{ width: isOpen ? 260 : 72 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full bg-white shadow-md p-4 overflow-hidden relative"
      >
        {mobile && (
          <div className="absolute top-4 right-4 z-20">
            <FaClose
              className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={() => onClose && onClose()}
            />
          </div>
        )}

        {!mobile ? (
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
              <FaBars />
            </button>
            {isOpen && <h2 className="text-xl font-bold">MediBot</h2>}
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold">MediBot</h2>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <ul className="flex flex-col gap-3">
            <li
              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={clearChat}
            >
              <FaPlus className="mr-2 text-blue-500" />
              {isOpen && <span>New Chat</span>}
            </li>

            <li className="relative">
              <div
                className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowRecentChats(prev => !prev)}
              >
                <FaHistory className="mr-2 text-gray-500" />
                {isOpen && <span>My Chats</span>}
              </div>
              {showRecentChats && isOpen && (
                <ul className="ml-7 mt-1 space-y-1 text-sm">
                  {sessions.map(session => (
                    <li
                      key={session.id}
                      className="flex justify-between items-center"
                    >
                      <span
                        className="cursor-pointer hover:underline flex-1"
                        onClick={() => {
                          loadSession(session.id);
                          setShowRecentChats(false);
                        }}
                      >
                        {session.title}
                      </span>
                      <FaClose
                        className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                        onClick={e => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li
              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowBMIModal(true)}
            >
              <FaCalculator className="mr-2 text-purple-500" />
              {isOpen && <span>BMI Calculator</span>}
            </li>

            <li
              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowSymptomModal(true)}
            >
              <FaNotesMedical className="mr-2 text-green-600" />
              {isOpen && <span>Symptom Tracker</span>}
            </li>

            <li
              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowMoodModal(true)}
            >
              <FaSmile className="mr-2 text-yellow-500" />
              {isOpen && <span>Mood Tracker</span>}
            </li>

            <li
              className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowCBTModal(true)}
            >
              <FaBrain className="mr-2 text-pink-500" />
              {isOpen && <span>CBT Exercises</span>}
            </li>
          </ul>
        </div>

        <div
          className="flex items-center mt-6 pt-6 border-t cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            src={user?.photoURL || localAvatar || '/avatar.png'}
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user?.displayName || 'John Doe'}
              </p>
              <p className="text-xs text-gray-500">Premium User</p>
            </div>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 ml-auto"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </motion.nav>

      <UserSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <BMICalculatorModal
        isOpen={showBMIModal}
        onClose={() => setShowBMIModal(false)}
      />
      <MoodTrackerModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
      />
      <CBTExercisesModal
        isOpen={showCBTModal}
        onClose={() => setShowCBTModal(false)}
      />
      <SymptomTrackerModal
        isOpen={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
      />
    </>
  );
};

export default Sidebar;
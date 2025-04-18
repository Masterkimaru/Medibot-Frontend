// src/App.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import TopNavbar from './components/TopNavbar';
import AuthModal from './components/AuthModal';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatProvider } from './contexts/ChatContext';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase app and get auth instance
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAuthModalOpen(true);
      } else {
        setAuthModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ChatProvider>
      <div className="h-screen flex flex-col bg-light-blue-bg overflow-hidden scroll-smooth touch-pan-y">
        {/* Fixed Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Add top padding so that content is not hidden behind the fixed TopNavbar */}
        <div className="pt-16 flex flex-1 overflow-hidden">
          {/* Mobile Sidebar + Backdrop */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop with blur */}
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                />
                {/* Slide-in Mobile Sidebar */}
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-lg overflow-y-auto"
                >
                  <Sidebar
                    mobile={true}
                    onClose={() => setSidebarOpen(false)}
                    user={user}
                    onProfileClick={() => setAuthModalOpen(true)}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:block bg-white shadow-lg">
              <Sidebar user={user} onProfileClick={() => setAuthModalOpen(true)} />
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
              <ChatWindow />
            </main>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </ChatProvider>
  );
};

export default App;
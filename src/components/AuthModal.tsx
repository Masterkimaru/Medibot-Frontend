// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import ReactDOM from 'react-dom';

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loadingSource, setLoadingSource] = useState<null | 'email' | 'google'>(null);

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleManualSignIn = async () => {
    setError('');
    setLoadingSource('email');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoadingSource(null);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoadingSource(null);
    }
  };

  const handleSignUp = async () => {
    setError('');
    setLoadingSource('email');

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoadingSource(null);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoadingSource(null);
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoadingSource(null);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      const userData = {
        username,
        email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoadingSource(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoadingSource('google');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        const userData = {
          username: result.user.displayName || 'User',
          email: result.user.email || '',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSource(null);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            {isSignUp && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isSignUp && (
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              onClick={isSignUp ? handleSignUp : handleManualSignIn}
              disabled={loadingSource === 'email'}
              className={`w-full mb-3 ${isSignUp ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg transition flex justify-center items-center`}
            >
              {loadingSource === 'email' ? <Spinner /> : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="text-center mb-4">
              <button
                onClick={toggleAuthMode}
                className="text-sm text-blue-600 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            <div className="relative flex items-center mb-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loadingSource === 'google'}
              className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              {loadingSource === 'google' ? (
                <Spinner />
              ) : (
                <>
                  <FaGoogle className="mr-2" /> Sign in with Google
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AuthModal;

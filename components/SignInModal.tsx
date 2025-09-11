'use client';

import { signIn } from '../echo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Logo */}
          <img 
            src="/dungeonmaster-favicon.png" 
            alt="Digital Dungeonmaster" 
            className="w-16 h-16 mx-auto mb-4"
          />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to Digital Dungeonmaster
          </h2>
          
          <p className="text-gray-600 mb-6">
            You need to sign in with Echo to use our AI-powered RPG services and start chatting with your Dungeonmaster.
          </p>

          {/* Sign In Button */}
          <button
            onClick={() => {
              signIn();
              onClose();
            }}
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
          >
            Sign in with Echo
          </button>

          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
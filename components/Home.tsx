'use client';

import { useEffect, useState } from 'react';
import { signIn, useEcho } from '../echo';
import Chat from './Chat';
import SignInModal from './SignInModal';

export const Home = () => {
  const echoClient = useEcho();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await echoClient.users.getUserInfo();
        setIsSignedIn(true);
      } catch (error) {
        setIsSignedIn(false);
        // Show sign-in modal automatically when not authenticated
        setShowSignInModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [echoClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Digital Dungeonmaster
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            An intelligent platform for tabletop RPGs
          </p>
          <button
            onClick={() => signIn({ basePath: '/api/echo' })}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Sign In with Echo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4">
        {/* Explainer Section */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Digital Dungeon Master
            </h1>
            <p className="text-xl text-gray-700 mb-4 leading-relaxed">
              Practice your D&D skills, experiment with different AI personalities, or just have fun exploring fantasy worlds.
            </p>
            <p className="text-lg text-gray-500 font-medium mb-6">
              Perfect for new players learning the ropes or experienced adventurers trying out creative scenarios.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How It Works</h2>
              <p className="text-gray-700 leading-relaxed">
                Act as a digital DM guiding your team of AI-created heroes on epic campaigns. Create unique characters with detailed backstories, 
                then watch as they come to life in interactive adventures. Our system adapts to your choices, 
                creating dynamic storylines where your heroes' personalities shine through every decision and battle.
              </p>
            </div>
          </div>
        </div>
        
        <Chat />
      </div>
      
      <SignInModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}
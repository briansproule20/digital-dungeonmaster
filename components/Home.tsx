'use client';

import { useEffect, useState } from 'react';
import { signIn, useEcho } from '../echo';
import Chat from './Chat';

export const Home = () => {
  const echoClient = useEcho();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await echoClient.users.getUserInfo();
        setIsSignedIn(true);
      } catch (error) {
        setIsSignedIn(false);
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
      <div className="bg-white shadow-sm border-b py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/dungeonmaster-favicon.png" 
              alt="Digital Dungeonmaster Logo" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Digital Dungeonmaster
              </h1>
              <p className="text-sm text-gray-600">
                Your AI-powered tabletop RPG companion
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <Chat />
      </div>
    </div>
  );
}
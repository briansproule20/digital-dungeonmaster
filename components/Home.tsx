'use client';

import { useEffect, useState } from 'react';
import { signIn, useEcho } from '../echo';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Digital Dungeonmaster!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          You are now signed in. Ready to start your adventure?
        </p>
      </div>
    </div>
  );
}
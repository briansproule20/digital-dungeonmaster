'use client';

import React, { useEffect, useState } from 'react';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';

export default function Campaigns() {
  const echoClient = useEcho();
  const [user, setUser] = useState<any>(null);
  const [partyHeroes, setPartyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await echoClient.users.getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    
    // Load party from localStorage
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        const party = JSON.parse(savedParty);
        setPartyHeroes(party);
      } catch (error) {
        console.error('Failed to parse saved party:', error);
      }
    }
  }, [echoClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaigns</h1>
          <p className="text-lg text-gray-600 mb-6">Sign in to access campaigns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campaigns
          </h1>
          <p className="text-lg text-gray-600">
            Available Campaigns
          </p>
        </div>

        {/* Party Display Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Your Party:
              </span>
              {partyHeroes.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">No heroes selected</span>
                  <a 
                    href="/my-party" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Build Party
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {partyHeroes.map((hero) => (
                    <div key={hero.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                      {hero.avatar_url && (
                        <img
                          src={hero.avatar_url}
                          alt={hero.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900">{hero.name}</span>
                    </div>
                  ))}
                  <a 
                    href="/my-party" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-2"
                  >
                    Edit Party
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Difficulty Buttons */}
        <div className="flex items-center justify-center mt-20">
          <div className="flex items-center gap-16">
            {/* Beginner - Green Circle */}
            <button className="group relative w-48 h-48 bg-green-600 hover:bg-green-700 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Beginner</div>
                  <div className="text-green-100 text-sm">Easy Adventures</div>
                </div>
              </div>
            </button>
            
            {/* Intermediate - Blue Square */}
            <button className="group relative w-48 h-48 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Intermediate</div>
                  <div className="text-blue-100 text-sm">Moderate Challenge</div>
                </div>
              </div>
            </button>
            
            {/* Advanced - Black Diamond */}
            <button className="group relative w-48 h-48 bg-gray-900 hover:bg-black transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform rotate-45">
              <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Advanced</div>
                  <div className="text-gray-300 text-sm">Expert Level</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
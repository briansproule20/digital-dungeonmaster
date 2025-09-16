'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';

function CampaignsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const echoClient = useEcho();
  const [user, setUser] = useState<any>(null);
  const [partyHeroes, setPartyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromParty, setFromParty] = useState(false);

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
    
    // Check if coming from party page
    const fromPartyParam = searchParams?.get('fromParty');
    setFromParty(fromPartyParam === 'true');
    
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
  }, [echoClient, searchParams]);

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
    <div className="min-h-screen bg-gray-50 py-8 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campaigns
          </h1>
          <p className="text-lg text-gray-600">
            Available Campaigns
          </p>
        </div>

        {/* Party Ready Banner */}
        {fromParty && partyHeroes.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-900">Party Ready for Adventure!</h2>
              </div>
              <p className="text-green-800">
                Your party of {partyHeroes.length} hero{partyHeroes.length !== 1 ? 's' : ''} is assembled and ready to embark on a campaign. 
                Choose a difficulty level below to begin your adventure!
              </p>
            </div>
          </div>
        )}

        {/* Party Display Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className={`rounded-lg shadow-sm border p-6 ${
            fromParty && partyHeroes.length > 0 
              ? 'bg-gradient-to-r from-green-50 to-white border-green-200' 
              : 'bg-white border-gray-200'
          }`}>
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
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Beginner - Green Circle */}
            <button 
              onClick={() => router.push('/campaigns/beginner')}
              className="group relative w-48 h-48 bg-green-600 hover:bg-green-700 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Beginner</div>
                  <div className="text-green-100 text-sm">Easy Adventures</div>
                </div>
              </div>
            </button>
            
            {/* Intermediate - Blue Square - LOCKED */}
            <div className="group relative w-48 h-48 bg-gray-400 cursor-not-allowed shadow-lg opacity-60">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Intermediate</div>
                  <div className="text-gray-200 text-sm">Moderate Challenge</div>
                </div>
              </div>
              {/* Lock Icon */}
              <div className="absolute top-4 right-4 bg-gray-600 rounded-full p-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Advanced - Black Diamond - LOCKED */}
            <div className="group relative w-48 h-48 bg-gray-500 cursor-not-allowed shadow-lg opacity-60 transform rotate-45 mt-8 md:mt-0">
              <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-2">Advanced</div>
                  <div className="text-gray-200 text-sm">Expert Level</div>
                </div>
              </div>
              {/* Lock Icon */}
              <div className="absolute top-4 right-4 bg-gray-700 rounded-full p-2 transform -rotate-45">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    }>
      <CampaignsContent />
    </Suspense>
  );
}
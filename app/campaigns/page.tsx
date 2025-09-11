'use client';

import { useEffect, useState } from 'react';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';

export default function Campaigns() {
  const echoClient = useEcho();
  const [user, setUser] = useState(null);
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

        {/* Campaign Shapes */}
        <div className="flex items-center justify-center mt-20">
          <div className="flex items-center gap-40">
            {/* Green Circle */}
            <div className="w-48 h-48 bg-green-600 rounded-full"></div>
            
            {/* Blue Square */}
            <div className="w-48 h-48 bg-blue-600"></div>
            
            {/* Black Diamond */}
            <div className="w-48 h-48 bg-black transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
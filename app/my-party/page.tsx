'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';

export default function MyParty() {
  const router = useRouter();
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
  }, [echoClient]);


  const removeFromParty = (heroId: string) => {
    const updatedParty = partyHeroes.filter(h => h.id !== heroId);
    setPartyHeroes(updatedParty);
    localStorage.setItem('myParty', JSON.stringify(updatedParty));
  };

  const clearParty = () => {
    if (confirm('Are you sure you want to clear the entire party?')) {
      setPartyHeroes([]);
      localStorage.setItem('myParty', JSON.stringify([]));
    }
  };

  const startCampaign = () => {
    // Navigate to campaigns page with party ready to go
    router.push('/campaigns?fromParty=true');
  };

  // Load party from localStorage on component mount
  useEffect(() => {
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        const party = JSON.parse(savedParty);
        setPartyHeroes(party);
      } catch (error) {
        console.error('Failed to parse saved party:', error);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading party management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🎭</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Party</h1>
          <p className="text-lg text-gray-600 mb-6">Sign in to stage heroes for your campaign</p>
          <p className="text-sm text-gray-500">Organize and prepare your heroes before starting a campaign</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Party</h1>
          <p className="text-lg text-gray-600">Stage and organize heroes for your upcoming campaign</p>
        </div>

        {/* Current Party */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Party ({partyHeroes.length}/3)</h2>
              {partyHeroes.length > 0 && (
                <button
                  onClick={clearParty}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {partyHeroes.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 text-4xl mb-4">🎭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No heroes in party</h3>
                <p className="text-gray-600 mb-4">Add heroes from the Heroes page to build your party</p>
                <a
                  href="/heroes"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Heroes
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {partyHeroes.map((hero) => (
                  <div key={hero.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {hero.avatar_url && (
                      <img
                        src={hero.avatar_url}
                        alt={hero.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{hero.name}</h4>
                      <p className="text-sm text-gray-600">
                        Level {hero.level} {hero.race} {hero.class}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromParty(hero.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Remove from party"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {partyHeroes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={startCampaign}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Start Campaign with This Party
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
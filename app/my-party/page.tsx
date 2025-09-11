'use client';

import { useEffect, useState } from 'react';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';
import { HeroService } from '../../lib/heroes';

export default function MyParty() {
  const echoClient = useEcho();
  const [user, setUser] = useState(null);
  const [availableHeroes, setAvailableHeroes] = useState<Hero[]>([]);
  const [partyHeroes, setPartyHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndHeroes = async () => {
      try {
        const userInfo = await echoClient.users.getUserInfo();
        setUser(userInfo);
        
        // Fetch all heroes that the user can add to their party
        const allHeroes = await HeroService.getAllHeroes();
        setAvailableHeroes(allHeroes);
      } catch (error) {
        console.error('Failed to fetch user or heroes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndHeroes();
  }, [echoClient]);

  const addToParty = (hero: Hero) => {
    if (partyHeroes.length >= 6) {
      alert('Maximum party size is 6 heroes');
      return;
    }
    
    if (!partyHeroes.find(h => h.id === hero.id)) {
      setPartyHeroes([...partyHeroes, hero]);
    }
  };

  const removeFromParty = (heroId: string) => {
    setPartyHeroes(partyHeroes.filter(h => h.id !== heroId));
  };

  const clearParty = () => {
    if (confirm('Are you sure you want to clear the entire party?')) {
      setPartyHeroes([]);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Party */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Party ({partyHeroes.length}/6)</h2>
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
                <p className="text-gray-600">Add heroes from the available list to build your party</p>
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
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Start Campaign with This Party
                </button>
              </div>
            )}
          </div>

          {/* Available Heroes */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Heroes ({availableHeroes.length})</h2>
            
            {availableHeroes.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-gray-400 text-4xl mb-4">⚔️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No heroes available</h3>
                <p className="text-gray-600 mb-4">Create some heroes first to add them to your party</p>
                <a
                  href="/heroes"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Heroes
                </a>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableHeroes.map((hero) => (
                  <div key={hero.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    {hero.avatar_url && (
                      <img
                        src={hero.avatar_url}
                        alt={hero.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{hero.name}</h4>
                      <p className="text-sm text-gray-600">
                        Level {hero.level} {hero.race} {hero.class}
                      </p>
                      {user?.id === hero.user_id && (
                        <span className="text-xs text-blue-600 font-medium">Your Hero</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToParty(hero)}
                      disabled={partyHeroes.find(h => h.id === hero.id) || partyHeroes.length >= 6}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {partyHeroes.find(h => h.id === hero.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
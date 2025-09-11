'use client';

import { useEffect, useState } from 'react';
import { useEcho } from '../../echo';
import { Hero } from '../../lib/supabase';
import { HeroService } from '../../lib/heroes';
import HeroForm from '../../components/HeroForm';
import HeroChatModal from '../../components/HeroChatModal';
import { CreateHeroInput } from '../../lib/supabase';

export default function Heroes() {
  const echoClient = useEcho();
  const [user, setUser] = useState(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partyHeroes, setPartyHeroes] = useState<Hero[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

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

  useEffect(() => {
    const fetchUserAndHeroes = async () => {
      try {
        const userInfo = await echoClient.users.getUserInfo();
        setUser(userInfo);
        
        // Fetch all public heroes instead of just user's heroes
        const allHeroes = await HeroService.getAllHeroes();
        setHeroes(allHeroes);
      } catch (error) {
        console.error('Failed to fetch user or heroes:', error);
        // If not authenticated, still show all heroes
        try {
          const allHeroes = await HeroService.getAllHeroes();
          setHeroes(allHeroes);
        } catch (heroError) {
          console.error('Failed to fetch heroes:', heroError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndHeroes();
  }, [echoClient]);

  const handleCreateHero = async (heroData: CreateHeroInput) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const newHero = await HeroService.createHero(user.id, heroData);
      if (newHero) {
        setHeroes([newHero, ...heroes]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create hero:', error);
      alert(`Failed to create hero: ${error?.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateHero = async (heroData: CreateHeroInput) => {
    if (!user?.id || !editingHero) return;
    
    setIsSubmitting(true);
    try {
      const updatedHero = await HeroService.updateHero(editingHero.id, user.id, heroData);
      if (updatedHero) {
        setHeroes(heroes.map(h => h.id === editingHero.id ? updatedHero : h));
        setEditingHero(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to update hero:', error);
      alert(`Failed to update hero: ${error?.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHero = async (heroId: string) => {
    if (!user?.id || !confirm('Are you sure you want to delete this hero?')) return;
    
    try {
      const success = await HeroService.deleteHero(heroId, user.id);
      if (success) {
        setHeroes(heroes.filter(h => h.id !== heroId));
      }
    } catch (error) {
      console.error('Failed to delete hero:', error);
    }
  };

  const startEdit = (hero: Hero) => {
    setEditingHero(hero);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingHero(null);
  };

  const openChatModal = (hero: Hero) => {
    setSelectedHero(hero);
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedHero(null);
  };

  const addToParty = (hero: Hero) => {
    if (partyHeroes.length >= 3) {
      alert('Party is full! Remove a hero first (max 3 heroes).');
      return;
    }
    
    if (partyHeroes.find(h => h.id === hero.id)) {
      alert('Hero is already in your party!');
      return;
    }
    
    const updatedParty = [...partyHeroes, hero];
    setPartyHeroes(updatedParty);
    localStorage.setItem('myParty', JSON.stringify(updatedParty));
  };

  const removeFromParty = (heroId: string) => {
    const updatedParty = partyHeroes.filter(h => h.id !== heroId);
    setPartyHeroes(updatedParty);
    localStorage.setItem('myParty', JSON.stringify(updatedParty));
  };

  const isInParty = (heroId: string) => {
    return partyHeroes.some(h => h.id === heroId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading heroes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">⚔️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Heroes</h1>
          <p className="text-lg text-gray-600 mb-6">Sign in to discover and create D&D characters</p>
          <p className="text-sm text-gray-500">All signed-in users can view and create heroes for everyone to see</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <HeroForm
            onSubmit={editingHero ? handleUpdateHero : handleCreateHero}
            onCancel={cancelForm}
            isLoading={isSubmitting}
            initialData={editingHero || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Heroes</h1>
            <p className="text-lg text-gray-600">Browse and discover D&D characters from all players</p>
            {user && partyHeroes.length > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Current Party: {partyHeroes.length}/3 heroes
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            {user && partyHeroes.length > 0 && (
              <a
                href="/my-party"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Party ({partyHeroes.length})
              </a>
            )}
            {user && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Hero
              </button>
            )}
          </div>
        </div>

        {heroes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚔️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No heroes yet</h3>
            <p className="text-gray-600 mb-6">Be the first to create a hero for everyone to discover!</p>
            {user && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create the First Hero
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero) => (
              <div key={hero.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4 mb-4">
                  {hero.avatar_url ? (
                    <img
                      src={hero.avatar_url}
                      alt={hero.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚔️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{hero.name}</h3>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">Level {hero.level}</span>
                        {user?.id === hero.user_id && (
                          <span className="text-xs text-blue-600 font-medium">Your Hero</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {(hero.race || hero.class) && (
                  <p className="text-sm text-gray-600 mb-2">
                    {hero.race} {hero.class}
                  </p>
                )}
                
                <p className="text-gray-700 mb-4 line-clamp-3">{hero.description}</p>
                
                {hero.personality_traits && hero.personality_traits.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {hero.personality_traits.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {hero.personality_traits.length > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{hero.personality_traits.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {/* Primary action - Chat */}
                  <button
                    onClick={() => openChatModal(hero)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Chat with {hero.name}
                  </button>
                  
                  {/* Secondary actions */}
                  <div className="flex gap-2">
                    {user && (
                      isInParty(hero.id) ? (
                        <button
                          onClick={() => removeFromParty(hero.id)}
                          className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 transition-colors text-xs font-medium border border-red-200"
                        >
                          In Party ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => addToParty(hero)}
                          className={`flex-1 px-3 py-2 rounded-md transition-colors text-xs font-medium border ${
                            partyHeroes.length >= 3 
                              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                              : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          }`}
                          disabled={partyHeroes.length >= 3}
                        >
                          {partyHeroes.length >= 3 ? 'Party Full' : 'Add to Party'}
                        </button>
                      )
                    )}
                    
                    {user?.id === hero.user_id && (
                      <>
                        <button
                          onClick={() => startEdit(hero)}
                          className="bg-gray-50 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-xs font-medium border border-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHero(hero.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-xs font-medium border border-red-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hero Chat Modal */}
      {showChatModal && selectedHero && (
        <HeroChatModal
          isOpen={showChatModal}
          onClose={closeChatModal}
          hero={selectedHero}
        />
      )}
    </div>
  );
}

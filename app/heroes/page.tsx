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
          </div>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Hero
            </button>
          )}
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
              <div key={hero.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {hero.avatar_url && (
                  <img
                    src={hero.avatar_url}
                    alt={hero.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{hero.name}</h3>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 block">Level {hero.level}</span>
                      {user?.id === hero.user_id && (
                        <span className="text-xs text-blue-600 font-medium">Your Hero</span>
                      )}
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
                  
                  <div className="flex gap-2">
                    {user?.id === hero.user_id ? (
                      <>
                        <button
                          onClick={() => openChatModal(hero)}
                          className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          Chat with {hero.name}
                        </button>
                        <button
                          onClick={() => startEdit(hero)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHero(hero.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => openChatModal(hero)}
                        className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      >
                        Chat with {hero.name}
                      </button>
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
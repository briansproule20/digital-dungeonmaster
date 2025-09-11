import { Hero } from '../lib/supabase';
import { useAvatarColors } from '../lib/useAvatarColors';

interface HeroCardProps {
  hero: Hero;
  user: any;
  partyHeroes: Hero[];
  isInParty: (heroId: string) => boolean;
  addToParty: (hero: Hero) => void;
  removeFromParty: (heroId: string) => void;
  openChatModal: (hero: Hero) => void;
  openProfileModal: (hero: Hero) => void;
  setEditingHero: (hero: Hero) => void;
  setShowForm: (show: boolean) => void;
  handleDeleteHero?: (heroId: string) => void;
}

export default function HeroCard({ 
  hero, 
  user, 
  partyHeroes, 
  isInParty, 
  addToParty, 
  removeFromParty, 
  openChatModal, 
  openProfileModal,
  setEditingHero,
  setShowForm,
  handleDeleteHero
}: HeroCardProps) {
  const avatarColors = useAvatarColors(hero.avatar_url);
  console.log('HeroCard for', hero.name, 'got colors:', avatarColors);

  const startEdit = (hero: Hero) => {
    setEditingHero(hero);
    setShowForm(true);
  };

  return (
    <div className="rounded-lg shadow-sm border overflow-hidden">
      {/* Header with gradient background */}
      <div className="px-6 py-4 text-white" style={avatarColors}>
        <div className="flex items-start gap-4">
          {hero.avatar_url ? (
            <img
              src={hero.avatar_url}
              alt={hero.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0 border-2 border-white">
              <span className="text-2xl">⚔️</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold truncate">{hero.name}</h3>
                <button
                  onClick={() => openProfileModal(hero)}
                  className="text-sm text-white opacity-90 hover:opacity-100 hover:underline transition-all"
                >
                  View Full Profile
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm opacity-90 block">Level {hero.level}</span>
                {user?.id === hero.user_id && (
                  <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">Your Hero</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6">
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
                {handleDeleteHero && (
                  <button
                    onClick={() => handleDeleteHero(hero.id)}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-xs font-medium border border-red-200"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useHeroHealth } from '../hooks/useHeroHealth';

interface Hero {
  id: string;
  name: string;
  avatar_url?: string;
}

interface PartyHealthCardProps {
  heroes: Hero[];
}

export default function PartyHealthCard({ heroes }: PartyHealthCardProps) {
  const { getHearts, isHeroDead, toggleHeart } = useHeroHealth(heroes);

  if (heroes.length === 0) return null;
  
  console.log('PartyHealthCard heroes:', heroes.length, heroes.map(h => h.name));

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        minWidth: '150px',
        maxWidth: '200px',
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        zIndex: 1001,
        pointerEvents: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '6px 8px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '6px 6px 0 0',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#374151'
        }}
      >
        Party Health
      </div>
      
      {/* Content */}
      <div style={{ 
        padding: '8px',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px' 
      }}>
        {heroes.map(hero => {
          const hearts = getHearts(hero.id);
          const isDefeated = isHeroDead(hero.id);
          console.log(`${hero.name}: ${hearts} hearts, defeated: ${isDefeated}`);
          
          return (
            <div key={hero.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px',
              borderRadius: '8px',
              backgroundColor: isDefeated ? '#f3f4f6' : 'transparent'
            }}>
              {/* Hero Avatar */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#f3f4f6',
                filter: isDefeated ? 'grayscale(100%) opacity(0.5)' : 'none'
              }}>
                {hero.avatar_url ? (
                  <img
                    src={hero.avatar_url}
                    alt={hero.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    color: isDefeated ? '#9ca3af' : '#6b7280'
                  }}>
                    {hero.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Hero Name */}
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: isDefeated ? '#9ca3af' : '#374151',
                flex: 1
              }}>
                {hero.name}
              </div>
              
              {/* Hearts */}
              <div style={{
                display: 'flex',
                gap: '2px'
              }}>
                {[0, 1, 2].map(heartIndex => (
                  <button
                    key={heartIndex}
                    onClick={() => toggleHeart(hero.id, heartIndex)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '1px',
                      lineHeight: 1
                    }}
                    title={`${hero.name}: ${heartIndex < hearts ? 'Remove heart' : 'Add heart'}`}
                  >
                    {heartIndex < hearts ? '❤️' : '🤍'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
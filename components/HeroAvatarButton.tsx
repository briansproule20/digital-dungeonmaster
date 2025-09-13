'use client';

interface Hero {
  id: string;
  name: string;
  avatar_url?: string;
}

interface HeroAvatarButtonProps {
  hero: Hero;
  isDead: boolean;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function HeroAvatarButton({ 
  hero, 
  isDead, 
  isSelected = false, 
  onClick, 
  disabled = false 
}: HeroAvatarButtonProps) {
  const isDisabled = disabled || isDead;
  
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      title={isDead ? "Use a health potion to revive!" : `Chat with ${hero.name}`}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
        backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: isDead ? 'grayscale(100%) opacity(0.5)' : 'none',
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.6 : 1
      }}
      onMouseOver={(e) => {
        if (!isDisabled && !isSelected) {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.backgroundColor = '#f0f9ff';
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }
      }}
    >
      {hero.avatar_url ? (
        <img
          src={hero.avatar_url}
          alt={hero.name}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <span style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: isDead ? '#9ca3af' : '#6b7280'
        }}>
          {hero.name.charAt(0).toUpperCase()}
        </span>
      )}
    </button>
  );
}
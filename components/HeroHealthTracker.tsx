'use client';

import { useState, useEffect } from 'react';

interface Hero {
  id: string;
  name: string;
}

interface HeroHealthTrackerProps {
  hero: Hero;
  onHealthChange?: (hearts: number) => void;
}

export default function HeroHealthTracker({ hero, onHealthChange }: HeroHealthTrackerProps) {
  const [hearts, setHearts] = useState<number>(3); // 3 hearts max

  // Load heart data from localStorage
  useEffect(() => {
    const savedHearts = localStorage.getItem(`hero-hearts-${hero.id}`);
    if (savedHearts) {
      const heartCount = parseInt(savedHearts, 10);
      setHearts(heartCount);
      onHealthChange?.(heartCount);
    } else {
      onHealthChange?.(3); // Default to 3 hearts
    }
  }, [hero.id, onHealthChange]);

  // Save heart data to localStorage
  const updateHearts = (newHearts: number) => {
    const clampedHearts = Math.max(0, Math.min(3, newHearts));
    setHearts(clampedHearts);
    localStorage.setItem(`hero-hearts-${hero.id}`, clampedHearts.toString());
    onHealthChange?.(clampedHearts);
  };

  const toggleHeart = (heartIndex: number) => {
    // If clicking on a filled heart, remove it and all hearts to the right
    if (heartIndex < hearts) {
      updateHearts(heartIndex);
    } else {
      // If clicking on an empty heart, fill it and all hearts to the left
      updateHearts(heartIndex + 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      justifyContent: 'center',
      marginTop: '4px'
    }}>
      {[0, 1, 2].map((heartIndex) => (
        <button
          key={heartIndex}
          onClick={() => toggleHeart(heartIndex)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '1px',
            transition: 'transform 0.1s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title={`${hero.name}: ${heartIndex < hearts ? 'Click to remove heart' : 'Click to add heart'}`}
        >
          {heartIndex < hearts ? '❤️' : '🤍'}
        </button>
      ))}
    </div>
  );
}
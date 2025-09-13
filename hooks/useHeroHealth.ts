'use client';

import { useState, useEffect } from 'react';

export interface HeroHealthState {
  [heroId: string]: number;
}

// Global event emitter for health changes
const healthChangeListeners = new Set<() => void>();

const emitHealthChange = () => {
  healthChangeListeners.forEach(listener => listener());
};

const addHealthChangeListener = (listener: () => void): (() => void) => {
  healthChangeListeners.add(listener);
  return () => {
    healthChangeListeners.delete(listener);
  };
};

export function useHeroHealth(heroes: Array<{ id: string }>) {
  const [heroHearts, setHeroHearts] = useState<HeroHealthState>({});
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load hero hearts from localStorage
  const loadHeroHearts = () => {
    const newHeroHearts: HeroHealthState = {};
    heroes.forEach(hero => {
      const savedHearts = localStorage.getItem(`hero-hearts-${hero.id}`);
      newHeroHearts[hero.id] = savedHearts !== null ? parseInt(savedHearts, 10) : 3;
    });
    setHeroHearts(newHeroHearts);
  };

  useEffect(() => {
    loadHeroHearts();
  }, [heroes, forceUpdate]);

  // Listen for health changes from other instances
  useEffect(() => {
    const unsubscribe = addHealthChangeListener(() => {
      setForceUpdate(prev => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const updateHearts = (heroId: string, newHearts: number) => {
    const clampedHearts = Math.max(0, Math.min(3, newHearts));
    setHeroHearts(prev => ({
      ...prev,
      [heroId]: clampedHearts
    }));
    localStorage.setItem(`hero-hearts-${heroId}`, clampedHearts.toString());
    
    // Notify other instances
    emitHealthChange();
  };

  const getHearts = (heroId: string): number => {
    return heroHearts[heroId] ?? 3;
  };

  const isHeroDead = (heroId: string): boolean => {
    return getHearts(heroId) === 0;
  };

  const toggleHeart = (heroId: string, heartIndex: number) => {
    const currentHearts = getHearts(heroId);
    
    if (heartIndex < currentHearts) {
      // Clicking a filled heart - remove it and all hearts to the right
      updateHearts(heroId, heartIndex);
    } else {
      // Clicking an empty heart - fill it and all hearts to the left
      updateHearts(heroId, heartIndex + 1);
    }
  };

  return {
    heroHearts,
    updateHearts,
    getHearts,
    isHeroDead,
    toggleHeart
  };
}
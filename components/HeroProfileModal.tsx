'use client';

import { Hero } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface HeroProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: Hero;
}

export default function HeroProfileModal({ isOpen, onClose, hero }: HeroProfileModalProps) {
  const [gradientStyle, setGradientStyle] = useState({
    background: 'linear-gradient(to right, #2563eb, #9333ea)'
  });

  // Extract colors from avatar image
  useEffect(() => {
    if (!hero.avatar_url) {
      // Default gradient for heroes without avatars
      setGradientStyle({
        background: 'linear-gradient(to right, #4b5563, #1f2937)'
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample colors from different parts of the image
        const samples = [
          ctx.getImageData(img.width * 0.2, img.height * 0.2, 1, 1).data,
          ctx.getImageData(img.width * 0.8, img.height * 0.2, 1, 1).data,
          ctx.getImageData(img.width * 0.5, img.height * 0.8, 1, 1).data,
        ];

        // Convert to HSL and find dominant colors
        const colors = samples.map(([r, g, b]) => {
          // Convert RGB to HSL for better color manipulation
          const max = Math.max(r, g, b) / 255;
          const min = Math.min(r, g, b) / 255;
          const diff = max - min;
          const sum = max + min;
          const l = sum / 2;

          let h = 0;
          let s = 0;

          if (diff !== 0) {
            s = l > 0.5 ? diff / (2 - sum) : diff / sum;
            switch (max) {
              case r / 255: h = ((g - b) / 255) / diff + (g < b ? 6 : 0); break;
              case g / 255: h = ((b - r) / 255) / diff + 2; break;
              case b / 255: h = ((r - g) / 255) / diff + 4; break;
            }
            h /= 6;
          }

          return { h: h * 360, s: s * 100, l: Math.max(l * 100, 30) }; // Ensure minimum lightness
        });

        // Pick the most vibrant colors
        const sortedColors = colors.sort((a, b) => b.s - a.s);
        const color1 = sortedColors[0];
        const color2 = sortedColors[1] || { ...color1, h: (color1.h + 60) % 360 };

        // Ensure good contrast by adjusting lightness
        color1.l = Math.min(color1.l, 60);
        color2.l = Math.min(color2.l, 70);

        const color1Hsl = `hsl(${Math.round(color1.h)}, ${Math.round(color1.s)}%, ${Math.round(color1.l)}%)`;
        const color2Hsl = `hsl(${Math.round(color2.h)}, ${Math.round(color2.s)}%, ${Math.round(color2.l)}%)`;
        
        setGradientStyle({
          background: `linear-gradient(to right, ${color1Hsl}, ${color2Hsl})`
        });
      } catch (error) {
        console.error('Error extracting colors:', error);
        setGradientStyle({
          background: 'linear-gradient(to right, #2563eb, #9333ea)'
        });
      }
    };

    img.onerror = () => {
      setGradientStyle({
        background: 'linear-gradient(to right, #2563eb, #9333ea)'
      });
    };

    img.src = hero.avatar_url;
  }, [hero.avatar_url]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 text-white" style={gradientStyle}>
          <div className="flex items-center gap-4">
            {hero.avatar_url ? (
              <img
                src={hero.avatar_url}
                alt={hero.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white">
                <span className="text-3xl">⚔️</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-1">{hero.name}</h1>
              {(hero.race || hero.class || hero.level) && (
                <p className="text-xl opacity-90">
                  {hero.level && `Level ${hero.level} `}
                  {hero.race && `${hero.race} `}
                  {hero.class}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            
            {/* Description */}
            {hero.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Description
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {hero.description}
                  </p>
                </div>
              </div>
            )}

            {/* Backstory */}
            {hero.backstory && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Backstory
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {hero.backstory}
                  </p>
                </div>
              </div>
            )}

            {/* Personality Traits */}
            {hero.personality_traits && hero.personality_traits.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Personality Traits
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {hero.personality_traits.map((trait, index) => (
                      <span
                        key={index}
                        className="inline-block bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* System Prompt */}
            {hero.system_prompt && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Character Instructions
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                    {hero.system_prompt}
                  </p>
                </div>
              </div>
            )}

            {/* Character Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Character Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {hero.class && (
                    <div>
                      <dt className="font-medium text-gray-500">Class</dt>
                      <dd className="text-gray-900">{hero.class}</dd>
                    </div>
                  )}
                  {hero.race && (
                    <div>
                      <dt className="font-medium text-gray-500">Race</dt>
                      <dd className="text-gray-900">{hero.race}</dd>
                    </div>
                  )}
                  {hero.level && (
                    <div>
                      <dt className="font-medium text-gray-500">Level</dt>
                      <dd className="text-gray-900">{hero.level}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium text-gray-500">Created</dt>
                    <dd className="text-gray-900">{formatDate(hero.created_at)}</dd>
                  </div>
                  {hero.updated_at !== hero.created_at && (
                    <div>
                      <dt className="font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-gray-900">{formatDate(hero.updated_at)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

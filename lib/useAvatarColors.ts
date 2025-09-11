import { useState, useEffect } from 'react';

export interface AvatarColors {
  background: string;
}

export const useAvatarColors = (avatarUrl?: string): AvatarColors => {
  const [gradientStyle, setGradientStyle] = useState<AvatarColors>({
    background: 'linear-gradient(to right, #2563eb, #9333ea)'
  });

  useEffect(() => {
    console.log('useAvatarColors called with:', avatarUrl);
    if (!avatarUrl) {
      // Default gradient for heroes without avatars
      console.log('No avatar URL, using default gradient');
      setGradientStyle({
        background: 'linear-gradient(to right, #4b5563, #1f2937)'
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    console.log('Loading image:', avatarUrl);
    img.onload = () => {
      console.log('Image loaded successfully');
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample colors from 9 points across the image (3x3 grid)
        const samplePoints = [];
        for (let x = 0.2; x <= 0.8; x += 0.3) {
          for (let y = 0.2; y <= 0.8; y += 0.3) {
            samplePoints.push([Math.floor(img.width * x), Math.floor(img.height * y)]);
          }
        }
        
        const samples = samplePoints.map(([x, y]) => ctx.getImageData(x, y, 1, 1).data);

        // Convert to HSL and find dominant colors
        const colors = samples.map((data) => {
          const [r, g, b] = [data[0], data[1], data[2]];
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

          return { h: h * 360, s: s * 100, l: Math.max(l * 100, 30), r, g, b }; // Ensure minimum lightness
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

        console.log('Generated gradient:', `linear-gradient(135deg, ${color1Hsl}, ${color2Hsl})`);
        setGradientStyle({
          background: `linear-gradient(135deg, ${color1Hsl}, ${color2Hsl})`
        });

      } catch (error) {
        console.error('Error extracting colors:', error);
        // Fallback gradient
        setGradientStyle({
          background: 'linear-gradient(to right, #2563eb, #9333ea)'
        });
      }
    };

    img.onerror = (error) => {
      console.error('Failed to load avatar image for color extraction:', error);
      console.error('Image URL that failed:', avatarUrl);
      setGradientStyle({
        background: 'linear-gradient(to right, #2563eb, #9333ea)'
      });
    };

    img.src = avatarUrl;
  }, [avatarUrl]);

  return gradientStyle;
};

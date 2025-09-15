'use client';

import { useState, useEffect } from 'react';

interface Avatar {
  id: string;
  name: string;
  image_url: string;
  description: string;
  category: string;
  generated_at: string;
  prompt: string;
}

interface AvatarGeneratorProps {
  onAvatarSelect: (imageUrl: string) => void;
  characterName?: string;
  characterDescription?: string;
}

export default function AvatarGenerator({ onAvatarSelect, characterName, characterDescription }: AvatarGeneratorProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadAvatarsFromStorage();
  }, []);

  // Auto-populate prompt when character info changes
  useEffect(() => {
    if (characterName && characterDescription && !customPrompt) {
      setCustomPrompt(`${characterName} - ${characterDescription}`);
    }
  }, [characterName, characterDescription, customPrompt]);

  const loadAvatarsFromStorage = async () => {
    try {
      const request = indexedDB.open('AvatarDB', 1);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        setAvatars([]);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['avatars'], 'readonly');
        const store = transaction.objectStore('avatars');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const avatars = getAllRequest.result || [];

          // Fix any avatars that might have been stored with object image_urls
          const fixedAvatars = avatars.map((avatar: Avatar) => {
            if (avatar.image_url && typeof avatar.image_url === 'object' && avatar.image_url !== null) {
              const imageObj = avatar.image_url as any;
              if (imageObj.base64Data) {
                const dataUrl = `data:${imageObj.mediaType || 'image/png'};base64,${imageObj.base64Data}`;
                return { ...avatar, image_url: dataUrl };
              }
            }
            return avatar;
          });

          setAvatars(fixedAvatars);
        };

        getAllRequest.onerror = () => {
          console.error('Failed to load avatars from IndexedDB');
          setAvatars([]);
        };
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('avatars')) {
          db.createObjectStore('avatars', { keyPath: 'id' });
        }
      };
    } catch (error) {
      console.error('Error loading avatars from IndexedDB:', error);
      setAvatars([]);
    }
  };

  const saveAvatarsToStorage = async (avatarList: Avatar[]) => {
    try {
      const request = indexedDB.open('AvatarDB', 1);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['avatars'], 'readwrite');
        const store = transaction.objectStore('avatars');

        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          avatarList.forEach((avatar) => {
            store.add(avatar);
          });
        };
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('avatars')) {
          db.createObjectStore('avatars', { keyPath: 'id' });
        }
      };
    } catch (error) {
      console.error('Error saving avatars to IndexedDB:', error);
    }
  };

  const generateAvatar = async () => {
    if (!customPrompt.trim()) {
      alert('Please enter a prompt to generate an avatar');
      return;
    }

    setIsGenerating(true);
    try {
      const avatarId = Math.random().toString(36).substr(2, 9);

      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate avatar: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      // Handle different possible response structures
      let imageUrl;

      if (data.imageUrl) {
        if (typeof data.imageUrl === 'object') {
          if (data.imageUrl.base64Data) {
            imageUrl = `data:${data.imageUrl.mediaType || 'image/png'};base64,${data.imageUrl.base64Data}`;
          } else if (data.imageUrl.url) {
            imageUrl = data.imageUrl.url;
          } else {
            throw new Error('Invalid image object format returned from API');
          }
        } else if (typeof data.imageUrl === 'string') {
          imageUrl = data.imageUrl;
        }
      } else if (data.image && data.image.base64Data) {
        imageUrl = `data:${data.image.mediaType || 'image/png'};base64,${data.image.base64Data}`;
      } else if (data.image && typeof data.image === 'string') {
        imageUrl = data.image;
      } else {
        throw new Error('No valid image data returned from API');
      }

      const newAvatar: Avatar = {
        id: avatarId,
        name: characterName || 'Generated Avatar',
        image_url: imageUrl,
        description: customPrompt,
        category: 'custom',
        generated_at: new Date().toISOString(),
        prompt: customPrompt
      };

      const updatedAvatars = [...avatars, newAvatar];
      setAvatars(updatedAvatars);
      saveAvatarsToStorage(updatedAvatars);

      // Auto-expand to show the new avatar
      setIsExpanded(true);
    } catch (error) {
      console.error('Error generating avatar:', error);
      alert('Failed to generate avatar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAvatar = (avatarId: string) => {
    const updatedAvatars = avatars.filter(avatar => avatar.id !== avatarId);
    setAvatars(updatedAvatars);
    saveAvatarsToStorage(updatedAvatars);
  };

  const selectAvatar = (avatar: Avatar) => {
    onAvatarSelect(avatar.image_url);
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Avatar Generator</h3>

      {/* Generation Input */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar Description
          </label>
          <input
            type="text"
            placeholder="Describe your character's appearance..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateAvatar}
            disabled={isGenerating || !customPrompt.trim()}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            {isGenerating ? 'Generating...' : 'Generate Avatar'}
          </button>

          {avatars.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
            >
              {isExpanded ? 'Hide' : 'Show'} Library ({avatars.length})
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Generating your avatar...</p>
        </div>
      )}

      {/* Avatar Library */}
      {isExpanded && !isGenerating && avatars.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Your Generated Avatars</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6 max-h-96 overflow-y-auto px-2">
            {avatars.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center min-w-0">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors mb-2 flex-shrink-0"
                  onClick={() => selectAvatar(avatar)}
                >
                  <img
                    src={avatar.image_url}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={() => selectAvatar(avatar)}
                    className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded text-xs flex items-center justify-center flex-shrink-0"
                  >
                    +
                  </button>
                  <button
                    onClick={() => deleteAvatar(avatar.id)}
                    className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center justify-center flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Avatars State */}
      {isExpanded && !isGenerating && avatars.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No avatars generated yet. Create your first one above!</p>
        </div>
      )}
    </div>
  );
}
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

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    loadAvatarsFromStorage();
  }, []);

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
                // Convert old object format to data URL
                const dataUrl = `data:${imageObj.mediaType || 'image/png'};base64,${imageObj.base64Data}`;
                return { ...avatar, image_url: dataUrl };
              }
            }
            return avatar;
          });
          
          setAvatars(fixedAvatars);
          console.log(`Loaded ${fixedAvatars.length} avatars from IndexedDB`);
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
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB for saving');
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['avatars'], 'readwrite');
        const store = transaction.objectStore('avatars');
        
        // Clear existing data and save new avatars
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          // Save all avatars
          avatarList.forEach((avatar, index) => {
            const addRequest = store.add(avatar);
            addRequest.onerror = () => {
              console.error(`Failed to save avatar ${index}:`, avatar);
            };
          });
          
          transaction.oncomplete = () => {
            console.log(`Successfully saved ${avatarList.length} avatars to IndexedDB`);
          };
          
          transaction.onerror = () => {
            console.error('Transaction failed:', transaction.error);
          };
        };
        
        clearRequest.onerror = () => {
          console.error('Failed to clear existing avatars');
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

  const generateAvatar = async (prompt?: string) => {
    setIsGenerating(true);
    try {
      const avatarId = Math.random().toString(36).substr(2, 9);
      const categories = ['fantasy', 'sci-fi', 'modern', 'medieval', 'mystical'];
      const names = ['Aria', 'Zephyr', 'Luna', 'Phoenix', 'Orion', 'Sage', 'Nova', 'Kai', 'Raven', 'Storm'];
      const descriptions = [
        'A mysterious figure with ancient wisdom',
        'A brave warrior ready for adventure',
        'A wise mage with magical powers',
        'A stealthy rogue from the shadows',
        'A noble knight in shining armor',
        'A wild barbarian from distant lands',
        'A cunning bard with tales to tell',
        'A divine cleric with healing powers',
        'A nature-loving druid',
        'A mechanical artificer'
      ];

      let finalPrompt = prompt || customPrompt;
      let category = 'fantasy';
      let name = names[Math.floor(Math.random() * names.length)];
      let description = descriptions[Math.floor(Math.random() * descriptions.length)];

      if (!finalPrompt) {
        throw new Error('Please enter a prompt to generate an avatar');
      }
      
      category = 'custom';

      // Call your avatar generation API
      console.log('Generating avatar with prompt:', finalPrompt);
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error(`Failed to generate avatar: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      console.log('API response data type:', typeof data);
      console.log('data.imageUrl type:', typeof data.imageUrl);
      console.log('data.imageUrl value:', data.imageUrl);
      console.log('data.imageUrl keys:', data.imageUrl ? Object.keys(data.imageUrl) : 'no keys');
      console.log('data.imageUrl.base64Data:', data.imageUrl?.base64Data ? 'exists' : 'missing');
      console.log('data.imageUrl.mediaType:', data.imageUrl?.mediaType);
      
      // Handle different possible response structures
      let imageUrl;
      
      if (data.imageUrl) {
        // Check if imageUrl is an object with base64 data
        if (typeof data.imageUrl === 'object') {
          console.log('Processing imageUrl object:', data.imageUrl);
          if (data.imageUrl.base64Data) {
            imageUrl = `data:${data.imageUrl.mediaType || 'image/png'};base64,${data.imageUrl.base64Data}`;
          } else if (data.imageUrl.url) {
            imageUrl = data.imageUrl.url;
          } else {
            console.error('Object has no base64Data or url:', data.imageUrl);
            throw new Error('Invalid image object format returned from API');
          }
        } else if (typeof data.imageUrl === 'string') {
          imageUrl = data.imageUrl;
        } else {
          console.error('Unexpected imageUrl format:', data.imageUrl);
          throw new Error('Invalid image URL format returned from API');
        }
      } else if (data.image && data.image.base64Data) {
        // Base64 data - convert to data URL
        imageUrl = `data:${data.image.mediaType || 'image/png'};base64,${data.image.base64Data}`;
      } else if (data.image && typeof data.image === 'string') {
        // Assume it's a URL string
        imageUrl = data.image;
      } else {
        console.error('No valid image data in response:', data);
        throw new Error('No valid image data returned from API');
      }
      
      console.log('Final image URL:', imageUrl);
      
      const newAvatar: Avatar = {
        id: avatarId,
        name: name,
        image_url: imageUrl, // This is now a proper data URL or regular URL
        description: description,
        category: category,
        generated_at: new Date().toISOString(),
        prompt: finalPrompt
      };

      const updatedAvatars = [...avatars, newAvatar];
      setAvatars(updatedAvatars);
      saveAvatarsToStorage(updatedAvatars);
      
      console.log('Avatar saved with image_url:', newAvatar.image_url);
      setCustomPrompt('');
      setShowCustomPrompt(false);
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

  const downloadAvatar = (avatar: Avatar) => {
    const link = document.createElement('a');
    link.href = avatar.image_url;
    link.download = `${avatar.name}-${avatar.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Avatar Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Generate unique character avatars for your heroes. Download the images and attach them to your heroes in the Heroes section.
          </p>
          
          {/* Generation Input */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="A fantasy warrior"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => generateAvatar(customPrompt)}
              disabled={isGenerating || !customPrompt.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium"
            >
              {isGenerating ? 'Generating...' : 'Generate Avatar'}
            </button>
          </div>
        </div>



        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Generating your avatar...</p>
          </div>
        )}

        {/* Avatar Grid */}
        {!isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img
                    src={avatar.image_url}
                    alt={avatar.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onLoad={() => console.log('Image loaded successfully:', avatar.image_url)}
                    onError={(e) => {
                      console.error('Image failed to load:', avatar.image_url);
                      console.error('Image src type:', typeof avatar.image_url);
                      console.error('Image src length:', avatar.image_url?.length);
                      // Don't use fallback - let the error show so we can debug
                    }}
                  />
                </div>
                <div className="mb-3 h-12">
                  <p className="text-xs text-gray-600 mb-2 line-clamp-3 overflow-hidden">{avatar.prompt}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => deleteAvatar(avatar.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => downloadAvatar(avatar)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isGenerating && avatars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No avatars found. Enter a prompt above to generate your first avatar!</p>
          </div>
        )}
      </div>

      {/* Avatar Modal */}
      {selectedAvatar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAvatar(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Avatar Details</h3>
                <button
                  onClick={() => setSelectedAvatar(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Large Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={selectedAvatar.image_url}
                      alt={selectedAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Avatar Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Prompt</h4>
                    <p className="text-gray-900">{selectedAvatar.prompt}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Generated</h4>
                    <p className="text-gray-600">
                      {new Date(selectedAvatar.generated_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Category</h4>
                    <p className="text-gray-600 capitalize">{selectedAvatar.category}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => downloadAvatar(selectedAvatar)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => {
                        deleteAvatar(selectedAvatar.id);
                        setSelectedAvatar(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
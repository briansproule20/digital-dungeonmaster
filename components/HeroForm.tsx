'use client';

import { useState } from 'react';
import { CreateHeroInput } from '../lib/supabase';
import { uploadAvatarImage, UploadResult } from '../lib/uploadAvatar';
import { useEcho } from '../echo';

interface HeroFormProps {
  onSubmit: (heroData: CreateHeroInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateHeroInput>;
}

export default function HeroForm({ onSubmit, onCancel, isLoading = false, initialData }: HeroFormProps) {
  const echoClient = useEcho();
  const [formData, setFormData] = useState<CreateHeroInput>({
    name: initialData?.name || '',
    description: initialData?.description || '', // Will be auto-generated if empty
    system_prompt: initialData?.system_prompt || '', // Will be auto-generated if empty
    class: initialData?.class || '',
    race: initialData?.race || '',
    level: initialData?.level || 1,
    alignment: initialData?.alignment || '',
    appearance: initialData?.appearance || '',
    backstory: initialData?.backstory || '',
    personality_traits: initialData?.personality_traits || [],
    avatar_url: initialData?.avatar_url || ''
  });

  const [newTrait, setNewTrait] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingSystemPrompt, setIsGeneratingSystemPrompt] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [showPromptBox, setShowPromptBox] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  
  // Avatar upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate description and system_prompt if they're missing
    let finalFormData = { ...formData };

    if (!formData.description || !formData.system_prompt) {
      try {
        const response = await fetch('/api/generate-hero-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroData: formData })
        });

        if (response.ok) {
          const generated = await response.json();
          finalFormData = {
            ...formData,
            description: generated.description,
            system_prompt: generated.system_prompt
          };
        } else {
          // Fallback if generation fails
          finalFormData = {
            ...formData,
            description: formData.description || `${formData.name} is a ${formData.race || ''} ${formData.class || 'character'}.`,
            system_prompt: formData.system_prompt || `You are ${formData.name}. ${formData.backstory || 'You are a D&D character.'} Stay in character at all times.`
          };
        }
      } catch (error) {
        console.error('Failed to generate character details:', error);
        // Use fallback data
        finalFormData = {
          ...formData,
          description: formData.description || `${formData.name} is a ${formData.race || ''} ${formData.class || 'character'}.`,
          system_prompt: formData.system_prompt || `You are ${formData.name}. ${formData.backstory || 'You are a D&D character.'} Stay in character at all times.`
        };
      }
    }

    onSubmit(finalFormData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Get user info for upload path
      const userInfo = await echoClient.users.getUserInfo();
      const result: UploadResult = await uploadAvatarImage(file, userInfo.id);

      if (result.success && result.url) {
        // Update form data and preview
        setFormData({ ...formData, avatar_url: result.url });
        setAvatarPreview(result.url);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, avatar_url: url });
    setAvatarPreview(url || null);
    setUploadError(null);
  };

  const clearAvatar = () => {
    setFormData({ ...formData, avatar_url: '' });
    setAvatarPreview(null);
    setUploadError(null);
  };

  const addPersonalityTrait = () => {
    if (newTrait.trim() && !formData.personality_traits?.includes(newTrait.trim())) {
      setFormData({
        ...formData,
        personality_traits: [...(formData.personality_traits || []), newTrait.trim()]
      });
      setNewTrait('');
    }
  };

  const removePersonalityTrait = (index: number) => {
    setFormData({
      ...formData,
      personality_traits: formData.personality_traits?.filter((_, i) => i !== index) || []
    });
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterData: formData
        })
      });

      if (response.ok) {
        const generatedDescription = await response.text();
        setFormData({
          ...formData,
          description: generatedDescription
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to generate description:', errorText);
        alert('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateSystemPrompt = async () => {
    setIsGeneratingSystemPrompt(true);
    try {
      const response = await fetch('/api/generate-system-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterData: formData
        })
      });

      if (response.ok) {
        const generatedPrompt = await response.text();
        setFormData({
          ...formData,
          system_prompt: generatedPrompt
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to generate system prompt:', errorText);
        alert('Failed to generate system prompt. Please try again.');
      }
    } catch (error) {
      console.error('Error generating system prompt:', error);
      alert('Failed to generate system prompt. Please try again.');
    } finally {
      setIsGeneratingSystemPrompt(false);
    }
  };

  const generateBackstory = async () => {
    setIsGeneratingBackstory(true);
    try {
      const response = await fetch('/api/generate-backstory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterData: formData
        })
      });

      if (response.ok) {
        const generatedBackstory = await response.text();
        setFormData({
          ...formData,
          backstory: generatedBackstory
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to generate backstory:', errorText);
        alert('Failed to generate backstory. Please try again.');
      }
    } catch (error) {
      console.error('Error generating backstory:', error);
      alert('Failed to generate backstory. Please try again.');
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  const generateRandomCharacter = async (usePrompt = false) => {
    if (!confirm('This will replace all current character data with a randomly generated character. Continue?')) {
      return;
    }

    setIsGeneratingRandom(true);
    try {
      const response = await fetch('/api/generate-random-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: usePrompt ? userPrompt : null
        })
      });

      if (response.ok) {
        const randomCharacter = await response.json();
        setFormData({
          name: randomCharacter.name || '',
          description: randomCharacter.description || '',
          system_prompt: randomCharacter.system_prompt || '',
          class: randomCharacter.class || '',
          race: randomCharacter.race || '',
          level: randomCharacter.level || 1,
          alignment: randomCharacter.alignment || '',
          appearance: randomCharacter.appearance || '',
          backstory: randomCharacter.backstory || '',
          personality_traits: randomCharacter.personality_traits || [],
          avatar_url: formData.avatar_url // Keep existing avatar URL if any
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to generate random character:', errorText);
        alert('Failed to generate random character. Please try again.');
      }
    } catch (error) {
      console.error('Error generating random character:', error);
      alert('Failed to generate random character. Please try again.');
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? 'Edit Hero' : 'Create New Hero'}
              </h2>
              
              {!initialData && (
                <button
                  type="button"
                  onClick={() => generateRandomCharacter(false)}
                  disabled={isGeneratingRandom || isLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isGeneratingRandom ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      Random Character
                    </>
                  )}
                </button>
              )}
            </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter hero name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Fighter, Wizard, Rogue, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Race
            </label>
            <input
              type="text"
              value={formData.race}
              onChange={(e) => setFormData({ ...formData, race: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Human, Elf, Dwarf, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <select
              value={formData.alignment}
              onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Select alignment</option>
              <option value="Lawful Good">Lawful Good</option>
              <option value="Neutral Good">Neutral Good</option>
              <option value="Chaotic Good">Chaotic Good</option>
              <option value="Lawful Neutral">Lawful Neutral</option>
              <option value="True Neutral">True Neutral</option>
              <option value="Chaotic Neutral">Chaotic Neutral</option>
              <option value="Lawful Evil">Lawful Evil</option>
              <option value="Neutral Evil">Neutral Evil</option>
              <option value="Chaotic Evil">Chaotic Evil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appearance
            </label>
            <input
              type="text"
              value={formData.appearance}
              onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Physical description, height, build, etc."
            />
          </div>
        </div>


        {/* Backstory */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Backstory *
            </label>
            <button
              type="button"
              onClick={generateBackstory}
              disabled={isGeneratingBackstory || !formData.name}
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingBackstory ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </div>
          <textarea
            required
            rows={4}
            value={formData.backstory}
            onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Tell the story of your hero's background and history"
          />
          {!formData.name && (
            <p className="text-xs text-gray-500 mt-1">
              Enter a character name to enable AI backstory generation
            </p>
          )}
        </div>

        {/* Personality Traits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personality Traits
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPersonalityTrait())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Add a personality trait"
            />
            <button
              type="button"
              onClick={addPersonalityTrait}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.personality_traits?.map((trait, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {trait}
                <button
                  type="button"
                  onClick={() => removePersonalityTrait(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Avatar (optional)
          </label>
          
          {/* Avatar Preview */}
          {avatarPreview && (
            <div className="mb-4 flex items-center gap-4">
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={clearAvatar}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove Avatar
              </button>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{uploadError}</p>
            </div>
          )}

          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isUploading && (
                <p className="text-sm text-blue-600 mt-1">Uploading...</p>
              )}
            </div>

            {/* OR Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500 bg-white">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={isUploading || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Hero' : 'Create Hero')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
          </div>
        </div>

        {/* AI Generation Sidebar */}
        {!initialData && (
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Character Generator
                </h3>
                <p className="text-sm text-gray-600">
                  Let AI create a character based on your ideas
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Character Ideas & Inspiration
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Describe your character ideas... e.g., 'A gruff dwarf blacksmith who lost their family to dragons' or 'An elegant elf wizard obsessed with ancient magic'"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The AI will expand your ideas into a complete character
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => generateRandomCharacter(true)}
                  disabled={isGeneratingRandom || isLoading || !userPrompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isGeneratingRandom ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Character...
                    </>
                  ) : (
                    'Generate from Ideas'
                  )}
                </button>

                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-500">or</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Use the "Random Character" button above for completely random generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
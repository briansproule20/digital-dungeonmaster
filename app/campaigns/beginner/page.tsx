'use client';

import React, { useState, useEffect } from 'react';

interface Hero {
  id: string;
  name: string;
  class?: string;
  race?: string;
  level?: number;
  avatar_url?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  preview: string;
  path: string;
}

export default function BeginnerCampaigns() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [userParty, setUserParty] = useState<Hero[]>([]);
  const [hasActiveCampaign, setHasActiveCampaign] = useState(false);

  const campaigns: Campaign[] = [
    {
      id: 'proof-of-concept',
      name: 'Proof of Concept',
      description: 'Our proof of concept campaign designed to test and demonstrate core features.',
      duration: '5-10 mins',
      difficulty: 'Beginner',
      preview: 'Experience a thrilling space adventure aboard a mysterious starship. Navigate through different areas, make crucial decisions, and face the ultimate challenge in this introductory campaign.',
      path: '/campaigns/beginner/proof-of-concept'
    }
  ];

  // Check for active campaign data
  const checkForActiveCampaign = () => {
    const campaignChat = localStorage.getItem('campaignChat');
    if (campaignChat) {
      try {
        const parsedChat = JSON.parse(campaignChat);
        // Check if there's any saved chat data for any area
        const hasData = Object.keys(parsedChat).some(key => 
          key !== 'lastUpdated' && parsedChat[key] && parsedChat[key].length > 0
        );
        setHasActiveCampaign(hasData);
      } catch (error) {
        console.error('Failed to parse campaign chat:', error);
        setHasActiveCampaign(false);
      }
    } else {
      setHasActiveCampaign(false);
    }
  };

  // Load user's party from localStorage and check for active campaign
  useEffect(() => {
    const savedParty = localStorage.getItem('myParty');
    if (savedParty) {
      try {
        const party = JSON.parse(savedParty);
        setUserParty(party);
      } catch (error) {
        console.error('Failed to parse saved party:', error);
      }
    }
    
    checkForActiveCampaign();
  }, []);

  const openModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
  };

  const startCampaign = () => {
    if (selectedCampaign) {
      // Clear any existing campaign data for fresh start
      localStorage.removeItem('campaignChat');
      
      // Navigate to campaign
      window.location.href = selectedCampaign.path;
    }
  };

  const resumeCampaign = () => {
    // Resume the proof of concept campaign (the only one with save data)
    window.location.href = '/campaigns/beginner/proof-of-concept';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Beginner Campaigns
          </h1>
          <p className="text-lg text-gray-600">
            Easy Adventures for New Players
          </p>
          
          {/* Resume Campaign Button */}
          {hasActiveCampaign && (
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm mb-3">
                  <strong>Campaign in Progress!</strong> You have an active campaign with saved progress.
                </p>
                <button 
                  onClick={resumeCampaign}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                >
                  Resume Campaign
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {campaign.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {campaign.description}
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                  {campaign.difficulty}
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {campaign.duration}
                </span>
              </div>
              <button 
                onClick={() => openModal(campaign)}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
              >
                Start Campaign
              </button>
            </div>
          ))}
        </div>
        
      </div>

      {/* Campaign Preview Modal */}
      {showModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Campaign Info */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCampaign.difficulty}
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCampaign.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Preview</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{selectedCampaign.preview}</p>
                
                {/* Campaign Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Campaign Path</h4>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                    <span className="bg-blue-100 px-2 py-1 rounded">Start</span>
                    <span>→</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Explore</span>
                    <span>→</span>
                    <span className="bg-yellow-100 px-2 py-1 rounded">Recap</span>
                    <span>→</span>
                    <span className="bg-red-100 px-2 py-1 rounded">Boss</span>
                  </div>
                </div>
              </div>

              {/* Your Party */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Party ({userParty.length}/3)</h3>
                  <a 
                    href="/my-party"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit Party
                  </a>
                </div>
                {userParty.length > 0 ? (
                  <div className="flex justify-center space-x-4">
                    {userParty.map((hero) => (
                      <div key={hero.id} className="text-center">
                        {hero.avatar_url && (
                          <img 
                            src={hero.avatar_url} 
                            alt={hero.name}
                            className="w-12 h-12 rounded-full object-cover mx-auto mb-1"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-800">{hero.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>No heroes in your party!</strong> Visit the{' '}
                      <a href="/my-party" className="underline hover:text-yellow-900">
                        My Party
                      </a>{' '}
                      page to add heroes before starting the campaign.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={startCampaign}
                disabled={userParty.length === 0}
                className={`px-6 py-2 font-semibold rounded transition duration-200 ${
                  userParty.length === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Begin Adventure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

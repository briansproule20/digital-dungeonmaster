'use client';

import React from 'react';

export default function BeginnerCampaigns() {
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
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Proof of Concept
            </h3>
            <p className="text-gray-600 mb-4">
              Our proof of concept campaign designed to test and demonstrate core features.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                Beginner
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                2-3 hours
              </span>
            </div>
            <a 
              href="/campaigns/beginner/proof-of-concept" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Start Campaign
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
}

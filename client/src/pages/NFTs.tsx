import React from 'react';
import { sampleNFTBadges } from '../data/sampleData';

export default function NFTs() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">TimeProof NFTs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleNFTBadges.map(nft => (
            <div key={nft.id} className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow flex flex-col gap-2 border border-blue-200 dark:border-gray-700">
              <div className="font-bold text-lg">{nft.title}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm">{nft.description}</div>
              <div className="text-yellow-500 font-semibold">{nft.rarity}</div>
              <div className="text-xs text-gray-400">Earned: {nft.earnedDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import { sampleRewards } from '../data/sampleData';

export default function Rewards() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleRewards.map(reward => (
            <div key={reward.id} className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow flex flex-col gap-2 border border-blue-200 dark:border-gray-700">
              <img src={reward.image} alt={reward.title} className="w-20 h-20 object-contain mb-2" />
              <div className="font-bold text-lg">{reward.title}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm">{reward.description}</div>
              <div className="text-blue-600 dark:text-blue-300 font-semibold">{reward.creditsRequired} credits</div>
              <button className="mt-2 px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-all">Redeem</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
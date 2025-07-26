import React from 'react';
import { sampleUsers } from '../data/sampleData';

export default function Trust() {
  const user = sampleUsers[0];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Trust Score</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl font-extrabold text-blue-500 dark:text-purple-400">{user.trustScore}%</div>
          <div className="text-lg text-gray-700 dark:text-gray-200">Emotional Trust Score</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full" style={{ width: `${user.trustScore}%` }}></div>
          </div>
          <div className="text-gray-500 dark:text-gray-300 mt-4">Feedback: <span className="italic">"Consistently delivers on time and communicates with empathy."</span></div>
        </div>
      </div>
    </div>
  );
} 
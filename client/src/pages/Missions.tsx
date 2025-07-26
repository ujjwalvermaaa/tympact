import React from 'react';
import { sampleMissions } from '../data/sampleData';

export default function Missions() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Missions</h2>
        <div className="space-y-6">
          {sampleMissions.map(mission => (
            <div key={mission.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 shadow flex flex-col gap-2 border border-blue-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">{mission.title}</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">{mission.description}</div>
                </div>
                <span className="text-blue-600 dark:text-blue-300 font-semibold">{mission.xpReward} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${mission.progress}%` }}></div>
              </div>
              <div className="text-xs text-gray-400">{mission.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { sampleLeaderboard } from '../data/sampleData';

export default function Leaderboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Leaderboard</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Rank</th>
              <th className="py-2">User</th>
              <th className="py-2">XP</th>
              <th className="py-2">Trust</th>
            </tr>
          </thead>
          <tbody>
            {sampleLeaderboard.map((user, i) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 font-bold">#{i + 1}</td>
                <td className="py-2 flex items-center gap-2">
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  <span>{user.name}</span>
                </td>
                <td className="py-2">{user.xpPoints}</td>
                <td className="py-2">{user.trustScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
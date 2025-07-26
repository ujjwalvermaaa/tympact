import React from 'react';
import { sampleJournalEntries } from '../data/sampleData';

export default function FocusJournal() {
  const latest = sampleJournalEntries[0];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">Focus Journal</h2>
        <div className="mb-4">
          <div className="text-lg font-semibold">Latest Entry: {latest.date}</div>
          <div className="text-gray-500 dark:text-gray-300 text-sm">Focus Score: <span className="font-bold text-blue-500">{latest.focusScore}%</span></div>
          <div className="text-gray-500 dark:text-gray-300 text-sm">Productivity: <span className="font-bold text-pink-500">{latest.productivity}%</span></div>
          <div className="text-gray-500 dark:text-gray-300 text-sm">Emotion: <span className="font-bold text-purple-500">{latest.emotion}</span></div>
          <div className="text-gray-500 dark:text-gray-300 text-sm mt-2 italic">"{latest.activity}"</div>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl shadow">
          <div className="font-bold mb-2">AI Productivity Suggestion</div>
          <div className="text-gray-700 dark:text-gray-200">Keep up the great work! Try to maintain your focus streak by taking short breaks and reflecting on your daily wins. Consider setting a new goal for tomorrow to boost your productivity even further.</div>
        </div>
      </div>
    </div>
  );
} 
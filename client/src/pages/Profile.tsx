import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(user || {
    name: 'Ravi Verma',
    skills: ['Frontend Intern', 'Mentor', 'NGO Volunteer'],
    timeBalance: 12,
    rating: 4.8,
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleSave = () => {
    if (profileData) {
      updateUser(profileData);
    }
    setEditing(false);
  };

  const handleSkillAdd = () => {
    if (newSkill && profileData && !profileData.skills.includes(newSkill)) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill] });
    }
    setNewSkill('');
  };

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-lg flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">My Profile</h2>
        
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Name:</label>
          {editing ? (
            <input 
              className="px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={profileData.name}
              onChange={e => setProfileData({ ...profileData, name: e.target.value })}
            />
          ) : (
            <span className="text-lg text-gray-800 dark:text-gray-100">{profileData.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Skills:</label>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold shadow text-sm">{skill}</span>
            ))}
            {editing && (
              <div className="flex gap-2 mt-2">
                <input 
                  className="px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold" onClick={handleSkillAdd}>Add</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Time Balance</p>
            <p className="text-2xl font-bold text-tympactBlue dark:text-tympactPurple">{profileData.timeBalance} hours</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Community Rating</p>
            <p className="text-2xl font-bold text-yellow-500">⭐ {profileData.rating.toFixed(1)}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {editing ? (
            <button className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg transition-colors" onClick={handleSave}>Save Changes</button>
          ) : (
            <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold text-lg transition-colors" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
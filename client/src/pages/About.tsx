import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Ravi Verma', role: 'Founder & CEO' },
  { name: 'Anjali Gupta', role: 'Lead Developer' },
  { name: 'Neha Rathi', role: 'Product Designer' },
];

interface AboutPageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-gray-800 dark:text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">About Tympact</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Tympact is an Indian platform built by a passionate team dedicated to creating a new time economy for India. We believe in the power of community, skill exchange, and emotional intelligence to drive positive change.
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our mission is to empower Indians from all walks of life by creating a decentralized ecosystem for skill exchange, mentorship, and collaboration. We believe every Indian has unique talents to offer, and by connecting people, we can unlock collective potential and drive meaningful impact. Tympact is more than a platform; it's a movement to redefine value and work in India.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <Users className="w-16 h-16 mx-auto text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

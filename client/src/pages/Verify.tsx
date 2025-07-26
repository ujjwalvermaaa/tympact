import React from "react";
import { motion } from "framer-motion";

const Verify: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6 text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">Verify Your Account</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Please check your email or phone for a verification link or OTP.</p>
        <input
          type="text"
          placeholder="Enter OTP or click link in email"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white mb-4"
        />
        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
          Verify
        </button>
      </motion.div>
    </div>
  );
};

export default Verify; 
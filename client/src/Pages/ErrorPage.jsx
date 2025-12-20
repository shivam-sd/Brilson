import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-[#0c0f14] to-black px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex justify-center mb-8"
        >
          <AlertTriangle className="w-20 h-20 text-red-500 drop-shadow-lg" />
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-7xl sm:text-8xl font-extrabold text-white"
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 mt-4 text-lg sm:text-xl max-w-lg mx-auto"
        >
          The page you're looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/"
            className="inline-block mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg hover:scale-105 duration-300"
          >
            Go Back Home →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;

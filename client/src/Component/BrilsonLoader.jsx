import React from "react";
import { motion } from "framer-motion";
import { RiVerifiedBadgeLine } from "react-icons/ri";

const BrilsonLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Ambient Glow */}
      <div className="absolute w-[280px] h-[180px] bg-gradient-to-r from-yellow-400/40 via-orange-500/30 to-red-500/40 blur-3xl opacity-60 animate-pulse" />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative
          w-[320px]
          h-[200px]
          rounded-3xl
          border border-white/20
          bg-white/5
          backdrop-blur-xl
          shadow-[0_25px_80px_rgba(255,180,60,0.35)]
          p-5
          overflow-hidden
        "
      >
        {/* Moving shine */}
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Top Row */}
        <div className="relative flex justify-between items-center">
          <div className="text-white text-xl font-semibold tracking-wide">
            Brilson
          </div>

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-300 flex items-center justify-center"
          >
            <RiVerifiedBadgeLine className="text-yellow-400 text-xl" />
          </motion.div>
        </div>

        {/* Center */}
        <div className="mt-8 text-center">
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-sm tracking-widest text-gray-300"
          >
            NFC SMART CARD
          </motion.p>

          <motion.div
            animate={{ width: ["20%", "80%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto mt-3 h-[2px] bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full"
          />
        </div>

        {/* Bottom */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between text-xs text-gray-400">
          <span>Secure</span>
          <span>Premium</span>
        </div>
      </motion.div>
    </div>
  );
};

export default BrilsonLoader;

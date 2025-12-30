import React from "react";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { motion } from "framer-motion";

const CardUI = () => {
  return (
    <div className="w-full flex items-center justify-center my-10">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, -12, 0], 
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 0.6,
          },
        }}
        className="
          relative w-[25rem] sm:w-[28rem] min-h-[16rem]
          rounded-3xl p-6
          
          border border-white/30
          shadow-[0_0_40px_rgba(34,211,238,0.35)]
          backdrop-blur-xl
          overflow-hidden
        "
      >

        {/* Glow */}
        <div className="absolute inset-0 lg:bg-cyan-400/30 bg-cyan-400/80 blur-3xl opacity-40"></div>

        {/* Header Icons */}
        <div className="relative flex justify-between items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/40 border border-cyan-400 flex items-center justify-center">
            <img
              src="https://img.freepik.com/premium-vector/smart-card-vector-outline-icon-design-illustration-symbol-white-background-eps-10-file_848977-2875.jpg"
              alt=""
              className="w-10 h-10 object-contain rounded-xl"
            />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-cyan-400 border border-cyan-400 flex items-center justify-center">
            <img
              src="https://static.thenounproject.com/png/1119914-200.png"
              alt=""
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="relative mt-8 text-left px-10">
          <p className="text-3xl font-bold text-white tracking-wide">
            John Deo
          </p>
          <span className="text-gray-400 text-sm">
            Product Designer
          </span>
        </div>

        {/* Footer */}
        <div className="relative mt-10 flex justify-between items-center text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <RiVerifiedBadgeLine className="text-yellow-400 text-lg" />
            NFC Enabled
          </div>
          <span className="text-cyan-300 font-medium">
            brilson.me/johndeo
          </span>
        </div>

      </motion.div>
    </div>
  );
};

export default CardUI;

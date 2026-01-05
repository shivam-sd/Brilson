import React from "react";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { motion } from "framer-motion";

const CardUI = () => {
  return (
    <div className="w-full flex items-center justify-center my-10">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.6 }
        }}
        className="
          relative
          w-full max-w-[360px]   
          h-[210px]             
          rounded-2xl
          px-5 py-4
          border border-white/20
          bg-transparent
          shadow-[0_0_35px_rgba(0,255,255,0.35)]
          backdrop-blur-xl
          overflow-hidden
        "
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-cyan-400/40 blur-3xl opacity-30"></div>

        {/* Top Icons */}
        <div className="relative flex justify-between items-center">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/50 border border-cyan-300 flex items-center justify-center">
            <img
              src="https://img.freepik.com/premium-vector/smart-card-vector-outline-icon-design-illustration-symbol-white-background-eps-10-file_848977-2875.jpg"
              className="w-9 h-9 rounded-sm"
              alt=""
            />
          </div>

          <div className="w-12 h-12 rounded-xl bg-cyan-400 border border-cyan-300 flex items-center justify-center">
            <img
              src="https://static.thenounproject.com/png/1119914-200.png"
              className="w-6 h-6"
              alt=""
            />
          </div>
        </div>

        {/* Name */}
        <div className="relative mt-4">
          <p className="text-xl font-semibold text-white">
            Brilson
          </p>
          {/* <p className="text-sm text-gray-300">
            Product Designer
          </p> */}
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <RiVerifiedBadgeLine className="text-yellow-400" />
            NFC Enabled
          </div>

          <span className="text-cyan-300 font-medium">
            brilson.me/JohnDeo
          </span>
        </div>

      </motion.div>
    </div>
  );
};

export default CardUI;

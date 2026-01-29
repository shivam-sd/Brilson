import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  "/b_hero1.png",
  "/b_hero2.png",
  "/b_hero3.png",
  "/b_hero4.png",
];

const CardShowcase = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center py-10">
      <div className="relative">

        {/* Soft Premium Glow */}
        <div className="absolute inset-0 rounded-3xl blur-2xl scale-105" />

        <AnimatePresence mode="wait">
  <motion.div
    key={index}
    initial={{
      opacity: 0,
      scale: 0.95,
      y: 25,
    }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
    }}
    exit={{
      opacity: 0,
      scale: 1.05,
      y: -25,
    }}
    transition={{
      duration: 0.9,
      ease: "easeInOut",
    }}
    className="relative overflow-hidden"
  >
    {/* Card container with exact dimensions */}
    <div className="
      relative
      w-[340px] md:w-[420px]
      h-[215px] md:h-[260px]
      rounded-3xl
      overflow-hidden
      flex items-center justify-center
    ">
      {/* Image that completely covers the card */}
    <motion.img
  src={cards[index]}
  alt="Brilson NFC Card"
  className="
    absolute inset-0
    w-full h-full
    object-cover object-center
    lg:scale-160
          md:scale-150
          scale-150
  "
  initial={{ scale: 1.05 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
/>

      
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  </motion.div>
</AnimatePresence>

      </div>
    </div>
  );
};

export default CardShowcase;

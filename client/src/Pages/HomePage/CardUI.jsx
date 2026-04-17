import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    src: "/b_hero1.webp",
    scale: "lg:scale-140 md:scale-150 scale-140"
  },
  {
    src: "/b_hero2.webp",
    scale: "lg:scale-150 md:scale-150 scale-150"
  },
  {
    src: "/b_hero3.webp",
    scale: "lg:scale-150 md:scale-150 scale-150"
  },
  {
    src: "/b_hero4.webp",
    scale: "lg:scale-150 md:scale-150 scale-165"
  }
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
    <div className="scroll-box w-full flex justify-center py-10">
      <div className="relative">

        <div className="absolute inset-0 rounded-3xl blur-2xl scale-105" />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -25 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="relative overflow-hidden"
          >

            <div className="
              relative
                   w-[340px] md:w-[420px]
      h-[215px] md:h-[260px]
              rounded-3xl
              overflow-hidden
              flex items-center justify-center
            ">

              <motion.img
                src={cards[index].src}
                alt="Brilson NFC Card"
                className={`
                  absolute inset-0
                  w-full h-full
                  object-cover object-center
                  ${cards[index].scale}
                `}
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
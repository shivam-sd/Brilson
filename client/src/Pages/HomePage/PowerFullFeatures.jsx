import React from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiGlobe,
  FiLock,
  FiRefreshCw,
  FiSmartphone,
  FiZap,
  FiKey,
  FiLayout,
  FiArrowRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PowerFullFeatures = () => {
  const [feature, setFeature] = useState([]);
  const [subHeading, SetsubHeading] = useState("");

  useEffect(() => {
    const fetchPowerFullFeatureData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/powerfull/features`
        );
        const data = res.data.data;
        SetsubHeading(data.subHeading);
        setFeature(data.features);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPowerFullFeatureData();
  }, []);

  // Each style pairs a border/glow color with a small badge icon,
  // mirroring the accent-per-feature treatment from the reference cards.
  const colorStyles = [
    {
      border: "from-yellow-400 via-orange-400 to-yellow-500",
      glow: "rgba(255, 190, 0, 0.5)",
      accent: "text-yellow-400",
      badgeShadow: "rgba(255, 190, 0, 0.55)",
      icon: FiZap,
    },
    {
      border: "from-pink-500 via-rose-500 to-pink-400",
      glow: "rgba(255, 0, 120, 0.45)",
      accent: "text-pink-400",
      badgeShadow: "rgba(255, 0, 120, 0.5)",
      icon: FiKey,
    },
    {
      border: "from-purple-500 via-violet-500 to-purple-400",
      glow: "rgba(150, 60, 255, 0.45)",
      accent: "text-purple-400",
      badgeShadow: "rgba(150, 60, 255, 0.5)",
      icon: FiGlobe,
    },
    {
      border: "from-blue-500 via-cyan-500 to-blue-400",
      glow: "rgba(0, 180, 255, 0.45)",
      accent: "text-cyan-400",
      badgeShadow: "rgba(0, 180, 255, 0.5)",
      icon: FiBarChart2,
    },
    {
      border: "from-sky-500 via-blue-500 to-cyan-400",
      glow: "rgba(0, 150, 255, 0.45)",
      accent: "text-sky-400",
      badgeShadow: "rgba(0, 150, 255, 0.5)",
      icon: FiSmartphone,
    },
    {
      border: "from-teal-400 via-emerald-400 to-green-500",
      glow: "rgba(0, 255, 150, 0.45)",
      accent: "text-emerald-400",
      badgeShadow: "rgba(0, 255, 150, 0.5)",
      icon: FiLock,
    },
    {
      border: "from-green-400 via-lime-400 to-green-500",
      glow: "rgba(140, 255, 0, 0.45)",
      accent: "text-lime-400",
      badgeShadow: "rgba(140, 255, 0, 0.5)",
      icon: FiRefreshCw,
    },
    {
      border: "from-violet-500 via-purple-500 to-indigo-400",
      glow: "rgba(150, 60, 255, 0.45)",
      accent: "text-violet-400",
      badgeShadow: "rgba(150, 60, 255, 0.5)",
      icon: FiLayout,
    },
  ];

  // Single orchestrated reveal sequence — cards stagger in once, no per-card scroll triggers.
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 26, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Split a two-word title so the second word can carry the accent color,
  // matching "Analytics Dashboard" / "Global Reach" style headings.
  const splitTitle = (title = "") => {
    const words = title.trim().split(" ");
    if (words.length < 2) return { first: title, rest: "" };
    return { first: words[0], rest: words.slice(1).join(" ") };
  };

  return (
    <section className="relative w-full lg:py-20 py-12 text-white overflow-hidden bg-black">
      {/* Animated gradient backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black via-[#0a0a0c] to-black bg-[length:200%_200%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Soft radial glow accents, drifting slowly */}
      <motion.div
        className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/[0.06] blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-indigo-500/[0.06] blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl md:text-5xl font-semibold mt-6 tracking-widest font-Roboto"
        >
          Powerful <span className="text-yellow-400">Features</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-center text-gray-300 mt-4 max-w-2xl mx-auto text-md tracking-widest font-Roboto"
        >
          {subHeading}
        </motion.p>

        {/* Feature cards — 3 per row on desktop, premium image showcase inside each */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 tracking-widest font-Roboto"
        >
          {feature.map((item, index) => {
            const style = colorStyles[index % colorStyles.length];
            const Icon = style.icon;
            const { first, rest } = splitTitle(item.title);

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                className="relative rounded-[26px] p-[1.5px] h-full"
                style={{
                  boxShadow: `0 30px 60px -18px ${style.glow}, 0 10px 28px -8px rgba(0,0,0,0.6)`,
                }}
              >
                {/* Gradient border */}
                <div
                  className={`absolute inset-0 rounded-[26px] bg-gradient-to-br ${style.border} opacity-80`}
                ></div>

                {/* Card body */}
                <div className="relative flex h-full px-6 pb-7 pt-3 rounded-[25px] bg-[#0b0b0d] overflow-hidden">
                  {/* Ambient inner glow */}
                  <div
                    className="absolute inset-0 rounded-[25px] pointer-events-none opacity-30"
                    style={{ boxShadow: `inset 0 0 40px ${style.glow}` }}
                  ></div>



{/* Text content */}
<div className="relative z-10 flex flex-col flex-1 mt-2 w-[55%]">
{/* Icon badge, overlapping the image bottom-left like a floating chip */}
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-full border m-2 mb-3 border-white/10 bg-[#0b0b0d]"
                      style={{ boxShadow: `0 0 20px ${style.badgeShadow}, inset 0 0 10px ${style.glow}` }}
                    >
                      <Icon className={`w-5 h-5 ${style.accent}`} />
                    </div>
                    <h3 className="text-xl font-semibold leading-snug text-white">
                      {first} {rest && <span className={style.accent}>{rest}</span>}
                    </h3>

                    <p className="text-gray-300/90 text-sm mt-3 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <button
                      type="button"
                      className="group mt-6 inline-flex items-center gap-3 self-start text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
                    >
                      Know More
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 group-hover:translate-x-0.5 transition-transform"
                        style={{ boxShadow: `0 0 14px ${style.badgeShadow}` }}
                      >
                        <FiArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </div>



                  {/* Premium image showcase */}
                  <div className="relative z-10 lg:w-[45%] md:w-[45%] w-[35%] h-[100%] flex items-center justify-center rounded-2xl">
                    <div
                      className="absolute inset-0 rounded-2xl blur-2xl opacity-60"
                      style={{ background: style.glow }}
                    ></div>
                    <div className="relative lg:w-[120px] lg:h-[125px] md:w-[120px] md:h-[125px] w-[100px] h-[100px] rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        style={{ filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.5))" }}
                      />
                    </div>

                    
                  </div>

                  
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PowerFullFeatures;

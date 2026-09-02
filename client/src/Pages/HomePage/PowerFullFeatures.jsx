import React from "react";
import { motion } from "framer-motion";
import {
  FiZap,
  FiKey,
  FiSmartphone,
  FiGlobe,
  FiLock,
  FiRefreshCw,
  FiBarChart2,
  FiLayout,
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

  const colorStyles = [
    { border: "from-yellow-400 via-orange-400 to-yellow-500", glow: "rgba(255, 190, 0, 0.35)" },
    { border: "from-pink-500 via-rose-500 to-pink-400", glow: "rgba(255, 0, 120, 0.35)" },
    { border: "from-purple-500 via-violet-500 to-purple-400", glow: "rgba(140, 0, 255, 0.35)" },
    { border: "from-blue-500 via-cyan-500 to-blue-400", glow: "rgba(0, 180, 255, 0.35)" },
    { border: "from-sky-500 via-blue-500 to-cyan-400", glow: "rgba(0, 150, 255, 0.35)" },
    { border: "from-teal-400 via-emerald-400 to-green-500", glow: "rgba(0, 255, 150, 0.35)" },
    { border: "from-green-400 via-lime-400 to-green-500", glow: "rgba(120, 255, 0, 0.35)" },
    { border: "from-violet-500 via-purple-500 to-indigo-400", glow: "rgba(140, 0, 255, 0.35)" },
  ];

  // Orchestrated stagger container — one reveal sequence, not per-card scroll triggers
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative w-full lg:py-16 py-12 text-white overflow-hidden bg-[#07133d]">
      {/* Animated gradient backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#07133d] via-[#0d204c] to-[#142d5a] bg-[length:200%_200%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Soft radial glow accents, drifting slowly */}
      <motion.div
        className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
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

        {/* Features Grid — single orchestrated reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 tracking-widest font-Roboto"
        >
          {feature.map((item, index) => {
            const style = colorStyles[index % colorStyles.length];

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                className="relative group rounded-2xl p-[1px]"
              >
                {/* Gradient border */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.border} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Card */}
                <div className="relative h-full p-6 rounded-2xl bg-[#0b1230]/90 border border-white/10 backdrop-blur-xl overflow-hidden transition-colors duration-300">
                  {/* Inner edge glow, intensifies on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-25 group-hover:opacity-50"
                    style={{ boxShadow: `inset 0 0 24px ${style.glow}` }}
                  ></div>

                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 flex items-center justify-center rounded-full mb-5 border border-white/10"
                    style={{ boxShadow: `inset 0 0 12px ${style.glow}` }}
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <img src={item.image} alt="" className="w-7 h-7" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-lg font-normal text-white">{item.title}</h3>

                  {/* Desc */}
                  <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                    {item.description}
                  </p>
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
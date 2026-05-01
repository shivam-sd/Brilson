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
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";




const PowerFullFeatures = () => {

const [feature, setFeature] = useState([]);
const [subHeading, SetsubHeading] = useState('');

useEffect(() => {
  const fetchPowerFullFeatureData = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/powerfull/features`);
      const data = res.data.data;
      SetsubHeading(data.subHeading);
      setFeature(data.features);
      // console.log(res.data.data);
    }catch(err){
      toast.error(err.response?.data.error || "Internal Issue Fetch PowerFull Data!")
    }
  }
  fetchPowerFullFeatureData();
},[]);


const features = [
  {
    title: "NFC Technology",
    icon: <FiZap size={35} className="text-cyan-400" />,
    desc: "Instant sharing with a simple tap. Compatible with all modern smartphones.",
  },
  {
    title: "QR Code Backup",
    icon: <FiKey size={35} className="text-yellow-400" />,
    desc: "Universal compatibility. Works even without NFC-enabled devices.",
  },
  {
    title: "Custom Designs",
    icon: <FiLayout size={35} className="text-green-400" />,
    desc: "Personalize your card with unique designs, styles, colors and layouts.",
  },
  {
    title: "Analytics Dashboard",
    icon: <FiBarChart2 size={35} className="text-purple-400" />,
    desc: "Track profile views, link clicks and valuable connection insights.",
  },
  {
    title: "Global Reach",
    icon: <FiGlobe size={35} className="text-blue-400" />,
    desc: "Works worldwide. No app required for recipients to view your profile.",
  },
  {
    title: "Secure & Private",
    icon: <FiLock size={35} className="text-red-400" />,
    desc: "Your data stays encrypted. You're always in control of what you share.",
  },
  {
    title: "Always Updated",
    icon: <FiRefreshCw size={35} className="text-orange-400" />,
    desc: "Update your digital profile anytime—no need for new printed cards.",
  },
  {
    title: "Mobile Friendly",
    icon: <FiSmartphone size={35} className="text-teal-400" />,
    desc: "Manage everything directly from your phone. iOS & Android supported.",
  },
];


const colorStyles = [
  {
    border: "from-yellow-400 via-orange-400 to-yellow-500",
    glow: "rgba(255, 190, 0, 0.08",
  },
  {
    border: "from-pink-500 via-rose-500 to-pink-400",
    glow: "rgba(255, 0, 120, 0.35)",
  },
  {
    border: "from-purple-500 via-violet-500 to-purple-400",
    glow: "rgba(140, 0, 255, 0.35)",
  },
  {
    border: "from-blue-500 via-cyan-500 to-blue-400",
    glow: "rgba(0, 180, 255, 0.35)",
  },
  {
    border: "from-sky-500 via-blue-500 to-cyan-400",
    glow: "rgba(0, 150, 255, 0.35)",
  },
  {
    border: "from-teal-400 via-emerald-400 to-green-500",
    glow: "rgba(0, 255, 150, 0.35)",
  },
  {
    border: "from-green-400 via-lime-400 to-green-500",
    glow: "rgba(120, 255, 0, 0.35)",
  },
  {
    border: "from-violet-500 via-purple-500 to-indigo-400",
    glow: "rgba(140, 0, 255, 0.35)",
  },
];


  return (
    <section className="relative w-full lg:py-16 bg-[#0b0f12] text-white overflow-hidden py-12">

      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00eaff11,transparent_65%)] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-5xl font-extrabold mt-6"
        >
          Powerful <span className="text-yellow-400">Features</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 mt-4 max-w-2xl mx-auto"
        >
          {subHeading}
          {/* Everything you need to make lasting impressions and grow your network effortlessly. */}
        </motion.p>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
  {feature.map((item, index) => {
    const style = colorStyles[index % colorStyles.length];

    return (
      <div key={index} className="relative group rounded-2xl p-[1px]">

        {/* 🌈 SHARP Gradient Border  */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${style.border}`}
        ></div>

        {/* 🧊 Card */}
        <div
          className="relative h-full p-6 rounded-2xl bg-[#0b0f12] border border-white/10 backdrop-blur-xl overflow-hidden transition duration-300 group-hover:-translate-y-2 cursor-pointer"
        >

          {/* ✨ INNER EDGE GLOW (very subtle) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 20px ${style.glow}`,
              opacity: 0.25
            }}
          ></div>

          {/* 🔵 Icon */}
          <div
            className="w-14 h-14 flex items-center justify-center rounded-full mb-5 border border-white/10"
            style={{
              boxShadow: `inset 0 0 12px ${style.glow}`
            }}
          >
            <img src={item.image} alt="" className="w-7 h-7" />
          </div>

          {/* 📝 Title */}
          <h3 className="text-lg font-semibold text-white">
            {item.title}
          </h3>

          {/* 📄 Desc */}
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    );
  })}
</div>
      </div>
    </section>
  );
};

export default PowerFullFeatures;

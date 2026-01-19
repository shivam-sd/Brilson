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
      console.log(res.data.data);
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

  return (
    <section className="relative w-full lg:py-16 bg-[#0b0f12] text-white overflow-hidden">

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

          {feature.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[#101418]/70 backdrop-blur-xl 
              border border-white/10 hover:border-orange-500 
              hover:shadow-[0_0_20px_#00eaff33] 
              duration-300 hover:-translate-y-3 group cursor-pointer"
            >
              {/* Icon */}
              <img src={item.image} alt="" className="mb-5 w-10" />

              {/* Title */}
              <h3 className="text-xl font-semibold group-hover:text-cyan-400 duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PowerFullFeatures;

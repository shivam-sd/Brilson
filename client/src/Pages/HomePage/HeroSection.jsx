import React from "react";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"
import CardUI from "./CardUI";


const HeroSection = () => {
  return (
    <section className="relative w-full h-auto pt-32 pb-24 bg-[#050505] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#00eaff33,transparent_70%)]"></div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(#ffffff09_1px,transparent_1px),linear-gradient(90deg,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-block px-4 py-1 rounded-full bg-white/10 text-blue-300 text-sm backdrop-blur-md border border-white/10 mb-6"
        >
          ⭐ The Future of Networking
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Your Identity,{" "}
          <span className="text-cyan-400">Digitally</span>
          <br />
          <span className="text-yellow-400">Elevated</span>
        </motion.h1>
<CardUI />
        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mt-6 text-lg max-w-2xl mx-auto"
        >
          Transform your networking with smart NFC & QR cards.
          Unlimited connections. Zero paper waste.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-5"
        >
          <Link to={'/products'} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/40 duration-300">
            Get Your Card →
          </Link>

          <Link to={'/how-it-works'} className="px-8 py-3 border border-white/20 hover:bg-white/10 duration-300 rounded-xl">
            See How It Works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 flex flex-wrap justify-center gap-10 text-center"
        >
          <div>
            <h3 className="text-3xl font-semibold">50K+</h3>
            <p className="text-gray-400">Cards Sold</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold">1M+</h3>
            <p className="text-gray-400">Connections Made</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold">4.9⭐</h3>
            <p className="text-gray-400">User Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiGlobe, FiClock, FiZap } from "react-icons/fi";

const Networking = () => {
  const [data, setData] = useState({});
  const [feature, setFeatures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/transform`);
        const data = res.data.data;
        setData(data);
        setFeatures(data.features || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const defaultFeatures = [
    "✓ Free Worldwide Shipping",
    "✓ 30-Day Money-Back Guarantee",
    "✓ 24/7 Support"
  ];

  const displayFeatures = feature.length > 0 ? feature : defaultFeatures;

  return (
    <section className="relative w-full bg-black overflow-hidden py-10 md:py-10">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Main glow gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-8"
        >
          {/* Premium Badge with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="relative inline-block px-6 py-2 text-xs md:text-sm font-medium tracking-wider uppercase text-cyan-400 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,170,255,0.15)] backdrop-blur-sm">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
              <span className="relative flex items-center gap-2 tracking-widest font-Roboto">
                <FiZap size={14} className="text-cyan-400 " />
                {data.badgeText || "Limited Time Offer – 40% OFF"}
              </span>
            </span>
          </motion.div>

          {/* Heading with gradient text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-wide font-Roboto"
          >
            {data.heading ? (
              <span dangerouslySetInnerHTML={{ 
                __html: data.heading.replace(
                  /Transform/g, 
                  '<span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transform</span>'
                ) 
              }} />
            ) : (
              <>
                Ready to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Transform</span> Your
                <br className="hidden sm:block" />
                <span className="inline-block mt-1">Networking?</span>
              </>
            )}
          </motion.h2>

          {/* Sub text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl px-4 tracking-widest font-Roboto"
          >
            {data.subHeading || (
              <>
                Join <span className="font-normal text-white">50,000+ professionals</span> who've already upgraded.
                <br className="hidden sm:block" />
                Get your smart card today and never run out of business cards again.
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-2 w-full sm:w-auto"
          >
            {/* Primary CTA  */}
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center px-8 sm:px-8 md:px-12 py-2 sm:py-3 rounded-full font-semibold text-white text-sm sm:text-base overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-[0_10px_40px_rgba(0,170,255,0.3)] hover:shadow-[0_15px_50px_rgba(0,170,255,0.4)]"
            >
              
              
              <span className="relative flex items-center gap-2 tracking-widest font-Roboto">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>

            {/* Secondary CTA - Contact Sales */}
            <Link
              to="/contact-sale"
              className="group inline-flex items-center justify-center px-8 sm:px-8 py-2 sm:py-2 rounded-full border-2 border-blue-500/50 text-white font-medium text-sm sm:text-base bg-transparent hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 hover:scale-105 tracking-widest font-Roboto"
            >
              <span className="relative flex items-center gap-2">
                Contact Sales
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
              </span>
            </Link>
          </motion.div>

          {/* Bottom Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-2 border-t border-white/5 w-full max-w-3xl tracking-widest font-Roboto"
          >
            {displayFeatures.map((item, index) => {
              const iconMap = {
                'Free Worldwide Shipping': <FiGlobe size={14} className="text-cyan-400" />,
                '30-Day Money-Back Guarantee': <FiShield size={14} className="text-emerald-400" />,
                '24/7 Support': <FiClock size={14} className="text-blue-400" />
              };
              
              const icon = iconMap[item] || <FiShield size={14} className="text-cyan-400" />;
              
              return (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm"
                >
                  {icon}
                  <span>{item}</span>
                  {index < displayFeatures.length - 1 && (
                    <span className="hidden sm:inline w-px h-4 bg-white/10 ml-1" />
                  )}
                </motion.p>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Networking;
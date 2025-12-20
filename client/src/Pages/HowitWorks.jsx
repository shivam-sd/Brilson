import React from "react";
import { motion } from "framer-motion";
import { FiBox, FiCreditCard, FiUserCheck, FiShare2 } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      no: "01",
      title: "Choose Your Card",
      desc: "Select from our range of premium smart cards — QR, NFC, or Metal.",
      icon: <FiBox size={40} className="text-cyan-400" />,
    },
    {
      no: "02",
      title: "Place Your Order",
      desc: "Complete checkout with secure payment. We ship worldwide.",
      icon: <FiCreditCard size={40} className="text-cyan-400" />,
    },
    {
      no: "03",
      title: "Set Up Your Profile",
      desc: "Create your digital profile with all your links and contact info.",
      icon: <FiUserCheck size={40} className="text-cyan-400" />,
    },
    {
      no: "04",
      title: "Start Connecting",
      desc: "Tap or scan to share instantly. Track views and connections.",
      icon: <FiShare2 size={40} className="text-cyan-400" />,
    },
  ];

  return (
    <section className="w-full bg-[#0b0f12] py-24 px-6 flex flex-col items-center text-center">
      
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-white text-4xl md:text-5xl font-bold"
      >
        How It <span className="text-cyan-400">Works</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-sm md:text-base mt-3 max-w-xl"
      >
        Get started in minutes. No technical skills required.
      </motion.p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-7xl w-full">

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative bg-[#101418]/80 border border-white/10 backdrop-blur-xl 
            rounded-2xl p-8 shadow-lg hover:shadow-cyan-500/20 
            transition-all duration-300 hover:-translate-y-3 cursor-pointer"
          >
            {/* Number badge */}
            <div className="absolute top-3 right-4 text-gray-700/30 font-extrabold text-5xl select-none">
              {step.no}
            </div>

            {/* Icon */}
            <div className="mb-5">{step.icon}</div>

            {/* Title */}
            <h3 className="text-white text-lg font-semibold">{step.title}</h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default HowItWorks;

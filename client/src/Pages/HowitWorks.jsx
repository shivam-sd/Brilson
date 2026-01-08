import React from "react";
import { motion } from "framer-motion";
import {
  FaMobileAlt,
  FaWifi,
  FaUserPlus,
  FaEdit,
  FaShieldAlt,
  FaLeaf,
} from "react-icons/fa";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Get Your NFC Card",
    desc: "Receive your personalized NFC smart card.",
    icon: <FaWifi />,
  },
  {
    title: "Tap on Phone",
    desc: "Just tap on any NFC enabled smartphone.",
    icon: <FaMobileAlt />,
  },
  {
    title: "Profile Opens",
    desc: "Your digital profile opens instantly.",
    icon: <FaUserPlus />,
  },
  {
    title: "Save & Connect",
    desc: "Save contact, socials & connect instantly.",
    icon: <FaEdit />,
  },
];

const benefits = [
  {
    title: "Secure & Private",
    icon: <FaShieldAlt />,
    desc: "Your data is encrypted and fully secure.",
  },
  {
    title: "Eco Friendly",
    icon: <FaLeaf />,
    desc: "No paper cards. One card forever.",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-[#03060A] text-white overflow-hidden">

      {/* HERO */}
      <section className="h-auto mt-30 flex flex-col items-center justify-center px-6 text-center">
        <motion.h4
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold"
        >
          How <span className="text-cyan-400">NFC Smart Card</span> Works
        </motion.h4>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 max-w-2xl text-gray-400"
        >
          Tap once. Share forever. No apps. No paper. Just smart networking.
        </motion.p>

        {/* Floating Card */}
             
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
                 mt-20
                 cursor-pointer
                 hover:scale-110 duration-300
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
           
      </section>

      {/* STEPS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Simple Steps to <span className="text-cyan-400">Connect</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:scale-110 duration-300"
            >
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 text-2xl mb-5">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 px-6 bg-white/5">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Choose <span className="text-cyan-400">Us?</span>
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#03060A] border border-white/10 rounded-2xl p-6 flex gap-4"
            >
              <div className="text-cyan-400 text-3xl">{b.icon}</div>
              <div>
                <h4 className="text-lg font-semibold">{b.title}</h4>
                <p className="text-sm text-gray-400">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to <span className="text-cyan-400">Go Smart?</span>
        </h2>
        <p className="text-gray-400 mt-4">
          Upgrade your networking with NFC smart cards.
        </p>

        <Link to={'/products'}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-10 py-3 rounded-xl 
          bg-cyan-500 text-black font-semibold shadow-lg cursor-pointer"
        >
            Get Your Card Now
        </motion.button>
          </Link>
      </section>
    </div>
  );
};

export default HowItWorks;

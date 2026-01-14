import React from "react";
import { motion } from "framer-motion";
import {
  FiWifi,
  FiShield,
  FiEdit,
  FiUsers,
  FiBarChart2,
  FiGlobe,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const features = [
  {
    icon: <FiWifi />,
    title: "Tap & Share Instantly",
    desc: "Share contact details, website & social profiles with a single tap.",
  },
  {
    icon: <FiGlobe />,
    title: "No App Required",
    desc: "Works seamlessly on Android & iOS without installing any app.",
  },
  {
    icon: <FiEdit />,
    title: "Editable Profile",
    desc: "Update your information anytime from the admin dashboard.",
  },
  {
    icon: <FiShield />,
    title: "Secure NFC Chip",
    desc: "Encrypted & protected NFC technology for secure sharing.",
  },
  {
    icon: <FiUsers />,
    title: "Team Management",
    desc: "Manage multiple employee cards from one corporate panel.",
  },
  {
    icon: <FiBarChart2 />,
    title: "Smart Analytics",
    desc: "Track card taps, locations & engagement insights.",
  },
];

const steps = [
  {
    title: "Tap the Card",
    desc: "Hold the Brison NFC Smart Card near any smartphone.",
  },
  {
    title: "Instant Profile Open",
    desc: "Your digital profile opens instantly in the browser.",
  },
  {
    title: "Connect & Save",
    desc: "Save contact, visit website or connect on social platforms.",
  },
];

const NfcCardFeatures = () => {
  return (
    <div className="bg-gradient-to-br from-[#03060A] via-[#060B14] to-[#03060A] text-white">

      {/*  HERO  */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <div className="w-full flex items-center justify-center">

          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-cyan-500/10 text-cyan-400">
            Brison NFC Smart Card
          </span>
            </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-center">
            The Future of <span className="text-cyan-400">Smart Networking</span>
          </h2>

          <p className="mt-6 text-gray-300 text-lg max-w-xl">
            Replace traditional visiting cards with Brison’s premium NFC Smart
            Card  fast, secure, eco-friendly & built for modern businesses.
          </p>

          
        </motion.div>

        {/* Card Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="w-80 h-52 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 backdrop-blur-xl border border-white/20 shadow-2xl rotate-6 animate-pulse animate__animated">
            <div className="absolute inset-0 rounded-2xl bg-black/40 p-6 flex flex-col justify-between">
              <h3 className="text-xl font-semibold">Brison</h3>
              <p className="text-sm text-gray-300">NFC Smart Card</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/*  FEATURES  */}
      <section className="max-w-7xl mx-auto px-6 lg:py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Powerful Features
        </h2>
        <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
          Designed for professionals, enterprises & modern brands.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-orange-600 transition cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  HOW IT WORKS  */}
      <section className="bg-[#060B14] lg:py-24 py-4 lg:mt-0 mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
              >
                <FiCheckCircle className="mx-auto text-cyan-400 text-3xl mb-4" />
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-gray-400 mt-3">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">
          Upgrade Your <span className="text-cyan-400">Networking Experience</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Join the future of digital identity & smart business networking with Brison.
        </p>

        {/* <button className="mt-10 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold text-xl inline-flex items-center gap-3 hover:scale-105 transition">
          Start with Brison <FiArrowRight />
        </button> */}
      </section>
    </div>
  );
};

export default NfcCardFeatures;

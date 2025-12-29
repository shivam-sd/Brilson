import React from "react";
import { motion } from "framer-motion";
import { FaMobileAlt, FaWifi, FaUserCheck } from "react-icons/fa";
import { FaWhatsapp, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const SmartNFCSection = () => {
  return (
    <section className="w-full bg-[#0a0f1c] py-20 px-6 md:px-20 overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-16 mt-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Smart <span className="text-cyan-400">NFC Business Card</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Share your contact instantly with just a tap.  
          No apps. No paper. Just smart networking.
        </p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT — Card + Mobile */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex justify-center"
        >
          {/* Glow */}
          <div className="absolute w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full"></div>

          {/* NFC Card */}
          <div className="absolute left-6 top-24 w-64 h-40 bg-black rounded-xl border border-white/10 shadow-2xl flex items-center justify-center text-white rotate-[-10deg]">
            <span className="text-xl font-bold tracking-widest">
              BRILSON™ NFC
            </span>
          </div>

          {/* Mobile */}
          <div className="relative w-72 h-[500px] bg-gradient-to-b from-slate-900 to-black rounded-[2.5rem] border border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.35)] p-4">
            <div className="w-full h-full bg-[#0f172a] rounded-[2rem] p-5 text-white flex flex-col">

              {/* Profile */}
              <div>
                <p className="text-xl font-semibold">John Deo</p>
                <p className="text-sm text-gray-400">Product Designer</p>
              </div>

              {/* Connect Button */}
              <button className="mt-4 w-full bg-cyan-500 text-black py-2 rounded-xl font-semibold hover:bg-cyan-400 duration-300">
                CONNECT
              </button>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 mt-10">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500 duration-300 cursor-pointer">
                  <FaWhatsapp />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500 duration-300 cursor-pointer">
                  <FaLinkedinIn />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500 duration-300 cursor-pointer">
                  <FaInstagram />
                </div>
              </div>

              {/* Contact Details */}
              <div className="mt-10 space-y-2 text-sm text-gray-300">
                <p>📧 john.doe@email.com</p>
                <p>📞 +91 98765 43210</p>
              </div>

              {/* Info */}
              <p className="mt-auto text-xs text-gray-400">
                Tap the NFC card to instantly open this profile and save contact.
              </p>

            </div>
          </div>
        </motion.div>

        {/* RIGHT — How It Works */}
        <div className="space-y-8 text-white">

          <div className="flex items-start gap-4">
            <FaWifi className="text-cyan-400 text-3xl" />
            <div>
              <h4 className="text-xl font-semibold">Tap with NFC</h4>
              <p className="text-gray-400">
                Just tap the NFC card on any compatible smartphone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaMobileAlt className="text-cyan-400 text-3xl" />
            <div>
              <h4 className="text-xl font-semibold">Profile Opens Instantly</h4>
              <p className="text-gray-400">
                Digital profile opens automatically without any app.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaUserCheck className="text-cyan-400 text-3xl" />
            <div>
              <h4 className="text-xl font-semibold">Connect & Save</h4>
              <p className="text-gray-400">
                Save contact, follow socials or connect instantly.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SmartNFCSection;

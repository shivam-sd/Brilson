import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import cardAnim from "../lottie/card.json";
import loginAnim from "../lottie/login.json";
import profileAnim from "../lottie/profile.json";
import qrAnim from "../lottie/qr.json";
import updateAnim from "../lottie/update.json";

const steps = [
  {
    title: "Get Your Smart Card",
    desc: "Buy a Brilson Smart Card and get a unique digital identity.",
    animation: cardAnim,
  },
  {
    title: "Login & Activate Card",
    desc: "Login using your account and activate your card securely.",
    animation: loginAnim,
  },
  {
    title: "Create Your Digital Profile",
    desc: "Add your personal or business details to your digital profile.",
    animation: profileAnim,
  },
  {
    title: "Share via QR or Link",
    desc: "Let others scan your QR or open your profile link instantly.",
    animation: qrAnim,
  },
  {
    title: "Update Anytime",
    desc: "Edit your profile anytime and changes reflect instantly.",
    animation: updateAnim,
  },
];

const HowToUse = () => {
  return (
    <section className="w-full bg-[#0a0a0a] text-white py-24 px-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          How to Use Smart Card
        </h2>
        <p className="text-gray-400 text-lg">
          Simple steps to create, share and manage your digital identity.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto space-y-24">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-14`}
          >
            {/* Lottie Animation */}
            <div className="w-full md:w-1/2">
              <Lottie animationData={step.animation} loop={true} />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2">
              <span className="text-sm text-indigo-400 font-semibold">
                STEP {index + 1}
              </span>
              <h3 className="text-3xl font-bold mt-2 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-400 text-lg">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mt-32 text-center"
      >
        <h3 className="text-3xl font-bold mb-12">
          Why Use Smart Card?
        </h3>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            "No Reprinting Needed",
            "Professional Identity",
            "Eco Friendly",
            "Secure & Editable",
          ].map((benefit, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#111] p-8 rounded-2xl shadow-lg"
            >
              <h4 className="font-semibold text-lg">{benefit}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowToUse;

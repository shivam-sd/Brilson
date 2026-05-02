import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiChevronDown,
  FiHelpCircle,
  FiShoppingCart,
  FiUser,
  FiLock,
  FiMessageCircle,
} from "react-icons/fi";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Go to product page → click Add to Cart → proceed to checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Go to 'My Orders' section from your profile dashboard."
  },
  {
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' → enter phone → verify OTP → set new password."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, we use secure encrypted payment gateways."
  }
];

const categories = [
  {
    icon: <FiShoppingCart size={24} />,
    title: "Orders",
    desc: "Track, cancel or manage orders"
  },
  {
    icon: <FiUser size={24} />,
    title: "Account",
    desc: "Login, profile & account issues"
  },
  {
    icon: <FiLock size={24} />,
    title: "Security",
    desc: "Password & OTP help"
  },
  {
    icon: <FiMessageCircle size={24} />,
    title: "Support",
    desc: "Talk to our team"
  }
];

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white px-4 py-10 mt-15">

      {/* HERO */} 
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Help Center</h2>
        <p className="text-gray-400 mb-6">
          How can we help you today?
        </p>

        
      </div>

      {/* CATEGORIES */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 mb-16">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400 transition"
          >
            <div className="text-cyan-400 mb-3">{cat.icon}</div>
            <h3 className="font-semibold">{cat.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{cat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex justify-between items-center px-5 py-4 bg-white/5 hover:bg-white/10 transition"
              >
                <span>{faq.question}</span>
                <FiChevronDown
                  className={`transition ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 py-4 text-gray-400 bg-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT SUPPORT */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-8">
          <FiHelpCircle size={40} className="mx-auto text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Still need help?
          </h3>
          <p className="text-gray-400 mb-6">
            Our support team is always ready to help you
          </p>

          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:scale-105 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
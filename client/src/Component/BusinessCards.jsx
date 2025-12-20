import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiLayers, FiDatabase, FiHash } from "react-icons/fi";

const BusinessCards = () => {
  const AllData = [
    {
      title: "Basic QR Card",
      type: "Basic Card",
      price: "₹299",
      variants: "2 variants",
      icon: <FiHash size={40} className="text-cyan-400" />,
      description: "Simple, effective QR code business card. Ideal for beginners going digital.",
      tags: ["Custom QR Code", "Digital Profile Link"],
      highlight: false,
    },
    {
      title: "Premium PVC Card",
      type: "Premium Card",
      price: "₹599",
      variants: "3 variants",
      icon: <FiLayers size={40} className="text-blue-400" />,
      description: "High-quality PVC card with a premium matte finish. Built for elegance & durability.",
      tags: ["Premium PVC Material", "Custom QR Code"],
      highlight: false,
    },
    {
      title: "NFC Smart Card",
      type: "NFC Card",
      price: "₹999",
      variants: "3 variants",
      icon: <FiZap size={40} className="text-cyan-300" />,
      description: "Tap to share your profile instantly. The future of networking with NFC technology.",
      tags: ["NFC Tap Share", "QR Backup", "Smart Profile"],
      highlight: true,
    },
    {
      title: "Metal Elite Card",
      type: "Metal Card",
      price: "₹1999",
      variants: "4 variants",
      icon: <FiDatabase size={40} className="text-indigo-400" />,
      description: "Premium stainless steel metal card. Designed for executives with luxury finish.",
      tags: ["Stainless Steel", "NFC + QR Hybrid"],
      highlight: false,
    },
  ];

  // Business Card
  const BusinessCards = AllData.filter(
    (c) => c.type === "NFC Card" || c.type === "Metal Card"
  );

  return (
    <section className="w-full bg-[#0b0f12] py-20">

      <div className="max-w-6xl mx-auto grid m-10 gap-10 sm:grid-cols-2 lg:grid-cols-3 px-6">
        {BusinessCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-6 rounded-2xl border border-white/10 bg-[#101418]/60 
            backdrop-blur-xl hover:-translate-y-3 transition-all duration-300 
            shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
          >
            {/* Best Seller Badge */}
            {card.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs rounded-full bg-cyan-500 text-black font-semibold shadow-md">
                ⭐ Best Seller
              </div>
            )}

            {/* Variant */}
            <div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full 
            bg-white/10 text-gray-300 border border-white/10">
              {card.variants}
            </div>

            {/* Icon */}
            <div className="mb-6 flex justify-center">{card.icon}</div>

            {/* Type */}
            <p className="text-cyan-400 text-xs font-semibold uppercase mb-1">
              {card.type}
            </p>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white">{card.title}</h3>

            {/* Price */}
            <p className="mt-2 text-gray-300 text-sm">
              Starting from <span className="text-white font-bold">{card.price}</span>
            </p>

            {/* Description */}
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              {card.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {card.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              className={`w-full mt-6 py-3 rounded-xl font-medium border flex items-center justify-center gap-2
              ${
                card.highlight
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
              }
              transition-all duration-300`}
            >
              Select Variant →
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BusinessCards;

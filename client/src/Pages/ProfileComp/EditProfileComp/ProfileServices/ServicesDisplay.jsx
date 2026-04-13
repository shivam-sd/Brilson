// components/ServicesDisplay.jsx
import React, { useRef } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { RiEditBoxFill } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";

const ServicesDisplay = ({ services, layoutType, onDelete, isEditMode = true }) => {
  const scrollContainerRef = useRef(null);

  // Carousel scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Flex/Grid Layout (Desktop & Mobile)
  if (layoutType === 'flex') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard 
            key={service._id} 
            service={service} 
            index={index}
            onDelete={onDelete}
            isEditMode={isEditMode}
          />
        ))}
      </div>
    );
  }

  // Carousel Layout (Mobile Only)
  return (
    <div className="relative md:hidden">
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scroll-smooth gap-6 pb-6 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((service, index) => (
          <div key={service._id} className="min-w-[280px] md:min-w-[320px] flex-shrink-0">
            <ServiceCard 
              service={service} 
              index={index}
              onDelete={onDelete}
              isEditMode={isEditMode}
              isCarousel={true}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Optional) */}
      {services.length > 1 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur p-2 rounded-full text-white hover:bg-black/70 transition"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur p-2 rounded-full text-white hover:bg-black/70 transition"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

// Individual Service Card Component
const ServiceCard = ({ service, index, onDelete, isEditMode, isCarousel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-[#E1C48A]/30 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-emerald-400 border border-emerald-500/30">
          ₹ {service.price}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-[#E1C48A] transition">
            {service.title}
          </h3>
          {service.link && (
            <Link to={service.link} target="_blank">
              <FaEye size={20} className="text-gray-400 hover:text-white transition" />
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-5 line-clamp-3">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {service.features?.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
              <FaRegCheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions (Only in Edit Mode) */}
        {isEditMode && (
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <button
              onClick={() => onDelete(service._id)}
              className="text-red-500 hover:text-red-400 transition"
            >
              <FiTrash2 size={18} />
            </button>
            <Link
              to={`/profile/services/update/${service._id}`}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-900/30 hover:scale-105"
            >
              <RiEditBoxFill size={14} />
              Update
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ServicesDisplay;
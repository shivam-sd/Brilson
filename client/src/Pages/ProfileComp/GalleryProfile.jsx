import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CameraIcon, X, ChevronLeft, ChevronRight, 
  Maximize2, Download, Share2, Heart
} from "lucide-react";

const GalleryProfile = ({ isActive = false, sectionId, refProp }) => {
  // Gallery data 
  const galleryData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=400&fit=crop",
      title: "Project Showcase",
      category: "Design",
      description: "Latest design project presentation",
      date: "Jan 2024",
      likes: 42,
      tags: ["Design", "UI/UX", "Presentation"]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop",
      title: "Team Collaboration",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
      title: "Product Launch",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=400&fit=crop",
      title: "Client Meeting",

    },
  ];



  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };


  // Handle navigation
  const handleNext = () => {
    if (selectedImage) {
      const currentIndex = galleryData.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % galleryData.length;
      setSelectedImage(galleryData[nextIndex]);
    }
  };

  return (
    <div className="mb-16" id={sectionId} ref={refProp}>
     
     
     {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
            onClick={() => handleImageClick(item)}
          >
            {/* Image */}
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                  {item.category}
                </span>
              </div>
              
              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-300 text-xs mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{item.date}</span>
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-red-400" />
                    <span className="text-xs text-gray-300">{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryProfile;
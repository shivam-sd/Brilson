import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CameraIcon, X, ChevronLeft, ChevronRight, 
  Maximize2, Download, Share2, Heart
} from "lucide-react";
import axios from "axios";

const GalleryProfile = ({activationCode}) => {
  
  const [gallery, setGallery] = useState([]);


  const id = activationCode;
const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchGalleryData = async () => {
       const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-gallery/all/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const galleryData = res.data.data;
        setGallery(galleryData);
    }
    fetchGalleryData();
  },[id]);


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
    <div className="mb-16">
     
     
     {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item, index) => (
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
              src={item.image}
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
                  <span className="text-gray-400 text-xs">{new Date(item.date).toLocaleString()}</span>
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
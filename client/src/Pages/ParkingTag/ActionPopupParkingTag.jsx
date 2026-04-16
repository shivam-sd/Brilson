import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, X, Car, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionPopupParkingTag = ({ number }) => {

    
    const [ClosePopup, setClosePopup] = useState(false);

    const onClose = () => {
        setClosePopup(true);
        console.log(ClosePopup);
    }
    
    const handleCall = () => {
        if (number) {
            window.location.href = `tel:${number}`;
        }
    };
    
    const handleWhatsApp = () => {
        if (number) {
        const formattedNumber = number;
        window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }
};


  return (
    <AnimatePresence>
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 ${ClosePopup && "hidden"}`}
          />
          
          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
          >
            <div className={`relative w-full max-w-md ${ClosePopup && "hidden"}`} >
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 rounded-3xl blur-xl" />
                
                {/* Header with Close Button */}
                <div className="relative p-6 pb-0">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                  >
                    <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-60" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Car size={36} className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Contact Owner
                  </h2>
                </div>
                
                {/* Action Buttons */}
                <div className="relative p-6 pt-4 space-y-3">
                  {/* Call Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCall}
                    disabled={!number}
                    className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 tracking-widest font-Playfair ${
                      number
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl cursor-pointer'
                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Phone size={20} />
                    <span>Call Now</span>
                  </motion.button>
                  
                  {/* WhatsApp Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    disabled={!number}
                    className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 font-Playfair tracking-widest ${
                      number
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl cursor-pointer'
                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <MessageCircle size={20} />
                    <span>WhatsApp</span>
                  </motion.button>
                </div>
                
                {/* Footer Note */}
                <div className="relative px-6 pb-6">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1 font-Playfair tracking-widest font-bold">
                      <Shield size={12} />
                      <span>Secure</span>
                    </div>
                    {/* <div className="w-1 h-1 bg-gray-400 rounded-full" /> */}
                    <div className="flex items-center gap-1 font-Playfair font-bold tracking-widest">
                      <Clock size={12} />
                      <span>24/7 Available</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </motion.div>
        </>
    </AnimatePresence>
  );
};

export default ActionPopupParkingTag;
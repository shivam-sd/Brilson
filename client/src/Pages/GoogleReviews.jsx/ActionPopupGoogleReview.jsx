import React, { useEffect, useState } from 'react';
import { Share2, Star, X, Award, Globe, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ActionPopupGoogleReview = ({ reviewLink, brandName, activationCode }) => {
    
    const [ClosePopup, setClosePopup] = useState(false);

    const onClose = () => {
        setClosePopup(true);
        console.log(ClosePopup);
    }
    
    const handleShareProfile = async () => {
        if (navigator.share) {
            const profileUrl = `${window.location.origin}/google-reviews/${activationCode}`;
            try {
                await navigator.share({url:profileUrl});
                toast.success("Profile link copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy link", err);
            }
        }
    };
    
    const handleGiveReview = () => {
        if (reviewLink) {
            window.open(reviewLink, '_blank');
        }
    };

    // Get stars for rating display
    const renderStars = () => {
        return (
            <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {!ClosePopup && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50"
                    />
                    
                    {/* Popup Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        className="fixed lg:-top-5/12 md:-top-5/12 -top-6/12 inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md">
                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                                
                                {/* Animated Gradient Border */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-20 rounded-3xl blur-xl" />
                                
                                {/* Header with Close Button */}
                                <div className="relative p-6 pb-0 cursor-pointer" onClick={onClose}>
                                    <button
                                        
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                                    >
                                        <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                    </button>
                                    
                                    {/* Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-xl opacity-60" />
                                            <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                                <Globe size={36} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        Google Review
                                    </h2>
                                    
                                    {/* Brand Name */}
                                    <p className="text-center text-gray-300 mt-2 text-sm">
                                        {brandName || "Business Profile"}
                                    </p>
                                    
                                    {/* Star Rating */}
                                    {renderStars()}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="relative p-6 pt-4 space-y-3">
                                    {/* Share Profile Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleShareProfile}
                                        disabled={!activationCode}
                                        className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 ${
                                            activationCode
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl cursor-pointer'
                                                : 'bg-gray-700 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        <Share2 size={20} />
                                        <span>Share Profile</span>
                                    </motion.button>
                                    
                                    {/* Give Review Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleGiveReview}
                                        disabled={!reviewLink}
                                        className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 ${
                                            reviewLink
                                                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl cursor-pointer'
                                                : 'bg-gray-700 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        <Star size={20} />
                                        <span>Give Review</span>
                                    </motion.button>
                                </div>
                                
                                {/* Footer Note */}
                                <div className="relative px-6 pb-6">
                                    <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <Award size={12} />
                                            <span className="text-xs">Verified Business</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp size={12} />
                                            <span className="text-xs">Share Feedback</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ActionPopupGoogleReview;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, ExternalLink, ThumbsUp, Share2, Award, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import {toast, Toaster} from "react-hot-toast";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import ActionPopupGoogleReview from "./ActionPopupGoogleReview";


const GoogleReviewsPublicProfile = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/google-review/profile/${slug}`
        );
        console.log(res);
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  const handleShare = async () => {
    const reviewLink = data?.profile?.googleReviewLink;
    if (reviewLink) {
      try {
        await navigator.clipboard.writeText(reviewLink);
        toast.success("Review link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const brandName = profile?.brandName || "Your Brand";
  const brandLogo = profile?.brandLogo;
  const reviewLink = profile?.googleReviewLink;

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <>
    <Toaster position="top-center" />
    <Header />
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center p-4 py-30">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
        />
        
        {/* Floating Particles */}
        {particles.map((i) => (
          <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
          style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Glow Effect behind card */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-2xl"
          animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Main Card Content */}
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400" />
          
          {/* Card Inner Content */}
          <div className="p-8">
            
            {/* Logo Section with Animation */}
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                  {brandLogo ? (
                    <img
                    src={brandLogo}
                    alt={brandName}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                      <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        {brandName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Brand Name with Typing Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {brandName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <p className="text-gray-400 text-sm">Verified Business</p>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-400 text-sm mb-6"
            >
              Share your experience with us ✨
            </motion.p>

            {/* Star Rating Section with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex justify-center gap-2 mb-6"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                >
                  <Star
                    size={28}
                    className={`text-yellow-400 fill-yellow-400 drop-shadow-lg transition-all duration-300 ${
                        i < rating ? "opacity-100" : "opacity-50"
                        }`}
                        onMouseEnter={() => setRating(i + 1)}
                        onMouseLeave={() => setRating(5)}
                        />
                </motion.div>
              ))}
            </motion.div>


            {/* CTA Button with Hover Effects */}
            <motion.a
              href={reviewLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className={`inline-flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black font-semibold shadow-lg transition-all duration-300 ${
                isHovered ? "shadow-yellow-500/50 gap-4" : "shadow-yellow-500/30"
                }`}
                >
              <ThumbsUp size={20} />
              <span>Write a Google Review</span>
              <ExternalLink size={18} className={isHovered ? "translate-x-1" : ""} />
            </motion.a>

            {/* Share Button */}
            {reviewLink && (
                <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-400/50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                <Share2 size={16} />
                <span>Share Review Link</span>
              </motion.button>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-gray-500">Your feedback matters</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-500 tracking-wide">
                Powered by <span className="text-yellow-400">Brilson</span>
              </p>
            </div>

          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400/30 rounded-tl-xl" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400/30 rounded-tr-xl" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-400/30 rounded-bl-xl" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400/30 rounded-br-xl" />
      </motion.div>

    </div>
    <ActionPopupGoogleReview 
    activationCode={slug}
    reviewLink={reviewLink}
    brandName={brandName}
    />
    <Footer />
          </>
  );
};

export default GoogleReviewsPublicProfile;
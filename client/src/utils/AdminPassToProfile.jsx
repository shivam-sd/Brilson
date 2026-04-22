import React, { useEffect, useState } from "react";
import { 
  FiCopy, FiEye, FiEdit, FiCheck, FiPlus
} from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { FaTags, FaIdCard } from "react-icons/fa";
import { 
  Wallet, Gift
} from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import ReferralDashboard from "./ReferralDashboard";

const AdminPassToProfile = () => {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cards, setCards] = useState([]);
  const [parkingTags, setParkingTags] = useState([]);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [balance, setBalance] = useState(0);
  
  // Loading states for each section
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingReferral, setLoadingReferral] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch balance and referral code
  const fetchBalance = async () => {
    setLoadingBalance(true);
    setLoadingReferral(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/balance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReferralCode(res.data.referalCode);
      setBalance(res.data.Balance);
      setUserId(res.data.userId);
    } catch (err) {
      setBalance(0);
      console.log(err);
    } finally {
      setLoadingBalance(false);
      setLoadingReferral(false);
    }
  };

  // Fetch all cards for user
  const fetchUserCards = async () => {
    if (!userId) return;
    setLoadingCards(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cards/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Cards Response:", res.data);
      
      let userCards = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        const userData = res.data.data.find((item) => item.userId === userId);
        userCards = userData?.cards || [];
      } else if (res.data?.cards && Array.isArray(res.data.cards)) {
        userCards = res.data.cards;
      } else if (Array.isArray(res.data)) {
        userCards = res.data;
      }
      
      setCards(userCards);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  // Fetch parking tags for user
  const fetchUserParkingTags = async () => {
    if (!userId) return;
    setLoadingTags(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/tags/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Parking Tags Response:", res.data);
      
      let userTags = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        const userData = res.data.data.find((item) => item.userId === userId);
        userTags = userData?.tags || [];
      } else if (res.data?.tags && Array.isArray(res.data.tags)) {
        userTags = res.data.tags;
      } else if (Array.isArray(res.data)) {
        userTags = res.data;
      }
      
      setParkingTags(userTags);
    } catch (err) {
      console.error("Error fetching parking tags:", err);
      setParkingTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  // Fetch Google Reviews for user - FIXED VERSION
  const fetchUserGoogleReviews = async () => {
    if (!userId) return;
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/google-reviews/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Google Reviews Response:", res.data);
      
      let userReviews = [];
      
      // Handle the response structure from your API
      if (res.data?.data && Array.isArray(res.data.data)) {
        // Find the user's data object
        const userData = res.data.data.find((item) => item.userId === userId);
        
        // The reviews are inside the 'reviews' array
        if (userData?.reviews && Array.isArray(userData.reviews)) {
          userReviews = userData.reviews;
        }
      } 
      // Alternative response structures
      else if (res.data?.reviews && Array.isArray(res.data.reviews)) {
        userReviews = res.data.reviews;
      } 
      else if (Array.isArray(res.data)) {
        userReviews = res.data;
      }
      
      console.log("Processed Google Reviews:", userReviews);
      setGoogleReviews(userReviews);
    } catch (err) {
      console.error("Error fetching Google Reviews:", err);
      setGoogleReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserCards();
      fetchUserParkingTags();
      fetchUserGoogleReviews();
    }
  }, [userId]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const hasActiveCards = cards.some(card => card.isActivated === true);
  const hasActiveTags = parkingTags.some(tag => tag.isActivated === true);
  const hasActiveReviews = googleReviews.some(review => review.isActivated === true);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden">
          <div className="animate-pulse">
            <div className="flex items-center justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-gray-700/50" />
            </div>
            <div className="text-center mb-3">
              <div className="h-5 bg-gray-700/50 rounded-lg w-32 mx-auto mb-2" />
              <div className="h-3 bg-gray-700/50 rounded-lg w-24 mx-auto" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-700/50 rounded w-16" />
                <div className="h-5 bg-gray-700/50 rounded w-20" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-9 bg-gray-700/50 rounded-lg" />
              <div className="flex-1 h-9 bg-gray-700/50 rounded-lg" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
        </div>
      ))}
    </div>
  );

  // Card Item Component
  const CardItem = ({ card, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
        
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {card.profile?.name?.charAt(0) || card.name?.charAt(0) || "C"}
              </span>
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {card.profile?.name || card.name || "Unnamed Card"}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2">
              {card.profile?.bio || card.bio || "No bio added"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                card.isActivated 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {card.isActivated ? "Active" : "Inactive"}
              </span>
            </div>
            {card.activationCode && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Code</span>
                <span className="text-white text-xs font-mono truncate">{card.activationCode.slice(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/profile/${card.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEye size={14} />
            <span>View</span>
          </Link>
          <Link 
            to={`/profile/edit/${card.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </Link>
        </div> 
      </div>
    </motion.div>
  );

  // Parking Tag Item Component
  const ParkingTagItem = ({ tag, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
        
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaTags className="text-emerald-400 text-2xl" />
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {tag?.profile?.ownerName || "Parking Tag"}
            </h3>
            <p className="text-gray-400 text-xs">
              {tag?.profile?.vehicleNumber ? `Vehicle: ${tag?.profile?.vehicleNumber}` : "Vehicle Number not added"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tag.isActivated 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {tag.isActivated ? "Active" : "Inactive"}
              </span>
            </div>
            {tag.activationCode && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Code</span>
                <span className="text-white text-xs font-mono truncate">{tag.activationCode.slice(0, 8)}...</span>
              </div>
            )}
            {tag.tagId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Tag ID</span>
                <span className="text-white text-xs font-mono truncate">{tag.tagId.slice(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/profile/P/${tag.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEye size={14} />
            <span>View</span>
          </Link>
          <Link 
            to={`/profile/P/edit/${tag.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Google Review Item Component
  const GoogleReviewItem = ({ review, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-red-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
        
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              {review.profile?.brandLogo ? (
                <img 
                  src={review.profile.brandLogo} 
                  alt={review.profile?.brandName || "Brand"} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <MdOutlineReviews className="text-red-400 text-2xl" />
              )}
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {review.profile?.brandName || "Google Review"}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2">
              {review.profile?.googleReviewLink ? (
                <a 
                  href={review.profile.googleReviewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 truncate block"
                >
                  {review.profile.googleReviewLink.length > 40 
                    ? `${review.profile.googleReviewLink.substring(0, 40)}...` 
                    : review.profile.googleReviewLink}
                </a>
              ) : "No review link added"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                review.isActivated 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {review.isActivated ? "Active" : "Inactive"}
              </span>
            </div>
            {review.activationCode && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Code</span>
                <span className="text-white text-xs font-mono truncate">{review.activationCode.slice(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/google-reviews/view/${review.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEye size={14} />
            <span>View</span>
          </Link>
          <Link 
            to={`/google-reviews/edit/${review.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-1 text-sm group-hover:shadow-lg"
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, count, hasItems, onActivate, loading, buttonText = "Activate Now", gradientColors = "from-cyan-500/20 to-blue-500/20", iconColor = "text-cyan-400" }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColors} border border-${iconColor.split('-')[1]}-500/30`}>
            <Icon className={iconColor} size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-sm text-gray-400">
              {loading ? "Loading..." : `${count} item${count !== 1 ? 's' : ''} • ${hasItems ? "Has active items" : "No active items"}`}
            </p>
          </div>
        </div>
        
        {!loading && count === 0 && (
          <button
            onClick={onActivate}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center gap-2 text-sm font-medium cursor-pointer hover:shadow-lg"
          >
            <FiPlus size={16} />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }}
      />

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] text-white pt-24 pb-12">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
          
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section with Balance & Referral */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Balance Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Wallet className="text-cyan-400" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    {loadingBalance ? (
                      <div className="h-8 w-32 bg-gray-700/50 rounded-lg animate-pulse mt-1" />
                    ) : (
                      <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        ₹{balance}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Referral Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
                      <Gift className="text-yellow-400" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Referral Code</p>
                      {loadingReferral ? (
                        <div className="h-6 w-40 bg-gray-700/50 rounded-lg animate-pulse mt-1" />
                      ) : (
                        <code className="text-xl font-bold text-yellow-300 font-mono">
                          {referralCode}
                        </code>
                      )}
                    </div>
                  </div>
                  
                  {!loadingReferral && (
                    <button
                      onClick={copyReferralCode}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="text-green-400" size={18} />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="text-yellow-400" size={18} />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Digital Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <SectionHeader
              icon={FaIdCard}
              title="Digital Cards"
              count={cards.length}
              hasItems={hasActiveCards}
              loading={loadingCards}
              onActivate={() => navigate("/card/activate")}
              buttonText="Activate Card"
            />

            {loadingCards ? (
              <LoadingSkeleton />
            ) : cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card, index) => (
                  <CardItem key={card._id || index} card={card} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                  <FaIdCard className="text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Digital Cards Yet</h3>
                <p className="text-gray-400 mb-6 text-sm">Create your first digital card to showcase your profile</p>
                <Link
                  to="/card/activate"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  <FiPlus size={16} />
                  <span>Activate Card</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Parking Tags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <SectionHeader
              icon={FaTags}
              title="Parking Tags"
              count={parkingTags.length}
              hasItems={hasActiveTags}
              loading={loadingTags}
              onActivate={() => navigate("/parking-tag/activate")}
              buttonText="Activate Parking Tag"
              gradientColors="from-emerald-500/20 to-green-500/20"
              iconColor="text-emerald-400"
            />

            {loadingTags ? (
              <LoadingSkeleton />
            ) : parkingTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {parkingTags.map((tag, index) => (
                  <ParkingTagItem key={tag._id || index} tag={tag} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                  <FaTags className="text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Parking Tags Yet</h3>
                <p className="text-gray-400 mb-6 text-sm">Activate a parking tag for convenient parking access</p>
                <Link
                  to="/parking-tag/activate"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                >
                  <FiPlus size={16} />
                  <span>Activate Parking Tag</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Google Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <SectionHeader
              icon={MdOutlineReviews}
              title="Google Reviews"
              count={googleReviews.length}
              hasItems={hasActiveReviews}
              loading={loadingReviews}
              onActivate={() => navigate("/google-reviews/activate")}
              buttonText="Activate Google Review"
              gradientColors="from-red-500/20 to-orange-500/20"
              iconColor="text-red-400"
            />

            {loadingReviews ? (
              <LoadingSkeleton />
            ) : googleReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {googleReviews.map((review, index) => (
                  <GoogleReviewItem key={review._id || index} review={review} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                  <MdOutlineReviews className="text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Google Reviews Yet</h3>
                <p className="text-gray-400 mb-6 text-sm">Activate Google Reviews to collect and manage customer feedback</p>
                <Link
                  to="/google-reviews/activate"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  <FiPlus size={16} />
                  <span>Activate Google Reviews</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Referral Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ReferralDashboard />
          </motion.div>
          
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default AdminPassToProfile;
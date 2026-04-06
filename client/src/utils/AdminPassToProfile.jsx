import React, { useEffect, useState } from "react";
import { 
  FiCopy, FiEye, FiEdit, FiArrowUpRight, FiCheck,
  FiPlus
} from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { FaTags, FaIdCard } from "react-icons/fa";
import { 
  Wallet, TrendingUp, Award, Gift, Users, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [balance, setBalance] = useState(0);
  
  // All sections expanded by default - no toggle needed
  const [expandedSections] = useState({
    cards: true,
    parkingTags: true,
    reviews: true
  });

  const Navigate = useNavigate();

  // Fetch user ID
  const fetchMyActiveCard = async () => {
    try {
      if (!token) return;
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/my-active-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(res.data.userId);
    } catch(err) {
      console.log(err);
    }
  };

  // Fetch all cards for user
  const fetchUserCards = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cards/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.data || [];
      const userData = data.find((item) => item.userId === userId);
      if (userData?.cards?.length > 0) {
        setCards(userData.cards);
      } else {
        setCards([]);
      }
    } catch (err) {
      console.error("Error fetching cards:", err);
      setCards([]);
    }
  };

  // Fetch parking tags
  const fetchUserParkingTags = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/tags/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.data || [];
      const userData = data.find((item) => item.userId === userId);
      if (userData?.tags?.length > 0) {
        setParkingTags(userData.tags);
      } else {
        setParkingTags([]);
      }
    } catch (err) {
      console.error("Error fetching parking tags:", err);
      setParkingTags([]);
    }
  };

  // Fetch Google Reviews
  const fetchGoogleReviews = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/reviews/user/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.data || [];
      setGoogleReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setGoogleReviews([]);
    }
  };

  // Get balance and referral code
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
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
    }
  };

  useEffect(() => {
    fetchMyActiveCard();
    fetchBalance();
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchUserCards();
      fetchUserParkingTags();
      fetchGoogleReviews();
    }
  }, [userId]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if section has active items
  const hasActiveCards = cards.some(card => card.isActivated);
  const hasActiveTags = parkingTags.some(tag => tag.isActivated);
  const hasActiveReviews = googleReviews.some(review => review.isActivated);

  // Card Item Component - Fixed hover lag
  const CardItem = ({ card, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-white/20 transition-all duration-200">
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-xl font-bold text-cyan-300">
                {card.profile?.name?.charAt(0) || "C"}
              </span>
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {card.profile?.name || "Unnamed Card"}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2">
              {card.profile?.bio || "No Bio"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                card.isActivated 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {card.isActivated ? "Activated" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/profile/${card.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-1 text-sm"
          >
            <FiEye size={14} />
            <span>View</span>
          </Link>
          <Link 
            to={`/profile/edit/${card.activationCode}`}
            className="flex-1 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-1 text-sm"
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Parking Tag Item Component - Fixed hover lag
  const ParkingTagItem = ({ tag, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden hover:border-white/20 transition-all duration-200">
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
              <FaTags className="text-emerald-400 text-xl" />
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {tag.owner?.name || "Parking Tag"}
            </h3>
            <p className="text-gray-400 text-xs">
              Vehicle: {tag.vehicleNumber || "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tag.isActivated 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {tag.isActivated ? "Activated" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Code:</span>
              <span className="text-white text-xs font-mono truncate">{tag.activationCode}</span>
            </div>
          </div>
        </div>

        <Link 
          to={`/parking-tag/${tag.activationCode}`}
          className="w-full py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 hover:from-emerald-500/30 hover:to-green-500/30 transition-all flex items-center justify-center gap-1 text-sm"
        >
          <FiEye size={14} />
          <span>View Details</span>
        </Link>
      </div>
    </motion.div>
  );

  // Section Header Component - No toggle button
  const SectionHeader = ({ icon: Icon, title, count, hasItems, onActivate }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <Icon className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{count} items • {hasItems ? "Has active items" : "No active items"}</p>
          </div>
        </div>
        
        {!hasItems && (
          <button
            onClick={onActivate}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <FiPlus size={16} />
            <span>Activate Now</span>
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
        }}
      />

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] text-white py-20">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
          
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
          
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Referral Section - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative mb-12"
          >
            <div className="w-full flex flex-col gap-6">
              {/* Balance Display */}
              <div className="flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/30 rounded-2xl">
                  <Wallet className="text-[#E1C48A]" size={24} />
                  <div>
                    <p className="text-xs text-gray-400">Available Balance</p>
                    <p className="font-bold text-2xl text-[#E1C48A]">₹{balance}</p>
                  </div>
                </div>
              </div>

              {/* Referral Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-red-500/10 rounded-full blur-3xl" />
                
                <div className="relative p-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
                        <Gift className="text-yellow-400" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Refer & Earn</h3>
                        <p className="text-gray-400 text-sm">Share your referral code and earn rewards</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/30">
                        <code className="font-mono text-lg font-bold text-yellow-300 tracking-wider">
                          {referralCode}
                        </code>
                      </div>
                      <button
                        onClick={copyReferralCode}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <FiCheck className="text-green-400" size={18} />
                            <span className="text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="text-yellow-400" size={18} />
                            <span className="text-sm">Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 1: Digital Cards - Always Expanded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-12"
          >
            <SectionHeader
              icon={FaIdCard}
              title="Digital Card"
              count={cards.length}
              hasItems={hasActiveCards}
              onActivate={() => Navigate("/card/activate")}
            />

            {cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card, index) => (
                  <CardItem key={card._id || index} card={card} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                  <FaIdCard className="text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No digital cards yet</h3>
                <p className="text-gray-400 mb-4 text-sm">Create your first digital card to get started</p>
                <Link
                  to="/card/activate"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all text-sm"
                >
                  <FiPlus size={16} />
                  <span>Activate Card</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Section 2: Parking Tags - Always Expanded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-12"
          >
            <SectionHeader
              icon={FaTags}
              title="Parking Tag"
              count={parkingTags.length}
              hasItems={hasActiveTags}
              onActivate={() => Navigate("/parking-tag/activate")}
            />

            {parkingTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {parkingTags.map((tag, index) => (
                  <ParkingTagItem key={tag._id || index} tag={tag} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
                  <FaTags className="text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No parking tags yet</h3>
                <p className="text-gray-400 mb-4 text-sm">Activate a parking tag for your vehicle</p>
                <Link
                  to="/parking-tag/activate"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all text-sm"
                >
                  <FiPlus size={16} />
                  <span>Activate Parking Tag</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Section 3: Google Reviews - Always Expanded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mb-12"
          >
            {/* <SectionHeader
              icon={MdOutlineReviews}
              title="Google Reviews"
              count={googleReviews.length}
              hasItems={hasActiveReviews}
              onActivate={() => toast.loading("Google Reviews feature coming soon!")}
            /> */}

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-white/10 p-6">
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                  <MdOutlineReviews className="text-red-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Google Reviews</h3>
              
                <button
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white font-medium hover:from-red-600 hover:to-orange-600 transition-all text-sm cursor-pointer"
                  onClick={() => toast.info("Google Reviews feature coming soon!")}
                >
                  <MdOutlineReviews size={16} />
                  <span>Connect Google Reviews</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Referral Dashboard - Bottom (Original Style) */}
          <ReferralDashboard />
          
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminPassToProfile;






// =================== OLD CODE - AdminPassToProfile.jsx =====================

// import React, { useEffect, useState } from "react";
// import { 
//   FiCopy, FiEye, FiEdit, FiArrowUpRight, FiCheck,
//   FiChevronDown, FiChevronUp
// } from "react-icons/fi";
// import { MdOutlineReviews } from "react-icons/md";
// import { FaTags } from "react-icons/fa";
// import { 
//   Zap, Briefcase, Eye, Pencil
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Toaster, toast } from "react-hot-toast";
// import { FaIdCard } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Header from "../Component/Header";
// import Footer from "../Component/Footer";
// import {Wallet} from "lucide-react";
// import ReferralDashboard from "./ReferralDashboard";

// const AdminPassToProfile = () => {
//    const [referralCode, setReferralCode] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [cards, setCards] = useState([]);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [viewMode, setViewMode] = useState("grid");
//   const [balance, setBalance] = useState(0);
 
//   // Fetch user ID first
//   const fetchMyActiveCard = async () => {
//     try {
//       if (!token) return;
//       const res = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/users/my-active-card`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setUserId(res.data.userId);
//     } catch(err) {
//       console.log(err);
//     }
//   };

//   // Fetch all cards for user
//   const fetchUserCards = async () => {
//     if (!userId) return;

//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/cards/user/${userId}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = res.data?.data || [];
//       // console.log("API Response:", data);

//       // Find user's cards array
//       const userData = data.find((item) => item.userId === userId);
//       // console.log("User Data:", userData);

//       if (userData?.cards?.length > 0) {
//         setCards(userData.cards);
//         // console.log("Cards set:", userData.cards);
//       } else {
//         setCards([]);
//       }
//     } catch (err) {
//       console.error("Error fetching cards:", err);
//       setCards([]);
//     }
//   };

//   useEffect(() => {
//     fetchMyActiveCard();
//   }, [token]);

//   useEffect(() => {
//     if (userId) {
//       fetchUserCards();
//     }
//   }, [userId]);


//   // // Get balance and referral code
//   // useEffect(() => {
//   //   const fetchBalance = async () => {
//   //     try {
//   //       const token = localStorage.getItem('token');
//   //       const res = await axios.get(
//   //         `${import.meta.env.VITE_BASE_URL}/api/users/balance`,
//   //         {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         }
//   //       );
//   //       setBalance(res.data.Balance);
//   //       setReferralCode(res.data.referalCode);
//   //       setUserId(res.data.userId);
//   //     } catch (err) {
//   //       setBalance(0);
//   //       console.log(err);
//   //     }
//   //   };
//   //   fetchBalance();
//   // }, []);



// // Get balance and referral code
//   useEffect(() => {
//     const fetchBalance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/api/users/balance`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setReferralCode(res.data.referalCode);
//         setBalance(res.data.Balance);
//         setUserId(res.data.userId);
//         // console.log(res.data)
//       } catch (err) {
//             setBalance(0);
//         console.log(err);
//       }
//     };
//     fetchBalance();
//   }, []);




//   const copyReferralCode = () => {
//     navigator.clipboard.writeText(referralCode);
//     setCopied(true);
//     toast.success("Referral code copied to clipboard!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const filteredCards = activeFilter === "all" 
//     ? cards 
//     : activeFilter === "active" 
//       ? cards.filter(card => card.isActivated)
//       : cards.filter(card => !card.isActivated);

//       const CardItem = ({ card, index }) => (
//         <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.1 }}
//         whileHover={{ y: -8, scale: 1.02 }}
//         className={`relative group cursor-pointer ${
//           viewMode === "grid" ? "col-span-1" : "col-span-2"
//           }`}
//           >
        

//       {/* Glow Effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl" />
      
//       <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden hover:border-white/20 transition-all duration-500">
//         {/* Card Content */}
//         <div className="mb-6">
//           <div className="flex items-center justify-center mb-4">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
//               <span className="text-2xl font-bold text-cyan-300">
//                 {card.profile?.name?.charAt(0) || "C"}
//               </span>
//             </div>
//           </div>

//           <div className="text-center mb-4">
//             <h3 className="text-xl font-bold text-white mb-1">
//               {card.profile?.name || "Unnamed Card"}
//             </h3>
//             <p className="text-gray-400 text-sm mb-2">
//               {card.profile?.bio || "No Bio"}
//             </p>
//           </div>

//           {/* Card Details */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400 text-sm">Status:</span>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                 card.isActivated 
//                   ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                   : "bg-red-500/20 text-red-400 border border-red-500/30"
//               }`}>
//                 {card.isActivated ? "Activated" : "Not Activated"}
//               </span>
//             </div>

//             {card.profile?.email && (
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400 text-sm">Email:</span>
//                 <span className="text-white text-sm truncate ml-2">{card.profile.email}</span>
//               </div>
//             )}

//             {card.profile?.phone && (
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400 text-sm">Phone:</span>
//                 <span className="text-white text-sm">{card.profile.phone}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-3">
//           <Link 
//             to={`/profile/${card.activationCode}`}
//             className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-2 group/btn"
//           >
//             <FiEye size={16} />
//             <span>View</span>
//             <FiArrowUpRight className="opacity-0 group-hover/btn:opacity-100 transition-opacity" size={14} />
//           </Link>
//           <Link 
//             to={`/profile/edit/${card.activationCode}`}
//             className="flex-1 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2 group/btn"
//           >
//             <FiEdit size={16} />
//             <span>Edit</span>
//             <FiArrowUpRight className="opacity-0 group-hover/btn:opacity-100 transition-opacity" size={14} />
//           </Link>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
//             color: '#fff',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             backdropFilter: 'blur(10px)',
//           },
//         }}
//       />

//       <Header />

//       <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] text-white overflow-hidden py-20">
//         {/* Animated Background */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           {/* Gradient Orbs */}
//           <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
          
//           {/* Grid Pattern */}
//           <div 
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
//               backgroundSize: '40px 40px'
//             }}
//           />
          
//           {/* Floating Particles */}
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, -20, 0],
//                 opacity: [0.3, 0.7, 0.3],
//               }}
//               transition={{
//                 duration: 3 + Math.random() * 2,
//                 repeat: Infinity,
//                 delay: Math.random() * 2,
//               }}
//             />
//           ))}
//         </div>



//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
//           {/* Referral Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="relative mb-8"
//           >

            
//             <div className="w-full flex items-center justify-center">
//                   <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/30 rounded-lg hover:border-[#E1C48A]/50 transition-all">
//                     <Wallet className="text-[#E1C48A]" size={18} />
//                     <div className="flex flex-col">
//                       <p className="text-xs text-gray-400">Balance</p>
//                       <p className="font-bold text-lg text-[#E1C48A]">₹{balance}</p>
//                     </div>
//                   </button>
//             </div>
//             <div className="w-full flex flex-col gap-5 items-center justify-evenly py-12  rounded-2xl bg-gradient-to-r to-gray-900/40 via-gray-900/30 from-gray-900/20">


// <motion.div 
//                   whileHover={{ scale: 1.05 }}
//                   className="relative group flex items-center lg:gap-20 md:gap-15 gap-4 lg:bg-gradient-to-r lg:from-gray-800/60 lg:to-gray-900/60 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer lg:px-6 md:px-6 py-3"
//                 >
                

//                 <Link to={"/parking-tag/activate"} className="hidden lg:flex bg-green-700/20 p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2">
// <FaTags size={20} /> Add Parking Tag</Link>

// <Link to={"/parking-tag/activate"} className="lg:hidden flex text-sm bg-green-700/20 p-2 rounded-lg cursor-pointer items-center justify-center gap-2">
// <FaTags size={50} /> Add Parking Tag</Link>
                  

//                   <Link to={"/card/activate"} replace className="flex text-sm bg-yellow-700/20 p-2 rounded-lg cursor-pointer items-center justify-center gap-2">
//                     <FaIdCard size={30} />
//                     Activate Card
//                   </Link>


// <button className="hidden lg:flex bg-blue-700/20 p-2 rounded-lg cursor-pointer items-center justify-center gap-2">
// <MdOutlineReviews size={20} />
// Add Google Reviews</button>

//                   <button className="lg:hidden flex text-sm bg-blue-700/20 p-2 rounded-lg cursor-pointer items-center justify-center gap-2">
// <MdOutlineReviews size={50} />
// Add Google Reviews</button>


//                 </motion.div>


//               <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
//                     <Zap className="text-yellow-400" size={20} />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-white">Your Referral Code</h3>
//                     <p className="text-sm text-gray-400">Share this code with friends</p>
//                   </div>
//                 </div>
                
//                 {/* Code Display */}
//                 <div className="mb-6">
//                   <div className="relative">
//                     <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/30">
//                       <div className="flex items-center justify-between gap-5">
//                         <code className="font-mono text-xl font-bold text-yellow-300 tracking-wider">
//                           {referralCode}
//                         </code>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={copyReferralCode}
//                           className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all cursor-pointer"
//                         >
//                           {copied ? (
//                             <FiCheck className="text-green-400" size={20} />
//                           ) : (
//                             <FiCopy className="text-yellow-400" size={20} />
//                           )}
//                         </motion.button>

//                       </div>

//                     </div>
                    
//                     {/* Decorative Elements */}
//                     <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full" />
//                     <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-500 rounded-full" />
//                   </div>
//                 </div>
//               </div>

//             </div>
            
//           </motion.div>

          

//           {/* Cards Dropdown Section
//           {cards.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl p-3 cursor-pointer mb-8"
//             >
//               <button
//                 onClick={() => setShowAllCards(!showAllCards)}
//                 className="flex items-center justify-between w-full cursor-pointer" 
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20">
//                     <Briefcase className="text-emerald-400" size={18} />
//                   </div>
//                   <div className="text-left">
//                     <p className="text-white font-medium">My Cards (Quick View)</p>
//                     <p className="text-xs text-gray-400">{cards.length} cards available</p>
//                   </div>
//                 </div>
//                 {showAllCards ? (
//                   <FiChevronUp className="text-gray-400" size={20} />
//                 ) : (
//                   <FiChevronDown className="text-gray-400" size={20} />
//                 )}
//               </button>

//               <AnimatePresence>
//                 {showAllCards && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="mt-3 space-y-2"
//                   >
//                     {cards.map((card, index) => (
//                       <motion.div
//                         key={card._id || index}
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="p-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
//                       >
//                         <div className="flex items-center justify-between gap-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
//                               <span className="text-lg font-bold text-cyan-300">
//                                 {card.profile?.name?.charAt(0) || "C"}
//                               </span>
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-white font-medium text-sm truncate">
//                                 {card.profile?.name || "Card"}
//                               </p>
//                               <p className="text-xs mt-1 text-gray-400 truncate">
//                                 {card.profile?.bio  || "No Bio"}
//                               </p>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                   card.isActivated 
//                                     ? "bg-green-500/20 text-green-400" 
//                                     : "bg-red-500/20 text-red-400"
//                                 }`}>
//                                   {card.isActivated ? "Active" : "Inactive"}
//                                 </span>
//                                 <span className="text-xs text-gray-500">{card.activationCode}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Link 
//                               to={`/profile/${card.activationCode}`}
//                               className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 transition-colors"
//                             >
//                               <Eye className="text-blue-400" size={16} />
//                             </Link>
//                             <Link
//                               to={`/profile/edit/${card.activationCode}`}
//                               className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 transition-colors"
//                             >
//                               <Pencil className="text-yellow-400" size={16} />
//                             </Link>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           )} */}

//           {/* Cards Grid Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 mb-8">
//               <div>
//                 <div className="w-full flex items-center justify-center gap-3 mb-2">
//                   <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
//                     <Briefcase className="text-purple-400" size={24} />
//                   </div>
//                   <h2 className="text-2xl font-bold text-white">Your Digital Cards</h2>
//                   <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
//                     <span className="text-sm font-semibold text-cyan-300">{cards.length} Cards</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Cards Grid */}
//             {filteredCards.length > 0 ? (
//               <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
//                 <AnimatePresence>
//                   {filteredCards.map((card, index) => (
//                     <CardItem key={card._id || index} card={card} index={index} />
//                   ))}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
//                   <Briefcase className="text-gray-500" size={40} />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">No cards found</h3>
//                 <p className="text-gray-400">Create your first digital card to get started</p>
//               </div>
//             )}
//           </motion.div>
//         </div>
// <ReferralDashboard />
//       </div>


//       <Footer />
//     </>
//   );
// };

// export default AdminPassToProfile;
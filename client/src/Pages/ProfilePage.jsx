import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiCopy,
  FiCheck,
  FiChevronRight,
  FiEdit,
  FiShare2,
  FiDownload,
  FiHeart,
  FiStar,
  FiBriefcase,
  FiUser,
  FiFacebook,
  FiUsers,
  FiAward,
  FiZap,
  FiGift
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Wallet, QrCode, Sparkles, Crown, Award, Zap, Briefcase, Star, Shield, Clock, Globe, Users, TrendingUp, Gift } from "lucide-react";

const ProfilePage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [showReferralTooltip, setShowReferralTooltip] = useState(false);

  // Get balance and referral code
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBalance(res.data.Balance);
        setReferralCode(res.data.referalCode);
      } catch (err) {
        setBalance(0);
        console.log(err);
      }
    };
    fetchBalance();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`
        );
        setProfile(res.data.profile);
        setShowEditButton(res.data.card._id);
        setId(res.data.card.slug);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReferralCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
    setShowReferralTooltip(false);
  };

  const handleWhatsApp = () => {
    if (profileData.phone) {
      const phoneNumber = profileData.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.name}'s Profile`,
          text: profileData.bio || `Connect with ${profileData.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#141628] to-[#0a0b14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading premium profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#141628] to-[#0a0b14] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400">Profile not found</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Prepare profile data with fallbacks
  const profileData = {
    name: profile?.name || "Full Name",
    email: profile?.email || "name@gmail.com",
    phone: profile?.phone || "+91 98765 43210",
    bio: profile?.bio || "Founder, Google",
    about: profile?.about || "Passionate about crafting timeless fashion and smart tech solutions that make everyday life better.",
    city: profile?.city || "Mumbai, India",
    website: profile?.website || "www.brilson.com",
    linkedin: profile?.linkedin || "linkedin.com/in/aaravmehta",
    twitter: profile?.twitter || "twitter.com/your-name",
    instagram: profile?.instagram || "instagram.com/your-name",
    facebook: profile?.facebook || "facebook.com/your-name",
  };

  const ContactCard = ({ icon, text, type = "text" }) => (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative p-4 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{text}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 capitalize">{type}</span>
            <button
              onClick={() => copyText(text)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Copy"
            >
              {copied ? <FiCheck className="text-green-400" size={16} /> : <FiCopy className="text-gray-400 hover:text-cyan-400" size={16} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SocialLink = ({ platform, url, icon, color }) => (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col items-center p-6 rounded-2xl ${color} transition-all duration-300 hover:shadow-xl hover:shadow-current/20`}
    >
      <div className="mb-3 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-medium text-white/90 capitalize">{platform}</span>
      <FiChevronRight className="absolute top-4 right-4 text-white/40 group-hover:text-white/60" size={16} />
    </motion.a>
  );

  const ActionButton = ({ icon, label, variant = "primary", onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300
        ${variant === 'primary' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/30' : ''}
        ${variant === 'whatsapp' ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/30' : ''}
        ${variant === 'email' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30' : ''}
        ${variant === 'accent' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/30' : ''}
        ${variant === 'secondary' ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white' : ''}
        w-full
      `}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }} 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#141628] to-[#0a0b14] text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>

        <div className="relative">
          {/* Premium Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-b from-black/80 via-gray-900/80 to-transparent backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 cursor-pointer">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-12 h-12">
                      <img src="/logo2.png" alt="" className="w-10" />
                    </div>
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Brilson</h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Desktop View Balance */}
                  <div className="hidden md:flex items-center gap-4">
                    {showEditButton && id && (
                      <Link 
                        to={`/profile/edit/${id}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium cursor-pointer"
                      >
                        <FiEdit size={16} /> Edit Profile
                      </Link>
                    )}
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <button className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all cursor-pointer">
                        <Wallet className="text-cyan-400" size={18} />
                        <div className="text-left">
                          <p className="text-xs text-gray-400">Balance</p>
                          <p className="font-bold text-lg text-cyan-300">₹{balance}</p>
                        </div>
                      </button>
                      
                      {referralCode && (
                        <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-72 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 z-50">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="text-yellow-400" size={16} />
                            <p className="text-sm font-medium text-white">Referral Program</p>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Share this code to earn rewards</p>
                          <div className="flex items-center justify-between gap-2">
                            <code className="flex-1 font-mono font-bold text-cyan-300 bg-white/5 px-3 py-2 rounded-lg">
                              {referralCode}
                            </code>
                            <button
                              onClick={handleCopyReferralCode}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
                            >
                              <FiCopy size={14} /> Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Mobile View Balance & Referral */}
                  <div className="md:hidden flex items-center gap-3">
                    {showEditButton && id && (
                      <Link 
                        to={`/profile/edit/${id}`}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        title="Edit Profile"
                      >
                        <FiEdit size={18} />
                      </Link>
                    )}
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <button 
                        onClick={() => setShowReferralTooltip(!showReferralTooltip)}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg transition-all"
                      >
                        <Wallet className="text-cyan-400" size={16} />
                        <span className="font-bold text-cyan-300 text-sm">₹{balance}</span>
                      </button>
                      
                      {/* Mobile Referral Tooltip */}
                      {showReferralTooltip && referralCode && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 top-full mt-2 w-64 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 z-50"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="text-yellow-400" size={16} />
                            <p className="text-sm font-medium text-white">Referral Code</p>
                            <button
                              onClick={() => setShowReferralTooltip(false)}
                              className="ml-auto text-gray-400 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Share to earn rewards</p>
                          <div className="flex items-center justify-between gap-2">
                            <code className="flex-1 font-mono font-bold text-cyan-300 bg-white/5 px-3 py-2 rounded-lg text-sm">
                              {referralCode}
                            </code>
                            <button
                              onClick={handleCopyReferralCode}
                              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm"
                            >
                              <FiCopy size={12} /> Copy
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Code Banner for Mobile */}
          {referralCode && (
            <div className="md:hidden mx-4 mt-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg">
                      <Gift className="text-yellow-400" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">Referral Code</p>
                      <p className="text-xs text-gray-300">Share to earn rewards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-yellow-300 bg-white/5 px-3 py-1 rounded-lg text-sm">
                      {referralCode}
                    </code>
                    <button
                      onClick={handleCopyReferralCode}
                      className="p-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/10 transition-colors"
                    >
                      <FiCopy className="text-yellow-400" size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* Profile Header */}
                  <div className="relative p-8">
                    
                    <div className="flex flex-col md:flex-row gap-8 lg:items-start md:items-start items-center">
                      {/* Profile Avatar */}
                      <div className="relative">
                        <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600"></div>
                          <div className="absolute inset-3 bg-gray-900 rounded-xl flex items-center justify-center">
                            
                            <div className="text-center">
                              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s" className="overflow-hidden rounded-lg" alt="" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Verified Badge */}
                        <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                          <Shield size={12} /> Verified
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="flex-1">
                        <div className="mb-6">
                          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-3">
                            {profileData.name}
                          </h2>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full">
                              <p className="text-cyan-300 font-medium">{profileData.bio}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <FiMapPin size={16} />
                              <span>{profileData.city}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {profileData.about}
                          </p>
                        </div>

                       
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-8 pt-0">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                          <FiUser className="text-cyan-400" size={20} />
                        </div>
                        Contact Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ContactCard 
                          icon={<FiSmartphone className="text-cyan-400" size={22} />}
                          text={profileData.phone}
                          type="Mobile"
                        />
                        <ContactCard 
                          icon={<FiMail className="text-red-400" size={22} />}
                          text={profileData.email}
                          type="Email"
                        />
                        <ContactCard 
                          icon={<FiGlobe className="text-green-400" size={22} />}
                          text={profileData.website}
                          type="Website"
                        />
                        <ContactCard 
                          icon={<FiMapPin className="text-purple-400" size={22} />}
                          text={profileData.city}
                          type="Location"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Actions */}
              <div className="space-y-8">
                {/* Referral Code Section - Visible on Desktop and Mobile */}
                {referralCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hidden bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-6 shadow-2xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                        <Gift className="text-yellow-400" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Refer & Earn</h2>
                        <p className="text-amber-200/80 text-sm">Share your code to earn rewards</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 border border-yellow-500/20 rounded-xl">
                        <p className="text-sm text-gray-300 mb-2">Your Referral Code</p>
                        <div className="flex items-center justify-between">
                          <code className="font-mono font-bold text-2xl text-yellow-300 tracking-wider">
                            {referralCode}
                          </code>
                          <button
                            onClick={handleCopyReferralCode}
                            className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/10 transition-colors"
                            title="Copy Code"
                          >
                            <FiCopy className="text-yellow-400" size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-amber-200/70 text-center">
                        Share this code with friends to earn exclusive rewards!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
                      <Zap className="text-yellow-400" size={20} />
                    </div>
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-4">
                    <ActionButton 
                      icon={<FiSmartphone size={20} />}
                      label="Call Now"
                      variant="primary"
                      onClick={() => copyText(profileData.phone)}
                    />
                    
                    <ActionButton 
                      icon={<FaWhatsapp size={20} />}
                      label="WhatsApp"
                      variant="whatsapp"
                      onClick={handleWhatsApp}
                    />
                    
                    <ActionButton 
                      icon={<FiMail size={20} />}
                      label="Send Email"
                      variant="email"
                      onClick={() => copyText(profileData.email)}
                    />
                    
                    <ActionButton 
                      icon={<FiShare2 size={20} />}
                      label="Share Profile"
                      variant="accent"
                      onClick={handleShare}
                    />
                    
                    {showEditButton && id && (
                      <Link to={`/profile/edit/${id}`}>
                        <ActionButton 
                          icon={<FiEdit size={20} />}
                          label="Edit Profile"
                          variant="secondary"
                        />
                      </Link>
                    )}
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <Globe className="text-purple-400" size={20} />
                    </div>
                    Social Profiles
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {profileData.linkedin && (
                      <SocialLink
                        platform="LinkedIn"
                        url={profileData.linkedin}
                        icon={<FiLinkedin className="text-white" size={24} />}
                        color="bg-gradient-to-br from-blue-700 to-blue-900"
                      />
                    )}
                    
                    {profileData.twitter && (
                      <SocialLink
                        platform="Twitter"
                        url={profileData.twitter}
                        icon={<FiTwitter className="text-white" size={24} />}
                        color="bg-gradient-to-br from-sky-600 to-blue-800"
                      />
                    )}
                    
                    {profileData.instagram && (
                      <SocialLink
                        platform="Instagram"
                        url={profileData.instagram}
                        icon={<FiInstagram className="text-white" size={24} />}
                        color="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500"
                      />
                    )}
                    
                    {profileData.facebook && (
                      <SocialLink
                        platform="Facebook"
                        url={profileData.facebook}
                        icon={<FiFacebook className="text-white" size={24} />}
                        color="bg-gradient-to-br from-blue-800 to-blue-900"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                        <QrCode className="text-cyan-400" size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Digital Business Card</h3>
                        <p className="text-cyan-200/80">Scan to save contact instantly</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      Scan this QR code with your phone camera to instantly save this contact to your address book. 
                      Perfect for networking events and business meetings.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => copyText(window.location.href)}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all flex items-center gap-3 shadow-lg hover:shadow-cyan-500/30"
                      >
                        <FiCopy /> Copy Profile Link
                      </button>
                      <button
                        onClick={handleShare}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all flex items-center gap-3"
                      >
                        <FiShare2 /> Share
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-64 h-64 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 flex items-center justify-center shadow-2xl">
                      <div className="text-center">
                        <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">QR</div>
                        <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full my-4"></div>
                        <p className="text-lg font-semibold text-white mb-1">Scan Me</p>
                        <p className="text-sm text-gray-400">Business Card</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                   <img src="/logo2.png" alt="" className="w-9" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Brilson
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="text-gray-400">© {new Date().getFullYear()} Brilson Inc.</span>
                  <span className="text-white/20">•</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
                  <span className="text-white/20">•</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
                  <span className="text-white/20">•</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
                </div>
              </div>
              
              <p className="text-center text-gray-500 text-sm mt-8">
                Crafting premium digital experiences for the modern world
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
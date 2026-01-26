import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiChevronRight,
  FiUsers,
  FiUser,
  FiBriefcase,
  FiShare2,
  FiCopy,
  FiCheck,
  FiFacebook,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  QrCode,
  Sparkles,
  Shield,
  Award,
  Zap,
  Star,
  Users as UsersIcon,
  Clock,
  TrendingUp,
  Globe,
  Crown,
  ArrowLeft,
} from "lucide-react";
import SocialButton from "./SocialButton";
import { CgWebsite } from "react-icons/cg";

const PublicProfilePage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`,
        );
        setProfile(res.data.profile);
      } catch (err) {
        toast.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  const copyText = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(` copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Profile`,
          text: profile?.bio || `Connect with ${profile?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied!");
    }
  };

  const handleWhatsApp = () => {
    if (profile?.phone) {
      const phoneNumber = profile.phone.replace(/\D/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#141628] to-[#0a0b14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] via-[#141628] to-[#0a0b14] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Profile not found</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const profileData = {
    name: profile?.name || "Guest User",
    email: profile?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    about: profile?.about || "No information provided",
    city: profile?.city || "",
    website: profile?.website || "/",
    linkedin: profile?.linkedin || "/",
    twitter: profile?.twitter || "/",
    instagram: profile?.instagram || "/",
    facebook: profile?.facebook || "/",
  };

    const ContactCard = ({ icon, text, type = "", onCopy, copied }) => {
      return (
      
      
      <motion.div
        whileHover={{ y: -3 }}
        className="
        group w-full
        flex items-center justify-between lg:gap-1 md:gap-1 gap-6
        px-4 py-2
        rounded-xl
        bg-gradient-to-br from-gray-900/60 to-gray-800/60
        backdrop-blur-xl
        border border-white/10
        hover:border-cyan-400/40
        transition-all duration-300
        "
        >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              flex items-center justify-center
              w-9 h-9
              rounded-lg
              bg-gradient-to-br from-cyan-500/15 to-blue-500/15
              text-cyan-400
              group-hover:from-cyan-500/25
              group-hover:to-blue-500/25
              transition-colors
              "
          >
            {icon}
          </div>
  
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {text}
            </p>
            {type && (
              <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                {type}
              </span>
            )}
          </div>
        </div>
  
        {/* Copy Button */}
        <button
          onClick={() => onCopy(text)}
          className="
            p-2 rounded-lg
            hover:bg-white/5
            transition-colors
            "
            title="Copy"
        >
          {copied ? (
            <FiCheck size={16} className="text-green-400" />
          ) : (
            <FiCopy size={16} className="text-gray-400 hover:text-cyan-400" />
          )}
        </button>
      </motion.div>
    );
  };
  
  const SocialLink = ({ platform, url, icon, color }) => (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col items-center p-6 rounded-2xl ${color} transition-all duration-300 hover:shadow-xl hover:shadow-current/20`}
    >
      <div className="mb-3 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-medium text-white/90 capitalize">
        {platform}
      </span>
      <FiChevronRight
        className="absolute top-4 right-4 text-white/40 group-hover:text-white/60"
        size={16}
      />
    </motion.a>
  );

  const ActionButton = ({ icon, label, variant = "primary", onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 w-full
        ${variant === "primary" ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/30" : ""}
        ${variant === "whatsapp" ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/30" : ""}
        ${variant === "email" ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30" : ""}
        ${variant === "accent" ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/30" : ""}
        ${variant === "secondary" ? "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white" : ""}
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
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
                <div className="flex items-center gap-4 px-10">
                  <Link to="/" className="flex items-center gap-4 group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img src="/logo2.png" alt="" className="w-7" />
                        <h2 className="text-3xl">RILSON</h2>
                      </div>
                    </motion.div>

                    {/* <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                      <ArrowLeft size={18} />
                      <span className="hidden sm:inline">Back to Home</span>
                    </div> */}
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
                  >
                    <FiShare2 size={16} /> Share
                  </motion.button>

                  <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-full">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-xs font-medium text-cyan-300">
                      PUBLIC PROFILE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

<div className="flex justify-center w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Profile Section */}
            <div className="grid grid-cols-1 gap-8">
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
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s"
                                className="rounded-lg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="flex-1">
                        <div className="mb-6">
                          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-3">
                            {profileData.name}
                          </h2>

                          {profileData.bio && (
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full">
                                <p className="text-cyan-300 font-medium">
                                  {profileData.bio}
                                </p>
                              </div>
                              {profileData.city && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <FiMapPin size={16} />
                                  <span>{profileData.city}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-gray-300 leading-relaxed text-lg">
                            {profileData.about}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-2xl mb-4"
                  >
                    {/* <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
    <Zap className="text-yellow-400" size={20} />
    </div>
    Quick Actions
    </h2> */}

                    <div className="grid grid-cols-3 gap-3">
                      {/* Call Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyText(profileData.phone)}
                        className="flex items-center justify-center gap-2 lg:p-3 md:p-3 cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                      >
                        <FiSmartphone size={22} />
                        <span className="text-sm font-medium">Call Now</span>
                      </motion.button>

                      {/* WhatsApp Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 lg:p-3 md:p-3 p-2 cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30"
                      >
                        <FaWhatsapp size={22} />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </motion.button>

                      {/* Email Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyText(profileData.email)}
                        className="flex items-center justify-center gap-2 lg:p-3 md:p-3 p-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 "
                      >
                        <FiMail size={22} />
                        <span className="text-sm font-medium">Email</span>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl 
                    border border-white/10 rounded-3xl p-5 shadow-2xl mb-5"
                  >
                    <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                        <Globe className="text-purple-400" size={18} />
                      </div>
                      Social Profiles
                    </h2>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {profileData.linkedin && (
                        <SocialButton
                        label="LinkedIn"
                        url={profileData.linkedin}
                        icon={<FiLinkedin />}
                        gradient="from-blue-700 to-blue-900"
                        />
                      )}

                      {profileData.twitter && (
                        <SocialButton
                          label="Twitter"
                          url={profileData.twitter}
                          icon={<FiTwitter />}
                          gradient="from-sky-600 to-blue-800"
                          />
                      )}

                      {profileData.instagram && (
                        <SocialButton
                        label="Instagram"
                        url={profileData.instagram}
                        icon={<FiInstagram />}
                        gradient="from-purple-600 via-pink-600 to-red-500"
                        />
                      )}

                      {profileData.website && (
                        <SocialButton
                        label="Website"
                        url={profileData.website}
                        icon={<CgWebsite />}
                        gradient="from-blue-800 to-blue-900"
                        />
                      )}
                    </div>
                  </motion.div>

                {/* Contact Information */}
                                  <div className="p-8 pt-0">
                                    <div className="mb-8">
                                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                                          <FiUser className="text-cyan-400" size={20} />
                                        </div>
                                        Contact Information
                                      </h2>
                                      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                        <ContactCard 
                                          icon={<FiSmartphone className="text-cyan-400" size={22} />}
                                          text={profileData.phone}
                                          // type="Mobile"
                                          />
                                        <ContactCard 
                                          icon={<FiMail className="text-red-400" size={22} />}
                                          text={profileData.email}
                                          // type="Email"
                                          />
                                        <ContactCard 
                                          icon={<FiGlobe className="text-green-400" size={22} />}
                                          text={profileData.website}
                                          // type="Website"
                                          />
                                          {console.log(profileData.email, profileData.phone)}
                                      </div>
                                    </div>
                                  </div>
                </motion.div>
              </div>
            </div>

            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center justify-center bg-gradient-to-br from-cyan-900/10 via-blue-900/10 to-purple-900/10 backdrop-blur-xl rounded-3xl overflow-hidden"
              >


                  <div className="relative">
                    <div className="w-64 h-64 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 flex items-center justify-center shadow-2xl">
                    <QrCode className="text-cyan-400" size={240} />
                      
                    </div>
                    
                  </div>
            </motion.div>


{/* Footer */}


                </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfilePage;

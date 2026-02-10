import React, { useEffect, useState, useRef } from "react";
import {
  FiMail, 
  FiEdit,
  FiBriefcase, FiUser, FiFacebook, FiLinkedin,
  FiTwitter, FiInstagram, FiChevronRight
} from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Wallet, QrCode,
  Briefcase, Globe, 
   ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon, Target, Camera, Box, Palette,
  Phone, MessageCircle, MapPin, Award as AwardIcon,
  Users as UsersIcon, Calendar
} from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import ServicesProfile from "./ProfileComp/ServicesProfile";
import PortfolioProfile from "./ProfileComp/PortfolioProfile";
import ProductsProfile from "./ProfileComp/ProductsProfile";
import GalleryProfile from "./ProfileComp/GalleryProfile";

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
  const [userId, setUserId] = useState(null);
  const [logo, setLogo] = useState();


  // Refs for section observation
  const aboutRef = useRef(null);
  const connectRef = useRef(null);
  
  const [activeSection, setActiveSection] = useState("about");



  // GET PROFILE LOGO
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-logo/get/${slug}`
        );

        setLogo(res.data.profileLogo.image);
      } catch (err) {
        // toast.error("Failed to load logo");
      }
    };

    fetchLogo();
  }, [slug]);




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
        setUserId(res.data.userId);
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

  const scrollToSection = (sectionId) => {
    const sections = {
      about: aboutRef,
      connect: connectRef,
      products: productsRef,
      portfolio: portfolioRef,
      services: servicesRef,
      gallery: galleryRef
    };

    const section = sections[sectionId];
    if (section && section.current) {
      section.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#E1C48A]/30 border-t-[#E1C48A] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading premium profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400">Profile not found</p>
          <Link to="/" className="text-[#E1C48A] hover:text-[#F5D8A5] mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Prepare profile data with fallbacks
  const profileData = {
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "Smart solutions that move your business forward",
    about: profile?.about || "",
    city: profile?.city || "",
    website: profile?.website || "",
    linkedin: profile?.linkedin || "",
    twitter: profile?.twitter || "",
    instagram: profile?.instagram || "",
    facebook: profile?.facebook || "",
    title: profile?.title || "",
    company: profile?.company || ""
  };

  const SectionHeader = ({ title, icon, sectionId, children }) => (
  <div
    className="mb-10 text-white"
    ref={
      sectionId === "about"
        ? aboutRef
        : sectionId === "connect"
        ? connectRef
        : null
    }
  >
    <div className="py-4 rounded-xl ">
      <div className="flex items-center gap-3 px-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
          {React.cloneElement(icon, {
            className: "text-[#E1C48A]",
            size: 20,
          })}
        </div>

        <h2 className="text-xl font-bold text-[#E1C48A]">
          {title}
        </h2>
      </div>
    </div>

    <div className="mt-2">
      {children}
    </div>
  </div>
);



  const ContactButton = ({ icon, label, onClick, color = "#E1C48A" }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300 w-full"
    >
        {React.cloneElement(icon, { size: 20, style: { color }  })}
      <span className="font-medium text-white flex-1 text-left">{label}</span>
      <FiChevronRight className="text-gray-400" size={16} />
    </motion.button>
  );

  const SocialLink = ({ platform, url, icon, color }) => (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300"
    >
        {React.cloneElement(icon, { size: 20, style: { color } })}
      <span className="font-medium text-white flex-1 text-left">{platform}</span>
    </motion.a>
  );

  // Mobile device ke liye

  const SocialLink1 = ({ platform, url, icon, color }) => (
  <motion.a
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.95 }}
    href={url.startsWith("http") ? url : `https://${url}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      min-w-[90px]
      h-[80px]
      flex flex-col items-center justify-center gap-2
      rounded-2xl
      bg-gradient-to-r from-white/5 to-transparent
      border border-white/10
      shadow-lg
      hover:border-[#E1C48A]/40
      transition-all duration-300
      shrink-0
    "
  >
    <div
      className="w-10 h-10 flex items-center justify-center rounded-full"
      style={{ backgroundColor: `${color}20` }}
    >
      {React.cloneElement(icon, {
        size: 18,
        style: { color },
      })}
    </div>

    <span className="text-xs text-gray-300 font-medium">
      {platform}
    </span>
  </motion.a>
);



  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #0a0a0f 0%, #0f1117 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }} 
      />
      
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white bg-transparent">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1C48A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Header with Balance */}
        <div className="sticky top-0 z-50 bg-gradient-to-b from-black/80 via-gray-900/80 to-transparent backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  {/* <h2 className="text-2xl font-bold text-[#E1C48A]">BRILSON</h2> */}
                     <div className="text-4xl font-Playfair font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Brilson
              </div>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-4">
                
                {showEditButton && id && (
                  <Link 
                    to={`/profile/edit/${id}`}
                    className="md:flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium flex"
                  >
                    <FiEdit size={16} /> Edit Profile
                  </Link>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/30 rounded-lg hover:border-[#E1C48A]/50 transition-all">
                    <Wallet className="text-[#E1C48A]" size={18} />
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-400">Balance</p>
                      <p className="font-bold text-lg text-[#E1C48A]">₹{balance}</p>
                    </div>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>


      
        {/* Main Profile Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
        
            
            {/* Main Profile Card */}
            <div className="relative bg-transparent border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center mb-10">
                {/* Round Profile Image */}
                <div className="relative mb-2">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#E1C48A] shadow-xl">
                    <img
                      src={`${logo}`}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name and Title */}
                <h2 className="text-4xl font-bold text-white mb-2">
                  {profileData.name}
                </h2>
                <p className="text-xl text-yellow-600 mb-1">{profileData.title}</p>
                <p className="text-gray-400 mb-6">{profileData.company}</p>
                
                {/* Tagline */}
                <div className="px-7 py-2 bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/30 rounded-full">
                  <p className="text-[#E1C48A] italic text-lg">{profileData.bio}</p>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <ContactButton
                  icon={<Phone />}
                  label="Call"
                  onClick={() => copyText(profileData.phone)}
                  color="#FF7F11"
                />
                <ContactButton
                  icon={<FaRegMessage />}
                  label="WhatsApp"
                  onClick={handleWhatsApp}
                  color="#FF7F11"
                />
                <ContactButton
                  icon={<FiMail />}
                  label="Email"
                  onClick={() => copyText(profileData.email)}
                  color="#FF7F11"
                />
                <ContactButton
                  icon={<FiUserPlus />}
                  label="Save Contact"
                  onClick={handleShare}
                  color="#FF7F11"
                />
              </div>

           

              {/* Sections */}
              <div className="space-y-12">
               
                {/* CONNECT Section */}

<div className="lg:flex hidden flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
<h3 className="text-2xl font-bold text-gray-300 mb-4">Connect</h3>
  <div className="lg:flex hidden flex-wrap items-center justify-between gap-2">
    <SocialLink
      platform="Website"
      url={profileData.website}
      icon={<CgWebsite />}
      color="#8B5CF6"
      />
    <SocialLink
      platform="Instagram"
      url={profileData.instagram}
      icon={<FiInstagram />}
      color="#EC4899"
      />
    <SocialLink
      platform="Facebook"
      url={profileData.facebook}
      icon={<FiFacebook />}
      color="#3B82F6"
      />
    <SocialLink
      platform="YouTube"
      url="https://youtube.com"
      icon={<FaYoutube />}
      color="#EF4444"
      />
    <SocialLink
      platform="LinkedIn"
      url={profileData.linkedin}
      icon={<FiLinkedin />}
      color="#0A66C2"
    />
    <SocialLink
      platform="Twitter"
      url={profileData.twitter}
      icon={<FiTwitter />}
      color="#1DA1F2"
    />
  </div>
  </div>


{/* mobile device ke liye */}


<div className="lg:hidden flex flex-colp-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">

<div className="lg:hidden flex flex-wrap items-center justify-between gap-2">
    <SocialLink1
      platform="Website"
      url={profileData.website}
      icon={<CgWebsite />}
      color="#8B5CF6"
      />
    <SocialLink1
      platform="Instagram"
      url={profileData.instagram}
      icon={<FiInstagram />}
      color="#EC4899"
      />
    <SocialLink1
      platform="Facebook"
      url={profileData.facebook}
      icon={<FiFacebook />}
      color="#3B82F6"
      />
    <SocialLink1
      platform="YouTube"
      url="https://youtube.com"
      icon={<FaYoutube />}
      color="#EF4444"
      />
    <SocialLink1
      platform="LinkedIn"
      url={profileData.linkedin}
      icon={<FiLinkedin />}
      color="#0A66C2"
      />
    <SocialLink1
      platform="Twitter"
      url={profileData.twitter}
      icon={<FiTwitter />}
      color="#1DA1F2"
      />
  </div>
      </div>




 {/* About Section */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">About:</h3>
                  <div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {profileData.about}
                    </p>
                  </div>
                </div>
                

{/* Portfolio */}
<div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">Portfolio:</h3>
                  <PortfolioProfile activationCode={slug} />
                </div>


{/* Product */}
<div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">Products:</h3>
                  <ProductsProfile activationCode={slug} />
                </div>




{/* Services */}
<div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">Services:</h3>
                  <ServicesProfile activationCode={slug} />
                </div>


{/* Gallery */}
<div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">Gallery:</h3>
                  <GalleryProfile activationCode={slug} />
                </div>



                
              {/* QR Code Section */}
                <div className="mt-16 p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-[#E1C48A] mb-6">Digital Business Card</h3>
                    <div className="w-32 h-32  bg-white rounded-2xl mx-auto mb-6">
                      <QrCode size={50} className="text-black w-full h-full" />
                    </div>
                    <p className="text-gray-400 text-md mb-8">
                      Scan to save contact or visit profile instantly
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleShare}
                        className="px-8 py-3 bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Share Profile
                      </button>
                      <button className="px-8 py-3 bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-xl text-white hover:border-[#E1C48A]/40 transition-colors">
                        Download QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
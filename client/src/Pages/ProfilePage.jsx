import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { CiLocationOn } from "react-icons/ci";
import { LuYoutube } from "react-icons/lu";
import { TbWorld } from "react-icons/tb";
import {
  FiMail,
  FiEdit,
  FiBriefcase,
  FiUser,
  FiFacebook,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiChevronRight,
} from "react-icons/fi";
import { CiShare2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Wallet,
  QrCode,
  Briefcase,
  Globe,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Target,
  Camera,
  Box,
  Palette,
  Phone,
  MessageCircle,
  MapPin,
  Award as AwardIcon,
  Users as UsersIcon,
  Calendar,
} from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import ServicesProfile from "./ProfileComp/ServicesProfile";
import PortfolioProfile from "./ProfileComp/PortfolioProfile";
import ProductsProfile from "./ProfileComp/ProductsProfile";
import GalleryProfile from "./ProfileComp/GalleryProfile";
import ProfileFooter from "./ProfileComp/EditProfileComp/ProfileFooter";
import PaymentDetailsProfile from "./ProfileComp/PaymentDetailsProfile";
import ProfileLocation from "./ProfileComp/ProfileLocation";
// import downloadCSV from "./ProfileComp/SaveCSVfileContact";
import downloadVCF from "./ProfileComp/SaveVCFfile";
import ProfileResume from "./ProfileComp/ProfileResume";

const ProfilePage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [showReferralTooltip, setShowReferralTooltip] = useState(false);
  const [userId, setUserId] = useState(null);
  const [logo, setLogo] = useState();
  const [preview, setPreview] = useState(null);

  // Refs for section observation
  const aboutRef = useRef(null);
  const connectRef = useRef(null);

  const [activeSection, setActiveSection] = useState("about");

  // GET PROFILE LOGO
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-logo/get/${slug}`,
        );

        setLogo(res.data.profileLogo.image);
      } catch (err) {
        // toast.error("Failed to load logo");
      }
    };

    fetchLogo();
  }, [slug]);

  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`,
        );
        setProfile(res.data.profile);
        // console.log(res.data.profile.whatsapp);
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
      gallery: galleryRef,
    };

    const section = sections[sectionId];
    if (section && section.current) {
      section.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
    if (profileData.whatsapp) {
      const phoneNumber = profileData.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  const handlePhone = () => {
    if (profileData.whatsapp) {
      const phoneNumber = profileData.whatsapp.replace(/\D/g, "");
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    console.log(profileData.email);
    if (profileData.email) {
      window.location.href = `mailto:${profileData.email}`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          // title: `${profileData.name}'s Profile`,
          // text: profileData.bio || `Connect with ${profileData.name}`,
          url: `https://brilson.in/public/profile/${slug}`,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied!");
    }
  };

  const handleDownloadQr = (url) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-qr.png";
    link.target = "_blank";
    link.click();
  };

  if (loading) {
    return (
<>
<Helmet>
        <title>Loading Profile... | Brilson</title>
        <meta name="description" content="Loading premium digital business card profile" />
        <meta property="og:title" content="Brilson - Digital Business Cards" />
        <meta property="og:image" content="https://brilson.in/default-og-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#E1C48A]/30 border-t-[#E1C48A] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading premium profile...</p>
        </div>
      </div>
</>
    );
  }

  if (!profile) {
    return (
      <>

      <Helmet>
        <title>Profile Not Found | Brilson</title>
        <meta name="description" content="The requested profile could not be found" />
        <meta property="og:title" content="Profile Not Found | Brilson" />
        <meta property="og:image" content="https://brilson.in/default-og-image.jpg" />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400">Profile not found</p>
          <Link
            to="/"
            className="text-[#E1C48A] hover:text-[#F5D8A5] mt-4 inline-block"
            >
            Go back home
          </Link>
        </div>
      </div>
            </>
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
    whatsapp:profile?.whatsapp || "",
    website: profile?.website || "",
    linkedin: profile?.linkedin || "",
    twitter: profile?.twitter || "",
    instagram: profile?.instagram || "",
    facebook: profile?.facebook || "",
    title: profile?.title || "",
    company: profile?.company || "",
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

          <h2 className="text-xl font-bold text-[#E1C48A]">{title}</h2>
        </div>
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );

  const ContactButton = ({ icon, label, onClick, color = "#E1C48A" }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300 w-full font-Poppins"
    >
      {React.cloneElement(icon, { size: 20, style: { color } })}
      <span className="font-medium text-white flex-1 text-left">{label}</span>
      <FiChevronRight className="text-gray-400" size={16} />
    </motion.button>
  );

  const SocialLink = ({ platform, url, icon, color }) => (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-r from-slate-800/40 to-transparent border border-slate-800 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300 font-Poppins "
    >
      {React.cloneElement(icon, { size: 20, style: { color } })}
      <span className="font-medium text-white flex-1 text-left">
        {platform}
      </span>
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
      flex flex-col items-center justify-center gap-2 shadow-lg
      transition-all duration-300
      shrink-0 font-Poppins p-1 w-20 bg-gradient-to-r from-slate-800/40 to-transparent border border-slate-800 rounded-xl
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

      <span className="text-xs text-gray-300 font-medium">{platform}</span>
    </motion.a>
  );

  // set Contact Data for the csv
  const contact = {
    name: profileData.name,
    phone: profileData.phone,
    email: profileData.email,
    company: profileData.company,
    website: profileData.website,
  };

  return (
    <>
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{profileData.name ? `${profileData.name}'s Profile | Brilson` : 'Profile | Brilson'}</title>
      {/* <meta 
        name="description" 
        content={profileData.about || profileData.bio || `Connect with ${profileData.name} on Brilson`} 
      /> */}
      
      {/* Open Graph Meta Tags Facebook, WhatsApp, LinkedIn */}
      <meta property="og:title" content={`${profileData.name}'s Profile | Brilson`} />
      {/* <meta 
        property="og:description" 
        content={profileData.about || profileData.bio || `Connect with ${profileData.name}`} 
      /> */}
      <meta property="og:image" content={logo || 'https://brilson.in/default-og-image.jpg'} />
      <meta property="og:url" content={`https://brilson.in/public/profile/${slug}`} />
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content="Brilson" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${profileData.name}'s Profile | Brilson`} />
      {/* <meta 
        name="twitter:description" 
        content={profileData.about || profileData.bio || `Connect with ${profileData.name}`} 
      /> */}
      <meta name="twitter:image" content={logo || 'https://brilson.in/default-og-image.jpg'} />
      
      {/* Additional SEO Tags */}
      <meta name="keywords" content={`${profileData.name}, ${profileData.title}, ${profileData.company}, digital business card, brilson`} />
      <meta name="author" content={profileData.name} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`https://brilson.in/public/profile/${slug}`} />
      
      {/* WhatsApp Specific - ye additional meta tags helpful hain */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${profileData.name}'s profile picture`} />
    </Helmet>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "linear-gradient(135deg, #0a0a0f 0%, #0f1117 100%)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
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
              backgroundSize: "40px 40px",
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
                  {/* <div className="text-4xl font-Playfair font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Brilson
              </div> */}
                  <button
                    onClick={handleShare}
                    className="lg:flex md:flex hidden px-8 py-3 bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] text-black font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-Poppins"
                  >
                    Share Profile
                  </button>
                </motion.div>
              </div>

              <div className="flex items-center gap-4">
                {showEditButton && id && (
                  <Link
                    to={`/profile/edit/${id}`}
                    className="md:flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium flex font-Poppins"
                  >
                    <FiEdit size={16} /> Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Container */}
        <div className="relative z-10 max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
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
                <h2 className="text-4xl font-bold font-Playfair text-white mb-2">
                  {profileData.name}
                </h2>
                <p className="text-xl text-yellow-600 mb-1">
                  {profileData.title}
                </p>
                              <div className="px-6 py-5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
  <div className="flex items-start gap-4">
    {/* Decorative icon */}
    <div className="hidden sm:block">
      <svg className="w-8 h-8 text-[#E1C48A]/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
      </svg>
    </div>
    
    <div className="flex-1">
      <p className="text-gray-300 text-lg md:text-xl font-light italic leading-relaxed">
        {profileData.bio}
      </p>
      
      {/* Author line (optional) */}
      <p className="mt-2 text-right text-sm text-gray-500">
        — {profileData.name || 'User'}
      </p>
    </div>
  </div>
</div>

                {/* <p className="text-gray-400 mb-6 font-semibold font-Poppins">
                  {profileData.company}
                </p> */}
               
              </div>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <ContactButton
                  icon={<Phone />}
                  label="Call"
                  onClick={handlePhone}
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
                  onClick={handleEmail}
                  color="#FF7F11"
                />
                <ContactButton
                  icon={<FiUserPlus />}
                  label="Save Contact"
                  onClick={() => {
                    downloadVCF(profileData, logo);
                  }}
                  color="#FF7F11"
                />
              </div>

              <button
                onClick={handleShare}
                className="lg:hidden md:hidden p-2 w-full flex items-center justify-center gap-3 bg-gradient-to-l to-slate-900 from-slate-950 border-2 border-white/10 rounded-lg mb-5"
              >
                <CiShare2 size={24} className="text-yellow-400 font-bold" />{" "}
                <span className="text-lg">Share Profile</span>
              </button>

              {/* Sections */}
              <div className="space-y-12">
                {/* CONNECT Section */}

                <div className="lg:flex hidden flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">
                    Connect
                  </h3>
                  <div className="lg:flex hidden flex-wrap items-center justify-between gap-2">
                    <SocialLink
                      platform="Website"
                      url={profileData.website}
                      icon={<TbWorld />}
                      color="#06D001"
                    />
                    <SocialLink
                      platform="Instagram"
                      url={profileData.instagram}
                      icon={<FiInstagram />}
                      color="#DC143C"
                    />
                    <SocialLink
                      platform="Facebook"
                      url={profileData.facebook}
                      icon={<FiFacebook />}
                      color="#6F00FF"
                    />
                    <SocialLink
                      platform="YouTube"
                      url="https://youtube.com"
                      icon={<LuYoutube />}
                      color="#F63049"
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

                <div
                  className="w-full 
  border border-white/10 
  p-4 
  rounded-xl 
  mb-5 
  flex items-center gap-3 
  shadow-lg 
  bg-gradient-to-r from-slate-900 to-slate-950
  backdrop-blur-md"
                >
                  <IoLocationOutline
                    size={22}
                    className="text-yellow-400 shrink-0"
                  />

                  <span className="text-gray-200 text-sm leading-relaxed break-words font-Poppins">
                    {profileData.city}
                  </span>
                </div>

                {/* mobile device ke liye */}

                <div className="lg:hidden flex">
                  <div className="lg:hidden grid grid-cols-4 items-center justify-between gap-4">
                    <SocialLink1
                      platform="Website"
                      url={profileData.website}
                      icon={<TbWorld />}
                      color="#06D001"
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
                  <h3 className="text-2xl font-bold mb-3 text-gray-300">
                    About:
                  </h3>
                  <div>
                    <p className="text-gray-300 leading-relaxed text-md font-Poppins">
                      {profileData.about}
                    </p>
                  </div>
                </div>

                {/* Portfolio */}
                {/* <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3 text-gray-300">Portfolio:</h3>
                  <PortfolioProfile activationCode={slug} />
                </div> */}

                {/* Product */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-3 text-gray-300">
                    Products:
                  </h3>
                  <ProductsProfile activationCode={slug} />
                </div>

                {/* Services */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-3 text-gray-300">
                    Services:
                  </h3>
                  <ServicesProfile activationCode={slug} />
                </div>

                {/* Gallery */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-3 text-gray-300">
                    Gallery:
                  </h3>
                  <GalleryProfile activationCode={slug} />
                </div>


{/* Resume */}
                <div className="">
                  {/* <h3 className="text-2xl font-bold mb-3 text-gray-300 flex items-center gap-2">
                    <CiLocationOn size={28} /> Resume
                  </h3> */}
                  <ProfileResume activationCode={slug} />
                </div>



{/* Location */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-3 text-gray-300 flex items-center gap-2">
                    <CiLocationOn size={28} /> Location & Reviews
                  </h3>
                  <ProfileLocation activationCode={slug} />
                </div>

                
                {/* Payment Details */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  {/* <h3 className="text-2xl font-bold mb-3 text-gray-300">
                    Payment Details
                  </h3> */}
                  <PaymentDetailsProfile activationCode={slug} />
                </div>



              </div>
            </div>
          </motion.div>
          <ProfileFooter />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

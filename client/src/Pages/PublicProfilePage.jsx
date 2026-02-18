import React, { useEffect, useState, useRef } from "react";
import {
  FiMail, 
  FiChevronRight,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiTwitter
} from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  QrCode,
  Phone,
  Eye,
  Globe
} from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import ServicesProfile from "./ProfileComp/ServicesProfile";
import PortfolioProfile from "./ProfileComp/PortfolioProfile";
import ProductsProfile from "./ProfileComp/ProductsProfile";
import GalleryProfile from "./ProfileComp/GalleryProfile";
import ProfileFooter from "./ProfileComp/EditProfileComp/ProfileFooter";
import downloadCSV from "./ProfileComp/SaveCSVfileContact";
import downloadVCF from "./ProfileComp/SaveVCFfile";
import { CiShare2 } from "react-icons/ci";


const PublicProfilePage = () => {
  const { slug } = useParams();
  console.log("slug:", slug);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublicView, setIsPublicView] = useState(true);
  const [logo, setLogo] = useState();
  const [preview, setPreview] = useState(null);


  // fetch paymetn qr
  useEffect(() => {
    const fetchqr = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile-paymentQr/get`);

            // console.log(res)
            setPreview(res.data.paymentqr.image);

        }catch(err){
            console.log(err);
        }
    }
    fetchqr();
  },[]);





  // fetch profile logo
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



  // Fetch profile data for public view
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`
        );
        console.log(res.data)
        setProfile(res.data.profile);
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
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
          console.log('Sharing cancelled');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Profile link copied!');
      }
    };


    const handleWhatsApp = () => {
    if (profileData.phone) {
      const phoneNumber = profileData.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

   const handlePhone = () => {
    if (profileData.phone) {
      const phoneNumber = profileData.phone.replace(/\D/g, '');
      window.open(`tel:${phoneNumber}`);
    }
  };


    const handleEmail = () => {
    // console.log(profileData.email);
  if (profileData.email) {
    window.location.href = `mailto:${profileData.email}`;
  }
};


    const handleDownloadQr = (url) => {
  if (!url) return;

  const link = document.createElement("a");
  link.href = url;
  link.download = "payment-qr.png";
  link.target = "_blank"
  link.click();
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#E1C48A]/30 border-t-[#E1C48A] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading public profile...</p>
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

  const ContactButton = ({ icon, label, onClick, color = "#E1C48A" }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300 w-full font-Poppins"
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
      className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#E1C48A]/40 transition-all duration-300 font-Poppins"
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
      shrink-0 font-Poppins
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



// set Contact Data for the csv 
const contact = {
  name:profileData.name,
  phone:profileData.phone,
  email:profileData.email,
  company:profileData.company,
  website:profileData.website,
}

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

        {/* Public Profile Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-b from-black/80 via-gray-900/80 to-transparent backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
          
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
              <div className="flex flex-col items-center text-center mb-10 mt-4">
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
                <p className="text-xl text-yellow-600 mb-1 font-Poppins">{profileData.title}</p>
                <p className="text-gray-400 mb-6 font-Poppins">{profileData.company}</p>
                
                {/* Tagline */}
                <div className="px-7 py-2 bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/30 rounded-full">
                  <p className="text-[#E1C48A] italic text-lg font-Poppins">{profileData.bio}</p>
                </div>
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
                  onClick={() => {downloadVCF(profileData, logo)}}
                  color="#FF7F11"
                />
              </div>


              <button onClick={handleShare} className="lg:hidden md:hidden p-2 w-full flex items-center justify-center gap-3 bg-gradient-to-l to-slate-900 from-slate-950 border-2 border-white/10 rounded-lg mb-5">
              <CiShare2 size={24} className="text-yellow-400 font-bold" /> <span className="text-lg font-Poppins">Share Profile</span>
              </button>

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

                {/* Mobile device ke liye */}
                <div className="lg:hidden flex flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800 to-transparent border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">Connect</h3>
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
                      <img src={preview} alt="" className="w-ful h-full object-cover" />
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
                                           <button
  onClick={() => handleDownloadQr(preview)}
  className="px-8 py-3 bg-gradient-to-r from-white/10 to-transparent border border-white/10 rounded-xl text-white hover:border-[#E1C48A]/40 transition-colors cursor-pointer"
>
  Download QR
</button>
                    </div>
                  </div>
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

export default PublicProfilePage;
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
  FiUsers,
  FiEdit,
  FiUser,
  FiBriefcase,
  FiShare2,
  FiAward,
  FiFileText
} from "react-icons/fi";
import { FaRegCopy, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Wallet } from "lucide-react";

const ProfilePage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center text-white">
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
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    about: profile?.about || "",
    city: profile?.city || "",
    website: profile?.website || "",
    linkedin: profile?.linkedin || "",
    twitter: profile?.twitter || "",
    instagram: profile?.instagram || "",
  };

  const ContactInfo = ({ icon, text, type = "text" }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors group">
      <div className="p-2 bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      <span className="text-gray-300 flex-1 break-words">{text}</span>
      <button
        onClick={() => copyText(text)}
        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        title="Copy"
      >
        {copied ? <FiCheck className="text-green-400" /> : <FiCopy className="text-gray-400 hover:text-cyan-400" />}
      </button>
    </div>
  );

  const SocialLink = ({ platform, url, icon }) => (
    <motion.a
      whileHover={{ scale: 1.02 }}
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-cyan-500/10 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <span className="font-medium capitalize">{platform}</span>
          <p className="text-gray-400 text-sm">Visit profile</p>
        </div>
      </div>
      <FiChevronRight className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
    </motion.a>
  );

  const SectionCard = ({ title, icon, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl ${className}`}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-20">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FiChevronRight className="rotate-180" /> Back to Home
              </Link>

              <div className="lg:flex hidden bg-gradient-to-r from-slate-700 to-slate-900 px-4 flex items-center  justify-center gap-2 py-2 rounded-2xl">
                <Wallet className="text-yellow-400" />
                <span>Balance:</span>
                <span className="text-lg font-semibold">₹{balance}</span>
              </div>
</div>

{/* Referral Code Section For Desktop */}
                {referralCode && (
                  <div className="lg:flex hidden mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/20 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <p className="text-gray-300 mb-1">Your Referral Code:</p>
                        <p className="text-yellow-400 font-mono font-bold">{referralCode}</p>
                      </div>
                      <button
                        onClick={handleCopyReferralCode}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
                      >
                        <FaRegCopy /> Copy
                      </button>
                    </div>
                  </div>
                )}


                <div className="flex items-center gap-10" >
 {/* show balance for the user on Mobile */}

 <div className="lg:hidden bg-gradient-to-r from-slate-700 to-slate-900 px-4 flex items-center  justify-center gap-2 py-2 rounded-2xl">
                <Wallet className="text-yellow-400" />
                <span>Balance:</span>
                <span className="text-lg font-semibold">₹{balance}</span>
              </div>


{/* Referral Code Section For Mobile */}
{referralCode && (
  <div className="lg:hidden flex mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/20 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-gray-300 mb-1 text-sm">Your Referral Code:</p>
                      <div className="text-sm flex items-center justify-center flex-col gap-1">
                        <p className="text-yellow-400 font-mono font-bold text-[15px]">{referralCode}</p>
                      <button
                        onClick={handleCopyReferralCode}
                        className="flex items-center gap-2 px-2 py-1 text-sm bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
                        >
                        <FaRegCopy size={10} /> Copy
                      </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>



            <div className="flex gap-3">
              {showEditButton && id && (
                <Link 
                to={`/profile/edit/${id}`}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all shadow-lg"
                >
                  <FiEdit /> Edit Profile
                </Link>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 px-4 py-3 rounded-xl transition-all"
              >
                <FiShare2 /> Share Profile
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-gray-700 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600"></div>
                  <div className="absolute inset-2 bg-gray-900 rounded-xl flex items-center justify-center">
                    <FiUser className="w-20 h-20 text-cyan-300" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  PRO
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {profileData.name || "Anonymous"}
                  </h1>
                
                  {profileData.bio && (
                    <p className="text-gray-300 text-lg md:text-xl italic mb-4 max-w-2xl">
                      "{profileData.bio}"
                    </p>
                  )}
                  {profileData.city && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                      <FiMapPin /> {profileData.city}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {profileData.email && (
                    <a
                      href={`mailto:${profileData.email}`}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <FiMail /> Email
                    </a>
                  )}
                  {profileData.phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                  )}
                  {profileData.website && (
                    <a
                      href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <FiGlobe /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - About & Contact */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <SectionCard title="About Me" icon={<FiBriefcase className="text-cyan-400" />}>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {profileData.about || "No information provided"}
                  </p>
                </div>
              </SectionCard>

              {/* Contact Information */}
              <SectionCard title="Contact Information" icon={<FiMail className="text-cyan-400" />}>
                <div className="space-y-3">
                  {profileData.email && (
                    <ContactInfo icon={<FiMail />} text={profileData.email} />
                  )}
                  {profileData.phone && (
                    <ContactInfo icon={<FiSmartphone />} text={profileData.phone} />
                  )}
                  {profileData.website && (
                    <ContactInfo icon={<FiGlobe />} text={profileData.website} />
                  )}
                  {profileData.city && (
                    <ContactInfo icon={<FiMapPin />} text={profileData.city} />
                  )}
                </div>
              </SectionCard>

              {/* Social Links */}
              <SectionCard title="Connect With Me" icon={<FiUsers className="text-cyan-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profileData.linkedin && (
                    <SocialLink
                      platform="LinkedIn"
                      url={profileData.linkedin}
                      icon={<FiLinkedin className="text-blue-400" />}
                    />
                  )}
                  {profileData.twitter && (
                    <SocialLink
                      platform="Twitter"
                      url={profileData.twitter}
                      icon={<FiTwitter className="text-sky-400" />}
                    />
                  )}
                  {profileData.instagram && (
                    <SocialLink
                      platform="Instagram"
                      url={profileData.instagram}
                      icon={<FiInstagram className="text-pink-400" />}
                    />
                  )}
                </div>
                </SectionCard>
            </div>

            {/* Right Column - Quick Actions & QR */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <SectionCard title="Quick Actions" icon={<FiAward className="text-cyan-400" />}>
                <div className="space-y-3">
                  {profileData.email && (
                    <button
                      onClick={() => copyText(profileData.email)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FiCopy className="text-gray-400" />
                        <span>Copy Email</span>
                      </div>
                    </button>
                  )}
                  {profileData.phone && (
                    <button
                      onClick={() => copyText(profileData.phone)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FiCopy className="text-gray-400" />
                        <span>Copy Phone</span>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => copyText(window.location.href)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FiShare2 className="text-gray-400" />
                      <span>Copy Profile Link</span>
                    </div>
                  </button>
                </div>
              </SectionCard>

              {/* QR Code */}
              <SectionCard title="Digital Business Card" icon={<FiFileText className="text-cyan-400" />}>
                <div className="text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 mb-4">
                    <div className="w-48 h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl flex items-center justify-center border-2 border-dashed border-cyan-500/20">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-cyan-300">QR</div>
                        <p className="text-sm text-cyan-200 mt-2">Scan to Connect</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Scan this QR code to save contact
                  </p>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800/50">
            <p className="text-gray-500">
              Powered by <span className="text-cyan-400 font-semibold">Brilson</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">© {new Date().getFullYear()} • Professional Digital Business Card</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
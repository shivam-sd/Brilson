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
  FiMessageSquare,
  FiShare2
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ProfilePage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

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

  const hasSocialLinks = profileData.linkedin || profileData.twitter || profileData.instagram;
  const hasContactInfo = profileData.email || profileData.phone || profileData.website;

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

  const ContactInfo = ({ icon, text, type = "text" }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/30 transition-colors group">
      <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      <span className="text-gray-300 flex-1 break-words">{text}</span>
      <button
        onClick={() => copyText(text)}
        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Copy"
      >
        {copied ? <FiCheck className="text-green-400" /> : <FiCopy className="text-gray-400" />}
      </button>
    </div>
  );

  const SocialLink = ({ platform, url, icon }) => (
    <motion.a
      whileHover={{ x: 5 }}
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-cyan-500/10 transition-colors">
          {icon}
        </div>
        <div>
          <span className="font-medium capitalize">{platform}</span>
          <p className="text-gray-400 text-sm">Visit profile</p>
        </div>
      </div>
      <FiChevronRight className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
    </motion.a>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
            <div className="flex gap-3">
              {showEditButton && id && (
                <Link 
                  to={`/profile/edit/${id}`}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <FiEdit /> Edit Profile
                </Link>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl transition-colors"
              >
                <FiShare2 /> Share
              </button>
            </div>
          </div>

          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl"
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600"></div>
                  <div className="absolute inset-2 bg-gray-900 rounded-xl flex items-center justify-center">
                    <FiUser className="w-16 h-16 md:w-20 md:h-20 text-cyan-300" />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold px-4 py-2 rounded-full">
                  PRO
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {profileData.name || "Anonymous"}
                    </h1>
                    {profileData.bio && (
                      <p className="text-gray-300 italic text-lg md:text-xl mb-4">
                        "{profileData.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {profileData.email && (
                    <a
                      href={`mailto:${profileData.email}`}
                      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <FiMail /> Email
                    </a>
                  )}
                  {profileData.phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiShare2 /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700/50 mb-8">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`pb-4 px-1 text-lg font-medium border-b-2 transition-colors ${
                    activeTab === "about"
                      ? "border-cyan-400 text-cyan-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiMessageSquare className="inline mr-2" /> About
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`pb-4 px-1 text-lg font-medium border-b-2 transition-colors ${
                    activeTab === "contact"
                      ? "border-cyan-400 text-cyan-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiUsers className="inline mr-2" /> Contact
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === "about" && profileData.about && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert max-w-none"
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FiBriefcase className="text-cyan-400" /> About Me
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {profileData.about}
                  </p>
                </motion.div>
              )}

              {activeTab === "contact" && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FiMail className="text-cyan-400" /> Contact Information
                    </h3>
                    <div className="space-y-3">
                      {profileData.email && (
                        <ContactInfo
                          icon={<FiMail />}
                          text={profileData.email}
                        />
                      )}
                      {profileData.phone && (
                        <ContactInfo
                          icon={<FiSmartphone />}
                          text={profileData.phone}
                        />
                      )}
                      {profileData.website && (
                        <ContactInfo
                          icon={<FiGlobe />}
                          text={profileData.website}
                        />
                      )}
                      {profileData.city && (
                        <ContactInfo
                          icon={<FiMapPin />}
                          text={profileData.city}
                        />
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FiUsers className="text-cyan-400" /> Social Links
                    </h3>
                    <div className="space-y-3">
                      {!hasSocialLinks ? (
                        <p className="text-gray-500 text-center py-4">
                          No social links added
                        </p>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Digital Business Card</h3>
            <div className="inline-block p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 mb-4">
              <div className="w-48 h-48 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl flex items-center justify-center border-2 border-dashed border-cyan-500/30">
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-300">QR</div>
                  <p className="text-sm text-cyan-200 mt-2">Scan to Connect</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Scan this QR code to save {profileData.name}'s contact information
            </p>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800/50">
            <p className="text-gray-500">
              Powered by <span className="text-cyan-400 font-semibold">Brilson</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">© {new Date().getFullYear()} • Digital Business Card</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
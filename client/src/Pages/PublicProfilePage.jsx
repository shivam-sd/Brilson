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
  FiMessageSquare,
  FiShare2,
  FiAward,
  FiBook,
  FiCalendar,
  FiFileText,
  FiCopy,
  FiCheck
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

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
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`
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
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${profile.name}'s Profile`,
        text: profile.bio || `Connect with ${profile.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied");
    }
  };

  const handleWhatsApp = () => {
    if (profile.phone) {
      const phoneNumber = profile.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
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
          <p className="text-xl text-gray-400 mb-4">Profile not found</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const ContactInfo = ({ icon, label, value, type = "text" }) => (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors group">
      <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-400">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-gray-200 break-all">{value}</p>
      </div>
      <button
        onClick={() => copyText(value, label)}
        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        title={`Copy ${label}`}
      >
        {copied === label ? (
          <FiCheck className="text-green-400" />
        ) : (
          <FiCopy className="text-gray-400 hover:text-cyan-400" />
        )}
      </button>
    </div>
  );

  const SocialLink = ({ platform, url, icon, color }) => (
    <motion.a
      whileHover={{ scale: 1.02 }}
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-cyan-500/50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        <div>
          <p className="font-medium capitalize">{platform}</p>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiChevronRight className="rotate-180" /> Back to Home
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 px-4 py-2 rounded-xl transition-all"
            >
              <FiShare2 /> Share Profile
            </button>
          </div>

          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl"
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-8">
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
                    {profile.name}
                  </h1>
                  {profile.bio && (
                    <p className="text-gray-300 text-lg md:text-xl italic mb-4 max-w-2xl">
                      "{profile.bio}"
                    </p>
                  )}
                  {profile.city && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                      <FiMapPin /> {profile.city}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <FiMail /> Email
                    </a>
                  )}
                  {profile.phone && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-lg transition-all shadow-lg"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
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

            {/* Grid Layout for All Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <SectionCard title="About Me" icon={<FiBriefcase className="text-cyan-400" />}>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {profile.about || "No information provided"}
                  </p>
                </SectionCard>

                {/* Contact Information */}
                <SectionCard title="Contact Information" icon={<FiMail className="text-cyan-400" />}>
                  <div className="space-y-3">
                    {profile.email && (
                      <ContactInfo 
                        icon={<FiMail />} 
                        label="Email" 
                        value={profile.email} 
                      />
                    )}
                    {profile.phone && (
                      <ContactInfo 
                        icon={<FiSmartphone />} 
                        label="Phone" 
                        value={profile.phone} 
                      />
                    )}
                    {profile.website && (
                      <ContactInfo 
                        icon={<FiGlobe />} 
                        label="Website" 
                        value={profile.website} 
                      />
                    )}
                    {profile.city && (
                      <ContactInfo 
                        icon={<FiMapPin />} 
                        label="Location" 
                        value={profile.city} 
                      />
                    )}
                  </div>
                </SectionCard>

                {/* Social Links */}
                {profile.linkedin || profile.twitter || profile.instagram ? (
                  <SectionCard title="Social Links" icon={<FiUsers className="text-cyan-400" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.linkedin && (
                        <SocialLink
                          platform="LinkedIn"
                          url={profile.linkedin}
                          icon={<FiLinkedin className="text-blue-400" />}
                          color="bg-blue-400"
                        />
                      )}
                      {profile.twitter && (
                        <SocialLink
                          platform="Twitter"
                          url={profile.twitter}
                          icon={<FiTwitter className="text-sky-400" />}
                          color="bg-sky-400"
                        />
                      )}
                      {profile.instagram && (
                        <SocialLink
                          platform="Instagram"
                          url={profile.instagram}
                          icon={<FiInstagram className="text-pink-400" />}
                          color="bg-pink-400"
                        />
                      )}
                    </div>
                  </SectionCard>
                ) : null}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <SectionCard title="Quick Actions" icon={<FiAward className="text-cyan-400" />}>
                  <div className="space-y-3">
                    {profile.email && (
                      <button
                        onClick={() => copyText(profile.email, "Email")}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FiCopy className="text-gray-400" />
                          <span>Copy Email</span>
                        </div>
                        {copied === "Email" && <FiCheck className="text-green-400" />}
                      </button>
                    )}
                    {profile.phone && (
                      <button
                        onClick={() => copyText(profile.phone, "Phone")}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FiCopy className="text-gray-400" />
                          <span>Copy Phone</span>
                        </div>
                        {copied === "Phone" && <FiCheck className="text-green-400" />}
                      </button>
                    )}
                    <button
                      onClick={() => copyText(window.location.href, "Profile Link")}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FiShare2 className="text-gray-400" />
                        <span>Copy Profile Link</span>
                      </div>
                      {copied === "Profile Link" && <FiCheck className="text-green-400" />}
                    </button>
                  </div>
                </SectionCard>

                {/* QR Code */}
                <SectionCard title="Digital Card" icon={<FiFileText className="text-cyan-400" />}>
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
                      Scan this QR code to save {profile.name}'s contact
                    </p>
                  </div>
                </SectionCard>

                {/* Profile Stats */}
                {/* <SectionCard title="Profile Stats" icon={<FiCalendar className="text-cyan-400" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-gray-800/30">
                      <div className="text-2xl font-bold text-cyan-400">24</div>
                      <div className="text-gray-400 text-sm">Connections</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-800/30">
                      <div className="text-2xl font-bold text-cyan-400">98%</div>
                      <div className="text-gray-400 text-sm">Response Rate</div>
                    </div>
                  </div>
                </SectionCard> */}
              </div>
            </div>
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

export default PublicProfilePage;
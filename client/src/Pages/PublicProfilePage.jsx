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
  FiShare2
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
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`
        );
        setProfile(res.data.profile);
        // console.log(res)
      } catch (err) {
        toast.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: profile.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-gray-400 hover:text-white">
              ← Back
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl"
            >
              <FiShare2 /> Share
            </button>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 border border-gray-700 rounded-3xl p-8 shadow-xl"
          >
            {/* Top */}
            <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <FiUser className="text-6xl text-white" />
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.bio && (
                  <p className="text-gray-300 mt-2 italic">
                    "{profile.bio}"
                  </p>
                )}

                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
                    >
                      <FiMail />
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`https://wa.me/${profile.phone}`}
                      target="_blank"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                    >
                      <FaWhatsapp />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6 flex gap-8">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-3 ${
                  activeTab === "about"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400"
                }`}
              >
                <FiMessageSquare /> About
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={`pb-3 ${
                  activeTab === "contact"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400"
                }`}
              >
                <FiUsers /> Contact
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "about" && (
              <div>
                <h3 className="text-xl font-semibold mb-2 flex gap-2">
                  <FiBriefcase className="text-cyan-400" /> About
                </h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {profile.about || "No description provided."}
                </p>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid md:grid-cols-2 gap-6">
                {profile.email && (
                  <Info label="Email" value={profile.email} icon={<FiMail />} />
                )}
                {profile.phone && (
                  <Info label="Phone" value={profile.phone} icon={<FiSmartphone />} />
                )}
                {profile.website && (
                  <Info label="Website" value={profile.website} icon={<FiGlobe />} />
                )}
                {profile.city && (
                  <Info label="Location" value={profile.city} icon={<FiMapPin />} />
                )}
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-10">
            Powered by <span className="text-cyan-400">Brilson</span>
          </p>
        </div>
      </div>
    </>
  );
};

const Info = ({ label, value, icon }) => (
  <div className="bg-gray-800/40 p-4 rounded-xl flex gap-3 items-center">
    <div className="text-cyan-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-gray-200 break-all">{value}</p>
    </div>
  </div>
);

export default PublicProfilePage;

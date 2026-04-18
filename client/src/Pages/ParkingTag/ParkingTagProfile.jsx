import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  Phone,
  MapPin,
  Car,
  MessageCircle,
  Calendar,
  Tag,
  User,
  Mail,
  Navigation,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FaCar } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";

const ParkingTagProfile = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTagData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios(
          `${import.meta.env.VITE_BASE_URL}/api/tag/${slug}`,
        );
        console.log("API Response:", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load parking tag data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTagData();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: `https://brilson.in/profile/P/public/${slug}`,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    }
  }

  // Custom Parking Tag Loader
  const ParkingTagLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated Car */}
          <motion.div
            animate={{ x: [-100, 100, -100] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Car size={60} className="text-purple-400" />
          </motion.div>

          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
          />

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-purple-300 text-lg font-medium">
            Loading Parking Tag Details
          </p>
          <p className="text-gray-400 text-sm mt-2">Please wait...</p>
        </motion.div>
      </div>
    </div>
  );

  if (loading) return <ParkingTagLoader />;

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md">
          <AlertCircle size={60} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const profile = data.tag.profile || {};
  const tag = data.tag || {};

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center py-6 px-4 min-h-screen pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            {/* Main Card */}
            <div className="bg-white/10 backdrop-blur-xl shadow-2xl shadow-black cursor-pointer rounded-3xl py-6 px-3 border border-white/70 ">
              {/* Header Section with Avatar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-2">
                    <FaCar size={48} className="text-white animate-pulse" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute -bottom-2 -right-2 animate-bounce">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        tag.isActivated
                          ? "bg-green-500/90 text-white"
                          : "bg-yellow-500/90 text-white"
                      }`}
                    >
                      {tag.isActivated ? (
                        <>
                          <CheckCircle size={12} />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          <span>Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mt-4 tracking-widest font-Playfair ">
                  {profile.ownerName || "Owner Name"}
                </h2>
              </motion.div>

              {/* Vehicle Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 tracking-widest font-Playfair">
                  <Car size={18} className="text-purple-400" />
                  Vehicle Information
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm flex items-center gap-2 tracking-widest font-Playfair">
                      <Car size={14} className="text-cyan-400" />
                      Vehicle Number
                    </span>
                    <span className="text-white text-sm tracking-widest font-Playfair font-extrabold ">
                      {profile.vehicleNumber || "Not Added"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm flex items-center gap-2 tracking-widest font-Playfair">
                      <MapPin size={14} className="text-cyan-400" />
                      Vehicle Type
                    </span>
                    <span className="text-white font-bold text-sm tracking-widest font-Playfair uppercase">
                      {profile.vehicleType || "Not Specified"}
                    </span>
                  </div>

                  {profile.vehicleModel && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm flex items-center gap-2">
                        <Navigation size={14} className="text-cyan-400" />
                        Model
                      </span>
                      <span className="text-white font-bold text-sm">
                        {profile.vehicleModel}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 tracking-widest font-Playfair">
                  <User size={18} className="text-purple-400" />
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm flex items-center gap-2 tracking-widest font-Playfair">
                      <User size={14} className="text-cyan-400" />
                      Owner Name
                    </span>
                    <span className="text-white text-sm tracking-widest font-Playfair font-extrabold">
                      {profile.ownerName || "Not Provided"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm flex items-center gap-2 tracking-widest font-Playfair">
                      <Phone size={14} className="text-cyan-400" />
                      Phone Number
                    </span>
                    <span className="text-white text-sm tracking-widest font-Playfair font-extrabold">
                      {profile.phone || "Not Provided"}
                    </span>
                  </div>

                  {profile.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm flex items-center gap-2">
                        <Mail size={14} className="text-cyan-400" />
                        Email
                      </span>
                      <span className="text-white text-sm truncate max-w-[200px]">
                        {profile.email}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Tag Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 tracking-widest font-Playfair">
                  <Shield size={18} className="text-purple-400" />
                  Tag Details
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm flex items-center gap-2 tracking-widest font-Playfair">
                      <Calendar size={14} className="text-cyan-400" />
                      Activated On
                    </span>
                    <span className="text-white text-sm flex items-center gap-1 tracking-widest font-Playfair font-extrabold">
                      <Clock size={12} />
                      {tag.activatedAt
                        ? new Date(tag.activatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "Not Activated"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <button
                onClick={handleShare}
                className="lg:flex md:flex px-8 py-3 w-full p-2 bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] text-black font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-Poppins mb-5 flex items-center justify-center"
              >
                Share Profile
              </button>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3"
              >
                <Link
                  to={`tel:${profile.phone}`}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <Phone size={18} className="relative z-10" />
                  <span className="relative z-10">Call Now</span>
                </Link>

                <Link
                  to={`https://wa.me/${profile.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <MessageCircle size={18} className="relative z-10" />
                  <span className="relative z-10">WhatsApp</span>
                </Link>
              </motion.div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                  <Shield size={12} />
                  Secure Parking Tag • Verified Owner
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export default ParkingTagProfile;

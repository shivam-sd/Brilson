import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Car, Phone, User, AlertCircle } from "lucide-react";
import Header from "../../Component/Header"
import Footer from "../../Component/Footer";

const EditParkingTagProfile = () => {
  const { slug } = useParams();
  console.log(slug);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form data
  const [form, setForm] = useState({
    ownerName: "",
    vehicleType: "",
    vehicleNumber: "",
    phone: "",
  });

  // Vehicle types
  const vehicleTypes = [
    { value: "car", label: "🚗 Car", icon: "🚗" },
    { value: "bike", label: "🏍️ Bike", icon: "🏍️" },
    { value: "suv", label: "🚙 SUV", icon: "🚙" },
    { value: "truck", label: "🚚 Truck", icon: "🚚" },
    { value: "auto", label: "🛺 Auto Rickshaw", icon: "🛺" },
    { value: "bus", label: "🚌 Bus", icon: "🚌" },
    { value: "other", label: "🚗 Other", icon: "🚗" },
  ];

  // Fetch parking tag data
  useEffect(() => {
    const fetchParkingTagData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/tag/${slug}`,
          { withCredentials: true }
        );
        
        console.log("Fetched Data:", res.data);
        
        const profile = res.data.tag.profile || {};
        
        setForm({
          ownerName: profile.ownerName || "",
          vehicleType: profile.vehicleType || "",
          vehicleNumber: profile.vehicleNumber || "",
          phone: profile.phone || "",
        });
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load parking tag data");
      } finally {
        setFetching(false);
      }
    };

    if (slug) {
      fetchParkingTagData();
    }
  }, [slug]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number
    if (name === "phone" && value.length > 10) {
      return;
    }
    
    setForm({ ...form, [name]: value });
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.ownerName.trim()) {
      toast.error("Owner name is required");
      return;
    }

    if (!form.vehicleType) {
      toast.error("Please select vehicle type");
      return;
    }

    if (!form.vehicleNumber.trim()) {
      toast.error("Vehicle number is required");
      return;
    }

    if (!form.phone || form.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/tag/${slug}/edit`,
        {
          ownerName: form.ownerName,
          vehicleType: form.vehicleType,
          vehicleNumber: form.vehicleNumber.toUpperCase(),
          phone: form.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Parking tag profile updated successfully");

      setTimeout(() => {
        navigate(`/profile/P/${slug}`, { replace: true });
      }, 800);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
            />
          </div>
          <p className="text-purple-300 mt-4">Loading parking tag data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      /> 

        <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 ">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4">
              <Car size={40} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Edit Parking Tag
            </h2>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Owner Name */}
              <div className="mb-6">
                <label className="text-white font-medium mb-2 flex items-center gap-2">
                  <User size={18} className="text-purple-400" />
                  Owner Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  required
                />
              </div>

              {/* Vehicle Type */}
              <div className="mb-6">
                <label className="text-white font-medium mb-2 flex items-center gap-2">
                  <Car size={18} className="text-purple-400" />
                  Vehicle Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-gray-800">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Number */}
              <div className="mb-6">
                <label className="text-white font-medium mb-2 flex items-center gap-2">
                  <Car size={18} className="text-purple-400" />
                  Vehicle Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g., UP78KJS1234"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none uppercase"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Vehicle number will be automatically converted to uppercase</p>
              </div>

              {/* Phone Number */}
              <div className="mb-8">
                <label className="text-white font-medium mb-2 flex items-center gap-2">
                  <Phone size={18} className="text-purple-400" />
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter 10 digit mobile number"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Enter 10 digit mobile number without country code</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => navigate(`/parking-tag/${id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <AlertCircle size={14} />
              This information will be visible to anyone who views your parking tag
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditParkingTagProfile;
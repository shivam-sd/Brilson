import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  X, 
  Star, 
  Link as LinkIcon, 
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const EditGoogleReviewsProfile = () => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    brandName: "",
    googleReviewLink: ""
  });

  const [errors, setErrors] = useState({});

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/google-review/profile/${activationCode}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data?.profile) {
          setFormData({
            brandName: response.data.profile.brandName || "",
            googleReviewLink: response.data.profile.googleReviewLink || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setFetching(false);
      }
    };

    if (activationCode) {
      fetchProfile();
    }
  }, [activationCode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }
    
    if (formData.brandName.trim().length < 2) {
      newErrors.brandName = "Brand name must be at least 2 characters";
    }
    
    if (formData.googleReviewLink && !isValidUrl(formData.googleReviewLink)) {
      newErrors.googleReviewLink = "Please enter a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/google-reviews/${activationCode}/edit`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.data) {
        setSaved(true);
        toast.success("Profile updated successfully!");
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate(`/profile/google-review/${activationCode}`, {replace:true});
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1117] to-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl" />
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <p className="text-gray-200 mt-2">
            Update your business information to attract more reviews
          </p>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center border border-green-500/30">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Saved Successfully!</h3>
                <p className="text-gray-400">Redirecting to profile...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            
            {/* Top Gradient Bar */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              
              {/* Google Icon Preview */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3 tracking-widest font-Playfair text-center">
                  Google Review Profile
                </label>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-md opacity-50" />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-10 h-10 text-red-400 mx-auto mb-1" />
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>

              {/* Brand Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-red-400" />
                    <span className="tracking-widest font-Playfair">Brand Name <span className="text-red-400">*</span></span>
                  </div>
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Enter your business/brand name"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.brandName ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                />
                {errors.brandName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.brandName}
                  </p>
                )}
              
              </div>

              {/* Google Review Link Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-red-400" />
                    <span className="font-Playfair tracking-widest">Google Review Link</span>
                  </div>
                </label>
                <input
                  type="url"
                  name="googleReviewLink"
                  value={formData.googleReviewLink}
                  onChange={handleChange}
                  placeholder="https://search.google.com/local/reviews?placeid=..."
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.googleReviewLink ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                />
                {errors.googleReviewLink && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.googleReviewLink}
                  </p>
                )}
              
              </div>

              
              

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    loading
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
                
                
              </div>

            </form>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default EditGoogleReviewsProfile;
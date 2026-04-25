import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  X, 
  Image, 
  Star, 
  Link as LinkIcon, 
  Building2,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditGoogleReviewsProfile = () => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    brandLogo: "",
    brandName: "",
    googleReviewLink: ""
  });

  const [errors, setErrors] = useState({});
  const [previewLogo, setPreviewLogo] = useState("");

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/google-reviews/profile/${activationCode}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data?.profile) {
          setFormData({
            brandLogo: response.data.profile.brandLogo || "",
            brandName: response.data.profile.brandName || "",
            googleReviewLink: response.data.profile.googleReviewLink || ""
          });
          setPreviewLogo(response.data.profile.brandLogo || "");
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
    
    // Update logo preview
    if (name === "brandLogo" && value) {
      setPreviewLogo(value);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }
    
    if (formData.googleReviewLink && !isValidUrl(formData.googleReviewLink)) {
      newErrors.googleReviewLink = "Please enter a valid URL";
    }
    
    if (formData.brandLogo && !isValidUrl(formData.brandLogo)) {
      newErrors.brandLogo = "Please enter a valid image URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url) => {
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
        `${import.meta.env.VITE_BASE_URL}/api/google-reviews/edit/${activationCode}`,
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
          navigate(`/google-reviews/view/${activationCode}`);
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

  // Handle cancel
  const handleCancel = () => {
    navigate(`/google-reviews/view/${activationCode}`);
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
            <Star className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Edit Google Review Profile
          </h1>
          <p className="text-gray-400 mt-2">
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
              
              {/* Logo Preview Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Brand Logo Preview
                </label>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-md opacity-50" />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20">
                      {previewLogo ? (
                        <img 
                          src={previewLogo} 
                          alt="Brand Logo" 
                          className="w-full h-full object-cover"
                          onError={() => setPreviewLogo("")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      Enter a valid image URL above to see preview
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Logo Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-red-400" />
                    <span>Brand Logo URL</span>
                  </div>
                </label>
                <input
                  type="url"
                  name="brandLogo"
                  value={formData.brandLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.brandLogo ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                />
                {errors.brandLogo && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.brandLogo}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, min 200x200 pixels
                </p>
              </div>

              {/* Brand Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-red-400" />
                    <span>Brand Name <span className="text-red-400">*</span></span>
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
                    <span>Google Review Link</span>
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
                <p className="mt-1 text-xs text-gray-500">
                  Paste your Google Maps review link here
                </p>
              </div>

              {/* Preview Section */}
              {(formData.brandName || formData.googleReviewLink) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-8 p-4 rounded-xl bg-gray-800/30 border border-white/10"
                >
                  <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Star size={14} className="text-yellow-400" />
                    Live Preview
                  </h3>
                  <div className="flex items-center gap-3">
                    {previewLogo && (
                      <img 
                        src={previewLogo} 
                        alt="Preview" 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {formData.brandName || "Your Brand Name"}
                      </p>
                      {formData.googleReviewLink && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {formData.googleReviewLink}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
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
                
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  <span>Cancel</span>
                </motion.button>
              </div>

              {/* Info Note */}
              <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-400 text-center">
                  <CheckCircle size={12} className="inline mr-1" />
                  Your profile will be instantly updated and visible to your customers
                </p>
              </div>

            </form>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Need help getting your Google Review link?{" "}
            <a 
              href="https://support.google.com/business/answer/7035772" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline"
            >
              Learn how
            </a>
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default EditGoogleReviewsProfile;
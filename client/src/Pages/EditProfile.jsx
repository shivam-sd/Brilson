import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, Loader2, X, Check, Upload } from "lucide-react";
import imageCompression from "browser-image-compression";
import ImageCropper from "./ProfileComp/EditProfileComp/ImageCropper/ImageCropper"; 

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // IDs
  const [Id, setId] = useState(null);
  
  // Phone error
  const [phoneError, setPhoneError] = useState("");
  
  // Profile photo states
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showLogoUpdateBtn, setShowLogoUpdateBtn] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  
  // Cover photo states
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showCoverUpdateBtn, setShowCoverUpdateBtn] = useState(false);
  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [originalCoverImage, setOriginalCoverImage] = useState(null);
  const [originalCoverFile, setOriginalCoverFile] = useState(null);

  // Form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    bio: "",
    about: "",
    city: "",
    whatsapp: "",
    website: "",
  });

  // Country codes data
  const countryCodes = [
    { code: "+91", country: "🇮🇳", name: "India" },
    { code: "+1", country: "🇺🇸", name: "USA" },
    { code: "+44", country: "🇬🇧", name: "UK" },
    { code: "+971", country: "🇦🇪", name: "UAE" },
    { code: "+61", country: "🇦🇺", name: "Australia" },
    { code: "+81", country: "🇯🇵", name: "Japan" },
    { code: "+49", country: "🇩🇪", name: "Germany" },
    { code: "+33", country: "🇫🇷", name: "France" },
    { code: "+39", country: "🇮🇹", name: "Italy" },
  ];

  // FETCH ALL PROFILE DATA
  useEffect(() => {
    const fetchAllProfileData = async () => {
      try {
        // Fetch card details
        const cardRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${id}`,
          { withCredentials: true }
        );
        
        setId(cardRes.data.card._id);
        const profile = cardRes.data.card.profile;
        
        setForm({
          name: profile?.name || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
          countryCode: profile?.countryCode || "+91",
          bio: profile?.bio || "",
          about: profile?.about || "",
          city: profile?.city || "",
          whatsapp: profile?.whatsapp || "",
          website: profile?.website || "",
        });

        // Fetch profile logo
        try {
          const logoRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/profile-logo/get/${id}`
          );
          setLogo(logoRes.data.profileLogo.image);
        } catch (err) {
          console.log("No logo found");
        }

        // Fetch cover photo
        try {
          const coverRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/profile-cover/get/${id}`
          );
          setCover(coverRes.data.profileLogo.image);
        } catch (err) {
          console.log("No cover found");
        }
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      }
    };

    if (id) {
      fetchAllProfileData();
    }
  }, [id]);

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========== PROFILE PHOTO HANDLERS ==========
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setOriginalFile(file);
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setShowCropper(true);
    } catch (err) {
      toast.error("Error processing image");
    }
  };

  const handleLogoCropComplete = async (croppedFile) => {
    try {
      setShowCropper(false);
      
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      const finalFile = await imageCompression(croppedFile, options);
      const previewUrl = URL.createObjectURL(finalFile);
      setLogoPreview(previewUrl);
      setLogo(finalFile);
      setShowLogoUpdateBtn(true);
      
      if (originalImage) {
        URL.revokeObjectURL(originalImage);
      }
    } catch (err) {
      console.error('Crop complete error:', err);
      toast.error("Error cropping image");
    }
  };

  const handleLogoCancelCrop = () => {
    setShowCropper(false);
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
  };

  const uploadLogo = async () => {
    if (!logo) return toast.error("Select image");

    try {
      setUploadingLogo(true);

      const fd = new FormData();
      fd.append("activationCode", id);
      
      const fileName = `profile-${Date.now()}.jpg`;
      const fileToUpload = new File([logo], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      fd.append("image", fileToUpload);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-logo/update`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Profile photo updated");
      setShowLogoUpdateBtn(false);
      setLogoPreview(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  // ========== COVER PHOTO HANDLERS ==========
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setOriginalCoverFile(file);
      const imageUrl = URL.createObjectURL(file);
      setOriginalCoverImage(imageUrl);
      setShowCoverCropper(true);
    } catch (err) {
      toast.error("Error processing image");
    }
  };

  const handleCoverCropComplete = async (croppedFile) => {
    try {
      setShowCoverCropper(false);
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      const finalFile = await imageCompression(croppedFile, options);
      const previewUrl = URL.createObjectURL(finalFile);
      setCoverPreview(previewUrl);
      setCover(finalFile);
      setShowCoverUpdateBtn(true);
      
      if (originalCoverImage) {
        URL.revokeObjectURL(originalCoverImage);
      }
    } catch (err) {
      console.error('Crop complete error:', err);
      toast.error("Error cropping image");
    }
  };

  const handleCoverCancelCrop = () => {
    setShowCoverCropper(false);
    if (originalCoverImage) {
      URL.revokeObjectURL(originalCoverImage);
    }
  };

  const uploadCover = async () => {
    if (!cover) return toast.error("Select cover image");

    try {
      setUploadingCover(true);

      const fd = new FormData();
      fd.append("activationCode", id);
      
      const fileName = `cover-${Date.now()}.jpg`;
      const fileToUpload = new File([cover], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      fd.append("image", fileToUpload);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-cover/update`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Cover photo updated");
      setShowCoverUpdateBtn(false);
      setCoverPreview(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  // UPDATE COUNTRY CODE
  const updateCountryCode = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/card/${Id}/editCountryCode`,
        { countryCode: form.countryCode },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to update country code:", err);
    }
  };

  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      toast.error("Name, Email and Phone are required");
      return;
    }

    if (form.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/card/${Id}/edit`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          about: form.about,
          city: form.city,
          whatsapp: form.whatsapp,
          website: form.website,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      await updateCountryCode();

      toast.success("Profile updated successfully");

      setTimeout(() => {
        navigate(`/profile/${id}`, { replace: true });
      }, 800);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#05070D] to-[#0B0F1A] py-6 md:py-10">
        <div className="w-full max-w-4xl mx-auto bg-[#111827] border border-gray-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
          
          {/* COVER PHOTO SECTION - Like Facebook */}
          <div className="relative h-48 md:h-56 lg:h-64 w-full bg-gradient-to-r from-gray-800 to-gray-900">
            {/* Cover Image */}
            {(coverPreview || cover) ? (
              <img
                src={coverPreview || cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <span>Click camera icon to add cover photo</span>
              </div>
            )}
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Cover Photo Actions */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {/* Cover Upload Button */}
              <label className="bg-black/50 backdrop-blur-sm text-white p-2.5 rounded-full cursor-pointer hover:bg-black/70 transition-all hover:scale-110 border border-white/20">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  hidden
                />
              </label>
              
              {/* Cover Update Button */}
              {showCoverUpdateBtn && (
                <button
                  onClick={uploadCover}
                  disabled={uploadingCover}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  {uploadingCover ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save Cover
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* PROFILE PHOTO SECTION - Overlapping like Facebook */}
          <div className="relative px-4 md:px-8 mb-16">
            <div className="absolute -top-16 left-4 md:left-8">
              <div className="relative group">
                {/* Profile Photo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#111827] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl">
                  <img
                    src={logoPreview || logo || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Profile Photo Actions */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  {/* Upload Button */}
                  <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      hidden
                    />
                  </label>
                  
                  {/* Update Button */}
                  {showLogoUpdateBtn && (
                    <button
                      onClick={uploadLogo}
                      disabled={uploadingLogo}
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all shadow-lg"
                      title="Save profile photo"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile Name - Displayed next to photo on desktop */}
            {/* <div className="pt-20 md:pt-6 md:pl-40 pb-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {form.name || "Your Name"}
              </h2>
              <p className="text-gray-400 text-sm">
                {form.email || "email@example.com"}
              </p>
            </div> */}
          </div>

          {/* EDIT FORM SECTION */}
          <div className="p-4 md:p-8">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6 border-b border-gray-800 pb-2 text-center">
                Basic Information
              </h3>

              {/* Grid - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Input 
                  label="Full Name & Company Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required
                />
                
                <Input 
                  label="Email" 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange} 
                  required
                />
                
                {/* Phone with Country Code */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Phone Number <span className="text-red-400">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="w-full sm:w-32 px-3 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      {countryCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.country} {cc.code}
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="Enter 10 digit number"
                      className={`flex-1 px-4 py-3 rounded-xl bg-[#0B1220] border ${
                        phoneError ? 'border-red-500' : 'border-gray-700'
                      } text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                      required
                    />
                  </div>
                  
                  {phoneError && (
                    <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                  )}
                </div>

                <Input 
                  label="WhatsApp Number" 
                  name="whatsapp" 
                  value={form.whatsapp} 
                  onChange={handleChange} 
                  placeholder="With country code"
                />
                
                <Input 
                  label="Address" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                  placeholder="City, Country"
                />
              </div>

              {/* Bio - Full width */}
              <div className="mt-4 md:mt-6">
                <Textarea 
                  label="Bio" 
                  name="bio" 
                  value={form.bio} 
                  onChange={handleChange} 
                  rows={2} 
                  placeholder="Short bio about yourself"
                />
              </div>

              {/* Website */}
              <div className="mt-4 md:mt-6">
                <Input 
                  label="Website" 
                  name="website" 
                  value={form.website} 
                  onChange={handleChange} 
                  placeholder="https://example.com"
                />
              </div>

              {/* About - Full width */}
              <div className="mt-4 md:mt-6">
                <Textarea 
                  label="About" 
                  name="about" 
                  value={form.about} 
                  onChange={handleChange} 
                  rows={4} 
                  placeholder="Tell more about yourself..."
                />
              </div>

              {/* Save Changes Button */}
              <motion.button
                disabled={loading}
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-8 w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-base md:text-lg transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-indigo-500/30 cursor-pointer'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Saving Changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* PROFILE PHOTO CROPPER MODAL */}
      {showCropper && (
        <ImageCropper
          image={originalImage}
          onCancel={handleLogoCancelCrop}
          onCropComplete={handleLogoCropComplete}
        />
      )}

      {/* COVER PHOTO CROPPER MODAL */}
      {showCoverCropper && (
        <ImageCropper
          image={originalCoverImage}
          onCancel={handleCoverCancelCrop}
          onCropComplete={handleCoverCropComplete}
        />
      )}
    </>
  );
};

/* Reusable Components */
const Input = ({ label, required, ...props }) => (
  <div>
    <label className="text-sm text-gray-400 mb-2 block">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input 
      {...props} 
      className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400 mb-2 block">{label}</label>
    <textarea 
      {...props} 
      className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-gray-500" 
    />
  </div>
);

export default EditProfile;
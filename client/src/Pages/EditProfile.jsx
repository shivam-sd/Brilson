import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Id, setId] = useState(null);
  const [phoneError, setPhoneError] = useState("");

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
    { code: "+7", country: "🇷🇺", name: "Russia" },
    { code: "+86", country: "🇨🇳", name: "China" },
    { code: "+55", country: "🇧🇷", name: "Brazil" },
    { code: "+82", country: "🇰🇷", name: "South Korea" },
    { code: "+65", country: "🇸🇬", name: "Singapore" },
    { code: "+60", country: "🇲🇾", name: "Malaysia" },
    { code: "+66", country: "🇹🇭", name: "Thailand" },
    { code: "+84", country: "🇻🇳", name: "Vietnam" },
    { code: "+63", country: "🇵🇭", name: "Philippines" },
    { code: "+62", country: "🇮🇩", name: "Indonesia" },
    { code: "+94", country: "🇱🇰", name: "Sri Lanka" },
  ];

  // FETCH EXISTING PROFILE
  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${id}`,
          { withCredentials: true }
        );
        // console.log(res.data.card._id);
        setId(res.data.card._id);
        
        const profile = res.data.card.profile;
        
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
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      }
    };

    if (id) {
      getProfileInfo();
    }
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // UPDATE COUNTRY CODE SEPARATELY
  const updateCountryCode = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/card/${Id}/editCountryCode`,
        { countryCode: form.countryCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      // console.log("Country code updated successfully");
      toast.success("Country code updated")
    } catch (err) {
      console.error("Failed to update country code:", err);
    }
  };

  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.phone) {
      toast.error("Name, Email and Phone are required");
      return;
    }

    if (form.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Update main profile
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      // Update country code separately
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

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#05070D] to-[#0B0F1A] px-4 py-6 md:py-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto bg-[#111827] border border-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Basic Information
          </h2>

          {/* Grid - Responsive: 1 col on mobile, 2 cols on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
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
            
            {/* Phone with Country Code  */}
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
              
              {/* Phone error message */}
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

          {/* Website - Full width on mobile, half on desktop */}
          <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          {/* Submit Button */}
          <motion.button
            disabled={loading}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-8 w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-base md:text-lg transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

/* Reusable Components with Responsive Design */
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
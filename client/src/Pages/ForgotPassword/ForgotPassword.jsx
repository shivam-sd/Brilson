import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiMail, 
  FiArrowLeft, 
  FiSend, 
  FiLock, 
  FiShield, 
  FiChevronRight,
  FiAlertCircle,
  FiSmartphone
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";



const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const validatePhone = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!number) return "Phone number is required";
    if (!phoneRegex.test(number)) return "Enter valid 10-digit mobile number";
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
    if (phoneError) setPhoneError(validatePhone(value));
  };

  const handleSendOTP = async () => {
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      toast.error(error);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        { phone }
      );
      localStorage.setItem("resetPhone", phone);
      toast.success(res.data.message || "OTP sent successfully!");
      setTimeout(() => {
        navigate("/users/verify-otp/brilson");
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendOTP();
    }
  };

  return (
    <>
    <Header />
    <Toaster />
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
            />
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
            <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}
            animate={{
                y: [0, -60, 0],
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mt-25 mb-10"
        >
        <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-8">
          
         

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
              <FiLock className="text-white" size={32} />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your registered mobile number<br />
              We'll send you an OTP to reset your password
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiSmartphone className="text-gray-600" size={18} />
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                maxLength={10}
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border transition-all duration-200 outline-none text-white placeholder-gray-600 ${
                    phoneError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                    }`}
              />
              {phone && !phoneError && phone.length === 10 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <FiShield className="text-cyan-500" size={16} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {phoneError && (
                  <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                  <FiAlertCircle size={12} />
                  {phoneError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 mb-6"
            >
            <div className="flex items-start gap-3">
              <FiShield className="text-cyan-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-cyan-500 text-sm font-medium">Secure Process</p>
                <p className="text-gray-500 text-xs mt-1">
                  A 6-digit OTP will be sent to your registered mobile number
                </p>
              </div>
            </div>
          </motion.div>

          {/* Send OTP Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendOTP}
            disabled={loading || !phone || phone.length !== 10}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <FiSend size={18} />
                <span>Send OTP</span>
              </>
            )}
          </motion.button>

        

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-xs">
              By continuing, you agree to our 
              <Link to="/terms-conditions" className="text-cyan-500 hover:underline ml-1">Terms of Service</Link>
              <span className="mx-1">&</span>
              <Link to="/privacy-policy" className="text-cyan-500 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl -z-10" />
      </motion.div>
    </div>
    <Footer />
            </>
  );
};

export default ForgotPassword;
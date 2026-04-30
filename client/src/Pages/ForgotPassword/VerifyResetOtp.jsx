import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  FiShield, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSmartphone,
  FiLock
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";


const VerifyResetOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [canResend, setCanResend] = useState(false);

  const phone = localStorage.getItem("resetPhone");
  const navigate = useNavigate();

  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password");
    }
  }, [phone, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
    
    // Clear error when user types
    if (otpError) setOtpError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/verify-reset-otp`,
        { phone, otp: otpCode }
      );
      localStorage.setItem("resetToken", res.data.resetToken);
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate("/users/reset-password/brilson");
      }, 1500);
    } catch (err) {
      console.log(err);
      setOtpError(err.response?.data?.message || "Invalid OTP");
      toast.error(err.response?.data?.message || "Invalid OTP");
      // Clear OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-input-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        { phone }
      );
      toast.success(res.data.message || "OTP resent successfully!");
      setTimeLeft(120);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <FiShield className="text-white" size={32} />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white">
              Verify OTP
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit code sent to<br />
              <span className="text-cyan-500 font-medium">{phone || "your mobile number"}</span>
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-3 text-center">
              Verification Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onKeyPress={handleKeyPress}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl bg-black/50 border transition-all duration-200 outline-none text-white ${
                    otpError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                }`}
                whileFocus={{ scale: 1.05 }}
                />
              ))}
            </div>
            <AnimatePresence>
              {otpError && (
                <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-xs mt-3 flex items-center justify-center gap-1"
                >
                  <FiAlertCircle size={12} />
                  {otpError}
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
              <FiSmartphone className="text-cyan-500 mt-0.5 flex-shrink-0" size={16} />
              <div className="flex-1">
                <p className="text-cyan-500 text-sm font-medium">OTP Sent Successfully</p>
                <p className="text-gray-500 text-xs mt-1">
                  We've sent a verification code to your registered mobile number
                </p>
              </div>
            </div>
          </motion.div>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
                <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
                <>
                <FiCheckCircle size={18} />
                <span>Verify OTP</span>
              </>
            )}
          </motion.button>

          {/* Resend OTP Section */}
          <div className="text-center">
            {canResend ? (
                <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-cyan-500 hover:text-cyan-400 text-sm transition-colors"
                >
                Resend OTP
              </button>
            ) : (
                <p className="text-gray-600 text-sm">
                Resend code in <span className="text-cyan-500 font-mono">{formatTime(timeLeft)}</span>
              </p>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-xs flex items-center justify-center gap-1">
              <FiLock size={12} />
              Secure verification process
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

export default VerifyResetOtp;
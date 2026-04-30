import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiLock, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
  FiInfo
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";



const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isValid, setIsValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("resetToken");

  
  // Password strength validation
  useEffect(() => {
    setIsValid({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirm = () => {
    if (!confirm) {
      setConfirmError("Please confirm your password");
      return false;
    }
    if (password !== confirm) {
      setConfirmError("Passwords do not match");
      return false;
    }
    setConfirmError("");
    return true;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword();
    if (confirm) validateConfirm();
  };

  const handleConfirmChange = (e) => {
    setConfirm(e.target.value);
    if (confirmError) validateConfirm();
  };

  const handleReset = async () => {
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirm();

    if (!isPasswordValid || !isConfirmValid) {
      toast.error(
        (t) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-red-500" size={18} />
              <span className="font-semibold">Validation Failed!</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Please check the password requirements above.
            </div>
          </div>
        ),
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        }
      );
      return;
    }

    const resetToast = toast.loading(
      (t) => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Resetting password...</span>
        </div>
      ),
      {
        duration: 15000,
      }
    );

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`,
        { newPassword: password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss(resetToast);

      // Success toast
      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-500" size={18} />
              <span className="font-semibold">Password Reset Successful!</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Your password has been updated successfully.
            </div>
            <div className="text-xs text-cyan-400 mt-1">
              Redirecting to login...
            </div>
          </div>
        ),
        {
          duration: 2500,
          style: {
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#fff',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
        }
      );

      // Cleanup localStorage
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetPhone");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      toast.dismiss(resetToast);
      console.log(err);
      
      const errorMessage = err.response?.data?.message || "Reset failed";
      const errorStatus = err.response?.status;
      
      // Detailed error toast
      toast.error(
        (t) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-red-500" size={18} />
              <span className="font-semibold">Reset Failed!</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {errorMessage}
            </div>
            {errorStatus === 401 && (
              <div className="text-xs text-yellow-400 mt-1">
                ⚠️ Session expired. Please request a new OTP.
              </div>
            )}
            {errorStatus === 400 && (
              <div className="text-xs text-yellow-400 mt-1">
                ⚠️ Invalid password format or requirements not met.
              </div>
            )}
            {errorStatus === 500 && (
              <div className="text-xs text-yellow-400 mt-1">
                ⚠️ Server error. Please try again later.
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Please try again or contact support.
            </div>
          </div>
        ),
        {
          duration: 6000,
          style: {
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  // Calculate password strength percentage
  const getPasswordStrength = () => {
    const validCount = Object.values(isValid).filter(Boolean).length;
    return (validCount / 5) * 100;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-blue-500";
    return "bg-green-500";
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
        <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8">
          
        

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
            >
              <FiLock className="text-white" size={28} />
            </motion.div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Reset Password
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">
              Create a new strong password for your account
            </p>
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiLock className="text-gray-600" size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-12 pr-12 py-3 rounded-xl bg-black/50 border transition-all duration-200 outline-none text-white placeholder-gray-600 text-sm sm:text-base ${
                  passwordError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiShield className="text-gray-600" size={18} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirm}
                onChange={handleConfirmChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-12 pr-12 py-3 rounded-xl bg-black/50 border transition-all duration-200 outline-none text-white placeholder-gray-600 text-sm sm:text-base ${
                    confirmError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">Password Strength:</p>
                <span className="text-xs text-gray-400">
                  {Math.round(getPasswordStrength())}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${getPasswordStrength()}%` }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  {isValid.length ? (
                    <FiCheck className="text-cyan-500" size={12} />
                  ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-600" />
                  )}
                  <span className={isValid.length ? "text-cyan-500" : "text-gray-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {isValid.uppercase ? (
                      <FiCheck className="text-cyan-500" size={12} />
                    ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-600" />
                    )}
                  <span className={isValid.uppercase ? "text-cyan-500" : "text-gray-500"}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {isValid.lowercase ? (
                      <FiCheck className="text-cyan-500" size={12} />
                    ) : (
                    <div className="w-3 h-3 rounded-full border border-gray-600" />
                )}
                  <span className={isValid.lowercase ? "text-cyan-500" : "text-gray-500"}>
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {isValid.number ? (
                      <FiCheck className="text-cyan-500" size={12} />
                    ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-600" />
                    )}
                  <span className={isValid.number ? "text-cyan-500" : "text-gray-500"}>
                    One number
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {isValid.special ? (
                      <FiCheck className="text-cyan-500" size={12} />
                    ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-600" />
                    )}
                  <span className={isValid.special ? "text-cyan-500" : "text-gray-500"}>
                    One special character
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Messages */}
          <AnimatePresence>
            {passwordError && (
                <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                <FiAlertCircle size={12} />
                {passwordError}
              </motion.p>
            )}
            {confirmError && (
                <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                <FiAlertCircle size={12} />
                {confirmError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Reset Password Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-6 mb-4"
            >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                <span>Reset Password</span>
              </>
            )}
          </motion.button>


          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-xs flex items-center justify-center gap-1 flex-wrap">
              <FiShield size={12} />
              Your password is encrypted and secure
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

export default ResetPassword;
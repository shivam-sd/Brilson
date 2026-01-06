import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const navigate = useNavigate();

  // Handle send OTP function
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!form.phone) {
      return toast.error("Please enter phone number");
    }
    
    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return toast.error("Please enter a valid 10-digit phone number");
    }
    
    try {
      setOtpLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/send-otp`,
        { phone: form.phone }
      );
      
      setOtpSent(true);
      toast.success("OTP sent successfully to your phone");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle verify OTP function 
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      return toast.error("Please enter OTP");
    }
    
    if (otp.length < 6) { // Assuming 6-digit OTP
      return toast.error("OTP must be 6 digits");
    }
    
    try {
      setVerifyLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/verify-otp`,
        { phone: form.phone, otp }
      );
      
      setIsVerified(true);
      toast.success("Phone number verified successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
      return toast.error("All fields are required");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.error("Please enter a valid email address");
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return toast.error("Phone number must be exactly 10 digits");
    }

    // Check if phone is verified
    if (!isVerified) {
      return toast.error("Please verify your phone number with OTP");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/register`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          isVerified: isVerified, // Send verification status
        },
        { withCredentials: true }
      );

      // Save token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Account registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0c10] to-[#050505] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0f1116]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 mt-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white tracking-wide">
            Create <span className="text-cyan-400">Account</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Join thousands of professionals using our platform
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="text-gray-300 text-sm">Full Name *</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email *</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-300 text-sm">Phone Number *</label>
            <div className="mt-2 flex items-center justify-between bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <div className="flex items-center w-full">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  required
                  maxLength="10"
                  className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpLoading || otpSent}
                className={`ml-2 text-sm px-4 py-2 rounded-lg transition-all ${otpSent ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
              >
                {otpLoading ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
              </button>
            </div>
            
            {otpSent && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <label className="text-gray-300 text-sm">Enter OTP *</label>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-green-500 w-full">
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={verifyLoading || isVerified}
                    className={`ml-2 text-sm px-4 py-3 rounded-lg transition-all ${isVerified ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
                  >
                    {verifyLoading ? "Verifying..." : isVerified ? "Verified ✓" : "Verify"}
                  </button>
                </div>
                {isVerified && (
                  <p className="text-green-400 text-xs mt-2 flex items-center">
                    ✓ Phone number verified
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password *</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength="6"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300 text-sm">Confirm Password *</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !isVerified}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg mt-6 transition-all ${!isVerified ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50'}`}
          >
            {loading ? "Creating Account..." : isVerified ? "Create Account" : "Verify Phone to Continue"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8 pt-6 border-t border-gray-800">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline font-medium">
            Login here
          </Link>
        </p>

{/* Verification Status */}
        <div className="mt-4 text-center">
          {isVerified ? (
            <div className="inline-flex items-center bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Phone verified ✓
            </div>
          ) : otpSent ? (
            <div className="inline-flex items-center bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
              Verify phone to login
            </div>
          ) : (
            <div className="inline-flex items-center bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Send OTP to verify phone
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default SignupPage;
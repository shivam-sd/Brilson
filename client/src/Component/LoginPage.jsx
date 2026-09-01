import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

import GoogleLoginAuth from "./GoogleAuth/GoogleLoginAuth";
import GooglePhoneInput from "./GoogleAuth/GooglePhoneInput";
import GoogleOTPInput from "./GoogleAuth/GoogleOTPInput";
import { fetchCart } from "../store/slices/cartSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seePassword, setSeePassword] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [googleStep, setGoogleStep] = useState(null);
  const [googleUserData, setGoogleUserData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.phone || !form.password) {
      return toast.error("Phone and password are required");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return toast.error("Phone number must be exactly 10 digits");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        {
          phone: form.phone,
          password: form.password,
        },
        { withCredentials: true }
      );

      if (res.data?.token) {
        dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
      }

      toast.success("Login successful");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      if (err.response?.data?.error === "This account is linked with Google. Please sign in with Google.") {
        toast.error("This account uses Google Sign-In. Please click the Google button below.");
      } else {
        toast.error(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
      dispatch(fetchCart());
    }
  };


  // ==========================================
  // GOOGLE FLOW HANDLERS
  // ==========================================

  const handleGoogleSuccess = (data) => {
    toast.success("Login successful!");
    navigate("/");
  };

  const handleGoogleError = (error) => {
    toast.error(error);
  };

  const handleGooglePhoneRequired = (data) => {
    console.log("Google phone required:", data);
    setGoogleUserData(data);
    setGoogleStep('phone');
  };

  const handleGooglePhoneComplete = (data) => {
    console.log("Google phone complete:", data);
    setGoogleUserData(prev => ({ ...prev, ...data }));
    setGoogleStep('otp');
    toast.success("OTP sent to your phone");
  };

  const handleGoogleOTPSuccess = (data) => {
    // console.log("Google OTP success:", data);
    toast.success("Login successful!");
    navigate("/");
  };

  const handleGoogleBack = () => {
    if (googleStep === 'otp') {
      setGoogleStep('phone');
    } else if (googleStep === 'phone') {
      setGoogleStep(null);
      setGoogleUserData(null);
    }
  };

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 999999,
            marginTop: 100
          }
        }}
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0c10] to-[#050505] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#0f1116]/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 mt-20"
        >
          {/* HEADING */}
          <div className="text-center mb-8">
            <h2 className="lg:text-5xl text-4xl font-semibold text-white leading-tight">
              Welcome <span className="text-cyan-400">Back</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>


          {/* 🆕 GOOGLE SIGN-IN SECTION */}


          {!googleStep && (
            <div className="mb-6">
              <GoogleLoginAuth
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                onPhoneRequired={handleGooglePhoneRequired}
              />
            </div>
          )}

          {/* 🆕 Google Phone Input */}
          {googleStep === 'phone' && googleUserData && (
            <GooglePhoneInput
              userData={googleUserData}
              onComplete={handleGooglePhoneComplete}
              onBack={handleGoogleBack}
            />
          )}

          {/* 🆕 Google OTP Input */}
          {googleStep === 'otp' && googleUserData && (
            <GoogleOTPInput
              userId={googleUserData.userId}
              phone={googleUserData.phone}
              onSuccess={handleGoogleOTPSuccess}
              onBack={handleGoogleBack}
            />
          )}

          {/* ========================================== */}
          {/* Only show when not in Google flow */}
          {/* ========================================== */}

          {!googleStep && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1116] text-gray-400">
                  Or login with
                </span>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/*  REGULAR LOGIN FORM  */}
          {/* ========================================== */}

          {!googleStep && (
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Phone */}
              <div>
                <label className="text-gray-300 text-sm">Phone Number *</label>
                <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
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
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-300 text-sm">Password *</label>
                <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type={seePassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength="6"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer" onClick={handleSeePassword}>
                    {seePassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 mt-6 hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          )}

          {/* ========================================== */}
          {/* FOOTER LINKS - Only show when not in Google flow */}
          {/* ========================================== */}

          {!googleStep && (
            <>
              <div className="lg:flex items-center justify-center gap-20 mt-8 pt-6 border-t border-gray-800 hidden">
                <Link
                  className="text-sm mb-3 text-cyan-400 hover:underline"
                  to={"/users/forgot-password/brilson"}
                >
                  Forgot Password
                </Link>
                <p className="text-center text-gray-400 text-sm mb-3">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyan-400 hover:underline font-medium">
                    Create One
                  </Link>
                </p>
              </div>

              {/* Mobile */}
              <div className="lg:hidden flex items-center justify-center mt-8 pt-6 border-t border-gray-800 flex-col">
                <p className="text-center text-gray-400 text-sm mb-3">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyan-400 hover:underline font-medium">
                    Create One
                  </Link>
                </p>
                <Link
                  className="text-sm mb-3 text-cyan-400 hover:underline"
                  to={"/users/forgot-password/brilson"}
                >
                  Forgot Password
                </Link>
              </div>
            </>
          )}

          {/* Google flow indicator */}
          {googleStep && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              {googleStep === 'phone'
                ? '📱 Enter your phone number to continue'
                : '🔑 Enter OTP to verify your phone'
              }
            </div>
          )}

        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
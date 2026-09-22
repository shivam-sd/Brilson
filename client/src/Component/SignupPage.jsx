import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, Phone } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { VscReferences } from "react-icons/vsc";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

import GoogleLoginAuth from "./GoogleAuth/GoogleLoginAuth";
import GooglePhoneInput from "./GoogleAuth/GooglePhoneInput";
import GoogleOTPInput from "./GoogleAuth/GoogleOTPInput";
import GoogleReferralInput from "./GoogleAuth/GoogleReferralInput";
import { useRegister, useSendOTP, useVerifyOTP } from "../api/auth-query";

const RESEND_SECONDS = 30;

//  Import Google Components
import GoogleLoginAuth from "./GoogleAuth/GoogleLoginAuth";
import GooglePhoneInput from "./GoogleAuth/GooglePhoneInput";
import GoogleOTPInput from "./GoogleAuth/GoogleOTPInput";

const SignupPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirm: "",
    referralCode: "",
  });

  const [step, setStep] = useState("form");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [seePassword1, setSeePassword1] = useState(false);
<<<<<<< Updated upstream
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
=======

  // Google States
  const [googleStep, setGoogleStep] = useState(null); 
  const [googleUserData, setGoogleUserData] = useState(null);
>>>>>>> Stashed changes

  const [googleStep, setGoogleStep] = useState(null);
  const [googleUserData, setGoogleUserData] = useState(null);

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();

<<<<<<< Updated upstream
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendTimer]);
=======

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!form.phone) {
      return toast.error("Please enter phone number");
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return toast.error("Please enter a valid 10-digit phone number");
    }
    
    try {
      setOtpLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/send-otp`,
        { phone: form.phone }
      );
      
      setOtpSent(true);
      toast.success("OTP sent successfully to your phone");
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      return toast.error("Please enter OTP");
    }
    
    if (otp.length < 6) {
      return toast.error("OTP must be 6 digits");
    }
    
    try {
      setVerifyLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/verify-otp`,
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
>>>>>>> Stashed changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      await sendOTPMutation.mutateAsync({ phone: form.phone });
      setOtpSent(true);
      setResendTimer(RESEND_SECONDS);
      toast.success("OTP sent successfully to your WhatsApp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
      throw err;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password || !form.confirm) {
      return toast.error("All fields are required");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return toast.error("Phone number must be exactly 10 digits");
    }

<<<<<<< Updated upstream
=======
    if (!isVerified) {
      return toast.error("Please verify your phone number with OTP");
    }

>>>>>>> Stashed changes
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    try {
      await handleSendOtp();
      setOtp("");
      setStep("otp");
    } catch (err) {
      console.log(err);
    }
  };

<<<<<<< Updated upstream
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await handleSendOtp();
      setOtp("");
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const otpArray = otp.split("");
    otpArray[index] = digit || "";
    const newOtp = otpArray.join("").slice(0, 6);
    setOtp(newOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleEditPhone = () => {
    setStep("form");
    setOtp("");
  };

  const handleVerifyAndRegister = async () => {
    if (!otp || otp.length < 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setVerifyLoading(true);

      await verifyOTPMutation.mutateAsync({
        phone: form.phone,
        otp,
      });

      setIsVerified(true);

      const res = await registerMutation.mutateAsync({
        name: form.name,
        phone: form.phone,
        password: form.password,
        referralCode: form.referralCode,
      });

      if (res?.token) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
=======
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/register`,
        {
          name: form.name,
          phone: form.phone,
          password: form.password,
          referralCode: form.referralCode
        },
        { withCredentials: true }
      );

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
>>>>>>> Stashed changes
      }

      toast.success("Account registered successfully!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Verification failed. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    toast.success("Login successful!");
    navigate("/");
  };

<<<<<<< Updated upstream
=======
  const handleGoogleSuccess = (data) => {
    toast.success("Login successful!");
    navigate("/");
  };

>>>>>>> Stashed changes
  const handleGoogleError = (error) => {
    toast.error(error);
  };

  const handleGooglePhoneRequired = (data) => {
    console.log("Google phone required:", data);
    setGoogleUserData(data);
<<<<<<< Updated upstream
    setGoogleStep("phone");
=======
    setGoogleStep('phone');
>>>>>>> Stashed changes
  };

  const handleGooglePhoneComplete = (data) => {
    console.log("Google phone complete:", data);
<<<<<<< Updated upstream
    setGoogleUserData((prev) => ({ ...prev, ...data }));
    setGoogleStep("otp");
=======
    setGoogleUserData(prev => ({ ...prev, ...data }));
    setGoogleStep('otp');
>>>>>>> Stashed changes
    toast.success("OTP sent to your phone");
  };

  const handleGoogleOTPSuccess = (data) => {
<<<<<<< Updated upstream
    console.log("Google OTP success (direct login):", data);
    toast.success("Login successful!");
    navigate("/");
  };

  const handleGoogleReferralRequired = (data) => {
    console.log("Google referral required:", data);
    setGoogleUserData((prev) => ({ ...prev, ...data }));
    setGoogleStep("referral");
  };

  const handleGoogleReferralSuccess = (data) => {
    console.log("Google referral success:", data);
=======
    console.log("Google OTP success:", data);
>>>>>>> Stashed changes
    toast.success("Login successful!");
    navigate("/");
  };

  const handleGoogleBack = () => {
<<<<<<< Updated upstream
    if (googleStep === "otp") {
      setGoogleStep("phone");
    } else if (googleStep === "phone") {
      setGoogleStep(null);
      setGoogleUserData(null);
    } else if (googleStep === "referral") {
      setGoogleStep("otp");
=======
    if (googleStep === 'otp') {
      setGoogleStep('phone');
    } else if (googleStep === 'phone') {
      setGoogleStep(null);
      setGoogleUserData(null);
>>>>>>> Stashed changes
    }
  };

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
  };

  const handleSeePassword1 = () => {
    setSeePassword1(!seePassword1);
  };
<<<<<<< Updated upstream

  const timerLabel = `00:${String(resendTimer).padStart(2, "0")}`;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 999999,
            marginTop: 100,
          },
        }}
      />
      <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-black px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#111111] p-6 rounded-3xl shadow-2xl border border-white/10 my-auto relative"
        >
          {step === "otp" && !googleStep && (
            <button
              type="button"
              onClick={handleEditPhone}
              className="absolute top-6 left-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-white/10 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {step === "form" && (
            <div className="text-center mb-6">
              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Create <span className="text-orange-500">Account</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Join thousands of professionals using our platform
              </p>
            </div>
          )}

          {step === "form" && !googleStep && (
            <div className="mb-5">
              <GoogleLoginAuth
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                onPhoneRequired={handleGooglePhoneRequired}
              />
            </div>
          )}

          {googleStep === "phone" && googleUserData && (
            <GooglePhoneInput
              userData={googleUserData}
              onComplete={handleGooglePhoneComplete}
              onBack={handleGoogleBack}
            />
          )}

          {googleStep === "otp" && googleUserData && (
            <GoogleOTPInput
              userId={googleUserData.userId}
              phone={googleUserData.phone}
              onSuccess={handleGoogleOTPSuccess}
              onBack={handleGoogleBack}
              onReferralRequired={handleGoogleReferralRequired}
            />
          )}

          {googleStep === "referral" && googleUserData && (
            <GoogleReferralInput
              userId={googleUserData.userId}
              onSuccess={handleGoogleReferralSuccess}
              onSkip={() => {
                setGoogleStep(null);
                setGoogleUserData(null);
                navigate("/");
              }}
            />
          )}

          {step === "form" && !googleStep && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#111111] text-gray-500">OR</span>
              </div>
            </div>
          )}

          {step === "form" && !googleStep && (
            <form className="space-y-5" onSubmit={handleContinue}>
              <div>
                <label className="text-gray-300 text-sm">Full Name</label>
                <div className="mt-2 flex items-center bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/10 focus-within:border-orange-500">
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

              <div>
                <label className="text-gray-300 text-sm">Phone Number</label>
                <div className="mt-2 flex items-center bg-[#1a1a1a] rounded-xl border border-white/10 focus-within:border-orange-500">
                  <div className="flex items-center gap-1 px-3 py-3 border-r border-white/10 text-gray-300">
                    <span className="text-lg leading-none">🇮🇳</span>
                    <span className="text-sm">+91</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                    maxLength="10"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 px-3 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm">Password</label>
                <div className="mt-2 flex items-center bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/10 focus-within:border-orange-500">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type={seePassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    minLength="6"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer text-gray-400" onClick={handleSeePassword}>
                    {seePassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm">Confirm Password</label>
                <div className="mt-2 flex items-center bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/10 focus-within:border-orange-500">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type={seePassword1 ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer text-gray-400" onClick={handleSeePassword1}>
                    {seePassword1 ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm">Card Referral Key (optional)</label>
                <div className="mt-2 flex items-center bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/10 focus-within:border-orange-500">
                  <VscReferences className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="referralCode"
                    value={form.referralCode}
                    onChange={handleChange}
                    placeholder="Referral Code"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={otpLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {otpLoading ? "Sending OTP..." : "Continue"}
                {!otpLoading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </form>
          )}

          {step === "otp" && !googleStep && (
            <div className="pt-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-4">
                  <FaWhatsapp className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Verify with <span className="text-orange-500">WhatsApp</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  We've sent a 6-digit verification code
                  <br />
                  to your WhatsApp number
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/10">
                <div className="flex items-center gap-2 text-gray-200">
                  <span className="text-lg leading-none">🇮🇳</span>
                  <span>+91</span>
                  <span>{form.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={handleEditPhone}
                  className="flex items-center gap-1 text-orange-500 text-sm hover:underline"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength="1"
                    className={`w-11 h-12 text-center text-lg rounded-xl bg-[#1a1a1a] border text-white outline-none ${
                      index === 0 ? "border-orange-500" : "border-white/10"
                    } focus:border-orange-500`}
                  />
                ))}
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">Didn't receive code?</p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || otpLoading}
                  className="text-orange-500 mt-1 disabled:text-gray-500"
                >
                  {resendTimer > 0
                    ? `Resend OTP on WhatsApp (${timerLabel})`
                    : "Resend OTP on WhatsApp"}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={verifyLoading || registerMutation.isPending}
                className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifyLoading || registerMutation.isPending ? "Verifying..." : "Verify"}
                {!verifyLoading && !registerMutation.isPending && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </div>
          )}

          {step === "form" && !googleStep && (
            <p className="text-center text-gray-400 text-sm mt-6 pt-6 border-t border-gray-800">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 hover:underline font-medium">
                Login here
              </Link>
            </p>
          )}

          {googleStep && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              {googleStep === "phone"
                ? "📱 Enter your phone number to continue"
                : googleStep === "otp"
                ? "🔑 Enter OTP to verify your phone"
                : "🎁 Enter referral code or skip"}
            </div>
          )}
=======

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
      <div className="w-full flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0c10] to-[#050505] px-4 py-10 z-50">
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

         
          {/*  GOOGLE SIGN-IN SECTION */}
          

          {!googleStep && (
            <div className="mb-6">
              <GoogleLoginAuth
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                onPhoneRequired={handleGooglePhoneRequired}
              />
            </div>
          )}

          {/* Google Phone Input */}
          {googleStep === 'phone' && googleUserData && (
            <GooglePhoneInput
              userData={googleUserData}
              onComplete={handleGooglePhoneComplete}
              onBack={handleGoogleBack}
            />
          )}

          {/* Google OTP Input */}
          {googleStep === 'otp' && googleUserData && (
            <GoogleOTPInput
              userId={googleUserData.userId}
              phone={googleUserData.phone}
              onSuccess={handleGoogleOTPSuccess}
              onBack={handleGoogleBack}
            />
          )}

          
          {/* DIVIDER - Only show when not in Google flow */}
         

          {!googleStep && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1116] text-gray-400">Or sign up with</span>
              </div>
            </div>
          )}

      
          {/*  Only show when not in Google flow */}
        

          {!googleStep && (
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
                    className={`ml-2 text-sm px-4 py-2 rounded-lg transition-all ${
                      otpSent ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    }`}
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
                        className={`ml-2 text-sm px-4 py-3 rounded-lg transition-all ${
                          isVerified ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'
                        }`}
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
                    type={seePassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    minLength="6"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer" onClick={handleSeePassword}>
                    {seePassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-300 text-sm">Confirm Password *</label>
                <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type={seePassword1 ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer" onClick={handleSeePassword1}>
                    {seePassword1 ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              {/* Referral code */}
              <div>
                <label className="text-gray-300 text-sm">Referral Code (optional)</label>
                <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
                  <VscReferences className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="referralCode"
                    value={form.referralCode}
                    onChange={handleChange}
                    placeholder="Referral Code"
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
                className={`w-full py-3 rounded-xl font-semibold shadow-lg mt-6 transition-all ${
                  !isVerified 
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50'
                }`}
              >
                {loading ? "Creating Account..." : isVerified ? "Create Account" : "Verify Phone to Continue"}
              </motion.button>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm mt-8 pt-6 border-t border-gray-800">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline font-medium">
              Login here
            </Link>
          </p>

          {/*  Only show when not in Google flow */}
          {!googleStep && (
            <div className="mt-4 text-center">
              {isVerified ? (
                <div className="inline-flex items-center bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Phone verified ✓
                </div>
              ) : otpSent ? (
                <div className="inline-flex items-center bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                  Verify phone to continue
                </div>
              ) : (
                <div className="inline-flex items-center bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Send OTP to verify phone
                </div>
              )}
            </div>
          )}

          {/* Google flow indicator */}
          {googleStep && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              {googleStep === 'phone' ? '📱 Enter your phone number to continue' : '🔑 Enter OTP to verify your phone'}
            </div>
          )}

>>>>>>> Stashed changes
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
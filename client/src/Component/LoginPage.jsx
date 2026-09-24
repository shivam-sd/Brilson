import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Phone, ArrowRight, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

import GoogleLoginAuth from "./GoogleAuth/GoogleLoginAuth";
import GooglePhoneInput from "./GoogleAuth/GooglePhoneInput";
import GoogleOTPInput from "./GoogleAuth/GoogleOTPInput";
import GoogleReferralInput from "./GoogleAuth/GoogleReferralInput";
import { fetchCart, mergeGuestCart, selectCartItems, clearCart } from "../store/slices/cartSlice";
import { useLogin } from "../api/auth-query";

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
  const guestCart = useSelector(selectCartItems);

  const loginMutation = useLogin();

  const handleLoginCartMerge = async () => {
    try {
      if (!guestCart || guestCart.length === 0) {
        await dispatch(fetchCart()).unwrap();
        return;
      }

      await dispatch(mergeGuestCart(guestCart)).unwrap();

      dispatch(clearCart());

      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Cart merge failed:", error);
      toast.error("Login successful, but cart sync failed. Please try again.");
    }
  };

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

      const res = await loginMutation.mutateAsync({
        phone: form.phone,
        password: form.password,
      });

      if (res?.token) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
        await handleLoginCartMerge();
      }

      toast.success("Login successful");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      if (err.response?.data?.error === "This account is linked with Google. Please sign in with Google.") {
        toast.error("This account uses Google Sign-In. Please click the Google button below.");
      } else {
        console.log("errorrrrr------------", err);
        toast.error(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (data) => {
    try {
      if (data?.token) {
        dispatch(
          setCredentials({
            token: data.token,
            user: data.user,
          })
        );
      }

      await handleLoginCartMerge();

      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Google login cart sync error:", error);

      toast.error("Login successful, but cart sync failed.");

      navigate("/");
    }
  };

  const handleGoogleError = (error) => {
    toast.error(error);
  };

  const handleGooglePhoneRequired = (data) => {
    console.log("Google phone required:", data);
    setGoogleUserData(data);
    setGoogleStep("phone");
  };

  const handleGooglePhoneComplete = (data) => {
    console.log("Google phone complete:", data);
    setGoogleUserData((prev) => ({ ...prev, ...data }));
    setGoogleStep("otp");
    toast.success("OTP sent to your phone");
  };

  const handleGoogleOTPSuccess = async (data) => {
    try {
      console.log("Google OTP success:", data);

      if (data?.token) {
        dispatch(
          setCredentials({
            token: data.token,
            user: data.user,
          })
        );
      }

      await handleLoginCartMerge();

      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Google OTP cart sync error:", error);

      toast.error("Login successful, but cart sync failed.");

      navigate("/");
    }
  };

  const handleGoogleReferralRequired = (data) => {
    console.log("Google referral required:", data);
    setGoogleUserData((prev) => ({ ...prev, ...data }));
    setGoogleStep("referral");
  };

  const handleGoogleReferralSuccess = (data) => {
    console.log("Google referral success:", data);
    toast.success("Login successful!");
    navigate("/");
  };

  const handleGoogleBack = () => {
    if (googleStep === "otp") {
      setGoogleStep("phone");
    } else if (googleStep === "phone") {
      setGoogleStep(null);
      setGoogleUserData(null);
    } else if (googleStep === "referral") {
      setGoogleStep("otp");
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
            marginTop: 100,
          },
        }}
      />
      <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center bg-black px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#111111] p-6 rounded-3xl shadow-2xl border border-white/10 my-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Welcome <span className="text-orange-500">Back</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to access your account
            </p>
          </div>

          {/* {!googleStep && (
            <div className="mb-5">
              <GoogleLoginAuth
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                onPhoneRequired={handleGooglePhoneRequired}
              />
            </div>
          )} */}

          {/* {googleStep === "phone" && googleUserData && (
            <GooglePhoneInput
              userData={googleUserData}
              onComplete={handleGooglePhoneComplete}
              onBack={handleGoogleBack}
            />
          )} */}

          {/* {googleStep === "otp" && googleUserData && (
            <GoogleOTPInput
              userId={googleUserData.userId}
              phone={googleUserData.phone}
              onSuccess={handleGoogleOTPSuccess}
              onBack={handleGoogleBack}
              onReferralRequired={handleGoogleReferralRequired}
            />
          )} */}

          {/* {googleStep === "referral" && googleUserData && (
            <GoogleReferralInput
              userId={googleUserData.userId}
              onSuccess={handleGoogleReferralSuccess}
              onSkip={() => {
                setGoogleStep(null);
                setGoogleUserData(null);
                navigate("/");
              }}
            />
          )} */}

          {!googleStep && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                {/* <div className="w-full border-t border-gray-800"></div> */}
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-3 bg-[#111111] text-gray-500">OR</span> */}
              </div>
            </div>
          )}

          {!googleStep && (
            <form className="space-y-5" onSubmit={handleLogin}>
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
                    placeholder="Enter password"
                    required
                    minLength="6"
                    className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
                  />
                  <div className="cursor-pointer text-gray-400" onClick={handleSeePassword}>
                    {seePassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  className="text-sm text-orange-500 hover:underline"
                  to={"/users/forgot-password/brilson"}
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full py-3 rounded-lg border border-orange-500 text-orange-500 flex items-center justify-center gap-2 hover:bg-orange-500/10 transition-all"
                >
                  <User className="w-5 h-5" />
                  Create Account
                </motion.button>
              </Link>
            </form>
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
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
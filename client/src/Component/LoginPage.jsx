import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

const LoginPage = () => {
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);
  const [form, setForm] = useState({
    // email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login WITHOUT OTP verification
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation - Email OR Phone + Password required
    if ( !form.phone || !form.password) {
      return toast.error(" phone and password are required");
    }
    
    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(form.email)) {
    //   return toast.error("Please enter a valid email address");
    // }
    
    // Phone validation
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
          // email: form.email,
          phone: form.phone,
          password: form.password,
        },
        { withCredentials: true }
      );
      
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      toast.success("Login successful");
      
      setTimeout(() => navigate("/"), 500);
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      console.log(err)
      toast.error(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };


  // handleSeePassword

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
    // console.log(seePassword)
  }

  return (
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

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          {/* <div>
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
          </div> */}

          {/* Phone - WITHOUT OTP */}
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
              {
                seePassword ? <> <FiEye /> </> : <> <FiEyeOff /> </>
              }
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 mt-6 hover:shadow-cyan-500/50 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm mb-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline font-medium">
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
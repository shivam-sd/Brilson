import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import {redirect, useNavigate} from "react-router-dom";


const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return toast.error("All fields are required");
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
          password: form.password,
        },
        { withCredentials: true }
      );

      // console.log(res)

      //  token save
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Account Registerd successfully");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Registration failed"
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
        className="w-full max-w-md bg-[#0f1116]/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/10 mt-20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Create <span className="text-cyan-400">Account</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Join thousands of professionals using our platform
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleForm}>
          {/* Name */}
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300 text-sm">Confirm Password</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 mt-4"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;

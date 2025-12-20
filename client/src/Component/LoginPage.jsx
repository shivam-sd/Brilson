import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // validation
    if (!form.email || !form.password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        form,
        { withCredentials: true }
      );

      // console.log(res)

      //  save token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Login successful");
      
      
      // redirect
      setTimeout(() => {
        navigate("/");
      },800)


      setTimeout(() => {
        window.location.reload();
      },1000)

    } catch (err) {
      toast.error(
        err.response?.data?.error || "Invalid email or password"
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
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Welcome <span className="text-cyan-400">Back</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleForm}>
          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500 transition">
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

          {/* Forgot Password */}
          {/* <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-cyan-400 text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div> */}

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500 transition">
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

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 mt-4"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        {/* Bottom Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Create One
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

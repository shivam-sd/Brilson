import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone:"",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleForm = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.phone || !form.password) {
      return toast.error("Email, phone and password are required");
    }
    
    try {
      setLoading(true);
      
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        form,
        { withCredentials: true }
      );
      
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      toast.success("Login successful");
      
      setTimeout(() => navigate("/"), 700);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0c10] to-[#050505] px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0f1116]/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/10 mt-20"
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
        <form className="space-y-6" onSubmit={handleForm}>
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


          <div>
            <label className="text-gray-300 text-sm">Phone</label>
            <div className="mt-2 flex items-center bg-[#1a1f27] rounded-xl px-4 py-3 border border-white/10 focus-within:border-cyan-500">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 ml-3"
              />
            </div>
          </div>

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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 mt-4"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

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

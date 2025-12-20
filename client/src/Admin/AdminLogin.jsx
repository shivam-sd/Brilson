import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
// console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/login`,
        formData,
        { withCredentials: true } 
      );

      // console.log(res);

      toast.success(res.data.message, {
        position: "top-center",
      });

      localStorage.setItem("adminToken", res.data.token);

      setTimeout(() => {
        navigate("/admindashboard");
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials!",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      {/* GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10"
      >
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-center text-white tracking-wide">
          Admin <span className="text-cyan-300">Login</span>
        </h1>
        <p className="text-center text-gray-200 mt-2">
          Access your dashboard securely
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-white/90 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-300 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-white/90 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-300 outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition duration-300
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed text-white"
                  : "bg-blue-500 hover:bg-blue-400 text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

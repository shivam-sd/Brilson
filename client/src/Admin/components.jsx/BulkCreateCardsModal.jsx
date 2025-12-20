import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiHash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BulkCreateCardsModal = () => {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (count < 1 || count > 1000) {
      toast.error("Card count must be between 1 and 1000");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/cards/bulk`,
        { count },
        { withCredentials: true } // ✅ cookie based auth
      );

      toast.success(res.data.message || "Cards generated successfully!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/admindashboard/manage-cards");
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Something went wrong!",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen fixed bg-gradient-to-bl from-slate-800 via-slate-900 to-slate-800 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8 relative"
      >
        {/* Close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Bulk Card Generator
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Generate multiple NFC cards in one click
        </p>

        {/* Input */}
        <label className="block mb-6">
          <span className="text-sm text-gray-300 mb-1 block">
            Number of Cards
          </span>

          <div className="flex items-center gap-2 bg-[#020617] border border-white/10 rounded-xl px-4 py-3">
            <FiHash className="text-indigo-400" />
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              placeholder="Enter count"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Max 1000 cards per batch
          </p>
        </label>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
        >
          {loading ? "Generating Cards..." : "Generate Cards"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BulkCreateCardsModal;

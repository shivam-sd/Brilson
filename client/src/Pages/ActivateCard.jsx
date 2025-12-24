import { useState } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const ActivateCard = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cardId: "",
    activationCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleActivate = async () => {
    if (!form.cardId || !form.activationCode) {
      toast.error("Card ID and Activation Code are required");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/card/activate`,
        {
          cardId: form.cardId,
          activationCode: form.activationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      // console.log("ACTIVATE RESPONSE ", res);

      const slug =
        res?.data?.slug ||
        res?.data?.card?.slug ||
        res?.data?.data?.slug;

      if (!slug) {
        toast.error("Profile slug not found. Please try again.");
        return;
      }

      toast.success("Card activated successfully");

      // ensure state settle
      setTimeout(() => {
        navigate(`/profile/${slug}`, {replace:true});
      }, 300);
    } catch (err) {
      console.error("Activate Card Error:", err);

      toast.error(
        err?.response?.data?.error ||
          "Unable to activate card. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <FiCreditCard size={26} />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            Activate Your Card
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Unlock your Brilson digital profile
          </p>
        </div>

        {/* Card ID */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 mb-2 block">
            Card ID
          </label>
          <input
            type="text"
            name="cardId"
            placeholder="Card Id"
            value={form.cardId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white"
          />
        </div>

        {/* Activation Code */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Activation Code
          </label>
          <input
            type="text"
            name="activationCode"
            placeholder="Activation Code"
            value={form.activationCode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white"
          />
        </div>

        <button
          onClick={handleActivate}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? "Activating..." : "Activate Card"}
          {!loading && <FiArrowRight />}
        </button>

        <p className="text-sm text-cyan-600 text-center mt-6">
          <Link to="/login">For Card Activation First Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ActivateCard;

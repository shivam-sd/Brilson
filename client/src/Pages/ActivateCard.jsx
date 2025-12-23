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
        },{
          headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        },
        {
          withCredentials: true,
        }
      );

      console.log(res);

      const data = res.data;

      toast.success("Card activated successfully");

      // small delay
      setTimeout(() => {
        navigate(`/profile/${data.slug}`);
      }, 1200);
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full max-w-md
          bg-[#111827]
          border border-gray-800
          rounded-3xl
          p-8
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1 }}
            className="
              w-14 h-14 mx-auto mb-4
              rounded-2xl
              bg-indigo-600/20
              flex items-center justify-center
              text-indigo-400
            "
          >
            <FiCreditCard size={26} />
          </motion.div>

          <h2 className="text-3xl font-semibold text-white">
            Activate Your Card
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Unlock your Brilson digital profile
          </p>
        </div>

        {/* Card ID */}
        <div className="mb-5">
          <label className="text-sm text-gray-400 mb-2 block">Card ID</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="cardId"
            placeholder="CARD_XXXXXX"
            value={form.cardId}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              bg-[#0B1220]
              border border-gray-700
              text-white outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/30
            "
          />
        </div>

        {/* Activation Code */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Activation Code
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="activationCode"
            placeholder="XXXX-XXXX"
            value={form.activationCode}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-xl
              bg-[#0B1220]
              border border-gray-700
              text-white outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/30
            "
          />
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.96 }}
          onClick={handleActivate}
          disabled={loading}
          className="
            w-full py-3 rounded-xl
            bg-gradient-to-r from-indigo-600 to-cyan-500
            text-white font-medium
            flex items-center justify-center gap-2
            shadow-lg shadow-indigo-600/30
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Activating..." : "Activate Card"}
          {!loading && <FiArrowRight />}
        </motion.button>

        {/* login */}
        <p className="text-sm text-cyan-600 w-full text-bold text-center mt-6">
          <Link to={"/login"}>For Card Activation First Login</Link>
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secured by Brilson™ · NFC Smart Identity
        </p>
      </motion.div>
    </div>
  );
};

export default ActivateCard;

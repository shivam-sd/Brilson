import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfileLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    googleMapLink: "",
    googleReviewLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [fetching, setFetching] = useState(true);

  // Fetch existing data
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/location/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setForm({
          googleMapLink: res.data?.data?.googleMapLink || "",
          googleReviewLink: res.data?.data?.googleReviewLink || "",
        });

        setLocationId(res?.data?.data?._id);
        // console.log(res?.data?.data?._id)

        // console.log(res)

      } catch (err) {
        toast.error("Failed to load location data");
      } finally {
        setFetching(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile/location/update/${locationId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Location updated successfully");

      navigate(`/profile/edit/${id}`, { replace: true });

    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6">

      <div className="w-full max-w-2xl relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 overflow-hidden">

        {/* Glow Effects */}
<div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full"></div>
<div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
          Update Location & Reviews
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Google Map Link */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm flex items-center gap-2">
              <MapPin size={16} />
              Google Map Link
            </label>

            <input
              type="url"
              name="googleMapLink"
              value={form.googleMapLink}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Google Review Link */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm flex items-center gap-2">
              <Star size={16} />
              Google Review Link
            </label>

            <input
              type="url"
              name="googleReviewLink"
              value={form.googleReviewLink}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-semibold flex justify-center items-center gap-2 transition shadow-lg active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Update Location"
            )}
          </button>

        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #111827;
          border: 1px solid #374151;
          color: white;
          outline: none;
          transition: 0.3s ease;
        }
        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 1px #10b981;
        }
      `}</style>

    </div>
  );
};

export default UpdateProfileLocation;
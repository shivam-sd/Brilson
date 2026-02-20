import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star, Edit, Plus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

const ProfileEditLocation = () => {
    const {id} = useParams();
    const activationCode = id;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState(null);

  const [form, setForm] = useState({
    googleMapLink: "",
    googleReviewLink: "",
  });

  // FETCH DATA
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/location/get/${activationCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (res.data.data) {
          setLocationData(res.data.data);
          setForm({
            googleMapLink: res.data.data.googleMapLink || "",
            googleReviewLink: res.data.data.googleReviewLink || "",
          });
        }
      } catch (err) {
        setLocationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [activationCode]);


  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 py-12">

      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">

        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/20 blur-3xl rounded-full"></div>

        <h2 className="lg:text-3xl md:text-3xl text-2xl font-bold text-white text-center mb-8">
          Location & Reviews
        </h2>

        {!locationData && (
          <div className="flex justify-center">
            <Link
            to={`/profile/location/add/${id}`}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
            >
              <Plus size={18} />
              Add Location
            </Link>
          </div>
        )}

        {locationData && (
          <div className="space-y-6">

            {/* MAP BUTTON */}
{locationData.googleMapLink && (
  <div className="w-full space-y-2">

    <Link
      to={locationData.googleMapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-full 
        bg-black/40 
        hover:bg-black/60 
        transition 
        p-4 
        rounded-xl 
        font-medium 
        flex 
        items-center 
        justify-center 
        gap-2 
        text-sm sm:text-base
        text-white
        break-words
      "
    >
      <MapPin size={18} />
      <span>View on Google Maps</span>
    </Link>

    <p className="
        text-blue-400/60 
        text-xs sm:text-sm 
        break-all 
        text-center
      ">
      {locationData.googleMapLink}
    </p>

  </div>
)}

            {/* REVIEW BUTTON */}
            {locationData.googleReviewLink && (
                <div>
              <Link
                to={locationData.googleReviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full 
        bg-black/40 
        hover:bg-black/60 
        transition 
        p-4 
        rounded-xl 
        font-medium 
        flex 
        items-center 
        justify-center 
        gap-2 
        text-sm sm:text-base
        text-white
        break-words"
              >
                <Star size={18} />
                View Google Reviews
              </Link>
                <p className="mt-2 text-blue-400/60 
        text-xs sm:text-sm 
        break-all 
        text-center">{locationData.googleReviewLink}</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Link
              to={`/profile/location/update/${id}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
              >
                <Edit size={18} />
                Update Location
              </Link>
            </div>

          </div>
        )}
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
        }
        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 1px #10b981;
        }
      `}</style>
    </div>
  );
};

export default ProfileEditLocation;
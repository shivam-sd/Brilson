import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Phone, Car, MapPin, MessageCircle } from "lucide-react";

const ParkingTagProfile = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/tag/${slug}`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [slug]);

  if (!data) return <div className="text-center mt-20">Loading...</div>;

  const profile = data.tag.profile || {};
  const owner = data.tag.owner || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">

      <div className="max-w-md w-full bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-6 border border-white/30">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Car size={40} className="text-indigo-600" />
          </div>

          <h2 className="text-2xl font-bold text-white mt-3">
            {profile.ownerName || owner.name}
          </h2>

          <p className="text-white/80 text-sm">
            Parking Tag Owner
          </p>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white/30 rounded-xl p-4 mb-4">

          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">Vehicle Number</span>
            <span className="text-white font-bold">
              {profile.vehicleNumber || "Not Added"}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">Vehicle Type</span>
            <span className="text-white font-bold">
              {profile.vehicleType || "Not Added"}
            </span>
          </div>

        </div>

        {/* Contact Section */}
        <div className="bg-white/30 rounded-xl p-4 mb-4">

          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-medium flex items-center gap-2">
              <Phone size={16} /> Phone
            </span>

            <a
              href={`tel:${profile.phone || owner.phone}`}
              className="text-white font-bold"
            >
              {profile.phone || owner.phone}
            </a>
          </div>

        </div>

        {/* Action Buttons */}

        <div className="grid grid-cols-2 gap-3">

          <a
            href={`tel:${profile.phone || owner.phone}`}
            className="bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Call
          </a>

          <a
            href={`https://wa.me/${profile.phone || owner.phone}`}
            target="_blank"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>

        </div>

        {/* Tag Info */}

        <div className="mt-5 text-center text-white/80 text-sm">
          Tag Activated:{" "}
          {new Date(data.tag.activatedAt).toLocaleDateString()}
        </div>

      </div>
    </div>
  );
}


export default ParkingTagProfile;
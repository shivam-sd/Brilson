import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProfileCoverPhoto = ({ activationCode }) => {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-cover/get/${activationCode}`
        );
        setCover(res.data.profileLogo.image);
      } catch (err) {
        // toast.error("Failed to load Cover Photo");
      }
    };

    if (activationCode) fetchCover();
  }, [activationCode]);

  return (
    <div className="w-full z-0 pb-24">

      {/* Cover Photo */}
      <div className="w-full h-54 md:h-52 lg:h-56 xl:h-56 overflow-hidden absolute lg:rounded-t-2xl md:rounded-t-2xl">

        {cover ? (
          <img
            src={cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse text-black flex justify-center text-xl font-bold font-Playfair p-4">
            Cover Photo
          </div>
        )}

     
        <div className="absolute inset-0 bg-black/30"></div>

      </div>

    </div>
  );
};

export default ProfileCoverPhoto;
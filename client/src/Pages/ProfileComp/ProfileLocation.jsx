import React from "react";
import { MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios"
import { Link } from "react-router-dom";

const ProfileLocation = ({ activationCode }) => {
  if (!activationCode) return null;

  const [locationData, setLocationData] = useState({});

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile/location/get/${activationCode}`,
          {
            withCredentials: true,
          }
        );

        console.log(res.data.data);
    
          setLocationData(res.data.data);
    
      } catch (err) {
        // console.log(err)
        // setLocationData(null);
      } 
    };

    fetchLocation();
  }, [activationCode]);



  return (
    <div className="w-full flex justify-center mt-2">
      <div className="w-full max-w-4xl rounded-3xl p-6 sm:p-8 ">

        {
            locationData ? (<>
            {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Google Maps */}
          {locationData.googleMapLink && (
            <Link
              to={locationData.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#162338] hover:bg-[#1c2c47] transition-all duration-300 rounded-xl h-11 text-gray-200 font-medium text-sm sm:text-base"
            >
              <MapPin size={18} className="text-yellow-400" />
              View on Google Maps
            </Link>
          )}

          {/* Google Reviews */}
          {locationData.googleReviewLink && (
            <Link
              to={locationData.googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#162338] hover:bg-[#1c2c47] transition-all duration-300 rounded-xl h-11 text-gray-200 font-medium text-sm sm:text-base"
            >
              <Star size={18} className="text-yellow-400" />
              View Google Reviews
            </Link>
          )}

        </div>
        
            </>) : <>
            
            <div className="flex flex-col items-center text-center py-10">
            <p className="text-gray-400 text-sm sm:text-base">
              Add Location & Reviews From Edit Profile
            </p>
          </div>

            </>
        }

      </div>
    </div>
  );
};

export default ProfileLocation;
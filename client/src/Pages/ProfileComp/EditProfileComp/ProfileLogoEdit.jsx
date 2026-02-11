import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfileLogoEdit = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false); 


  // console.log("activation code", id);

  // GET PROFILE LOGO
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-logo/get/${id}`
        );

        setLogo(res.data.profileLogo.image);
      } catch (err) {
        toast.error("Failed to load logo");
      }
    };

    fetchLogo();
  }, [id]);

  // HANDLE FILE
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));

    setShowUpdateBtn(true); 
  };

  // UPDATE LOGO
  const handleUpload = async () => {
    if (!logo) return toast.error("Select image");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("activationCode", id);
      fd.append("image", logo);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-logo/update`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Logo Updated");

      setShowUpdateBtn(false); 
      setPreview(null);
      navigate(`/profile/edit/${id}`, {replace:true});
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">

        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Edit Profile Logo
        </h2>

        {/* LOGO */}
        <div className="relative w-44 h-44 mx-auto">

          <img
            src={preview || logo}
            alt=""
            className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-xl"
          />

          <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full cursor-pointer hover:scale-110 transition">
            <Camera size={18} />

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              hidden
            />
          </label>

        </div>

        {/* UPDATE BUTTON */}
        {showUpdateBtn && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              "Update Logo"
            )}
          </button>
        )}

      </div>
    </div>
  );
};

export default ProfileLogoEdit;

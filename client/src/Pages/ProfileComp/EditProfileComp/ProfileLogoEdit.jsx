import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import ImageCropper from "./ImageCropper/ImageCropper"; 

const ProfileLogoEdit = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

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

  // HANDLE FILE SELECTION
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Store original file for cropping
      setOriginalFile(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setShowCropper(true);
      
    } catch (err) {
      toast.error("Error processing image");
    }
  };

  // HANDLE CROPPED IMAGE
  const handleCropComplete = async (croppedFile) => {
    try {
      setShowCropper(false);
      
      // Additional compression before preview
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      
      const finalFile = await imageCompression(croppedFile, options);
      
      // Create preview
      const previewUrl = URL.createObjectURL(finalFile);
      setPreview(previewUrl);
      
      // Store the final file
      setLogo(finalFile);
      setShowUpdateBtn(true);
      
      // Clean up original image URL
      if (originalImage) {
        URL.revokeObjectURL(originalImage);
      }
      
      // Log file details for debugging
      console.log('Final file size:', finalFile.size / 1024, 'KB');
      console.log('Final file type:', finalFile.type);
      
    } catch (err) {
      console.error('Crop complete error:', err);
      toast.error("Error cropping image");
    }
  };

  // CANCEL CROPPING
  const handleCancelCrop = () => {
    setShowCropper(false);
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
  };

  // UPDATE LOGO
  const handleUpload = async () => {
    if (!logo) return toast.error("Select image");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("activationCode", id);
      
      // Create a new file with proper name and type
      const fileName = `profile-${Date.now()}.jpg`;
      const fileToUpload = new File([logo], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      fd.append("image", fileToUpload);

      // Log FormData contents for debugging
      console.log('Uploading file:', fileToUpload.name, fileToUpload.size, fileToUpload.type);

      const response = await axios.put(
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

      console.log('Upload response:', response.data);
      toast.success("Logo Updated");

      setShowUpdateBtn(false);
      setPreview(null);
      navigate(`/profile/edit/${id}`, { replace: true });
      
    } catch (err) {
      console.error('Upload error:', err);
      
      // Detailed error logging
      if (err.response) {
        console.log('Error response:', err.response.data);
        console.log('Error status:', err.response.status);
        toast.error(err.response.data.message || "Upload failed");
      } else if (err.request) {
        console.log('No response received:', err.request);
        toast.error("Server not responding");
      } else {
        console.log('Error:', err.message);
        toast.error("Upload failed");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Edit Profile Logo
          </h2>

          {/* LOGO */}
          <div className="relative w-44 h-44 mx-auto">
            <img
              src={preview || logo || "https://via.placeholder.com/150"}
              alt="Profile"
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

      {/* CROPPER MODAL */}
      {showCropper && (
        <ImageCropper
          image={originalImage}
          onCancel={handleCancelCrop}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default ProfileLogoEdit;
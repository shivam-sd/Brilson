import React, { useState } from "react";
import axios from "axios";
import { Upload, Loader2, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";



const UpdatePaymentQR = () => {

    const token = localStorage.getItem("adminToken");
    const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchqr = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile-paymentQr/get`);

            // console.log(res)
            setPreview(res.data.paymentqr.image);

        }catch(err){
            console.log(err);
        }
    }
    fetchqr();
  },[]);


  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Select QR image");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("image", image);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-paymentQr/update`,
        fd
      );

      toast.success("QR Updated Successfully");

      setImage(null);
      setPreview(null);

      navigate("/admindashboard");

    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 p-6">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Update Payment QR
        </h2>

        {/* QR Preview Box */}
        <label className="block cursor-pointer">
          <div className="h-64 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500 transition">

            {preview ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-contain rounded-xl p-4"
              />
            ) : (
              <>
                <QrCode size={60} className="text-gray-500 mb-3" />
                <p className="text-gray-400 text-sm">
                  Click to upload QR Code
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
            />
          </div>
        </label>

        {/* Update Button */}
        {image && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 active:scale-95 transition shadow-lg flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Update QR Code
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
};

export default UpdatePaymentQR;

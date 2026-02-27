import React, { useState } from "react";
import axios from "axios";
import { Upload, Loader2, Plus, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ImageCropper from "../ImageCropper/ImageCropper";
import imageCompression from "browser-image-compression";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [productId, setProductId] = useState();
  const [activationCode, setActivationCode] = useState();
  const [form, setForm] = useState({
    title: "",
    description: "",
    activationCode: id,
    price:"",
    link:"",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [OriginalImage, setOriginalImage] = useState(null);
  const [ShowCropper, setShowCropper] = useState(null);
  const [FinalFile, setFinalFile] = useState(null);

  
  //fetch Product details and prefill form
useEffect(() => {
    const fetchProduct = async () => {
        try{
            const res = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/profile-products/get/single/${id}`,
              {withCredentials:true, headers: { Authorization: `Bearer ${token}` } }
            );
            // console.log(res.data.data)
            setForm({
              title: res.data.data.title,
              description: res.data.data.description,
              activationCode: id,
              price:res.data.data.price,
              image: res.data.data.image,
              link:res.data.data.link,
            });
            setProductId(res.data.data._id);
            setPreview(res.data.data.image);
            setActivationCode(res.data.data.activationCode);
          }catch(err){
            toast.error("Failed to load product details");
            console.log(err);
          }
    }
    fetchProduct();
}, [id])


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      setForm({ ...form, image: files[0] });
const imageUrl = URL.createObjectURL(files[0]);
setOriginalImage(imageUrl);
      setPreview(imageUrl);
      setShowCropper(true);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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
      setFinalFile(finalFile);
      
      // Create preview
      const previewUrl = URL.createObjectURL(finalFile);
      setPreview(previewUrl);
      
      
      // Clean up original image URL
      if (OriginalImage) {
        URL.revokeObjectURL(OriginalImage);
      }
      
      // Log file details for debugging
      console.log('Final file size:', finalFile.size / 1024, 'KB');
      console.log('Final file type:', finalFile.type);
      
    } catch (err) {
      console.error('Crop complete error:', err);
      toast.error("Error cropping image");
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);

    if(OriginalImage){
      URL.revokeObjectURL(OriginalImage);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title required");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("activationCode", form.activationCode);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("link", form.link);
      if (form.image) fd.append("image", FinalFile);

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-products/update/${productId}`,
        fd,
        {withCredentials:true, headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);

      toast.success("Product Added");

      setForm({ title: "", description: "", duration: "", price:"", image: null,  });
      setPreview(null);
      navigate(`/profile/edit/${activationCode}`, {replace:true});
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Update Product
          </h2>
          <p className="text-gray-400 text-sm">
            Showcase your product beautifully
          </p>
        </div>

        {/* Image Upload */}
        <label className="block">
          <div className="relative h-52 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition">
            {preview ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <>
                <ImageIcon size={40} className="text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">
                  Click to upload product image
                </p>
              </>
            )}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </label>

        {/* Inputs */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />

        {/* Price */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Product Price"
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />


        {/* Product link */}
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Product Link"
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          rows={4}
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />


        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 transition flex justify-center items-center gap-2 shadow-lg cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Plus size={20} />
              Update Product
            </>
          )}
        </button>
      </form>

      
{/* CROPPER MODAL */}
      {ShowCropper && (
        <ImageCropper
          image={OriginalImage}
          onCancel={handleCancelCrop}
          onCropComplete={handleCropComplete}
        />
      )}


    </div>
  );
};

export default UpdateProduct;

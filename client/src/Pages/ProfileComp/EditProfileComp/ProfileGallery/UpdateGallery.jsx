import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Loader2, Plus, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdateGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    activationCode: id,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);



  // fetch gallery data

  useEffect(() => {
    const fetchGalleryData = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile-gallery/get/single/${id}`);

            setForm({
                  title: res.data.data.title,
    description: res.data.data.description,
    category: res.data.data.category,
    image: null
            });

            setPreview(res.data.data.image)
            console.log(res)

        }catch(err){
            console.log(err);
        }
    }
    fetchGalleryData();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title required");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("activationCode", form.activationCode);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (form.image) fd.append("image", form.image);

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-gallery/update/${id}`,
        fd,
        {withCredentials:true, headers: { Authorization: `Bearer ${token}` } }
      );

    //   console.log(res.data);

      toast.success("Gallery Item Added");

      setForm({ title: "", description: "", duration: "", category: "", image: null,  });
      setPreview(null);
      navigate(`/profile/edit/${res.data.data.activationCode}`, {replace:true});
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
            Update Gallery Item
          </h2>
          <p className="text-gray-400 text-sm">
            Showcase your Gallery beautifully
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
                  Click to upload Gallery image
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
          placeholder="Gallery Item Title"
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Gallery Item Description"
          rows={4}
          className="w-full p-4 rounded-xl bg-gray-900/70 border border-gray-700 focus:border-blue-500 outline-none transition"
        />

 {/* Category */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Gallery Item Category"
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
              Uploading...
            </>
          ) : (
            <>
              <Plus size={20} />
              Update Gallery Item
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateGallery;

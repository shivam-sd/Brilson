import React, { useState } from "react";
import axios from "axios";
import { Loader2, Plus, X, Image as ImgIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const AddServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    features: [""],
    link: "",
    image: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleFeatureChange = (i, val) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm({ ...form, features: updated });
  };

  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });

  const removeFeature = (i) => {
    const updated = form.features.filter((_, idx) => idx !== i);
    setForm({ ...form, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) return toast.error("Title required");
    if (!form.price) return toast.error("Price required");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("activationCode", id);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("link", form.link);
      fd.append(
        "features",
        JSON.stringify(form.features.filter(f => f.trim()))
      );

      if (form.image) {
        fd.append("image", form.image);
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/profile-services/add`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Service Added");
      navigate(`/profile/edit/${id}`, {replace:true});

    } catch (err) {
      toast.error("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-950 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Add Service
        </h2>

        {/* IMAGE */}
        <div className="flex flex-col items-center gap-4">
          {preview ? (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-xl border border-gray-700"
            />
          ) : (
            <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl cursor-pointer text-gray-400">
              <ImgIcon size={30} />
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          )}
        </div>

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />


        {/* Link */}
        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Service Link"
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* FEATURES */}
        {form.features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={f}
              onChange={(e) =>
                handleFeatureChange(i, e.target.value)
              }
              placeholder="Feature"
              className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="bg-red-600 px-3 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="text-blue-400 flex gap-2"
        >
          <Plus size={16} /> Add Feature
        </button>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            "Add Service"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddServices;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Plus, X, Image as ImgIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdateServices = () => {
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

  // FETCH SERVICE
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-services/get/single/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = res.data.data;

        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          features: data.features?.length ? data.features : [""],
          link: data.link || "",
          image: null,
        });

        setPreview(data.image);
      } catch {
        toast.error("Failed to load service");
      }
    };

    fetchService();
  }, [id]);

  // INPUT CHANGE
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // IMAGE HANDLE
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // FEATURES
  const handleFeatureChange = (i, val) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm({ ...form, features: updated });
  };

  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });

  const removeFeature = (i) =>
    setForm({
      ...form,
      features: form.features.filter((_, idx) => idx !== i),
    });

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title required");
    if (!form.price) return toast.error("Price required");

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);

      // Link auto prefix
      let link = form.link.trim();
      if (link && !link.startsWith("http")) {
        link = "https://" + link;
      }
      fd.append("link", link);

      fd.append(
        "features",
        JSON.stringify(form.features.filter((f) => f.trim()))
      );

      // Only send image if new selected
      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile-services/update/${id}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Service Updated");

      navigate(`/profile/edit/${res.data.data.activationCode}`, {
        replace: true,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
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
          Update Service
        </h2>

        {/* IMAGE */}
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          {preview ? (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-xl border border-gray-700 hover:opacity-80 transition"
            />
          ) : (
            <div className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl text-gray-400">
              <ImgIcon size={30} />
              Upload Image
            </div>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImage}
          />
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          className="input"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="input"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="input"
        />

        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Service Link"
          className="input"
        />

        {/* FEATURES */}
        {form.features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={f}
              onChange={(e) => handleFeatureChange(i, e.target.value)}
              placeholder="Feature"
              className="input flex-1"
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

        <button
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex justify-center gap-2 hover:scale-105 transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            "Update Service"
          )}
        </button>
      </form>

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
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default UpdateServices;

import React, { useState } from "react";
import axios from "axios";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const AddServices = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    features: [""],
  });

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Feature change
  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  // Add feature field
  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  // Remove feature
  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title required");
    if (!form.price) return toast.error("Price required");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/profile-services/add`,
        {
          activationCode: id,
          title: form.title,
          description: form.description,
          price: form.price,
          features: form.features.filter(f => f.trim() !== ""),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Service Added");
      navigate(`/profile/edit/${id}`, {replace:true});

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
        className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Add Service
        </h2>

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service Description"
          rows={4}
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
        />

        {/* Features */}
        <div>
          <label className="text-gray-400">Features</label>

          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input
                value={f}
                onChange={(e) =>
                  handleFeatureChange(i, e.target.value)
                }
                placeholder="Feature"
                className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700"
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="bg-red-600 px-3 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="mt-3 flex items-center gap-2 text-blue-400 cursor-pointer"
          >
            <Plus size={16} /> Add Feature
          </button>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex justify-center items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Plus size={18} /> Add Service
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddServices;

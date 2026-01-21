import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Save, Zap, ChevronLeft, Sparkles, CheckCircle, Target, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TransformNetworkAdmin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    badgeText: "",
    heading: "",
    subHeading: "",
    features: [
      "Boost your professional presence",
      "Connect with industry leaders",
      "Showcase your achievements",
      "Expand your network globally"
    ],
  });

  /*  FETCH  */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/transform/`);
        if (res.data?.data) {
          setForm({
            badgeText: res.data.data.badgeText || "READY TO TRANSFORM?",
            heading: res.data.data.heading || "Transform Your Network",
            subHeading: res.data.data.subHeading || "Join thousands who have upgraded their professional networking experience with our smart digital solutions.",
            features: res.data.data.features || [],
          });
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  /*  HANDLERS  */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm((prev) => ({ ...prev, features: updated }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  /*  UPDATE  */
  const handleSave = async () => {
    try {
      setSaving(true);

      await axios.put(`${BASE_URL}/api/admin/transform/update`, form);

      toast.success("Transform section updated successfully!");
      setTimeout(() => {
        navigate("/landing/page/content");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading transform section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
         

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg">
              <Zap className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-white to-violet-400 bg-clip-text text-transparent">
                Transform Network
              </h2>
             
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl mb-10">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Badge Text */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Sparkles size={14} /> Badge Text
              </label>
              <input
                value={form.badgeText}
                onChange={(e) => handleChange("badgeText", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500/50 focus:border-transparent transition group-hover:border-indigo-500/30"
                placeholder="e.g., READY TO TRANSFORM?"
              />
              
            </div>

            {/* Heading */}
            <div className="md:col-span-2 group">
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                Main Heading
              </label>
              <input
                value={form.heading}
                onChange={(e) => handleChange("heading", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500/50 focus:border-transparent transition group-hover:border-indigo-500/30"
                placeholder="e.g., Transform Your Network"
              />
            </div>

            {/* Sub Heading */}
            <div className="md:col-span-2 group">
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                Sub Heading
              </label>
              <textarea
                rows={3}
                value={form.subHeading}
                onChange={(e) => handleChange("subHeading", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-violet-500/50 focus:border-transparent transition resize-none group-hover:border-violet-500/30"
                placeholder="Describe the transformation benefits..."
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10">
                  <CheckCircle className="text-indigo-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Features</h2>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                  {form.features.length} items
                </span>
              </div>
              <button
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 
                         text-white rounded-xl hover:opacity-90 transition-all hover:scale-105"
              >
                <Plus size={18} /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 
                           hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white 
                               placeholder-gray-500 focus:ring-0"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty Features State */}
            {form.features.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-700/50 rounded-xl">
                <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No features added yet</p>
                <p className="text-sm text-gray-500 mt-1">Add key benefits to showcase</p>
              </div>
            )}
          </div>
        </div>

        

        {/* Save Button */}
        <div className="bottom-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                     bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                     shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Transform Section
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransformNetworkAdmin;
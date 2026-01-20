import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, UploadCloud, Save, Zap, Type, Sparkles, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PowerfulFeatures = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [subHeading, setSubHeading] = useState("");
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /*  FETCH DATA  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/admin/powerfull/features`);

        if (res.data?.data) {
          setSubHeading(res.data.data.subHeading || "");
          setFeatures(
            (res.data.data.features || []).map((f) => ({
              ...f,
              newImage: null,
            }))
          );
        }
      } catch (err) {
        toast.error("Failed to load features");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  /*  HANDLERS  */
  const handleFeatureChange = (index, field, value) => {
    setFeatures((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    setFeatures((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              newImage: file,
              image: URL.createObjectURL(file),
            }
          : item
      )
    );
  };

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      { title: "", description: "", image: "", newImage: null },
    ]);
  };

  const removeFeature = (index) => {
    if (features[index]?.image?.startsWith("blob:")) {
      URL.revokeObjectURL(features[index].image);
    }
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  /*  UPDATE  */
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("subHeading", subHeading);

      const cleanFeatures = features.map((f) => ({
        title: f.title,
        description: f.description,
        image: f.newImage ? "" : f.image,
      }));

      formData.append("features", JSON.stringify(cleanFeatures));

      features.forEach((f, index) => {
        if (f.newImage instanceof File) {
          formData.append(`images[${index}]`, f.newImage);
        }
      });

      await axios.put(`${BASE_URL}/api/admin/powerfull/features/update`, formData);

      toast.success("Features updated successfully!");
      setTimeout(() => {
        navigate("landing/page/content");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /*  CLEANUP  */
  useEffect(() => {
    return () => {
      features.forEach((f) => {
        if (f.image?.startsWith("blob:")) {
          URL.revokeObjectURL(f.image);
        }
      });
    };
  }, [features]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">

          <div className="flex items-center justify-center mt-5 gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
              <Zap className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
                Powerful Features
              </h2>
            </div>
          </div>
        </div>

        {/* Sub Heading Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Type className="text-purple-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Section Heading</h2>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Sparkles size={16} /> Sub Heading
            </label>
            <input
              value={subHeading}
              onChange={(e) => setSubHeading(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-purple-500/50 focus:border-transparent transition"
              placeholder="Why choose us? Discover our powerful features..."
            />
            
            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <p className="text-lg text-gray-300">
                {subHeading || "Your subheading will appear here..."}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10">
                <Zap className="text-pink-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Features</h2>
            </div>
            <button
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 
                       text-white rounded-xl hover:opacity-90 transition-all hover:scale-105"
            >
              <Plus size={18} /> Add Feature
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 
                         rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300
                         hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-100 transition-colors">
                      {feature.title || `Feature #${index + 1}`}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Title</label>
                    <input
                      value={feature.title}
                      onChange={(e) =>
                        handleFeatureChange(index, "title", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                               focus:ring-purple-500/50 focus:border-transparent transition"
                      placeholder="Feature Title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(index, "description", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                               focus:ring-pink-500/50 focus:border-transparent transition resize-none"
                      placeholder="Feature Description"
                      rows={3}
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Image</label>
                    
                    {/* Image Preview */}
                    {feature.image && (
                      <div className="relative mb-3 group">
                        <img
                          src={feature.image}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => {
                              if (feature.image.startsWith("blob:")) {
                                URL.revokeObjectURL(feature.image);
                              }
                              handleFeatureChange(index, "image", "");
                              handleFeatureChange(index, "newImage", null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {!feature.image && (
                      <label className="flex flex-col items-center justify-center p-6 
                                      border-2 border-dashed border-gray-700 rounded-lg 
                                      hover:border-purple-500 hover:bg-purple-500/5 cursor-pointer transition group">
                        <UploadCloud className="text-gray-500 mb-2 group-hover:text-purple-400 transition group-hover:scale-110" size={24} />
                        <span className="text-sm text-gray-400 group-hover:text-purple-300 transition">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(index, e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {features.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/50">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 mb-4">
                <Zap className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl text-gray-300 mb-2">No Features Yet</h3>
              <p className="text-gray-500 mb-6">Add your first feature to showcase your strengths</p>
              <button
                onClick={addFeature}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 
                         text-white rounded-xl hover:opacity-90 transition-all"
              >
                <Plus size={18} /> Create First Feature
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="bottom-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                     bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                     shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PowerfulFeatures;
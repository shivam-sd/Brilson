import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  Save, 
  Sparkles, 
  Type, 
  Heading, 
  Zap,
  PenTool
} from "lucide-react";
import { toast } from "react-toastify";

const HomePageContent = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const [hero, setHero] = useState({
    badgeText: "",
    headingPrimary: "",
    headingAccent: "",
    subHeading: "",
    highlight: ""
  });

  const [features, setFeatures] = useState([
    { 
      title: "", 
      description: "", 
      image: "", 
      file: null 
    },
  ]);

  /*  FETCH EXISTING DATA  */
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/home/content`
        );

        const data = res.data.data;

        if (data) {
          setHero({
            badgeText: data.heroSection?.badgeText || "",
            headingPrimary: data.heroSection?.headingPrimary || "",
            headingAccent: data.heroSection?.headingAccent || "",
            subHeading: data.heroSection?.subHeading || "",
            highlight: data.heroSection?.Highlight || ""
          });

          setFeatures(
            data.features?.items || features
          );
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  /*  FEATURE HANDLERS  */
  const addFeature = () => {
    setFeatures([
      ...features,
      { title: "", description: "", image: "", file: null }
    ]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  // Handle image upload with preview
  const handleImageUpload = (index, file) => {
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      
      const updated = [...features];
      updated[index] = {
        ...updated[index],
        file: file,
        image: imageUrl // Set the preview URL
      };
      setFeatures(updated);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      features.forEach(feature => {
        if (feature.image && feature.image.startsWith('blob:')) {
          URL.revokeObjectURL(feature.image);
        }
      });
    };
  }, []);

  /*  SUBMIT  */
  const handleSubmit = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      // hero
      formData.append("badgeText", hero.badgeText);
      formData.append("headingPrimary", hero.headingPrimary);
      formData.append("headingAccent", hero.headingAccent);
      formData.append("subHeading", hero.subHeading);
      formData.append("highlight", hero.highlight);

      // features JSON (image url preserve)
      formData.append(
        "features",
        JSON.stringify(
          features.map((f) => ({
            title: f.title,
            description: f.description,
            image: f.file ? "" : f.image // Don't send blob URLs
          }))
        )
      );

      // feature images
      features.forEach((f) => {
        if (f.file) {
          formData.append("images", f.file);
        }
      });

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/home/content/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      navigate("/landing/page/content");
      toast.success("Homepage updated successfully!");

      // Refresh data after save
      window.location.reload();
      
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
              <PenTool className="text-white" size={15} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Homepage 
              </h2>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/10">
              <Sparkles className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Hero Section</h2>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Type size={16} /> Badge Text
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-cyan-500/50 focus:border-transparent transition"
                  placeholder="e.g., TRENDING NOW"
                  value={hero.badgeText}
                  onChange={(e) =>
                    setHero({ ...hero, badgeText: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Heading size={16} /> Heading Accent
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-purple-500/50 focus:border-transparent transition"
                  placeholder="e.g., Dream Project"
                  value={hero.headingAccent}
                  onChange={(e) =>
                    setHero({ ...hero, headingAccent: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Heading size={16} /> Heading Primary
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="e.g., Build Your"
                  value={hero.headingPrimary}
                  onChange={(e) =>
                    setHero({ ...hero, headingPrimary: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Zap size={16} /> Highlight Text
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-emerald-500/50 focus:border-transparent transition"
                  placeholder="e.g., No credit card required"
                  value={hero.highlight}
                  onChange={(e) =>
                    setHero({ ...hero, highlight: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                Sub Heading
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition resize-none"
                placeholder="Enter your sub heading description..."
                rows={4}
                value={hero.subHeading}
                onChange={(e) =>
                  setHero({ ...hero, subHeading: e.target.value })
                }
              />
            </div>

            {/* Preview Card */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                  {hero.badgeText || "Your Badge"}
                </span>
                <h2 className="text-3xl font-bold text-white">
                  {hero.headingPrimary || "Heading Primary"} 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    {" "}{hero.headingAccent || "Accent Text"}
                  </span>
                </h2>
                <p className="text-gray-300">
                  {hero.subHeading || "Your sub heading will appear here..."}
                </p>
                {hero.highlight && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Zap size={16} />
                    {hero.highlight}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <Zap className="text-purple-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Features Section</h2>
            </div>
            <button
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 
                       text-white rounded-xl hover:opacity-90 transition-all"
            >
              <Plus size={18} /> Add Feature
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 
                         rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-white">
                      {feature.title || `Feature #${index + 1}`}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Title</label>
                    <input
                      className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                               focus:ring-blue-500/50 focus:border-transparent transition"
                      placeholder="Feature title"
                      value={feature.title}
                      onChange={(e) =>
                        handleFeatureChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Description</label>
                    <textarea
                      className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                               text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                               focus:ring-purple-500/50 focus:border-transparent transition resize-none"
                      placeholder="Feature description"
                      rows={2}
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(index, "description", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Image</label>
                    
                    {/* Show image preview if exists */}
                    {(feature.image || feature.file) && (
                      <div className="relative mb-3">
                        <img
                          src={feature.image || (feature.file ? URL.createObjectURL(feature.file) : "")}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            // Clean up URL if it's a blob
                            if (feature.image && feature.image.startsWith('blob:')) {
                              URL.revokeObjectURL(feature.image);
                            }
                            handleFeatureChange(index, "image", "");
                            handleFeatureChange(index, "file", null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    {/* Upload area - only show if no image */}
                    {!feature.image && !feature.file && (
                      <label className="flex flex-col items-center justify-center p-6 
                                      border-2 border-dashed border-gray-700 rounded-lg 
                                      hover:border-cyan-500 hover:bg-cyan-500/5 cursor-pointer transition group">
                        <UploadCloud className="text-gray-500 mb-2 group-hover:text-cyan-400 transition" size={24} />
                        <span className="text-sm text-gray-400 group-hover:text-cyan-300 transition">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(index, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bottom-6 flex gap-4 p-4 bg-gray-900/80 backdrop-blur-sm 
                      border border-gray-700/50 rounded-2xl shadow-2xl">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-cyan-500 to-blue-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageContent;
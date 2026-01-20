import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  UploadCloud,
  Save,
  PlayCircle,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronLeft,
  Layers,
  Zap,
  BookOpen,
  ListOrdered
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HowToUseAdmin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [heading, setHeading] = useState("How to Use Smart Card");
  const [subHeading, setSubHeading] = useState("Just follow these simple steps");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/howtouse`);

        if (res.data?.data) {
          setHeading(res.data.data.heading || "How to Use Smart Card");
          setSubHeading(res.data.data.subHeading || "Just follow these simple steps");
          setSteps(
            (res.data.data.steps || []).map((s) => ({
              ...s,
              newGuide: null,
            }))
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load How To Use section");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  /* ================= HANDLERS ================= */
  const handleStepChange = (index, field, value) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    );
  };

  const handleGuideChange = (index, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setSteps((prev) =>
      prev.map((step, i) =>
        i === index
          ? {
              ...step,
              newGuide: file,
              guide: previewUrl,
            }
          : step
      )
    );
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { title: "", description: "", guide: "", newGuide: null },
    ]);
  };

  const removeStep = (index) => {
    if (steps[index]?.guide?.startsWith("blob:")) {
      URL.revokeObjectURL(steps[index].guide);
    }
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subHeading", subHeading);

      const cleanSteps = steps.map((s) => ({
        title: s.title,
        description: s.description,
        guide: s.guide?.startsWith("blob:") ? "" : s.guide,
      }));

      formData.append("steps", JSON.stringify(cleanSteps));

      steps.forEach((step, index) => {
        if (step.newGuide instanceof File) {
          formData.append(`guide[${index}]`, step.newGuide);
        }
      });

      await axios.put(
        `${BASE_URL}/api/admin/howtouse/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("How To Use updated successfully!");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
              <BookOpen className="text-white" size={16} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-white to-teal-400 bg-clip-text text-transparent">
                How To Use Editor
              </h2>
            </div>
          </div>
        </div>

        {/* Heading Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <Zap className="text-emerald-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Section Heading</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <FileText size={16} /> Main Heading
              </label>
              <input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/50 focus:border-transparent transition"
                placeholder="How to use smart card"
              />
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <FileText size={16} /> Sub Heading
              </label>
              <input
                value={subHeading}
                onChange={(e) => setSubHeading(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-teal-500/50 focus:border-transparent transition"
                placeholder="Just follow these steps"
              />
            </div>
          </div>
          </div>

        {/* Steps Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                <ListOrdered className="text-blue-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Steps</h2>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {steps.length} steps
              </span>
            </div>
            <button
              onClick={addStep}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 
                       text-white rounded-xl hover:opacity-90 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus size={18} /> Add Step
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 
                         rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300
                         hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-md opacity-20"></div>
                      <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <span className="text-white font-bold text-xl">{index + 1}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-100 transition-colors">
                      {step.title || `Step ${index + 1}`}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeStep(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Title</label>
                      <input
                        value={step.title}
                        onChange={(e) =>
                          handleStepChange(index, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                                 text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                                 focus:ring-blue-500/50 focus:border-transparent transition"
                        placeholder="Step title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) =>
                          handleStepChange(index, "description", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                                 text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                                 focus:ring-cyan-500/50 focus:border-transparent transition resize-none"
                        placeholder="Step description"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Guide Media</label>
                    
                    {/* Media Preview */}
                    {step.guide && (
                      <div className="relative mb-3 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                        <div className="relative rounded-xl overflow-hidden">
                          {step.guide.includes(".mp4") ||
                          step.guide.includes("video") ||
                          step.guide.type?.includes("video") ? (
                            <div className="relative">
                              <video
                                src={step.guide}
                                controls
                                className="w-full h-48 object-cover rounded-xl"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-3 bg-black/50 rounded-full">
                                  <PlayCircle className="text-white" size={32} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={step.guide}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl"
                            />
                          )}
                          <button
                            onClick={() => {
                              if (step.guide.startsWith("blob:")) {
                                URL.revokeObjectURL(step.guide);
                              }
                              handleStepChange(index, "guide", "");
                              handleStepChange(index, "newGuide", null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {!step.guide && (
                      <label className="flex flex-col items-center justify-center p-8 
                                      border-2 border-dashed border-gray-700 rounded-xl 
                                      hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer transition group">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 mb-3 group-hover:scale-110 transition">
                          <UploadCloud className="text-gray-400 group-hover:text-blue-400" size={28} />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-blue-300 transition mb-2">
                          Click to upload image or video
                        </span>
                        <span className="text-xs text-gray-500">
                          Supports: JPG, PNG, MP4, MOV
                        </span>
                        <input
                          type="file"
                          hidden
                          accept="image/*,video/*"
                          onChange={(e) =>
                            handleGuideChange(index, e.target.files[0])
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
          {steps.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/50">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 mb-4">
                <Layers className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl text-gray-300 mb-2">No Steps Yet</h3>
              <p className="text-gray-500 mb-6">Create your first step-by-step guide</p>
              <button
                onClick={addStep}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 
                         text-white rounded-xl hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus size={18} /> Add First Step
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
                     bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                     shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Guide...
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

export default HowToUseAdmin;
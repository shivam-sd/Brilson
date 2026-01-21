import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  UploadCloud,
  Save,
  Star,
  MessageSquare,
  User,
  Quote,
  ChevronLeft,
  Users,
  Sparkles,
  Award
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TestimonialsAdmin = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /*  FETCH  */
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/testimonials`);
        setTestimonials(
          (res.data?.testimonials || []).map((t) => ({
            ...t,
            newImage: null,
            removeImage: false,
          }))
        );
      } catch (err) {
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [BASE_URL]);

  /*  HANDLERS  */
  const handleChange = (index, field, value) => {
    setTestimonials((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setTestimonials((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              image: preview,
              newImage: file,
              removeImage: false,
            }
          : item
      )
    );
  };

  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        _id: null,
        name: "",
        review: "",
        rating: 5,
        image: "",
        newImage: null,
        removeImage: false,
      },
    ]);
  };

  const removeTestimonial = (index) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  };

  /*  UPDATE  */
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      const payload = testimonials.map((t) => ({
        _id: t._id || null,
        name: t.name,
        review: t.review,
        rating: t.rating,
        image: t.image?.startsWith("blob:") ? "" : t.image,
        removeImage: t.removeImage || false,
      }));

      formData.append("testimonials", JSON.stringify(payload));

      testimonials.forEach((t, index) => {
        if (t.newImage instanceof File) {
          formData.append(`image[${index}]`, t.newImage);
        }
      });

      await axios.put(
        `${BASE_URL}/api/admin/testimonials/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Testimonials updated successfully!");
      setTimeout(() => {
        navigate("/landing/page/content");
      }, 1500);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
              <Quote className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-white to-orange-400 bg-clip-text text-transparent">
                Testimonials 
              </h2>
      
            </div>
          </div>  </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <MessageSquare className="text-amber-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          </div>
          <button
            onClick={addTestimonial}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 
                     text-white rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg cursor-pointer"
          >
            <Plus size={18} /> Add Testimonial
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="group bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 
                       rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300
                       hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-amber-100 transition-colors">
                    {item.name || `Testimonial ${index + 1}`}
                  </h3>
                </div>
                <button
                  onClick={() => removeTestimonial(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <User size={14} /> Client Name
                  </label>
                  <input
                    value={item.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder="Enter client name"
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                             focus:ring-amber-500/50 focus:border-transparent transition"
                  />
                </div>

                {/* Review Input */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <MessageSquare size={14} /> Review
                  </label>
                  <textarea
                    value={item.review}
                    onChange={(e) => handleChange(index, "review", e.target.value)}
                    placeholder="Enter client review"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                             focus:ring-orange-500/50 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleChange(index, "rating", star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={22}
                          className={`${
                            star <= item.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-600"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-400">
                      {item.rating}/5 stars
                    </span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Profile Photo</label>
                  
                  {/* Image Preview */}
                  {item.image && (
                    <div className="relative mb-3 group">
                      <div className="absolute -inset-0.5 rounded-full blur opacity-20 group-hover:opacity-30 transition"></div>
                      <div className="relative">
                        <img
                          src={item.image}
                          alt="Preview"
                          className="h-24 w-24 rounded-full object-cover border-2 border-gray-700"
                        />
                        <button
                          onClick={() => {
                            setTestimonials((prev) =>
                              prev.map((t, i) =>
                                i === index
                                  ? {
                                      ...t,
                                      image: "",
                                      newImage: null,
                                      removeImage: true,
                                    }
                                  : t
                              )
                            );
                          }}
                          className="absolute top-0 right-0 p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition hover:scale-110"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  {!item.image && (
                    <label className="flex flex-col items-center justify-center p-4 
                                    border-2 border-dashed border-gray-700 rounded-full 
                                    hover:border-amber-500 hover:bg-amber-500/5 cursor-pointer transition group w-24 h-24">
                      <UploadCloud className="text-gray-500 group-hover:text-amber-400 transition" size={20} />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/50 mb-10">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 mb-4">
              <Quote className="w-12 h-12 text-amber-400" />
            </div>
            <h3 className="text-xl text-gray-300 mb-2">No Testimonials Yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first customer review</p>
            <button
              onClick={addTestimonial}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 
                       text-white rounded-xl hover:opacity-90 transition-all"
            >
              <Plus size={18} /> Add First Testimonial
            </button>
          </div>
        )}

        {/* Save Button */}
        <div className="bottom-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                     bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                     shadow-xl hover:shadow-2xl hover:shadow-amber-500/25 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Save All Testimonials
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
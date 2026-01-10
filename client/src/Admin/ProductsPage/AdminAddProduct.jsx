import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Product state - WITHOUT variants
  const [productData, setProductData] = useState({
    category: "",
    title: "",
    badge: "",
    image: "",
    description: "",
    price: "",
    oldPrice: "",
    color: "",
    discount: "",
    features: [""],
    metaTags: [""]
  });

  // fetch all category
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/category/active`
      );
      setCategories(res?.data?.categories || []);
    };
    fetchCategories();
  }, []);

  // fetch all badges
  useEffect(() => {
    const fetchBadges = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/badges/active`
      );
      setBadges(res?.data?.badges || []);
    };
    fetchBadges();
  }, []);

  // image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add feature
  const addFeature = () => {
    setProductData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  // Update feature
  const updateFeature = (index, value) => {
    const newFeatures = [...productData.features];
    newFeatures[index] = value;
    setProductData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  // Remove feature
  const removeFeature = (index) => {
    const newFeatures = productData.features.filter((_, i) => i !== index);
    setProductData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  // Add Meta tags
  const addMetaTags = () => {
    setProductData((prev) => ({
      ...prev,
      metaTags: [...prev.metaTags, ""],
    }));
  };

  // Update meta tags
  const updateMetaTags = (index, value) => {
    const newMetaTags = [...productData.metaTags];
    newMetaTags[index] = value;
    setProductData((prev) => ({
      ...prev,
      metaTags: newMetaTags,
    }));
  };

  // Remove feature
  const removeMetaTags = (index) => {
    const newMetaTags = productData.metaTags.filter((_, i) => i !== index);
    setProductData((prev) => ({
      ...prev,
      metaTags: newMetaTags,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Product image is required");
      return;
    }
    
    if (!productData.price) {
      toast.error("Product price is required");
      return;
    }
    
    setIsSubmitting(true);

    // Prepare data for API
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("category", productData.category);
    formData.append("badge", productData.badge);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("oldPrice", productData.oldPrice || "");
    formData.append("color", productData.color || "");
    formData.append("discount", productData.discount || "");
    formData.append("image", imageFile);

    formData.append(
      "features",
      JSON.stringify(productData.features.filter((f) => f.trim()))
    );
    formData.append(
      "metaTags",
      JSON.stringify(productData.metaTags.filter((m) => m.trim()))
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/add/products`,
        formData,
        { withCredentials: true, 
          headers:{
            Authorization: `${localStorage.getItem("token")}`
          }
         }
      );

      toast.success("Product added successfully");
      navigate("/admindashboard/products/list");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-gray-400 mt-2">
            Fill in all product details below
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium NFC Card"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Badge
                </label>
                <select
                  name="badge"
                  value={productData.badge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer"
                >
                  <option value="">Select Badge</option>
                  {badges.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="299"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  required
                />
              </div>

              {/* Old Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Old Price (₹)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={productData.oldPrice}
                  onChange={handleInputChange}
                  placeholder="399"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={productData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., White, Black, Silver"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount
                </label>
                <input
                  type="text"
                  name="discount"
                  value={productData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 25% OFF or ₹100 OFF"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your product features and benefits..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition resize-none"
                required
              />
            </div>

            {/* Features Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Product Features ({productData.features.length})
                </h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                >
                  <FiPlus size={16} /> Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {productData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1} (e.g., NFC Enabled, QR Code)`}
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                    {productData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
                        title="Remove feature"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Tags Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Product Meta Tags ({productData.metaTags.length})
                </h3>
                <button
                  type="button"
                  onClick={addMetaTags}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                >
                  <FiPlus size={16} /> Add Meta Tags
                </button>
              </div>

              <div className="space-y-3">
                {productData.metaTags.map((metaTags, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={metaTags}
                      onChange={(e) => updateMetaTags(index, e.target.value)}
                      placeholder={`Meta Tag ${index + 1} (e.g., #NFC Enabled, #QR Code)`}
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                    {productData.metaTags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMetaTags(index)}
                        className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
                        title="Remove meta tag"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Product Image
                </h3>
                <span className="text-sm text-gray-400">
                  Required • Max size: 5MB
                </span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Product Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                  required
                />

                {previewImage && (
                  <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Preview
                    </label>
                    <img
                      src={previewImage}
                      alt="Product Preview"
                      className="w-full h-64 rounded-xl border border-gray-600 object-contain bg-gray-900"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={() => navigate("/admindashboard/products/list")}
                  className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 px-12 py-4 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <FiSave size={20} />
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
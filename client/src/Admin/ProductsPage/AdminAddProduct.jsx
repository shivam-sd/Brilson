import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave, FiX, FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  
  // Multiple images state
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Product state - WITHOUT variants
  const [productData, setProductData] = useState({
    category: "",
    title: "",
    badge: "",
    description: "",
    price: "",
    oldPrice: "",
    color: "",
    stock: "",
    
    // GST Fields
    gstEnabled: "false",
    gstRate: "18",
    
    // Discount Fields
    discountEnabled: "false",
    discountType: "percentage",
    discountValue: "",
    
    features: [""],
    metaTags: [""]
  });

  // fetch all category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/category/active`
        );
        setCategories(res?.data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // fetch all badges
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/badges/active`
        );
        setBadges(res?.data?.badges || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };
    fetchBadges();
  }, []);

  // Multiple image upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (Invalid format)`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (Max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }
    
    if (validFiles.length > 0) {
      // Limit to maximum 10 images
      const currentCount = imageFiles.length;
      const availableSlots = 10 - currentCount;
      const filesToAdd = validFiles.slice(0, availableSlots);
      
      if (filesToAdd.length < validFiles.length) {
        toast.warning(`Only ${availableSlots} more image(s) allowed. Maximum 10 images total.`);
      }
      
      const newFiles = [...imageFiles, ...filesToAdd];
      setImageFiles(newFiles);
      
      // Create preview URLs
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };
  
  // Remove image
  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    
    setImageFiles(newImageFiles);
    setPreviewImages(newPreviewImages);
  };
  
  // Reorder images (drag and drop)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    const newImageFiles = [...imageFiles];
    const newPreviewImages = [...previewImages];
    
    // Reorder files
    const [movedFile] = newImageFiles.splice(dragIndex, 1);
    newImageFiles.splice(dropIndex, 0, movedFile);
    
    // Reorder previews
    const [movedPreview] = newPreviewImages.splice(dragIndex, 1);
    newPreviewImages.splice(dropIndex, 0, movedPreview);
    
    setImageFiles(newImageFiles);
    setPreviewImages(newPreviewImages);
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProductData((prev) => ({
        ...prev,
        [name]: checked.toString(),
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  // Remove meta tags
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
    
    // Validation
    if (imageFiles.length === 0) {
      toast.error("At least one product image is required");
      return;
    }
    
    if (!productData.title.trim()) {
      toast.error("Product title is required");
      return;
    }
    
    if (!productData.category) {
      toast.error("Product category is required");
      return;
    }
    
    if (!productData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    
    if (!productData.price || productData.price <= 0) {
      toast.error("Valid product price is required");
      return;
    }
    
    setIsSubmitting(true);

    // Prepare data for API
    const formData = new FormData();
    formData.append("title", productData.title.trim());
    formData.append("category", productData.category);
    formData.append("badge", productData.badge || "");
    formData.append("description", productData.description.trim());
    formData.append("price", productData.price);
    formData.append("oldPrice", productData.oldPrice || "");
    formData.append("color", productData.color || "");
    formData.append("stock", productData.stock || "0");
    
    // GST Fields
    formData.append("gstEnabled", productData.gstEnabled);
    formData.append("gstRate", productData.gstRate);
    
    // Discount Fields
    formData.append("discountEnabled", productData.discountEnabled);
    formData.append("discountType", productData.discountType);
    formData.append("discountValue", productData.discountValue || "0");
    
    // Append all images - Use 'images' field name to match backend expectation
    imageFiles.forEach((file, index) => {
      formData.append("images", file);
    });

    formData.append(
      "features",
      JSON.stringify(productData.features.filter((f) => f.trim()))
    );
    formData.append(
      "metaTags",
      JSON.stringify(productData.metaTags.filter((m) => m.trim()))
    );

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/add/products`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Authorization': token || ''
          }
        }
      );

      toast.success("Product added successfully");
      navigate("/admindashboard/products/list");
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
                    <option key={b._id || b.name} value={b.name}>
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
                  min="0"
                  step="0.01"
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
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="0"
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
            </div>

            {/* GST Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  GST Configuration
                </h3>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="gstEnabled"
                      checked={productData.gstEnabled === "true"}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'gstEnabled',
                          type: 'checkbox',
                          checked: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {productData.gstEnabled === "true" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>

              {productData.gstEnabled === "true" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    name="gstRate"
                    value={productData.gstRate}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  />
                </div>
              )}
            </div>

            {/* Discount Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Discount Configuration
                </h3>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="discountEnabled"
                      checked={productData.discountEnabled === "true"}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'discountEnabled',
                          type: 'checkbox',
                          checked: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {productData.discountEnabled === "true" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>

              {productData.discountEnabled === "true" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount Type
                    </label>
                    <select
                      name="discountType"
                      value={productData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {productData.discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={productData.discountValue}
                      onChange={handleInputChange}
                      placeholder={productData.discountType === "percentage" ? "10" : "100"}
                      min="0"
                      step={productData.discountType === "percentage" ? "0.01" : "1"}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                    />
                  </div>
                </div>
              )}
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
                      placeholder={`Meta Tag ${index + 1} (e.g., NFC, QR Code)`}
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

            {/* Multiple Image Upload Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Product Images
                </h3>
                <span className="text-sm text-gray-400">
                  {imageFiles.length}/10 images • Max 5MB each
                </span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Product Images *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can select multiple images at once. Drag and drop to reorder. First image will be the main product image.
                </p>

                {/* Image Preview Grid */}
                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm text-gray-400 mb-3">
                      Image Gallery ({previewImages.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {previewImages.map((preview, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-600 hover:border-cyan-500 transition bg-gray-900">
                            <img
                              src={preview}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Image+Error";
                              }}
                            />
                            {/* Image number badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {index + 1}
                            </div>
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"
                              title="Remove image"
                            >
                              <FiX size={14} />
                            </button>
                            {/* Drag handle */}
                            <div className="absolute bottom-2 left-2 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition cursor-move">
                              <FiImage size={12} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiLoader, FiX, FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  
  // Multiple images state
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // Product state WITHOUT variants
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
        setCategories([]);
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
        setBadges([]);
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
      const currentCount = imageFiles.length + existingImages.length;
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
  
  // Remove new image (not yet uploaded)
  const removeNewImage = (index) => {
    URL.revokeObjectURL(previewImages[index]);
    
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    
    setImageFiles(newImageFiles);
    setPreviewImages(newPreviewImages);
  };
  
  // Remove existing image (mark for deletion)
  const removeExistingImage = (index) => {
    const removedImage = existingImages[index];
    setRemovedImages([...removedImages, removedImage]);
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
    toast.info("Image will be removed on update");
  };
  
  // Restore removed image
  const restoreExistingImage = (imageUrl) => {
    const newRemovedImages = removedImages.filter(img => img !== imageUrl);
    setRemovedImages(newRemovedImages);
    setExistingImages([...existingImages, imageUrl]);
  };

  // Reorder images (drag and drop)
  const handleDragStart = (e, index, type) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, type }));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, dropIndex, dropType) => {
    e.preventDefault();
    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { index: dragIndex, type: dragType } = dragData;
    
    if (dragType !== dropType) return;
    
    if (dragType === 'existing') {
      const newExistingImages = [...existingImages];
      const [movedImage] = newExistingImages.splice(dragIndex, 1);
      newExistingImages.splice(dropIndex, 0, movedImage);
      setExistingImages(newExistingImages);
    } else if (dragType === 'new') {
      const newImageFiles = [...imageFiles];
      const newPreviewImages = [...previewImages];
      const [movedFile] = newImageFiles.splice(dragIndex, 1);
      const [movedPreview] = newPreviewImages.splice(dragIndex, 1);
      newImageFiles.splice(dropIndex, 0, movedFile);
      newPreviewImages.splice(dropIndex, 0, movedPreview);
      setImageFiles(newImageFiles);
      setPreviewImages(newPreviewImages);
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/find/products/${id}`
        );
        
        if (response.data?.product) {
          const product = response.data.product;
          
          // Handle product data
          setProductData({
            category: product.category || "",
            title: product.title || "",
            badge: product.badge || "",
            description: product.description || "",
            price: product.price || "",
            oldPrice: product.oldPrice || "",
            color: product.color || "",
            stock: product.stock || "0",
            
            // GST Fields
            gstEnabled: product.gst?.enabled?.toString() || "false",
            gstRate: product.gst?.rate?.toString() || "18",
            
            // Discount Fields
            discountEnabled: product.discount?.enabled?.toString() || "false",
            discountType: product.discount?.type || "percentage",
            discountValue: product.discount?.value?.toString() || "",
            
            features: product.features?.length > 0 ? product.features : [""],
            metaTags: product.metaTags?.length > 0 ? product.metaTags : [""]
          });

          // Set existing images
          if (product.images && product.images.length > 0) {
            setExistingImages(product.images);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(error?.response?.data?.error || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProductData(prev => ({
        ...prev,
        [name]: checked.toString(),
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add feature
  const addFeature = () => {
    setProductData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  // Update feature
  const updateFeature = (index, value) => {
    const newFeatures = [...productData.features];
    newFeatures[index] = value;
    setProductData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  // Remove feature
  const removeFeature = (index) => {
    const newFeatures = productData.features.filter((_, i) => i !== index);
    setProductData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  // Add meta Tags
  const addMetaTags = () => {
    setProductData(prev => ({
      ...prev,
      metaTags: [...prev.metaTags, ""]
    }));
  };

  // Update metaTags
  const updateMetaTags = (index, value) => {
    const newMetaTags = [...productData.metaTags];
    newMetaTags[index] = value;
    setProductData(prev => ({
      ...prev,
      metaTags: newMetaTags
    }));
  };

  // Remove meta Tags
  const removeMetaTags = (index) => {
    const newMetaTags = productData.metaTags.filter((_, i) => i !== index);
    setProductData(prev => ({
      ...prev,
      metaTags: newMetaTags
    }));
  };

  // Handle form submission with multiple images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add all product data
      formData.append('category', productData.category);
      formData.append('title', productData.title);
      formData.append('badge', productData.badge || "");
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('oldPrice', productData.oldPrice || "");
      formData.append('color', productData.color || "");
      formData.append('stock', productData.stock || "0");
      
      // GST Fields
      formData.append('gstEnabled', productData.gstEnabled);
      formData.append('gstRate', productData.gstRate);
      
      // Discount Fields
      formData.append('discountEnabled', productData.discountEnabled);
      formData.append('discountType', productData.discountType);
      formData.append('discountValue', productData.discountValue || "0");
      
      // Add features as JSON string
      const filteredFeatures = productData.features.filter(f => f.trim() !== "");
      formData.append('features', JSON.stringify(filteredFeatures));
      
      // Add metaTags as JSON string
      const filteredMetaTags = productData.metaTags.filter(m => m.trim() !== "");
      formData.append('metaTags', JSON.stringify(filteredMetaTags));
      
      // Add existing images (that weren't removed)
      formData.append('existingImages', JSON.stringify(existingImages));
      
      // Add removed images
      formData.append('removedImages', JSON.stringify(removedImages));
      
      // Add new images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // Make API call
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/update/products/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `${localStorage.getItem("token")}`,
          }
        }
      );
      
      if (response.data.success) {
        toast.success("Product updated successfully!");
        navigate('/admindashboard/products/list');
      } else {
        throw new Error(response.data.message || "Update failed");
      }
      
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to update product");
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + imageFiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Update Product
          </h1>
          <p className="text-gray-400 mt-2">Edit product details below</p>
          <div className="mt-2 text-sm text-cyan-300">
            Product ID: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{id}</span>
          </div>
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
                    <option key={c._id} value={c.name}>{c.name}</option>
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
                    <option key={b._id} value={b.name}>{b.name}</option>
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
                  <FiPlus size={16} /> Add Meta tags
                </button>
              </div>
              
              <div className="space-y-3">
                {productData.metaTags.map((meta, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={meta}
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
                  {totalImages}/10 images • Max 5MB each
                </span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload New Images
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

                {/* Existing Images Gallery */}
                {existingImages.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm text-gray-400 mb-3">
                      Current Images ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {existingImages.map((image, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, 'existing')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, 'existing')}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-600 hover:border-cyan-500 transition bg-gray-900">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Image+Error";
                              }}
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {index + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"
                              title="Remove image"
                            >
                              <FiX size={14} />
                            </button>
                            <div className="absolute bottom-2 left-2 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition cursor-move">
                              <FiImage size={12} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Gallery */}
                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm text-gray-400 mb-3">
                      New Images ({previewImages.length})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {previewImages.map((preview, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, 'new')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, 'new')}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-600 hover:border-cyan-500 transition bg-gray-900">
                            <img
                              src={preview}
                              alt={`New Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Image+Error";
                              }}
                            />
                            <div className="absolute top-2 left-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded-full">
                              NEW
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"
                              title="Remove image"
                            >
                              <FiX size={14} />
                            </button>
                            <div className="absolute bottom-2 left-2 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition cursor-move">
                              <FiImage size={12} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Removed Images Info */}
                {removedImages.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400">
                      ⚠️ {removedImages.length} image(s) will be removed from the product.
                      <button
                        type="button"
                        onClick={() => {
                          setExistingImages([...existingImages, ...removedImages]);
                          setRemovedImages([]);
                          toast.info("All images restored");
                        }}
                        className="ml-2 text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Undo all
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={() => navigate('/admindashboard/products/list')}
                  className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 px-12 py-4 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" size={20} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave size={20} />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
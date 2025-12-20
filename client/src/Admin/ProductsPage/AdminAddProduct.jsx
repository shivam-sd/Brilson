import React, { useState } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product state - only essential fields
  const [productData, setProductData] = useState({
    category: "Basic Card",
    title: "",
    badge: "BASIC",
    description: "",
    features: [""],
    variants: [{
      name: "",
      price: "",
      oldPrice: "",
      color: "",
      discount: ""
    }]
  });

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new variant
  const addVariant = () => {
    setProductData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", price: "", oldPrice: "", color: "", discount: "" }
      ]
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      const newVariants = [...productData.variants];
      newVariants.splice(index, 1);
      setProductData(prev => ({
        ...prev,
        variants: newVariants
      }));
    }
  };

  // Update variant field
  const updateVariant = (index, field, value) => {
    const newVariants = [...productData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setProductData(prev => ({
      ...prev,
      variants: newVariants
    }));
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for API
    const submitData = {
      category: productData.category,
      title: productData.title,
      badge: productData.badge,
      description: productData.description,
      features: productData.features.filter(f => f.trim() !== ""),
      variants: productData.variants.filter(v => v.name.trim() !== "" && v.price !== "")
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/add/products`,
        submitData, {
          withCredentials:true
        }
      );
      
      toast.success("Product added successfully!");
      navigate('/admindashboard/products/list');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error?.response?.data?.error || "Failed to add product");
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
          <p className="text-gray-400 mt-2">Fill in all product details below</p>
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
                  <option value="Basic Card">Basic Card</option>
                  <option value="Premium Card">Premium Card</option>
                  <option value="NFC Card">NFC Card</option>
                  <option value="Metal Card">Metal Card</option>
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
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="BEST_SELLER">BEST SELLER</option>
                </select>
              </div>

              {/* Price (from first variant) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Starting Price (₹) *
                </label>
                <input
                  type="number"
                  value={productData.variants[0]?.price || ""}
                  onChange={(e) => updateVariant(0, 'price', e.target.value)}
                  placeholder="299"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  required
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
                <h3 className="text-lg font-semibold text-gray-200">Product Features</h3>
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

            {/* Variants Section */}
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Product Variants</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                >
                  <FiPlus size={16} /> Add Variant
                </button>
              </div>
              
              <div className="space-y-6">
                {productData.variants.map((variant, index) => (
                  <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-300">
                        Variant {index + 1} {index === 0 && "(Primary)"}
                      </h4>
                      {productData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                          title="Remove variant"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Variant Name *
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          placeholder="e.g., White, Gold, Premium"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 outline-none"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          placeholder="299"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 outline-none"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Old Price (₹)
                        </label>
                        <input
                          type="number"
                          value={variant.oldPrice}
                          onChange={(e) => updateVariant(index, 'oldPrice', e.target.value)}
                          placeholder="399"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Color</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          placeholder="e.g., White, Black, Silver"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 outline-none"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-1">Discount</label>
                        <input
                          type="text"
                          value={variant.discount}
                          onChange={(e) => updateVariant(index, 'discount', e.target.value)}
                          placeholder="e.g., 25% OFF or ₹100 OFF"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                  <FiSave size={20} />
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Box */}
        {/* <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
          <p>💡 <strong>Note:</strong> First variant will be used as the default/primary product option.</p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminAddProduct;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiZap, FiLayers, FiDatabase, FiHash } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

// Icon mapping based on product category
const getIconByCategory = (category) => {
  // Handle both string and object categories
  const categoryName = typeof category === 'object' ? category?.name : category;
  
  switch (categoryName) {
    case "Basic Card":
      return <FiHash size={40} className="text-cyan-400" />;
    case "Premium Card":
      return <FiLayers size={40} className="text-blue-400" />;
    case "NFC Card":
      return <FiZap size={40} className="text-cyan-300" />;
    case "Metal Card":
      return <FiDatabase size={40} className="text-indigo-400" />;
    default:
      return <FiHash size={40} className="text-cyan-400" />;
  }
};

// Get category name safely
const getCategoryName = (category) => {
  if (!category) return "Smart Card";
  return typeof category === 'object' ? category?.name || "Smart Card" : category;
};

// Get lowest price from variants
const getLowestPrice = (variants) => {
  if (!variants || !Array.isArray(variants) || variants.length === 0) return "₹N/A";
  
  try {
    const validPrices = variants
      .filter(v => v && v.price)
      .map(v => parseFloat(v.price))
      .filter(price => !isNaN(price) && price > 0);
    
    if (validPrices.length === 0) return "₹N/A";
    
    const minPrice = Math.min(...validPrices);
    return `₹${minPrice.toFixed(2)}`;
  } catch (error) {
    console.error("Error calculating price:", error);
    return "₹N/A";
  }
};

// Render badge safely
const renderBadge = (badge) => {
  if (!badge) return null;
  
  const badgeText = typeof badge === 'object' ? badge?.name : badge;
  if (!badgeText) return null;
  
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs bg-cyan-500 text-black font-semibold shadow-lg">
      {badgeText}
    </div>
  );
};

const OurSmartCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`
        );
        
        // console.log("Fetched products:", res.data);

        if (res.data?.allProducts && Array.isArray(res.data.allProducts)) {
          setProducts(res.data.allProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="relative w-full min-h-screen py-28 bg-[#0b0f12] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-400">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <section className="relative w-full min-h-screen py-28 bg-[#0b0f12] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-extrabold">
            Our <span className="text-cyan-400">Smart Cards</span>
          </h2>
          <p className="text-center text-gray-400 mt-4">
            No products available at the moment.
          </p>
          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen py-28 bg-[#0b0f12] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Smart Cards</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg"
          >
            Choose the perfect card for your professional needs. Every card includes
            lifetime updates and a free digital profile.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="mt-8 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              {/* Product Badge */}
              {renderBadge(product.badge)}

              {/* Variants Count */}
              {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/10 backdrop-blur-sm">
                  {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                </div>
              )}

              {/* IMAGE SECTION */}
              <div className="h-72 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center relative border border-white/10 cursor-pointer">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    {getIconByCategory(product.category)}
                    <p className="text-sm text-gray-400 mt-2">Product Image</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                {/* Product Type */}
                <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  {getCategoryName(product.category)}
                </p>

                {/* Product Title */}
                <h3 className="text-xl font-semibold line-clamp-1">
                  {product.title || "Untitled Product"}
                </h3>

                {/* Price */}
                <p className="text-gray-300">
                  Starting from{" "}
                  <span className="text-white font-bold text-lg">
                    {getLowestPrice(product.variants)}
                  </span>
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Features/Tags */}
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {product.features.slice(0, 3).map((feature, i) => {
                      const featureText = typeof feature === 'string' ? feature : (feature.text || feature.name || "Feature");
                      return (
                        <span
                          key={i}
                          className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 hover:bg-white/10 transition-colors"
                          title={featureText}
                        >
                          {featureText.length > 15 ? featureText.substring(0, 15) + "..." : featureText}
                        </span>
                      );
                    })}
                    {product.features.length > 3 && (
                      <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">
                        +{product.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <Link
                to={`/products/${product._id}`}
                className="w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-cyan-500/30 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 hover:text-white transition-all duration-300 group/btn"
              >
                <span>Select Variant</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Product Count & Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                Showing {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Free Shipping
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Secure Payments
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSmartCard;
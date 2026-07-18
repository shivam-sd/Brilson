import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiZap, FiLayers, FiDatabase, FiHash, FiImage } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

// Icon mapping based on product category
const getIconByCategory = (category) => {
  const categoryName = typeof category === "object" ? category?.name : category;

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

const getCategoryName = (category) => {
  if (!category) return "Smart Card";
  return typeof category === "object"
    ? category?.name || "Smart Card"
    : category;
};

const getPrice = (product) => {
  if (!product) return "₹N/A";
  try {
    if (product.price !== undefined && product.price !== null) {
      const price = parseFloat(product.price);
      if (!isNaN(price) && price > 0) {
        return `₹${price.toFixed(2)}`;
      }
    }
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      const validPrices = product.variants
        .filter((v) => v && v.price)
        .map((v) => parseFloat(v.price))
        .filter((price) => !isNaN(price) && price > 0);
      if (validPrices.length > 0) {
        const minPrice = Math.min(...validPrices);
        return `₹${minPrice.toFixed(2)}`;
      }
    }
    return "₹N/A";
  } catch (error) {
    console.error("Error calculating price:", error);
    return "₹N/A";
  }
};

// ✅ FIXED: Check if discount exists and get its value safely
const hasDiscount = (product) => {
  if (!product) return false;

  // Check oldPrice discount
  if (product.oldPrice) {
    const oldPrice = parseFloat(product.oldPrice);
    const currentPrice = parseFloat(product.price);
    if (!isNaN(oldPrice) && !isNaN(currentPrice) && oldPrice > currentPrice) {
      return true;
    }
  }

  // ✅ FIXED: Safely check discount - handle both string and object
  if (product.discount) {
    // If discount is an object, check if it has a value
    if (typeof product.discount === 'object') {
      // Check if it has a value property
      if (product.discount.value) {
        return true;
      }
      // Check if it has a enabled flag
      if (product.discount.enabled === true) {
        return true;
      }
      return false;
    }
    
    // If discount is a string, check if not empty
    if (typeof product.discount === 'string' && product.discount.trim() !== '') {
      return true;
    }
  }

  return false;
};

// ✅ FIXED: Render discount badge safely
const renderDiscount = (product) => {
  if (!hasDiscount(product)) return null;

  let discountText = "";

  // Calculate percentage discount from oldPrice
  if (product.oldPrice && product.price) {
    const oldPrice = parseFloat(product.oldPrice);
    const currentPrice = parseFloat(product.price);
    if (!isNaN(oldPrice) && !isNaN(currentPrice) && oldPrice > currentPrice) {
      const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
      discountText = `${discountPercent}% OFF`;
    }
  }

  // ✅ FIXED: Get discount text from discount field safely
  if (product.discount) {
    let discountValue = "";
    
    // If discount is an object
    if (typeof product.discount === 'object') {
      // Try to get value from different possible keys
      discountValue = product.discount.value || 
                      product.discount.text || 
                      product.discount.label || 
                      product.discount.discount;
      
      // If value is a number, format it
      if (typeof discountValue === 'number') {
        discountValue = `${discountValue}% OFF`;
      }
    } 
    // If discount is a string
    else if (typeof product.discount === 'string') {
      discountValue = product.discount.trim();
    }

    // If we got a discount value, use it
    if (discountValue && discountValue !== "") {
      discountText = discountValue;
    }
  }

  // If no discount text found, return null
  if (!discountText) return null;

  return (
    <div className="absolute top-3 right-3 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg z-10">
      {discountText}
    </div>
  );
};

// ✅ FIXED: Safely render badge
const renderBadge = (badge) => {
  if (!badge) return null;

  let badgeText = "";
  
  // If badge is an object
  if (typeof badge === 'object') {
    badgeText = badge.name || badge.text || badge.label || badge.title || "";
  } 
  // If badge is a string
  else if (typeof badge === 'string') {
    badgeText = badge.trim();
  }

  if (!badgeText) return null;

  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs bg-cyan-500 text-black font-semibold shadow-lg z-10">
      {badgeText}
    </div>
  );
};



// 🖼️ FIXED: Image Component with proper aspect ratio
const ProductImage = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  if (!product.images || product.images.length === 0 || imageError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
        <FiImage size={48} className="text-gray-600" />
        <p className="text-xs text-gray-500 mt-2">No Image</p>
      </div>
    );
  }

  return (
    <img
      src={product.images[0]}
      alt={product.title || "Product"}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
      onError={() => setImageError(true)}
    />
  );
};

const OurSmartCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`,
        );
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
            <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen py-28 bg-[#0b0f12] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-xl md:text-3xl lg:text-3xl font-extrabold leading-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Smart Cards
            </span>
          </h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto lg:text-base text-sm"
          >
            Choose the perfect card for your professional needs. Every card
            includes lifetime updates and a free digital profile.
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

              {/* 🖼️ FIXED IMAGE SECTION */}
              <div className="relative h-72 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/5 group-hover:border-white/20 transition-all duration-300">
                {/* Image with proper object-fit */}
                <ProductImage product={product} />
                
                {/* Discount Badge */}
                {renderDiscount(product)}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  {getCategoryName(product.category)}
                </p>
                <h3 className="text-xl font-semibold line-clamp-1">
                  {product.title || "Untitled Product"}
                </h3>

                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-2xl">
                    {getPrice(product)}
                  </p>
                  {product.oldPrice &&
                    parseFloat(product.oldPrice) > parseFloat(product.price) && (
                      <p className="text-gray-400 line-through text-lg">
                        ₹{parseFloat(product.oldPrice).toFixed(2)}
                      </p>
                    )}
                  {product.color && (
                    <div className="ml-auto flex items-center gap-1">
                      <span
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: product.color }}
                        title={product.color}
                      />
                      <span className="text-xs text-gray-400">
                        {product.color}
                      </span>
                    </div>
                  )}
                </div>

                {product.description && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <Link
                to={`/products/${product._id}`}
                className="w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-cyan-500/30 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 hover:text-white transition-all duration-300 group/btn"
              >
                <span>View Details</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSmartCard;
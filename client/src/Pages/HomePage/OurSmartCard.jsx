import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiZap, FiLayers, FiDatabase, FiHash } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

// Icon mapping based on product category
const getIconByCategory = (category) => {
  switch (category) {
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

// Get lowest price from variants
const getLowestPrice = (variants) => {
  if (!variants || variants.length === 0) return "₹N/A";
  
  const prices = variants.map(v => parseFloat(v.price || 0));
  const minPrice = Math.min(...prices.filter(p => p > 0));
  
  return minPrice > 0 ? `₹${minPrice}` : "₹N/A";
};

const OurSmartCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`
        );
        
        if (res.data?.allProducts) {
          setProducts(res.data.allProducts);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
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
  if (products.length === 0) {
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
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen py-28 bg-[#0b0f12] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-5xl font-extrabold"
        >
          Our <span className="text-cyan-400">Smart Cards</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400 mt-4 max-w-2xl mx-auto"
        >
          Choose the perfect card for your professional needs. Every card includes
          lifetime updates and a free digital profile.
        </motion.p>

        {/* Products Grid */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-2">
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl border border-white/10 bg-[#101418]/70 backdrop-blur-lg hover:-translate-y-3 duration-300 shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
            >
              {/* Product Badge */}
              {product.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs bg-cyan-500 text-black font-semibold shadow-lg">
                  {product.badge}
                </div>
              )}

              {/* Variants Count */}
              {product.variants && product.variants.length > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/10">
                  {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                </div>
              )}

              {/* IMAGE SECTION - READY FOR FUTURE */}
              <div className="h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center border border-white/10">
                {/* Image will go here in future */}
                <div className="text-center">
                  {getIconByCategory(product.category)}
                  <p className="text-sm text-gray-400 mt-2">Product Image</p>
                </div>
              </div>

              {/* Product Type */}
              <p className="text-cyan-400 text-xs font-semibold uppercase mb-1">
                {product.category || "Smart Card"}
              </p>

              {/* Product Title */}
              <h3 className="text-xl font-semibold">{product.title}</h3>

              {/* Price */}
              <p className="mt-2 text-gray-300 text-sm">
                Starting from{" "}
                <span className="text-white font-bold">
                  {getLowestPrice(product.variants)}
                </span>
              </p>

              {/* Description */}
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Features/Tags */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* View Details Button */}
              <Link
                to={`/products/${product._id}`}
                className="w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 duration-300"
              >
                Select Variant →
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Product Count */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
        </div>
      </div>
    </section>
  );
};

export default OurSmartCard;
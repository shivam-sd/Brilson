import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const ChooseYourCard = () => {
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

  // Get lowest price
  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return "₹N/A";
    
    const prices = variants.map(v => parseFloat(v.price || 0));
    const minPrice = Math.min(...prices.filter(p => p > 0));
    
    return minPrice > 0 ? `₹${minPrice}` : "₹N/A";
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full py-24 bg-[#05070a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Loading<span className="text-cyan-400">...</span>
            </h2>
            <p className="text-gray-400 mt-3">Fetching products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/5 border border-white/10 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 w-1/4 bg-gray-700 rounded mb-4"></div>
                <div className="h-16 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no products
  if (products.length === 0) {
    return (
      <section className="w-full py-24 bg-[#05070a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Choose Your <span className="text-cyan-400">Smart Card</span>
            </h2>
            <p className="text-gray-400 mt-3">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 bg-[#05070a] text-white">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Choose Your <span className="text-cyan-400">Smart Card</span>
        </h2>
        <p className="text-gray-400 mt-3">
          Premium quality cards at competitive prices. Free shipping on all orders.
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id || index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-xl cursor-pointer bg-white/5 hover:bg-white/10 transition"
          >
            {/* IMAGE SECTION - READY FOR FUTURE */}
            <div className="h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center border-b border-white/10">
              <div className="text-center">
                <div className="text-4xl mb-2">💳</div>
                <p className="text-sm text-gray-400">Product Image</p>
              </div>
            </div>

            <div className="p-6">
              {/* Product Category Badge */}
              {product.badge && (
                <div className="absolute top-2 right-2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded">
                  {product.badge}
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2">{product.title}</h3>

              {/* Price */}
              <p className="text-gray-300 mb-3 text-lg">
                {getLowestPrice(product.variants)} 
                <span className="text-sm text-gray-400 ml-2">starting from</span>
              </p>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex gap-2 items-center text-gray-300 text-sm">
                      <Check className="text-cyan-400 w-4 h-4" />
                      {feature}
                    </li>
                  ))}
                  {product.features.length > 3 && (
                    <li className="text-gray-500 text-xs">
                      + {product.features.length - 3} more features
                    </li>
                  )}
                </ul>
              )}

              {/* View Details Button */}
              <Link
                to={`/products/${product._id}`}
                className="w-full py-3 rounded-lg font-bold px-5 block text-center transition bg-white/10 hover:bg-white/20 text-white"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Products Count */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </div>

      {/* Footer Highlights */}
      <div className="flex justify-center gap-10 mt-14 text-gray-400 text-sm flex-wrap px-4">
        <span className="flex items-center gap-2">
          <span>🚚</span> Free Shipping
        </span>
        <span className="flex items-center gap-2">
          <span>↩️</span> 30-Day Returns
        </span>
        <span className="flex items-center gap-2">
          <span>🔒</span> Secure Payments
        </span>
        <span className="flex items-center gap-2">
          <span>📞</span> 24×7 Support
        </span>
      </div>
    </section>
  );
};

export default ChooseYourCard;
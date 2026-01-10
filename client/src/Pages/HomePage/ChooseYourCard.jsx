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
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`
        );
        
        console.log("Products API Response:", res.data);
        
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

  // Get price - handle both direct price and variants
  const getPrice = (product) => {
    if (!product) return "₹N/A";
    
    try {
      // Check for direct price field (new structure)
      if (product.price !== undefined && product.price !== null) {
        const price = parseFloat(product.price);
        if (!isNaN(price) && price > 0) {
          return `₹${price.toFixed(2)}`;
        }
      }
      
      // Fallback to variants if exists (old structure)
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        const validPrices = product.variants
          .filter(v => v && v.price)
          .map(v => parseFloat(v.price))
          .filter(price => !isNaN(price) && price > 0);
        
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

  // Check if product has discount
  const hasDiscount = (product) => {
    if (!product) return false;
    
    // Check if oldPrice exists and is greater than current price
    if (product.oldPrice && product.price) {
      const oldPrice = parseFloat(product.oldPrice);
      const currentPrice = parseFloat(product.price);
      
      if (!isNaN(oldPrice) && !isNaN(currentPrice) && oldPrice > currentPrice) {
        return true;
      }
    }
    
    // Check if discount field exists
    if (product.discount && product.discount.trim() !== "") {
      return true;
    }
    
    return false;
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full min-h-screen py-24 bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Smart Card</span>
            </h2>
            <p className="text-gray-400 mt-3">Fetching premium cards...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 animate-pulse">
                <div className="h-64 bg-gray-800 rounded-xl mb-6"></div>
                <div className="h-6 w-3/4 bg-gray-800 rounded mb-3"></div>
                <div className="h-4 w-1/4 bg-gray-800 rounded mb-4"></div>
                <div className="h-16 bg-gray-800 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-800 rounded"></div>
                </div>
                <div className="h-12 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no products
  if (!products || products.length === 0) {
    return (
      <section className="w-full min-h-screen py-24 bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Smart Card</span>
            </h2>
            <p className="text-gray-400 mt-3">No products available at the moment</p>
          </div>
          <div className="text-center mt-8">
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
    <section className="w-full min-h-screen py-24 bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#00eaff22,transparent_70%)]"></div>

      {/* Page Title */}
      <div className="relative text-center max-w-3xl mx-auto mb-16 px-4 sm:px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Smart Card</span>
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          Premium quality cards at competitive prices. Free shipping on all orders.
        </p>
      </div>

      {/* Products Grid */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6">
        {products.map((product, index) => (
          <Link to={`/products/${product._id}`}>
          <motion.div
            key={product._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-gradient-to-br from-gray-900/70 to-gray-800/70 hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
            >

            {/* Product Category Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                {typeof product.badge === 'object' ? product.badge.name : product.badge}
              </div>
            )}

            {/* IMAGE SECTION */}
            <div className="h-80 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title || "Smart Card"} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                    <div class="text-center p-4">
                    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span class="text-3xl">📱</span>
                    </div>
                    <p class="text-sm text-gray-400">${product.title || "Smart Card"}</p>
                    </div>
                    `;
                  }}
                  />
                ) : (
                  <div className="text-center p-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                  <p className="text-sm text-gray-400">{product.title || "Smart Card"}</p>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Category */}
              {product.category && (
                <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </p>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 line-clamp-1">
                {product.title || "Untitled Product"}
              </h3>

              {/* Price Section */}
              <div className="mb-4">
                <p className="text-white font-bold text-3xl">
                  {getPrice(product)}
                </p>
                {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                  <p className="text-gray-400 line-through text-lg">
                    ₹{parseFloat(product.oldPrice).toFixed(2)}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">starting price</p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                  {product.description}
                </p>
              )}

              

              {/* View Details Button */}
              <Link
                to={`/products/${product._id}`}
                className="w-full py-3 rounded-xl font-bold text-center transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
                >
                <span>View Details</span>
                <span className="text-lg">→</span>
              </Link>

              {/* Color Indicator if exists */}
              {product.color && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: product.color }}
                    title={product.color}
                    />
                  <span>Available in {product.color}</span>
                </div>
              )}
            </div>
          </motion.div>
        </Link>
        ))}
      </div>

{/* Products Count */}
<div className="relative text-center mt-12 text-sm text-gray-500">
        Showing {products.length} premium card{products.length !== 1 ? "s" : ""}
      </div>

{/* Footer Highlights */}
      <div className="relative flex flex-wrap justify-center gap-8 mt-16 text-gray-400 text-sm px-4">
        <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-xl">🚚</span> Free Shipping
        </span>
        <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-xl">↩️</span> 30-Day Returns
        </span>
        <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-xl">🔒</span> Secure Payments
        </span>
        <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-xl">📞</span> 24×7 Support
        </span>
      </div>
    </section>
  );
};

export default ChooseYourCard;
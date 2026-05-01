import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import useCart from "./hooks/useCart";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiShoppingCart,
  FiTag,
  FiChevronRight,
  FiZap,
  FiGlobe,
  FiZoomIn,
  FiX
} from "react-icons/fi";
import HowItWorks from "./HowitWorks";

const ProductCardPreference = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);

  const { addToCart } = useCart();

  /* FETCH PRODUCT */
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/find/products/${id}`
        );

        const data = res.data.product;
        setProduct(data);

        if (data.images?.length) {
          setActiveImage(data.images[0]);
        }

      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  /* ADD TO CART */
  const handleAddtoCart = async () => {
    if (!product || addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product);
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.oldPrice && product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 mt-4 sm:mt-6 md:mt-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base overflow-x-auto whitespace-nowrap pb-2">
            <a href="/" className="hover:text-cyan-400 transition">Home</a>
            <FiChevronRight className="flex-shrink-0" />
            <span className="text-white truncate">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            
            {/* IMAGE SECTION - FIXED */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6">
              <div className="relative bg-gray-900/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                {discount && (
                  <span className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 bg-red-500 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold z-10">
                    {discount}% OFF
                  </span>
                )}
                
                {/* ✨ FIXED: Proper image container with fixed aspect ratio */}
                <div className="relative aspect-square w-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl overflow-hidden">
                  <img
                    src={activeImage || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-contain cursor-pointer transition-transform duration-300 scale-150"
                    onClick={() => setShowLightbox(true)}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
                    }}
                  />
                  
                  {/* Zoom button */}
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FiZoomIn className="text-white" size={18} />
                  </button>
                </div>
              </div>

              {/* THUMBNAILS - Scrollable on mobile */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 sm:gap-3 justify-center overflow-x-auto pb-2 px-2">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`cursor-pointer p-1.5 sm:p-2 rounded-xl border transition-all duration-200 flex-shrink-0 ${
                        activeImage === img
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 hover:border-cyan-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail ${index + 1}`}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {[
                  { Icon: FiTruck, label: "Free Shipping" },
                  { Icon: FiShield, label: "Secure Payment" },
                  { Icon: FiRefreshCw, label: "Easy Returns" }
                ].map(({ Icon, label }, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/40 p-2 sm:p-3 md:p-4 rounded-xl text-center border border-white/10"
                  >
                    <Icon className="mx-auto text-cyan-400 mb-1 sm:mb-2" size={18} />
                    <p className="text-xs sm:text-sm text-gray-300">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DETAILS SECTION */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6 md:space-y-8">
              
              <div>
                <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs sm:text-sm inline-block">
                  {product.category || "Product"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-base sm:text-lg md:text-xl text-gray-400 line-through">
                    ₹{product.oldPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                {product.description}
              </p>

              {product.features?.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Key Features</h3>
                  <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                        <FiCheck className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="break-words">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
<div className="fixed bottom-[-20px] left-0 right-0 z-50 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-gradient-to-b from-transparent to-black/80 lg:bg-transparent p-4 lg:p-0 pt-8 lg:pt-2">
  <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 max-w-7xl mx-auto lg:max-w-none">
    {/* Add to Cart Button */}
    <motion.button
      onClick={handleAddtoCart}
      disabled={addingToCart}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-1 py-2 sm:py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-bold text-white lg:text-base md:text-base text-[12px] sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
    >
      {addingToCart ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          <svg className="lg:w-5 md:w-5 lg:h-5 md:h-5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>ADD TO CART</span>
        </>
      )}
    </motion.button>

    {/* Buy Now Button */}
    <Link
      to={'/your-items'}
      className="flex-1 py-2 sm:py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl font-bold text-white lg:text-base md:text-base text-[12px] sm:text-lg transition-all duration-300 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-center"
    >
      <svg className="lg:w-5 md:w-5 lg:h-5 md:h-5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
      </svg>
      <span>BUY NOW</span>
    </Link>
  </div>
</div>

{/* Add spacing at bottom on mobile to prevent content hiding behind fixed buttons */}
<div className="lg:hidden h-24" />




              <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 pt-2">
                <span className="flex gap-1 items-center"><FiShield size={14} /> Secure Checkout</span>
                <span className="flex gap-1 items-center"><FiGlobe size={14} /> Worldwide Shipping</span>
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* ✨ LIGHTBOX MODAL for fullscreen image view */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <FiX size={24} />
          </button>
          <img
            src={activeImage || product.images?.[0]}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <HowItWorks />
    </>
  );
};

export default ProductCardPreference;
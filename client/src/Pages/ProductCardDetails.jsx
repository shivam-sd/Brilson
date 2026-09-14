import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
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
  FiX
} from "react-icons/fi";
import { BsBucketFill } from "react-icons/bs";
import HowItWorks from "./HowitWorks";
import { useGetProductById } from "../api/product-query";
import ProductImageCarousel from "../Component/ProductImageCarousel";

const ProductCardPreference = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);

  const { data, isLoading, isError, error } = useGetProductById(id)
  const product = data?.product;

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || "Product not found");
      return;
    }

    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [isError, product]);


  const handleAddtoCart = async () => {
    if (!product || addingToCart) return;
    setAddingToCart(true);
    try {
      await dispatch(addToCart(product)).unwrap();
      toast.success("Added to cart 🛒");
      navigate("/your-items");
    } catch (err) {
      toast.error(err || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white px-4">
        <div className="text-center max-w-md">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
            Product Not Found
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
            {error?.response?.data?.message ||
              "The product you're looking for doesn't exist or may have been removed."}
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Products
          </Link>

        </div>
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

          <div className="flex items-center gap-2 text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base overflow-x-auto whitespace-nowrap pb-2 lg:mt-0 md:mt-0 mt-6 font-Roboto">
            <Link to="/products" className="hover:text-cyan-400 transition">Home</Link>
            <FiChevronRight className="flex-shrink-0" />
            <span className="text-white truncate ">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6">

              <ProductImageCarousel
                images={product.images}
                activeImage={activeImage || product.images?.[0]}
                setActiveImage={setActiveImage}
                discount={discount}
                onZoomClick={() => setShowLightbox(true)}
                alt={product.title}
              />


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
                    <p className="text-xs sm:text-sm text-gray-300 font-Roboto">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6 md:space-y-8">

              <div>
                <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs sm:text-sm inline-block font-Roboto">
                  {product.category || "Product"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-wider font-Roboto">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 font-Roboto">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-base sm:text-lg md:text-xl text-gray-400 line-through">
                    ₹{product.oldPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-Roboto">
                {product.description}
              </p>

              {product.features?.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 font-Roboto">Key Features</h3>
                  <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 font-Roboto">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                        <FiCheck className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="break-words">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="fixed bottom-[-20px] left-0 right-0 z-50 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-gradient-to-b from-transparent to-black/80 lg:bg-transparent p-4 lg:p-0 pt-8 lg:pt-2">
                <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 max-w-7xl mx-auto lg:max-w-none">
                  <motion.button
                    onClick={handleAddtoCart}
                    disabled={addingToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                    flex-1
                    h-12 sm:h-14
                    px-3 sm:px-6
                    bg-gradient-to-r from-cyan-500 to-blue-600
                    hover:from-cyan-600 hover:to-blue-700
                    rounded-xl
                    font-bold text-white
                    text-[15px] sm:text-lg
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-all duration-300
                    shadow-lg shadow-cyan-500/30
                    flex items-center justify-center
                    gap-1.5 sm:gap-2
                    cursor-pointer font-Roboto
                    whitespace-nowrap
                    "
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <BsBucketFill size={18} className="sm:w-5 sm:h-5" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </motion.button>

                  <Link
                    onClick={handleAddtoCart}
                    className="
                    h-12 sm:h-14
                    flex-1
                    bg-gradient-to-r from-orange-500 to-red-600
                    hover:from-orange-600 hover:to-red-700
                    rounded-xl
                    font-bold text-white
                    text-[15px] sm:text-lg
                    transition-all duration-300
                    shadow-lg shadow-orange-500/30
                    flex items-center justify-center
                    gap-1.5 sm:gap-2
                    text-center font-Roboto
                    whitespace-nowrap
                    px-3 sm:px-6
                    "
                  >
                    <FiShoppingCart size={18} className="sm:w-5 sm:h-5" />
                    <span>BUY NOW</span>
                  </Link>
                </div>
              </div>

              <div className="lg:hidden h-24" />

              <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 pt-2 font-Roboto">
                <span className="flex gap-1 items-center"><FiShield size={14} /> Secure Checkout</span>
                <span className="flex gap-1 items-center"><FiGlobe size={14} /> Worldwide Shipping</span>
              </div>

            </motion.div>
          </div>
        </div>
      </div>

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
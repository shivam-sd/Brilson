import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FiZap, FiTruck, FiShield, FiRefreshCw, FiLogIn } from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import axios from "axios";

const ProductCardPreference = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/find/products/${id}`
        );
        
        if (res.data?.product) {
          setProduct(res.data.product);
          // Set first variant as default
          if (res.data.product.variants?.length > 0) {
            setSelectedVariant(res.data.product.variants[0]);
          }
        }
      } catch (error) {
        console.log("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Generate referral link
  const referralLink = `${window.location.origin}/products/${id}?ref=user.referralCode`;

  // Add to cart function
  const addToCart = () => {
    if (product && selectedVariant) {
      console.log("Added to cart:", {
        productId: product._id,
        variant: selectedVariant.name,
        price: selectedVariant.price
      });
      // Add your cart logic here
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  // If no product found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#03060A] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400">Product Not Found</h2>
          <p className="text-gray-400 mt-2">The product you're looking for doesn't exist.</p>
          <Link to="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060A] text-white px-4 sm:px-6 md:px-20 py-14">
      {/* Breadcrumb */}
      <p className="text-gray-400 text-xs sm:text-sm mb-8 mt-20">
        <Link to="/" className="hover:text-cyan-400">Home</Link> / 
        <Link to="/products" className="hover:text-cyan-400"> Products</Link> / 
        <span className="text-cyan-400"> {product.title}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative">
        {/* Glow background */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/20 blur-[120px] rounded-full top-28 left-5"></div>

        {/* LEFT SIDE — PREVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-20 flex items-center justify-center"
        >
          <div className="bg-[#0A0F16]/60 backdrop-blur-xl border border-white/10 shadow-2xl p-5 sm:p-8 rounded-3xl max-w-full w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#0e1722] to-[#0a1016] rounded-3xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.25)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] duration-300 w-[500px] h-72"
            >
              {/* Product Badge */}
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-xs font-bold">{product.badge}</span>
                </div>
                <FiZap size={36} className="text-cyan-300" />
              </div>

              {/* Product Info */}
              <div className="mt-6 sm:mt-8">
                <p className="text-lg font-medium">{product.title}</p>
                <p className="text-gray-400 text-sm">{product.category}</p>
              </div>

              {/* Features */}
              <div className="flex justify-between items-center mt-8 sm:mt-10">
                <p className="flex items-center gap-2 text-sm text-gray-300">
                  <HiOutlineBadgeCheck className="text-cyan-400" /> 
                  {product.features[0] || "Smart Card"}
                </p>
                <span className="text-cyan-400 text-xs sm:text-sm tracking-wide">
                  {product.category} Card
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT SIDE — PRODUCT DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="z-20"
        >
          {/* Product Badge */}
          <span className="px-4 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
            {product.badge}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4 tracking-tight leading-tight">
            {product.title}
            {selectedVariant && (
              <span className="text-cyan-400"> - {selectedVariant.name}</span>
            )}
          </h1>

          {/* Discount Badge */}
          {selectedVariant?.discount && (
            <div className="absolute px-3 py-1 rounded-lg bg-yellow-400 font-bold text-black shadow-lg lg:top-10 md:top:10 right-6 sm:right-20 md:right-170">
              {selectedVariant.discount} OFF
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mt-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              ₹{selectedVariant?.price || "N/A"}
            </h2>
            {selectedVariant?.oldPrice && (
              <p className="text-gray-500 line-through text-md sm:text-lg">
                ₹{selectedVariant.oldPrice}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 mt-3 max-w-md text-sm sm:text-base">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <>
              <h3 className="text-gray-300 text-sm mt-8 mb-3">SELECT VARIANT</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant._id || index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold duration-300
                      ${
                        variant._id === selectedVariant?._id
                          ? "bg-cyan-500/30 border border-cyan-400 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                          : "border border-white/10 text-gray-300 hover:border-cyan-400 hover:text-white"
                      }`}
                  >
                    {variant.name} — ₹{variant.price}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Features */}
          {product.features?.length > 0 && (
            <>
              <h3 className="text-gray-300 text-sm mt-10 mb-3">FEATURES</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-cyan-400" /> {feature}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Login/Register
          <div className="w-full mt-10 p-4 rounded-xl border border-cyan-500/20 bg-white/5 backdrop-blur-lg text-sm">
            <p className="flex flex-wrap items-center gap-2 text-gray-300">
              <FiLogIn className="text-cyan-400" />
              <span>
                <Link to="/login" className="text-cyan-300 font-medium hover:text-cyan-200">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/signup" className="text-cyan-300 font-medium hover:text-cyan-200">
                  Register
                </Link>{" "}
                to add items to your cart.
              </span>
            </p>
          </div> */}

          {/* Buttons */}
          <div className="flex gap-3 sm:gap-4 mt-6 flex-wrap">
            <button
              onClick={addToCart}
              className="bg-cyan-500 text-black px-7 py-3 rounded-xl font-medium shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:bg-cyan-400 duration-300"
            >
              Add to Cart
            </button>

            <Link 
              to="/checkout" 
              className="border border-white/15 px-7 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white duration-300 inline-flex items-center"
            >
              Buy Now
            </Link>
          </div>

          {/* Features Icons */}
          <div className="flex gap-10 sm:gap-14 mt-10 text-gray-400 text-center text-sm flex-wrap">
            <div className="flex flex-col items-center">
              <FiTruck size={26} className="text-cyan-400" />
              <span className="mt-2">Free Shipping</span>
            </div>

            <div className="flex flex-col items-center">
              <FiShield size={26} className="text-cyan-400" />
              <span className="mt-2">Secure Payment</span>
            </div>

            <div className="flex flex-col items-center">
              <FiRefreshCw size={26} className="text-cyan-400" />
              <span className="mt-2">Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Section
      <div className="mt-16 p-6 rounded-xl border border-cyan-500/20 bg-white/5 max-w-2xl">
        <h3 className="text-lg font-semibold text-cyan-300 mb-3">Referral Link</h3>
        <p className="text-gray-400 text-sm mb-4">Share this link to earn commissions:</p>
        <div className="bg-[#0A0F16] p-3 rounded-lg border border-white/10">
          <code className="text-gray-300 text-sm break-all">{referralLink}</code>
        </div>
        {product.isMLMProduct && (
          <p className="text-cyan-400 text-sm mt-3">✓ MLM Commissions Enabled</p>
        )}
      </div> */}
    </div>
  );
};

export default ProductCardPreference;
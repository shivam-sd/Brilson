import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  FiGlobe
} from "react-icons/fi";
import HowItWorks from "./HowitWorks";

const ProductCardPreference = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const {addToCart} = useCart();

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
  await addToCart(product);
  
}

  // const addToCart = async () => {
  //   if (!product || addingToCart) return;

  //   setAddingToCart(true);
  //   const token = localStorage.getItem("token");

  //   try {
  //     if (token) {
  //       await axios.post(
  //         `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
  //         { productId: product._id, quantity: 1 },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //     } else {
  //       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  //       const index = cart.findIndex(i => i.productId === product._id);

  //       if (index >= 0) cart[index].quantity += 1;
  //       else {
  //         cart.push({
  //           productId: product._id,
  //           title: product.title,
  //           price: product.price,
  //           image: product.images?.[0],
  //           quantity: 1,
  //         });
  //       }
        
  //       localStorage.setItem("cart", JSON.stringify(cart));
  //     }
      
  //     toast.success("Added to cart 🛒");
  //   } catch {
  //     toast.error("Failed to add to cart");
  //   } finally {
  //     setAddingToCart(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.oldPrice && product.price
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
            
            {/* IMAGE SECTION */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6">
              <div className="relative bg-gray-900/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
                {discount && (
                  <span className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 bg-red-500 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold z-10">
                    {discount}% OFF
                  </span>
                )}
                <div className="flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
                  <img
                    src={activeImage || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-auto max-h-[280px] sm:max-h-[320px] md:max-h-[380px] lg:max-h-[420px] object-contain cursor-pointer duration-300"
                  />
                </div>
              </div>

              {/* THUMBNAILS */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`cursor-pointer p-1.5 sm:p-2 rounded-xl border transition-all duration-200 ${
                        activeImage === img
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 hover:border-cyan-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail ${index + 1}`}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {[FiTruck, FiShield, FiRefreshCw].map((Icon, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/40 p-2 sm:p-3 md:p-4 rounded-xl text-center border border-white/10"
                  >
                    <Icon className="mx-auto text-cyan-400 mb-1 sm:mb-2" size={18} />
                    <p className="text-xs sm:text-sm">Trusted</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DETAILS SECTION */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6 md:space-y-8">
              
              <div>
                <span className="px-2 sm:px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs sm:text-sm inline-block">
                  {product.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400">
                  ₹{product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-base sm:text-lg md:text-xl text-gray-400 line-through">
                    ₹{product.oldPrice}
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
                      <div key={i} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                        <FiCheck className="text-cyan-400 flex-shrink-0" size={16} />
                        <span className="break-words">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <div className="flex items-center justify-center pt-2 sm:pt-4">
                <button
                  onClick={handleAddtoCart}
                  disabled={addingToCart}
                  className="w-full sm:w-72 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-base sm:text-lg disabled:opacity-50 cursor-pointer hover:scale-105 duration-300 active:scale-95 transition-all"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              
              <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 pt-2">
                <span className="flex gap-1 items-center"><FiShield size={14} /> Secure</span>
                <span className="flex gap-1 items-center"><FiGlobe size={14} /> Worldwide</span>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      <HowItWorks />
    </>
  );
};

export default ProductCardPreference;
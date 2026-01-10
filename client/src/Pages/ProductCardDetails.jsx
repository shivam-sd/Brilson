import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
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

  /* FETCH PRODUCT */
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/find/products/${id}`
        );
        setProduct(res.data.product);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  /* ADD TO CART */
  const addToCart = async () => {
    if (!product || addingToCart) return;

    setAddingToCart(true);
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const index = cart.findIndex(i => i.productId === product._id);

        if (index >= 0) cart[index].quantity += 1;
        else {
          cart.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      }

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

  const discount =
    product.oldPrice && product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
        <>
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 mb-8">
          <a href="/" className="hover:text-cyan-400">Home</a>
          <FiChevronRight />
          <span className="text-white">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* IMAGE */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative bg-gray-900/40 p-8 rounded-3xl border border-white/10">
              {discount && (
                <span className="absolute top-6 left-6 bg-red-500 px-4 py-1 rounded-full text-sm font-bold">
                  {discount}% OFF
                </span>
              )}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[420px] object-contain"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[FiTruck, FiShield, FiRefreshCw].map((Icon, i) => (
                <div
                  key={i}
                  className="bg-gray-900/40 p-4 rounded-xl text-center border border-white/10"
                >
                  <Icon className="mx-auto text-cyan-400 mb-2" size={22} />
                  <p className="text-sm">Trusted</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DETAILS */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold">{product.title}</h1>

            <div>
              <span className="text-5xl font-bold text-cyan-400">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="ml-4 text-xl text-gray-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-lg">{product.description}</p>

            {product.features?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <FiCheck className="text-cyan-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION */}
            <div className="flex items-center justify-center">

            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="w-72 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-lg disabled:opacity-50 cursor-pointer hover:scale-105 duration-300 active:scale-95"
              >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

              </div>
            <div className="flex justify-center gap-6 text-sm text-gray-400 pt-4">
              <span className="flex gap-1"><FiShield /> Secure</span>
              <span className="flex gap-1"><FiGlobe /> Worldwide</span>
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

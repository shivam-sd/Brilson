import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

const ProductCardPreference = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  /*  FETCH PRODUCT  */
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/find/products/${id}`
        );

        if (res.data?.product) {
          setProduct(res.data.product);
          setSelectedVariant(res.data.product.variants?.[0] || null);
        }
      } catch (err) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  /*  ADD TO CART  */
  const addToCart = async () => {
    if (!product || !selectedVariant || addingToCart) return;

    setAddingToCart(true);
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await addToCartAPI(token);
      } else {
        addToCartLocal();
      }
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const addToCartAPI = async (token) => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
      {
        productId: product._id,
        variantId: selectedVariant._id,
        quantity: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
  };

  const addToCartLocal = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const index = cart.findIndex(
      (i) =>
        i.productId === product._id &&
        i.variantId === selectedVariant._id
    );

    if (index >= 0) cart[index].quantity += 1;
    else {
      cart.push({
        productId: product._id,
        variantId: selectedVariant._id,
        title: product.title,
        variantName: selectedVariant.name,
        price: selectedVariant.price,
        image: product.image || "",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleBuyNow = async () => {
    await addToCart();
    window.location.href = "/checkout";
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060A] text-white">
        <div className="animate-spin w-14 h-14 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full" />
      </div>
    );
  }

  if (!product) return null;

  const discount =
    selectedVariant?.mrp && selectedVariant?.price
      ? Math.round(
          ((selectedVariant.mrp - selectedVariant.price) /
            selectedVariant.mrp) *
            100
        )
      : null;

  return (
    <div className="min-h-screen bg-[#03060A] text-white px-6 lg:px-20 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start mt-20">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex justify-center"
        >
          {discount && (
            <div className="absolute top-6 left-6 z-10 bg-cyan-500 text-black text-sm font-bold px-4 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}

          <div className="w-full max-w-md bg-gradient-to-br from-[#0B1220] to-black rounded-3xl p-8 border border-white/10 shadow-2xl">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-80 object-contain rounded-xl"
            />
          </div>
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl lg:text-4xl font-bold">
            {product.title}
            {selectedVariant && (
              <span className="text-cyan-400"> – {selectedVariant.name}</span>
            )}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">
              ₹{selectedVariant?.price}
            </span>
            {selectedVariant?.mrp && (
              <span className="text-gray-400 line-through">
                ₹{selectedVariant.mrp}
              </span>
            )}
          </div>

          <p className="text-gray-400 max-w-xl">
            {product.description}
          </p>

          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-400">Select Variant</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-2 rounded-xl border text-sm transition
                      ${
                        selectedVariant?._id === v._id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/20 hover:border-cyan-400"
                      }
                    `}
                  >
                    {v.name} – ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FEATURES */}
          {product.features?.length > 0 && (
            <div className="pt-6">
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                {product.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TRUST */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <FiTruck className="text-cyan-400" /> Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-cyan-400" /> Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <FiRefreshCw className="text-cyan-400" /> Easy Returns
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl disabled:opacity-50"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="px-8 py-3 border border-white/20 rounded-xl hover:border-cyan-400"
            >
              Buy Now
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {localStorage.getItem("token")
              ? "Added to your account cart"
              : "Guest cart (login to sync later)"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductCardPreference;


import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrash2,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiChevronRight,
  FiArrowLeft,
  FiPackage,
  FiShield,
  FiTruck,
  FiLock,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  selectCartItems,
  selectCartLoading,
} from "../store/slices/cartSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);

  const [removingId, setRemovingId] = useState(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const getCartItemId = (item) => {
    if (item._id) {
      return item._id;
    }

    if (
      item.productId &&
      typeof item.productId === "object"
    ) {
      return item.productId._id;
    }

    return item.productId;
  };

  const getProduct = (item) => {
    if (
      item.productId &&
      typeof item.productId === "object"
    ) {
      return item.productId;
    }

    return item;
  };

  const calculateItemPrice = (item) => {
    const basePrice = item.price || 0;
    const quantity = item.quantity || 1;
    const itemTotal = basePrice * quantity;

    const product = getProduct(item);

    const gstEnabled =
      product.gst?.enabled || false;

    const gstRate =
      product.gst?.rate || 18;

    const discountEnabled =
      product.discount?.enabled || false;

    const discountType =
      product.discount?.type || "percentage";

    const discountValue =
      product.discount?.value || 0;

    let discountAmount = 0;

    if (discountEnabled) {
      if (discountType === "percentage") {
        discountAmount =
          (itemTotal * discountValue) / 100;
      } else {
        discountAmount =
          discountValue * quantity;
      }
    }

    let gstAmount = 0;

    if (gstEnabled) {
      const taxableAmount =
        itemTotal - discountAmount;

      gstAmount =
        (taxableAmount * gstRate) / 100;
    }

    const finalPrice =
      itemTotal -
      discountAmount +
      gstAmount;

    return {
      basePrice,
      quantity,
      itemTotal,
      discountEnabled,
      discountType,
      discountValue,
      discountAmount,
      gstEnabled,
      gstRate,
      gstAmount,
      finalPrice,
    };
  };

  const handleRemoveItem = async (cartId) => {
    setRemovingId(cartId);

    try {
      await dispatch(
        removeFromCart(cartId)
      ).unwrap();

      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(
        error || "Failed to remove item"
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (
    cartId,
    quantity
  ) => {
    if (quantity < 1) {
      await handleRemoveItem(cartId);
      return;
    }

    try {
      await dispatch(
        updateCartQuantity({
          cartId,
          quantity,
        })
      ).unwrap();
    } catch (error) {
      toast.error(
        error || "Failed to update quantity"
      );
    }
  };

  const {
    subtotal,
    totalDiscount,
    totalGst,
    total,
    totalItems,
  } = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;

    cartItems.forEach((item) => {
      const calc = calculateItemPrice(item);

      subtotal += calc.itemTotal;
      totalDiscount += calc.discountAmount;
      totalGst += calc.gstAmount;
    });

    const totalItems = cartItems.reduce(
      (sum, item) =>
        sum + (item.quantity || 1),
      0
    );

    const total =
      subtotal -
      totalDiscount +
      totalGst;

    return {
      subtotal,
      totalDiscount,
      totalGst,
      total,
      totalItems,
    };
  }, [cartItems]);

  const handleCheckout = () => {
    if (!cartItems.length) {
      return toast.error("Cart is empty");
    }

    const checkoutItems = cartItems.map(
      (item) => {
        const calc =
          calculateItemPrice(item);

        const product = getProduct(item);

        return {
          productId:
            product._id || item.productId,

          productTitle:
            item.productTitle ||
            item.title ||
            product.title,

          basePrice: item.price,

          quantity: item.quantity,

          image: item.image,

          gst: {
            enabled:
              product.gst?.enabled || false,

            rate:
              product.gst?.rate || 0,
          },

          discount: {
            enabled:
              product.discount?.enabled ||
              false,

            type:
              product.discount?.type ||
              "percentage",

            value:
              product.discount?.value || 0,
          },

          discountAmount:
            calc.discountAmount,

          gstAmount:
            calc.gstAmount,

          finalPrice:
            calc.finalPrice,
        };
      }
    );

    navigate("/checkout", {
      state: {
        checkoutData: {
          items: checkoutItems,
          subtotal,
          totalDiscount,
          totalGst,
          total,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white px-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"></div>

          <p className="text-gray-400">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-gray-900 to-[#05070a] text-white overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-10">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 sm:mb-12 font-Roboto">

          <div className="w-full md:w-auto">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />

              Continue Shopping
            </Link>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Your Shopping Cart
            </h2>

            <p className="text-gray-400 mt-2 text-sm lg:text-base">
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>

          </div>

        </div>

        <AnimatePresence>

          {cartItems.length === 0 ? (

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="text-center py-12 sm:py-20 px-4"
            >

              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 flex items-center justify-center font-Roboto">

                <FiShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />

              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-3 sm:mb-4">
                Your cart is empty
              </h2>

              <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Looks like you haven't added any products to your cart yet.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 text-sm sm:text-base"
              >
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />

                Browse Products
              </Link>

            </motion.div>

          ) : (

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">

              <div className="lg:col-span-2 space-y-6">

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl font-Roboto"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-4 border-b border-white/10">

                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">

                      <FiPackage className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />

                      Cart Items

                    </h2>

                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-xs sm:text-sm font-medium">

                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}

                    </span>

                  </div>

                  <div className="space-y-4">

                    <AnimatePresence>

                      {cartItems.map(
                        (item, index) => {
                          const calc =
                            calculateItemPrice(
                              item
                            );

                          const product =
                            getProduct(item);

                          const cartItemId =
                            getCartItemId(item);

                          return (
                            <motion.div
                              key={cartItemId}
                              initial={{
                                opacity: 0,
                                x: -20,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              exit={{
                                opacity: 0,
                                x: 20,
                              }}
                              transition={{
                                delay:
                                  index * 0.05,
                              }}
                              className="group relative flex flex-col sm:flex-row gap-4 sm:justify-between sm:p-5 p-4 bg-gray-900/30 rounded-xl sm:rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                            >

                              <div className="flex items-start gap-4 sm:relative">

                                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">

                                  <img
                                    src={
                                      item.image ||
                                      product.images?.[0]
                                    }
                                    alt={
                                      item.productTitle ||
                                      item.title ||
                                      product.title ||
                                      "Product"
                                    }
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      e.currentTarget.style.display =
                                        "none";

                                      if (
                                        e.currentTarget
                                          .parentElement
                                      ) {
                                        e.currentTarget.parentElement.innerHTML = `
                                          <div class="w-full h-full flex items-center justify-center">
                                            <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                              <svg class="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                              </svg>
                                            </div>
                                          </div>
                                        `;
                                      }
                                    }}
                                  />

                                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg">
                                    {item.quantity}
                                  </div>

                                </div>

                                <div className="flex-1 min-w-0">

                                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                                    {item.productTitle ||
                                      item.title ||
                                      product.title}
                                  </h3>

                                  {calc.discountEnabled &&
                                    calc.discountAmount >
                                    0 && (
                                      <div className="inline-flex items-center gap-1 mb-2 sm:mb-3">

                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">

                                          {calc.discountType ===
                                            "percentage"
                                            ? `${calc.discountValue}% OFF`
                                            : `₹${calc.discountValue} OFF`}

                                        </span>

                                      </div>
                                    )}

                                  {item.color && (
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">

                                      <div
                                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/20"
                                        style={{
                                          backgroundColor:
                                            item.color,
                                        }}
                                      />

                                      <span className="text-xs sm:text-sm text-gray-400">
                                        {item.color}
                                      </span>

                                    </div>
                                  )}

                                  <div className="block sm:hidden space-y-1">

                                    <div className="flex items-center gap-2">

                                      <span className="text-lg font-bold text-cyan-400">
                                        ₹
                                        {calc.finalPrice.toFixed(
                                          2
                                        )}
                                      </span>

                                      {calc.discountAmount >
                                        0 && (
                                          <span className="text-sm text-gray-400 line-through">
                                            ₹
                                            {calc.itemTotal.toFixed(
                                              2
                                            )}
                                          </span>
                                        )}

                                    </div>

                                    <div className="text-xs text-gray-400">

                                      <div>
                                        Base: ₹
                                        {calc.basePrice} ×{" "}
                                        {calc.quantity}
                                      </div>

                                      {calc.discountAmount >
                                        0 && (
                                          <div>
                                            Discount: -₹
                                            {calc.discountAmount.toFixed(
                                              2
                                            )}
                                          </div>
                                        )}

                                      {calc.gstAmount >
                                        0 && (
                                          <div>
                                            GST (
                                            {calc.gstRate}
                                            %): +₹
                                            {calc.gstAmount.toFixed(
                                              2
                                            )}
                                          </div>
                                        )}

                                    </div>

                                  </div>

                                </div>

                              </div>

                              <div className="hidden sm:flex flex-col items-end gap-4">

                                <div className="text-right space-y-1">

                                  <div className="flex items-center justify-end gap-2">

                                    <p className="text-2xl font-bold text-cyan-400">
                                      ₹
                                      {calc.finalPrice.toFixed(
                                        2
                                      )}
                                    </p>

                                    {calc.discountAmount >
                                      0 && (
                                        <p className="text-lg text-gray-400 line-through">
                                          ₹
                                          {calc.itemTotal.toFixed(
                                            2
                                          )}
                                        </p>
                                      )}

                                  </div>

                                  <div className="text-sm text-gray-400 space-y-0.5">

                                    <div>
                                      Base: ₹
                                      {calc.basePrice} ×{" "}
                                      {calc.quantity}
                                    </div>

                                    {calc.discountAmount >
                                      0 && (
                                        <div className="text-green-400">
                                          Discount: -₹
                                          {calc.discountAmount.toFixed(
                                            2
                                          )}

                                          {calc.discountType ===
                                            "percentage"
                                            ? ` (${calc.discountValue}%)`
                                            : ` (₹${calc.discountValue} per item)`}
                                        </div>
                                      )}

                                    {calc.gstAmount >
                                      0 && (
                                        <div className="text-blue-400">
                                          GST: +₹
                                          {calc.gstAmount.toFixed(
                                            2
                                          )}

                                          {` (${calc.gstRate}% on taxable amount)`}
                                        </div>
                                      )}

                                  </div>

                                </div>

                                <div className="flex flex-col items-end gap-4">

                                  <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">

                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          cartItemId,
                                          item.quantity - 1
                                        )
                                      }
                                      className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white disabled:opacity-30"
                                      disabled={
                                        item.quantity <=
                                        1
                                      }
                                    >
                                      <FiMinus
                                        size={14}
                                        className="sm:w-4 sm:h-4"
                                      />
                                    </button>

                                    <span className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-900/30 text-white font-medium min-w-[36px] sm:min-w-[40px] text-center text-sm sm:text-base">
                                      {item.quantity}
                                    </span>

                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          cartItemId,
                                          item.quantity + 1
                                        )
                                      }
                                      className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white"
                                    >
                                      <FiPlus
                                        size={14}
                                        className="sm:w-4 sm:h-4"
                                      />
                                    </button>

                                  </div>

                                  <button
                                    onClick={() =>
                                      handleRemoveItem(
                                        cartItemId
                                      )
                                    }
                                    disabled={
                                      removingId ===
                                      cartItemId
                                    }
                                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105 disabled:opacity-50 text-sm"
                                  >

                                    {removingId ===
                                      cartItemId ? (
                                      <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>

                                        Removing...
                                      </>
                                    ) : (
                                      <>
                                        <FiTrash2
                                          size={14}
                                          className="sm:w-4 sm:h-4"
                                        />

                                        Remove
                                      </>
                                    )}

                                  </button>

                                </div>

                              </div>

                              <div className="flex items-center justify-between sm:hidden pt-3 border-t border-white/10">

                                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">

                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cartItemId,
                                        item.quantity - 1
                                      )
                                    }
                                    className="px-3 py-1.5 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white disabled:opacity-30"
                                    disabled={
                                      item.quantity <=
                                      1
                                    }
                                  >
                                    <FiMinus size={14} />
                                  </button>

                                  <span className="px-3 py-1.5 bg-gray-900/30 text-white font-medium min-w-[32px] text-center">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cartItemId,
                                        item.quantity + 1
                                      )
                                    }
                                    className="px-3 py-1.5 bg-gray-900/50 hover:bg-gray-800/50 transition text-gray-400 hover:text-white"
                                  >
                                    <FiPlus size={14} />
                                  </button>

                                </div>

                                <button
                                  onClick={() =>
                                    handleRemoveItem(
                                      cartItemId
                                    )
                                  }
                                  disabled={
                                    removingId ===
                                    cartItemId
                                  }
                                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all disabled:opacity-50"
                                >

                                  {removingId ===
                                    cartItemId ? (
                                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <FiTrash2 size={16} />
                                  )}

                                </button>

                              </div>

                            </motion.div>
                          );
                        }
                      )}

                    </AnimatePresence>

                  </div>

                </motion.div>

              </div>

              <div className="lg:col-span-1">

                {isMobile ? (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                  >

                    <button
                      onClick={() =>
                        setIsSummaryExpanded(
                          (prev) => !prev
                        )
                      }
                      className="w-full flex items-center justify-between p-4"
                    >
                      <span className="font-bold text-xl">
                        Order Summary
                      </span>

                      {/* {isSummaryExpanded ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )} */}
                    </button>

                    <AnimatePresence>

                      {/* {isSummaryExpanded && ( */}
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          className="px-4 pb-4 p-2"
                        >

                          <div className="space-y-3 pt-3 border-t border-white/10">

                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">
                                Subtotal
                              </span>

                              <span className="font-bold">
                                ₹
                                {subtotal.toLocaleString()}
                              </span>
                            </div>

                            {totalDiscount > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">
                                  Discount
                                </span>

                                <span className="text-green-400 font-bold">
                                  -₹
                                  {totalDiscount.toLocaleString()}
                                </span>
                              </div>
                            )}

                            {totalGst > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">
                                  GST
                                </span>

                                <span className="text-blue-400 font-bold">
                                  +₹
                                  {totalGst.toLocaleString()}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">
                                Shipping
                              </span>

                              <span className="text-green-400">
                                Free
                              </span>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-white/10">

                              <div>
                                <span className="font-bold">
                                  Total
                                </span>

                                <p className="text-xs text-gray-400">
                                  Final amount after GST & Discount
                                </p>
                              </div>

                              <div className="text-right">

                                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                  ₹
                                  {total.toLocaleString()}
                                </div>

                                <p className="text-xs text-gray-400">
                                  {totalItems}{" "}
                                  {totalItems === 1
                                    ? "item"
                                    : "items"}
                                </p>

                              </div>

                            </div>

                            <button
                              onClick={
                                handleCheckout
                              }
                              className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <FiLock size={18} />

                              Proceed to Checkout

                              <FiChevronRight />
                            </button>

                            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">

                              <div className="flex items-start gap-2">

                                <FiShield
                                  className="text-green-400 mt-0.5 flex-shrink-0"
                                  size={16}
                                />

                                <div>

                                  <p className="text-xs text-green-400 font-medium">
                                    Secure Checkout
                                  </p>

                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Your payment information is encrypted and secure
                                  </p>

                                </div>

                              </div>

                            </div>

                            <Link
                              to="/products"
                              className="block w-full mt-3 py-2.5 border border-white/20 hover:border-white/40 text-center rounded-xl hover:bg-white/5 transition-all text-sm"
                            >
                              Continue Shopping
                            </Link>

                          </div>

                        </motion.div>
                      {/* )} */}

                    </AnimatePresence>

                  </motion.div>

                ) : (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    className="sticky top-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl"
                  >

                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">

                      <FiShoppingCart className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />

                      Order Summary

                    </h2>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">

                      <div className="flex justify-between items-center">

                        <span className="text-gray-400 text-sm sm:text-base">
                          Subtotal
                        </span>

                        <span className="font-bold text-base sm:text-lg">
                          ₹
                          {subtotal.toLocaleString()}
                        </span>

                      </div>

                      {totalDiscount > 0 && (
                        <div className="flex justify-between items-center">

                          <span className="text-gray-400 text-sm sm:text-base">
                            Discount
                          </span>

                          <span className="text-green-400 font-bold text-sm sm:text-base">
                            -₹
                            {totalDiscount.toLocaleString()}
                          </span>

                        </div>
                      )}

                      {totalGst > 0 && (
                        <div className="flex justify-between items-center">

                          <span className="text-gray-400 text-sm sm:text-base">
                            GST
                          </span>

                          <span className="text-blue-400 font-bold text-sm sm:text-base">
                            +₹
                            {totalGst.toLocaleString()}
                          </span>

                        </div>
                      )}

                      <div className="flex justify-between items-center">

                        <span className="text-gray-400 text-sm sm:text-base">
                          Shipping
                        </span>

                        <span className="text-green-400 text-sm sm:text-base">
                          Free
                        </span>

                      </div>

                    </div>

                    <div className="flex justify-between items-center py-3 sm:py-4 border-t border-white/10">

                      <div>

                        <span className="font-bold text-base sm:text-lg">
                          Total
                        </span>

                        <p className="text-gray-400 text-xs sm:text-sm">
                          Final amount after GST & Discount
                        </p>

                      </div>

                      <div className="text-right">

                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          ₹
                          {total.toLocaleString()}
                        </div>

                        <p className="text-gray-400 text-xs sm:text-sm">
                          {totalItems}{" "}
                          {totalItems === 1
                            ? "item"
                            : "items"}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={
                        handleCheckout
                      }
                      className="group relative w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3"
                    >

                      <FiLock
                        size={18}
                        className="sm:w-5 sm:h-5"
                      />

                      <span className="text-sm sm:text-base">
                        Proceed to Checkout
                      </span>

                      <FiChevronRight className="group-hover:translate-x-1 transition-transform" />

                    </button>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-xl">

                      <div className="flex items-start gap-2 sm:gap-3">

                        <FiShield
                          className="text-green-400 mt-0.5 flex-shrink-0 sm:w-5 sm:h-5"
                          size={16}
                        />

                        <div>

                          <p className="text-green-400 font-medium text-xs sm:text-sm">
                            Secure Checkout
                          </p>

                          <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                            You will pay: ₹
                            {total.toLocaleString()}{" "}
                            (including all applicable taxes and discounts)
                          </p>

                        </div>

                      </div>

                    </div>

                    <Link
                      to="/products"
                      className="block w-full mt-3 sm:mt-4 py-2.5 sm:py-3 border border-white/20 hover:border-white/40 text-center rounded-xl hover:bg-white/5 transition-all text-sm sm:text-base"
                    >
                      Continue Shopping
                    </Link>

                  </motion.div>

                )}

              </div>

            </div>

          )}

        </AnimatePresence>

      </div>

    </div>
  );
};

export default CartPage;

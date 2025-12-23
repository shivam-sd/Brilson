import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import axios from "axios";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const isLoggedIn = !!token;


    //  GET CART COUNT

  const getCartCount = async () => {
    try {
      if (isLoggedIn) {
        //  Logged in 
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        setCartCount(res.data.cartItems?.length || 0);
      } else {
        //  Guest → localStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(localCart.length);
      }
    } catch (error) {
      console.error("Cart count error:", error);
      setCartCount(0);
    }
  };


    //  ON LOAD / TOKEN CHANGE

  useEffect(() => {
    getCartCount();
  }, [token]);


    //  LISTEN CART UPDATE

  useEffect(() => {
    const handleCartUpdate = () => getCartCount();

    window.addEventListener("cartUpdate", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdate", handleCartUpdate);
    };
  }, []);


    //  LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCartCount(0);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white text-2xl font-semibold"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              B
            </div>
            Brilson
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-gray-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/products" className="hover:text-white">Products</Link>
          <Link to="/how-it-works" className="hover:text-white">How It Works</Link>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart */}
          <Link to="/your-items" className="relative text-2xl text-gray-300 hover:text-white">
            <LuShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <FaUser /> Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white">
              <FaUser /> Logout
            </button>
          )}

          <Link
            to="/get-card"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
          >
            Get Your Card
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-5">
          <Link to="/your-items" className="relative text-2xl text-white">
            <LuShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={() => setOpen(!open)} className="text-3xl text-white">
            {open ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0c0c0c] border-t border-white/10 px-6 py-4">
          <div className="flex flex-col gap-4 text-gray-300">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            <Link to="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>

            {!isLoggedIn ? (
              <Link to="/login" className="bg-blue-600 text-center py-2 rounded-lg text-white font-bold">
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="bg-red-600 py-2 rounded-lg text-white font-bold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

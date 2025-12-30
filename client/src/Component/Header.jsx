import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [myCardProfile, setMyCardProfile] = useState(null);

  const isLoggedIn = !!token;

  /* ---------------- CART COUNT ---------------- */
  const getCartCount = async () => {
    try {
      if (isLoggedIn) {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/cart/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCartCount(res.data.cartItems?.length || 0);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(localCart.length);
      }
    } catch (err) {
      setCartCount(0);
    }
  };

  /* ---------------- ACTIVE CARD CHECK ---------------- */
  const fetchMyActiveCard = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/my-active-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res)
      if (res.data?.hasCard) {
        setMyCardProfile(res.data);
      } else {
        setMyCardProfile(null);
      }
    } catch (err) {
      setMyCardProfile(null);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    getCartCount();
    fetchMyActiveCard();
  }, [token]);

  useEffect(() => {
    const handleCartUpdate = () => getCartCount();
    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMyCardProfile(null);
    setCartCount(0);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
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

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 text-gray-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/products" className="hover:text-white">Products</Link>
          <Link to="/how-it-works" className="hover:text-white">How It Works</Link>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
        </ul>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* CART */}
          <Link to="/your-items" className="relative text-2xl text-gray-300 hover:text-white">
            <LuShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-300 hover:text-white border-2 border-white/40 rounded-lg px-4 py-2 relative group"
            >
              <FaUser /> Login
               <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left rounded hover:bg-gray-800 text-gray-300 hover:text-white absolute top-10 right-1 border-2 border-white/30 hidden cursor-pointer"
                  >
                    Logout
                  </button>
            </Link>
          ) : (
            <div className="relative group ">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white border-2 border-white/30 py-2 px-4 rounded-lg cursor-pointer">
                <FaUser />
                <IoIosArrowDown className="group-hover:rotate-180 transition-transform" />
              </button>

              {/* DROPDOWN */}
              <div className="absolute top-12 right-0 bg-gray-900 border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[160px]">
                <div className="flex flex-col p-2 gap-1">
                  
                  {/* ONLY IF CARD ACTIVE */}
                  {myCardProfile && (
                    <Link
                      to={`/profile/${myCardProfile.slug}`}
                      className="px-3 py-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      My Profile
                    </Link>
                  )}

     <Link
                      to={`/orders`}
                      className="px-3 py-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
                    >
                      My Orders
                    </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left rounded hover:bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/get-card"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
          >
            Get Your Card
          </Link>
        </div>

        {/* MOBILE */}
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

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#0c0c0c] border-t border-white/10 px-6 py-4">
          <div className="flex flex-col gap-4 text-gray-300">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            <Link to="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>

 <Link
                to={`/get-card`}
                onClick={() => setOpen(false)}
                className="border border-white/20 bg-blue-600 rounded-lg py-2 text-center"
              >
                Get Your Card
              </Link>

            {isLoggedIn && myCardProfile && (
              <Link
                to={`/profile/${myCardProfile.slug}`}
                onClick={() => setOpen(false)}
                className="border border-white/20 rounded-lg py-2 text-center"
              >
                My Profile
              </Link>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="bg-blue-600 py-2 rounded-lg text-center text-white"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-white/20 rounded-lg py-2"
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [myCardProfile, setMyCardProfile] = useState(null);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const isLoggedIn = !!token;

  /* CART COUNT */
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
    } catch {
      setCartCount(0);
    }
  };

  /* ACTIVE CARD */
  const fetchMyActiveCard = async () => {
    try {
      if (!token) return;
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/my-active-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyCardProfile(res.data?.hasCard ? res.data : null);
    } catch {
      setMyCardProfile(null);
    }
  };

  useEffect(() => {
    getCartCount();
    fetchMyActiveCard();
  }, [token]);

  useEffect(() => {
    const handleCartUpdate = () => getCartCount();
    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, []);

  /* LOGOUT */
    const handleLogout = async () => {
  try {
    if (token) {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    }
  } catch (err) {
    console.log("Logout API error:", err);
  } finally {
    // Frontend cleanup 
    localStorage.removeItem("token");
    setToken(null);
    setMyCardProfile(null);
    setCartCount(0);
    setMobileProfileOpen(false);
  }
};

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:p-4 md:p-4 p-2 pt-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-white text-2xl font-semibold"
          >
            <img src="/logo2.png" alt="logo" className="w-7" loading="lazy" />
            <span className="text-2xl">RILSON</span>
          </motion.div>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 text-gray-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/products" className="hover:text-white">Products</Link>
          <Link to="/how-it-works" className="hover:text-white">How It Works</Link>
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

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-lg text-gray-300 hover:text-white"
            >
              <FaUser /> Login
            </Link>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-lg text-gray-300 hover:text-white">
                <FaUser />
                <IoIosArrowDown />
              </button>

              {/* DESKTOP DROPDOWN */}
              <div className="absolute top-12 right-0 bg-gray-900 border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[160px]">
                <div className="flex flex-col p-2 gap-1">

                  {myCardProfile ? (
                    <Link
                      to={`/profile/${myCardProfile.slug}`}
                      className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                    >
                      My Profile
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        window.location.href = `${import.meta.env.VITE_DOMAIN}/card/activate`
                      }
                      className="px-3 py-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                    >
                      My Profile
                    </button>
                  )}

                  <Link to="/orders" className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white">
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>

                </div>
              </div>
            </div>
          )}

          <Link to="/get-card" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
            Get Your Card
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-5">

          {/* CART */}
          <Link to="/your-items" className="relative text-2xl text-white">
            <LuShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          {!isLoggedIn ? (
            <Link to="/login">
              <FaUser className="text-2xl text-white cursor-pointer" />
            </Link>
          ) : (
            <div className="relative">
              <div className="p-2 rounded-full border-2 border-white/20 flex items-center justify-center">
              <FaRegUserCircle
                className="text-2xl text-white cursor-pointer"
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                />
                </div>

              {mobileProfileOpen && (
                <div className="absolute right-0 top-10 bg-gray-900 border border-white/20 rounded-lg shadow-xl min-w-[160px] z-50">
                  <div className="flex flex-col p-2 gap-1">

                    {myCardProfile ? (
                      <Link
                        to={`/profile/${myCardProfile.slug}`}
                        onClick={() => setMobileProfileOpen(false)}
                        className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                      >
                        My Profile
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileProfileOpen(false);
                          window.location.href = `${import.meta.env.VITE_DOMAIN}/card/activate`;
                        }}
                        className="px-3 py-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                      >
                        My Profile
                      </button>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setMobileProfileOpen(false)}
                      className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                    >
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white"
                    >
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;

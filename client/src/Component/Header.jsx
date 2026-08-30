import React, { useEffect, useRef, useState } from "react";
import { Link, replace } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import { IoIosArrowDown, IoMdArrowDropdownCircle, IoMdArrowDroprightCircle, IoMdMenu } from "react-icons/io";
import axios from "axios";
import LogoSection from "./LogoSection";
import { BookCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "../Pages/hooks/useCart";
import { toast } from "react-toastify";

// import UserAllCards from "./UserAllCards";

const Header = () => {

  const { cartCount } = useCart();

  // const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [myCardProfile, setMyCardProfile] = useState(null);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [cards, setCards] = useState([]);
  // const [showAllCards, setShowAllCards] = useState(false);
  // const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = !!token;

  // Get user data to check if Google user
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

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
        // setCartCount(res.data.cartItems?.length || 0);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        // setCartCount(localCart.length);
      }
    } catch {
      // setCartCount(0);
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
      setUserId(res.data.userId);
      // console.log(res)
    } catch {
      setMyCardProfile(null);
    }
  };

  useEffect(() => {
    // getCartCount();
    fetchMyActiveCard();
  }, [token]);

  useEffect(() => {
    // const handleCartUpdate = () => getCartCount();
    // window.addEventListener("cartUpdate", handleCartUpdate);
    // return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, []);

  /* ============================================ */
  /* 🚪 LOGOUT - UPDATED FOR NORMAL + GOOGLE USER */
  /* ============================================ */

  const handleLogout = async () => {
    try {
      if (token) {
        // 🔥 Check if user is Google user
        const user = getUserData();
        const isGoogleUser = user?.isGoogleUser || false;

        // 🔥 Choose correct logout endpoint
        const logoutEndpoint = isGoogleUser
          ? `${import.meta.env.VITE_BASE_URL}/api/auth/google/logout`
          : `${import.meta.env.VITE_BASE_URL}/api/auth/logout`;

        const res = await axios.post(
          logoutEndpoint,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        navigate("/", { replace: true });
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (err) {
      // console.log("Logout API error:", err);
      
      // 🔥 Even if API fails, show appropriate message
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } finally {
      // Frontend cleanup (same for both)
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("googleUser");
      setToken(null);
      setMyCardProfile(null);
      // setCartCount(0);
      setMobileProfileOpen(false);
      
      // 🔥 Force navigation to home after cleanup
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
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
            className="lg:flex hidden flex items-center text-white text-2xl font-semibold"
          >
            {/* <img src="/logo2.png" alt="logo" className="w-6" loading="lazy" /> */}
            <div className="text-4xl font-Roboto font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-widest">
              BRILSON
            </div>
          </motion.div>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 text-gray-100 tracking-widest font-Roboto font-bold">
          <Link to="/" className="hover:text-white text-lg">Home</Link>
          <Link to="/products" className="hover:text-white text-lg">Products</Link>
          <Link to="/how-it-works" className="hover:text-white text-lg">How It Works</Link>
        </ul>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-6">

          {/* CART */}
          <Link to="/your-items" className="relative text-2xl text-gray-300 hover:text-white">
            <LuShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-lg text-gray-300 hover:text-white tracking-widest 
              font-Roboto"
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
                <div className="flex flex-col p-2 gap-1 relative">

                  <Link
                    to={`/admin/passTo/Profile`}
                    className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white tracking-widest font-semibold font-Roboto"
                  >
                    My Admin
                  </Link>

                  <Link to="/orders" className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white flex items-center tracking-widest font-Roboto font-semibold">
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white flex items-center tracking-widest font-Roboto font-semibold cursor-pointer"
                  >
                   <span className="mr-2">Logout</span><MdLogout size={20} /> 
                  </button>

                </div>
              </div>
            </div>
          )}

          <Link
            to="/get-card"
            className="group inline-flex items-center gap-2 px-6 py-2 rounded-full
  text-white font-medium relative overflow-hidden border
border-t-cyan-400/40 border-r-orange-400/40 border-l-amber-400/40 border-b-red-500/40  shadow-gray-800 shadow-lg
  transition-all duration-300 hover:scale-105 tracking-widest font-Roboto"
            style={{
              textShadow: "2px 2px 3px rgba(136,0,136,0.5)",
              backgroundPosition: "left center"
            }}
          >
            <span>Get Your Card</span>
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center justify-between w-full">

          {/* PROFILE */}
          {!isLoggedIn ? (
            <Link to="/login">
              <FaUser className="text-2xl text-white cursor-pointer" />
            </Link>
          ) : (
            <div className="relative">
              <div className="p-2 rounded-full border-2 border-white/20 flex items-center justify-center">
                <IoMdMenu
                  className="text-2xl text-white cursor-pointer"
                  onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                />
              </div>

              {mobileProfileOpen && (
                <div className="absolute left-0 top-15 bg-gray-900 border border-white/20 rounded-lg shadow-xl min-w-[160px] z-50"
                  ref={menuRef}
                >
                  <div className="flex flex-col p-2 gap-1">

                    <Link
                      to={`/admin/passTo/Profile`}
                      onClick={() => setMobileProfileOpen(false)}
                      className="px-3 py-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white tracking-widest font-Roboto"
                    >
                      My Admin
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-left hover:bg-gray-800 rounded text-gray-300 hover:text-white tracking-widest font-Roboto"
                    >
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOGO */}
          <Link to="/">
            <div
              className="flex items-center text-white text-2xl font-semibold ml-8"
            >
              {/* <img src="/logo2.png" alt="logo" className="w-6" loading="lazy" /> */}
              <div className="text-4xl font-Roboto font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-widest ">
                Brilson
              </div>
            </div>
          </Link>

          {/* CART */}
          <Link to="/your-items" className="relative text-2xl text-white">
            <LuShoppingCart size={28} />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/orders"
            onClick={() => setMobileProfileOpen(false)}
            className="hover:bg-gray-800 rounded text-gray-300 hover:text-white"
          >
            <BookCheck size={28} />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
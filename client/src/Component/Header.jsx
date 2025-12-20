import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartQut, setCartQut] = useState(0);
 

  // Update cart quantity from localStorage
  const updateCartCount = () => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalItems = items.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartQut(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    // Listen when localStorage is updated (cart changes)
    window.addEventListener("storage", updateCartCount);
    
    // Also listen for custom event when cart is updated within same tab
    window.addEventListener("cartUpdated", updateCartCount);

    // Update cart count periodically to catch changes
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Function to trigger cart update event
  const triggerCartUpdate = () => {
    const event = new Event("cartUpdated");
    window.dispatchEvent(event);
  };

  const token = localStorage.getItem("token");

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to={"/"}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-semibold text-2xl flex items-center gap-2"
          >
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">
              B
            </div>
            Brilson
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-300">
          <li>
            <Link to="/" className="hover:text-white duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-white duration-200">
              Products
            </Link>
          </li>

          {/* Dropdown */}
          <li className="relative group">
            <Link to={''} className="hover:text-white duration-200 cursor-pointer flex items-center">
              Cards 
              <IoMdArrowDropdown />
            </Link>

            {/* <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-6 left-0 w-40 bg-black/80 border border-cyan-400 rounded-lg hidden group-hover:flex flex-col gap-2 py-2 z-50"
            >
              <Link
                className="hover:bg-cyan-400/40 px-3 py-2 rounded-lg"
                to="/bestseller-card"
              >
                Best Seller
              </Link>
              <Link
                className="hover:bg-cyan-400/40 px-3 py-2 rounded-lg"
                to="/personal-card"
              >
                Personal Card
              </Link>
              <Link
                className="hover:bg-cyan-400/40 px-3 py-2 rounded-lg"
                to="/business-card"
              >
                Business Card
              </Link>
            </motion.div> */}
          </li>

          <li>
            <Link to="/how-it-works" className="hover:text-white duration-200">
              How It Works
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="hover:text-white duration-200">
              Pricing
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/your-items"
            className="relative text-gray-300 text-2xl hover:text-white"
          >
            <LuShoppingCart />
            {cartQut > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 text-sm bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                {cartQut}
              </span>
            )}
          </Link>

{
  token ? <> </> : <>
  <Link
            to="/login"
            className="text-gray-300 hover:text-white duration-200 flex items-center gap-2"
          >
            <FaUser /> Login
          </Link></>
}

          <Link
            to="/get-card"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 duration-200 rounded-lg text-white font-medium shadow-lg shadow-blue-600/30"
          >
            Get Your Card
          </Link>
        </div>

        {/* Mobile Icons and Menu Button */}
        <div className="flex md:hidden items-center gap-6">
          <Link
            to="/your-items"
            className="relative text-gray-300 text-2xl hover:text-white"
          >
            <LuShoppingCart />
            {cartQut > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 text-sm bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                {cartQut}
              </span>
            )}
          </Link>

          <button
            className="text-white text-3xl"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0c0c0c] border-t border-white/10"
        >
          <ul className="flex flex-col px-6 py-4 gap-4 text-gray-300">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            {/* <Link to="/bestseller-card" onClick={() => setOpen(false)}>Best Seller Cards</Link>
            <Link to="/personal-card" onClick={() => setOpen(false)}>Personal Cards</Link>
            <Link to="/business-card" onClick={() => setOpen(false)}>Business Cards</Link> */}
            <Link to="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
            {
              token ? <></>:<>
              <Link to="/login" className="mt-2 w-full bg-blue-600 p-2 rounded-lg text-center font-bold" onClick={() => setOpen(false)}>
              Login
            </Link>
              </>
            }
            
            <Link
              to="/get-card"
              className="mt-2 bg-blue-600 text-center py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Get Your Card
            </Link>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
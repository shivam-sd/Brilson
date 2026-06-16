import React, { useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { CiMenuFries } from "react-icons/ci";
import { GiCrossMark } from "react-icons/gi";
import { BsQrCode } from "react-icons/bs";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdAnalytics } from "react-icons/md";
import { GrDocumentLocked } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { FaLuggageCart } from "react-icons/fa";
import { MdReviews } from "react-icons/md";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [SideBar, setSideBar] = useState(true);

  const handleSideBarToggle = (val) => {
    setSideBar(val);
  };

  const pageTitles = {
  "/admindashboard": "Admin Dashboard",
  "/admindashboard/products/list": "Admin Products",
  "/admindashboard/orders/list": "Admin Orders",
  "/admindashboard/customers/list": "Admin Customers",
  "/admindashboard/manage-cards": "Admin Manage Cards (QR)",
  "/admindashboard/manage-cards/card": "Admin Manage Cards (CARD)",
  "/admindashboard/manage-parking-tag": "Admin Manage Parking Tag",
  "/admindashboard/manage-google-reviews": "Admin Manage Google Reviews",
  "/admindashboard/selling-overview": "Admin Selling Overview",
  "/admindashboard/orders/invoices": "Admin Orders Invoices",
  "/admindashboard/landing/page/content": "Admin Landing Page Content",
  "/admindashboard/payment/gateway/isactive": "Admin Payment Gateway",
  "/admindashboard/setting/config": "Admin Settings",
};

const location = useLocation();
console.log(location);
const currentTitle = pageTitles[location.pathname] || "Admin Dashboard" ;


  return (
    <div className="flex h-screen bg-[#0D0F17] text-white overflow-hidden">
      {/* MOBILE TOPBAR */}
      <div className="md:hidden w-full fixed top-0 left-0 bg-[#151822] px-5 py-4 flex justify-between items-center z-50 border-b border-white/10">
        <h3 className="text-xl font-bold">
          Brilson <span className="text-cyan-400">Admin</span>
        </h3>
        <button onClick={() => setOpen(true)}>
          <CiMenuFries size={26} className="text-white" />
        </button>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#151822] z-50 p-8 flex flex-col transition-transform duration-300 overflow-auto md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-xl font-bold">
            Brilson <span className="text-cyan-400">Admin</span>
          </h4>
          <button onClick={() => setOpen(false)}>
            <GiCrossMark size={26} className="text-white" />
          </button>
        </div>

        {/* MOBILE MENU */}
        <nav className="flex flex-col gap-6 text-[14px]">
          <NavLink
            to="/admindashboard"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiHome size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="products/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiPackage size={18} /> Products
          </NavLink>

          <NavLink
            to="orders/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiShoppingBag size={18} /> Orders
          </NavLink>

          <NavLink
            to="customers/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiUsers size={18} /> Customers
          </NavLink>

          <NavLink
            to="manage-cards"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <MdManageAccounts size={18} /> Manage Cards (QR)
          </NavLink>

          <NavLink
            to="manage-parking-tag"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FaLuggageCart size={18} /> Manage Parking Tag
          </NavLink>

          <NavLink
            to="manage-google-reviews"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <MdReviews size={18} /> Manage Google Reviews
          </NavLink>

          <NavLink
            to="selling-overview"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <MdAnalytics size={18} /> Selling Overview
          </NavLink>

          <NavLink
            to="orders/invoices"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <GrDocumentLocked size={18} /> Orders invoices
          </NavLink>

          <NavLink
            to="landing/page/content"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiSettings size={18} /> Landing Page Content
          </NavLink>

          <NavLink
            to="payment/gateway/isactive"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <RiSecurePaymentFill size={18} /> Payment Gateway
          </NavLink>

          <NavLink
            to="setting/config"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 text-sm"
            onClick={() => setOpen(false)}
          >
            <FiSettings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="mt-auto">
          {/* <button className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition cursor-pointer">
            <FiLogOut size={20} /> Logout
          </button> */}
        </div>
      </aside>

      {/* DESKTOP SIDEBAR - SMOOTH TOGGLE */}
      <aside
        className={`hidden md:flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out ${
          SideBar ? "w-72 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="w-72 bg-[#151822] border-r border-white/10 px-6 py-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-extrabold tracking-wide whitespace-nowrap">
              Brilson <span className="text-cyan-400">Admin</span>
            </h3>
            <span onClick={() => handleSideBarToggle(false)}>
              <GiCrossMark size={28} className="cursor-pointer text-slate-300 hover:text-red-400 transition" />
            </span>
          </div>

          <nav className="flex flex-col gap-6 text-lg">
            <NavLink
              to="/admindashboard"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiHome size={18} /> Dashboard
            </NavLink>

            <NavLink
              to="products/list"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiPackage size={18} /> Products
            </NavLink>

            <NavLink
              to="orders/list"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiShoppingBag size={18} /> Orders
            </NavLink>

            <NavLink
              to="customers/list"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiUsers size={18} /> Customers
            </NavLink>

            <NavLink
              to="manage-cards"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <MdManageAccounts size={18} /> Manage Cards (QR)
            </NavLink>

            <NavLink
              to="manage-cards/card"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <MdManageAccounts size={18} /> Manage Cards (CARD)
            </NavLink>

            <NavLink
              to="manage-parking-tag"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FaLuggageCart size={18} /> Manage Parking Tag
            </NavLink>

            <NavLink
              to="manage-google-reviews"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <MdReviews size={18} /> Manage Google Reviews
            </NavLink>

            <NavLink
              to="selling-overview"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <MdAnalytics size={18} /> Selling Overview
            </NavLink>

            <NavLink
              to="orders/invoices"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <GrDocumentLocked size={18} /> Orders invoices
            </NavLink>

            <NavLink
              to="landing/page/content"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiSettings size={18} /> Landing Page Content
            </NavLink>

            <NavLink
              to="payment/gateway/isactive"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <RiSecurePaymentFill size={18} /> Payment Gateway
            </NavLink>

            <NavLink
              to="setting/config"
              className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200 whitespace-nowrap text-sm"
            >
              <FiSettings size={18} /> Settings
            </NavLink>
          </nav>

          <div className="mt-auto">
            {/* <button className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition">
              <FiLogOut size={20} /> Logout
            </button> */}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT - SCROLLABLE AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOPBAR (DESKTOP) */}
        <div className="hidden md:flex gap-15 items-center px-4 sm:px-6 md:px-20 py-4 bg-[#0D0F17] border-b border-white/10">
          {!SideBar && (
            <span onClick={() => handleSideBarToggle(true)}>
              <CiMenuFries size={28} color="white" className="cursor-pointer hover:text-cyan-400 transition" />
            </span>
          )}
          <h3 className="text-xl font-bold">{currentTitle}</h3>
        </div>

        {/* SCROLLABLE PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
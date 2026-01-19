import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
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
import { MdAnalytics } from "react-icons/md";
import { GrDocumentLocked } from "react-icons/gr";


const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0D0F17] text-white relative">

      {/* MOBILE TOPBAR */}
      <div className="md:hidden w-full fixed top-0 left-0 bg-[#151822] px-5 py-4 flex justify-between items-center z-50 border-b border-white/10">
        <h1 className="text-2xl font-bold">
          Brilson <span className="text-cyan-400">Admin</span>
        </h1>
        <button onClick={() => setOpen(true)}>
          <FiMenu size={26} className="text-white" />
        </button>
      </div>

      {/* SIDEBAR FOR DESKTOP */}
      <aside className="w-72 bg-[#151822] border-r border-white/10 px-6 py-10 hidden md:flex flex-col">
        <h2 className="text-4xl font-extrabold tracking-wide mb-10">
          Brilson <span className="text-cyan-400">Admin</span>
        </h2>

        <nav className="flex flex-col gap-6 text-lg">
          <NavLink
            to="/admindashboard"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiHome size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="products/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiPackage size={20} /> Products
          </NavLink>

          <NavLink
            to="orders/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiShoppingBag size={20} /> Orders
          </NavLink>

          <NavLink
            to="customers/list"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiUsers size={20} /> Customers
          </NavLink>

          <NavLink
            to="manage-cards"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiUsers size={20} /> Manage Cards
          </NavLink>



          <NavLink
            to="selling-overview"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <MdAnalytics size={20} /> Selling Overview
          </NavLink>

          
          <NavLink
            to="orders/invoices"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <GrDocumentLocked size={20} /> Orders invoices
          </NavLink>

          <NavLink
            to="/landing/page/content"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiSettings size={20} /> Landing Page Content
          </NavLink>

          <NavLink
            to="/setting/config"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiSettings size={20} /> Settings
          </NavLink>
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition">
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#151822] z-50 p-8 flex flex-col transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">
            Brilson <span className="text-cyan-400">Admin</span>
          </h1>
          <button onClick={() => setOpen(false)}>
            <FiX size={26} className="text-white" />
          </button>
        </div>

        {/* MOBILE MENU */}
        <nav className="flex flex-col gap-6 text-xl">
          <NavLink
            to="/admindashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400"
          >
            <FiHome size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="products/list"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400"
          >
            <FiPackage size={20} /> Products
          </NavLink>

          <NavLink
            to="orders/list"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400"
          >
            <FiShoppingBag size={20} /> Orders
          </NavLink>

          <NavLink
            to="customers/list"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400"
          >
            <FiUsers size={20} /> Customers
          </NavLink>


          <NavLink
            to="manage-cards"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <FiUsers size={20} /> Manage Cards
          </NavLink>


           <NavLink
            to="orders/invoices"
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 duration-200"
          >
            <GrDocumentLocked size={20} /> Orders invoices
          </NavLink>

          {/* <NavLink
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-cyan-400"
          >
            <FiSettings size={20} /> Settings
          </NavLink> */}
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition cursor-pointer">
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-20 md:py-10 w-full">
        {/* TOPBAR (DESKTOP) */}
        <div className="hidden md:flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Admin Panel</h2>
          {/* <div className="w-10 h-10 rounded-full bg-cyan-400"></div> */}
        </div>

        {/* PAGE CONTENT */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

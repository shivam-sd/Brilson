import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  CreditCard,
  ChevronRight
} from 'lucide-react';

const QuickActions = () => {

    const navigate = useNavigate();


  const actions = [
    {
      id: 'add-card',
      title: 'Add New Card',
      description: 'Create a new NFC Card',
      icon: CreditCard,
      color: 'from-violet-500 to-purple-600',
      bgGlow: 'group-hover:shadow-violet-500/30',
      gradient: 'bg-gradient-to-br from-violet-50 to-purple-50',
      borderHover: 'group-hover:border-violet-300',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      textColor: 'text-violet-600'
    },
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'Add new product',
      icon: Package,
      color: 'from-emerald-500 to-teal-600',
      bgGlow: 'group-hover:shadow-emerald-500/30',
      gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderHover: 'group-hover:border-emerald-300',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600'
    },
    {
      id: 'view-orders',
      title: 'View Orders',
      description: 'Check all orders',
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
      bgGlow: 'group-hover:shadow-blue-500/30',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderHover: 'group-hover:border-blue-300',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'customers',
      title: 'Customers',
      description: 'View all customers',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
      bgGlow: 'group-hover:shadow-amber-500/30',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderHover: 'group-hover:border-amber-300',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-amber-600'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Sales & analytics',
      icon: BarChart3,
      color: 'from-rose-500 to-pink-600',
      bgGlow: 'group-hover:shadow-rose-500/30',
      gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',
      borderHover: 'group-hover:border-rose-300',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      textColor: 'text-rose-600'
    }
  ];

  const handleActionClick = (actionId) => {
    console.log(`Action triggered: ${actionId}`);
    if(actionId === "add-card"){
        navigate("/api/cards/bulk");
    }
    if(actionId === "add-product"){
        navigate("/admin/add/products");
    }
    if(actionId === "view-orders"){
        navigate("/admindashboard/orders/list");
    }
    if(actionId === "customers"){
        navigate("/admindashboard/customers/list");
    }
    if(actionId === "add-card"){
        navigate("/api/cards/bulk", {replace:true});
    }
  };

  return (
    <div className="w-full   bg-[#0f172a] border-[#1e293b] rounded-2xl mt-3 px-2 py-4">
      <div className="relative px-4 sm:px-6 lg:px-1 py-4 lg:py-5">
        
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-white text-start">
            Quick Actions
          </h3>
        </div>

        {/* Actions Grid - Sleek cards with proper proportions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            
            return (
              <div
                key={action.id}
                className="group relative"
                >
                {/* Glow effect on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${action.color} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${action.bgGlow}`}></div>
                
                {/* Card - Sleek and compact */}
                <div 
                  onClick={() => handleActionClick(action.id)}
                  className={`relative bg-[#0f172a] border-white/20 rounded-xl p-4 cursor-pointer transition-all duration-300 transform group-hover:-translate-y-1 border ${action.borderHover} shadow-sm hover:shadow-lg overflow-hidden`}
                >
                  {/* Hover gradient background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 `}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon and Title Row */}
                    <div className="flex items-center gap-3">
                      {/* Icon with gradient background */}
                      <div className={`w-10 h-10 rounded-lg ${action.iconBg} shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base font-semibold text-white  transition-colors">
                        {action.title}
                      </h3>
                    </div>

                      <p className="text-base font-semibold text-white  transition-colors mt-2 text-center">
                        {action.description}
                      </p>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
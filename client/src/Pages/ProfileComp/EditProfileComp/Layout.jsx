import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import { PiSelectionBackgroundFill } from "react-icons/pi";
import { 
  Menu, 
  X, 
  User, 
  Briefcase, 
  Settings, 
  Package, 
  Image,
  ChevronRight,
  Smartphone,
  Globe,
  Palette,
  Shield,
  Bell,
  Search,
  Edit2,
  Home,
  ChevronLeft
} from 'lucide-react';
import { TbWorldStar } from "react-icons/tb";
import { BiSolidContact } from "react-icons/bi";

const Layout = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActivePath(path || 'profile');
  }, [location]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isMobileMenuOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(e.target) && menuButton && !menuButton.contains(e.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileMenuOpen]);

  const menuItems = [
    // {
    //   id: 'profile-logo',
    //   path: 'profile-logo',
    //   label: 'Profile',
    //   icon: <User size={20} />,
    //   badge: null,
    //   mobileIcon: <User size={22} />
    // },
    // {
    //   id: 'profile-cover',
    //   path: 'profile-cover',
    //   label: 'Profile Cover',
    //   icon: <PiSelectionBackgroundFill size={20} />,
    //   badge: null,
    //   mobileIcon: <PiSelectionBackgroundFill size={22} />
    // },
    {
      id: 'basic-info',
      path: '',
      label: 'Basic Info',
      icon: <Edit2 size={20} />,
      badge: null,
      mobileIcon: <Edit2 size={22} />
    },
    {
      id: 'update-social-links',
      path: 'update-social-links',
      label: 'Social Media',
      icon: <TbWorldStar size={20} />,
      badge: null,
      mobileIcon: <TbWorldStar size={22} />
    },
    {
      id: 'services',
      path: 'services',
      label: 'Services',
      icon: <Settings size={20} />,
      badge: 'New',
      mobileIcon: <Settings size={22} />
    },
    {
      id: 'products',
      path: 'products',
      label: 'Products',
      icon: <Package size={20} />,
      badge: '12',
      mobileIcon: <Package size={22} />
    },
    {
      id: 'gallery',
      path: 'gallery',
      label: 'Gallery',
      icon: <Image size={20} />,
      badge: null,
      mobileIcon: <Image size={22} />
    },
    {
      id: 'payment',
      path: 'payment-details',
      label: 'Payment',
      icon: <MdOutlinePayment size={20} />,
      badge: null,
      mobileIcon: <MdOutlinePayment size={22} />
    },
    {
      id: 'location&review',
      path: 'location&review',
      label: 'Location',
      icon: <FaLocationCrosshairs size={20} />,
      badge: null,
      mobileIcon: <FaLocationCrosshairs size={22} />
    },
    {
      id: 'resume',
      path: 'resume',
      label: 'Resume',
      icon: <FaFilePdf size={20} />,
      badge: null,
      mobileIcon: <FaFilePdf size={22} />
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800/50 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
        <button
          id="menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-900/30 active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Edit Profile</h2>
            <p className="text-xs text-gray-400">ID: {id?.slice(-6)}</p>
          </div>
        </div>

        <div className="w-10 h-10"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div
        id="mobile-sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isMobile ? 'w-[85%] max-w-[320px]' : 'w-72 lg:w-80'}
          bg-gradient-to-b from-gray-900 to-gray-950
          border-r border-gray-800/50
          backdrop-blur-xl backdrop-saturate-150
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-80'}
          shadow-2xl shadow-black/50
          overflow-y-auto
          pb-20
        `}
        style={{
          boxShadow: isMobile ? '10px 0 30px rgba(0,0,0,0.5)' : ''
        }}
      >
        {/* Mobile Sidebar Header */}
        {isMobile && (
          <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-xl p-4 border-b border-gray-800/50 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Profile Editor
                  </h2>
                  <p className="text-xs text-gray-400">ID: {id?.slice(-8)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar Header */}
        {!isMobile && (
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <User size={20} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Profile Editor
                    </h2>
                    <p className="text-xs text-gray-400">ID: {id?.slice(-8)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="p-3 md:p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                replace
                to={`/profile/edit/${id}/${item.path}`}
                end
                onClick={() => {
                  if (isMobile) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/30 shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-gray-800/30 hover:border-gray-700/30 border border-transparent'
                  }
                  group relative
                  ${isMobile ? 'text-base' : 'text-sm'}
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${activePath === item.id 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-900/50 group-hover:bg-gray-800/50'
                  }
                `}>
                  {React.cloneElement(isMobile ? (item.mobileIcon || item.icon) : item.icon, {
                    className: activePath === item.id 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-300'
                  })}
                </div>
                
                {(!isCollapsed || isMobile) && (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className={`
                        font-medium block transition-colors
                        ${activePath === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                      `}>
                        {item.label}
                      </span>
                      
                    </div>
                    
                    {activePath === item.id && (
                      <ChevronRight size={16} className="text-blue-300 animate-pulse flex-shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          
        </div>

        {/* Mobile Bottom Safe Area */}
        {isMobile && <div className="h-16"></div>}
      </div>

      {/* Main Content Area */}
      <div className={`
        flex-1 min-h-screen overflow-y-auto
        ${isMobile ? 'pt-[72px]' : ''}
      `}>
        <div className="h-full bg-gradient-to-b from-gray-950/50 via-gray-950/30 to-gray-950/50">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-900/5 to-purple-900/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-900/5 to-pink-900/5 rounded-full blur-3xl"></div>
          </div>

          {/* Content Container */}
          <div className="relative h-full p-3 sm:p-4 md:p-6 lg:p-8">
            
            {/* Mobile Header Spacer */}
            {isMobile && <div className="h-2"></div>}

            {/* Main Content */}
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800/50 shadow-lg p-3 sm:p-4 md:p-6 min-h-[calc(100vh-120px)]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
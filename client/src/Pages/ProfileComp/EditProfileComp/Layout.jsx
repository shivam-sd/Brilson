import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
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
  Edit2
} from 'lucide-react';
import { TbWorldStar } from "react-icons/tb";
import { BiSolidContact } from "react-icons/bi";

const Layout = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActivePath(path || 'profile');
  }, [location]);

  const menuItems = [
    {
      id: 'basic-info',
      path: '',
      label: 'Basic Info',
      icon: <Edit2 size={20} />,
      badge: null
    },
    {
      id: 'profile-logo',
      path: 'profile-logo',
      label: 'Profile',
      icon: <User size={20} />,
      badge: null
    },
    {
      id: 'update-contact',
      path: 'update-contact',
      label: 'Contact',
      icon: <BiSolidContact size={20} />,
      badge: null
    },
    {
      id: 'update-social-links',
      path: 'update-social-links',
      label: 'Socail Media',
      icon: <TbWorldStar size={20} />,
      badge: null
    },
    {
      id: 'portfolio',
      path: 'portfolio',
      label: 'Portfolio',
      icon: <Briefcase size={20} />,
      badge: '3'
    },
    {
      id: 'services',
      path: 'services',
      label: 'Services',
      icon: <Settings size={20} />,
      badge: 'New'
    },
    {
      id: 'products',
      path: 'products',
      label: 'Products',
      icon: <Package size={20} />,
      badge: '12'
    },
    {
      id: 'gallery',
      path: 'gallery',
      label: 'Gallery',
      icon: <Image size={20} />,
      badge: null
    }
  ];


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-900/30"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 lg:w-80
        bg-gradient-to-b from-gray-900 to-gray-950
        border-r border-gray-800/50
        backdrop-blur-xl backdrop-saturate-150
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-80'}
        shadow-2xl shadow-black/30
      `}>
        
        {/* Sidebar Header */}
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

        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={`/profile/edit/${id}/${item.path}`}
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/30 shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-gray-800/30 hover:border-gray-700/30 border border-transparent'
                  }
                  group
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${activePath === item.id 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-900/50 group-hover:bg-gray-800/50'
                  }
                `}>
                  {React.cloneElement(item.icon, {
                    className: activePath === item.id 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-gray-300'
                  })}
                </div>
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className={`
                        font-medium block transition-colors
                        ${activePath === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                      `}>
                        {item.label}
                      </span>
                    </div>
                    
                  </>
                )}
              </NavLink>
            ))}
          </nav>

         
         
        </div>

      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden bg-black/60 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-hidden">
        <div className="h-full bg-gradient-to-b from-gray-950/50 via-gray-950/30 to-gray-950/50">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-900/5 to-purple-900/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-900/5 to-pink-900/5 rounded-full blur-3xl"></div>
          </div>

          {/* Content Container */}
          <div className="relative h-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
           
            {/* Main Content */}
            <div className="bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-lg p-4 sm:p-6 min-h-[calc(100vh-200px)]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
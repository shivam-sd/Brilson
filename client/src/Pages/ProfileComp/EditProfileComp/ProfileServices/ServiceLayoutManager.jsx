// components/ServiceLayoutManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutGrid } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { MdOutlineSwipeDown } from "react-icons/md";

const ServiceLayoutManager = ({ activationCode, onLayoutChange }) => {
  const [layoutType, setLayoutType] = useState('flex');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch current layout
  useEffect(() => {
    if (activationCode) {
      fetchCurrentLayout();
    }
  }, [activationCode]);

  const fetchCurrentLayout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/service-layout`,
        {
          params: { activationCode },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const currentLayout = response.data.layoutType || 'flex';
      setLayoutType(currentLayout);
      onLayoutChange?.(currentLayout);
    } catch (error) {
      console.error("Error fetching layout:", error);
    }
  };

  const updateLayout = async (newLayoutType) => {
    if (newLayoutType === layoutType) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/service-layout`,
        {
          activationCode,
          layoutType: newLayoutType
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLayoutType(newLayoutType);
      onLayoutChange?.(newLayoutType);
      toast.success(`Layout changed to ${newLayoutType === 'carousel' ? 'Carousel' : 'Grid'} view`);
    } catch (error) {
      console.error("Error updating layout:", error);
      toast.error("Failed to update layout");
    } finally {
      setLoading(false);
    }
  };

  // Only show on mobile devices
  if (!isMobile) return null;

  return (
    <div className="fixed top-18 right-4 z-50 md:hidden">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl p-1.5">
        <div className="flex gap-1">
          <button
            onClick={() => updateLayout('flex')}
            disabled={loading}
            className={`p-3 rounded-full transition-all duration-300 ${
              layoutType === 'flex'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => updateLayout('carousel')}
            disabled={loading}
            className={`p-3 rounded-full transition-all duration-300 ${
              layoutType === 'carousel'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Carousel View"
          >
            <MdOutlineSwipeDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceLayoutManager;
// ServicesEditPortfolio.jsx (Updated)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { toast } from "react-hot-toast";
import ServicesDisplay from "../EditProfileComp/ProfileServices/ServicesDisplay";
import ServiceLayoutManager from "../EditProfileComp/ProfileServices/ServiceLayoutManager";

const ServicesEditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layoutType, setLayoutType] = useState('flex');
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem("token");
  const activationCode = id; // Using profile ID as activationCode

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/profile-services/all/get/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const servicesData = res.data.data || [];
      setServices(servicesData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [id]);

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/profile-services/delete/${serviceId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Service deleted");
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayoutType(newLayout);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Services
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/profile/services/add/${id}`}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            <Package size={20} />
            Add New Service
          </Link>
        </div>
      </div>

      {/* Services Display */}
      {services.length !== 0 ? (
        <>
          {/* Desktop always shows flex, mobile shows based on selection */}
          {!isMobile ? (
            // Desktop: Always Flex/Grid Layout
            <ServicesDisplay 
              services={services} 
              layoutType="flex"
              onDelete={handleDelete}
              isEditMode={true}
            />
          ) : (
            // Mobile: Dynamic Layout based on user preference
            <ServicesDisplay 
              services={services} 
              layoutType={layoutType}
              onDelete={handleDelete}
              isEditMode={true}
            />
          )}
        </>
      ) : (
          <div className="text-center text-gray-400">No services available</div>
      )}

      {/* Layout Manager - Only shows on mobile */}
      {isMobile && services.length > 0 && (
        <ServiceLayoutManager 
          activationCode={activationCode}
          onLayoutChange={handleLayoutChange}
        />
      )}
    </div>
  );
};

export default ServicesEditPortfolio;
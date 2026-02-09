import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Clock,
  User,
  Hash,
  Calendar,
  Image as ImageIcon,
  Package,
  Tag,
  Shield,
  Copy,
  CheckCircle,
  AlertCircle,
  Edit,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ServicesEditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/profile-services/all/get/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const servicesData = res.data.data || [];
        setServices(servicesData);
        console.log(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

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
        },
      );
      toast.success("Service deleted");
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Services
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            to={`${"/profile/services/add/"}${id}`}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            <Package size={20} />
            Add New Service
          </Link>
        </div>
      </div>

      {services.length !== 0 ? (
        <>
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-[#E1C48A]/30 transition-all duration-500 hover:translate-y-[-8px] cursor-pointer"
              >
                {/* Service Title */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#E1C48A] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={12} className="text-green-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-md text-gray-400">Price:-</p>
                    <p className="text-sm font-bold text-gray-200">
                      {service.price}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {/* update button */}

                <div className="flex justify-center mt-4">
                  <Link
                    to={`${"/profile/services/update/"}${service._id}`}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Update Service
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
              <Package size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Portfolio Items Found
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You haven't added any portfolio items yet. Start by adding your
              first portfolio item.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesEditPortfolio;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiPackage, FiShoppingBag, FiUsers, FiBox, FiUser, FiLoader } from "react-icons/fi";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  /*  FETCH DATA  */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchOrders(),
          fetchProductsCount()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /*  FETCH ORDERS  */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/allorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = res.data.orders || [];

      setOrders(ordersData.slice(0, 6));

      setStats((prev) => ({
        ...prev,
        totalOrders: ordersData.length,
        totalCustomers: new Set(
          ordersData.map((o) => o.userId)
        ).size,
      }));
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  /*  FETCH PRODUCTS COUNT  */
  const fetchProductsCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/all/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const products = res.data.allProducts || [];

      setStats((prev) => ({
        ...prev,
        totalProducts: products.length,
      }));
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  };

  /* LOADING SKELETON COMPONENTS */
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-12">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3 animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-white/10 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg sm:rounded-xl animate-pulse">
              <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const OrdersSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="h-7 bg-white/10 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded w-1/4 animate-pulse"></div>
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white/5 p-4 rounded-lg border border-white/10 animate-pulse">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-16"></div>
              </div>
              
              <div className="mb-3">
                <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-32"></div>
              </div>
              
              <div className="mb-3">
                <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
                <div className="space-y-2">
                  {[1, 2].map((product) => (
                    <div key={product} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/10 rounded"></div>
                      <div className="h-4 bg-white/10 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <div className="h-3 bg-white/10 rounded w-20"></div>
                <div className="h-6 bg-white/10 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-white/10">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <th key={col} className="py-3 px-4">
                      <div className="h-4 bg-white/10 rounded w-3/4 mx-auto animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4, 5].map((col) => (
                      <td key={col} className="py-3 px-4">
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  /*  UI  */
  return (
    <div className="min-h-screen bg-[#0D0F17] text-white">
      <main className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold">
            Admin <span className="text-cyan-400">Dashboard</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Overview of your store performance and recent activities
          </p>
        </motion.div>

        {/* LOADING STATE */}
        {loading ? (
          <>
            <StatsSkeleton />
            <OrdersSkeleton />
            
            {/* Loading Spinner Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <div className="relative">
                  <FiLoader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <FiLoader className="w-12 h-12 text-cyan-400 mx-auto" />
                  </div>
                </div>
                <p className="text-white text-lg font-medium mt-2">Loading Dashboard...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* STATS CARDS - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-12">
              {[
                { 
                  label: "Total Orders", 
                  value: stats.totalOrders, 
                  icon: <FiShoppingBag className="text-cyan-400" />,
                  color: "cyan" 
                },
                { 
                  label: "Total Customers", 
                  value: stats.totalCustomers, 
                  icon: <FiUsers className="text-green-400" />,
                  color: "green" 
                },
                { 
                  label: "Total Products", 
                  value: stats.totalProducts, 
                  icon: <FiBox className="text-purple-400" />,
                  color: "purple" 
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
                        {card.label}
                      </p>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {card.value}
                      </h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg sm:rounded-xl">
                      {React.cloneElement(card.icon, { size: 24 })}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-xs text-gray-400">
                      Updated in real-time
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RECENT ORDERS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <FiShoppingBag className="text-cyan-400" /> Recent Orders
                  </h3>
                  <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                    Showing {orders.length} of {stats.totalOrders} orders
                  </span>
                </div>

                {/* Mobile View - Card Layout */}
                <div className="lg:hidden space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FiPackage className="mx-auto text-4xl mb-3 opacity-50" />
                      <p>No orders found</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div 
                        key={order._id}
                        className="bg-white/5 p-4 rounded-lg border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-xs text-gray-400">Order ID</span>
                            <p className="text-sm font-medium">#{order._id.slice(-6)}...</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-xs text-gray-400">Customer</span>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <FiUser size={14} />
                            {order.address?.name || "Customer"}
                          </p>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-xs text-gray-400">Products</span>
                          <div className="mt-1 space-y-2 max-h-20 overflow-y-auto">
                            {order.items.slice(0, 2).map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                                  <FiPackage size={10} />
                                </div>
                                <span className="truncate">{item.productTitle}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{order.items.length - 2} more items
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                          <span className="text-xs text-gray-400">Total Amount</span>
                          <span className="text-cyan-400 font-semibold">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop/Tablet View - Table Layout */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto rounded-lg">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="bg-white/10">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                            Order ID
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                            Customer
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                            Products
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                            Amount
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/10">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-400">
                              <FiPackage className="mx-auto text-3xl mb-3 opacity-50" />
                              <p>No orders found</p>
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <div className="text-sm font-medium text-gray-200">
                                  #{order._id.slice(-6)}...
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Order ID
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <FiUser size={14} />
                                  </div>
                                  <span className="text-sm text-gray-300">
                                    {order.address?.name || "Customer"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                                        <FiPackage size={14} />
                                      </div>
                                      <span className="truncate max-w-[200px]">
                                        {item.productTitle}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="text-cyan-400 font-semibold text-lg">
                                  ₹{order.totalAmount}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                                  order.status === "paid"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {orders.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-sm text-gray-400">
                        Showing {Math.min(6, orders.length)} recent orders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* QUICK STATS FOR MOBILE */}
            {/* <div className="lg:hidden mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-xs text-gray-400">Avg. Order Value</p>
                <p className="text-lg font-bold text-cyan-400">
                  ₹{orders.length > 0 ? Math.round(orders.reduce((acc, o) => acc + o.totalAmount, 0) / orders.length) : 0}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-xs text-gray-400">Active Today</p>
                <p className="text-lg font-bold text-green-400">
                  {orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    const today = new Date();
                    return orderDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div> */}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
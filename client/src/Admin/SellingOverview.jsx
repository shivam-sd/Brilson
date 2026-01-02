import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  Package,
  TrendingDown,
  Loader2,
  ChevronDown,
  Filter,
  PieChart,
  CalendarDays,
  CalendarRange,
  CalendarClock
} from "lucide-react";
import { motion } from "framer-motion";

const SellingOverview = () => {
  const [type, setType] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // Calculate totals from data
  const calculateTotals = () => {
    if (!data.length) return { totalSales: 0, totalRevenue: 0, totalProfit: 0 };
    
    return data.reduce((acc, item) => ({
      totalSales: acc.totalSales + (item.totalSales || 0),
      totalRevenue: acc.totalRevenue + (item.totalRevenue || 0),
      totalProfit: acc.totalProfit + (item.totalProfit || 0)
    }), { totalSales: 0, totalRevenue: 0, totalProfit: 0 });
  };

  const totals = calculateTotals();

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = `type=${type}`;

      if (type === "day" && date) {
        query += `&date=${date}`;
      }

      if (type === "month" && month && year) {
        query += `&month=${month}&year=${year}`;
      }

      if (type === "year" && year) {
        query += `&year=${year}`;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/sales/overview?${query}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
console.log(res)
      setData(res.data.data || []);
    } catch (error) {
      console.error("Fetch selling overview error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, date, month, year]);

  // Format date label based on type and item
  const formatDateLabel = (item) => {
    if (!item._id) return "N/A";
    
    switch(type) {
      case "day":
        return new Date(item._id.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      case "month":
        const monthName = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'long' });
        return `${monthName} ${item._id.year}`;
      case "year":
        return `Year ${item._id.year}`;
      default:
        return JSON.stringify(item._id);
    }
  };

  // Get current period label
  const getCurrentPeriodLabel = () => {
    switch(type) {
      case "day":
        return date ? new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }) : "Select Date";
      case "month":
        if (month && year) {
          const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
          return `${monthName} ${year}`;
        }
        return "Select Month & Year";
      case "year":
        return year ? `Year ${year}` : "Select Year";
      default:
        return "Current Period";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Sales Overview
                </h1>
              </div>
              <p className="text-gray-600">
                Monitor your sales performance and revenue insights
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {getCurrentPeriodLabel()}
              </span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{totals.totalSales}</h3>
              <p className="text-blue-100">Total Sales</p>
              <p className="text-sm text-blue-200 mt-2">
                {type === 'day' ? 'Today' : type === 'month' ? 'This Month' : 'This Year'}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-1">₹{totals.totalRevenue.toLocaleString()}</h3>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-sm text-green-200 mt-2">
                Gross income from sales
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <PieChart className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-1">₹{totals.totalProfit.toLocaleString()}</h3>
              <p className="text-purple-100">Total Profit</p>
              <p className="text-sm text-purple-200 mt-2">
                Net profit after expenses
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Filter Data
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Time Period Selector */}
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <option value="day">Daily Overview</option>
                  <option value="month">Monthly Overview</option>
                  <option value="year">Yearly Overview</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Date Selectors */}
              {type === "day" && (
                <div className="relative">
                  <CalendarClock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  />
                </div>
              )}

              {type === "month" && (
                <>
                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <option value="">Select Month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="pl-10 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm w-32"
                    />
                  </div>
                </>
              )}

              {type === "year" && (
                <div className="relative">
                  <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="pl-10 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm w-40"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing data for selected period
            </p>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Detailed Breakdown
            </h2>
            <p className="text-sm text-gray-500">
              Sales data for the selected period
            </p>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading sales data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Data Found
              </h3>
              <p className="text-gray-500">
                No sales data available for the selected period. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Period
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Sales Count
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Revenue
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Profit
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDateLabel(item)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {type} overview
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900">
                            {item.totalSales || 0}
                          </span>
                          <span className="text-sm text-gray-500">sales</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-gray-900">
                            ₹{(item.totalRevenue || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-gray-900">
                            ₹{(item.totalProfit || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (item.totalProfit || 0) > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(item.totalProfit || 0) > 0 ? 'Profitable' : 'No Profit'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {data.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(totals.totalSales / data.length)}
              </p>
              <p className="text-sm text-gray-500 mt-1">per period</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{Math.round(totals.totalRevenue / data.length).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">per period</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Profit</h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{Math.round(totals.totalProfit / data.length).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">per period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add RefreshCw icon import
import { RefreshCw } from "lucide-react";

export default SellingOverview;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUser, 
  FiPhone, 
  FiCalendar, 
  FiShoppingBag, 
  FiUsers
} from "react-icons/fi";


const UsersList = () => {
  const token = localStorage.getItem("adminToken");
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      
      const url = `${import.meta.env.VITE_BASE_URL}/api/users/all-users?page=${page}`;
      
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const usersData = res.data.Users || [];
      setUsers(usersData);
      // console.log(usersData)
      setTotalPages(res.data.totalPage || 1);
      setTotalUsers(res.data.totalUsers || usersData.length);
      setCurrentPage(res.data.page || 1);
      
      
      
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);
  
  // console.log(users)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRandomColor = (id) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = id.toString().length % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiUsers className="text-indigo-500 text-xl" />
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FiUsers className="text-indigo-400" />
            Users
            <span className="text-sm font-normal text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              {totalUsers} total
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage and view all registered users
          </p>
        </div>
      </div>

        
      
      {/* User List */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(user.id)}`}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="truncate max-w-[150px]">{user.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FiPhone size={14} className="text-gray-500" />
                          <span>{user.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FiCalendar size={14} className="text-gray-500" />
                          <span>{formatDate(user.joined)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          user.totalOrders > 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          <FiShoppingBag size={14} />
                          {user.totalOrders || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-700/30">
              {users.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 ${getRandomColor(user.id)}`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium text-lg truncate">{user.name || "Unknown"}</p>
                          <p className="text-gray-400 text-xs truncate">ID: {user.id}</p>
                        </div>
                        {user.totalOrders > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex-shrink-0">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-400 flex-shrink-0">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1.5">
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <FiPhone size={14} className="text-gray-500 flex-shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FiCalendar size={14} className="text-gray-500 flex-shrink-0" />
                          <span>Joined: {formatDate(user.joined)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FiShoppingBag size={14} className="text-gray-500 flex-shrink-0" />
                          <span>Orders: <span className="font-semibold text-purple-400">{user.totalOrders || 0}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 px-2 py-4 bg-gray-800/30 rounded-xl">
         
          <div className="flex items-center gap-1 justify-center">
            
            {getPageNumbers().map((pageNum, index) => (
              <button 
                key={index} 
                onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                    : pageNum === '...' 
                      ? 'text-gray-400 cursor-default' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                disabled={pageNum === '...'}
              >
                {pageNum}
              </button>
            ))}
            
    
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
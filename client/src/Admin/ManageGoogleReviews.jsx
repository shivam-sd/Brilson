import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud, FiEye } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import JSZip from 'jszip';
import { selectAdminToken } from "../store/slices/authSlice";
import { useSelector } from "react-redux";

const ManageGoogleReviews = () => {
  const token = useSelector(selectAdminToken);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    inactive: 0,
  });
  // const [reviewsStatus, setReviewsStatus] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [limit] = useState(100);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch Reviews
  const fetchReviews = useCallback(async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setIsSearching(!!search);

      const baseUrl = import.meta.env.VITE_BASE_URL || '';
      const params = new URLSearchParams({
        page,
        limit,
        search: search || ""
      });

      if (status && status !== "all") {
        params.append("status", status);
      }

      const url = `${baseUrl}/api/all/google-reviews?${params.toString()}`;

      // const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        setLoading(false);
        return;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });

      const responseData = res.data.data || res.data;
      const allReviews = responseData.cards || responseData.allGoogleReview || [];

      setReviews(allReviews);
      setTotalReviews(responseData.pagination?.totalCards || responseData.totleGoogleReview || 0);
      setTotalPages(responseData.pagination?.totalPages || responseData.totalPages || 1);
      setCurrentPage(responseData.pagination?.page || responseData.page || 1);

      let statsData;
      if (responseData.stats?.overall) {
        statsData = responseData.stats.overall;
      } else {
        const total = responseData.totleGoogleReview || allReviews.length;
        const activated = allReviews.filter(review => review.isActivated).length;
        const inactive = allReviews.filter(review => !review.isActivated).length;
        statsData = { total, activated, inactive };
      }

      setStats({
        total: statsData.total || 0,
        activated: statsData.activated || 0,
        inactive: statsData.inactive || 0
      });

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Unable to fetch google reviews");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchReviews(currentPage, searchQuery);
  }, [fetchReviews, currentPage, searchQuery]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchReviews(page, searchQuery);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchReviews(1, "");
  };

  //  SINGLE GOOGLE REVIEW CARD DOWNLOAD
  const downloadReviewCard = async (review) => {
    try {
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        flex-direction: column;
        gap: 15px;
      `;
      loadingDiv.innerHTML = `
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white text-lg">Generating Google Review Card...</p>
        <p class="text-gray-400 text-sm">${review.activationCode}</p>
      `;
      document.body.appendChild(loadingDiv);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/google-review-cards/${review._id}/download`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          timeout: 60000
        }
      );

      if (loadingDiv.parentNode) {
        document.body.removeChild(loadingDiv);
      }

      if (!response.data || response.data.size === 0) {
        toast.error('Download failed: Empty response');
        return;
      }

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `google-review-card-${review.activationCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/google-review/${review._id}/downloaded`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setReviews(prev =>
          prev.map(r =>
            r._id === review._id ? { ...r, isDownloaded: true } : r
          )
        );
      } catch (err) {
        console.error('Failed to mark as downloaded:', err);
      }

      toast.success("Google Review Card downloaded successfully!");

    } catch (error) {
      console.error("Download Error:", error);
      const loadingDiv = document.querySelector('div[style*="fixed"]');
      if (loadingDiv && loadingDiv.parentNode) {
        document.body.removeChild(loadingDiv);
      }

      let errorMessage = 'Failed to download card. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('adminToken');
      }
      toast.error(errorMessage);
    }
  };

  // BULK GOOGLE REVIEW CARDS DOWNLOAD
  const downloadBulkReviews = async () => {
    if (reviews.length === 0) {
      toast.error("No reviews available on this page to download");
      return;
    }

    setDownloading(true);
    setDownloadProgress({ current: 0, total: reviews.length });

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'bulk-download-loader';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      flex-direction: column;
      gap: 20px;
      backdrop-filter: blur(5px);
    `;
    loadingDiv.innerHTML = `
      <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-white text-xl font-semibold">Downloading ${reviews.length} Google Review Cards...</p>
      <p class="text-gray-400 text-sm">Page ${currentPage} of ${totalPages}</p>
      <div class="w-64 bg-gray-700 rounded-full h-2.5">
        <div id="progress-bar" class="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <p id="progress-text" class="text-gray-400 text-sm">0 / ${reviews.length} cards</p>
      <p id="failed-text" class="text-red-400 text-sm hidden">Failed: 0</p>
    `;
    document.body.appendChild(loadingDiv);

    try {
      const failedReviews = [];
      const successfulReviews = [];
      const zip = new JSZip();

      const updateProgress = (current, total) => {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        if (progressBar) {
          const percentage = (current / total) * 100;
          progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
        if (progressText) {
          progressText.textContent = `${current} / ${total} cards`;
        }
        setDownloadProgress({ current, total });
      };

      const updateFailed = (count) => {
        const failedText = document.getElementById('failed-text');
        if (failedText) {
          failedText.classList.remove('hidden');
          failedText.textContent = `Failed: ${count}`;
        }
      };

      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        try {
          updateProgress(i, reviews.length);

          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/google-review-cards/${review._id}/download`,
            {
              responseType: 'blob',
              headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
              timeout: 60000
            }
          );

          if (response.data && response.data.size > 0) {
            const fileName = `google-review-card-${review.activationCode}.png`;
            zip.file(fileName, response.data);
            successfulReviews.push(review);

            axios.patch(
              `${import.meta.env.VITE_BASE_URL}/api/google-review/${review._id}/downloaded`,
              {},
              { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
            ).catch(err => console.error('Failed to mark as downloaded:', err));
          } else {
            failedReviews.push(review);
            updateFailed(failedReviews.length);
          }
        } catch (error) {
          console.error(`Failed to download review ${review.activationCode}:`, error);
          failedReviews.push(review);
          updateFailed(failedReviews.length);
        }
      }

      updateProgress(reviews.length, reviews.length);

      if (successfulReviews.length === 0) {
        throw new Error('No cards could be downloaded. Please try again.');
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const loader = document.getElementById('bulk-download-loader');
      if (loader && loader.parentNode) {
        document.body.removeChild(loader);
      }

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brilson-google-review-cards-page-${currentPage}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setReviews(prev =>
        prev.map(r => {
          if (successfulReviews.find(sr => sr._id === r._id)) {
            return { ...r, isDownloaded: true };
          }
          return r;
        })
      );

      if (failedReviews.length > 0) {
        toast.success(`Downloaded ${successfulReviews.length} cards, ${failedReviews.length} failed`);
      } else {
        toast.success(`All ${successfulReviews.length} cards downloaded successfully!`);
      }

    } catch (error) {
      console.error("Bulk download error:", error);

      const loader = document.getElementById('bulk-download-loader');
      if (loader && loader.parentNode) {
        document.body.removeChild(loader);
      }

      let errorMessage = 'Download failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('adminToken');
      }

      toast.error(errorMessage);
    } finally {
      setDownloading(false);
      setDownloadProgress({ current: 0, total: 0 });
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

  const groupedReviews = reviews.reduce((acc, review) => {
    const date = new Date(review.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(review);
    return acc;
  }, {});

  const filteredGroupedReviews = Object.entries(groupedReviews).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="h-12 w-12 animate-spin border-t-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <FiAlertCircle className="text-4xl mx-auto mb-3" />
        {error}
      </div>
    );
  }

  const StatusBadge = ({ active }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${active
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-400"
        }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
      <div className="text-sm text-gray-400 text-center sm:text-left">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> •
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalReviews)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalReviews}</span>
        {isSearching && (
          <span className="ml-2 text-indigo-400 block sm:inline mt-1 sm:mt-0">
            (Search results)
          </span>
        )}
        {downloading && (
          <span className="ml-2 text-yellow-400">
            (Downloading: {downloadProgress.current}/{downloadProgress.total})
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsLeft size={18} />
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronLeft size={18} />
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <button key={index} onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
            className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
                pageNum === '...' ? 'text-gray-400 cursor-default' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`} disabled={pageNum === '...'}>
            {pageNum}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronRight size={18} />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 text-gray-200 max-w-full overflow-x-hidden mt-8 lg:mt-0 md:mt-0">
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-xl sm:text-xl md:text-xl lg:text-xl font-bold">Manage Google Reviews</h4>
          <p className="text-gray-400 mt-1 text-xs">
            View, track and manage all Google review profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline mt-1 sm:mt-0">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {/* Status Filter Dropdown */}
          {/* <select 
            value={reviewsStatus} 
            onChange={(e) => {
              const newStatus = e.target.value;
              setReviewsStatus(newStatus);
              setCurrentPage(1);
              fetchReviews(1, searchQuery, newStatus);
            }}
            className="px-3 py-2.5 bg-gray-800/50 rounded-lg text-gray-200 border border-gray-700/50 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer text-sm"
          >
            <option value="all">📋 All Reviews</option>
            <option value="active">✅ Active</option>
            <option value="inactive">⏸️ Inactive</option>
          </select> */}

          {/* Bulk Download Button */}
          <button
            onClick={downloadBulkReviews}
            disabled={downloading || reviews.length === 0}
            className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-sm sm:text-base ${downloading || reviews.length === 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
              }`}
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{downloadProgress.current}/{downloadProgress.total}</span>
              </>
            ) : (
              <>
                <FiDownloadCloud size={16} />
                <span>Download Cards ({reviews.length})</span>
              </>
            )}
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-56">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by owner name or code..."
                className="bg-gray-900/60 backdrop-blur border-0 pl-9 pr-8 py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-gray-400" size={14} />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Date Picker */}
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-900/60 backdrop-blur border-0 pl-3 pr-8 py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          {/* Create Button */}
          <Link
            to="/api/google-reviews/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-xs w-full sm:w-auto"
          >
            <FiPlus className="text-base transition-transform duration-300 group-hover:rotate-180" />
            <span>Create Reviews</span>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Reviews</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-lg">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Activated</p>
              <p className="text-2xl font-bold text-green-400">{stats.activated}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Inactive</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-400 text-lg">⏸</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block lg:hidden">
        {filteredGroupedReviews.length > 0 ? (
          filteredGroupedReviews.map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="font-medium text-gray-300 text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
                    <span className="text-xs bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-300">
                      {list.length}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadBulkReviews()}
                    disabled={downloading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium w-full sm:w-auto justify-center ${downloading
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      }`}
                  >
                    {downloading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <FiDownloadCloud size={12} />
                        <span>Download All ({list.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {list.map((review) => (
                  <div key={review._id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge active={review.isActivated} />
                          <span className="text-xs text-gray-400">✓ {review.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
                        </div>
                        <p className="text-sm font-medium text-white truncate">{review.owner?.name || review.profile?.brandName || "—"}</p>
                        <p className="text-xs text-indigo-400 font-mono mt-1 break-all">{review.activationCode}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-700/50">
                      <button onClick={() => downloadReviewCard(review)} disabled={!review.qrUrl}
                        className="flex-1 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-xs flex items-center justify-center gap-1 hover:from-cyan-600 hover:to-blue-600 transition-all">
                        <FaDownload size={12} /> Download
                      </button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/profile/google-review/public${review.slug}`} target="_blank"
                        className="flex-1 py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-xs flex items-center justify-center gap-1 hover:bg-indigo-500/30 transition-all">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center bg-gray-800/30 rounded-xl">
            <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400 text-sm">No google reviews available</p>
          </div>
        )}

        {totalPages > 1 && <Pagination />}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Activation Code</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedReviews.length > 0 ? (
                filteredGroupedReviews.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="7" className="p-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="text-xs bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-1 rounded-full text-gray-300">
                              {list.length} reviews
                            </span>
                          </div>
                          <button
                            onClick={downloadBulkReviews}
                            disabled={downloading}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${downloading
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'
                              }`}
                          >
                            {downloading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <FiDownloadCloud size={14} />
                                <span>Download All ({list.length})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {list.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={review.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={review.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className="text-sm truncate block max-w-[150px]" title={review.owner?.name || review.profile?.brandName}>
                            {review.owner?.name || review.profile?.brandName || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-sm text-indigo-400 truncate max-w-[120px]" title={review.activationCode}>
                            {review.activationCode}
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 text-sm whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => downloadReviewCard(review)}
                            disabled={!review.qrUrl}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-1.5 rounded-lg cursor-pointer text-white transition-all"
                          >
                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            to={`${import.meta.env.VITE_DOMAIN}/profile/google-review/public/${review.slug}`}
                            className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline"
                            target="_blank"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    <div className="text-gray-400">
                      <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-sm">No google reviews available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
};

export default ManageGoogleReviews;
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiDownloadCloud,
  FiEye,
  FiPlus
} from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import ParkingTagDesign from "./ManageParkingTag/ParkingTagDesign";
import ParkingTagPreviewModal from "./ManageParkingTag/PreviewParkingTag";
import JSZip from 'jszip';
import { selectAdminToken } from "../store/slices/authSlice";
import { useSelector } from "react-redux";

const ManageParkingTag = () => {
  const token = useSelector(selectAdminToken);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    inactive: 0,
  });
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [limit] = useState(100);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const tagRef = useRef();

  // Fetch cards 
  const fetchCards = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setIsSearching(!!search);

      const url = `${import.meta.env.VITE_BASE_URL}/api/all/tags?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

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

      const allCards = res.data.allTags || [];
      setCards(allCards);
      setTotalCards(res.data.totalTags || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);

      const total = res.data.totalTags || 0;
      const activated = allCards.filter(card => card.isActivated).length;
      const inactive = allCards.length - activated;

      setStats({ total, activated, inactive });

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Unable to fetch cards");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCards(currentPage, searchQuery);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchCards(page, searchQuery);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCards(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchCards(1, "");
  };

  // ✅ SINGLE PARKING TAG DOWNLOAD
  const downloadParkingTag = async (card) => {
    try {
      setSelectedCard(card);

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
        <p class="text-white text-lg">Generating Parking Tag...</p>
        <p class="text-gray-400 text-sm">${card.activationCode}</p>
      `;
      document.body.appendChild(loadingDiv);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/parking-tags/${card._id}/download`,
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
        alert('Download failed: Empty response');
        return;
      }

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `parking-tag-${card.activationCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      // Mark as downloaded
      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setCards(prev =>
          prev.map(c =>
            c._id === card._id ? { ...c, isDownloaded: true } : c
          )
        );
      } catch (err) {
        console.error('Failed to mark as downloaded:', err);
      }

    } catch (error) {
      console.error("Download Error:", error);
      const loadingDiv = document.querySelector('div[style*="fixed"]');
      if (loadingDiv && loadingDiv.parentNode) {
        document.body.removeChild(loadingDiv);
      }

      let errorMessage = 'Failed to download parking tag. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('adminToken');
      }
      alert(`❌ ${errorMessage}`);
    }
  };

  // ✅ BULK DOWNLOAD PARKING TAGS
  const downloadCurrentPageTags = async () => {
    if (cards.length === 0) {
      alert("No parking tags available on this page to download");
      return;
    }

    setDownloading(true);
    setDownloadProgress({ current: 0, total: cards.length });

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
      <p class="text-white text-xl font-semibold">Downloading ${cards.length} Parking Tags...</p>
      <p class="text-gray-400 text-sm">Page ${currentPage} of ${totalPages}</p>
      <div class="w-64 bg-gray-700 rounded-full h-2.5">
        <div id="progress-bar" class="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <p id="progress-text" class="text-gray-400 text-sm">0 / ${cards.length} tags</p>
      <p id="failed-text" class="text-red-400 text-sm hidden">Failed: 0</p>
    `;
    document.body.appendChild(loadingDiv);

    try {
      const failedCards = [];
      const successfulCards = [];
      const zip = new JSZip();

      const updateProgress = (current, total) => {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        if (progressBar) {
          const percentage = (current / total) * 100;
          progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
        if (progressText) {
          progressText.textContent = `${current} / ${total} tags`;
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

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        try {
          updateProgress(i, cards.length);

          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/parking-tags/${card._id}/download`,
            {
              responseType: 'blob',
              headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
              timeout: 60000
            }
          );

          if (response.data && response.data.size > 0) {
            const fileName = `parking-tag-${card.activationCode}.png`;
            zip.file(fileName, response.data);
            successfulCards.push(card);

            axios.patch(
              `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
              {},
              { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
            ).catch(err => console.error('Failed to mark as downloaded:', err));
          } else {
            failedCards.push(card);
            updateFailed(failedCards.length);
          }
        } catch (error) {
          console.error(`Failed to download tag ${card.activationCode}:`, error);
          failedCards.push(card);
          updateFailed(failedCards.length);
        }
      }

      updateProgress(cards.length, cards.length);

      if (successfulCards.length === 0) {
        throw new Error('No parking tags could be downloaded. Please try again.');
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
      link.download = `brilson-parking-tags-page-${currentPage}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setCards(prev =>
        prev.map(c => {
          if (successfulCards.find(sc => sc._id === c._id)) {
            return { ...c, isDownloaded: true };
          }
          return c;
        })
      );

      if (failedCards.length > 0) {
        alert(`✅ Download Complete with some issues!\n\n📦 Successful: ${successfulCards.length}\n❌ Failed: ${failedCards.length}\n\nFailed tags:\n${failedCards.map(c => c.activationCode).join('\n')}\n\nPlease check the downloaded ZIP.`);
      } else {
        alert(`✅ Download Complete!\n\n📦 All ${successfulCards.length} parking tags downloaded successfully!`);
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
        errorMessage = 'Request timed out. The server is taking too long to respond.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('adminToken');
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setDownloading(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  const previewTag = (card) => {
    setSelectedCard(card);
    setPreviewOpen(true);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pageNumbers;
  };

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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${active ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
      }`}>
      {active ? "Active" : "Inactive"}
    </span>
  );

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
      <div className="text-xs sm:text-sm text-gray-400">
        Page {currentPage} of {totalPages} • Showing {(currentPage - 1) * limit + 1} to{" "}
        {Math.min(currentPage * limit, totalCards)} of {totalCards}
        {isSearching && <span className="ml-2 text-indigo-400">(Search results)</span>}
        {downloading && (
          <span className="ml-2 text-yellow-400">
            (Downloading: {downloadProgress.current}/{downloadProgress.total})
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsLeft size={16} />
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronLeft size={16} />
        </button>
        {getPageNumbers().map((pageNum, index) => (
          <button key={index} onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
            className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
                pageNum === '...' ? 'text-gray-400 cursor-default' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`} disabled={pageNum === '...'}>
            {pageNum}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronRight size={16} />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-2 py-4 text-gray-200 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6 lg:mt-0 mt-11">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-xl font-bold">Manage Parking Tags</h4>
          <p className="text-gray-400 mt-1 text-xs">
            View, track and manage all parking tag profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {/* Bulk Download Button */}
          <button
            onClick={downloadCurrentPageTags}
            disabled={downloading || cards.length === 0}
            className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-sm sm:text-base ${downloading || cards.length === 0
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
                <span>Download Tags ({cards.length})</span>
              </>
            )}
          </button>

          <form onSubmit={handleSearch} className="relative w-full sm:w-56">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>
          <Link
            to="/api/tags/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 hover:shadow-lg text-xs w-full sm:w-auto"
          >
            <FiPlus className="text-sm sm:text-base transition-transform duration-300 group-hover:rotate-180" />
            <span>Create Cards</span>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Total Tags</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-lg">🏷️</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Activated</p><p className="text-2xl font-bold text-green-400">{stats.activated}</p></div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-lg">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Inactive</p><p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p></div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-400 text-lg">⏸</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-800/50 border-b border-gray-700/50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300">Activation</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300">Preview</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {cards.length > 0 ? (
              cards.map((card) => (
                <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="p-3">
                    <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                  </td>
                  <td className="p-3"><StatusBadge active={card.isActivated} /></td>
                  <td className="p-3">
                    <span className="text-sm truncate block max-w-[150px]" title={card.owner?.name}>
                      {card.owner?.name || "—"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-sm text-indigo-400 truncate max-w-[100px]" title={card.activationCode}>
                      {card.activationCode}
                    </div>
                  </td>
                  <td className="p-3 text-gray-400 text-sm whitespace-nowrap">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => previewTag(card)}
                      disabled={!card.qrUrl}
                      className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
                      title="Preview Tag"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => downloadParkingTag(card)}
                      disabled={!card.qrUrl}
                      className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all"
                      title="Download Parking Tag"
                    >
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`${import.meta.env.VITE_DOMAIN}/profile/P/public/${card.slug}`}
                      className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center">
                  <div className="text-gray-400">
                    <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p className="text-sm">No parking tags available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && <Pagination />}

      {/* Hidden download tag element */}
      <div className="fixed -left-[99999px] -top-[99999px]">
        <div id="download-tag">
          {selectedCard && (
            <ParkingTagDesign
              ref={tagRef}
              activationCode={selectedCard.activationCode}
            />
          )}
        </div>
      </div>

      <ParkingTagPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        card={selectedCard}
      />
    </div>
  );
};

export default ManageParkingTag;
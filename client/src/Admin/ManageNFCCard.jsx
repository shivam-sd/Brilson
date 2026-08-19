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
} from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import {toast, Toaster} from "react-hot-toast";
import { HexColorPicker } from "react-colorful";
import NFCCardDesign from "./ManageNFCCard/NFCCardDesign";
import CardPreviewModal from "./ManageNFCCard/CardPreviewModel";
import JSZip from 'jszip'; // Install: npm install jszip

const ManageNFCCard = () => {
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

  const [showColorPicker, setShowColorPicker] = useState(false);

  const [cardBgColor, setCardBgColor] = useState("#ffffff");
  const [cardTextColor, setCardTextColor] = useState("#000000");
  const [qrDotsColor, setQrDotsColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [limit] = useState(100);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [copyLinkId, setCopyLinkId] = useState(null);
  const cardRef = useRef();

  //  Fetch cards
  const fetchCards = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setIsSearching(!!search);

      const baseUrl = import.meta.env.VITE_BASE_URL || '';
      const url = `${baseUrl}/api/all/cards?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login again");
        setLoading(false);
        return;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });

      const allCards = res.data.allCards || [];
      // console.log("Fetched Cards:", allCards);
      setCards(allCards);
      setTotalCards(res.data.totalCards || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);

      const total = res.data.totalCards || 0;
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

  //  SINGLE CARD DOWNLOAD - Works perfectly
  const downloadCard = async (card) => {
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
        <p class="text-white text-lg">Generating Card...</p>
        <p class="text-gray-400 text-sm">${card.activationCode}</p>
      `;
      document.body.appendChild(loadingDiv);

      const params = new URLSearchParams({
        cardBgColor, cardTextColor, qrDotsColor, qrBgColor
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/download?${params.toString()}`,
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
      link.download = `brilson-card-${card.activationCode}.png`;
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
      
      let errorMessage = 'Failed to download card. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('adminToken');
      }
      alert(`❌ ${errorMessage}`);
    }
  };

  // ✅ FIXED: BULK DOWNLOAD - Using the same approach as single download
  const downloadCurrentPageCards = async () => {
    if (cards.length === 0) {
      alert("No cards available on this page to download");
      return;
    }

    setDownloading(true);
    setDownloadProgress({ current: 0, total: cards.length });

    // Show loading with progress
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
      <p class="text-white text-xl font-semibold">Downloading ${cards.length} NFC Cards...</p>
      <p class="text-gray-400 text-sm">Page ${currentPage} of ${totalPages}</p>
      <div class="w-64 bg-gray-700 rounded-full h-2.5">
        <div id="progress-bar" class="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <p id="progress-text" class="text-gray-400 text-sm">0 / ${cards.length} cards</p>
      <p id="failed-text" class="text-red-400 text-sm hidden">Failed: 0</p>
    `;
    document.body.appendChild(loadingDiv);

    try {
      const failedCards = [];
      const successfulCards = [];
      const zip = new JSZip();
      
      // Update progress function
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

      // Show failed count
      const updateFailed = (count) => {
        const failedText = document.getElementById('failed-text');
        if (failedText) {
          failedText.classList.remove('hidden');
          failedText.textContent = `Failed: ${count}`;
        }
      };

      // Download each card one by one with the same method as single download
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        try {
          updateProgress(i, cards.length);

          const params = new URLSearchParams({
            cardBgColor, cardTextColor, qrDotsColor, qrBgColor
          });

          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/download?${params.toString()}`,
            {
              responseType: 'blob',
              headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
              timeout: 60000
            }
          );

          if (response.data && response.data.size > 0) {
            // Add to zip
            const fileName = `brilson-card-${card.activationCode}.png`;
            zip.file(fileName, response.data);
            successfulCards.push(card);
            
            // Mark as downloaded (async, don't wait)
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
          console.error(`Failed to download card ${card.activationCode}:`, error);
          failedCards.push(card);
          updateFailed(failedCards.length);
        }
      }

      // Final progress update
      updateProgress(cards.length, cards.length);

      // Check if we have any successful downloads
      if (successfulCards.length === 0) {
        throw new Error('No cards could be downloaded. Please try again.');
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Remove loading
      const loader = document.getElementById('bulk-download-loader');
      if (loader && loader.parentNode) {
        document.body.removeChild(loader);
      }

      // Download ZIP
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brilson-cards-page-${currentPage}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup URL
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      // Update UI - mark successful cards as downloaded
      setCards(prev =>
        prev.map(c => {
          if (successfulCards.find(sc => sc._id === c._id)) {
            return { ...c, isDownloaded: true };
          }
          return c;
        })
      );

      // Show success/failure message
      if (failedCards.length > 0) {
        alert(`✅ Download Complete with some issues!\n\n📦 Successful: ${successfulCards.length}\n❌ Failed: ${failedCards.length}\n\nFailed cards:\n${failedCards.map(c => c.activationCode).join('\n')}\n\nPlease check the downloaded ZIP.`);
      } else {
        alert(`✅ Download Complete!\n\n📦 All ${successfulCards.length} cards downloaded successfully!`);
      }

    } catch (error) {
      console.error("Bulk download error:", error);
      
      // Remove loading
      const loader = document.getElementById('bulk-download-loader');
      if (loader && loader.parentNode) {
        document.body.removeChild(loader);
      }

      // Show detailed error
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

  const previewCard = (card) => {
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



  // handle Copy Profile Link

  const handleCopyLinkProfile = async (activationCode, card) => {
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const profilelink = `https://brilson.in/profile/${activationCode}`;
    setCopyLinkId(activationCode);
    
    // Copy to clipboard
    await navigator.clipboard.writeText(profilelink);
    
    // Then update copy count
    const { data } = await axios.patch(
      `${baseUrl}/api/cards/${card._id}/copy`
    );
    
    // Local UI update
    setCards(prev =>
      prev.map(item =>
        item._id === card._id
          ? { ...item, copyCount: data.copyCount }
          : item
      )
    );
    
    toast.success("URL copied successfully");
    
    setTimeout(() => {
      setCopyLinkId(null);
    }, 1000);
    
  } catch (err) {
    console.error("Copy error:", err);
    toast.error("Failed to copy profile link.", {
      position: "top-center",
      autoClose: 3000
    });
    setCopyLinkId(null);
  }
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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      active ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
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
            className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
              currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
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
      <Toaster position="top-center" reverseOrder={false} />
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6 lg:mt-0 mt-11">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-xl font-bold">Manage NFC Cards</h4>
          <p className="text-gray-400 mt-1 text-xs">
            View, track and manage all NFC card profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {/* Bulk Download Button - Current Page */}
          <button
            onClick={downloadCurrentPageCards}
            disabled={downloading || cards.length === 0}
            className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-sm sm:text-base ${
              downloading || cards.length === 0
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
                <span>Download Cards ({cards.length})</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
          >
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardBgColor }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardTextColor }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
            <span className="hidden xs:inline">Customize Card</span>
            <span className="xs:hidden">Colors</span>
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
        </div>
      </div>

      {/* COLOR PICKER MODAL */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Customize NFC Card</h3>
              <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Background Color</label>
                  <div className="flex flex-col gap-3">
                    <HexColorPicker color={cardBgColor} onChange={setCardBgColor} />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setCardBgColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-white rounded border border-gray-600"></div>White
                      </button>
                      <button onClick={() => setCardBgColor("#0a0a1a")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#0a0a1a] rounded"></div>Dark Blue
                      </button>
                      <button onClick={() => setCardBgColor("#1a1a2e")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#1a1a2e] rounded"></div>Navy
                      </button>
                      <button onClick={() => setCardBgColor("#0f0f23")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#0f0f23] rounded"></div>Deep Black
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Text Color</label>
                  <div className="flex flex-col gap-3">
                    <HexColorPicker color={cardTextColor} onChange={setCardTextColor} />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setCardTextColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-black rounded border border-gray-600"></div>Black
                      </button>
                      <button onClick={() => setCardTextColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-white rounded"></div>White
                      </button>
                      <button onClick={() => setCardTextColor("#E1C48A")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>Gold
                      </button>
                      <button onClick={() => setCardTextColor("#00ff00")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>Neon Green
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">QR Dots Color</label>
                  <div className="flex flex-col gap-3">
                    <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setQrDotsColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-black rounded border border-gray-600"></div>Black
                      </button>
                      <button onClick={() => setQrDotsColor("#E1C48A")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>Gold
                      </button>
                      <button onClick={() => setQrDotsColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-white rounded"></div>White
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">QR Background Color</label>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setQrBgColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded border border-gray-600"></div>White
                    </button>
                    <button onClick={() => setQrBgColor("transparent")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700">Transparent</button>
                    <button onClick={() => setQrBgColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded"></div>Black
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 text-center mb-3">💳 Live Card Preview</p>
                <div className="flex justify-center">
                  <div 
                    className="relative w-full max-w-[360px] rounded-2xl overflow-hidden"
                    style={{ 
                      background: cardBgColor,
                      border: `2px solid ${cardTextColor === "#ffffff" ? "#333" : cardTextColor}`,
                      boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                      aspectRatio: "1.6/1"
                    }}
                  >
                    <div className="p-5 relative w-full h-full flex">
                      <div className="flex-1 flex flex-col items-start justify-center gap-1">
                        <div className="flex flex-col items-center gap-0.5 mb-1">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" 
                            stroke={cardTextColor === "#ffffff" ? "#333" : cardTextColor} 
                            strokeWidth="2"
                          >
                            <path d="M5 12.5a8 8 0 0 1 14 0"/>
                            <path d="M8 16a4 4 0 0 1 8 0"/>
                            <circle cx="12" cy="20" r="1.5" fill={cardTextColor === "#ffffff" ? "#333" : cardTextColor}/>
                          </svg>
                          <span className="font-bold text-lg leading-none" style={{ 
                            color: cardTextColor === "#ffffff" ? "#333" : cardTextColor 
                          }}>NFC</span>
                        </div>
                        <h2 className="font-bold text-3xl leading-tight" style={{ 
                          color: cardTextColor === "#ffffff" ? "#1a1a2e" : cardTextColor 
                        }}>Brilson</h2>
                        <p className="text-xs leading-none" style={{ 
                          color: cardTextColor === "#ffffff" ? "#666" : cardTextColor 
                        }}>www.brilson.in</p>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-28 h-28 rounded-lg flex items-center justify-center" 
                          style={{ 
                            border: `2px solid ${cardTextColor === "#ffffff" ? "#333" : cardTextColor}`,
                            background: qrBgColor === "transparent" ? "transparent" : qrBgColor
                          }}
                        >
                          <div className="w-24 h-24">
                            <svg viewBox="0 0 100 100">
                              <rect x="20" y="20" width="8" height="8" fill={qrDotsColor} />
                              <rect x="32" y="20" width="8" height="8" fill={qrDotsColor} />
                              <rect x="44" y="20" width="8" height="8" fill={qrDotsColor} />
                              <rect x="20" y="32" width="8" height="8" fill={qrDotsColor} />
                              <rect x="44" y="32" width="8" height="8" fill={qrDotsColor} />
                              <rect x="20" y="44" width="8" height="8" fill={qrDotsColor} />
                              <rect x="32" y="44" width="8" height="8" fill={qrDotsColor} />
                              <rect x="44" y="44" width="8" height="8" fill={qrDotsColor} />
                            </svg>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] uppercase tracking-wider leading-none mb-1" style={{ 
                            color: cardTextColor === "#ffffff" ? "#666" : cardTextColor 
                          }}>Activation Key</p>
                          <div className="font-mono font-bold text-xs px-2 py-0.5 rounded border inline-block" 
                            style={{ 
                              color: cardTextColor,
                              borderColor: cardTextColor === "#ffffff" ? "#333" : cardTextColor,
                              background: cardBgColor === "#ffffff" ? "#f5f5f5" : "rgba(255,255,255,0.05)"
                            }}
                          >
                            K3Y-A1B2-C3D4-E5F6
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowColorPicker(false)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">Close</button>
              <button onClick={() => setShowColorPicker(false)} className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-white transition-colors cursor-pointer">Apply Colors</button>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Total Cards</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-lg">📋</span>
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
              <th className="p-3 text-center text-xs font-medium text-gray-300">Link</th>
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
                      onClick={() => previewCard(card)}
                      disabled={!card.qrUrl}
                      className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
                      title="Preview Card"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => downloadCard(card)}
                      disabled={!card.qrUrl}
                      className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all"
                      title="Download Card"
                    >
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                      className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>

                  <td className="p-3 text-center">
  <div className="flex items-center justify-center gap-2">
    {/* Copy Button with Icon */}
    <button
      onClick={() => handleCopyLinkProfile(card?.activationCode || card?.slug, card)}
      className={`
        group relative flex items-center flex-col gap-2 px-3 py-1.5 rounded-lg
        transition-all duration-300 ease-in-out cursor-pointer font-Roboto
        ${copyLinkId === card?.activationCode 
          ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' 
          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
        }
        ${card?.indicater === "green" ? 'hover:ring-1 hover:ring-green-500/30' : ''}
        ${card?.indicater === "yellow" ? 'hover:ring-1 hover:ring-yellow-500/30' : ''}
        ${card?.indicater === "red" ? 'hover:ring-1 hover:ring-red-500/30' : ''}
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        `}
        disabled={!card?.activationCode}
        title="Copy profile link"
        >
      <div className="flex items-center gap-2">
      {/* Icon */}
      <svg 
        className={`w-3.5 h-3.5 transition-transform duration-300 ${
          copyLinkId === card?.activationCode ? 'scale-110' : 'group-hover:scale-110'
        }`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {copyLinkId === card?.activationCode ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        )}
      </svg>

      {/* Text */}
      <span className="text-xs font-medium">
        {copyLinkId === card?.activationCode ? '✅' : 'Copy'}
      </span>

      {/* Counter Badge */}
      <span className={`
        ml-0.5 px-2 py-0.5 rounded-full text-xs font-bold
        transition-all duration-300
        ${card?.indicater === "green" 
          ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30' 
          : ''
        }
        ${card?.indicater === "yellow" 
          ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30' 
          : ''
        }
        ${card?.indicater === "red" 
          ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' 
          : ''
        }
        ${!card?.indicater 
          ? 'bg-gray-700/50 text-gray-400 ring-1 ring-gray-600/30' 
          : ''
        }
        ${copyLinkId === card?.activationCode ? 'animate-pulse' : ''}
      `}>
        {card?.copyCount || 0}
      </span>

      {/* Tooltip on hover */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-gray-700">
          Click to copy profile link
        </div>
      </div>

      </div>
      <span className="text-[10px]">{ new Date(card?.lastCopiedAt).toLocaleString()}</span>
    </button>
  </div>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center">
                  <div className="text-gray-400">
                    <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p className="text-sm">No cards available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && <Pagination />}

      {/* Hidden download card element */}
      <div className="fixed -left-[99999px] -top-[99999px]">
        <div id="download-card">
          {selectedCard && (
            <NFCCardDesign
              ref={cardRef}
              activationCode={selectedCard.activationCode}
              profileSlug={selectedCard.slug}
              profileName={selectedCard.owner?.name || selectedCard.profile?.name || "Card Owner"}
              cardBgColor={cardBgColor}
              cardTextColor={cardTextColor}
              qrDotsColor={qrDotsColor}
              qrBgColor={qrBgColor}
            />
          )}
        </div>
      </div>

      <CardPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        card={selectedCard}
        cardBgColor={cardBgColor}
        cardTextColor={cardTextColor}
        qrDotsColor={qrDotsColor}
        qrBgColor={qrBgColor}
      />
    </div>
  );
};

export default ManageNFCCard;
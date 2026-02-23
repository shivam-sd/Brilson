import React, { useEffect, useState } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip"; 

/*   QR image par text add karne ke liye  */
const addTextToQRImage = async (qrCode, activationCode, profileName) => {
  try {
    // QR code ko blob mein convert karo
    const blob = await qrCode.getRawData("png");
    
    // Image create karo
    const img = new Image();
    const imageUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Canvas banayein (QR + text ke liye extra space)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // QR size 300px, text ke liye 80px extra
        const qrSize = 300;
        const textHeight = 80;
        canvas.width = qrSize;
        canvas.height = qrSize + textHeight;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // QR code draw karo
        ctx.drawImage(img, 0, 0, qrSize, qrSize);
        
        // Border line between QR and text
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, qrSize + 5);
        ctx.lineTo(canvas.width - 20, qrSize + 5);
        ctx.stroke();
        
        // Activation Code text
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(`Code: ${activationCode}`, canvas.width / 2, qrSize + 35);
        
        // Profile name (agar available ho)
        if (profileName && profileName !== '—' && profileName !== 'No Name') {
          ctx.font = '14px Arial, sans-serif';
          ctx.fillStyle = '#666666';
          ctx.fillText(profileName, canvas.width / 2, qrSize + 60);
        }
        
        // Canvas ko blob mein convert karo
        canvas.toBlob((newBlob) => {
          const finalUrl = URL.createObjectURL(newBlob);
          resolve(finalUrl);
        }, 'image/png');
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error adding text to QR:", error);
    // Fallback - bina text ke QR
    const blob = await qrCode.getRawData("png");
    return URL.createObjectURL(blob);
  }
};

/*  QR with Activation Code  */
const createQR = (url, activationCode) => {
  // QR data mein activation code bhi add karo
  const qrData = `${url}\nActivation Code: ${activationCode}`;
  
  return new QRCodeStyling({ 
    width: 300,
    height: 300,
    data: qrData,
    type: "png",
    dotsOptions: {
      color: "#000000",
      type: "dots",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    cornersDotOptions: {
      type: "dot",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.2
    },
    image: "/B.png",
  });
};

const ManageCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    inactive: 0
  });
  const [qrImages, setQrImages] = useState({});
  const [downloadingDate, setDownloadingDate] = useState(null); // NEW: Track which date is downloading
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [limit] = useState(40);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /*  FETCH WITH PAGINATION & SEARCH  */
  const fetchCards = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setIsSearching(!!search);
      
      const url = `${import.meta.env.VITE_BASE_URL}/api/all/cards?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      
      const allCards = res.data.allCards || [];
      setCards(allCards);
      
      setTotalCards(res.data.totalCards || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
      
      const total = res.data.totalCards || 0;
      const activated = allCards.filter(card => card.isActivated).length;
      const inactive = allCards.length - activated;
      
      setStats({ total, activated, inactive });
      
      // Generate QR images for all cards with activation code AND text overlay
      const qrPromises = allCards.map(async (card) => {
        if (card.qrUrl) {
          try {
            const qr = createQR(card.qrUrl, card.activationCode);
            // Add text overlay to QR image
            const finalImageUrl = await addTextToQRImage(
              qr, 
              card.activationCode, 
              card.owner?.name || card.profile?.name || ''
            );
            return { cardId: card._id, imageUrl: finalImageUrl };
          } catch (err) {
            console.error(`Error generating QR for ${card.cardId}:`, err);
            return { cardId: card._id, imageUrl: null };
          }
        }
        return { cardId: card._id, imageUrl: null };
      });

      const qrResults = await Promise.all(qrPromises);
      const qrMap = {};
      qrResults.forEach(result => {
        qrMap[result.cardId] = result.imageUrl;
      });
      setQrImages(qrMap);

    } catch (err) {
      console.error(err);
      setError("Unable to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCards(currentPage, searchQuery);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchCards(page, searchQuery);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCards(1, searchQuery);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchCards(1, "");
  };

  // Generate page numbers
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

  /*  GROUP BY DATE  */
  const groupedCards = cards.reduce((acc, card) => {
    const date = new Date(card.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(card);
    return acc;
  }, {});

  const filteredGroupedCards = Object.entries(groupedCards).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

  /*  PREVIEW - ab image ke ANDAR activation code dikhega  */
  const previewQR = async (card) => {
    if (!card.qrUrl) {
      alert("No QR URL available for this card");
      return;
    }
    // Create QR with activation code
    const qr = createQR(card.qrUrl, card.activationCode);
    const blob = await qr.getRawData("png");
    const imgUrl = URL.createObjectURL(blob);

    const win = window.open("", "_blank", "width=500,height=550");
    win.document.write(`
      <body style="margin:0;background:#0b1220;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:Arial,sans-serif;padding:20px;">
        <div style="background:#fff;padding:20px;border-radius:16px;margin-bottom:20px;">
          <img src="${imgUrl}" style="width:300px;height:300px;" />
        </div>
        <div style="background:#1a1a2e;padding:15px 30px;border-radius:8px;border:1px solid #333;">
          <p style="color:#888;font-size:14px;margin:0 0 5px 0;">Activation Code</p>
          <p style="color:#00ff00;font-size:24px;font-weight:bold;margin:0;letter-spacing:2px;">${card.activationCode}</p>
        </div>
      </body>
    `);
  };

  /*  DOWNLOAD SINGLE CARD  */
  const downloadQR = async (card) => {
    if (!card.qrUrl) {
      alert("No QR URL available for download");
      return;
    }
    
    try {
      // Create QR with activation code
      const qr = createQR(card.qrUrl, card.activationCode);
      
      // Add text overlay to QR image
      const finalImageUrl = await addTextToQRImage(
        qr, 
        card.activationCode, 
        card.owner?.name || card.profile?.name || 'No Name'
      );
      
      // Download the final image
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `card-${card.activationCode}-${(card.owner?.name || card.profile?.name || 'unknown').replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(finalImageUrl);

      // Update downloaded status
      if (!card.isDownloaded) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            }
          );

          setCards((prev) =>
            prev.map((c) =>
              c._id === card._id ? { ...c, isDownloaded: true } : c
            )
          );
        } catch (error) {
          console.error("Error marking as downloaded:", error);
        }
      }
    } catch (error) {
      console.error("Error downloading QR:", error);
      alert("Error downloading QR code. Please try again.");
    }
  };

  /*  NEW: BULK DOWNLOAD ALL CARDS OF A SPECIFIC DATE  */
  const downloadAllByDate = async (date, cardsList) => {
    if (!cardsList || cardsList.length === 0) {
      alert("No cards available for this date");
      return;
    }

    // Filter cards that have qrUrl
    const validCards = cardsList.filter(card => card.qrUrl);
    
    if (validCards.length === 0) {
      alert("No cards with QR available for this date");
      return;
    }

    setDownloadingDate(date); // Show loading state

    try {
      // Create a new ZIP file
      const zip = new JSZip();
      const folderName = `cards-${date}`;
      const folder = zip.folder(folderName);

      // Show progress message
      alert(`Downloading ${validCards.length} cards. Please wait...`);

      // Process all cards in parallel with a limit to avoid overwhelming the browser
      const chunkSize = 5; // Process 5 cards at a time
      const results = [];

      for (let i = 0; i < validCards.length; i += chunkSize) {
        const chunk = validCards.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async (card) => {
          try {
            // Generate QR for this card
            const qr = createQR(card.qrUrl, card.activationCode);
            
            // Add text overlay
            const finalImageUrl = await addTextToQRImage(
              qr, 
              card.activationCode, 
              card.owner?.name || card.profile?.name || 'No Name'
            );

            // Fetch the image as blob
            const response = await fetch(finalImageUrl);
            const blob = await response.blob();

            // Create filename
            const filename = `card-${card.activationCode}-${(card.owner?.name || card.profile?.name || 'unknown').replace(/\s+/g, '-')}.png`;

            // Add to ZIP
            folder.file(filename, blob, { binary: true });

            // Cleanup
            URL.revokeObjectURL(finalImageUrl);

            return { success: true, card };
          } catch (error) {
            console.error(`Error processing card ${card.activationCode}:`, error);
            return { success: false, card };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      }

      // Generate ZIP and trigger download
      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipContent);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `all-cards-${date}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(zipUrl);

      // Count successful downloads
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      alert(`Download complete!\nSuccessful: ${successful}\nFailed: ${failed}`);

    } catch (error) {
      console.error("Error in bulk download:", error);
      alert("Error downloading cards. Please try again.");
    } finally {
      setDownloadingDate(null);
    }
  };

  /*  LOADING  */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="h-12 w-12 animate-spin border-t-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  /*  ERROR  */
  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <FiAlertCircle className="text-4xl mx-auto mb-3" />
        {error}
      </div>
    );
  }

  /*  STATUS BADGE  */
  const StatusBadge = ({ active }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        active
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );

  /*  PAGINATION COMPONENT  */
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
      <div className="text-sm text-gray-400">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> • 
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalCards)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalCards}</span> cards
        {isSearching && (
          <span className="ml-2 text-indigo-400">
            (Search results)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
        >
          <FiChevronsLeft size={18} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
        >
          <FiChevronLeft size={18} />
        </button>
        
        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
              currentPage === pageNum
                ? 'bg-indigo-500 text-white shadow-lg'
                : pageNum === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
            disabled={pageNum === '...'}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
        >
          <FiChevronRight size={18} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
        >
          <FiChevronsRight size={18} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Cards per page:</span>
        <span className="font-medium text-gray-300">{limit}</span>
      </div>
    </div>
  );

  /*  BAS YE NAYA BUTTON ADD HOGA DATE HEADER MEIN  */
  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 text-gray-200 max-w-[100vw] overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">Manage NFC Cards</h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            View, track and manage all NFC card profiles
            <span className="ml-2 text-indigo-400 font-medium">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-56">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by owner or activation code..."
                className="bg-gray-900/60 backdrop-blur border-0 pl-10 pr-10 py-3 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white border-b-2 border-transparent focus:border-indigo-400"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-gray-400" size={18} />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Sleek Date Picker */}
          <div className="relative w-full sm:w-56">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-900/60 backdrop-blur border-0 pl-4 pr-10 py-3 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white border-b-2 border-transparent focus:border-indigo-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Clear"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
              <div className="w-px h-4 bg-gray-700" />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          {/* Elegant Create Button */}
          <Link
            to="/api/cards/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto group"
          >
            <div className="relative">
              <FiPlus className="text-lg transition-transform duration-300 group-hover:rotate-180" />
            </div>
            <span className="font-medium">Create Cards</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Cards</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-base sm:text-lg">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Activated</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.activated}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-base sm:text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Inactive</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.inactive}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-400 text-base sm:text-lg">⏸</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">✓</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Owner</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Activation</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">QR</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Preview</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Download</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedCards.length > 0 ? (
                filteredGroupedCards.map(([date, list]) => (
                  <React.Fragment key={date}>
                    {/*  Date header with Download All button */}
                    <tr className="bg-gray-800/30">
                      <td colSpan="10" className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              {list.length} cards
                            </span>
                          </div>
                          
                          {/* Download All button for this date */}
                          <button
                            onClick={() => downloadAllByDate(date, list)}
                            disabled={downloadingDate === date}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              downloadingDate === date
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg cursor-pointer'
                            }`}
                          >
                            {downloadingDate === date ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <FiDownloadCloud size={16} />
                                <span>Download All ({list.length})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={card.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className={`text-xs ${card.owner?.name ? "text-gray-200" : "text-gray-500"}`}>
                            {card.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs text-indigo-400 max-w-[80px] truncate" title={card.activationCode}>
                            {card.activationCode}
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 text-xs">
                          {new Date(card.activatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <div className="w-12 h-12 bg-white p-1.5 rounded-lg flex items-center justify-center mx-auto">
                            {qrImages[card._id] ? (
                              <img
                                src={qrImages[card._id]}
                                alt="QR Code"
                                className="w-10 h-10"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/qr.png";
                                }}
                              />
                            ) : (
                              <img src="/qr.png" alt="Demo QR" className="w-10 h-10" />
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => previewQR(card)}
                            className={`text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 mx-auto ${
                              !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={card.qrUrl ? "Preview QR" : "No QR available"}
                            disabled={!card.qrUrl}
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => downloadQR(card)}
                            className={`bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition mx-auto ${
                              !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={card.qrUrl ? "Download QR" : "No QR available"}
                            disabled={!card.qrUrl}
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <Link 
                            to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                            className="text-indigo-400 hover:text-indigo-300 transition text-xs inline-block"
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
                  <td colSpan="10" className="p-6 text-center">
                    <div className="text-gray-400">
                      {searchQuery ? (
                        <>
                          <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No cards found for "{searchQuery}"</p>
                          <p className="text-sm mt-2">Try a different search term</p>
                          <button
                            onClick={handleClearSearch}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Clear search and show all cards
                          </button>
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No cards available</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && <Pagination />}
      </div>

      {/* TABLET VIEW - SAME BUTTON ADDITION */}
      <div className="hidden md:block lg:hidden">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">✓</th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Status</th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Owner</th>
                <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Activation</th>
                <th className="p-2 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedCards.length > 0 ? (
                filteredGroupedCards.map(([date, list]) => (
                  <React.Fragment key={date}>
                    {/* UPDATED: Date header with Download All button */}
                    <tr className="bg-gray-800/30">
                      <td colSpan="6" className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              {list.length} cards
                            </span>
                          </div>
                          
                          {/* NEW: Download All button for this date */}
                          <button
                            onClick={() => downloadAllByDate(date, list)}
                            disabled={downloadingDate === date}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                              downloadingDate === date
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            }`}
                          >
                            {downloadingDate === date ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>...</span>
                              </>
                            ) : (
                              <>
                                <FiDownloadCloud size={12} />
                                <span>All ({list.length})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={card.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className={`text-xs ${card.owner?.name ? "text-gray-200" : "text-gray-500"}`}>
                            {card.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs text-indigo-400 truncate" title={card.activationCode}>
                            {card.activationCode}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mr-2">
                              {qrImages[card._id] ? (
                                <img
                                  src={qrImages[card._id]}
                                  alt="QR Code"
                                  className="w-8 h-8"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/qr.png";
                                  }}
                                />
                              ) : (
                                <img src="/qr.png" alt="Demo QR" className="w-8 h-8" />
                              )}
                            </div>
                            <button
                              onClick={() => previewQR(card)}
                              className={`text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 ${
                                !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title={card.qrUrl ? "Preview QR" : "No QR available"}
                              disabled={!card.qrUrl}
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadQR(card)}
                              className={`bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition ${
                                !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title={card.qrUrl ? "Download QR" : "No QR available"}
                              disabled={!card.qrUrl}
                            >
                              <FaDownload className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                              className="text-indigo-400 hover:text-indigo-300 transition text-xs px-2 py-1 border border-indigo-500/50 rounded"
                              target="_blank"
                            >
                              Profile
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    <div className="text-gray-400">
                      {searchQuery ? (
                        <>
                          <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No cards found for "{searchQuery}"</p>
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No cards available</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && <Pagination />}
      </div>

      {/* MOBILE VIEW - SAME BUTTON ADDITION */}
      <div className="block md:hidden">
        {filteredGroupedCards.length > 0 ? (
          filteredGroupedCards.map(([date, list]) => (
            <div key={date} className="mb-6">
              {/* UPDATED: Date header with Download All button */}
              <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                  </div>
                  
                  {/* NEW: Download All button for mobile */}
                  <button
                    onClick={() => downloadAllByDate(date, list)}
                    disabled={downloadingDate === date}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      downloadingDate === date
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    }`}
                  >
                    {downloadingDate === date ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>...</span>
                      </>
                    ) : (
                      <>
                        <FiDownloadCloud size={12} />
                        <span>All {list.length}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Table remains same */}
              <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
                <table className="min-w-[700px] w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-700/50">
                    <tr>
                      <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap min-w-[40px]">✓</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap min-w-[80px]">Status</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap min-w-[80px]">Owner</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap min-w-[100px]">Activation</th>
                      <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap min-w-[80px]">Created</th>
                      <th className="p-2 text-center text-xs font-medium text-gray-300 whitespace-nowrap min-w-[70px]">QR</th>
                      <th className="p-2 text-center text-xs font-medium text-gray-300 whitespace-nowrap min-w-[100px]">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700/30">
                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-2">
                          <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                        </td>
                        <td className="p-2">
                          <StatusBadge active={card.isActivated} />
                        </td>
                        <td className="p-2">
                          <span className={`text-xs ${card.owner?.name ? "text-gray-200" : "text-gray-500"}`}>
                            {card.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="font-mono text-xs text-indigo-400 truncate max-w-[90px]" title={card.activationCode}>
                            {card.activationCode}
                          </div>
                        </td>
                        <td className="p-2 text-gray-400 text-xs">
                          {new Date(card.activatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-center">
                          <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mx-auto">
                            {qrImages[card._id] ? (
                              <img
                                src={qrImages[card._id]}
                                alt="QR Code"
                                className="w-8 h-8"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/qr.png";
                                }}
                              />
                            ) : (
                              <img src="/qr.png" alt="Demo QR" className="w-8 h-8" />
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => previewQR(card)}
                                className={`flex-1 text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 min-w-[32px] ${
                                  !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={card.qrUrl ? "Preview QR" : "No QR available"}
                                disabled={!card.qrUrl}
                              >
                                <FaEye className="w-3.5 h-3.5 mx-auto" />
                              </button>
                              <button
                                onClick={() => downloadQR(card)}
                                className={`flex-1 bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition min-w-[32px] ${
                                  !card.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={card.qrUrl ? "Download QR" : "No QR available"}
                                disabled={!card.qrUrl}
                              >
                                <FaDownload className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </div>
                            {card.slug && (
                              <Link 
                                to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                                className="text-xs text-center text-indigo-400 hover:text-indigo-300 transition py-1 border border-indigo-500/50 rounded"
                                target="_blank"
                              >
                                Profile
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 animate-pulse">
                  ← Scroll horizontally to view all columns →
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400">
              {searchQuery ? (
                <>
                  <FiSearch className="w-16 h-16 mx-auto mb-3 text-gray-500" />
                  <p className="text-lg">No cards found for "{searchQuery}"</p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <FiAlertCircle className="w-16 h-16 mx-auto mb-3 text-gray-500" />
                  <p className="text-lg">No cards available</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
};

export default ManageCards;
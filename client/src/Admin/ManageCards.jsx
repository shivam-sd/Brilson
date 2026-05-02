import React, { useEffect, useState } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";
import { HexColorPicker } from "react-colorful";


/* SVG QR Code Generator  Higher Quality with Dotted Pattern */
const createHighQualityQR = (url, dotsColor = "#000000", bgColor = "transparent", size = 800) => {
  const qrData = `${url}`;
  
  return new QRCodeStyling({ 
    width: size,
    height: size,
    data: qrData,
    type: "svg",
    margin: 5,
    dotsOptions: {
      color: dotsColor,
      type: "dots",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    cornersDotOptions: {
      type: "dot",
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.2
    },
    image: "/B.png",
  });
};

/* Helper function to safely render PNG thumbnail */
const renderPNGThumbnail = (pngDataUrl, className = "w-10 h-10") => {
  if (!pngDataUrl || !pngDataUrl.startsWith('data:image/png') && !pngDataUrl.startsWith('blob:')) {
    return null;
  }
  
  return pngDataUrl;
};

/* High resolution PNG with proper text sizing */
const addTextToHighResPNG = async (qrCode, activationCode, profileName, textColor = "#000000", bgColor = "transparent") => {
  try {
    const blob = await qrCode.getRawData("png");
    const img = new Image();
    const imageUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const qrSize = 800;
        const textHeight = 100;
        canvas.width = qrSize;
        canvas.height = qrSize + textHeight;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        if (bgColor === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0, qrSize, qrSize);
        
        ctx.strokeStyle = textColor;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, qrSize + 15);
        ctx.lineTo(canvas.width - 80, qrSize + 15);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.font = 'bold 35px "Courier New", monospace';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(`Code: ${activationCode}`, canvas.width / 2, qrSize + 55);
        
        if (profileName && profileName !== '—' && profileName !== 'No Name' && profileName !== '') {
          let displayName = profileName;
          if (displayName.length > 30) {
            displayName = displayName.substring(0, 27) + '...';
          }
          ctx.font = '28px Arial, sans-serif';
          ctx.fillStyle = textColor;
          ctx.globalAlpha = 0.8;
          ctx.fillText(displayName, canvas.width / 2, qrSize + 90);
          ctx.globalAlpha = 1;
        }
        
        canvas.toBlob((newBlob) => {
          const finalUrl = URL.createObjectURL(newBlob);
          resolve(finalUrl);
        }, 'image/png', 1.0);
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error adding text to high-res PNG:", error);
    const blob = await qrCode.getRawData("png");
    return URL.createObjectURL(blob);
  }
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
  const [downloadingDate, setDownloadingDate] = useState(null);
  const [useSVG, setUseSVG] = useState(false);
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [qrBgColor, setQrBgColor] = useState("transparent");
  const [qrDotsColor, setQrDotsColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);
  const [limit] = useState(100);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
      
      await generateHighQualityQRCodes(allCards);
      
    } catch (err) {
      console.error(err);
      setError("Unable to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const generateHighQualityQRCodes = async (cardsList = cards) => {
    const qrPromises = cardsList.map(async (card) => {
      if (card.qrUrl) {
        try {
          const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 800);
          
          const finalImageUrl = await addTextToHighResPNG(
            qr, 
            card.activationCode, 
            card.owner?.name || card.profile?.name || '',
            textColor,
            qrBgColor
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
  };

  useEffect(() => {
    if (cards.length > 0) {
      generateHighQualityQRCodes();
    }
  }, [qrBgColor, qrDotsColor, textColor]);

  useEffect(() => {
    fetchCards(currentPage, searchQuery);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchCards(page, searchQuery);
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

  const groupedCards = cards.reduce((acc, card) => {
    const date = new Date(card.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(card);
    return acc;
  }, {});

  const filteredGroupedCards = Object.entries(groupedCards).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

  const previewQR = async (card) => {
    if (!card.qrUrl) {
      alert("No QR URL available for this card");
      return;
    }
    
    const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 600);
    const previewUrl = await addTextToHighResPNG(
      qr, 
      card.activationCode, 
      card.owner?.name || card.profile?.name || '',
      textColor,
      qrBgColor
    );

    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code Preview - ${card.activationCode}</title>
        <style>
          body {
            margin: 0;
            background: #0b1220;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            padding: 40px;
            min-height: 100vh;
          }
          .qr-container {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            margin-bottom: 30px;
          }
          .qr-container img {
            max-width: 600px;
            width: 100%;
            height: auto;
          }
          .info {
            background: #1a1a2e;
            padding: 20px 40px;
            border-radius: 12px;
            border: 1px solid #333;
            text-align: center;
          }
          .info p {
            color: #888;
            font-size: 14px;
            margin: 0 0 5px 0;
          }
          .info h2 {
            color: #00ff00;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 2px;
            font-family: monospace;
          }
          .quality-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 12px;
            color: #4ade80;
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <img src="${previewUrl}" alt="QR Code" />
        </div>
        <div class="info">
          <p>Activation Code</p>
          <h2>${card.activationCode}</h2>
        </div>
        <div class="quality-badge">
          📸 High Resolution PNG
        </div>
      </body>
      </html>
    `);
  };

  const downloadQR = async (card) => {
    if (!card.qrUrl) {
      alert("No QR URL available for download");
      return;
    }
    
    try {
      const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 1200);
      const finalImageUrl = await addTextToHighResPNG(
        qr, 
        card.activationCode, 
        card.owner?.name || card.profile?.name || '',
        textColor,
        qrBgColor
      );
      
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `card-${card.activationCode}-${(card.owner?.name || card.profile?.name || 'unknown').replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(finalImageUrl);

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

  const downloadAllByDate = async (date, cardsList) => {
    if (!cardsList || cardsList.length === 0) {
      alert("No cards available for this date");
      return;
    }

    const validCards = cardsList.filter(card => card.qrUrl);
    
    if (validCards.length === 0) {
      alert("No cards with QR available for this date");
      return;
    }

    setDownloadingDate(date);

    try {
      const zip = new JSZip();
      const folderName = `cards-${date}-highres`;
      const folder = zip.folder(folderName);

      alert(`Downloading ${validCards.length} high-quality cards. Please wait...`);

      const chunkSize = 3;
      const results = [];

      for (let i = 0; i < validCards.length; i += chunkSize) {
        const chunk = validCards.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async (card) => {
          try {
            const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 1200);
            const finalImageUrl = await addTextToHighResPNG(
              qr, 
              card.activationCode, 
              card.owner?.name || card.profile?.name || '',
              textColor,
              qrBgColor
            );
            
            const response = await fetch(finalImageUrl);
            const blob = await response.blob();
            const filename = `card-${card.activationCode}-${(card.owner?.name || card.profile?.name || 'unknown').replace(/\s+/g, '-')}.png`;
            folder.file(filename, blob);
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

      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipContent);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `all-cards-${date}-highres.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      alert(`Download complete!\n✅ Successful: ${successful}\n❌ Failed: ${failed}\n📐 Format: High Resolution PNG\n🔍 Perfect quality, no pixelation!`);

    } catch (error) {
      console.error("Error in bulk download:", error);
      alert("Error downloading cards. Please try again.");
    } finally {
      setDownloadingDate(null);
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

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
      <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> • 
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalCards)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalCards}</span>
        {isSearching && (
          <span className="ml-2 text-indigo-400 block sm:inline mt-1 sm:mt-0">
            (Search results)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsLeft size={16} />
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
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
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronRight size={16} />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsRight size={16} />
        </button>
      </div>
    </div>
  );

  const QRThumbnail = ({ cardId }) => {
    const imageData = qrImages[cardId];
    
    if (!imageData) {
      return <img src="/qr.png" alt="QR" className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
    
    return (
      <img
        src={imageData}
        alt="QR Code"
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/qr.png";
        }}
      />
    );
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 text-gray-200 max-w-full overflow-x-hidden">
      {/* HEADER - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Manage NFC Cards</h2>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm">
            View, track and manage all NFC card profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline mt-1 sm:mt-0">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {/* COLOR CUSTOMIZATION BUTTON */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
          >
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: qrBgColor === 'transparent' ? '#fff' : qrBgColor }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: textColor }}></div>
            <span className="hidden xs:inline">Customize</span>
            <span className="xs:hidden">Colors</span>
          </button>

          {/* SEARCH BAR */}
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
            to="/api/cards/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
          >
            <FiPlus className="text-base transition-transform duration-300 group-hover:rotate-180" />
            <span>Create Cards</span>
          </Link>
        </div>
      </div>

      {/* COLOR PICKER MODAL */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Customize QR Colors</h3>
              <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">QR Background Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={qrBgColor === 'transparent' ? '#ffffff' : qrBgColor} onChange={(color) => setQrBgColor(color)} />
                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
                    <button onClick={() => setQrBgColor("transparent")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700">
                      Transparent
                    </button>
                    <button onClick={() => setQrBgColor("#ffffff")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-600 rounded"></div>
                      White
                    </button>
                    <button onClick={() => setQrBgColor("#000000")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-black border border-gray-600 rounded"></div>
                      Black
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">QR Dots Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
                    <button onClick={() => setQrDotsColor("#000000")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded"></div>
                      Black
                    </button>
                    <button onClick={() => setQrDotsColor("#E1C48A")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>
                      Gold
                    </button>
                    <button onClick={() => setQrDotsColor("#3B82F6")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      Blue
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={textColor} onChange={setTextColor} />
                  <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
                    <button onClick={() => setTextColor("#000000")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded"></div>
                      Black
                    </button>
                    <button onClick={() => setTextColor("#E1C48A")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>
                      Gold
                    </button>
                    <button onClick={() => setTextColor("#ffffff")}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded"></div>
                      White
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 text-center mb-3">Live Preview</p>
                <div className="bg-gray-800 rounded-lg p-4 flex justify-center">
                  <div className="w-32 h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: qrBgColor === 'transparent' ? '#fff' : qrBgColor }}>
                    <div className="w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-20 h-20">
                        <rect x="20" y="20" width="10" height="10" fill={qrDotsColor} />
                        <rect x="35" y="20" width="10" height="10" fill={qrDotsColor} />
                        <rect x="50" y="20" width="10" height="10" fill={qrDotsColor} />
                        <rect x="20" y="35" width="10" height="10" fill={qrDotsColor} />
                        <rect x="50" y="35" width="10" height="10" fill={qrDotsColor} />
                        <rect x="20" y="50" width="10" height="10" fill={qrDotsColor} />
                        <rect x="35" y="50" width="10" height="10" fill={qrDotsColor} />
                        <rect x="50" y="50" width="10" height="10" fill={qrDotsColor} />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs mt-2" style={{ color: textColor }}>
                  Code: ABC123XYZ
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowColorPicker(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                Close
              </button>
              <button onClick={() => setShowColorPicker(false)}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-white transition-colors cursor-pointer">
                Apply Colors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Cards</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-lg">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
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

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
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

      {/* MOBILE VIEW - Optimized for small screens */}
      <div className="block lg:hidden">
        {filteredGroupedCards.length > 0 ? (
          filteredGroupedCards.map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="font-medium text-gray-300 text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
                      {list.length}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadAllByDate(date, list)}
                    disabled={downloadingDate === date}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium w-full sm:w-auto justify-center ${
                      downloadingDate === date
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    }`}
                  >
                    {downloadingDate === date ? (
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
                {list.map((card) => (
                  <div key={card._id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge active={card.isActivated} />
                          <span className="text-xs text-gray-400">✓ {card.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
                        </div>
                        <p className="text-sm font-medium text-white truncate">{card.owner?.name || "—"}</p>
                        <p className="text-xs text-indigo-400 font-mono mt-1 break-all">{card.activationCode}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-white p-1.5 rounded-lg shadow-md overflow-hidden">
                          <QRThumbnail cardId={card._id} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-700/50">
                      <button onClick={() => previewQR(card)} disabled={!card.qrUrl}
                        className="flex-1 py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-center gap-1">
                        <FaEye size={12} /> Preview
                      </button>
                      <button onClick={() => downloadQR(card)} disabled={!card.qrUrl}
                        className="flex-1 py-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-center gap-1">
                        <FaDownload size={12} /> Download
                      </button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} target="_blank"
                        className="flex-1 py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-xs flex items-center justify-center gap-1">
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
            <p className="text-gray-400 text-sm">No cards available</p>
          </div>
        )}
        
        {totalPages > 1 && <Pagination />}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW - Hidden on mobile */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Activation</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">QR</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Preview</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedCards.length > 0 ? (
                filteredGroupedCards.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="9" className="p-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              {list.length} cards
                            </span>
                          </div>
                          <button
                            onClick={() => downloadAllByDate(date, list)}
                            disabled={downloadingDate === date}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                              downloadingDate === date
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'
                            }`}
                          >
                            {downloadingDate === date ? (
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

                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={card.isActivated} />
                        </td>
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
                          {new Date(card.activatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mx-auto shadow-md">
                            <QRThumbnail cardId={card._id} />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => previewQR(card)}
                            disabled={!card.qrUrl}
                            className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => downloadQR(card)}
                            disabled={!card.qrUrl}
                            className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all"
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
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-6 text-center">
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
      </div>
    </div>
  );
};

export default ManageCards;
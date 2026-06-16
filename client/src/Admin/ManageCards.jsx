import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";
import { HexColorPicker } from "react-colorful";

/* Ultra High Resolution PNG Generator - 4000px for no pixelation */
const createHighQualityQR = (url, dotsColor = "#000000", bgColor = "transparent", size = 4000) => {
  const qrData = `${url}`;
  
  return new QRCodeStyling({ 
    width: size,
    height: size,
    data: qrData,
    type: "svg",
    margin: 10,
    dotsOptions: {
      color: dotsColor,
      type: "dots",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    cornersDotOptions: {
      type: "rounded",
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
      imageSize: 0.25
    },
    image: "/B.png",
  });
};

/* Ultra High Resolution PNG with Text - Increased Height and Gaps */
const addTextToUltraHighResPNG = async (qrCode, activationCode, profileName, textColor = "#000000", bgColor = "transparent") => {
  try {
    const svgString = await qrCode.getRawData("svg");
    const svgText = await svgString.text();
    
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const qrSize = 4000;
        const textHeight = 900;
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
        
        const line1Y = qrSize + 150;
        const codeY = qrSize + 350;
        const line2Y = qrSize + 400;
        const nameY = qrSize + 700;
        
        ctx.strokeStyle = textColor;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(200, line1Y);
        ctx.stroke();
        
        ctx.font = 'bold 300px "Courier New", monospace';
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 1;
        ctx.textAlign = 'center';
        ctx.fillText(`Code: ${activationCode}`, canvas.width / 2, codeY);
        
        ctx.strokeStyle = textColor;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(200, line2Y);
        ctx.stroke();
        
        if (profileName && profileName !== '—' && profileName !== 'No Name' && profileName !== '') {
          let displayName = profileName;
          if (displayName.length > 35) {
            displayName = displayName.substring(0, 32) + '...';
          }
          ctx.font = '250px Arial, sans-serif';
          ctx.fillStyle = textColor;
          ctx.globalAlpha = 0.8;
          ctx.fillText(displayName, canvas.width / 2, nameY);
          ctx.globalAlpha = 1;
        }
        
        canvas.toBlob((newBlob) => {
          const finalUrl = URL.createObjectURL(newBlob);
          resolve(finalUrl);
        }, 'image/png', 1.0);
        
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    });
  } catch (error) {
    console.error("Error creating ultra high-res PNG:", error);
    const blob = await qrCode.getRawData("png");
    return URL.createObjectURL(blob);
  }
};

/* Thumbnail ke liye chota PNG - Updated with better spacing */
const generateThumbnailPNG = async (qrCode, activationCode, profileName, textColor, bgColor) => {
  try {
    const svgString = await qrCode.getRawData("svg");
    const svgText = await svgString.text();
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const qrSize = 200;
        const textHeight = 80;
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
        
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(activationCode.substring(0, 10), canvas.width / 2, qrSize + 30);
        
        if (profileName && profileName !== '—' && profileName !== 'No Name' && profileName !== '') {
          let shortName = profileName.substring(0, 12);
          ctx.font = '10px Arial';
          ctx.fillStyle = textColor;
          ctx.globalAlpha = 0.7;
          ctx.fillText(shortName, canvas.width / 2, qrSize + 55);
          ctx.globalAlpha = 1;
        }
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, 'image/png', 0.9);
        
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    });
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    resolve(null);
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
  const [generatingQR, setGeneratingQR] = useState(false);
  
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
  
  const isGeneratingRef = useRef(false);
  const currentPageRef = useRef(currentPage);

  // Sirf current page ke cards ke liye QR generate karein
  const generateQRCodesForCurrentPage = useCallback(async (cardsList) => {
    if (!cardsList || cardsList.length === 0) return;
    if (isGeneratingRef.current) return;
    
    isGeneratingRef.current = true;
    setGeneratingQR(true);
    
    const qrMap = {};
    
    // Chunk size 5 - ek saath 5 QR generate honge
    const chunkSize = 5;
    
    for (let i = 0; i < cardsList.length; i += chunkSize) {
      // Check if we're still on the same page
      if (currentPageRef.current !== currentPage) {
        console.log("Page changed, stopping QR generation");
        break;
      }
      
      const chunk = cardsList.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (card) => {
        if (card.qrUrl && !qrImages[card._id]) {
          try {
            const thumbnailQR = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 400);
            const thumbnailUrl = await generateThumbnailPNG(
              thumbnailQR,
              card.activationCode,
              card.owner?.name || card.profile?.name || '',
              textColor,
              qrBgColor
            );
            
            qrMap[card._id] = thumbnailUrl;
          } catch (err) {
            console.error(`Error generating QR for ${card._id}:`, err);
            qrMap[card._id] = null;
          }
        } else {
          qrMap[card._id] = null;
        }
      }));
      
      // Update UI with current batch
      setQrImages(prev => ({ ...prev, ...qrMap }));
      
      // Small delay to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    isGeneratingRef.current = false;
    setGeneratingQR(false);
  }, [qrDotsColor, qrBgColor, textColor, currentPage]);

  const fetchCards = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setIsSearching(!!search);
      currentPageRef.current = page;
      
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
      
      // Clear previous page QR images
      setQrImages({});
      
      // Generate QR codes for current page only
      await generateQRCodesForCurrentPage(allCards);
      
    } catch (err) {
      console.error(err);
      setError("Unable to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  // Color change par sirf current page ke QR regenerate karein
  useEffect(() => {
    if (cards.length > 0 && !loading) {
      setQrImages({});
      generateQRCodesForCurrentPage(cards);
    }
  }, [qrBgColor, qrDotsColor, textColor]);

  useEffect(() => {
    fetchCards(currentPage, searchQuery);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      currentPageRef.current = page;
      setQrImages({}); // Clear old QR images
      fetchCards(page, searchQuery);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    currentPageRef.current = 1;
    setQrImages({});
    fetchCards(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    currentPageRef.current = 1;
    setQrImages({});
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
    
    const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 2000);
    const previewUrl = await addTextToUltraHighResPNG(
      qr, 
      card.activationCode, 
      card.owner?.name || card.profile?.name || '',
      textColor,
      qrBgColor
    );

    const win = window.open("", "_blank", "width=1200,height=1400");
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
            max-width: 800px;
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
            background: rgba(0,0,0,0.8);
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 13px;
            color: #4ade80;
            font-weight: bold;
          }
          .resolution-badge {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 12px;
            color: #fbbf24;
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
          📸 ULTRA HD PNG (2000x2000)
        </div>
        <div class="resolution-badge">
          🔍 Zoom in - Minimal pixelation at 400% zoom
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
      const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 4000);
      const finalImageUrl = await addTextToUltraHighResPNG(
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
      const folderName = `cards-${date}-ultra-hd-4000px`;
      const folder = zip.folder(folderName);

      alert(`📥 Generating ${validCards.length} ULTRA HD PNGs (4000x4000px)...\nFile size will be larger but ZOOM WON'T BREAK THE QR!`);

      const chunkSize = 2;
      const results = [];

      for (let i = 0; i < validCards.length; i += chunkSize) {
        const chunk = validCards.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async (card) => {
          try {
            const qr = createHighQualityQR(card.qrUrl, qrDotsColor, qrBgColor, 4000);
            const finalImageUrl = await addTextToUltraHighResPNG(
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
      link.download = `all-cards-${date}-4000px-ultra-hd.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      alert(`✅ Download Complete!\n\n📦 Successful: ${successful}\n❌ Failed: ${failed}\n📐 Resolution: 4000x4000px (ULTRA HD)\n🎯 Format: PNG\n🔍 Even at 400% zoom, QR remains readable!\n💾 File size is larger but quality is MAXIMUM!`);

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 px-2 sm:px-4 py-3 sm:py-4 bg-gray-800/30 rounded-lg">
      <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 text-center sm:text-left">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> • 
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalCards)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalCards}</span>
        {isSearching && (
          <span className="ml-1 sm:ml-2 text-indigo-400 block sm:inline mt-1 sm:mt-0">
            (Search results)
          </span>
        )}
        {generatingQR && (
          <span className="ml-1 sm:ml-2 text-yellow-400 block sm:inline mt-1 sm:mt-0">
            (Generating QR...)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
          className={`p-1.5 sm:p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
          className={`p-1.5 sm:p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        
        {getPageNumbers().map((pageNum, index) => (
          <button key={index} onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
            className={`min-w-[28px] sm:min-w-[35px] h-7 sm:h-9 flex items-center justify-center rounded-lg text-[10px] sm:text-xs md:text-sm font-medium ${
              currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
              pageNum === '...' ? 'text-gray-400 cursor-default' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`} disabled={pageNum === '...'}>
            {pageNum}
          </button>
        ))}
        
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className={`p-1.5 sm:p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
          className={`p-1.5 sm:p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <FiChevronsRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );

  const QRThumbnail = ({ cardId }) => {
    const imageData = qrImages[cardId];
    
    if (!imageData) {
      return <img src="/qr.png" alt="QR" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />;
    }
    
    return (
      <img
        src={imageData}
        alt="QR Code"
        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/qr.png";
        }}
      />
    );
  };

  return (
    <div className="px-2 sm:px-3 md:px-4 lg:px-2 py-3 sm:py-4 text-gray-200 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6 lg:mt-0 mt-10">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-base sm:text-lg md:text-xl lg:text-xl font-bold">Manage NFC Cards</h4>
          <p className="text-gray-400 mt-0.5 sm:mt-1 text-[10px] sm:text-xs">
            View, track and manage all NFC card profiles
            <span className="ml-1 sm:ml-2 text-indigo-400 font-medium block sm:inline mt-0.5 sm:mt-0">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto items-stretch sm:items-center">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 text-white hover:shadow-lg transition-all cursor-pointer text-xs sm:text-sm md:text-base"
          >
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full border border-white" style={{ backgroundColor: qrBgColor === 'transparent' ? '#fff' : qrBgColor }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full border border-white" style={{ backgroundColor: textColor }}></div>
            <span className="hidden xs:inline">Customize</span>
            <span className="xs:hidden">Colors</span>
          </button>

          <form onSubmit={handleSearch} className="relative w-full sm:w-48 md:w-56">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-gray-900/60 backdrop-blur border-0 pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-xs sm:text-sm"
              />
              <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-gray-400" size={12} className="sm:w-[14px] sm:h-[14px]" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </form>

          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-900/60 backdrop-blur border-0 pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-2 sm:py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-xs sm:text-sm"
            />
            <div className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <Link
            to="/api/cards/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 hover:shadow-lg text-xs w-full sm:w-auto"
          >
            <FiPlus className="text-sm sm:text-base transition-transform duration-300 group-hover:rotate-180" />
            <span>Create Cards</span>
          </Link>
        </div>
      </div>

      {/* COLOR PICKER MODAL */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-3 sm:p-4">
          <div className="bg-gray-900 rounded-2xl max-w-sm sm:max-w-md w-full border border-gray-700 shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Customize QR Colors</h3>
              <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white p-1">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">QR Background Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={qrBgColor === 'transparent' ? '#ffffff' : qrBgColor} onChange={(color) => setQrBgColor(color)} />
                  <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setQrBgColor("transparent")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700">Transparent</button>
                    <button onClick={() => setQrBgColor("#ffffff")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border border-gray-600 rounded"></div>White
                    </button>
                    <button onClick={() => setQrBgColor("#000000")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black border border-gray-600 rounded"></div>Black
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">QR Dots Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
                  <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setQrDotsColor("#000000")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded"></div>Black
                    </button>
                    <button onClick={() => setQrDotsColor("#E1C48A")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#E1C48A] rounded"></div>Gold
                    </button>
                    <button onClick={() => setQrDotsColor("#3B82F6")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>Blue
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Text Color</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <HexColorPicker color={textColor} onChange={setTextColor} />
                  <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setTextColor("#000000")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded"></div>Black
                    </button>
                    <button onClick={() => setTextColor("#E1C48A")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#E1C48A] rounded"></div>Gold
                    </button>
                    <button onClick={() => setTextColor("#ffffff")} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 rounded-lg text-white text-xs sm:text-sm hover:bg-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded"></div>White
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400 text-center mb-2 sm:mb-3">Live Preview (4000px Ultra HD PNG)</p>
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 flex justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: qrBgColor === 'transparent' ? '#fff' : qrBgColor }}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
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
                <p className="text-center text-[10px] sm:text-xs mt-1.5 sm:mt-2" style={{ color: textColor }}>Code: ABC123XYZ</p>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              <button onClick={() => setShowColorPicker(false)} className="flex-1 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs sm:text-sm transition-colors">Close</button>
              <button onClick={() => setShowColorPicker(false)} className="flex-1 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-white text-xs sm:text-sm transition-colors cursor-pointer">Apply Colors</button>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
        <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Total Cards</p><p className="text-xl sm:text-2xl font-bold">{stats.total}</p></div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-indigo-400 text-base sm:text-lg">📋</span></div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Activated</p><p className="text-xl sm:text-2xl font-bold text-green-400">{stats.activated}</p></div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center"><span className="text-green-400 text-base sm:text-lg">✓</span></div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Inactive</p><p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.inactive}</p></div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 flex items-center justify-center"><span className="text-yellow-400 text-base sm:text-lg">⏸</span></div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block lg:hidden">
        {filteredGroupedCards.length > 0 ? (
          filteredGroupedCards.map(([date, list]) => (
            <div key={date} className="mb-4 sm:mb-6">
              <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-base">📅</span>
                    <span className="font-medium text-gray-300 text-xs sm:text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
                    <span className="text-[10px] sm:text-xs bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-300">{list.length}</span>
                  </div>
                  <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium w-full sm:w-auto justify-center ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'}`}>
                    {downloadingDate === date ? (<><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={11} className="sm:w-[12px] sm:h-[12px]" /><span>Download All ({list.length})</span></>)}
                  </button>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {list.map((card) => (
                  <div key={card._id} className="bg-gray-800/50 rounded-xl p-2.5 sm:p-3 border border-gray-700/50">
                    <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                          <StatusBadge active={card.isActivated} />
                          <span className="text-[10px] sm:text-xs text-gray-400">✓ {card.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{card.owner?.name || "—"}</p>
                        <p className="text-[10px] sm:text-xs text-indigo-400 font-mono mt-0.5 sm:mt-1 break-all">{card.activationCode}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1 sm:p-1.5 rounded-lg shadow-md overflow-hidden"><QRThumbnail cardId={card._id} /></div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700/50">
                      <button onClick={() => previewQR(card)} disabled={!card.qrUrl} className="flex-1 py-1 sm:py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-[10px] sm:text-xs flex items-center justify-center gap-1"><FaEye size={10} className="sm:w-[12px] sm:h-[12px]" /> Preview</button>
                      <button onClick={() => downloadQR(card)} disabled={!card.qrUrl} className="flex-1 py-1 sm:py-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 text-[10px] sm:text-xs flex items-center justify-center gap-1"><FaDownload size={10} className="sm:w-[12px] sm:h-[12px]" /> Download</button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} target="_blank" className="flex-1 py-1 sm:py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-[10px] sm:text-xs flex items-center justify-center gap-1">View</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 sm:p-6 text-center bg-gray-800/30 rounded-xl"><FiAlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-500" /><p className="text-gray-400 text-xs sm:text-sm">No cards available</p></div>
        )}
        {totalPages > 1 && <Pagination />}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-medium text-gray-300">✓</th>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-medium text-gray-300">Status</th>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-medium text-gray-300">Owner</th>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-medium text-gray-300">Activation</th>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-medium text-gray-300">Created</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-medium text-gray-300">QR</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-medium text-gray-300">Preview</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-medium text-gray-300">Download</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-medium text-gray-300">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedCards.length > 0 ? (
                filteredGroupedCards.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="9" className="p-2 sm:p-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span>📅</span>
                            <span className="font-medium text-gray-300 text-xs sm:text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="text-[10px] sm:text-xs bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-gray-300">{list.length} cards</span>
                          </div>
                          <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date} 
                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'}`}>
                            {downloadingDate === date ? (<><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={12} className="sm:w-[14px] sm:h-[14px]" /><span>Download All ({list.length})</span></>)}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-2 sm:p-3"><input checked={card.isDownloaded} readOnly type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded" /></td>
                        <td className="p-2 sm:p-3"><StatusBadge active={card.isActivated} /></td>
                        <td className="p-2 sm:p-3"><span className="text-xs sm:text-sm truncate block max-w-[120px] sm:max-w-[150px]" title={card.owner?.name}>{card.owner?.name || "—"}</span></td>
                        <td className="p-2 sm:p-3"><div className="font-mono text-[10px] sm:text-sm text-indigo-400 truncate max-w-[80px] sm:max-w-[100px]" title={card.activationCode}>{card.activationCode}</div></td>
                        <td className="p-2 sm:p-3 text-gray-400 text-[10px] sm:text-sm whitespace-nowrap">{new Date(card.activatedAt).toLocaleDateString()}</td>
                        <td className="p-2 sm:p-3 text-center"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-white p-0.5 sm:p-1 rounded-lg flex items-center justify-center mx-auto shadow-md"><QRThumbnail cardId={card._id} /></div></td>
                        <td className="p-2 sm:p-3 text-center"><button onClick={() => previewQR(card)} disabled={!card.qrUrl} className="text-gray-400 hover:text-white transition p-1 sm:p-1.5 rounded-lg hover:bg-gray-800/50"><FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button></td>
                        <td className="p-2 sm:p-3 text-center"><button onClick={() => downloadQR(card)} disabled={!card.qrUrl} className="bg-cyan-500 hover:bg-cyan-600 p-1 sm:p-1.5 rounded-lg text-black transition-all"><FaDownload className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" /></button></td>
                        <td className="p-2 sm:p-3 text-center"><Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} className="text-indigo-400 hover:text-indigo-300 transition text-[10px] sm:text-xs font-medium hover:underline" target="_blank">View</Link></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr><td colSpan="9" className="p-4 sm:p-6 text-center"><div className="text-gray-400"><FiAlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-500" /><p className="text-xs sm:text-sm">No cards available</p></div></td></tr>
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
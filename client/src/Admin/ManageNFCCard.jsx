import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud, FiGrid, FiEye } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";
import { HexColorPicker } from "react-colorful";
import html2canvas from "html2canvas-pro";
import NFCCardDesign from "./ManageNFCCard/NFCCardDesign";
import CardPreviewModal from "./ManageNFCCard/CardPreviewModel";



/* High Quality QR Generator for Card */
const createHighQualityQR = (url, dotsColor = "#000000", bgColor = "transparent", size = 800) => {
  return new QRCodeStyling({ 
    width: size,
    height: size,
    data: url,
    type: "svg",
    margin: 5,
    dotsOptions: {
      color: dotsColor,
      type: "rounded",
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
  });
};


/* NFC Card Generator - NEW White Card Design as per your image */
const generateNFCCard = async (
  activationCode,
  profileName,
  profileSlug,
  qrDotsColor = "#000000",
  qrBgColor = "#ffffff",
  cardBgColor = "#ffffff",
  cardTextColor = "#000000",
  size = 1200
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Card dimensions (1200 x 750 ratio)
  const cardWidth = size;
  const cardHeight = Math.round(size / 1.6);
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  
  // === Card Background (White) ===
  ctx.fillStyle = cardBgColor;
  ctx.fillRect(0, 0, cardWidth, cardHeight);
  
  // === Border (Black/Grey) ===
  ctx.strokeStyle = cardTextColor === "#ffffff" ? "#333" : "#000000";
  ctx.lineWidth = Math.max(2, size / 600);
  ctx.strokeRect(size * 0.02, size * 0.02, cardWidth - (size * 0.04), cardHeight - (size * 0.04));
  
  // ========== LEFT SIDE ==========
  const leftX = cardWidth * 0.05;
  const centerY = cardHeight / 2;
  
  // === WiFi Icon (Signal Bars) ===
  const wifiX = leftX;
  const wifiStartY = cardHeight * 0.25;
  const barWidth = size * 0.008;
  
  const bars = [18, 28, 38, 48].map((height, i) => ({
    height: height * (size / 1200),
    y: wifiStartY + (48 - height) * (size / 1200)
  }));
  
  ctx.fillStyle = cardTextColor === "#ffffff" ? "#333" : cardTextColor;
  bars.forEach((bar, i) => {
    ctx.fillRect(
      wifiX + (i * barWidth * 2.5), 
      bar.y, 
      barWidth, 
      bar.height
    );
  });
  
  // === NFC Text below WiFi ===
  ctx.font = `bold ${Math.min(cardHeight * 0.07, 28)}px Arial`;
  ctx.textAlign = "left";
  ctx.fillStyle = cardTextColor === "#ffffff" ? "#333" : cardTextColor;
  ctx.fillText("NFC", leftX, wifiStartY + (55 * (size / 1200)));
  
  // === BRILSON Title ===
  ctx.font = `bold ${Math.min(cardHeight * 0.12, 52)}px Arial`;
  ctx.fillStyle = cardTextColor === "#ffffff" ? "#1a1a2e" : cardTextColor;
  ctx.fillText("Brilson", leftX, cardHeight * 0.55);
  
  // === Website URL ===
  ctx.font = `${Math.min(cardHeight * 0.045, 18)}px Arial`;
  ctx.fillStyle = cardTextColor === "#ffffff" ? "#666" : "#999";
  ctx.fillText("www.brilson.in", leftX, cardHeight * 0.65);
  
  // ========== RIGHT SIDE ==========
  const qrSize = Math.min(cardHeight * 0.3, 200);
  const qrX = cardWidth - qrSize - (cardWidth * 0.08);
  const qrY = (cardHeight - qrSize) / 2;
  
  // QR Border Box
  ctx.strokeStyle = cardTextColor === "#ffffff" ? "#333" : "#000000";
  ctx.lineWidth = Math.max(2, size / 400);
  ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
  
  // Generate QR Code
  const profileUrl = `${import.meta.env.VITE_DOMAIN || window.location.origin}/public/profile/${profileSlug || activationCode}`;
  const qrCode = createHighQualityQR(profileUrl, qrDotsColor, qrBgColor, qrSize * 4);
  
  const qrSvgString = await qrCode.getRawData("svg");
  const qrSvgText = await qrSvgString.text();
  const qrImg = new Image();
  const qrBlob = new Blob([qrSvgText], { type: 'image/svg+xml' });
  const qrUrl = URL.createObjectURL(qrBlob);
  
  await new Promise((resolve) => {
    qrImg.onload = () => {
      // QR Background (if needed)
      if (qrBgColor !== "transparent") {
        ctx.fillStyle = qrBgColor;
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
      }
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      resolve();
    };
    qrImg.onerror = () => resolve();
    qrImg.src = qrUrl;
  });
  
  URL.revokeObjectURL(qrUrl);
  
  // === Activation Key Section (Below QR) ===
  const actKeyY = qrY + qrSize + 40;
  
  ctx.font = `${Math.min(cardHeight * 0.035, 14)}px Arial`;
  ctx.fillStyle = cardTextColor === "#ffffff" ? "#666" : "#999";
  ctx.textAlign = "center";
  ctx.fillText("ACTIVATION KEY", cardWidth / 2, actKeyY);
  
  let displayCode = activationCode || "52V28-91S28-6B799";
  ctx.font = `bold ${Math.min(cardHeight * 0.045, 20)}px "Courier New"`;
  ctx.fillStyle = cardTextColor;
  ctx.fillText(displayCode, cardWidth / 2, actKeyY + 35);
  
  return canvas.toDataURL('image/png', 1.0);
};




// Helper for rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.moveTo(x+r, y);
  this.lineTo(x+w-r, y);
  this.quadraticCurveTo(x+w, y, x+w, y+r);
  this.lineTo(x+w, y+h-r);
  this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  this.lineTo(x+r, y+h);
  this.quadraticCurveTo(x, y+h, x, y+h-r);
  this.lineTo(x, y+r);
  this.quadraticCurveTo(x, y, x+r, y);
  return this;
};

/* Thumbnail Card Generator */
/* Thumbnail Card Generator - Smaller size for table */
const generateCardThumbnail = async (activationCode, profileName, profileSlug, qrDotsColor, qrBgColor, cardBgColor, cardTextColor) => {
  try {
    const safeSlug = profileSlug && profileSlug !== 'undefined' ? profileSlug : activationCode;
    const cardDataUrl = await generateNFCCard(
      activationCode,
      profileName || '',
      safeSlug,
      qrDotsColor,
      qrBgColor,
      cardBgColor,
      cardTextColor,
      240 // Smaller size for thumbnail (was 180)
    );
    return cardDataUrl;
  } catch (error) {
    console.error("Error creating card thumbnail:", error);
    return null;
  }
};



const ManageNFCCard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    inactive: 0
  });
  const [cardImages, setCardImages] = useState({});
  const [downloadingDate, setDownloadingDate] = useState(null);
  const [generatingCards, setGeneratingCards] = useState(false);
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Card Colors - New defaults for white card
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
  
  const isGeneratingRef = useRef(false);
  const currentPageRef = useRef(currentPage);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const cardRef = useRef();

  // Generate card thumbnails for current page
  const generateCardsForCurrentPage = useCallback(async (cardsList) => {
    if (!cardsList || cardsList.length === 0) return;
    if (isGeneratingRef.current) return;
    
    isGeneratingRef.current = true;
    setGeneratingCards(true);
    
    const cardMap = {};
    const chunkSize = 5;
    
    for (let i = 0; i < cardsList.length; i += chunkSize) {
      if (currentPageRef.current !== currentPage) {
        console.log("Page changed, stopping card generation");
        break;
      }
      
      const chunk = cardsList.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (card) => {
        if (card.qrUrl && !cardImages[card._id]) {
          try {
            const thumbnailUrl = await generateCardThumbnail(
              card.activationCode,
              card.owner?.name || card.profile?.name || '',
              card.slug || card.activationCode,
              qrDotsColor,
              qrBgColor,
              cardBgColor,
              cardTextColor
            );
            cardMap[card._id] = thumbnailUrl;
          } catch (err) {
            console.error(`Error generating card for ${card._id}:`, err);
            cardMap[card._id] = null;
          }
        }
      }));
      
      setCardImages(prev => ({ ...prev, ...cardMap }));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    isGeneratingRef.current = false;
    setGeneratingCards(false);
  }, [qrDotsColor, qrBgColor, cardBgColor, cardTextColor, currentPage]);

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

      console.log("Fetched cards data:", res.data);
      
      const allCards = res.data.allCards || [];
      setCards(allCards);
      setTotalCards(res.data.totalCards || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
      
      const total = res.data.totalCards || 0;
      const activated = allCards.filter(card => card.isActivated).length;
      const inactive = allCards.length - activated;
      
      setStats({ total, activated, inactive });
      setCardImages({});
      await generateCardsForCurrentPage(allCards);
      
    } catch (err) {
      console.error(err);
      setError("Unable to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate cards when colors change
  useEffect(() => {
    if (cards.length > 0 && !loading) {
      setCardImages({});
      generateCardsForCurrentPage(cards);
    }
  }, [cardBgColor, cardTextColor, qrDotsColor, qrBgColor]);

  useEffect(() => {
    fetchCards(currentPage, searchQuery);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      currentPageRef.current = page;
      setCardImages({});
      fetchCards(page, searchQuery);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    currentPageRef.current = 1;
    setCardImages({});
    fetchCards(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    currentPageRef.current = 1;
    setCardImages({});
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

  const previewCard = (card) => {
    setSelectedCard(card);
    setPreviewOpen(true);
  };

  const replaceOklchColors = (element) => {
    if (!element) return;

    const allElements = element.querySelectorAll("*");

    allElements.forEach((el) => {
      const styles = window.getComputedStyle(el);

      [
        "color",
        "backgroundColor",
        "borderColor",
        "outlineColor",
        "textDecorationColor",
        "boxShadow",
      ].forEach((prop) => {
        const value = styles[prop];

        if (value && value.includes("oklch")) {
          // fallback color
          el.style[prop] = "#000000";
        }
      });
    });
  };

  const downloadCard = async (card) => {
    try {
      setSelectedCard(card);

      setTimeout(async () => {
        const element = document.getElementById("download-card");

        if (!element) {
          alert("Card element not found");
          return;
        }

        // FIX OKLCH ISSUE
        replaceOklchColors(element);

        const canvas = await html2canvas(element, {
          scale: 5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          foreignObjectRendering: false,
        });

        const image = canvas.toDataURL("image/png", 1.0);

        const link = document.createElement("a");
        link.href = image;
        link.download = `brilson-card-${card.activationCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      }, 500);

    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to download card");
    }
  };

  const downloadAllByDate = async (date, cardsList) => {
    if (!cardsList || cardsList.length === 0) {
      alert("No cards available for this date");
      return;
    }

    setDownloadingDate(date);

    try {
      const zip = new JSZip();
      const folderName = `brilson-cards-${date}`;
      const folder = zip.folder(folderName);

      alert(`📥 Generating ${cardsList.length} NFC Cards...\nPlease wait while we create your cards.`);

      const chunkSize = 3;
      const results = [];

      for (let i = 0; i < cardsList.length; i += chunkSize) {
        const chunk = cardsList.slice(i, i + chunkSize);
        
        const chunkPromises = chunk.map(async (card, idx) => {
          try {
            // Create a temporary hidden container
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '1200px';
            document.body.appendChild(tempDiv);
            
            // Render NFCCardDesign component
            const { default: ReactDOM } = await import('react-dom/client');
            const NFCCardDesignComponent = (await import('./ManageNFCCard/NFCCardDesign')).default;
            
            const root = ReactDOM.createRoot(tempDiv);
            
            await new Promise((resolve) => {
              root.render(
                <NFCCardDesign
                  activationCode={card.activationCode}
                  profileSlug={card.slug || card.activationCode}
                  profileName={card.owner?.name || card.profile?.name || 'Card Owner'}
                  cardBgColor={cardBgColor}
                  cardTextColor={cardTextColor}
                  qrDotsColor={qrDotsColor}
                  qrBgColor={qrBgColor}
                />
              );
              
              // Wait for render
              setTimeout(async () => {
                const element = tempDiv.firstChild;
                if (element) {
                  const canvas = await html2canvas(element, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                  });
                  
                  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png', 1.0));
                  const filename = `brilson-card-${card.activationCode}.png`;
                  folder.file(filename, blob);
                }
                root.unmount();
                document.body.removeChild(tempDiv);
                resolve();
              }, 500);
            });
            
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
      link.download = `all-brilson-cards-${date}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      alert(`✅ Download Complete!\n\n📦 Successful: ${successful}\n❌ Failed: ${failed}`);

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
        {generatingCards && (
          <span className="ml-2 text-yellow-400 block sm:inline mt-1 sm:mt-0">
            (Generating cards...)
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

  const CardThumbnail = ({ cardId }) => {
    const imageData = cardImages[cardId];
    
    if (!imageData) {
      return <div className="w-14 h-9 bg-gray-700 rounded animate-pulse"></div>;
    }
    
    return (
      <img
        src={imageData}
        alt="NFC Card"
        className="w-14 h-9 object-cover rounded shadow-md"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "";
        }}
      />
    );
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-2 py-4 text-gray-200 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6 lg:mt-0 mt-11">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-xl sm:text-xl md:text-xl lg:text-xl font-bold">Manage NFC Cards</h4>
          <p className="text-gray-400 mt-1 text-xs">
            View, track and manage all NFC card profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline mt-1 sm:mt-0">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
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
              className="bg-gray-900/60 backdrop-blur border-0 pl-3 pr-8 py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Controls */}
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



{/* Right Side - Live Preview */}
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
        {/* LEFT SECTION */}
        <div className="flex-1 flex flex-col items-start justify-center gap-1">
          {/* WiFi + NFC */}
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
            }}>
              NFC
            </span>
          </div>

          {/* BRILSON */}
          <h2 className="font-bold text-3xl leading-tight" style={{ 
            color: cardTextColor === "#ffffff" ? "#1a1a2e" : cardTextColor 
          }}>
            Brilson
          </h2>

          {/* URL */}
          <p className="text-xs leading-none" style={{ 
            color: cardTextColor === "#ffffff" ? "#666" : cardTextColor 
          }}>
            www.brilson.in
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          {/* QR Code */}
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

          {/* Activation Key */}
          <div className="text-center">
            <p className="text-[8px] uppercase tracking-wider leading-none mb-1" style={{ 
              color: cardTextColor === "#ffffff" ? "#666" : cardTextColor 
            }}>
              Activation Key
            </p>
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
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-indigo-400 text-lg">📋</span></div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Activated</p><p className="text-2xl font-bold text-green-400">{stats.activated}</p></div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><span className="text-green-400 text-lg">✓</span></div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-xs mb-1">Inactive</p><p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p></div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center"><span className="text-yellow-400 text-lg">⏸</span></div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block lg:hidden">
        {filteredGroupedCards.length > 0 ? (
          filteredGroupedCards.map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="font-medium text-gray-300 text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">{list.length}</span>
                  </div>
                  <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium w-full sm:w-auto justify-center ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'}`}>
                    {downloadingDate === date ? (<><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={12} /><span>Download All ({list.length})</span></>)}
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
                        <CardThumbnail cardId={card._id} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-700/50">
                      <button onClick={() => previewCard(card)} disabled={!card.qrUrl} className="flex-1 py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-center gap-1"><FiEye size={12} /> Preview</button>
                      <button onClick={() => downloadCard(card)} disabled={!card.qrUrl} className="flex-1 py-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-center gap-1"><FaDownload size={12} /> Download</button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} target="_blank" className="flex-1 py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-xs flex items-center justify-center gap-1">View</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center bg-gray-800/30 rounded-xl"><FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" /><p className="text-gray-400 text-sm">No cards available</p></div>
        )}
        {totalPages > 1 && <Pagination />}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Activation</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Card</th>
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
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">{list.length} cards</span>
                          </div>
                          <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'}`}>
                            {downloadingDate === date ? (<><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={14} /><span>Download All ({list.length})</span></>)}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {list.map((card) => (
                      <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3"><input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" /></td>
                        <td className="p-3"><StatusBadge active={card.isActivated} /></td>
                        <td className="p-3"><span className="text-sm truncate block max-w-[150px]" title={card.owner?.name}>{card.owner?.name || "—"}</span></td>
                        <td className="p-3"><div className="font-mono text-sm text-indigo-400 truncate max-w-[100px]" title={card.activationCode}>{card.activationCode}</div></td>
                        <td className="p-3 text-gray-400 text-sm whitespace-nowrap">{new Date(card.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-center">
                          <div className="w-20 h-12 mx-auto">
                            <CardThumbnail cardId={card._id} />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => previewCard(card)} disabled={!card.qrUrl} className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50" title="Preview Card">
                            <FiEye className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => downloadCard(card)} disabled={!card.qrUrl} className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all" title="Download Card">
                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline" target="_blank">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr><td colSpan="9" className="p-6 text-center"><div className="text-gray-400"><FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" /><p className="text-sm">No cards available</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <Pagination />}
      </div>

      {/* Hidden download card element */}
      <div className="fixed -left-[99999px] -top-[99999px]">
        <div id="download-card">
          {selectedCard && (
            <NFCCardDesign
              ref={cardRef}
              activationCode={selectedCard.activationCode}
              profileSlug={selectedCard.slug}
              profileName={selectedCard.owner?.name || selectedCard.profile?.name || 'Card Owner'}
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


















// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud, FiGrid, FiEye } from "react-icons/fi";
// import { FaDownload } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import QRCodeStyling from "qr-code-styling";
// import JSZip from "jszip";
// import { HexColorPicker } from "react-colorful";
// import html2canvas from "html2canvas-pro";
// import NFCCardDesign from "./ManageNFCCard/NFCCardDesign";
// import CardPreviewModal from "./ManageNFCCard/CardPreviewModel";



// /* High Quality QR Generator for Card */
// const createHighQualityQR = (url, dotsColor = "#000000", bgColor = "transparent", size = 800) => {
//   return new QRCodeStyling({ 
//     width: size,
//     height: size,
//     data: url,
//     type: "svg",
//     margin: 5,
//     dotsOptions: {
//       color: dotsColor,
//       type: "rounded",
//     },
//     cornersSquareOptions: {
//       type: "extra-rounded",
//     },
//     cornersDotOptions: {
//       type: "rounded",
//     },
//     backgroundOptions: {
//       color: bgColor,
//     },
//   });
// };


// /* NFC Card Generator - NEW White Card Design as per your image */
// const generateNFCCard = async (
//   activationCode,
//   profileName,
//   profileSlug,
//   qrDotsColor = "#000000",
//   qrBgColor = "#ffffff",
//   cardBgColor = "#ffffff",
//   cardTextColor = "#000000",
//   size = 1200
// ) => {
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
  
//   // Card dimensions (1200 x 750 ratio)
//   const cardWidth = size;
//   const cardHeight = Math.round(size / 1.6);
//   canvas.width = cardWidth;
//   canvas.height = cardHeight;
  
//   // === Card Background (White) ===
//   ctx.fillStyle = cardBgColor;
//   ctx.fillRect(0, 0, cardWidth, cardHeight);
  
//   // === Border (Black/Grey) ===
//   ctx.strokeStyle = cardTextColor === "#ffffff" ? "#333" : "#000000";
//   ctx.lineWidth = Math.max(2, size / 600);
//   ctx.strokeRect(size * 0.02, size * 0.02, cardWidth - (size * 0.04), cardHeight - (size * 0.04));
  
//   // ========== LEFT SIDE ==========
//   const leftX = cardWidth * 0.05;
//   const centerY = cardHeight / 2;
  
//   // === WiFi Icon (Signal Bars) ===
//   const wifiX = leftX;
//   const wifiStartY = cardHeight * 0.25;
//   const barWidth = size * 0.008;
  
//   const bars = [18, 28, 38, 48].map((height, i) => ({
//     height: height * (size / 1200),
//     y: wifiStartY + (48 - height) * (size / 1200)
//   }));
  
//   ctx.fillStyle = cardTextColor === "#ffffff" ? "#333" : cardTextColor;
//   bars.forEach((bar, i) => {
//     ctx.fillRect(
//       wifiX + (i * barWidth * 2.5), 
//       bar.y, 
//       barWidth, 
//       bar.height
//     );
//   });
  
//   // === NFC Text below WiFi ===
//   ctx.font = `bold ${Math.min(cardHeight * 0.07, 28)}px Arial`;
//   ctx.textAlign = "left";
//   ctx.fillStyle = cardTextColor === "#ffffff" ? "#333" : cardTextColor;
//   ctx.fillText("NFC", leftX, wifiStartY + (55 * (size / 1200)));
  
//   // === BRILSON Title ===
//   ctx.font = `bold ${Math.min(cardHeight * 0.12, 52)}px Arial`;
//   ctx.fillStyle = cardTextColor === "#ffffff" ? "#1a1a2e" : cardTextColor;
//   ctx.fillText("Brilson", leftX, cardHeight * 0.55);
  
//   // === Website URL ===
//   ctx.font = `${Math.min(cardHeight * 0.045, 18)}px Arial`;
//   ctx.fillStyle = cardTextColor === "#ffffff" ? "#666" : "#999";
//   ctx.fillText("www.brilson.in", leftX, cardHeight * 0.65);
  
//   // ========== RIGHT SIDE ==========
//   const qrSize = Math.min(cardHeight * 0.3, 200);
//   const qrX = cardWidth - qrSize - (cardWidth * 0.08);
//   const qrY = (cardHeight - qrSize) / 2;
  
//   // QR Border Box
//   ctx.strokeStyle = cardTextColor === "#ffffff" ? "#333" : "#000000";
//   ctx.lineWidth = Math.max(2, size / 400);
//   ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
  
//   // Generate QR Code
//   const profileUrl = `${import.meta.env.VITE_DOMAIN || window.location.origin}/public/profile/${profileSlug || activationCode}`;
//   const qrCode = createHighQualityQR(profileUrl, qrDotsColor, qrBgColor, qrSize * 4);
  
//   const qrSvgString = await qrCode.getRawData("svg");
//   const qrSvgText = await qrSvgString.text();
//   const qrImg = new Image();
//   const qrBlob = new Blob([qrSvgText], { type: 'image/svg+xml' });
//   const qrUrl = URL.createObjectURL(qrBlob);
  
//   await new Promise((resolve) => {
//     qrImg.onload = () => {
//       // QR Background (if needed)
//       if (qrBgColor !== "transparent") {
//         ctx.fillStyle = qrBgColor;
//         ctx.fillRect(qrX, qrY, qrSize, qrSize);
//       }
//       ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
//       resolve();
//     };
//     qrImg.onerror = () => resolve();
//     qrImg.src = qrUrl;
//   });
  
//   URL.revokeObjectURL(qrUrl);
  
//   // === Activation Key Section (Below QR) ===
//   const actKeyY = qrY + qrSize + 40;
  
//   ctx.font = `${Math.min(cardHeight * 0.035, 14)}px Arial`;
//   ctx.fillStyle = cardTextColor === "#ffffff" ? "#666" : "#999";
//   ctx.textAlign = "center";
//   ctx.fillText("ACTIVATION KEY", cardWidth / 2, actKeyY);
  
//   let displayCode = activationCode || "52V28-91S28-6B799";
//   ctx.font = `bold ${Math.min(cardHeight * 0.045, 20)}px "Courier New"`;
//   ctx.fillStyle = cardTextColor;
//   ctx.fillText(displayCode, cardWidth / 2, actKeyY + 35);
  
//   return canvas.toDataURL('image/png', 1.0);
// };




// // Helper for rounded rectangles
// CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
//   if (w < 2 * r) r = w / 2;
//   if (h < 2 * r) r = h / 2;
//   this.moveTo(x+r, y);
//   this.lineTo(x+w-r, y);
//   this.quadraticCurveTo(x+w, y, x+w, y+r);
//   this.lineTo(x+w, y+h-r);
//   this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
//   this.lineTo(x+r, y+h);
//   this.quadraticCurveTo(x, y+h, x, y+h-r);
//   this.lineTo(x, y+r);
//   this.quadraticCurveTo(x, y, x+r, y);
//   return this;
// };

// /* Thumbnail Card Generator */
// /* Thumbnail Card Generator - Smaller size for table */
// const generateCardThumbnail = async (activationCode, profileName, profileSlug, qrDotsColor, qrBgColor, cardBgColor, cardTextColor) => {
//   try {
//     const safeSlug = profileSlug && profileSlug !== 'undefined' ? profileSlug : activationCode;
//     const cardDataUrl = await generateNFCCard(
//       activationCode,
//       profileName || '',
//       safeSlug,
//       qrDotsColor,
//       qrBgColor,
//       cardBgColor,
//       cardTextColor,
//       240 // Smaller size for thumbnail (was 180)
//     );
//     return cardDataUrl;
//   } catch (error) {
//     console.error("Error creating card thumbnail:", error);
//     return null;
//   }
// };



// const ManageNFCCard = () => {
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [stats, setStats] = useState({
//     total: 0,
//     activated: 0,
//     inactive: 0
//   });
//   const [cardImages, setCardImages] = useState({});
//   const [downloadingDate, setDownloadingDate] = useState(null);
//   const [generatingCards, setGeneratingCards] = useState(false);
  
//   const [showColorPicker, setShowColorPicker] = useState(false);
  
//   // Card Colors
//   // Card Colors - New defaults for white card
// const [cardBgColor, setCardBgColor] = useState("#ffffff");  
// const [cardTextColor, setCardTextColor] = useState("#000000"); 
// const [qrDotsColor, setQrDotsColor] = useState("#000000");
// const [qrBgColor, setQrBgColor] = useState("#ffffff");


//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCards, setTotalCards] = useState(0);
//   const [limit] = useState(100);
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
  
//   const isGeneratingRef = useRef(false);
//   const currentPageRef = useRef(currentPage);

//   const [previewOpen, setPreviewOpen] = useState(false);

// const [selectedCard, setSelectedCard] = useState(null);

// const cardRef = useRef();

//   // Generate card thumbnails for current page
//   const generateCardsForCurrentPage = useCallback(async (cardsList) => {
//     if (!cardsList || cardsList.length === 0) return;
//     if (isGeneratingRef.current) return;
    
//     isGeneratingRef.current = true;
//     setGeneratingCards(true);
    
//     const cardMap = {};
//     const chunkSize = 5;
    
//     for (let i = 0; i < cardsList.length; i += chunkSize) {
//       if (currentPageRef.current !== currentPage) {
//         console.log("Page changed, stopping card generation");
//         break;
//       }
      
//       const chunk = cardsList.slice(i, i + chunkSize);
      
//       await Promise.all(chunk.map(async (card) => {
//         if (card.qrUrl && !cardImages[card._id]) {
//           try {
//             const thumbnailUrl = await generateCardThumbnail(
//               card.activationCode,
//               card.owner?.name || card.profile?.name || '',
//               card.slug || card.activationCode,
//               qrDotsColor,
//               qrBgColor,
//               cardBgColor,
//               cardTextColor
//             );
//             cardMap[card._id] = thumbnailUrl;
//           } catch (err) {
//             console.error(`Error generating card for ${card._id}:`, err);
//             cardMap[card._id] = null;
//           }
//         }
//       }));
      
//       setCardImages(prev => ({ ...prev, ...cardMap }));
//       await new Promise(resolve => setTimeout(resolve, 50));
//     }
    
//     isGeneratingRef.current = false;
//     setGeneratingCards(false);
//   }, [qrDotsColor, qrBgColor, cardBgColor, cardTextColor, currentPage]);

//   const fetchCards = async (page = 1, search = "") => {
//     try {
//       setLoading(true);
//       setIsSearching(!!search);
//       currentPageRef.current = page;
      
//       const url = `${import.meta.env.VITE_BASE_URL}/api/all/cards?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      
//       const res = await axios.get(url, { 
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });

//       console.log("Fetched cards data:", res.data);
      
//       const allCards = res.data.allCards || [];
//       setCards(allCards);
//       setTotalCards(res.data.totalCards || 0);
//       setTotalPages(res.data.totalPages || 1);
//       setCurrentPage(res.data.page || 1);
      
//       const total = res.data.totalCards || 0;
//       const activated = allCards.filter(card => card.isActivated).length;
//       const inactive = allCards.length - activated;
      
//       setStats({ total, activated, inactive });
//       setCardImages({});
//       await generateCardsForCurrentPage(allCards);
      
//     } catch (err) {
//       console.error(err);
//       setError("Unable to fetch cards");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Regenerate cards when colors change
//   useEffect(() => {
//     if (cards.length > 0 && !loading) {
//       setCardImages({});
//       generateCardsForCurrentPage(cards);
//     }
//   }, [cardBgColor, cardTextColor, qrDotsColor, qrBgColor]);

//   useEffect(() => {
//     fetchCards(currentPage, searchQuery);
//   }, []);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       setCurrentPage(page);
//       currentPageRef.current = page;
//       setCardImages({});
//       fetchCards(page, searchQuery);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     currentPageRef.current = 1;
//     setCardImages({});
//     fetchCards(1, searchQuery);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setCurrentPage(1);
//     currentPageRef.current = 1;
//     setCardImages({});
//     fetchCards(1, "");
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = 5;
    
//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         pageNumbers.push(1, 2, 3, 4, '...', totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
//       }
//     }
    
//     return pageNumbers;
//   };

//   const groupedCards = cards.reduce((acc, card) => {
//     const date = new Date(card.createdAt).toISOString().split("T")[0];
//     if (!acc[date]) acc[date] = [];
//     acc[date].push(card);
//     return acc;
//   }, {});

//   const filteredGroupedCards = Object.entries(groupedCards).filter(
//     ([date]) => !selectedDate || date === selectedDate
//   );

//   const previewCard = (card) => {
//   setSelectedCard(card);
//   setPreviewOpen(true);
// };

// // console.log("Card Data ", cards);


// const replaceOklchColors = (element) => {
//   if (!element) return;

//   const allElements = element.querySelectorAll("*");

//   allElements.forEach((el) => {
//     const styles = window.getComputedStyle(el);

//     [
//       "color",
//       "backgroundColor",
//       "borderColor",
//       "outlineColor",
//       "textDecorationColor",
//       "boxShadow",
//     ].forEach((prop) => {
//       const value = styles[prop];

//       if (value && value.includes("oklch")) {
//         // fallback color
//         el.style[prop] = "#000000";
//       }
//     });
//   });
// };




// const downloadCard = async (card) => {
//   try {
//     setSelectedCard(card);

//     setTimeout(async () => {
//       const element = document.getElementById("download-card");

//       if (!element) {
//         alert("Card element not found");
//         return;
//       }

//       // FIX OKLCH ISSUE
//       replaceOklchColors(element);

//       const canvas = await html2canvas(element, {
//         scale: 5,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: null,
//         logging: false,
//         foreignObjectRendering: false,
//       });

//       const image = canvas.toDataURL("image/png", 1.0);

//       const link = document.createElement("a");

//       link.href = image;

//       link.download = `brilson-card-${card.activationCode}.png`;

//       document.body.appendChild(link);

//       link.click();

//       document.body.removeChild(link);

//     }, 500);

//   } catch (error) {
//     console.error("Download Error:", error);

//     alert("Failed to download card");
//   }
// };


//  const downloadAllByDate = async (date, cardsList) => {
//   if (!cardsList || cardsList.length === 0) {
//     alert("No cards available for this date");
//     return;
//   }

//   setDownloadingDate(date);

//   try {
//     const zip = new JSZip();
//     const folderName = `brilson-cards-${date}`;
//     const folder = zip.folder(folderName);

//     alert(`📥 Generating ${cardsList.length} NFC Cards...\nPlease wait while we create your cards.`);

//     const chunkSize = 3;
//     const results = [];

//     for (let i = 0; i < cardsList.length; i += chunkSize) {
//       const chunk = cardsList.slice(i, i + chunkSize);
      
//       const chunkPromises = chunk.map(async (card, idx) => {
//         try {
//           // Create a temporary hidden container
//           const tempDiv = document.createElement('div');
//           tempDiv.style.position = 'absolute';
//           tempDiv.style.left = '-9999px';
//           tempDiv.style.top = '-9999px';
//           tempDiv.style.width = '1200px';
//           document.body.appendChild(tempDiv);
          
//           // Render NFCCardDesign component
//           const { default: ReactDOM } = await import('react-dom/client');
//           const NFCCardDesignComponent = (await import('./ManageNFCCard/NFCCardDesign')).default;
          
//           const root = ReactDOM.createRoot(tempDiv);
          
//           await new Promise((resolve) => {
//             root.render(
//               <NFCCardDesign
//                 activationCode={card.activationCode}
//                 profileSlug={card.slug || card.activationCode}
//                 profileName={card.owner?.name || card.profile?.name || 'Card Owner'}
//                 cardBgColor={cardBgColor}
//                 cardTextColor={cardTextColor}
//                 qrDotsColor={qrDotsColor}
//                 qrBgColor={qrBgColor}
//               />
//             );
            
//             // Wait for render
//             setTimeout(async () => {
//               const element = tempDiv.firstChild;
//               if (element) {
//                 const canvas = await html2canvas(element, {
//                   scale: 3,
//                   useCORS: true,
//                   backgroundColor: null,
//                   logging: false,
//                 });
                
//                 const blob = await new Promise((res) => canvas.toBlob(res, 'image/png', 1.0));
//                 const filename = `brilson-card-${card.activationCode}.png`;
//                 folder.file(filename, blob);
//               }
//               root.unmount();
//               document.body.removeChild(tempDiv);
//               resolve();
//             }, 500);
//           });
          
//           return { success: true, card };
//         } catch (error) {
//           console.error(`Error processing card ${card.activationCode}:`, error);
//           return { success: false, card };
//         }
//       });

//       const chunkResults = await Promise.all(chunkPromises);
//       results.push(...chunkResults);
//     }

//     const zipContent = await zip.generateAsync({ type: "blob" });
//     const zipUrl = URL.createObjectURL(zipContent);

//     const link = document.createElement('a');
//     link.href = zipUrl;
//     link.download = `all-brilson-cards-${date}.zip`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(zipUrl);

//     const successful = results.filter(r => r.success).length;
//     const failed = results.filter(r => !r.success).length;

//     alert(`✅ Download Complete!\n\n📦 Successful: ${successful}\n❌ Failed: ${failed}`);

//   } catch (error) {
//     console.error("Error in bulk download:", error);
//     alert("Error downloading cards. Please try again.");
//   } finally {
//     setDownloadingDate(null);
//   }
// };



//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex justify-center items-center">
//         <div className="h-12 w-12 animate-spin border-t-2 border-indigo-500 rounded-full" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-400 p-8">
//         <FiAlertCircle className="text-4xl mx-auto mb-3" />
//         {error}
//       </div>
//     );
//   }

//   const StatusBadge = ({ active }) => (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
//         active
//           ? "bg-green-500/20 text-green-400"
//           : "bg-yellow-500/20 text-yellow-400"
//       }`}
//     >
//       {active ? "Active" : "Inactive"}
//     </span>
//   );

//   const Pagination = () => (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
//       <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
//         Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
//         <span className="font-medium text-gray-300">{totalPages}</span> • 
//         Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
//         <span className="font-medium text-gray-300">
//           {Math.min(currentPage * limit, totalCards)}
//         </span> of{" "}
//         <span className="font-medium text-gray-300">{totalCards}</span>
//         {isSearching && (
//           <span className="ml-2 text-indigo-400 block sm:inline mt-1 sm:mt-0">
//             (Search results)
//           </span>
//         )}
//         {generatingCards && (
//           <span className="ml-2 text-yellow-400 block sm:inline mt-1 sm:mt-0">
//             (Generating cards...)
//           </span>
//         )}
//       </div>
      
//       <div className="flex items-center gap-1 flex-wrap justify-center">
//         <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
//           className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronsLeft size={16} />
//         </button>
//         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
//           className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronLeft size={16} />
//         </button>
        
//         {getPageNumbers().map((pageNum, index) => (
//           <button key={index} onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
//             className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${
//               currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
//               pageNum === '...' ? 'text-gray-400 cursor-default' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
//             }`} disabled={pageNum === '...'}>
//             {pageNum}
//           </button>
//         ))}
        
//         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
//           className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronRight size={16} />
//         </button>
//         <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
//           className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronsRight size={16} />
//         </button>
//       </div>
//     </div>
//   );

//   const CardThumbnail = ({ cardId }) => {
//     const imageData = cardImages[cardId];
    
//     if (!imageData) {
//       return <div className="w-14 h-9 bg-gray-700 rounded animate-pulse"></div>;
//     }
    
//     return (
//       <img
//         src={imageData}
//         alt="NFC Card"
//         className="w-14 h-9 object-cover rounded shadow-md"
//         onError={(e) => {
//           e.target.onerror = null;
//           e.target.src = "";
//         }}
//       />
//     );
//   };

//   return (
//     <div className="px-3 sm:px-4 md:px-6 lg:px-2 py-4 text-gray-200 max-w-full overflow-x-hidden">
//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6 lg:mt-0 mt-11">
//         <div className="w-full lg:w-auto text-center lg:text-left">
//           <h4 className="text-xl sm:text-xl md:text-xl lg:text-xl font-bold">Manage NFC Cards</h4>
//           <p className="text-gray-400 mt-1 text-xs">
//             View, track and manage all NFC card profiles
//             <span className="ml-2 text-indigo-400 font-medium block sm:inline mt-1 sm:mt-0">
//               (Page {currentPage} of {totalPages})
//             </span>
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
//           <button
//             onClick={() => setShowColorPicker(!showColorPicker)}
//             className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
//           >
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardBgColor }}></div>
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardTextColor }}></div>
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
//             <span className="hidden xs:inline">Customize Card</span>
//             <span className="xs:hidden">Colors</span>
//           </button>

//           <form onSubmit={handleSearch} className="relative w-full sm:w-56">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search..."
//                 className="bg-gray-900/60 backdrop-blur border-0 pl-9 pr-8 py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-sm"
//               />
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                 <FiSearch className="text-gray-400" size={14} />
//               </div>
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={handleClearSearch}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
//                 >
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </form>

//           <div className="relative w-full sm:w-auto">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-gray-900/60 backdrop-blur border-0 pl-3 pr-8 py-2.5 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 text-white text-sm"
//             />
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
//               <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//               </svg>
//             </div>
//           </div>

//           {/* <Link
//             to="/api/cards/bulk"
//             className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
//           >
//             <FiPlus className="text-base transition-transform duration-300 group-hover:rotate-180" />
//             <span>Create Cards</span>
//           </Link> */}
//         </div>
//       </div>

//       {/* COLOR PICKER MODAL */}
//       {showColorPicker && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
//           <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-white">Customize NFC Card</h3>
//               <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 </svg>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               {/* Controls */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Card Background Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={cardBgColor} onChange={setCardBgColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setCardBgColor("#0a0a1a")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#0a0a1a] rounded"></div>Dark Blue
//                       </button>
//                       <button onClick={() => setCardBgColor("#1a1a2e")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#1a1a2e] rounded"></div>Navy
//                       </button>
//                       <button onClick={() => setCardBgColor("#0f0f23")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#0f0f23] rounded"></div>Deep Black
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Card Text Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={cardTextColor} onChange={setCardTextColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setCardTextColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-white rounded"></div>White
//                       </button>
//                       <button onClick={() => setCardTextColor("#E1C48A")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>Gold
//                       </button>
//                       <button onClick={() => setCardTextColor("#00ff00")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-green-500 rounded"></div>Neon Green
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">QR Dots Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setQrDotsColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-black rounded"></div>Black
//                       </button>
//                       <button onClick={() => setQrDotsColor("#E1C48A")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>Gold
//                       </button>
//                       <button onClick={() => setQrDotsColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-white rounded"></div>White
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">QR Background Color</label>
//                   <div className="flex gap-2 flex-wrap">
//                     <button onClick={() => setQrBgColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                       <div className="w-4 h-4 bg-white rounded"></div>White
//                     </button>
//                     <button onClick={() => setQrBgColor("transparent")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700">Transparent</button>
//                     <button onClick={() => setQrBgColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                       <div className="w-4 h-4 bg-black rounded"></div>Black
//                     </button>
//                   </div>
//                 </div>
//               </div>


//               {/* Right Side - Live Preview */}
// <div className="bg-gray-800/50 rounded-xl p-4">
//   <p className="text-sm text-gray-400 text-center mb-3">💳 Live Card Preview</p>
//   <div className="flex justify-center">
//     <div 
//       className="relative w-full max-w-[360px] rounded-2xl overflow-hidden"
//       style={{ 
//         background: cardBgColor,
//         border: "1px solid #E1C48A",
//         boxShadow: "0 0 20px rgba(225, 196, 138, 0.1)"
//       }}
//     >
//       <div className="p-4 relative" style={{ minHeight: "230px" }}>
//         {/* Top Left - Large Logo */}
//         <div className="flex items-center">
//           <span className="font-bold text-[#E1C48A]" style={{ color: cardTextColor, fontSize: "24px" }}>BRILSON</span>
//         </div>

//         {/* Top Right - NFC */}
//         <div className="absolute top-4 right-4">
//           <span className="font-bold text-[#E1C48A]" style={{ color: cardTextColor, fontSize: "22px" }}>NFC</span>
//         </div>

//         {/* Professional Card Text */}
//         {/* <p className="text-[#E1C48A] mt-6" style={{ fontSize: "14px" }}>PROFESSIONAL CARD</p> */}

//         {/* Profile Name */}
//         {/* <p className="font-semibold mt-2" style={{ color: cardTextColor, fontSize: "16px" }}>John Doe</p> */}

//         {/* Activation Code Label */}
//         <p className="absolute bottom-12 left-4 w-full text-center" style={{ color: cardTextColor + "99", fontSize: "15px" }}>ACTIVATION CODE:</p>

//         {/* Activation Code */}
//         <p className="absolute bottom-6 left-4 font-mono font-bold w-full text-center" style={{ color: cardTextColor, fontSize: "12px" }}>K3Y-A1B2-C3D4-E5F6</p>

//         {/* QR Code */}
//         <div className="absolute bottom-3 right-3">
//           <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-white" 
//                style={{ border: "2px solid #E1C48A" }}>
//             <div className="w-14 h-14">
//               <svg viewBox="0 0 100 100">
//                 <rect x="20" y="20" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="32" y="20" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="44" y="20" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="20" y="32" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="44" y="32" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="20" y="44" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="32" y="44" width="8" height="8" fill={qrDotsColor} />
//                 <rect x="44" y="44" width="8" height="8" fill={qrDotsColor} />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Bottom BRILSON */}
//         {/* <div className="absolute bottom-2 left-0 right-0 text-center">
//           <span className="text-[#E1C48A]" style={{ fontSize: "8px" }}>BRILSON</span>
//         </div> */}
//       </div>
//     </div>
//   </div>
// </div>
//             </div>

//             <div className="mt-6 flex gap-3">
//               <button onClick={() => setShowColorPicker(false)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">Close</button>
//               <button onClick={() => setShowColorPicker(false)} className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-white transition-colors cursor-pointer">Apply Colors</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STATS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
//         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
//           <div className="flex items-center justify-between">
//             <div><p className="text-gray-400 text-xs mb-1">Total Cards</p><p className="text-2xl font-bold">{stats.total}</p></div>
//             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><span className="text-indigo-400 text-lg">📋</span></div>
//           </div>
//         </div>
//         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
//           <div className="flex items-center justify-between">
//             <div><p className="text-gray-400 text-xs mb-1">Activated</p><p className="text-2xl font-bold text-green-400">{stats.activated}</p></div>
//             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><span className="text-green-400 text-lg">✓</span></div>
//           </div>
//         </div>
//         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
//           <div className="flex items-center justify-between">
//             <div><p className="text-gray-400 text-xs mb-1">Inactive</p><p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p></div>
//             <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center"><span className="text-yellow-400 text-lg">⏸</span></div>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE VIEW */}
//       <div className="block lg:hidden">
//         {filteredGroupedCards.length > 0 ? (
//           filteredGroupedCards.map(([date, list]) => (
//             <div key={date} className="mb-6">
//               <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-base">📅</span>
//                     <span className="font-medium text-gray-300 text-sm">{new Date(date).toLocaleDateString("en-GB")}</span>
//                     <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">{list.length}</span>
//                   </div>
//                   <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date}
//                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium w-full sm:w-auto justify-center ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'}`}>
//                     {downloadingDate === date ? (<><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={12} /><span>Download All ({list.length})</span></>)}
//                   </button>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 {list.map((card) => (
//                   <div key={card._id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1 flex-wrap">
//                           <StatusBadge active={card.isActivated} />
//                           <span className="text-xs text-gray-400">✓ {card.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
//                         </div>
//                         <p className="text-sm font-medium text-white truncate">{card.owner?.name || "—"}</p>
//                         <p className="text-xs text-indigo-400 font-mono mt-1 break-all">{card.activationCode}</p>
//                       </div>
//                       <div className="flex-shrink-0">
//                         <CardThumbnail cardId={card._id} />
//                       </div>
//                     </div>
//                     <div className="flex gap-2 mt-3 pt-2 border-t border-gray-700/50">
//                       <button onClick={() => previewCard(card)} disabled={!card.qrUrl} className="flex-1 py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-center gap-1"><FiEye size={12} /> Preview</button>
//                       <button onClick={() => downloadCard(card)} disabled={!card.qrUrl} className="flex-1 py-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-center gap-1"><FaDownload size={12} /> Download</button>
//                       <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} target="_blank" className="flex-1 py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-xs flex items-center justify-center gap-1">View</Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="p-6 text-center bg-gray-800/30 rounded-xl"><FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" /><p className="text-gray-400 text-sm">No cards available</p></div>
//         )}
//         {totalPages > 1 && <Pagination />}
//       </div>

//       {/* DESKTOP/TABLET TABLE VIEW */}
//       <div className="hidden lg:block">
//         <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
//           <table className="w-full min-w-[900px]">
//             <thead className="bg-gray-800/50 border-b border-gray-700/50">
//               <tr>
//                 <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
//                 <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
//                 <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
//                 <th className="p-3 text-left text-xs font-medium text-gray-300">Activation</th>
//                 <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
//                 <th className="p-3 text-center text-xs font-medium text-gray-300">Card</th>
//                 <th className="p-3 text-center text-xs font-medium text-gray-300">Preview</th>
//                 <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
//                 <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-700/30">
//               {filteredGroupedCards.length > 0 ? (
//                 filteredGroupedCards.map(([date, list]) => (
//                   <React.Fragment key={date}>
//                     <tr className="bg-gray-800/30">
//                       <td colSpan="9" className="p-3">
//                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                           <div className="flex items-center gap-2">
//                             <span>📅</span>
//                             <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
//                             <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">{list.length} cards</span>
//                           </div>
//                           <button onClick={() => downloadAllByDate(date, list)} disabled={downloadingDate === date}
//                             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${downloadingDate === date ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'}`}>
//                             {downloadingDate === date ? (<><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Downloading...</span></>) : (<><FiDownloadCloud size={14} /><span>Download All ({list.length})</span></>)}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {list.map((card) => (
//                       <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
//                         <td className="p-3"><input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" /></td>
//                         <td className="p-3"><StatusBadge active={card.isActivated} /></td>
//                         <td className="p-3"><span className="text-sm truncate block max-w-[150px]" title={card.owner?.name}>{card.owner?.name || "—"}</span></td>
//                         <td className="p-3"><div className="font-mono text-sm text-indigo-400 truncate max-w-[100px]" title={card.activationCode}>{card.activationCode}</div></td>
//                         <td className="p-3 text-gray-400 text-sm whitespace-nowrap">{new Date(card.createdAt).toLocaleDateString()}</td>
//                         <td className="p-3 text-center">
//                           <div className="w-20 h-12 mx-auto">
//                             <CardThumbnail cardId={card._id} />
//                           </div>
//                         </td>
//                         <td className="p-3 text-center">
//                           <button onClick={() => previewCard(card)} disabled={!card.qrUrl} className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50" title="Preview Card">
//                             <FiEye className="w-4 h-4" />
//                           </button>
//                         </td>
//                         <td className="p-3 text-center">
//                           <button onClick={() => downloadCard(card)} disabled={!card.qrUrl} className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all" title="Download Card">
//                             <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
//                           </button>
//                         </td>
//                         <td className="p-3 text-center">
//                           <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`} className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline" target="_blank">
//                             View
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr><td colSpan="9" className="p-6 text-center"><div className="text-gray-400"><FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" /><p className="text-sm">No cards available</p></div></td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         {totalPages > 1 && <Pagination />}
//       </div>

// <div className="fixed -left-[99999px] -top-[99999px]">
//   <div id="download-card">
//     {selectedCard && (
//       <NFCCardDesign
//         ref={cardRef}
//         activationCode={selectedCard.activationCode}
//         profileSlug={selectedCard.slug}
//         cardBgColor={cardBgColor}
//         cardTextColor={cardTextColor}
//         qrDotsColor={qrDotsColor}
//         qrBgColor={qrBgColor}
//       />
//     )}
//   </div>
// </div>


// <CardPreviewModal
//   isOpen={previewOpen}
//   onClose={() => setPreviewOpen(false)}
//   card={selectedCard}
//   cardBgColor={cardBgColor}
//   cardTextColor={cardTextColor}
//   qrDotsColor={qrDotsColor}
//   qrBgColor={qrBgColor}
// />

//     </div>
//   );
// };

// export default ManageNFCCard;
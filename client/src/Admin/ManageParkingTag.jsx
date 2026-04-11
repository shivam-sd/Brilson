import React, { useEffect, useState } from "react";
import { FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiDownloadCloud } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";
import { HexColorPicker } from "react-colorful";

/* SVG QR Code Generator - Higher Quality with Dotted Pattern */
const createHighQualityQR = (url, dotsColor = "#000000", bgColor = "transparent", size = 800) => {
  const qrData = `${url}`;
  
  return new QRCodeStyling({ 
    width: size,
    height: size,
    data: qrData,
    type: "svg",
    margin: 5, // Add margin around QR code
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
      round: 25
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.2
    },
    image: "/B.png",
  });
};

/* Helper function to safely render SVG thumbnail */
const renderSVGThumbnail = (svgDataUrl, className = "w-10 h-10") => {
  if (!svgDataUrl || !svgDataUrl.startsWith('data:image/svg')) {
    return null;
  }
  
  try {
    const svgString = decodeURIComponent(svgDataUrl.split(',')[1]);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgString;
    const svgElement = tempDiv.querySelector('svg');
    
    if (svgElement) {
      svgElement.setAttribute('width', '40');
      svgElement.setAttribute('height', '40');
      svgElement.setAttribute('viewBox', `0 0 ${svgElement.getAttribute('viewBox')?.split(' ')[2] || '800'} ${svgElement.getAttribute('viewBox')?.split(' ')[3] || '920'}`);
      
      const serializer = new XMLSerializer();
      const modifiedSvgString = serializer.serializeToString(svgElement);
      
      return { __html: modifiedSvgString };
    }
  } catch (error) {
    console.error("Error rendering SVG thumbnail:", error);
  }
  
  return null;
};

/* Add text to SVG QR Code - FIXED VERSION */
const addTextToSVG = async (qrCode, activationCode, profileName, textColor = "#000000", bgColor = "transparent") => {
  try {
    const svgString = await qrCode.getRawData("svg");
    const svgText = await svgString.text();
    
    const container = document.createElement('div');
    container.innerHTML = svgText;
    const svgElement = container.querySelector('svg');
    
    if (!svgElement) {
      throw new Error("No SVG element found");
    }
    
    const originalWidth = parseInt(svgElement.getAttribute('width') || '800');
    const originalHeight = parseInt(svgElement.getAttribute('height') || '800');
    
    // Reduced text area height
    const textHeight = 100;
    const newHeight = originalHeight + textHeight;
    
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("width", originalWidth.toString());
    newSvg.setAttribute("height", newHeight.toString());
    newSvg.setAttribute("viewBox", `0 0 ${originalWidth} ${newHeight}`);
    newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    if (bgColor !== 'transparent') {
      const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bgRect.setAttribute("width", "100%");
      bgRect.setAttribute("height", "100%");
      bgRect.setAttribute("fill", bgColor);
      newSvg.appendChild(bgRect);
    }
    
    const qrGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const originalChildren = svgElement.children;
    for (let i = 0; i < originalChildren.length; i++) {
      const child = originalChildren[i].cloneNode(true);
      qrGroup.appendChild(child);
    }
    newSvg.appendChild(qrGroup);
    
    const centerX = originalWidth / 2;
    const separatorY = originalHeight + 15;
    const codeY = originalHeight + 45;
    const nameY = originalHeight + 75;
    
    // Add separator line (thinner)
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "60");
    line.setAttribute("y1", separatorY.toString());
    line.setAttribute("x2", (originalWidth - 60).toString());
    line.setAttribute("y2", separatorY.toString());
    line.setAttribute("stroke", textColor);
    line.setAttribute("stroke-opacity", "0.3");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-dasharray", "4,4");
    newSvg.appendChild(line);
    
    // Add activation code text (smaller font)
    const codeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    codeText.setAttribute("x", centerX.toString());
    codeText.setAttribute("y", codeY.toString());
    codeText.setAttribute("text-anchor", "middle");
    codeText.setAttribute("font-family", "monospace");
    codeText.setAttribute("font-size", "30");
    codeText.setAttribute("font-weight", "bold");
    codeText.setAttribute("fill", textColor);
    codeText.textContent = `Code: ${activationCode}`;
    newSvg.appendChild(codeText);
    
    // Add profile name if exists (smaller font)
    if (profileName && profileName !== '—' && profileName !== 'No Name' && profileName !== '') {
      let displayName = profileName;
      if (displayName.length > 25) {
        displayName = displayName.substring(0, 22) + '...';
      }
      
      const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      nameText.setAttribute("x", centerX.toString());
      nameText.setAttribute("y", nameY.toString());
      nameText.setAttribute("text-anchor", "middle");
      nameText.setAttribute("font-family", "Arial, sans-serif");
      nameText.setAttribute("font-size", "25");
      nameText.setAttribute("fill", textColor);
      nameText.setAttribute("fill-opacity", "0.8");
      nameText.textContent = displayName;
      newSvg.appendChild(nameText);
    }
    
    const serializer = new XMLSerializer();
    const svgStringOutput = serializer.serializeToString(newSvg);
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStringOutput);
    
    return dataUrl;
  } catch (error) {
    console.error("Error creating SVG QR:", error);
    const blob = await qrCode.getRawData("png");
    return URL.createObjectURL(blob);
  }
};

/* High resolution PNG - FIXED VERSION */
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
        
        // Separator line
        ctx.strokeStyle = textColor;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, qrSize + 15);
        ctx.lineTo(canvas.width - 80, qrSize + 15);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Activation Code text
        ctx.font = 'bold 24px "Courier New", monospace';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(`Code: ${activationCode}`, canvas.width / 2, qrSize + 55);
        
        // Profile name
        if (profileName && profileName !== '—' && profileName !== 'No Name' && profileName !== '') {
          let displayName = profileName;
          if (displayName.length > 30) {
            displayName = displayName.substring(0, 27) + '...';
          }
          ctx.font = '18px Arial, sans-serif';
          ctx.fillStyle = textColor;
          ctx.globalAlpha = 0.8;
          ctx.fillText(displayName, canvas.width / 2, qrSize + 85);
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


const ManageParkingTag = () => {
  const [tags, setTags] = useState([]);
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
  const [useSVG, setUseSVG] = useState(true);
  
  // Color customization states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [qrBgColor, setQrBgColor] = useState("transparent");
  const [qrDotsColor, setQrDotsColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [limit] = useState(100);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /* FETCH WITH PAGINATION & SEARCH */
  const fetchTags = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setIsSearching(!!search);
      
      const url = `${import.meta.env.VITE_BASE_URL}/api/all/tags?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      
      const res = await axios.get(url, { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      
      const allTags = res.data.allTags || [];
      console.log("Fetched tags:", res.data);
      setTags(allTags);
      
      setTotalTags(res.data.totalTags || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
      
      const total = res.data.totalTags || 0;
      const activated = allTags.filter(tag => tag.isActivated).length;
      const inactive = allTags.length - activated;
      
      setStats({ total, activated, inactive });
      
      await generateHighQualityQRCodes(allTags);
      
    } catch (err) {
      console.error(err);
      setError("Unable to fetch parking tags");
    } finally {
      setLoading(false);
    }
  };

  // Generate high quality QR codes
  const generateHighQualityQRCodes = async (tagsList = tags) => {
    const qrPromises = tagsList.map(async (tag) => {
      if (tag.qrUrl) {
        try {
          const qr = createHighQualityQR(tag.qrUrl, qrDotsColor, qrBgColor, 800);
          
          let finalImageUrl;
          if (useSVG) {
            finalImageUrl = await addTextToSVG(
              qr, 
              tag.activationCode, 
              tag.owner?.name || tag.profile?.ownerName || '',
              textColor,
              qrBgColor
            );
          } else {
            finalImageUrl = await addTextToHighResPNG(
              qr, 
              tag.activationCode, 
              tag.owner?.name || tag.profile?.ownerName || '',
              textColor,
              qrBgColor
            );
          }
          
          return { tagId: tag._id, imageUrl: finalImageUrl };
        } catch (err) {
          console.error(`Error generating QR for ${tag._id}:`, err);
          return { tagId: tag._id, imageUrl: null };
        }
      }
      return { tagId: tag._id, imageUrl: null };
    });

    const qrResults = await Promise.all(qrPromises);
    const qrMap = {};
    qrResults.forEach(result => {
      qrMap[result.tagId] = result.imageUrl;
    });
    setQrImages(qrMap);
  };

  // Regenerate QR when colors change or format changes
  useEffect(() => {
    if (tags.length > 0) {
      generateHighQualityQRCodes();
    }
  }, [qrBgColor, qrDotsColor, textColor, useSVG]);

  // Initial fetch
  useEffect(() => {
    fetchTags(currentPage, searchQuery);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchTags(page, searchQuery);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTags(1, searchQuery);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchTags(1, "");
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

  /* GROUP BY DATE */
  const groupedTags = tags.reduce((acc, tag) => {
    const date = new Date(tag.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(tag);
    return acc;
  }, {});

  const filteredGroupedTags = Object.entries(groupedTags).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

  /* PREVIEW with high quality */
  const previewQR = async (tag) => {
    if (!tag.qrUrl) {
      alert("No QR URL available for this parking tag");
      return;
    }
    
    const qr = createHighQualityQR(tag.qrUrl, qrDotsColor, qrBgColor, 600);
    let previewUrl;
    
    if (useSVG) {
      previewUrl = await addTextToSVG(
        qr, 
        tag.activationCode, 
        tag.owner?.name || tag.profile?.ownerName || '',
        textColor,
        qrBgColor
      );
    } else {
      previewUrl = await addTextToHighResPNG(
        qr, 
        tag.activationCode, 
        tag.owner?.name || tag.profile?.ownerName || '',
        textColor,
        qrBgColor
      );
    }

    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Parking Tag QR - ${tag.activationCode}</title>
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
          .qr-container img, .qr-container svg {
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
          ${useSVG ? 
            `<div>${previewUrl.startsWith('data:image/svg') ? 
              decodeURIComponent(previewUrl.split(',')[1]) : 
              `<img src="${previewUrl}" alt="QR Code" />`}</div>` : 
            `<img src="${previewUrl}" alt="QR Code" />`}
        </div>
        <div class="info">
          <p>Activation Code</p>
          <h2>${tag.activationCode}</h2>
        </div>
        <div class="quality-badge">
          ${useSVG ? '🔷 Vector Quality (SVG)' : '📸 High Resolution PNG'}
        </div>
      </body>
      </html>
    `);
  };

  /* DOWNLOAD SINGLE TAG - High Quality */
  const downloadQR = async (tag) => {
    if (!tag.qrUrl) {
      alert("No QR URL available for download");
      return;
    }
    
    try {
      const qr = createHighQualityQR(tag.qrUrl, qrDotsColor, qrBgColor, 1200);
      let finalImageUrl;
      let fileExtension = useSVG ? 'svg' : 'png';
      
      if (useSVG) {
        finalImageUrl = await addTextToSVG(
          qr, 
          tag.activationCode, 
          tag.owner?.name || tag.profile?.ownerName || '',
          textColor,
          qrBgColor
        );
      } else {
        finalImageUrl = await addTextToHighResPNG(
          qr, 
          tag.activationCode, 
          tag.owner?.name || tag.profile?.ownerName || '',
          textColor,
          qrBgColor
        );
      }
      
      const link = document.createElement('a');
      link.href = finalImageUrl;
      link.download = `parking-tag-${tag.activationCode}-${(tag.owner?.name || tag.profile?.ownerName || 'unknown').replace(/\s+/g, '-')}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (!useSVG) {
        URL.revokeObjectURL(finalImageUrl);
      }

      if (!tag.isDownloaded) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/api/tags/${tag._id}/downloaded`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            }
          );

          setTags((prev) =>
            prev.map((t) =>
              t._id === tag._id ? { ...t, isDownloaded: true } : t
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

  /* BULK DOWNLOAD ALL TAGS OF A SPECIFIC DATE - High Quality */
  const downloadAllByDate = async (date, tagsList) => {
    if (!tagsList || tagsList.length === 0) {
      alert("No parking tags available for this date");
      return;
    }

    const validTags = tagsList.filter(tag => tag.qrUrl);
    
    if (validTags.length === 0) {
      alert("No tags with QR available for this date");
      return;
    }

    setDownloadingDate(date);

    try {
      const zip = new JSZip();
      const folderName = `parking-tags-${date}-${useSVG ? 'vector' : 'highres'}`;
      const folder = zip.folder(folderName);

      alert(`Downloading ${validTags.length} high-quality parking tags. Please wait...`);

      const chunkSize = 3;
      const results = [];

      for (let i = 0; i < validTags.length; i += chunkSize) {
        const chunk = validTags.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async (tag) => {
          try {
            const qr = createHighQualityQR(tag.qrUrl, qrDotsColor, qrBgColor, 1200);
            let fileExtension = useSVG ? 'svg' : 'png';
            
            if (useSVG) {
              const finalImageUrl = await addTextToSVG(
                qr, 
                tag.activationCode, 
                tag.owner?.name || tag.profile?.ownerName || '',
                textColor,
                qrBgColor
              );
              
              const svgString = decodeURIComponent(finalImageUrl.split(',')[1]);
              const blob = new Blob([svgString], { type: 'image/svg+xml' });
              const filename = `parking-tag-${tag.activationCode}-${(tag.owner?.name || tag.profile?.ownerName || 'unknown').replace(/\s+/g, '-')}.${fileExtension}`;
              folder.file(filename, blob);
            } else {
              const finalImageUrl = await addTextToHighResPNG(
                qr, 
                tag.activationCode, 
                tag.owner?.name || tag.profile?.ownerName || '',
                textColor,
                qrBgColor
              );
              
              const response = await fetch(finalImageUrl);
              const blob = await response.blob();
              const filename = `parking-tag-${tag.activationCode}-${(tag.owner?.name || tag.profile?.ownerName || 'unknown').replace(/\s+/g, '-')}.${fileExtension}`;
              folder.file(filename, blob);
              URL.revokeObjectURL(finalImageUrl);
            }

            return { success: true, tag };
          } catch (error) {
            console.error(`Error processing tag ${tag.activationCode}:`, error);
            return { success: false, tag };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipContent);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `all-parking-tags-${date}-${useSVG ? 'vector' : 'highres'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      alert(`Download complete!\n✅ Successful: ${successful}\n❌ Failed: ${failed}\n📐 Format: ${useSVG ? 'Vector (SVG)' : 'High Resolution PNG'}\n🔍 Perfect quality, no pixelation!`);

    } catch (error) {
      console.error("Error in bulk download:", error);
      alert("Error downloading parking tags. Please try again.");
    } finally {
      setDownloadingDate(null);
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="h-12 w-12 animate-spin border-t-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <FiAlertCircle className="text-4xl mx-auto mb-3" />
        {error}
      </div>
    );
  }

  /* STATUS BADGE */
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

  /* PAGINATION COMPONENT */
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
      <div className="text-sm text-gray-400">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> • 
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalTags)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalTags}</span> Parking Tags
        {isSearching && (
          <span className="ml-2 text-indigo-400">
            (Search results)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
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
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
              currentPage === pageNum ? 'bg-indigo-500 text-white shadow-lg' :
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
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Tags per page:</span>
        <span className="font-medium text-gray-300">{limit}</span>
      </div>
    </div>
  );

  // Component to render QR thumbnail
  const QRThumbnail = ({ tagId }) => {
    const imageData = qrImages[tagId];
    
    if (!imageData) {
      return <img src="/qr.png" alt="QR" className="w-10 h-10" />;
    }
    
    if (useSVG && imageData.startsWith('data:image/svg')) {
      const svgContent = renderSVGThumbnail(imageData);
      if (svgContent) {
        return <div className="w-10 h-10" dangerouslySetInnerHTML={svgContent} />;
      }
    }
    
    return (
      <img
        src={imageData}
        alt="QR Code"
        className="w-10 h-10 object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/qr.png";
        }}
      />
    );
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 text-gray-200 max-w-[100vw] overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">Manage Parking Tags</h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            View, track and manage all parking tag profiles
            <span className="ml-2 text-indigo-400 font-medium">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* Quality Toggle Button */}
          <button
            onClick={() => setUseSVG(!useSVG)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              useSVG 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } text-white shadow-lg`}
          >
            {useSVG ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>SVG</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4z M8 8h8v8H8z"/>
                </svg>
                <span>PNG</span>
              </>
            )}
          </button>

          {/* COLOR CUSTOMIZATION BUTTON */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center gap-2 text-white hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: qrBgColor === 'transparent' ? '#fff' : qrBgColor }}></div>
            <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
            <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: textColor }}></div>
            <span>Customize Colors</span>
          </button>

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
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Date Picker */}
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
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
              <div className="w-px h-4 bg-gray-700" />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          {/* Create Button */}
          <Link
            to="/api/tags/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto group"
          >
            <FiPlus className="text-lg transition-transform duration-300 group-hover:rotate-180" />
            <span className="font-medium">Create Tags</span>
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
              {/* QR Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">QR Background Color</label>
                <div className="flex items-center gap-3">
                  <HexColorPicker color={qrBgColor === 'transparent' ? '#ffffff' : qrBgColor} onChange={(color) => setQrBgColor(color)} />
                  <div className="flex flex-col gap-2">
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

              {/* QR Dots Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">QR Dots Color</label>
                <div className="flex items-center gap-3">
                  <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
                  <div className="flex flex-col gap-2">
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

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                <div className="flex items-center gap-3">
                  <HexColorPicker color={textColor} onChange={setTextColor} />
                  <div className="flex flex-col gap-2">
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

              {/* Preview */}
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

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Parking Tags</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
              <span className="text-indigo-400 text-base sm:text-lg">🏷️</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
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

        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 sm:col-span-2 lg:col-span-1">
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
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20 backdrop-blur-sm">
          <table className="w-full min-w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">✓</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Owner</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Activation Code</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">QR</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Preview</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Download</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedTags.length > 0 ? (
                filteredGroupedTags.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="9" className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="ml-2 text-xs bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-1 rounded-full text-gray-300">
                              {list.length} tags
                            </span>
                          </div>
                          <button
                            onClick={() => downloadAllByDate(date, list)}
                            disabled={downloadingDate === date}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              downloadingDate === date
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer'
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

                    {list.map((tag) => (
                      <tr key={tag._id} className="hover:bg-gray-800/20 transition-colors duration-200">
                        <td className="p-3">
                          <input checked={tag.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={tag.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className={`text-sm ${tag.owner?.name ? "text-gray-200 font-medium" : "text-gray-500"}`}>
                            {tag.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-sm text-indigo-400 max-w-[120px] truncate" title={tag.activationCode}>
                            {tag.activationCode}
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 text-sm">
                          {new Date(tag.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <div className="w-12 h-12 bg-white p-1.5 rounded-lg flex items-center justify-center mx-auto shadow-md overflow-hidden">
                            <QRThumbnail tagId={tag._id} />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => previewQR(tag)}
                            className={`text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 mx-auto ${
                              !tag.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!tag.qrUrl}
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => downloadQR(tag)}
                            className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-1.5 rounded-lg text-white transition-all duration-200 transform hover:scale-105 mx-auto ${
                              !tag.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!tag.qrUrl}
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <Link 
                            to={`${import.meta.env.VITE_DOMAIN}/public/profile/${tag.slug}`}
                            className="text-indigo-400 hover:text-indigo-300 transition text-sm inline-block font-medium hover:underline"
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
                      {searchQuery ? (
                        <>
                          <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No parking tags found for "{searchQuery}"</p>
                          <button
                            onClick={handleClearSearch}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Clear search
                          </button>
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No parking tags available</p>
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

      {/* TABLET VIEW */}
      <div className="hidden md:block lg:hidden">
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20 backdrop-blur-sm">
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
              {filteredGroupedTags.length > 0 ? (
                filteredGroupedTags.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="5" className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              {list.length} tags
                            </span>
                          </div>
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

                    {list.map((tag) => (
                      <tr key={tag._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={tag.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={tag.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className={`text-xs ${tag.owner?.name ? "text-gray-200" : "text-gray-500"}`}>
                            {tag.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs text-indigo-400 truncate" title={tag.activationCode}>
                            {tag.activationCode}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mr-2 shadow-md overflow-hidden">
                              <QRThumbnail tagId={tag._id} />
                            </div>
                            <button
                              onClick={() => previewQR(tag)}
                              className={`text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 ${
                                !tag.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={!tag.qrUrl}
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadQR(tag)}
                              className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-1.5 rounded-lg text-white transition ${
                                !tag.qrUrl ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={!tag.qrUrl}
                            >
                              <FaDownload className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`${import.meta.env.VITE_DOMAIN}/public/profile/${tag.slug}`}
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
                  <td colSpan="5" className="p-6 text-center">
                    <div className="text-gray-400">
                      {searchQuery ? (
                        <>
                          <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No tags found</p>
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                          <p className="text-lg">No parking tags available</p>
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

      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        {filteredGroupedTags.length > 0 ? (
          filteredGroupedTags.map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="mb-3 p-3 bg-gray-800/30 rounded-lg sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                    <span className="ml-2 text-xs bg-indigo-500/20 px-2 py-1 rounded-full text-indigo-300">
                      {list.length} tags
                    </span>
                  </div>
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

              <div className="space-y-3">
                {list.map((tag) => (
                  <div key={tag._id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge active={tag.isActivated} />
                          <span className="text-xs text-gray-400">✓ {tag.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
                        </div>
                        <p className="text-sm font-medium text-white">{tag.owner?.name || "—"}</p>
                        <p className="text-xs text-indigo-400 font-mono mt-1">{tag.activationCode}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(tag.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="w-14 h-14 bg-white p-1.5 rounded-lg shadow-md ml-3 overflow-hidden">
                        <QRThumbnail tagId={tag._id} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700/50">
                      <button onClick={() => previewQR(tag)} disabled={!tag.qrUrl}
                        className="flex-1 py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-center gap-1 hover:bg-blue-500/30 transition-colors">
                        <FaEye size={12} /> Preview
                      </button>
                      <button onClick={() => downloadQR(tag)} disabled={!tag.qrUrl}
                        className="flex-1 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-center gap-1 hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors">
                        <FaDownload size={12} /> Download
                      </button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/public/profile/${tag.slug}`} target="_blank"
                        className="flex-1 py-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 text-xs flex items-center justify-center gap-1 hover:bg-indigo-500/30 transition-colors">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400">No parking tags available</p>
          </div>
        )}
        
        {totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
};

export default ManageParkingTag;
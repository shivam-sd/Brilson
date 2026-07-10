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
    
    const textHeight = 140;
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
    const separatorY = originalHeight + 30;
    const codeY = originalHeight + 90;
    const nameY = originalHeight + 125;
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "60");
    line.setAttribute("y1", separatorY.toString());
    line.setAttribute("x2", (originalWidth - 60).toString());
    line.setAttribute("y2", separatorY.toString());
    line.setAttribute("stroke", textColor);
    line.setAttribute("stroke-opacity", "0.3");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-dasharray", "4,4");
    
    const codeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    codeText.setAttribute("x", centerX.toString());
    codeText.setAttribute("y", codeY.toString());
    codeText.setAttribute("text-anchor", "middle");
    codeText.setAttribute("font-family", "monospace");
    codeText.setAttribute("font-size", "45");
    codeText.setAttribute("font-weight", "bold");
    codeText.setAttribute("fill", textColor);
    codeText.textContent = `Code: ${activationCode}`;
    newSvg.appendChild(codeText);
    
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
      nameText.setAttribute("font-size", "30");
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
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [qrBgColor, setQrBgColor] = useState("transparent");
  const [qrDotsColor, setQrDotsColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [limit] = useState(100);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  useEffect(() => {
    if (tags.length > 0) {
      generateHighQualityQRCodes();
    }
  }, [qrBgColor, qrDotsColor, textColor, useSVG]);

  useEffect(() => {
    fetchTags(currentPage, searchQuery);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchTags(page, searchQuery);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTags(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchTags(1, "");
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

  const groupedTags = tags.reduce((acc, tag) => {
    const date = new Date(tag.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(tag);
    return acc;
  }, {});

  const filteredGroupedTags = Object.entries(groupedTags).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

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
      <div className="text-sm text-gray-400 text-center sm:text-left">
        Page <span className="font-medium text-gray-300">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-300">{totalPages}</span> • 
        Showing <span className="font-medium text-gray-300">{(currentPage - 1) * limit + 1}</span> to{" "}
        <span className="font-medium text-gray-300">
          {Math.min(currentPage * limit, totalTags)}
        </span> of{" "}
        <span className="font-medium text-gray-300">{totalTags}</span>
        {isSearching && (
          <span className="ml-2 text-indigo-400 block sm:inline mt-1 sm:mt-0">
            (Search results)
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
            className={`min-w-[35px] h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
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
    </div>
  );

  const QRThumbnail = ({ tagId }) => {
    const imageData = qrImages[tagId];
    
    if (!imageData) {
      return <img src="/qr.png" alt="QR" className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
    
    if (useSVG && imageData.startsWith('data:image/svg')) {
      const svgContent = renderSVGThumbnail(imageData);
      if (svgContent) {
        return <div className="w-8 h-8 sm:w-10 sm:h-10" dangerouslySetInnerHTML={svgContent} />;
      }
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
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 text-gray-200 max-w-full overflow-x-hidden lg:mt-0 md:mt-0 mt-8">
      {/* HEADER - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-xl sm:text-xl md:text-xl lg:text-xl font-bold">Manage Parking Tags</h4>
          <p className="text-gray-400 mt-1 text-xs">
            View, track and manage all parking tag profiles
            <span className="ml-2 text-indigo-400 font-medium block sm:inline mt-1 sm:mt-0">
              (Page {currentPage} of {totalPages})
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {/* Quality Toggle Button */}
          <button
            onClick={() => setUseSVG(!useSVG)}
            className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base ${
              useSVG 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } text-white shadow-lg`}
          >
            {useSVG ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>SVG</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4z M8 8h8v8H8z"/>
                </svg>
                <span>PNG</span>
              </>
            )}
          </button>

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
            to="/api/tags/bulk"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-sm w-full sm:w-auto"
          > 
            <FiPlus className="text-base transition-transform duration-300 group-hover:rotate-180" />
            <span>Create Tags</span>
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
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Tags</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 text-lg">🏷️</span>
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

      {/* MOBILE VIEW - Optimized for small screens */}
      <div className="block lg:hidden">
        {filteredGroupedTags.length > 0 ? (
          filteredGroupedTags.map(([date, list]) => (
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
                {list.map((tag) => (
                  <div key={tag._id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge active={tag.isActivated} />
                          <span className="text-xs text-gray-400">✓ {tag.isDownloaded ? 'Downloaded' : 'Not Downloaded'}</span>
                        </div>
                        <p className="text-sm font-medium text-white truncate">{tag.owner?.name || "—"}</p>
                        <p className="text-xs text-indigo-400 font-mono mt-1 break-all">{tag.activationCode}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(tag.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-white p-1.5 rounded-lg shadow-md overflow-hidden">
                          <QRThumbnail tagId={tag._id} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-700/50">
                      <button onClick={() => previewQR(tag)} disabled={!tag.qrUrl}
                        className="flex-1 py-1.5 bg-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-center gap-1">
                        <FaEye size={12} /> Preview
                      </button>
                      <button onClick={() => downloadQR(tag)} disabled={!tag.qrUrl}
                        className="flex-1 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-center gap-1">
                        <FaDownload size={12} /> Download
                      </button>
                      <Link to={`${import.meta.env.VITE_DOMAIN}/profile/P/public/${tag.slug}`} target="_blank"
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
            <p className="text-gray-400 text-sm">No parking tags available</p>
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
                <th className="p-3 text-left text-xs font-medium text-gray-300">Activation Code</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">QR</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Preview</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
                <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/30">
              {filteredGroupedTags.length > 0 ? (
                filteredGroupedTags.map(([date, list]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-800/30">
                      <td colSpan="9" className="p-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📅</span>
                            <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                            <span className="text-xs bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-1 rounded-full text-gray-300">
                              {list.length} tags
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

                    {list.map((tag) => (
                      <tr key={tag._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-3">
                          <input checked={tag.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700" />
                        </td>
                        <td className="p-3">
                          <StatusBadge active={tag.isActivated} />
                        </td>
                        <td className="p-3">
                          <span className="text-sm truncate block max-w-[150px]" title={tag.owner?.name}>
                            {tag.owner?.name || "—"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-sm text-indigo-400 truncate max-w-[120px]" title={tag.activationCode}>
                            {tag.activationCode}
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 text-sm whitespace-nowrap">
                          {new Date(tag.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mx-auto shadow-md">
                            <QRThumbnail tagId={tag._id} />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => previewQR(tag)}
                            disabled={!tag.qrUrl}
                            className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => downloadQR(tag)}
                            disabled={!tag.qrUrl}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 p-1.5 rounded-lg text-white transition-all"
                          >
                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <Link 
                            to={`${import.meta.env.VITE_DOMAIN}/profile/P/public/${tag.slug}`}
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
                      <p className="text-sm">No parking tags available</p>
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

export default ManageParkingTag;





















































// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   FiAlertCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
//   FiSearch,
//   FiDownloadCloud,
//   FiEye,
// } from "react-icons/fi";
// import { FaDownload } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { HexColorPicker } from "react-colorful";
// import ParkingTagDesign from "./ManageParkingTag/ParkingTagDesign";
// import ParkingTagPreviewModal from "./ManageParkingTag/PreviewParkingTag";
// import JSZip from 'jszip';

// const ManageParkingTag = () => {
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     activated: 0,
//     inactive: 0,
//   });
//   const [downloading, setDownloading] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

//   const [showColorPicker, setShowColorPicker] = useState(false);

//   // Parking tag specific colors (same as NFC card colors for consistency)
//   const [cardBgColor, setCardBgColor] = useState("#ffffff");
//   const [cardTextColor, setCardTextColor] = useState("#000000");
//   const [qrDotsColor, setQrDotsColor] = useState("#1a1a1a");
//   const [qrBgColor, setQrBgColor] = useState("#ffffff");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCards, setTotalCards] = useState(0);
//   const [limit] = useState(100);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const tagRef = useRef();

//   // Fetch cards 
//   const fetchCards = useCallback(async (page = 1, search = "") => {
//     try {
//       setLoading(true);
//       setIsSearching(!!search);

      
//       const url = `${import.meta.env.VITE_BASE_URL}/api/all/tags?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

//       const token = localStorage.getItem("adminToken");
//       if (!token) {
//         setError("Please login again");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 30000,
//       });

//       // console.log(res)

//       const allCards = res.data.allTags || [];
//       setCards(allCards);
//       setTotalCards(res.data.totalTags || 0);
//       setTotalPages(res.data.totalPages || 1);
//       setCurrentPage(res.data.page || 1);

//       const total = res.data.totalTags || 0;
//       const activated = allCards.filter(card => card.isActivated).length;
//       const inactive = allCards.length - activated;

//       setStats({ total, activated, inactive });

//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//       setError(err.message || "Unable to fetch cards");
//     } finally {
//       setLoading(false);
//     }
//   }, [limit]);

//   useEffect(() => {
//     fetchCards(currentPage, searchQuery);
//   }, []);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       setCurrentPage(page);
//       fetchCards(page, searchQuery);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     fetchCards(1, searchQuery);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setCurrentPage(1);
//     fetchCards(1, "");
//   };

//   // ✅ SINGLE PARKING TAG DOWNLOAD
//   const downloadParkingTag = async (card) => {
//     try {
//       setSelectedCard(card);

//       const loadingDiv = document.createElement('div');
//       loadingDiv.style.cssText = `
//         position: fixed;
//         top: 0; left: 0; right: 0; bottom: 0;
//         background: rgba(0,0,0,0.7);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 9999;
//         flex-direction: column;
//         gap: 15px;
//       `;
//       loadingDiv.innerHTML = `
//         <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//         <p class="text-white text-lg">Generating Parking Tag...</p>
//         <p class="text-gray-400 text-sm">${card.activationCode}</p>
//       `;
//       document.body.appendChild(loadingDiv);

//       const params = new URLSearchParams({
//         cardBgColor, cardTextColor, qrDotsColor, qrBgColor
//       });

//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/api/parking-tags/${card._id}/download?${params.toString()}`,
//         {
//           responseType: 'blob',
//           headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
//           timeout: 60000
//         }
//       );

//       if (loadingDiv.parentNode) {
//         document.body.removeChild(loadingDiv);
//       }

//       if (!response.data || response.data.size === 0) {
//         alert('Download failed: Empty response');
//         return;
//       }

//       const url = URL.createObjectURL(response.data);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `parking-tag-${card.activationCode}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setTimeout(() => URL.revokeObjectURL(url), 5000);

//       // Mark as downloaded
//       try {
//         await axios.patch(
//           `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
//           {},
//           { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
//         );
//         setCards(prev =>
//           prev.map(c =>
//             c._id === card._id ? { ...c, isDownloaded: true } : c
//           )
//         );
//       } catch (err) {
//         console.error('Failed to mark as downloaded:', err);
//       }

//     } catch (error) {
//       console.error("Download Error:", error);
//       const loadingDiv = document.querySelector('div[style*="fixed"]');
//       if (loadingDiv && loadingDiv.parentNode) {
//         document.body.removeChild(loadingDiv);
//       }
      
//       let errorMessage = 'Failed to download parking tag. Please try again.';
//       if (error.response?.status === 401) {
//         errorMessage = 'Session expired. Please login again.';
//         localStorage.removeItem('adminToken');
//       }
//       alert(`❌ ${errorMessage}`);
//     }
//   };

//   // ✅ BULK DOWNLOAD PARKING TAGS
//   const downloadCurrentPageTags = async () => {
//     if (cards.length === 0) {
//       alert("No parking tags available on this page to download");
//       return;
//     }

//     setDownloading(true);
//     setDownloadProgress({ current: 0, total: cards.length });

//     const loadingDiv = document.createElement('div');
//     loadingDiv.id = 'bulk-download-loader';
//     loadingDiv.style.cssText = `
//       position: fixed;
//       top: 0; left: 0; right: 0; bottom: 0;
//       background: rgba(0,0,0,0.85);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 9999;
//       flex-direction: column;
//       gap: 20px;
//       backdrop-filter: blur(5px);
//     `;
//     loadingDiv.innerHTML = `
//       <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//       <p class="text-white text-xl font-semibold">Downloading ${cards.length} Parking Tags...</p>
//       <p class="text-gray-400 text-sm">Page ${currentPage} of ${totalPages}</p>
//       <div class="w-64 bg-gray-700 rounded-full h-2.5">
//         <div id="progress-bar" class="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
//       </div>
//       <p id="progress-text" class="text-gray-400 text-sm">0 / ${cards.length} tags</p>
//       <p id="failed-text" class="text-red-400 text-sm hidden">Failed: 0</p>
//     `;
//     document.body.appendChild(loadingDiv);

//     try {
//       const failedCards = [];
//       const successfulCards = [];
//       const zip = new JSZip();
      
//       const updateProgress = (current, total) => {
//         const progressBar = document.getElementById('progress-bar');
//         const progressText = document.getElementById('progress-text');
//         if (progressBar) {
//           const percentage = (current / total) * 100;
//           progressBar.style.width = `${Math.min(percentage, 100)}%`;
//         }
//         if (progressText) {
//           progressText.textContent = `${current} / ${total} tags`;
//         }
//         setDownloadProgress({ current, total });
//       };

//       const updateFailed = (count) => {
//         const failedText = document.getElementById('failed-text');
//         if (failedText) {
//           failedText.classList.remove('hidden');
//           failedText.textContent = `Failed: ${count}`;
//         }
//       };

//       for (let i = 0; i < cards.length; i++) {
//         const card = cards[i];
//         try {
//           updateProgress(i, cards.length);

//           const params = new URLSearchParams({
//             cardBgColor, cardTextColor, qrDotsColor, qrBgColor
//           });

//           const response = await axios.get(
//             `${import.meta.env.VITE_BASE_URL}/api/parking-tags/${card._id}/download?${params.toString()}`,
//             {
//               responseType: 'blob',
//               headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
//               timeout: 60000
//             }
//           );

//           if (response.data && response.data.size > 0) {
//             const fileName = `parking-tag-${card.activationCode}.png`;
//             zip.file(fileName, response.data);
//             successfulCards.push(card);
            
//             axios.patch(
//               `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
//               {},
//               { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
//             ).catch(err => console.error('Failed to mark as downloaded:', err));
//           } else {
//             failedCards.push(card);
//             updateFailed(failedCards.length);
//           }
//         } catch (error) {
//           console.error(`Failed to download tag ${card.activationCode}:`, error);
//           failedCards.push(card);
//           updateFailed(failedCards.length);
//         }
//       }

//       updateProgress(cards.length, cards.length);

//       if (successfulCards.length === 0) {
//         throw new Error('No parking tags could be downloaded. Please try again.');
//       }

//       const zipBlob = await zip.generateAsync({ 
//         type: 'blob',
//         compression: 'DEFLATE',
//         compressionOptions: { level: 6 }
//       });

//       const loader = document.getElementById('bulk-download-loader');
//       if (loader && loader.parentNode) {
//         document.body.removeChild(loader);
//       }

//       const url = URL.createObjectURL(zipBlob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `brilson-parking-tags-page-${currentPage}.zip`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setTimeout(() => URL.revokeObjectURL(url), 5000);

//       setCards(prev =>
//         prev.map(c => {
//           if (successfulCards.find(sc => sc._id === c._id)) {
//             return { ...c, isDownloaded: true };
//           }
//           return c;
//         })
//       );

//       if (failedCards.length > 0) {
//         alert(`✅ Download Complete with some issues!\n\n📦 Successful: ${successfulCards.length}\n❌ Failed: ${failedCards.length}\n\nFailed tags:\n${failedCards.map(c => c.activationCode).join('\n')}\n\nPlease check the downloaded ZIP.`);
//       } else {
//         alert(`✅ Download Complete!\n\n📦 All ${successfulCards.length} parking tags downloaded successfully!`);
//       }

//     } catch (error) {
//       console.error("Bulk download error:", error);
      
//       const loader = document.getElementById('bulk-download-loader');
//       if (loader && loader.parentNode) {
//         document.body.removeChild(loader);
//       }

//       let errorMessage = 'Download failed. Please try again.';
//       if (error.message) {
//         errorMessage = error.message;
//       } else if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timed out. The server is taking too long to respond.';
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Session expired. Please login again.';
//         localStorage.removeItem('adminToken');
//       }
      
//       alert(`❌ ${errorMessage}`);
//     } finally {
//       setDownloading(false);
//       setDownloadProgress({ current: 0, total: 0 });
//     }
//   };

//   const previewTag = (card) => {
//     setSelectedCard(card);
//     setPreviewOpen(true);
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = 5;

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
//     } else {
//       if (currentPage <= 3) {
//         pageNumbers.push(1, 2, 3, 4, "...", totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
//       }
//     }
//     return pageNumbers;
//   };

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
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//       active ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
//     }`}>
//       {active ? "Active" : "Inactive"}
//     </span>
//   );

//   const Pagination = () => (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-gray-800/30 rounded-lg">
//       <div className="text-xs sm:text-sm text-gray-400">
//         Page {currentPage} of {totalPages} • Showing {(currentPage - 1) * limit + 1} to{" "}
//         {Math.min(currentPage * limit, totalCards)} of {totalCards}
//         {isSearching && <span className="ml-2 text-indigo-400">(Search results)</span>}
//         {downloading && (
//           <span className="ml-2 text-yellow-400">
//             (Downloading: {downloadProgress.current}/{downloadProgress.total})
//           </span>
//         )}
//       </div>
//       <div className="flex items-center gap-1 flex-wrap">
//         <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
//           className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronsLeft size={16} />
//         </button>
//         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
//           className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
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
//           className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronRight size={16} />
//         </button>
//         <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
//           className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
//           <FiChevronsRight size={16} />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="px-3 sm:px-4 md:px-6 lg:px-2 py-4 text-gray-200 max-w-full overflow-x-hidden">
//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6 lg:mt-0 mt-11">
//         <div className="w-full lg:w-auto text-center lg:text-left">
//           <h4 className="text-xl font-bold">Manage Parking Tags</h4>
//           <p className="text-gray-400 mt-1 text-xs">
//             View, track and manage all parking tag profiles
//             <span className="ml-2 text-indigo-400 font-medium block sm:inline">
//               (Page {currentPage} of {totalPages})
//             </span>
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
//           {/* Bulk Download Button */}
//           <button
//             onClick={downloadCurrentPageTags}
//             disabled={downloading || cards.length === 0}
//             className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white transition-all cursor-pointer text-sm sm:text-base ${
//               downloading || cards.length === 0
//                 ? 'bg-gray-600 cursor-not-allowed opacity-50'
//                 : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
//             }`}
//           >
//             {downloading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>{downloadProgress.current}/{downloadProgress.total}</span>
//               </>
//             ) : (
//               <>
//                 <FiDownloadCloud size={16} />
//                 <span>Download Tags ({cards.length})</span>
//               </>
//             )}
//           </button>

//           <button
//             onClick={() => setShowColorPicker(!showColorPicker)}
//             className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center gap-2 text-white hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
//           >
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardBgColor }}></div>
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: cardTextColor }}></div>
//             <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: qrDotsColor }}></div>
//             <span className="hidden xs:inline">Customize Tag</span>
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
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* COLOR PICKER MODAL */}
//       {showColorPicker && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
//           <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-white">Customize Parking Tag</h3>
//               <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Tag Background Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={cardBgColor} onChange={setCardBgColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setCardBgColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-white rounded border border-gray-600"></div>White
//                       </button>
//                       <button onClick={() => setCardBgColor("#0a0a1a")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#0a0a1a] rounded"></div>Dark Blue
//                       </button>
//                       <button onClick={() => setCardBgColor("#1a1a2e")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#1a1a2e] rounded"></div>Navy
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Tag Text Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={cardTextColor} onChange={setCardTextColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setCardTextColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-black rounded border border-gray-600"></div>Black
//                       </button>
//                       <button onClick={() => setCardTextColor("#ffffff")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-white rounded"></div>White
//                       </button>
//                       <button onClick={() => setCardTextColor("#E1C48A")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#E1C48A] rounded"></div>Gold
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">QR Dots Color</label>
//                   <div className="flex flex-col gap-3">
//                     <HexColorPicker color={qrDotsColor} onChange={setQrDotsColor} />
//                     <div className="flex gap-2 flex-wrap">
//                       <button onClick={() => setQrDotsColor("#1a1a1a")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#1a1a1a] rounded border border-gray-600"></div>Dark
//                       </button>
//                       <button onClick={() => setQrDotsColor("#d4a843")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                         <div className="w-4 h-4 bg-[#d4a843] rounded"></div>Gold
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
//                       <div className="w-4 h-4 bg-white rounded border border-gray-600"></div>White
//                     </button>
//                     <button onClick={() => setQrBgColor("transparent")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700">Transparent</button>
//                     <button onClick={() => setQrBgColor("#000000")} className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center gap-2">
//                       <div className="w-4 h-4 bg-black rounded"></div>Black
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Live Preview */}
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <p className="text-sm text-gray-400 text-center mb-3">🏷️ Live Parking Tag Preview</p>
//                 <div className="flex justify-center">
//                   <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden">
//                     <ParkingTagDesign
//                       ref={tagRef}
//                       activationCode="PREVIEW-12345-67890"
//                       cardBgColor={cardBgColor}
//                       cardTextColor={cardTextColor}
//                       qrDotsColor={qrDotsColor}
//                       qrBgColor={qrBgColor}
//                     />
//                   </div>
//                 </div>
//               </div>
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
//             <div><p className="text-gray-400 text-xs mb-1">Total Tags</p><p className="text-2xl font-bold">{stats.total}</p></div>
//             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
//               <span className="text-indigo-400 text-lg">🏷️</span>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
//           <div className="flex items-center justify-between">
//             <div><p className="text-gray-400 text-xs mb-1">Activated</p><p className="text-2xl font-bold text-green-400">{stats.activated}</p></div>
//             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
//               <span className="text-green-400 text-lg">✓</span>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
//           <div className="flex items-center justify-between">
//             <div><p className="text-gray-400 text-xs mb-1">Inactive</p><p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p></div>
//             <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
//               <span className="text-yellow-400 text-lg">⏸</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TABLE VIEW */}
//       <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
//         <table className="w-full min-w-[900px]">
//           <thead className="bg-gray-800/50 border-b border-gray-700/50">
//             <tr>
//               <th className="p-3 text-left text-xs font-medium text-gray-300">✓</th>
//               <th className="p-3 text-left text-xs font-medium text-gray-300">Status</th>
//               <th className="p-3 text-left text-xs font-medium text-gray-300">Owner</th>
//               <th className="p-3 text-left text-xs font-medium text-gray-300">Activation</th>
//               <th className="p-3 text-left text-xs font-medium text-gray-300">Created</th>
//               <th className="p-3 text-center text-xs font-medium text-gray-300">Preview</th>
//               <th className="p-3 text-center text-xs font-medium text-gray-300">Download</th>
//               <th className="p-3 text-center text-xs font-medium text-gray-300">Profile</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700/30">
//             {cards.length > 0 ? (
//               cards.map((card) => (
//                 <tr key={card._id} className="hover:bg-gray-800/20 transition-colors">
//                   <td className="p-3">
//                     <input checked={card.isDownloaded} readOnly type="checkbox" className="w-4 h-4 rounded" />
//                   </td>
//                   <td className="p-3"><StatusBadge active={card.isActivated} /></td>
//                   <td className="p-3">
//                     <span className="text-sm truncate block max-w-[150px]" title={card.owner?.name}>
//                       {card.owner?.name || "—"}
//                     </span>
//                   </td>
//                   <td className="p-3">
//                     <div className="font-mono text-sm text-indigo-400 truncate max-w-[100px]" title={card.activationCode}>
//                       {card.activationCode}
//                     </div>
//                   </td>
//                   <td className="p-3 text-gray-400 text-sm whitespace-nowrap">
//                     {new Date(card.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => previewTag(card)}
//                       disabled={!card.qrUrl}
//                       className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
//                       title="Preview Tag"
//                     >
//                       <FiEye className="w-4 h-4" />
//                     </button>
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => downloadParkingTag(card)}
//                       disabled={!card.qrUrl}
//                       className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition-all"
//                       title="Download Parking Tag"
//                     >
//                       <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
//                     </button>
//                   </td>
//                   <td className="p-3 text-center">
//                     <Link
//                       to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
//                       className="text-indigo-400 hover:text-indigo-300 transition text-xs font-medium hover:underline"
//                       target="_blank"
//                     >
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="p-6 text-center">
//                   <div className="text-gray-400">
//                     <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
//                     <p className="text-sm">No parking tags available</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && <Pagination />}

//       {/* Hidden download tag element */}
//       <div className="fixed -left-[99999px] -top-[99999px]">
//         <div id="download-tag">
//           {selectedCard && (
//             <ParkingTagDesign
//               ref={tagRef}
//               activationCode={selectedCard.activationCode}
//               cardBgColor={cardBgColor}
//               cardTextColor={cardTextColor}
//               qrDotsColor={qrDotsColor}
//               qrBgColor={qrBgColor}
//             />
//           )}
//         </div>
//       </div>

//       <ParkingTagPreviewModal
//         isOpen={previewOpen}
//         onClose={() => setPreviewOpen(false)}
//         card={selectedCard}
//         cardBgColor={cardBgColor}
//         cardTextColor={cardTextColor}
//         qrDotsColor={qrDotsColor}
//         qrBgColor={qrBgColor}
//       />
//     </div>
//   );
// };

// export default ManageParkingTag;

import React, { useEffect, useState } from "react";
import { FiPlus, FiAlertCircle } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCodeStyling from "qr-code-styling";

/* QR CREATOR */
const createQR = (url) =>
  new QRCodeStyling({
    width: 300,
    height: 300,
    data: url,
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
  
  const BASE_PUBLIC_URL = `${import.meta.env.VITE_DOMAIN}/c/card`;

  /* FETCH CARDS */
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/all/cards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const allCards = res.data.allCards || [];
        setCards(allCards);
        
        // Calculate stats
        const total = allCards.length;
        const activated = allCards.filter(card => card.isActivated).length;
        const inactive = total - activated;
        
        setStats({ total, activated, inactive });

        // Generate QR images for all cards using activation code
        const qrPromises = allCards.map(async (card) => {
          try {
            const qrUrl = `${BASE_PUBLIC_URL}/${card.activationCode}`;
            const qr = createQR(qrUrl);
            const blob = await qr.getRawData("png");
            const imageUrl = URL.createObjectURL(blob);
            return { activationCode: card.activationCode, imageUrl };
          } catch (err) {
            console.error(`Error generating QR for ${card.activationCode}:`, err);
            return { activationCode: card.activationCode, imageUrl: null };
          }
        });

        const qrResults = await Promise.all(qrPromises);
        const qrMap = {};
        qrResults.forEach(result => {
          qrMap[result.activationCode] = result.imageUrl;
        });
        setQrImages(qrMap);

      } catch (err) {
        console.error(err);
        setError("Unable to fetch cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  /* GROUP BY DATE */
  const groupedCards = cards.reduce((acc, card) => {
    const date = new Date(card.createdAt).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(card);
    return acc;
  }, {});

  const filteredGroupedCards = Object.entries(groupedCards).filter(
    ([date]) => !selectedDate || date === selectedDate
  );

  /* PREVIEW QR */
  const previewQR = async (activationCode) => {
    if (!activationCode) {
      alert("Activation code is required");
      return;
    }
    
    const qrUrl = `${BASE_PUBLIC_URL}/${activationCode}`;
    const qr = createQR(qrUrl);
    const blob = await qr.getRawData("png");
    const imgUrl = URL.createObjectURL(blob);

    const win = window.open("", "_blank", "width=420,height=480");
    win.document.write(`
      <body style="margin:0;background:#0b1220;display:flex;justify-content:center;align-items:center">
        <img src="${imgUrl}" style="background:#fff;padding:20px;border-radius:16px" />
      </body>
    `);
  };

  /* DOWNLOAD QR */
  const downloadQR = async (card) => {
    if (!card.activationCode) {
      alert("Activation code is required");
      return;
    }
    
    const qrUrl = `${BASE_PUBLIC_URL}/${card.activationCode}`;
    const qr = createQR(qrUrl);
    
    // Download with activation code as filename
    qr.download({ 
      name: `card-${card.activationCode}`, 
      extension: "png" 
    });

    // Track download status
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

  /* UI */
  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 text-gray-200 max-w-[100vw] overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">Manage NFC Cards</h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">View, track and manage all NFC card profiles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
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

          {/* Create Button */}
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

      {/* DESKTOP TABLE - LARGE SCREENS */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
        <table className="w-full min-w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700/50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">✓</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Activation Code</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Status</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Owner</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Created</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">QR</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Preview</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Download</th>
              <th className="p-3 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Profile</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700/30">
            {filteredGroupedCards.map(([date, list]) => (
              <React.Fragment key={date}>
                <tr className="bg-gray-800/30">
                  <td colSpan="9" className="p-3 font-medium text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(date).toLocaleDateString("en-GB")}</span>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                        {list.length} cards
                      </span>
                    </div>
                  </td>
                </tr>

                {list.map((card) => (
                  <tr 
                    key={card._id} 
                    className="hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        checked={card.isDownloaded}
                        readOnly
                        type="checkbox"
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-xs text-indigo-400" title={card.activationCode}>
                        {card.activationCode}
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge active={card.isActivated} />
                    </td>
                    <td className="p-3">
                      <span className={`text-xs ${card.profile?.name ? "text-gray-200" : "text-gray-500"}`}>
                        {card.profile?.name || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <div className="w-12 h-12 bg-white p-1.5 rounded-lg flex items-center justify-center mx-auto">
                        {qrImages[card.activationCode] ? (
                          <img
                            src={qrImages[card.activationCode]}
                            alt="QR Code"
                            className="w-10 h-10"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/qr.png";
                            }}
                          />
                        ) : (
                          <img
                            src="/qr.png"
                            alt="Demo QR"
                            className="w-10 h-10"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => previewQR(card.activationCode)}
                        className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50 mx-auto"
                        title="Preview QR"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => downloadQR(card)}
                        className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition mx-auto"
                        title="Download QR"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      {card.slug ? (
                        <a
                          href={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition text-xs underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLET VIEW - MEDIUM SCREENS */}
      <div className="hidden md:block lg:hidden overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-900/20">
        <table className="w-full min-w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700/50">
            <tr>
              <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">✓</th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Activation Code</th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Status</th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Owner</th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 whitespace-nowrap">Created</th>
              <th className="p-2 text-center text-xs font-medium text-gray-300 whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700/30">
            {filteredGroupedCards.map(([date, list]) => (
              <React.Fragment key={date}>
                <tr className="bg-gray-800/30">
                  <td colSpan="6" className="p-3 font-medium text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(date).toLocaleDateString("en-GB")}</span>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                        {list.length} cards
                      </span>
                    </div>
                  </td>
                </tr>

                {list.map((card) => (
                  <tr 
                    key={card._id} 
                    className="hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        checked={card.isDownloaded}
                        readOnly
                        type="checkbox"
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-xs text-indigo-400 truncate max-w-[120px]" title={card.activationCode}>
                        {card.activationCode}
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge active={card.isActivated} />
                    </td>
                    <td className="p-3">
                      <span className={`text-xs ${card.profile?.name ? "text-gray-200" : "text-gray-500"}`}>
                        {card.profile?.name || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center mr-2">
                          {qrImages[card.activationCode] ? (
                            <img
                              src={qrImages[card.activationCode]}
                              alt="QR Code"
                              className="w-8 h-8"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/qr.png";
                              }}
                            />
                          ) : (
                            <img
                              src="/qr.png"
                              alt="Demo QR"
                              className="w-8 h-8"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => previewQR(card.activationCode)}
                          className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800/50"
                          title="Preview QR"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadQR(card)}
                          className="bg-cyan-500 hover:bg-cyan-600 p-1.5 rounded-lg text-black transition"
                          title="Download QR"
                        >
                          <FaDownload className="w-4 h-4" />
                        </button>
                        {card.slug && (
                          <a
                            href={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition text-xs px-2 py-1 border border-indigo-500/50 rounded"
                          >
                            Profile
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        {filteredGroupedCards.map(([date, list]) => (
          <div key={date} className="mb-6">
            {/* Date Header */}
            <div className="mb-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="font-medium text-gray-300">{new Date(date).toLocaleDateString("en-GB")}</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                  {list.length} cards
                </span>
              </div>
            </div>

            {/* Cards List */}
            <div className="space-y-4">
              {list.map((card) => (
                <div 
                  key={card._id} 
                  className="bg-gray-900/20 border border-gray-700/50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        checked={card.isDownloaded}
                        readOnly
                        type="checkbox"
                        className="w-4 h-4 rounded"
                      />
                      <div>
                        <div className="font-mono text-sm text-indigo-400">
                          {card.activationCode}
                        </div>
                        <StatusBadge active={card.isActivated} />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-300">
                        {card.profile?.name || "No owner"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* QR Preview */}
                    <div className="w-16 h-16 bg-white p-1.5 rounded-lg flex items-center justify-center">
                      {qrImages[card.activationCode] ? (
                        <img
                          src={qrImages[card.activationCode]}
                          alt="QR Code"
                          className="w-14 h-14"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/qr.png";
                          }}
                        />
                      ) : (
                        <img
                          src="/qr.png"
                          alt="Demo QR"
                          className="w-14 h-14"
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => previewQR(card.activationCode)}
                        className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800/50 flex items-center gap-1"
                        title="Preview QR"
                      >
                        <FaEye className="w-4 h-4" />
                        <span className="text-xs">Preview</span>
                      </button>
                      
                      <button
                        onClick={() => downloadQR(card)}
                        className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg text-black transition flex items-center gap-1"
                        title="Download QR"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span className="text-xs">Download</span>
                      </button>
                      
                      {card.slug && (
                        <a
                          href={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition text-xs p-2 border border-indigo-500/50 rounded text-center"
                        >
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCards;
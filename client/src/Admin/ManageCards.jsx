import {
  FiCreditCard,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  /*  FETCH  */
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/all/cards`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setCards(res.data?.allCards || []);
      } catch {
        setError("Unable to fetch cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

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

  /*  ACTIONS  */
  const previewQR = (src) => {
    const win = window.open();
    win.document.write(`
      <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#0b1220">
        <img src="${src}" style="max-width:90%;background:white;padding:20px;border-radius:16px"/>
      </body>
    `);
  };

  const downloadQR = async (card) => {
    const a = document.createElement("a");
    a.href = card.qrCode;
    a.download = `brilson-${card.cardId}.png`;
    a.click();
    // console.log(card)
    try {
      await axios.patch(
        // /cards/:id/downloaded
        `${import.meta.env.VITE_BASE_URL}/api/cards/${card._id}/downloaded`,
        { withCredentials: true }
      );

      setCards((prev) =>
        prev.map((c) => (c._id === card._id ? { ...c, isDownloaded: true } : c))
      );
    } catch {
      console.error("Failed to mark downloaded");
    }
  };

  /*  STATES  */
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

  /*  UI  */
  return (
    <div className="px-4 md:px-8 py-6 text-gray-200 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Manage NFC Cards</h1>

        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#0b1220] border border-gray-700 px-4 py-2 rounded-lg"
          />

          <Link
            to="/api/cards/bulk"
            className="bg-indigo-600 px-5 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <FiPlus /> Create
          </Link>
        </div>
      </div>

      {/*  DESKTOP TABLE  */}
      <div className="hidden md:block bg-[#0b1220] rounded-2xl border border-white/5 overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="border-b border-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3">✓</th>
              <th>Card ID</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Activation</th>
              <th>Date</th>
              <th>QR</th>
              <th>Preview</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            {filteredGroupedCards.map(([date, list]) => (
              <>
                <tr key={date}>
                  <td
                    colSpan="9"
                    className="px-6 py-3 bg-black/30 font-semibold"
                  >
                    📅 {new Date(date).toLocaleDateString("en-GB")}
                  </td>
                </tr>

                {list.map((card) => (
                  <tr key={card._id} className="border-b border-gray-800">
                    <td className="px-6">
                      <input
                        checked={card.isDownloaded}
                        readOnly
                        type="checkbox"
                      />
                    </td>
                    <td className="font-mono">{card.cardId}</td>
                    <td>
                      <StatusBadge active={card.isActivated} />
                    </td>
                    <td>{card.profile?.name || "—"}</td>
                    <td className="text-indigo-400 font-mono">
                      {card.activationCode}
                    </td>
                    <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                    <td>
                      <img
                        src={card.qrCode}
                        className="w-10 bg-white p-1 rounded"
                      />
                    </td>
                    <td>
                      <FaEye
                        onClick={() => previewQR(card.qrCode)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => downloadQR(card)}
                        className="bg-cyan-500 p-2 rounded text-black cursor-pointer"
                      >
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/*  MOBILE CARDS  */}
      <div className="md:hidden space-y-6">
        {filteredGroupedCards.map(([date, list]) => (
          <div key={date}>
            <h3 className="mb-2 text-sm text-gray-400 font-semibold">
            📅 {new Date(date).toLocaleDateString("en-GB")}
            </h3>

            <div className="space-y-4">
              {list.map((card) => (
                <div
                  key={card._id}
                  className="bg-[#0b1220] border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">{card.cardId}</span>
                    <StatusBadge active={card.isActivated} />
                  </div>

                  <p className="text-sm text-gray-400">
                    Owner: {card.profile?.name || "—"}
                  </p>

                  <p className="font-mono text-indigo-400 text-sm">
                    {card.activationCode}
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={card.qrCode}
                      className="w-16 bg-white p-2 rounded-lg"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => previewQR(card.qrCode)}
                        className="p-2 bg-white/10 rounded"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => downloadQR(card)}
                        className="p-2 bg-cyan-500 rounded text-black"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={card.isDownloaded}
                      readOnly
                    />
                    Downloaded
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/*  STATUS BADGE  */
const StatusBadge = ({ active }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      active
        ? "bg-green-500/20 text-green-400"
        : "bg-yellow-500/20 text-yellow-400"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

export default ManageCards;

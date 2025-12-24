import {
  FiCreditCard,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaDownload, FaEye } from "react-icons/fa";
import axios from "axios";

const ManageCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activated: 0,
    unactivated: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchCards = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/all/cards`,
          { signal: controller.signal, withCredentials: true, headers:{
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          } }
        );

        const allCards = res.data?.allCards || [];
        const activated = allCards.filter((c) => c.isActivated).length;
        // console.log(res)
        setCards(allCards);
        setStats({
          total: allCards.length,
          activated,
          unactivated: allCards.length - activated,
        });
      } catch (err) {
        if (!axios.isCancel(err)) setError("Unable to fetch card data");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
    return () => controller.abort();
  }, []);

  /*  QR Download  */

  const downloadQR = (dataUrl, cardId) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `brilson-card-${cardId}.png`;
    link.click();
  };

  const previewQR = (dataUrl) => {
    const win = window.open();
    win.document.write(`
      <html>
        <head>
          <title>QR Preview</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #0b1220;
              height: 100vh;
            }
            img {
              max-width: 90%;
              background: white;
              padding: 20px;
              border-radius: 16px;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
  };

  /*  LOADING  */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-indigo-500 rounded-full" />
      </div>
    );
  }

  /*  ERROR  */
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-400">
            Failed to load cards
          </h2>
          <p className="text-gray-300 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 px-5 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 text-gray-200 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Manage NFC Cards</h1>
          <p className="text-gray-400 mt-1">
            View, track and manage all NFC card profiles
          </p>
        </div>

        <Link
          to="/api/cards/bulk"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white font-medium transition"
        >
          <FiPlus /> Create Cards
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Cards" value={stats.total} icon={<FiCreditCard />} />
        <StatCard title="Activated" value={stats.activated} icon={<FiCheckCircle />} />
        <StatCard title="Inactive" value={stats.unactivated} icon={<FiClock />} />
      </div>

      {/* TABLE */}
      <div className="bg-[#0b1220] rounded-2xl shadow-xl border border-white/5">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Card List</h2>
          <span className="text-sm text-gray-400">{cards.length} cards</span>
        </div>

        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-6 text-left">Card ID</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Owner</th>
                  <th className="py-3 px-6">Activation Code</th>
                  <th className="py-3 px-6">Created</th>
                  <th className="py-3 px-6">QR</th>
                  <th className="py-3 px-6">Preview</th>
                  <th className="py-3 px-6">Download</th>
                  <th className="py-3 px-6">Profile</th>
                </tr>
              </thead>

              <tbody>
                {cards.map((card) => (
                  <tr
                    key={card._id}
                    className="border-b border-gray-800 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-mono">{card.cardId}</td>
                    <td className="text-center">
                      <StatusBadge active={card.isActivated} />
                    </td>
                    <td className="px-6">{card.profile?.name || "—"}</td>
                    <td className="px-6 font-mono text-indigo-400">
                      {card.activationCode || "—"}
                    </td>
                    <td className="px-6 text-gray-400">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6">
                      <img
                        src={card.qrCode}
                        alt="QR"
                        className="w-12 bg-white p-1 rounded-lg"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => previewQR(card.qrCode)}
                        className="p-2 rounded-lg hover:bg-white/10 text-cyan-400"
                        title="Preview QR"
                      >
                        <FaEye className="cursor-pointer" />
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => downloadQR(card.qrCode, card.cardId)}
                        className="p-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400"
                        title="Download QR"
                      >
                        <FaDownload />
                      </button>
                    </td>
                    <td>
                      <Link className="text-blue-600 hover:border-b-2" to={`${import.meta.env.VITE_DOMAIN}/public/profile/${card.slug}`}>Profile</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/*  SUB COMPONENTS  */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#0b1220] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
      ${
        active
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
  >
    {active ? <FiCheckCircle /> : <FiClock />}
    {active ? "Active" : "Inactive"}
  </span>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <FiCreditCard className="text-5xl text-gray-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-300">No Cards Found</h3>
    <p className="text-gray-500 mt-1">Start by creating a new batch of cards</p>
    <Link
      to="/api/cards/bulk"
      className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-white"
    >
      Create Cards
    </Link>
  </div>
);

export default ManageCards;

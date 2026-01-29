import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ChevronDown, ChevronUp, Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const UserAllCards = ({ cards = [],
  showAllCards,
  setShowAllCards,}) => {
    return(<>
    
    {/* All card of the User */}

{/* Cards Dropdown Desktop*/}
{cards.length > 0 && (
  <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl p-3 cursor-pointer">
    <button
      onClick={() => setShowAllCards(!showAllCards)}
      className="flex items-center justify-between w-full cursor-pointer" 
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20">
          <Briefcase className="text-emerald-400" size={18} />
        </div>
        <div className="text-left">
          <p className="text-white font-medium">My Cards</p>
          <p className="text-xs text-gray-400">{cards.length} cards available</p>
        </div>
      </div>
      {showAllCards ? (
        <ChevronUp className="text-gray-400" size={20} />
      ) : (
        <ChevronDown className="text-gray-400" size={20} />
      )}
    </button>

    <AnimatePresence>
      {showAllCards && (
        <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="absolute right-0.5 top-15 rounded-lg mt-3 space-y-2  bg-gradient-to-r from-slate-800 to-slate-900"
        >
          {cards.map((card, index) => (
            <motion.div
            key={card._id || index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-cyan-300">
                      {card.profile?.name?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {card.profile?.name || "Card"}
                    </p>
                    <p className="text-xs mt-1 text-gray-400 truncate">
                      {card.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/profile/${card.activationCode}`}
                    className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 transition-colors"
                    >
                    <Eye className="text-blue-400" size={16} />
                  </Link>
                  <Link
                  to={`/profile/edit/${card.activationCode}`}
                    className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 transition-colors"
                    >
                    <Pencil className="text-yellow-400" size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}
    
    </>)
}

export default UserAllCards;
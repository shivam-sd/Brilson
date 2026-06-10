const RecentCards = ({ cards }) => {
  return (
    <div className="
      bg-[#0f172a]
      border border-[#1e293b]
      rounded-2xl
      p-5
      h-full
    ">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-white text-xl font-semibold">
          Recent Cards
        </h2>

        <button
          className="
          text-xs
          bg-[#1e293b]
          text-gray-300
          px-3 py-2
          rounded-lg
          hover:bg-[#334155]
          "
        >
          View All Cards
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#1e293b] 
            flex
            items-center
            justify-between
            
            ">

              <th className="text-left text-gray-400 text-sm pb-3">
                Card ID
              </th>
{/* 
              <th className="text-left text-gray-400 text-sm pb-3">
                Owner
              </th> */}

              <th className="text-left text-gray-400 text-sm pb-3">
                Status
              </th>

              <th className="text-left text-gray-400 text-sm pb-3">
                Created
              </th>

            </tr>

          </thead>

          <tbody>

            {cards?.map((card) => (

              <tr
                key={card._id}
                className="
                border-b
                border-[#1e293b]
                hover:bg-[#111827]
                transition
                flex
                items-center
                justify-between
                gap-4
                "
              >

                <td className="py-4 text-gray-300 text-sm font-medium">
                  {card.activationCode}
                </td>

                {/* <td className="py-4 text-white text-sm">
                  {card?.profile?.name || "N/A"}
                </td> */}

                <td className="py-4">

                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      card.isActivated
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }
                  `}
                  >
                    {card.isActivated
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                <td className="py-4 text-gray-400 text-sm">

                  {new Date(
                    card.createdAt
                  ).toLocaleDateString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentCards;
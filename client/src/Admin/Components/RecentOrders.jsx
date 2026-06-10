const RecentOrders = ({ orders }) => {
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
          Recent Orders
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
          View All Orders
        </button>

      </div>

      <div className="w-full ">

        <table className="w-full overflow-x-auto">

          <thead className="overflow-x-auto">

            <tr className="border-b border-[#1e293b] flex
                items-center
                justify-between
                gap-4">

              <th className="text-left text-gray-400 text-sm pb-3">
                Order ID
              </th>

              <th className="lg:flex hidden text-left text-gray-400 text-sm pb-3">
                Customer
              </th>

              <th className="text-left text-gray-400 text-sm pb-3">
                Amount
              </th>

              <th className="text-left text-gray-400 text-sm pb-3">
                Status
              </th>

              <th className="text-left text-gray-400 text-sm pb-3">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {orders?.map((order) => (

              <tr
                key={order._id}
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
                  #{order._id.slice(-6)}
                </td>

                <td className="lg:flex hidden py-4 text-white text-sm">
                  {order.address?.name.slice(0, 6) || "N/A"}
                </td>

                <td className="py-4 text-white font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="py-4">

                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      order.orderStatus === "completed"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }
                  `}
                  >
                    {order.orderStatus}
                  </span>

                </td>

                <td className="py-4 text-gray-400 text-sm">

                  {new Date(
                    order.createdAt
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

export default RecentOrders;
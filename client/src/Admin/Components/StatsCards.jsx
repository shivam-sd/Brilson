import {
  FiShoppingBag,
  FiUsers,
  FiCreditCard,
  FiDollarSign
} from "react-icons/fi";

const StatsCards = ({data}) => {

  const cards = [
    {
      title:"Orders",
      value:data.totalOrders,
      icon:<FiShoppingBag/>
    },
    {
      title:"Customers",
      value:data.totalCustomers,
      icon:<FiUsers/>
    },
    {
      title:"Cards",
      value:data.totalCards,
      icon:<FiCreditCard/>
    },
    {
      title:"Revenue",
      value:`₹${data.totalRevenue}`,
      icon:<FiDollarSign/>
    }
  ];

  return (
    <div className="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-6">
      {cards.map((item,index)=>(
        <div
          key={index}
          className="bg-[#111827]
          rounded-2xl
          px-2
          py-4
          border
          border-gray-700 
          cursor-pointer
          "
        >
          <div className="text-white flex items-center justify-center gap-2">
          <span>{item.icon}</span>
          <p className="text-gray-400 text-md">
            {item.title}
          </p>
          </div>


          <h2 className="text-white text-xl lg:text-3xl md:text-3xl font-bold flex items-center justify-center mt-4">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
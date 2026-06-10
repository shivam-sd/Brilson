const Order = require("../../models/Order.model");
const User = require("../../models/User.model");
const CardProfile = require("../../models/CardProfile");

const AdminDashboardController =  async (req, res) => {
  try {

    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments();

    const totalCards = await CardProfile.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const totalRevenue =
      revenueData.length > 0
        ? revenueData[0].totalRevenue
        : 0;

    const activeCards =
      await CardProfile.countDocuments({
        isActivated: true
      });

    const inactiveCards =
      await CardProfile.countDocuments({
        isActivated: false
      });

    const recentOrders =
      await Order.find()
        .sort({ createdAt: -1 })
        .limit(5);

    const recentCards =
      await CardProfile.find()
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
      totalOrders,
      totalCustomers,
      totalCards,
      totalRevenue,
      activeCards,
      inactiveCards,
      recentOrders,
      recentCards
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getOverviewChart = async (req, res) => {
  try {

    const currentYear = new Date().getFullYear();

    const monthlyData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },

          totalRevenue: {
            $sum: "$totalAmount"
          },

          totalOrders: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id": 1
        }
      }
    ]);

    const monthlyData2 = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },


          totalCustomers: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id": 1
        }
      }
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

const formattedData = months.map((month, index) => {

  const foundOrders = monthlyData.find(
    item => item._id === index + 1
  );

  const foundCustomers = monthlyData2.find(
    item => item._id === index + 1
  );

  return {
    month,
    revenue: foundOrders?.totalRevenue || 0,
    orders: foundOrders?.totalOrders || 0,
    customers: foundCustomers?.totalCustomers || 0
  };
});

res.status(200).json({
      success: true,
      chartData: formattedData
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch chart data"
    });

  }
};



module.exports = { AdminDashboardController, getOverviewChart };
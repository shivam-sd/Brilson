const Order = require("../../models/Order.model");
const User = require("../../models/User.model");
const CardProfile = require("../../models/CardProfile");

const AdminDashboardController = async (req, res) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalCards,
      revenueData,
      cardStatusData,
      recentOrders,
      recentCards
    ] = await Promise.all([
      Order.countDocuments(),

      User.countDocuments(),

      CardProfile.countDocuments(),

      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $ifNull: ["$totalAmount", 0]
              }
            }
          }
        }
      ]),

      CardProfile.aggregate([
        {
          $group: {
            _id: null,
            activeCards: {
              $sum: {
                $cond: [{ $eq: ["$isActivated", true] }, 1, 0]
              }
            },
            inactiveCards: {
              $sum: {
                $cond: [{ $eq: ["$isActivated", false] }, 1, 0]
              }
            }
          }
        }
      ]),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      CardProfile.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const activeCards = cardStatusData[0]?.activeCards || 0;
    const inactiveCards = cardStatusData[0]?.inactiveCards || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        totalCards,
        totalRevenue,
        activeCards,
        inactiveCards,
        recentOrders,
        recentCards
      }
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data"
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
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
      success: false,
      message: "Failed to fetch chart data"
    });

  }
};



module.exports = { AdminDashboardController, getOverviewChart };
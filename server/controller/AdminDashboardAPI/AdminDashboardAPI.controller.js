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

module.exports = { AdminDashboardController };
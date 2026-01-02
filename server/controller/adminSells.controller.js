const OrderModel = require("../models/Order.model");

const getSellingOverview = async (req, res) => {
  try {
    const { type, date, month, year } = req.query;

    let matchStage = {};
    let groupStage = {};

    //  DAY FILTER 
    if (type === "day") {
      const selectedDate = new Date(date);

      const start = new Date(selectedDate.setHours(0, 0, 0, 0));
      const end = new Date(selectedDate.setHours(23, 59, 59, 999));

      matchStage.createdAt = { $gte: start, $lte: end };

      groupStage = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
      };
    }

    //  MONTH FILTER 
    if (type === "month") {
      matchStage.$expr = {
        $and: [
          { $eq: [{ $month: "$createdAt" }, Number(month)] },
          { $eq: [{ $year: "$createdAt" }, Number(year)] },
        ],
      };

      groupStage = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      };
    }

    //  YEAR FILTER 
    if (type === "year") {
      matchStage.$expr = {
        $eq: [{ $year: "$createdAt" }, Number(year)],
      };

      groupStage = {
        _id: {
          year: { $year: "$createdAt" },
        },
      };
    }

    //  AGGREGATION 
    const data = await OrderModel.aggregate([
      { $match: matchStage, status: "paid" },
      {
        $group: {
          ...groupStage,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          totalProfit: {
            $sum: { $subtract: ["$amount", "$cost"] },
          },
        },
      },
      { $sort: { "_id.year": -1 } },
    ]);

    res.status(200).json({
      type,
      data,
    });
  } catch (err) {
    console.error("Selling Overview Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getSellingOverview };

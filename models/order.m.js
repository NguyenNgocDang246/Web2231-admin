const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "discount",
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "shipping", "delivered"],
    default: "pending",
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "online"],
    default: "COD",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  receiverName: {
    type: String,
  },
  insurance: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Orders = mongoose.model("order", orderSchema, "orders");

module.exports = {
  all: async (
    page = 1,
    orderPerPage = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      const skip = (page - 1) * orderPerPage;

      startDate = startDate ? new Date(startDate) : new Date(0);
      endDate = endDate ? new Date(endDate) : new Date();

      if (orderPerPage) {
        const orders = await Orders.find()
          .where("date")
          .gte(startDate)
          .lte(endDate)
          .populate("user")
          .populate("discount")
          // .skip(skip)
          // .limit(orderPerPage)
          .lean();

        return orders;
      } else {
        const orders = await Orders.find()
          .skip(skip)
          .populate("user")
          .populate("discount")
          .lean();
        return orders;
      }
    } catch (e) {
      console.error("Error in OrderModel.all:", e);
      throw e;
    }
  },
  count: async () => {
    try {
      const totalOrders = await Orders.countDocuments();
      return totalOrders;
    } catch (e) {
      console.error("Error in OrderModel.count:", e);
      throw e;
    }
  },
  countByDate: async (startDate, endDate) => {
    try {
      startDate = startDate ? new Date(startDate) : new Date(0);
      endDate = endDate ? new Date(endDate) : new Date();
      const totalOrders = await Orders.countDocuments({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
      return totalOrders;
    } catch (e) {
      console.error("Error in OrderModel.countByDate:", e);
      throw e;
    }
  },
  sumByDate: async (startDate, endDate) => {
    try {
      startDate = startDate ? new Date(startDate) : new Date(0);
      endDate = endDate ? new Date(endDate) : new Date();
      const totalRevenue = await Orders.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);
      return totalRevenue[0]?.totalRevenue || 0;
    } catch (e) {
      console.error("Error in OrderModel.sumByDate:", e);
      throw e;
    }
  },
  countProductByDate: async (startDate, endDate) => {
    try {
      const now = new Date();
      startDate = startDate
        ? new Date(startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = endDate
        ? new Date(endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const totalProductsSold = await Orders.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
      ]);

      return totalProductsSold[0]?.totalQuantity || 0;
    } catch (e) {
      console.error("Error in OrderModel.countProductByDate:", e);
      throw e;
    }
  },
  one: async (id) => {
    try {
      const order = await Orders.findById(id)
        .populate("user")
        .populate("discount")
        .populate("items.product")
        .lean();
      return order;
    } catch (e) {
      throw e;
    }
  },
  update: async (id, data) => {
    try {
      const order = await Orders.findByIdAndUpdate(id, data, {
        new: true,
      })
        .populate("user")
        .populate("discount")
        .populate("items.product")
        .lean();
      return order;
    } catch (e) {
      throw e;
    }
  },
  getRevenueLast12Months: async () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    return Orders.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  },
  //return name of best seller product
  bestSeller: async (startDate, endDate) => {
    try {
      // Nếu không truyền ngày, lấy khoảng thời gian của tháng hiện tại
      const now = new Date();
      startDate = startDate
        ? new Date(startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = endDate
        ? new Date(endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const bestSellingProduct = await Orders.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            productName: "$productDetails.name",
            totalQuantity: 1,
          },
        },
      ]);

      return bestSellingProduct[0] || null;
    } catch (e) {
      console.error("Error in OrderModel.bestSeller:", e);
      throw e;
    }
  },
  growthByRevenueComparedToLastMonth: async () => {
    try {
      const now = new Date();
      const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const lastMonthRevenue = await Orders.aggregate([
        {
          $match: {
            date: { $gte: startLastMonth, $lte: endLastMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const currentMonthRevenue = await Orders.aggregate([
        {
          $match: {
            date: { $gte: startCurrentMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const lastRevenue = lastMonthRevenue[0]?.totalRevenue || 0;
      const currentRevenue = currentMonthRevenue[0]?.totalRevenue || 0;

      if (lastRevenue === 0) {
        return currentRevenue > 0 ? 100 : 0;
      }

      return ((currentRevenue - lastRevenue) / lastRevenue) * 100;
    } catch (e) {
      console.error(
        "Error in OrderModel.growthByRevenueComparedToLastMonth:",
        e
      );
      throw e;
    }
  },
  delete: async (id) => {
    try {
      await Orders.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  },
  ORDER_STATUS: ["pending", "shipping", "delivered"],
  PAYMENT_METHOD: ["COD", "online"],
  PAYMENT_STATUS: ["pending", "paid", "failed"],
};

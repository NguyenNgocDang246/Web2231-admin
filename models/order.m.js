const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
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
  },
  {
    timestamps: true,
  }
);

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
          .where("createdAt")
          .gte(startDate)
          .lte(endDate)
          .populate("user")
          .populate("discount")
          .skip(skip)
          .limit(orderPerPage)
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
  ORDER_STATUS: ["pending", "processing", "shipped", "delivered", "cancelled"],
  PAYMENT_METHOD: ["COD", "online"],
  PAYMENT_STATUS: ["pending", "paid", "failed"],
};

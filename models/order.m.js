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
      enum: ["COD", "credit_card", "paypal"],
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
  all: async (page = 1, orderPerPage = null) => {
    try {
      const skip = (page - 1) * orderPerPage;
      if (orderPerPage) {
        const orders = await Orders.find()
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
  one: async (id) => {
    try {
      const order = await Orders.findById(id).lean();
      return order;
    } catch (e) {
      throw e;
    }
  },
};

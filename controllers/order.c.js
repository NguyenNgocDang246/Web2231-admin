const orderModel = require("../models/order.m");
const { Discount } = require("../models/discount.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const currentPage = 1;
      const totalOrders = await orderModel.count();
      const orders = await orderModel.all(currentPage, PER_PAGE);
      const totalPages = Math.ceil(totalOrders / PER_PAGE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      try {
        orders.forEach((order) => {
          if (order.discount) {
            const discount = order.discount;
            order.discount.value =
              discount.type === "percent"
                ? discount.value * 0.01 * order.totalAmount
                : discount.value;
          } else {
            order.discount = { value: 0 };
          }
        });
      } catch (error) {
        console.log("Error get discount", error.message);
        next(new CError(500, "Error get discount", error.message));
      }

      res.render("order/revenue", {
        title: "Đơn hàng",
        user: req.session.user,
        orders,
        currentPage,
        pages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
      });
    } catch (error) {
      next(new CError(500, "Error get all orders", error.message));
    }
  },
  list: async (req, res, next) => {
    try {
      const { from, to } = req.body;
      const currentPage = req.query.page || 1;
      const orders = await orderModel.all(currentPage, PER_PAGE, from, to);
      const totalOrders = await orderModel.countByDate(from, to);
      const totalPages = Math.ceil(totalOrders / PER_PAGE);

      try {
        orders.forEach((order) => {
          if (order.discount) {
            const discount = order.discount;
            order.discount.value =
              discount.type === "percent"
                ? discount.value * 0.01 * order.totalAmount
                : discount.value;
          } else {
            order.discount = { value: 0 };
          }
        });
      } catch (error) {
        console.log("Error get discount", error.message);
        next(new CError(500, "Error get discount", error.message));
      }

      res.json({orders, totalPages});
    } catch (error) {
      next(new CError(500, "Error get all orders", error.message));
    }
  },
  one: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await orderModel.one(id);

      if (order.discount) {
        const discount = order.discount;
        order.discount.value =
          discount.type === "percent"
            ? discount.value * 0.01 * order.totalAmount
            : discount.value;
      } else {
        order.discount = { value: 0 };
      }

      console.log(order);

      res.render("order/orderDetails", {
        title: "Chi tiết đơn hàng",
        user: req.session.user,
        order,
        orderStatus: orderModel.ORDER_STATUS,
        paymentMethod: orderModel.PAYMENT_METHOD,
        paymentStatus: orderModel.PAYMENT_STATUS,
      });
    } catch (error) {
      next(new CError(500, "Error get order", error.message));
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        status,
        paymentStatus,
        quantity,
        shippingAddress,
        receiverName,
        paymentMethod,
      } = req.body;
      const order = await orderModel.one(id);

      order.status = status;
      order.paymentStatus = paymentStatus;
      order.quantity = quantity;
      order.shippingAddress = shippingAddress;
      order.receiverName = receiverName;
      order.paymentMethod = paymentMethod;

      await orderModel.update(order);
      res.redirect(`/order`);
    } catch (error) {
      console.log("Error update order", error.message);
      next(new CError(500, "Error update order", error.message));
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await orderModel.delete(id);
      res.redirect(`/order`);
    } catch (error) {
      next(new CError(500, "Error delete order", error.message));
    }
  },
};

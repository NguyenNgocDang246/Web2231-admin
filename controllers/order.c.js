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

      // Tinh discount cho tung order
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

      // Lay data cho chart
      const rawData = await orderModel.getRevenueLast12Months();
      const labels = [];
      const data = [];

      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `T${month.getMonth() + 1}/${month.getFullYear() % 100}`;
        labels.push(label);

        const monthRevenue = rawData.find(
          (d) =>
            d._id.year === month.getFullYear() &&
            d._id.month === month.getMonth() + 1
        );

        data.push(monthRevenue ? monthRevenue.totalRevenue / 1000 : 0);
      }

      // Statistics
      const totalOrdersInMonth = await orderModel.countByDate(
        new Date(new Date().setDate(1)).toISOString().split("T")[0],
        new Date()
      );
      const totalRevenueInMonth = await orderModel.sumByDate(
        new Date(new Date().setDate(1)).toISOString().split("T")[0],
        new Date()
      );
      const totalProductsInMonth = await orderModel.countProductByDate(
        new Date(new Date().setDate(1)).toISOString().split("T")[0],
        new Date()
      );
      const growRate = await orderModel.growthByRevenueComparedToLastMonth();
      const growth =
        growRate > 0 ? `+${growRate.toFixed(2)}%` : `${growRate.toFixed(2)}%`;

      res.render("order/revenue", {
        title: "Đơn hàng",
        user: req.session.user,
        orders,
        currentPage,
        pages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
        data,
        labels,
        totalOrdersInMonth,
        totalRevenueInMonth: totalRevenueInMonth / 1000000,
        totalProductsInMonth,
        growth,
      });
    } catch (error) {
      console.log("Error get all orders", error.message);
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

      console.log(orders);

      res.json({ orders, totalPages });
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

      await orderModel.update(id, req.body);
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
      res.json({ status: "success" });
    } catch (error) {
      console.log("Error delete order", error);
      next(new CError(500, "Error delete order", error.message));
    }
  },
};

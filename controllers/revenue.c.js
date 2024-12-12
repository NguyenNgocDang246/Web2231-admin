const orderModel = require("../models/order.m");
const { Discount } = require("../models/discount.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const orders = await orderModel.all(currentPage, PER_PAGE);
      const numPages = Math.ceil(orders.length / PER_PAGE);
      const totalPages = Array.from({ length: numPages }, (_, i) => i + 1);

      try {
        orders.forEach((order) => {
          if (order.discount) {
            const discount = order.discount;
            order.discount.value =
              discount.type === "percent"
                ? discount.value * 0.01 * order.totalAmount
                : discount.value;
          } else {
            order.discount.value = 0;
          }
        });
      } catch (error) {
        console.log("Error get discount", error.message);
      }

      res.render("revenue/revenue", {
        title: "Order List",
        user: req.session.user,
        orders,
        currentPage,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
      });
    } catch (error) {
      next(new CError(500, "Error get all orders", error.message));
    }
  },
};

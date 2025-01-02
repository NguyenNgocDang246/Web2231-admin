const discountModel = require("../models/discount.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const totalDiscounts = await discountModel.count();
      const discounts = await discountModel.all(currentPage, PER_PAGE);
      discounts.forEach((discount) => {
        discount.expiredAt = discount.expiredAt.toISOString().split("T")[0];
      });

      const totalPages = Math.ceil(totalDiscounts / PER_PAGE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      res.render("discount/index", {
        discounts,
        user: req.session.user,
        title: "Khuyến mãi",
        currentPage,
        pages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
      });
    } catch (err) {
      next(new CError(500, "Error getting all discounts", err.message));
    }
  },
  list: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const discounts = await discountModel.all(currentPage, PER_PAGE);
      discounts.forEach((discount) => {
        discount.expiredAt = discount.expiredAt.toISOString().split("T")[0];
      });

      res.json(discounts);
    } catch (err) {
      next(new CError(500, "Error getting all discounts", err.message));
    }
  },
  add: async (req, res, next) => {
    try {
      res.render("discount/add", {
        user: req.session.user,
        title: "Thêm khuyến mãi",
        types: discountModel.TYPES,
      });
    } catch (err) {
      next(new CError(500, "Error getting add discount page", err.message));
    }
  },
  store: async (req, res, next) => {
    try {
      const discount = req.body;
      await discountModel.add(discount);
      res.redirect("/discount");
    } catch (err) {
      next(new CError(500, "Error adding discount", err.message));
    }
  },
  one: async (req, res, next) => {
    try {
      const id = req.params.id;
      const discount = await discountModel.one(id);

      res.render("discount/one", {
        discount,
        user: req.session.user,
        title: "Chi tiết khuyến mãi",
        types: discountModel.TYPES,
      });
    } catch (err) {
      next(new CError(500, "Error getting edit discount page", err.message));
    }
  },
  update: async (req, res, next) => {
    try {
      req.body.isActive = req.body.isActive === "on";
      await discountModel.update(req.params.id, req.body);
      res.redirect("/discount");
    } catch (error) {
      next(new CError(500, "Error updating discount", error.message));
    }
  },
  delete: async (req, res, next) => {
    try {
      await discountModel.delete(req.params.id);
      res.json({ status: "success" });
    } catch (err) {
      next(new CError(500, "Error deleting discount", err.message));
    }
  },
};

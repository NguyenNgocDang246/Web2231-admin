const discountModel = require("../models/discount.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const discounts = await discountModel.all();
      res.render("discount/index", {
        discounts,
        user: req.session.user,
        title: "Khuyến mãi",
      });
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
      await discountModel.update(req.params.id, req.body);
      res.redirect("/discount");
    } catch (error) {
      next(new CError(500, "Error updating discount", err.message));
    }
  },
  delete: async (req, res, next) => {
    try {
      await discountModel.delete(req.params.id);
      res.redirect("/discount");
    } catch (err) {
      next(new CError(500, "Error deleting discount", err.message));
    }
  },
};

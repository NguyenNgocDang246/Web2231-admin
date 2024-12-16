const brandModel = require("../models/brand.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const brands = await brandModel.all();
      res.render("brand/index", {
        brands,
        user: req.session.user,
        title: "Thương hiệu",
      });
    } catch (err) {
      next(new CError(500, "Error getting all brands", err.message));
    }
  },
  add: async (req, res, next) => {
    res.render("brand/add", {
      user: req.session.user,
      title: "Thêm thương hiệu",
    });
  },
  store: async (req, res, next) => {
    try {
      await brandModel.add(req.body);
      res.redirect("/brand");
    } catch (err) {
      next(new CError(500, "Error adding brand", err.message));
    }
  },
  one: async (req, res, next) => {
    try {
      const brand = await brandModel.one(req.params.id);
      res.render("brand/one", {
        brand,
        user: req.session.user,
        title: "Thương hiệu",
      });
    } catch (err) {
      next(new CError(500, "Error getting brand", err.message));
    }
  },
  update: async (req, res, next) => {
    try {
      await brandModel.update(req.params.id, req.body);
      res.redirect("/brand");
    } catch (err) {
      next(new CError(500, "Error updating brand", err.message));
    }
  },
  delete: async (req, res, next) => {
    try {
      await brandModel.delete(req.params.id);
      res.redirect("/brand");
    } catch (err) {
      next(new CError(500, "Error deleting brand", err.message));
    }
  },
};

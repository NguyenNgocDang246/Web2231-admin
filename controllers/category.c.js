const categoryModel = require("../models/category.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  index: async (req, res, next) => {
    try {
      const categories = await categoryModel.all();
      res.render("category/index", {
        categories,
        user: req.session.user,
        title: "Danh mục",
      });
    } catch (err) {
      next(new CError(500, "Error getting all categories", err.message));
    }
  },
  add: async (req, res, next) => {
    res.render("category/add", {
      user: req.session.user,
      title: "Thêm danh mục",
    });
  },
  store: async (req, res, next) => {
    try {
      await categoryModel.add(req.body);
      res.redirect("/category");
    } catch (err) {
      next(new CError(500, "Error adding category", err.message));
    }
  },
  one: async (req, res, next) => {
    try {
      const category = await categoryModel.one(req.params.id);
      res.render("category/one", {
        category,
        user: req.session.user,
        title: "Danh mục",
      });
    } catch (err) {
      next(new CError(500, "Error getting category", err.message));
    }
  },
  update: async (req, res, next) => {
    try {
      await categoryModel.update(req.params.id, req.body);
      res.redirect("/category");
    } catch (err) {
      next(new CError(500, "Error updating category", err.message));
    }
  },
  delete: async (req, res, next) => {
    try {
      await categoryModel.delete(req.params.id);
      res.json({ status: "success" });
    } catch (err) {
      next(new CError(500, "Error deleting category", err.message));
    }
  },
};

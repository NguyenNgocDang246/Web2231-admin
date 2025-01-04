const productModel = require("../models/product.m");
const categoryModel = require("../models/category.m");
const brandModel = require("../models/brand.m");
const reviewModel = require("../models/review.m");
const CError = require("../utils/cerror");
const PER_PAGE = 8;

module.exports = {
  index: async (req, res, next) => {
    try {
      const currentPage = 1;
      const totalProducts = await productModel.count();
      const products = await productModel.all(currentPage, PER_PAGE);
      const totalPages = Math.ceil(totalProducts / PER_PAGE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      res.render("product/list", {
        title: "Sản phẩm",
        user: req.session.user,
        products,
        currentPage,
        pages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      next(new CError(500, "Error get all products", error.message));
    }
  },
  list: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const products = await productModel.all(currentPage, PER_PAGE);
      res.json(products);
    } catch (error) {
      next(new CError(500, "Error get all products", error.message));
    }
  },
  one: async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productModel.one(id);
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      const sizes = productModel.sizes;
      const colors = productModel.colors;
      const genders = productModel.genders;
      const reviews = await reviewModel.find({ product: id });

      res.render("product/productDetail", {
        user: req.session.user,
        product: product,
        categories,
        brands,
        sizes,
        colors,
        genders,
        reviews,
        title: "Chi tiết sản phẩm",
      });
    } catch (error) {
      next(new CError(500, "Error get product details", error.message));
    }
  },
  // Thêm sản phẩm
  add: async (req, res, next) => {
    try {
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      const sizes = productModel.sizes;
      const colors = productModel.colors;
      const genders = productModel.genders;

      res.render("product/addProduct", {
        brands,
        categories,
        sizes,
        colors,
        genders,
        title: "Thêm sản phẩm",
      });
    } catch (error) {
      next(
        new CError(500, "Error get all categories and brands", error.message)
      );
    }
  },
  store: async (req, res, next) => {
    try {
      const {
        name,
        price,
        brand_id,
        categories,
        stock,
        colors,
        gender,
        sizes,
        description,
      } = req.body;
      const image = req.files.map((file) => file.path);
      const category_id = categories.split(",");
      const size = sizes.split(",");
      const color = colors.split(",");

      try {
        const rs = await productModel.add({
          name,
          price,
          category_id,
          stock,
          colors: color,
          image,
          size,
          gender,
          brand_id,
          description,
        });
        res.json({
          success: true,
          message: "Thêm sản phẩm thành công",
          id: rs._id,
        });
      } catch (error) {
        res.json({ success: false, message: "Thêm sản phẩm thất bại" });
      }
    } catch (error) {
      next(new CError(500, "Error add product", error.message));
    }
  },
  edit: async (req, res, next) => {
    try {
      const {
        name,
        price,
        brand,
        categories,
        stock,
        colors,
        gender,
        sizes,
        description,
      } = req.body;
      const newImages = req.files.map((file) => file.path);
      const oldImages = req.body.oldImages.split(",");
      const image = [...oldImages, ...newImages];
      const category_id = categories.split(",");
      const size = sizes.split(",");
      const color = colors.split(",");

      const id = req.params.id;

      const rs = await productModel.update(id, {
        name,
        price,
        brand_id: brand,
        category_id,
        stock,
        color,
        image,
        gender,
        size,
        description,
      });
      res.redirect("/product");
    } catch (error) {
      next(new CError(500, "Error update product", error.message));
    }
  },
  // Xóa sản phẩm
  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      await productModel.delete(id);
      res.json({ status: "success", message: "Product deleted" });
    } catch (error) {
      next(new CError(500, "Error delete product", error.message));
    }
  },
  // Xóa review
  removeReview: async (req, res, next) => {
    try {
      const id = req.params.id;
      await reviewModel.delete(id);
      res.json({ message: "Đã xóa đánh giá" });
    } catch (error) {
      next(new CError(500, "Error delete review", error.message));
    }
  },
};

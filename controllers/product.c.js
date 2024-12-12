const productModel = require("../models/product.m");
const categoryModel = require("../models/category.m");
const brandModel = require("../models/brand.m");
const reviewModel = require("../models/review.m");
const userModel = require("../models/user.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1;
      const products = await productModel.all(currentPage, PER_PAGE);
      const numPages = Math.ceil(products.length / PER_PAGE);
      const totalPages = Array.from({ length: numPages }, (_, i) => i + 1);
      res.render("product/productList", {
        title: "Product List",
        user: req.session.user,
        products,
        currentPage,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        totalPages,
      });
    } catch (error) {
      next(new CError(500, "Error get all products", error.message));
    }
  },
  getOne: async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productModel.one(id);
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
      const colors = [
        "Đỏ",
        "Xanh",
        "Vàng",
        "Trắng",
        "Đen",
        "Be",
        "Hồng",
        "Xám",
        "Cam",
        "Nâu",
        "Tím",
        "Xanh lá",
        "Xanh ngọc",
        "Kem",
        "Vàng nghệ",
      ];
      const genders = ["Nam", "Nữ", "Unisex"];

      res.render("product/productDetail", {
        user: req.session.user,
        product: product,
        categories,
        brands,
        sizes,
        colors,
        genders,
      });
    } catch (error) {
      next(new CError(500, "Error get product details", error.message));
    }
  },
  // Thêm sản phẩm
  getAdd: async (req, res, next) => {
    try {
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
      const colors = [
        "Đỏ",
        "Xanh",
        "Vàng",
        "Trắng",
        "Đen",
        "Be",
        "Hồng",
        "Xám",
        "Cam",
        "Nâu",
        "Tím",
        "Xanh lá",
        "Xanh ngọc",
        "Kem",
        "Vàng nghệ",
      ];
      const genders = ["Nam", "Nữ", "Unisex"];
      res.render("product/addProduct", {
        brands,
        categories,
        sizes,
        colors,
        genders,
      });
    } catch (error) {
      next(
        new CError(500, "Error get all categories and brands", error.message)
      );
    }
  },
  postAdd: async (req, res, next) => {
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

      const rs = await productModel.add({
        name,
        price,
        brand_id,
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
      next(new CError(500, "Error add product", error.message));
    }
  },
  postEdit: async (req, res, next) => {
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
      res.redirect("/product");
    } catch (error) {
      next(new CError(500, "Error delete product", error.message));
    }
  },
};

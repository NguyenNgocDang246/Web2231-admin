const productModel = require("../models/product.m");
const categoryModel = require("../models/category.m");
const brandModel = require("../models/brand.m");
const reviewModel = require("../models/review.m");
const userModel = require("../models/user.m");
const CError = require("../utils/cerror");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryModel.all();
      res.render("Product", {
        user: req.session.user,
        categories: categories,
      });
    } catch (error) {
      next(new CError(500, "Error get all products", error.message));
    }
  },
  getOne: async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productModel.one(id);

      const categoryNames = [];
      for (const categoryId of product.category_id) {
        const category = await categoryModel.one(categoryId);
        if (category) {
          categoryNames.push(category.name);
        }
      }
      product.categoryNames = categoryNames;

      const brand = await brandModel.one(product.brand_id);
      product.brandNames = brand.name;

      const reviews = await reviewModel.find({ product: product._id });
      for (const review of reviews) {
        const user = await userModel.one(review.user);
        review.userName = user.name;
      }

      res.render("ProductDetails", {
        user: req.session.user,
        product: product,
        reviews: reviews,
      });
    } catch (error) {
      next(new CError(500, "Error get product by ID", error.message));
    }
  },
  api: async (req, res, next) => {
    try {
      const { minPrice, maxPrice, category, sortBy, searchQuery, page } =
        req.query;

      // Tạo điều kiện tìm kiếm
      let query = {};
      if (minPrice) query.price = { $gte: +minPrice };
      if (maxPrice) query.price = { ...query.price, $lte: +maxPrice };
      if (category) {
        const categoryIDs = await categoryModel.find({ name: category });
        query.category_id = categoryIDs[0]._id;
      }
      if (searchQuery) query.name = { $regex: searchQuery, $options: "i" };

      // Sắp xếp theo yêu cầu
      let sort = {};
      if (sortBy === "price-low-to-high") sort.price = 1;
      if (sortBy === "price-high-to-low") sort.price = -1;
      if (sortBy === "newest") sort.createdAt = -1;

      // Phân trang
      const productPerPage = 3; // số lượng sản phẩm mỗi trang
      const products = await productModel.find(
        query,
        page,
        productPerPage,
        sort
      );

      // Phân trang
      const totalProducts = await productModel.count(query);
      const totalPages = Math.ceil(totalProducts / productPerPage);

      res.json({
        products: products,
        totalPages: totalPages,
        currentPage: +page,
      });
    } catch (error) {
      next(new CError(500, "Error get products", error.message));
    }
  },
  addComment: (req, res, next) => {
    try {
      const { productId } = req.params;
      const { rating, comment } = req.body;
      // Logic thêm bình luận vào sản phẩm
      res.json({ comment: { userName: "Current User", rating, comment } });
    } catch (error) {
      next(new CError(500, "Error add comment", error.message));
    }
  },
  // Thêm sản phẩm
  getAdd: async (req, res, next) => {
    try {
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      res.json({ categories, brands });
      // res.render("admin/AddProduct", { brands, categories });
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
        category_id,
        stock,
        color,
        image,
        gender,
        size,
        description,
      } = req.body;
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
      res.json(rs);
      // res.redirect("/admin/product");
    } catch (error) {
      next(new CError(500, "Error add product", error.message));
    }
  },
  // Sửa sản phẩm
  getEdit: async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productModel.one(id);
      const categories = await categoryModel.all();
      const brands = await brandModel.all();
      res.render("admin/EditProduct", { product, categories, brands });
    } catch (error) {
      next(new CError(500, "Error get product by ID", error.message));
    }
  },
  postEdit: async (req, res, next) => {
    try {
      const id = req.params.id;
      const {
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
      } = req.body;
      await productModel.update(id, {
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
      res.redirect("/admin/product");
    } catch (error) {
      next(new CError(500, "Error update product", error.message));
    }
  },
  // Xóa sản phẩm
  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      await productModel.delete(id);
      res.redirect("/admin/product");
    } catch (error) {
      next(new CError(500, "Error delete product", error.message));
    }
  },
};

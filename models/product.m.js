const mongoose = require("mongoose");

// Định nghĩa schema cho User
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
  stock: { type: Number, default: 0 },
  colors: [String],
  image: [String],
  gender: { type: String, enum: ["Nam", "Nữ", "Unisex"] },
  size: [String],
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
  description: { type: String },
});

// Tạo model từ schema
const Product = mongoose.model("product", productSchema, "products");

module.exports = {
  all: async (page = 1, productPerPage = null) => {
    try {
      if (productPerPage) {
        const skip = (page - 1) * productPerPage;
        const products = await Product.find()
          .populate("category_id")
          .populate("brand_id")
          .skip(skip)
          .limit(productPerPage)
          .lean();
        return products;
      } else {
        const products = await Product.find()
          .populate("category_id")
          .populate("brand_id")
          .skip(page - 1)
          .lean();
        return products;
      }
    } catch (e) {
      throw e;
    }
  },
  count: async () => {
    return await Product.countDocuments();
  },
  one: async (id) => {
    try {
      const product = await Product.findById(id)
        .populate("category_id")
        .populate("brand_id")
        .lean();
      return product;
    } catch (e) {
      throw e;
    }
  },
  find: async (condition = {}, page = 1, productPerPage = null, sort = {}) => {
    try {
      const skip = (page - 1) * productPerPage;
      if (productPerPage) {
        const products = await Product.find(condition)
          .populate("category_id")
          .populate("brand_id")
          .sort(sort)
          .skip(skip)
          .limit(productPerPage)
          .lean();
        return products;
      } else {
        const products = await Product.find(condition)
          .populate("category_id")
          .populate("brand_id")
          .sort(sort)
          .skip(skip)
          .lean();
        return products;
      }
    } catch (e) {
      throw e;
    }
  },
  count: async (condition) => {
    return await Product.countDocuments(condition);
  },
  add: async (product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      const product = await Product.findByIdAndDelete(id);
      return product;
    } catch (e) {
      throw e;
    }
  },
  update: async (id, product) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, product, {
        new: true,
      });
      return updatedProduct;
    } catch (e) {
      throw e;
    }
  },
  colors: [
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
  ],
  sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  genders: ["Nam", "Nữ", "Unisex"],
};

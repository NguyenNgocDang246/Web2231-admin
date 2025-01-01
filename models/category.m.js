const mongoose = require("mongoose");

// Định nghĩa schema cho User
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

// Tạo model từ schema
const Category = mongoose.model("category", categorySchema, "categories");

module.exports = {
  all: async (page = 1, categoryPerPage = null) => {
    try {
      const skip = (page - 1) * categoryPerPage;
      if (categoryPerPage) {
        const categories = await Category.find()
          .skip(skip)
          .limit(categoryPerPage)
          .lean();
        return categories;
      } else {
        const categories = await Category.find().skip(skip).lean();
        return categories;
      }
    } catch (e) {
      throw e;
    }
  },
  one: async (id) => {
    try {
      const category = await Category.findById(id).lean();
      return category;
    } catch (e) {
      throw e;
    }
  },
  add: async (category) => {
    try {
      await Category.create(category);
    } catch (e) {
      throw e;
    }
  },
  update: async (id, category) => {
    try {
      await Category.findByIdAndUpdate(id, category);
    } catch (e) {
      throw e;
    }
  },
  delete: async (id) => {
    try {
      await Category.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  },
};

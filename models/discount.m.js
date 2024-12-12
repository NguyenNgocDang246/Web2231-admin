const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["percent", "fixed"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Discount = mongoose.model("discount", discountSchema);

module.exports = {
  all: async (page = 1, PER_PAGE = null) => {
    try {
      if (PER_PAGE === null) {
        return Discount.find().lean();
      }
      return Discount.find()
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .lean();
    } catch (error) {
      throw error;
    }
  },
  add: async (discount) => {
    try {
      await Discount.create(discount);
    } catch (error) {
      throw error;
    }
  },
  one: async (id) => {
    try {
      return Discount.findById(id).lean();
    } catch (error) {
      throw error;
    }
  },
  update: async (id, discount) => {
    try {
      await Discount.findByIdAndUpdate(id, discount);
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await Discount.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },
  TYPES: ["percent", "fixed"],
};

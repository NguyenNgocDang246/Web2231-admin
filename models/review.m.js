const mongoose = require("mongoose");

// Định nghĩa schema cho User
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: null },
  },
  { timestamps: true }
);

// Tạo model từ schema
const Reviews = mongoose.model("review", reviewSchema, "reviews");

module.exports = {
  all: async (page = 1, reviewPerPage = null) => {
    try {
      const skip = (page - 1) * reviewPerPage;
      if (reviewPerPage) {
        const reviews = await Reviews.find()
          .skip(skip)
          .limit(reviewPerPage)
          .lean();
        return reviews;
      } else {
        const reviews = await Reviews.find().skip(skip).lean();
        return reviews;
      }
    } catch (e) {
      console.error("Error:", e);
    }
  },
  one: async (id) => {
    try {
      const review = await Reviews.findById(id).lean();
      return review;
    } catch (e) {
      console.error("Error:", e);
    }
  },
  find: async (condition = {}, page = 1, reviewPerPage = null) => {
    try {
      const skip = (page - 1) * reviewPerPage;
      if (reviewPerPage) {
        const reviews = await Reviews.find(condition)
          .skip(skip)
          .populate("user")
          .limit(reviewPerPage)
          .lean();
        return reviews;
      } else {
        const reviews = await Reviews.find(condition)
          .skip(skip)
          .populate("user")
          .lean();
        return reviews;
      }
    } catch (e) {
      console.error("Error:", e);
    }
  },
};

const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.z3fa8PjEnvzg4bhW61tEOwAAAA?rs=1&pid=ImgDetMain",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const Users = mongoose.model("Users", userSchema, "users");

module.exports = {
  all: async (page = 1, userPerPage = null) => {
    try {
      const skip = (page - 1) * userPerPage;
      if (userPerPage) {
        const users = await Users.find().skip(skip).limit(userPerPage).lean();
        return users;
      } else {
        const users = await Users.find().skip(skip).lean();
        return users;
      }
    } catch (e) {
      console.error("Error:", e);
    }
  },
  one: async (id) => {
    try {
      const user = await Users.findById(id).lean();
      return user;
    } catch (e) {
      console.error("Error:", e);
    }
  },
};

const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const productModel = require("../models/product.m");
const userModel = require("../models/user.m");
const orderModel = require("../models/order.m");

router.get("/", ensureAuthenticated, async (req, res) => {
  const totalProducts = await productModel.count();
  const totalUsers = await userModel.count();
  const totalOrdersInMonth = await orderModel.countByDate(
    new Date(new Date().setDate(1)).toISOString().split("T")[0],
    new Date()
  );
  res.render("home", {
    user: req.session.user,
    title: "Home",
    totalProducts,
    totalUsers,
    totalOrdersInMonth,
  });
});

module.exports = router;

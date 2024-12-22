const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const revenueController = require("../controllers/revenue.c");

router.get("/", ensureAuthenticated, revenueController.index);

module.exports = router;

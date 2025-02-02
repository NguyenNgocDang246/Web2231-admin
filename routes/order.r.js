const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const orderController = require("../controllers/order.c");

router.get("/", ensureAuthenticated, orderController.index);
router.get("/list", ensureAuthenticated, orderController.list);
router.get("/id=:id", ensureAuthenticated, orderController.one);
router.post("/update/id=:id", ensureAuthenticated, orderController.update);
router.delete("/delete/id=:id", ensureAuthenticated, orderController.delete);

module.exports = router;

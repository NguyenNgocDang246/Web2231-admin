const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const orderController = require("../controllers/order.c");

router.get("/", ensureAuthenticated, orderController.index);
router.post("/", ensureAuthenticated, orderController.index);
router.get("/id=:id", ensureAuthenticated, orderController.one);
router.post("/update/:id", ensureAuthenticated, orderController.update);
router.post("/delete/:id", ensureAuthenticated, orderController.delete);

module.exports = router;

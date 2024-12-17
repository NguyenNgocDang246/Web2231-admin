const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const discountController = require("../controllers/discount.c");

router.get("/", ensureAuthenticated, discountController.index);
router.get("/list", ensureAuthenticated, discountController.list);
router.get("/add", ensureAuthenticated, discountController.add);
router.post("/add", ensureAuthenticated, discountController.store);
router.get("/id=:id", ensureAuthenticated, discountController.one);
router.post("/update/:id", ensureAuthenticated, discountController.update);
router.get("/delete/:id", ensureAuthenticated, discountController.delete);

module.exports = router;

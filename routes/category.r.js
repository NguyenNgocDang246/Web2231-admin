const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const categoryController = require("../controllers/category.c");

router.get("/", ensureAuthenticated, categoryController.index);
router.get("/add", ensureAuthenticated, categoryController.add);
router.post("/add", ensureAuthenticated, categoryController.store);
router.get("/id=:id", ensureAuthenticated, categoryController.one);
router.post("/update/:id", ensureAuthenticated, categoryController.update);
router.delete("/delete/:id", ensureAuthenticated, categoryController.delete);

module.exports = router;

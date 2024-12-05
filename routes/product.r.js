const express = require("express");
const productController = require("../controllers/product.c");
const router = express.Router();

router.get("/all", productController.getAll);
router.get("/id=:id", productController.getOne);
router.post("/comment/:id", productController.addComment);

router.get("/api", productController.api);

router.get("/add", productController.getAdd);
router.post("/add", productController.postAdd);
router.get("/edit/:id", productController.getEdit);
router.post("/edit/:id", productController.postEdit);
router.get("/delete/:id", productController.delete);

module.exports = router;

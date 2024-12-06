const express = require("express");
const productController = require("../controllers/product.c");
const router = express.Router();
const { uploadImage } = require("../middlewares/upload");

router.get("/", productController.getAll);
router.get("/id=:id", productController.getOne);
router.get("/add", productController.getAdd);
router.post("/add", uploadImage.array("images", 10), productController.postAdd);
router.get("/edit/:id", productController.getEdit);
router.post(
  "/edit/:id",
  uploadImage.array("images", 10),
  productController.postEdit
);
router.get("/delete/:id", productController.delete);

module.exports = router;

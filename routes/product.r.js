const express = require("express");
const productController = require("../controllers/product.c");
const router = express.Router();
const { uploadImage } = require("../middlewares/upload");
const ensureAuthenticated = require("../middlewares/auth");

router.get("/", ensureAuthenticated, productController.getAll);
router.get("/id=:id", ensureAuthenticated, productController.getOne);
router.get("/add", ensureAuthenticated, productController.getAdd);
router.post(
  "/add",
  ensureAuthenticated,
  uploadImage.array("images", 10),
  productController.postAdd
);
router.post(
  "/edit/:id",
  ensureAuthenticated,
  uploadImage.array("images", 10),
  productController.postEdit
);
router.get("/delete/:id", ensureAuthenticated, productController.delete);

module.exports = router;

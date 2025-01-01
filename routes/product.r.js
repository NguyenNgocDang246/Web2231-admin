const express = require("express");
const productController = require("../controllers/product.c");
const router = express.Router();
const { uploadImage } = require("../middlewares/upload");
const ensureAuthenticated = require("../middlewares/auth");

router.get("/", ensureAuthenticated, productController.index);
router.get("/list", ensureAuthenticated, productController.list);
router.get("/id=:id", ensureAuthenticated, productController.one);
router.get("/add", ensureAuthenticated, productController.add);
router.post(
  "/add",
  ensureAuthenticated,
  uploadImage.array("images", 10),
  productController.store
);
router.post(
  "/update/id=:id",
  ensureAuthenticated,
  uploadImage.array("images", 10),
  productController.edit
);
router.get("/delete/id=:id", ensureAuthenticated, productController.delete);
router.get(
  "/reviews/remove/id=:id",
  ensureAuthenticated,
  productController.removeReview
);

module.exports = router;

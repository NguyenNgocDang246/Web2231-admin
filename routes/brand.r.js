const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const brandController = require("../controllers/brand.c");

router.get("/", ensureAuthenticated, brandController.index);
router.get("/add", ensureAuthenticated, brandController.add);
router.post("/add", ensureAuthenticated, brandController.store);
router.get("/id=:id", ensureAuthenticated, brandController.one);
router.post("/update/:id", ensureAuthenticated, brandController.update);
router.get("/delete/:id", ensureAuthenticated, brandController.delete);

module.exports = router;

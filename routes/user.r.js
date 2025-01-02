const userController = require("../controllers/user.c.js");
const express = require("express");
const router = express.Router();

router.get("/", userController.index);
router.get("/list", userController.list);
router.get("/id=:id", userController.one);
router.delete("/delete/id=:id", userController.delete);

module.exports = router;

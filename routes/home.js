const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("home", { user: req.session.user });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("auth/login", {
    layout: false,
    req: req,
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message || "Đăng nhập thất bại!" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Không thể đăng nhập!" });
      }
      return res.status(200).json({ success: true, message: "Đăng nhập thành công!", user });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
  });
});

module.exports = router;

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModels = require("../models/user.m");

async function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const users = await userModels.admins();
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: "Người dùng không tồn tại" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Sai mật khẩu" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    const user = await userModels.one(id);
    done(null, user);
  });
}

module.exports = initialize;

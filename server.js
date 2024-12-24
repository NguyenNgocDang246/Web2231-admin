require("dotenv").config();

const { create } = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const cookieParser = require("cookie-parser");

const initializePassport = require("./configs/passport");
initializePassport(passport);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware for 404
app.use((err, req, res, next) => {
  if (app.get("env") === "development") {
    res.status(err.status || 500).render("error", {
      title: "Lỗi",
      message: err.message,
      error: err,
    });
  } else {
    res.status(err.status || 500).render("error", {
      title: "Lỗi",
      message: "Đã xảy ra lỗi, vui lòng thử lại sau!",
      error: {},
    });
  }
});

const hbs = create({
  extname: ".hbs",
  encoding: "utf-8",
  layoutsDir: "./views/layouts",
  partialsDir: "./views/partials",
  defaultLayout: "main",
  helpers: {
    index: (array, index) => {
      if (Array.isArray(array) && array.length > 0) {
        return array[index];
      }
      return null;
    },
    inc: (value) => parseInt(value) + 1,
    json: (context) => JSON.stringify(context),
    eq: (v1, v2) => v1 === v2,
    dateFormat: (date) => {
      return new Date(date).toLocaleString();
    },
    neq: (v1, v2, options) => {
      if (Number(v1) !== Number(v2)) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

// Routes
app.use("/", require("./routes/home"));
app.use("/product", require("./routes/product.r"));
app.use("/auth", require("./routes/auth.r"));
app.use("/order", require("./routes/order.r"));
app.use("/category", require("./routes/category.r"));
app.use("/discount", require("./routes/discount.r"));
app.use("/brand", require("./routes/brand.r"));
app.use("/user", require("./routes/user.r"));
app.use("/search", require("./routes/search.r"));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "img-src 'self' data:; default-src 'self';"
  );
  next();
});

const { connectDB } = require("./configs/db/db");
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
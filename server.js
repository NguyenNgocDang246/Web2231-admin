require("dotenv").config();

const { create } = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1 * 24 * 60 * 60 * 1000 },
  })
);

const hbs = create({
  extname: ".hbs",
  encoding: "utf-8",
  layoutsDir: "./views/layouts",
  partialsDir: "./views/partials",
  defaultLayout: "main",
});

hbs.handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

hbs.handlebars.registerHelper("index", function (array, index) {
  if (Array.isArray(array) && array.length > 0) {
    return array[index];
  }
  return null; // Trả về null nếu mảng rỗng hoặc không phải là mảng
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use("/product", require("./routes/product.r"));
app.use("/", require("./routes/home"));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "img-src 'self' data:; default-src 'self';"
  );
  next();
});

app.use((err, req, res, next) => {
  if (app.get("env") === "development") {
    // Chỉ hiển thị lỗi trong môi trường development
    res.status(err.status || 500).render("error", {
      title: "Lỗi",
      message: err.message,
      error: err, // Gửi thông tin lỗi chi tiết
    });
  } else {
    // Trong production, chỉ hiển thị thông báo chung
    res.status(err.status || 500).render("error", {
      title: "Lỗi",
      message: "Đã xảy ra lỗi, vui lòng thử lại sau!",
      error: {}, // Không gửi chi tiết lỗi
    });
  }
});

const { connectDB } = require("./configs/db/db");
const { title } = require("process");
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

require("dotenv").config();

const { create } = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const path = require("path");
const MongoStore = require('connect-mongo');

const initializePassport = require("./configs/passport");
initializePassport(passport);

const PORT = process.env.PORT || 3000;

const app = express();

app.set('trust proxy', 1); // Bật trust proxy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
const { mongoose, connectDB } = require("./configs/db/db");
connectDB()
    .then(() => {
        const sessionDbConnection = mongoose.createConnection(process.env.MONGODB_URI_SESSION);
        app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: true,
                store: MongoStore.create({
                    client: sessionDbConnection.getClient(), // Sử dụng connection cho session
                    collectionName: 'sessions' // Tên collection để lưu session
                }),
                cookie: {
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                },
            })
        );
        app.use(passport.initialize());
        app.use(passport.session());

        const hbs = create({
            extname: ".hbs",
            encoding: "utf-8",
            layoutsDir: "./views/layouts",
            partialsDir: "./views/partials",
            defaultLayout: "main",
            helpers: {
                eq: (a, b) => a === b,
                index: (array, index) => {
                    if (Array.isArray(array) && array.length > 0) {
                        return array[index];
                    }
                    return null;
                },
                inc: (value) => parseInt(value) + 1,
                json: (context) => JSON.stringify(context),
            },
        });

        app.engine("hbs", hbs.engine);
        app.set("view engine", "hbs");
        app.set("views", "./views");

        app.use("/", require("./routes/home"));
        app.use("/product", require("./routes/product.r"));
        app.use("/auth", require("./routes/auth.r"));
        app.use("/revenue", require("./routes/revenue.r"));
        app.use("/payment", require("./routes/payment.r"));

        app.use((req, res, next) => {
            res.setHeader(
                "Content-Security-Policy",
                "img-src 'self' data:; default-src 'self';"
            );
            next();
        });

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

        // const https = require('https');
        // const fs = require('fs');
        // const privateKey = fs.readFileSync('./sslkeys/key.pem', 'utf8');
        // const certificate = fs.readFileSync('./sslkeys/cert.pem', 'utf8');
        // const credentials = { key: privateKey, cert: certificate };
        // const httpsServer = https.createServer(credentials, app);
        // httpsServer.listen(PORT, () => {
        //     console.log(`Server running at https://localhost:${PORT}`);
        // });
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
          });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });

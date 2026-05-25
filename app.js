const express = require("express");

const ejs = require("ejs");

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const postModel = require("./models/post");

const mongoose = require("mongoose");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const helmet = require("helmet");

dotenv.config();
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  }),
);

//db connection
connectDb();

//View engine
app.set("view engine", "ejs");

//Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/", authRoutes);
app.use("/", postRoute);

// Global error handler — catches anything missed above
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server running succesfully on http://localhost:${process.env.PORT}`,
  );
});

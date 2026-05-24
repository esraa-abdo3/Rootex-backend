const express = require("express");
const serverless = require("serverless-http"); 
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const mongoconnect = require("./config/dbconnect.js");
const app = express();
const cookieParser= require("cookie-parser")
// midleware
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(
//   "/api/v1/payment/webhook",
//   express.raw({ type: "application/json" })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// connect to data base
mongoconnect()
// 404
const authRoutes = require("./routes/Authroutes.js");
app.use("/api/v1/auth", authRoutes);
const productRoutes = require("./routes/Productsroutes.js");
app.use("/api/v1/product", productRoutes);
const orderRoutes = require("./routes/orderroutes.js");
app.use("/api/v1/order",orderRoutes);
const uisettings = require("./routes/settingsroutes.js");
app.use("/api/v1/setting", uisettings);
const reviews = require("./routes/Reviewroutes.js");
app.use("/api/v1/Review",reviews);

// Routes






app.use((req, res) => {
  res.status(404).json({ status: "Error", msg: "Route not found" });
}); 

// Global error handler
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: err.statusText || "Error", msg: err.msg || err.message, code: err.statusCode, data: null });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
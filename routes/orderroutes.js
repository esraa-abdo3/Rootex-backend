const express = require("express");
const Router = express.Router();
const { body } = require("express-validator");
const verfiyToken = require("../middleware/VerfiyToken");
const AllowedTo = require("../middleware/AllowedTo");
const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/Order/ordercontrollers");

const { createOrderValidation } =require("../middleware/orderValidation")
Router.post("/createorder", createOrder);
Router.get("/", getAllOrders);
Router.get("/:id", getOrderById);
Router.patch("/:id/status", updateOrderStatus);
module.exports =Router
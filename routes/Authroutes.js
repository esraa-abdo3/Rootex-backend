const express = require("express");
const Router = express.Router();
const { register, login, getMe, logout, changePassword } =require("../controllers/Auth/Authcontrollers")
const { body } = require("express-validator");
const { validationSchema } = require("../middleware/validationSchema");

const verifyToken = require("../middleware/VerfiyToken");

Router.post("/register", validationSchema(), register);
Router.post("/login", [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], login);

Router.get("/me", verifyToken, getMe);

Router.get("/logout", logout);
Router.patch("/change-password", verifyToken, [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], changePassword);

module.exports = Router;
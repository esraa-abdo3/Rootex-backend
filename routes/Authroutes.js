const express = require("express");
const Router = express.Router();
const { register, login  } =require("../controllers/Auth/Authcontrollers")
const { body } = require("express-validator");
const { validationSchema } = require("../middleware/validationSchema");

Router.post("/register", validationSchema(), register);
Router.post("/login", [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], login);



module.exports = Router;
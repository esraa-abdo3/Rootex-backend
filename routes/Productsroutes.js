const express = require("express");
const Router = express.Router();

const { body } = require("express-validator");
const verfiyToken = require("../middleware/VerfiyToken");
const AllowedTo = require("../middleware/AllowedTo");
const upload = require("../middleware/uploadMiddleware");
const { Createproduct, getproducts, getproductbyid, deleteproduct, updateProduct } = require("../controllers/Products/productscontrollers");
Router.post(
  "/create",
  verfiyToken,
AllowedTo("admin"),
  upload.array("images",3),
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("description")
      .notEmpty()
      .withMessage("Description is required"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),

    body("stock")
      .optional()
      .isNumeric()
      .withMessage("Stock must be a number"),

    body("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
  ],
  Createproduct
);
Router.get("/getallproducts", getproducts);
Router.get("/:id", getproductbyid)
Router.delete("/:id", deleteproduct);
Router.patch("/:id",   upload.array("images",3), updateProduct);
module.exports =Router

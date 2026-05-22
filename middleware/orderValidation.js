const { body } = require("express-validator");

const createOrderValidation = () => {
  [
    // name
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString(),

    // phone
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .matches(/^01[0125][0-9]{8}$/)
      .withMessage("Invalid Egyptian phone number"),

    // email (optional but validated if exists)
    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format"),

    // governorate
    body("governorate")
      .notEmpty()
      .withMessage("Governorate is required"),

    // city
    body("city")
      .notEmpty()
      .withMessage("City is required"),

    // address
    body("address")
      .notEmpty()
      .withMessage("Address is required"),

    // items
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must not be empty"),

    body("items.*.product")
      .notEmpty()
      .withMessage("Product is required"),

    body("items.*.quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),

    // paymentMethod
    body("paymentMethod")
      .notEmpty()
      .withMessage("Payment method is required")
      .isIn(["cash", "paymob"])
      .withMessage("Invalid payment method"),
  ]
};

module.exports = {
  createOrderValidation
};
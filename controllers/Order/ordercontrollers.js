
const Order = require("../../models/Ordermodel");
const { validationResult } = require("express-validator");
const Asncwrapper = require("../../middleware/Asncwrapper");
const { Success, Error, Fail } = require("../../utilits/HttpsStatus");
const AppError = require("../../utilits/AppError");
const Product = require("../../models/Productmodels");
const axios = require("axios");
const { createPaymobIntention } = require("../../services/paymob.service");

const createOrder = Asncwrapper(async (req, res, next) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(AppError.createError({ data: errors.array() }, 400, "Fail"));
  }

  const { name, phone, email, address, items, paymentMethod, governorate, city } = req.body;

  if (!items || items.length === 0) {
    return next(AppError.createError("No items found", 400, "Fail"));
  }

  let totalPrice = 0;
  let orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(AppError.createError("Product not found", 404, "Fail"));
    }

    if (product.stock < item.quantity) {
      return next(
        AppError.createError(`Not enough stock for ${product.name.en}`, 400, "Fail")
      );
    }

    totalPrice += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  // ── Create order in DB ─────────────────────────────────────
  const order = await Order.create({
    name,
    phone,
    email,
    governorate,
    city,
    address,
    items: orderItems,
    totalPrice,
    paymentMethod,
    paymentStatus: "pending",
  });

  // ── Build sheet items ──────────────────────────────────────
  const sheetItems = await Promise.all(
    order.items.map(async (item) => {
      const productData = await Product.findById(item.product);
      return {
        productName: productData?.name?.en || "Unknown",
        quantity: item.quantity,
        price: item.price,
      };
    })
  );

  // ── Send to Google Sheet (non-blocking) ───────────────────
  // axios
  //   .post(process.env.GOOGLE_SHEET_URL, {
  //     orderId: order._id.toString(),
  //     orderNumber: order.orderNumber, 
  //     name: order.name,
  //     phone: order.phone,
  //     email: order.email || "",
  //     country: "Egypt",
  //     governorate,
  //     city,
  //     address: order.address,
  //     items: sheetItems,
  //     totalPrice: order.totalPrice,
  //     paymentMethod: order.paymentMethod,
  //     paymentStatus: "pending",
  //     orderStatus: "pending",
  //   })
  //   .then(() => console.log("✅ Sent to Google Sheet"))
  //   .catch((err) => console.log("⚠️ Google Sheet Error:", err.response?.data || err.message));
// ── Send to Google Sheet (non-blocking) ───────────────────
axios
  .post(
    process.env.GOOGLE_SHEET_URL,
    JSON.stringify({         // ✅ stringify يدوي
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      name: order.name,
      phone: order.phone,
      email: order.email || "",
      country: "Egypt",
      governorate,
      city,
      address: order.address,
      items: sheetItems,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    }),
    {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",  // ✅ ده هو السر
      },
      maxRedirects: 5,  // ✅ اتبع الـ redirect
    }
  )
  .then(() => console.log("✅ Sent to Google Sheet"))
  .catch((err) => console.log("⚠️ Google Sheet Error:", err.response?.data || err.message));
  // ── Cash flow ──────────────────────────────────────────────
  if (paymentMethod === "cash") {
    return res.status(201).json({
      status: "Success",
      message: "Order created (Cash)",
      data: order,
    });
  }

  // ── Paymob flow ────────────────────────────────────────────
  if (paymentMethod === "paymob") {
    const checkoutUrl = await createPaymobIntention({ order, items: sheetItems });

    return res.status(201).json({
      status: "Success",
      message: "Order created (Paymob)",
      data: {
        order,
        checkoutUrl,
      },
    });
  }


  return res.status(201).json({
    status: "Success",
    message: "Order created",
    data: order,
  });
});

const getAllOrders = Asncwrapper(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: "items.product",
      select: "name images price idnumber",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "Success",
    data: orders,
  });
});

const getOrderById = Asncwrapper(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate({
    path: "items.product",
    select: "name images price",
  });

  if (!order) {
    return next(AppError.createError("Order not found", 404, "Fail"));
  }

  res.status(200).json({
    status: "Success",
    data: order,
  });
});

const updateOrderStatus = Asncwrapper(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const allowedStatus = ["pending", "processing", "shipped", "delivered", "canceled"];

  if (!allowedStatus.includes(orderStatus)) {
    return next(AppError.createError("Invalid order status", 400, "Fail"));
  }

  const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });

  if (!order) {
    return next(AppError.createError("Order not found", 404, "Fail"));
  }

  try {
    await axios.post(process.env.GOOGLE_SHEET_URL, {
      action: "update",
        orderNumber: order.orderNumber, 
      orderStatus: order.orderStatus,
    });
    console.log("✅ Sheet updated");
  } catch (err) {
    console.log("⚠️ Sheet update failed", err.message);
  }

  res.status(200).json({
    status: "Success",
    message: "Order status updated",
    data: order,
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};

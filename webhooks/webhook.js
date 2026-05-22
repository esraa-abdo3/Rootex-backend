// const Order = require("../models/Order");

// const paymobWebhook = async (req, res) => {
//   const { obj } = req.body;

//   const orderId = obj.merchant_order_id;

//   const order = await Order.findById(orderId);

//   if (!order) return res.sendStatus(404);

//   if (obj.success === true) {
//     order.paymentStatus = "paid";
//     order.orderStatus = "processing";
//   } else {
//     order.paymentStatus = "failed";
//   }

//   await order.save();

//   res.sendStatus(200);
// };

// module.exports = { paymobWebhook };
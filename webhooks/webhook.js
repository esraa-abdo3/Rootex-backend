// const crypto = require("crypto");
// const Order = require("../models/Ordermodel");

// const paymobWebhook = async (req, res) => {
//   console.log("Webhook hit");
//   try {
//     // ── HMAC Verification ──────────────────────────────────────
//     const receivedHmac = req.query.hmac;
//     const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

//     if (receivedHmac && hmacSecret) {
//       const body = req.body;
//       const obj = body.obj || {};


//       const hmacFields = [
//         obj.amount_cents,
//         obj.created_at,
//         obj.currency,
//         obj.error_occured,
//         obj.has_parent_transaction,
//         obj.id,
//         obj.integration_id,
//         obj.is_3d_secure,
//         obj.is_auth,
//         obj.is_capture,
//         obj.is_refunded,
//         obj.is_standalone_payment,
//         obj.is_voided,
//         obj.order?.id,
//         obj.owner,
//         obj.pending,
//         obj.source_data?.pan,
//         obj.source_data?.sub_type,
//         obj.source_data?.type,
//         obj.success,
//       ]
//         .map((v) => String(v ?? ""))
//         .join("");

//       const calculatedHmac = crypto
//         .createHmac("sha512", hmacSecret)
//         .update(hmacFields)
//         .digest("hex");

//       if (calculatedHmac !== receivedHmac) {
//         console.log("❌ HMAC mismatch");
//         return res.sendStatus(401);
//       }
//     }

//     // ── Process the webhook ────────────────────────────────────
//     const { obj } = req.body;
//          console.log(JSON.stringify(req.body, null, 2));
//     const orderId =
//   obj?.order?.merchant_order_id ||
//   obj?.merchant_order_id;
//     console.log(orderId)

//     if (!orderId) {
//       console.log("⚠️ No orderId in webhook");
//       return res.sendStatus(200);
//     }

//     const order = await Order.findById(orderId);
//     if (!order) return res.sendStatus(404);

// if (order.paymentStatus !== "paid") {
//   if (obj.success === true && obj.pending === false) {
//     order.paymentStatus = "paid";
//     order.orderStatus = "processing";
//   } else {
//     order.paymentStatus = "failed";
//   }

//   await order.save();
// }

//     await order.save();
//     console.log(`✅ Webhook processed - Order ${orderId} - ${order.paymentStatus}`);
//     res.sendStatus(200);
//   } catch (err) {
//     console.error("❌ Webhook error:", err.message);
//     res.sendStatus(500);
//   }
//   console.log({
//   merchantOrderId: obj?.order?.merchant_order_id,
//   success: obj.success,
//   pending: obj.pending,
//   transactionId: obj.id,
// });
// };

// module.exports = { paymobWebhook };
const crypto = require("crypto");
const Order = require("../models/Ordermodel");
const axios = require("axios");

const paymobWebhook = async (req, res) => {
  console.log("✅ Webhook hit");

  try {
    const receivedHmac = req.query.hmac;
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;


    if (receivedHmac && hmacSecret) {
      const body = req.body;
      const obj = body.obj || {};

      const hmacFields = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order?.id,
        obj.owner,
        obj.pending,
        obj.source_data?.pan,
        obj.source_data?.sub_type,
        obj.source_data?.type,
        obj.success,
      ]
        .map((v) => String(v ?? ""))
        .join("");

      const calculatedHmac = crypto
        .createHmac("sha512", hmacSecret)
        .update(hmacFields)
        .digest("hex");

      if (calculatedHmac !== receivedHmac) {
        console.log("❌ HMAC mismatch");
        return res.sendStatus(401);
      }
    }


    const { obj } = req.body;

  

    const orderId =
      obj?.order?.merchant_order_id ||
      obj?.merchant_order_id;



    if (!orderId) {

      return res.sendStatus(200);
    }

    const order = await Order.findById(orderId);

    if (!order) {
     
      return res.sendStatus(404);
    }

    // ── Update Order ──────────────────────────
    // if (order.paymentStatus !== "paid") {
    //   if (obj.success === true && obj.pending === false) {
    //     order.paymentStatus = "paid";
    //     order.orderStatus = "processing";

    //   } else {
    //     order.paymentStatus = "failed";
    //   }

    //   await order.save();
    //        try {
    //    await axios.post(process.env.GOOGLE_SHEET_URL, {
    //      action: "update",
    //      orderId: order._id.toString(),
    //      orderStatus: order.orderStatus,
    //    });
    //    console.log("✅ Sheet updated");
    //  } catch (err) {
    //    console.log("⚠️ Sheet update failed", err.message);
    //  }
    // }
    if (order.paymentStatus !== "paid") {
  if (obj.success === true && obj.pending === false) {
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
  } else {
    order.paymentStatus = "failed";
    order.orderStatus = "failed";
  }

  await order.save();

  try {
    await axios.post(process.env.GOOGLE_SHEET_URL, {
      action: "update",
      orderId: order._id.toString(),
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });

    console.log("✅ Sheet updated");
  } catch (err) {
    console.log("⚠️ Sheet update failed", err.message);
  }
}



    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.sendStatus(500);
  }
};

module.exports = { paymobWebhook };
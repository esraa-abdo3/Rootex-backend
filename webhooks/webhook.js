const crypto = require("crypto");
const Order = require("../models/Ordermodel");

const paymobWebhook = async (req, res) => {
  try {
    // ── HMAC Verification ──────────────────────────────────────
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

    // ── Process the webhook ────────────────────────────────────
    const { obj } = req.body;
    const orderId = obj?.extras?.merchant_order_id || obj?.merchant_order_id;

    if (!orderId) {
      console.log("⚠️ No orderId in webhook");
      return res.sendStatus(200);
    }

    const order = await Order.findById(orderId);
    if (!order) return res.sendStatus(404);

    if (obj.success === true) {
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
    } else {
      order.paymentStatus = "failed";
    }

    await order.save();
    console.log(`✅ Webhook processed - Order ${orderId} - ${order.paymentStatus}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(500);
  }
};

module.exports = { paymobWebhook };

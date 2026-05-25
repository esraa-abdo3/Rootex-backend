const axios = require("axios");

const createPaymobIntention = async ({ order, items }) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/v1/intention/",
    {
      amount: order.totalPrice * 100,
      currency: "EGP",
      payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID)],
      items: items.map((i) => ({
        name: i.productName,
        amount: i.price * 100,
        quantity: i.quantity,
      })),
      billing_data: {
        first_name: order.name,
        last_name: ".",
        phone_number: order.phone,
        email: order.email || "NA@email.com",
        apartment: "NA",
        floor: "NA",
        street: order.address,
        building: "NA",
        city: order.city,
        country: "EG",
        state: order.governorate,
      },
      customer: {
        first_name: order.name,
        last_name: ".",
        email: order.email || "NA@email.com",
      },
      extras: {
        merchant_order_id: order._id.toString(),
      },
      notification_url: "https://rootex-backend.vercel.app/api/v1/order/webhook",
      redirection_url: "https://rotex-front.vercel.app/payment-result",
    },
    {
      headers: {
        Authorization: `Token ${process.env.PAYMOB_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
};

module.exports = { createPaymobIntention };

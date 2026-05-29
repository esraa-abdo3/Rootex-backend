
const axios = require("axios");

const createPaymobIntention = async ({ order, items }) => {
  console.log("Integration IDs:", [
  parseInt(process.env.PAYMOB_INTEGRATION_ID),
  parseInt(process.env.PAYMOB_WALLET_INTEGRATION_ID),
]);

  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      {
        amount: order.totalPrice * 100,
        currency: "EGP",

     payment_methods: [
  parseInt(process.env.PAYMOB_INTEGRATION_ID),       
  parseInt(process.env.PAYMOB_WALLET_INTEGRATION_ID), 
        ],
     

        items: items.map((i) => ({
          name: i.productName,
          amount: i.price * 100,
          description: i.productName,
          quantity: i.quantity,
        })),

        billing_data: {
          apartment: "NA",
          first_name: order.name,
          last_name: "NA",
          street: order.address || "NA",
          building: "NA",
          phone_number: order.phone,
          city: order.city || "Cairo",
          country: "EG",
          email: order.email || "test@test.com",
          floor: "NA",
          state: order.governorate || "Cairo",
        },

        extras: {
          merchant_order_id: order._id.toString(),
        },

        special_reference: order._id.toString(),

        expiration: 3600,

        notification_url:
          "https://rootex-backend.vercel.app/api/v1/order/webhook",

        redirection_url: `https://rotex-front.vercel.app/success/5826`,
      },

      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );



    return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
  } catch (err) {
    console.log(
      "❌ Paymob Intention Error:",
      err.response?.data || err.message
    );

    throw err;
  }
};

module.exports = { createPaymobIntention };
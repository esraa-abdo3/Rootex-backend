// const axios = require("axios");

// const createPaymobIntention = async ({ order, items }) => {
  
//   // Step 1: Auth — جيبي token
//   const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
//     api_key: process.env.PAYMOB_API_KEY,
//   });
  
//   console.log("Auth response:", authRes.data);
//   const token = authRes.data.token;

//   // Step 2: ابعتي الـ intention بالـ token
//   const { data } = await axios.post(
//     "https://accept.paymob.com/v1/intention/",
//     {
//       amount: order.totalPrice * 100,
//       currency: "EGP",
//       payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID)],
//       items: items.map((i) => ({
//         name: i.productName,
//         amount: i.price * 100,
//         quantity: i.quantity,
//       })),
//       billing_data: {
//         first_name: order.name,
//         last_name: ".",
//         phone_number: order.phone,
//         email: order.email || "NA@email.com",
//         apartment: "NA",
//         floor: "NA",
//         street: order.address,
//         building: "NA",
//         city: order.city,
//         country: "EG",
//         state: order.governorate,
//       },
//       customer: {
//         first_name: order.name,
//         last_name: ".",
//         email: order.email || "NA@email.com",
//       },
//       extras: {
//         merchant_order_id: order._id.toString(),
//       },
//       notification_url: "https://rootex-backend.vercel.app/api/v1/order/webhook",
//       redirection_url: `https://rotex-front.vercel.app/success/${order._id}`,
//     },
//     {
//       headers: {
//         Authorization: `Token ${token}`,  // ← token من الـ auth
//         "Content-Type": "application/json",
//       },
//     }
//   ).catch(err => {
//   console.log("Paymob Error:", err.response?.data);
//   throw err;
// });

//   return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
// };

// module.exports = { createPaymobIntention };
const axios = require("axios");

// const createPaymobIntention = async ({ order, items }) => {
//   // Step 1: Auth
//   const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
//     api_key: process.env.PAYMOB_API_KEY,
//   });

//   const token = authRes.data.token;
//   console.log("✅ Token:", token);

//   // Step 2: Intention
//   const { data } = await axios.post(
//     "https://accept.paymob.com/v1/intention/",
//     {
//       amount: order.totalPrice * 100,
//       currency: "EGP",
//       payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID)],
//       items: items.map((i) => ({
//         name: i.productName,
//         amount: i.price * 100,
//         quantity: i.quantity,
//       })),
//       billing_data: {
//         first_name: order.name,
//         last_name: ".",
//         phone_number: order.phone,
//         email: order.email || "NA@email.com",
//         apartment: "NA",
//         floor: "NA",
//         street: order.address,
//         building: "NA",
//         city: order.city,
//         country: "EG",
//         state: order.governorate,
//       },
//       customer: {
//         first_name: order.name,
//         last_name: ".",
//         email: order.email || "NA@email.com",
//       },
//       extras: {
//         merchant_order_id: order._id.toString(),
//       },
//       notification_url: "https://rootex-backend.vercel.app/api/v1/order/webhook",
//       redirection_url: `https://rotex-front.vercel.app/success/${order._id}`,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   ).catch((err) => {
//     console.log("❌ Paymob Intention Error:", err.response?.data);
//     throw err;
//   });

//   console.log("✅ Intention created:", data.client_secret);

//   return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
// };
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
      redirection_url: `https://rotex-front.vercel.app/success/${order._id}`,
    },
    {
      headers: {
        Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`, // ← Secret Key مباشرة
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => {
    console.log("❌ Paymob Error:", err.response?.data);
    throw err;
  });

  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
};

module.exports = { createPaymobIntention };

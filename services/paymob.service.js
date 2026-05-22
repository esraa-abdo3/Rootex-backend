// const axios = require("axios");

// const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
// const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
// const IFREAM_ID = process.env.PAYMOB_IFRAME_ID;

// // 1- AUTH
// const authenticate = async () => {
//   const { data } = await axios.post(
//     "https://accept.paymob.com/api/auth/tokens",
//     {
//       api_key: PAYMOB_API_KEY,
//     }
//   );

//   return data.token;
// };

// // 2- REGISTER ORDER
// const registerOrder = async (token, amountCents, orderId) => {
//   const { data } = await axios.post(
//     "https://accept.paymob.com/api/ecommerce/orders",
//     {
//       auth_token: token,
//       delivery_needed: "false",
//       amount_cents: amountCents,
//       currency: "EGP",
//       merchant_order_id: orderId,
//       items: [],
//     }
//   );

//   return data.id;
// };

// // 3- PAYMENT KEY (Checkout URL)
// const createPaymentKey = async ({
//   token,
//   orderId,
//   amountCents,
//   order,
// }) => {
//   const { data } = await axios.post(
//     "https://accept.paymob.com/api/acceptance/payment_keys",
//     {
//       auth_token: token,
//       amount_cents: amountCents,
//       expiration: 3600,
//       order_id: orderId,
//       integration_id: INTEGRATION_ID,

//       billing_data: {
//         first_name: order.name,
//         last_name: "User",
//         phone_number: order.phone,
//         email: order.email || "test@test.com",
//         apartment: "NA",
//         floor: "NA",
//         street: order.address,
//         building: "NA",
//         city: "Cairo",
//         country: "EG",
//         state: "NA",
//       },
//     }
//   );

//   return data.token;
// };

// // 4- FINAL CHECKOUT URL
// const getCheckoutUrl = (paymentToken) => {
//   return `https://accept.paymob.com/api/acceptance/iframes/${IFREAM_ID}?payment_token=${paymentToken}`;
// };

// module.exports = {
//   authenticate,
//   registerOrder,
//   createPaymentKey,
//   getCheckoutUrl,
// };
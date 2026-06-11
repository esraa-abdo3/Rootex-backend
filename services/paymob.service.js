

const axios = require("axios");

// const createPaymobIntention = async ({ order, items }) => {


//   const paymentMethods = [
//     parseInt(process.env.PAYMOB_INTEGRATION_ID),
//     parseInt(process.env.PAYMOB_WALLET_INTEGRATION_ID),
//   ].filter((id) => !isNaN(id));



//   try {
//     const { data } = await axios.post(
//       "https://accept.paymob.com/v1/intention/",
//       {
//         amount: order.totalPrice * 100,
//         currency: "EGP",
//         payment_methods: paymentMethods,

//    items: [
//   ...items.map((i) => ({
//     name: i.productName,
//     amount: i.price * 100,
//     description: i.productName,
//     quantity: i.quantity,
//   })),

//   {
//     name: "Shipping",
//     amount: (order.shippingPrice || 0) * 100,
//     description: "Shipping Fees",
//     quantity: 1,
//   },
// ],
        

//         billing_data: {
//           apartment: "NA",
//           first_name: order.name,
//           last_name: "NA",
//           street: order.address || "NA",
//           building: "NA",
//           phone_number: order.phone,
//           city: order.city || "Cairo",
//           country: "EG",
//           floor: "NA",
//           state: order.governorate || "Cairo",
//         },

//         extras: {
//             merchant_order_id: `${order.orderNumber}-${Date.now()}`,
//         },

//        special_reference: `${order.orderNumber}-${Date.now()}`,

//         expiration: 3600,

//         notification_url:
//           "https://rootex-backend.vercel.app/api/v1/order/webhook",

//         redirection_url: `https://rotex-front.vercel.app/success/${order.orderNumber}`,
//       },
//       {
//         headers: {
//           Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
//   } catch (err) {
//     console.log(
//       "❌ Paymob Intention Error:",
//       err.response?.data || err.message
//     );
//     throw err;
//   }
// };

// module.exports = { createPaymobIntention };
const createPaymobIntention = async ({ order, items }) => {
  const paymentMethods = [
    parseInt(process.env.PAYMOB_INTEGRATION_ID),
    parseInt(process.env.PAYMOB_WALLET_INTEGRATION_ID),
  ].filter((id) => !isNaN(id));
 
  
  const orderRef = String(order.orderNumber);
 
  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      {
        amount: order.totalPrice * 100,
        currency: "EGP",
        payment_methods: paymentMethods,
 
        items: [
          ...items.map((i) => ({
            name: i.productName,
            amount: i.price * 100,
            description: i.productName,
            quantity: i.quantity,
          })),
          {
            name: "Shipping",
            amount: (order.shippingPrice || 0) * 100,
            description: "Shipping Fees",
            quantity: 1,
          },
        ],
 
        billing_data: {
          apartment: "NA",
          first_name: order.name,
          last_name: "NA",
          street: order.address || "NA",
          building: "NA",
          phone_number: order.phone,
          city: order.city || "Cairo",
          country: "EG",
          floor: "NA",
          state: order.governorate || "Cairo",
        },
 
        // ✅ FIX 4: ثابت بدون timestamp
        extras: {
          merchant_order_id: orderRef,
        },
 
        // ✅ FIX 4: ثابت بدون timestamp
        special_reference: orderRef,
 
        expiration: 3600,
 
        notification_url:
          "https://rootex-backend.vercel.app/api/v1/order/webhook",
 
        redirection_url: `https://rotex-front.vercel.app/success/${orderRef}`,
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
 
module.exports = {  createPaymobIntention };
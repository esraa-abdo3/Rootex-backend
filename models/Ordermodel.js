const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
 
        name: {
          type: String,
          required: true
        },
   phone: {
  type: String,
  required: true,
  match: /^01[0125][0-9]{8}$/,
},
        email: {
            type: String
        },

          country: {
    type: String,
    default: "Egypt",
    },
            governorate: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    },
          address: {
            type: String,
            required: true
    },
  

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "paymob"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered","canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
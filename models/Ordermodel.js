const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: String,
  seq: { type: Number, default:999 }
});
const Counter = mongoose.model("Counter", counterSchema);


const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^01[0125][0-9]{8}$/,
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
      required: true,
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
      enum: ["pending", "processing", "shipped", "delivered", "canceled", "failed"],
      default: "pending",
    },
    shippingPrice: {
         type: Number,
    }
  },
  { timestamps: true }
);


orderSchema.pre("save", async function () {

  if (this.isNew) {

 const counter = await Counter.findOneAndUpdate(
  { name: "orderNumber" },
  { $inc: { seq: 1 } },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }
);

 this.orderNumber = `A${counter.seq}`;
  }
});


module.exports = mongoose.model("Order", orderSchema);
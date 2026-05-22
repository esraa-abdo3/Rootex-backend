const monogoose = require('mongoose');

const productSchema =  new monogoose.Schema(
  {
    name: {
      ar: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
    },

    description: {
      ar: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
    },

    images: {
      type: [String], 
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

        category: {
        
      type: String,
       default: "hair-care"
    },
  },
  { timestamps: true }
);
const ProductModel = monogoose.model("Product", productSchema);
module.exports = ProductModel;

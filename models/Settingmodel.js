const mongoose = require("mongoose");

const multiLangSchema = {
  ar: {
    type: String,
    default: "",
  },
  en: {
    type: String,
    default: "",
  },
};

const settingSchema = new mongoose.Schema(
  {
    // ================= HOOK =================
    hook: {
      text1: multiLangSchema,
      text2: multiLangSchema,
      highlight1: multiLangSchema,
      highlight2: multiLangSchema,
    },

    // ================= BUTTON =================
    buttonText: multiLangSchema,

    // ================= COLORS =================
    colors: {
      backgroundColor: String,
      buttonbackground: String,
      buttontext: String,
      textColor: String,
      highlightColor: String,
    },

    // ================= IMAGES =================
    images: {
      herosection: String,
      resultBg: [String],
    },

    Fontfamily: {
      type: String,
    },
    Brand: {
       type: String,
    },

    reviewheader: {
      text: multiLangSchema,
      paragraph: multiLangSchema,
    },
    fansText: {
    type: multiLangSchema,
    },
    shippingSignature: {
      type: multiLangSchema,
      
    },
    shippingPrice: {
     type: Number,
    },
    // ================= FLOATING BUTTON =================
floatingButton: {
  visible: { type: Boolean, default: true },
  text: multiLangSchema
},
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
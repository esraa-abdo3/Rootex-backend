const mongoose = require("mongoose");

const SectionOrderSchema = new mongoose.Schema(
  {
    Heroheader: {
              type: Number,
      default: 1,
    },
    Hero: {
          type: Number,
      default: 2,
    },
    product: {
      type: Number,
      default: 3,
    },

    after: {
      type: Number,
      default: 4,
    },

    review: {
      type: Number,
      default: 5,
    },
    CTA: {
      type: Number,
      default: 6,
      
    }
  },
  {
    timestamps: true,
  }
);

const SectionOrder = mongoose.model("SectionOrder", SectionOrderSchema);

module.exports = SectionOrder;
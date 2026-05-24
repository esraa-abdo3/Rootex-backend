const mongoose = require("mongoose");

const SectionOrderSchema = new mongoose.Schema(
  {
    product: {
      type: Number,
      default: 1,
    },

    after: {
      type: Number,
      default: 2,
    },

    review: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

const SectionOrder = mongoose.model("SectionOrder", SectionOrderSchema);

module.exports = SectionOrder;
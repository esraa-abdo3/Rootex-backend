const mongoose =require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    review: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports=Review


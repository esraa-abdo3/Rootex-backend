const Review = require("../../models/review.js");
const imagekit = require("../../utilits/imagekit");

 const createReview = async (req, res, next) => {
  try {
    const { name, review, rating, isVisible } = req.body;
        let imageUrl = null;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `review-${Date.now()}`,
        folder: "/reviews",
      });
      imageUrl = uploaded.url;
    }

    const newReview = await Review.create({
      name,
      review,
      rating,
      isVisible,
      image: imageUrl,
    });

    res.status(201).json({
      status: "Success",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};
 const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "Success",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
 const getVisibleReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      isVisible: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "Success",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `review-${Date.now()}`,
        folder: "/reviews",
      });
      updateData.image = uploaded.url;
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      status: "Success",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};
 const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      status: "Success",
      message: "Review deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    createReview,
  getReviews,
  getVisibleReviews,
  updateReview,
  deleteReview,

}
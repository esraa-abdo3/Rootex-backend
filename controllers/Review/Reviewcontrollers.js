const Review = require( "../../models/review.js");

 const createReview = async (req, res, next) => {
  try {
    const { name, review, rating, isVisible } = req.body;

    const newReview = await Review.create({
      name,
      review,
      rating,
      isVisible,
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

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

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
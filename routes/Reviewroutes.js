const express = require( "express");

const {
  createReview,
  getReviews,
  getVisibleReviews,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
}  =  require( "../controllers/Review/Reviewcontrollers")

const router = express.Router();

router.post("/", createReview);

router.get("/", getReviews);

router.get("/visible", getVisibleReviews);

router.patch("/:id", updateReview);

router.delete("/:id", deleteReview);



module.exports=router


const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  createReview,
  getReviews,
  getVisibleReviews,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
}  =  require( "../controllers/Review/Reviewcontrollers")

const router = express.Router();

router.post("/",upload.single("image"), createReview);

router.get("/", getReviews);

router.get("/visible", getVisibleReviews);

router.patch("/:id" ,upload.single("image"), updateReview);

router.delete("/:id", deleteReview);



module.exports=router


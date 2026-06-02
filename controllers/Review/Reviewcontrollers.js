const Review = require("../../models/review.js");
const imagekit = require("../../utilits/imagekit");
const translate = require("google-translate-api-x");

//  const createReview = async (req, res, next) => {
//   try {
//     const { name, review, rating, isVisible } = req.body;
//         let imageUrl = null;

//     if (req.file) {
//       const uploaded = await imagekit.upload({
//         file: req.file.buffer,
//         fileName: `review-${Date.now()}`,
//         folder: "/reviews",
//       });
//       imageUrl = uploaded.url;
//     }

//     const newReview = await Review.create({
//       name,
//       review,
//       rating,
//       isVisible,
//       image: imageUrl,
//     });

//     res.status(201).json({
//       status: "Success",
//       data: newReview,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
 





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

    // 🔥 الترجمة هنا
    let translatedText = null;

    try {
      const result = await translate(review, { to: "en" });
      translatedText = result.text;
    } catch (err) {
      console.log("Translation error:", err);
    }

    const newReview = await Review.create({
      name,
      review: {
        ar: review,
        en: translatedText,
      },
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
// const updateReview = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body };

//     if (req.file) {
    
//       const uploaded = await imagekit.upload({
//         file: req.file.buffer,
//         fileName: `review-${Date.now()}`,
//         folder: "/reviews",
//       });
//       updateData.image = uploaded.url;
//     } else if (req.body.removeImage === "true") {
    
//       updateData.image = null;
//     }

//     delete updateData.removeImage;

//     const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     res.status(200).json({
//       status: "Success",
//       data: updatedReview,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
 





const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // 🧠 هات الريفيو القديم عشان نقارن
    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).json({
        status: "Fail",
        message: "Review not found",
      });
    }

    // 🖼️ صورة جديدة
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `review-${Date.now()}`,
        folder: "/reviews",
      });

      updateData.image = uploaded.url;
    } 
    else if (req.body.removeImage === "true") {
      updateData.image = null;
    }

    delete updateData.removeImage;

    // 🔥 الترجمة (فقط لو الريفيو اتغير)
    if (updateData.review) {
      const newText = updateData.review;

      const oldText = existingReview.review?.ar;

      if (newText !== oldText) {
        try {
          const result = await translate(newText, { to: "en" });

          updateData.review = {
            ar: newText,
            en: result.text,
          };
        } catch (err) {
          console.log("Translation error:", err);

          updateData.review = {
            ar: newText,
            en: null,
          };
        }
      } else {
        // لو نفس النص، خلي القديم زي ما هو
        updateData.review = existingReview.review;
      }
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
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
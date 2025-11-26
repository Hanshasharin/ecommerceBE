const Review = require("../models/reviewModel");

const addReviewController = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    // const userId = req.user?._id || "67xxxxx"; 
    const userId = req.user._id; // from auth middleware

    const newReview = await Review.create({
      productId,
      userId,
      rating,
      review,
    });

    res.status(201).json({ message: "Review Added", review: newReview });
  } catch (err) {
      console.log("Review Error >>>", err); // 👈 show full error in terminal

    res.status(500).json({ message: "Error adding review", error: err });
  }
};

const getReviewsController = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

module.exports = { addReviewController, getReviewsController };

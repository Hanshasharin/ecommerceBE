const express = require("express");
const { addReviewController, getReviewsController } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/add",authMiddleware, addReviewController);
router.get("/list/:productId", getReviewsController);

module.exports = router;

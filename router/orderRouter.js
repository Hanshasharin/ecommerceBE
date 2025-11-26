const express = require("express");
const router = express.Router();
const {
  checkoutFromCart,
  getUserOrders,
  getSingleOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddlewares");

// POST /api/orders/checkout  → create order from cart
router.post("/checkout", authMiddleware, checkoutFromCart);

// GET /api/orders          → list logged-in user's orders
router.get("/", authMiddleware, getUserOrders);

// GET /api/orders/:orderId → single order detail
router.get("/:orderId", authMiddleware, getSingleOrder);

module.exports = router;

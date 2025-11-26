const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddlewares");
const { addToCart, getCart, increaseQty, decreaseQty, removeFromCart } = require("../controllers/cartController");

router.post("/add", authMiddleware, addToCart );
router.get("/", authMiddleware, getCart);
router.put("/increase", authMiddleware, increaseQty);
router.put("/decrease", authMiddleware, decreaseQty);
router.delete("/remove/:productId", authMiddleware, removeFromCart);

module.exports = router;

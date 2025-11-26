const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const checkoutFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod = "COD", address } = req.body;

    // Get cart items for this user
    const cartItems = await Cart.find({ userId }).populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      // For demo: we just mark COD as PENDING, ONLINE as PAID directly
      status: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
      address,
    });

    // clear cart after placing order
    await Cart.deleteMany({ userId });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Error during checkout", error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

module.exports = {
  checkoutFromCart,
  getUserOrders,
  getSingleOrder,
};

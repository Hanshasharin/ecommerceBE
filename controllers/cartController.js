const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if item already in cart
    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.json({ message: "Quantity increased", cart: existingItem });
    }

    const newItem = await Cart.create({ userId, productId });
    res.status(201).json({ message: "Added to cart", cart: newItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.find({ userId }).populate("productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

const increaseQty = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const item = await Cart.findOne({ userId, productId });
  item.quantity++;
  await item.save();
  res.json(item);
};

const decreaseQty = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const item = await Cart.findOne({ userId, productId });
  if (item.quantity > 1) {
    item.quantity--;
    await item.save();
  } else {
    await Cart.deleteOne({ userId, productId });
  }
  res.json(item);
};

const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  await Cart.deleteOne({ userId, productId });
  res.json({ message: "Item removed" });
};

module.exports ={addToCart,getCart,increaseQty,decreaseQty,removeFromCart}
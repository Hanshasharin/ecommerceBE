const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    image:{
        type: String, // Image URLs or file paths
      },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

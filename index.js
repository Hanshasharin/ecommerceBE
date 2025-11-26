require("dotenv").config();   // LOAD FIRST

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport.js");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter.js")
const reviewRouter=require("./router/reviewRouter.js")
const cartRouter=require('./router/cartRouter.js')
const orderRouter = require("./router/orderRouter.js")
const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://ecommerce-fe-vert.vercel.app",
    credentials: true,
  })
);

// Use ONLY passport.initialize
app.use(passport.initialize());

app.use("/api", userRouter);
app.use("/api/product", productRouter)
app.use("/api/review", reviewRouter);
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)

mongoose
  .connect(process.env.DB_CONNECTION_LINK)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.send("<h1>gym</h1>");
})

app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});

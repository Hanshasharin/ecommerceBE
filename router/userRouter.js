const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/signup", signup);
router.post("/login", login);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/fail" }),
  (req, res) => {
    const token = jwt.sign(
      { _id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
     secure: true,            // cookie only for HTTPS
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,  
    });

    res.redirect("https://ecommerce-fe-vert.vercel.app"); // redirect to products
  }
);

router.get("/fail", (req, res) => {
  res.send("Google Login Failed");
});

module.exports = router;

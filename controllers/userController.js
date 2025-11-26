const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = Number(process.env.SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET



const signup = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this Email ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
    
    });

    // Create token
    // const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);
    const token = jwt.sign(
  { _id: newUser._id, email: newUser.email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    // Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // change to true in production HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        email: newUser.email,
    
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};




const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "Email and password are required"});
    }

    const user = await UserModel.findOne({email});
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    if (user.status === "inactive") {
      return res.status(401).json({message: "Account is inactive. Please contact admin."});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({message: "Invalid credentials."});

  
    const token = jwt.sign(
  { _id: user._id, email: user.email },
  process.env.JWT_SECRET
);


    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", 
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }).json({
      message: "Login successful",
      user: {
        profile_pic: user.profile_pic,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({message: "Server error"});
  }
};

module.exports= {signup,login}
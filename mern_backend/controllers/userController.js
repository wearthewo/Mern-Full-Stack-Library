import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { createJWT } from "../utils/tokenUtils.js";

// Register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });
    const newUser = new User({ firstName, lastName, email, password, role });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    const validUser = user && isMatch;
    if (!validUser)
      return res.status(400).json({ message: "Invalid email or password" });
    const token = createJWT({ userId: user._id, role: user.role });
    res.status(200).json({ message: "Login successful", token });
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "Logout successful" });
};

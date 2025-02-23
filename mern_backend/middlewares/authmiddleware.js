import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { verifyJWT } from "../utils/tokenUtils.js";

// Middleware to authenticate user (JWT verification)

export const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  try {
    const { userID, role } = verifyJWT(token);
    req.user = { userID, role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized Access" });
  }
};

// Get user profile (Protected Route)
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

// Middleware to authorize admin role
export const authRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access denied. Not authorized." });
    }
    next();
  };
};

// Middleware to check user role
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user data found" });
    }

    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next(); // User has the required role, proceed to route
  };
};

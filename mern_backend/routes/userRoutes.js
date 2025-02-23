import express from "express";
import { register, login, logout } from "../controllers/userController.js";
import {
  authUser,
  authRole,
  checkRole,
  getUserProfile,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

/* Only Admins Can Create Users, While All Users Can Log In
This means:

Only an admin can register a new user (e.g., adding a new member or another admin).
Any user (admin or member) can log in with their email and password. */

router.post("/register", authUser, authRole("admin"), register); // Only Admins can register new users
router.post("/login", login);
router.get("/logout", authUser, logout);
router.get("/profile", authUser, getUserProfile); // // Regular Users Can View Their Profile
router.get(
  "/getallusers",
  authUser,
  authRole("admin"),
  checkRole("admin"),
  getUserProfile
); // Only Admins Can View All Users

export default router;

import express from "express";
import { Router } from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import {
  getTransactions,
  checkoutBook,
  returnBook,
} from "../controllers/transactionController.js";
import {
  authRole,
  authUser,
  checkRole,
} from "../middlewares/authmiddleware.js";

const router = Router();

// Book routes
router.get("/books", authUser, getBooks);
router.get("/books:id", authUser, getBook);
router.post("/books", authUser, authRole("admin"), createBook);
router.put("/books/:id", authUser, authRole("admin"), updateBook);
router.delete("/books/:id", authUser, authRole("admin"), deleteBook);

// Member routes
router.get("/members", authUser, authRole("admin"), getMembers);
router.get("/members/:id", authUser, authRole("admin"), getMember);
router.post("/members", authUser, authRole("admin"), createMember);
router.put("/members/:id", authUser, authRole("admin"), updateMember);
router.delete("/members/:id", authUser, authRole("admin"), deleteMember);

// Transaction routes
router.get("/transactions", authUser, getTransactions);
router.post(
  "/transactions/checkout",
  authUser,
  checkRole("member"),
  checkoutBook
);
router.put(
  "/transactions/return/:transactionId",
  authUser,
  checkRole("member"),
  returnBook
);

export default router;

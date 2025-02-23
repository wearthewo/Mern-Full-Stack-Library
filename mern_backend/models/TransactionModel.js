import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  checkoutDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: {
    type: String,
    enum: ["checked-out", "returned"],
    default: "checked-out",
  },
  dueDate: { type: Date },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

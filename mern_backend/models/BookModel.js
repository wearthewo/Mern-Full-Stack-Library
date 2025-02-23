import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    publishYear: {
      type: Number,
    },
    isbn: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    copiesAvailable: {
      type: Number,
      default: 0,
    },
    totalCopies: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;

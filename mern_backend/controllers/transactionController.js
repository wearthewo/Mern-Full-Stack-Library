import Transaction from "../models/TransactionModel.js";
import Member from "../models/MemberModel.js";
import Book from "../models/BookModel.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("book")
      .populate("member");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// checkout books
//create a new transcaction of books and update existing books
export const checkoutBook = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.copiesAvailable < 1) {
      return res
        .status(400)
        .json({ message: "Book not available for checkout" });
    }
    const transaction = new Transaction({
      book: bookId,
      member: memberId,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks
    });
    book.copiesAvailable -= 1;
    await book.save();
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// return books

export const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status === "returned") {
      return res
        .status(400)
        .json({ message: "Invalid transaction or book already returned" });
    }

    const book = await Book.findById(transaction.book);
    book.copiesAvailable += 1;
    await book.save();

    transaction.status = "returned";
    transaction.returnDate = new Date();
    await transaction.save();

    res
      .status(200)
      .json({ message: "Book returned successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

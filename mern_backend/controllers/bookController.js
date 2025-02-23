import Book from "../models/BookModel.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find(); //{ createdBy: req.user.userId }
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    //req.body.createdBy = req.user.userId;
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { search, author } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// adding pagination
export const pagedSearchBooks = async (req, res) => {
  try {
    const { search, author, page = 1, limit = 5 } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const totalBooks = await Book.countDocuments(query); // Total count for pagination
    const books = await Book.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

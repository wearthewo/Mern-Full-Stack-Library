import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";

export default function Dashboard({ setIsAuthenticated, userRole }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [editingBook, setEditBook] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get("/books");
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    if (userRole !== "admin") return; // Restrict members

    try {
      const response = await API.post("/books", { title, author });
      setBooks([...books, response.data]);
      setTitle("");
      setAuthor("");
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const deleteBook = async (id) => {
    if (userRole !== "admin") return; // Restrict members

    try {
      await API.delete(`/books/${id}`);
      setBooks(books.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };
  // Fetch books (with search and filter)
  useEffect(() => {
    const getBooks = async () => {
      const data = await fetchSearchedBooks(search, filterAuthor);
      setBooks(data);
    };
    getBooks();
  }, [search, filterAuthor]);

  // Fetch books with optional search and filter
  const fetchSearchedBooks = async (search = "", author = "") => {
    try {
      const response = await API.get(
        `/books?search=${search}&author=${author}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );
      return [];
    }
  };
  // Enable editing mode
  const startEditing = (book) => {
    setEditBook(book._id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };
  // Update the book and refresh the list
  const handleUpdate = async () => {
    if (editingBook) {
      await updateBook(editingBook, { title: editTitle, author: editAuthor });
      setEditBook(null);
      setBooks(await fetchSearchedBooks(search, filterAuthor, currentPage));
    }
  };

  // Update book
  const updateBook = async (id, bookData) => {
    try {
      const response = await API.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating book:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch books with pagination
  const fetchPagedBooks = async (
    search = "",
    author = "",
    page = 1,
    limit = 5
  ) => {
    try {
      const response = await API.get(
        `/books?search=${search}&author=${author}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );
      return { books: [], totalPages: 1, currentPage: 1 };
    }
  };
  // Fetch books when the component loads or when filters change
  useEffect(() => {
    const getBooks = async () => {
      const { books, totalPages, currentPage } = await fetchPagedBooks(
        search,
        filterAuthor,
        currentPage
      );
      setBooks(books);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    };
    getBooks();
  }, [search, filterAuthor, currentPage]);

  const handleLogout = async () => {
    await API.post("/users/logout");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-blue-600 text-white py-4 text-center text-2xl font-bold">
        Dashboard - {userRole === "admin" ? "Admin" : "Member"}
      </div>

      {/* Show Add Book Form Only for Admins */}
      {userRole === "admin" && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-96">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Add a New Book
          </h2>
          <form onSubmit={addBook} className="space-y-3">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Add Book
            </button>
          </form>
        </div>
      )}

      {/* Book List */}
      <div className="mt-6 w-3/4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Books List</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {books.map((book) => (
            <div
              key={book._id}
              className="p-2 border-b flex justify-between items-center"
            >
              <span>
                {book.title} - {book.author}
              </span>
              {userRole === "admin" && (
                <button
                  onClick={() => deleteBook(book._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Search and Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by author..."
          className="border p-2 rounded w-1/3"
          onChange={(e) => setFilterAuthor(e.target.value)}
        />
      </div>

      {/* Books Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="border">
              <td className="border p-2">
                {editingBook === book._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    className="border p-1"
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td className="border p-2">
                {editingBook === book._id ? (
                  <input
                    type="text"
                    value={editAuthor}
                    className="border p-1"
                    onChange={(e) => setEditAuthor(e.target.value)}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td className="border p-2 flex gap-2">
                {editingBook === book._id ? (
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(book)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          ⬅️ Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

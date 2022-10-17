const db = require("../models");
const Book = db.book;

const getBooks = async (req, res) => {
  // find all books
  const books = await Book.findAll();
  // read query for available books
  const available = req.query.available;
  if (available === "true") {
    // no userId in book record means that book is not borrowed so it's available
    const filteredBooks = books.filter((book) => !book.userId);
    // return available books if exists
    if (!filteredBooks)
      return res.status(204).json({ message: "No books found." });
    return res.json(filteredBooks);
  }
  // no books found
  if (!books) return res.status(204).json({ message: "No books found." });
  res.json(books);
};

const createNewBook = async (req, res) => {
  // check if book data are complete
  if (!req?.body?.title || !req?.body?.ISBN || !req?.body?.author) {
    return res.status(400).json({ message: "Book data required" });
  }
  try {
    // add new book
    const result = await Book.create({
      title: req.body.title,
      ISBN: req.body.ISBN,
      author: req.body.author
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateBook = async (req, res) => {
  // update new book if bookId available
  if (!req?.params?.bookId) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  // find which book is to be updated
  const book = await Book.findOne({ where: { id: req.params.bookId } });
  // didn't find book
  if (!book) {
    return res.status(204).json({ message: `No book matches ID ${req.params.bookId}.` });
  }
  // update book data for proper bookId
  const result = await Book.update(
    {
      title: req.body.title,
      ISBN: req.body.ISBN,
      author: req.body.author,
    },
    { where: { id: req.params.bookId } }
  );
  res.json(result);
};

const deleteBook = async (req, res) => {
  // check params
  if (!req?.params?.bookId)
    return res.status(400).json({ message: "Book ID required." });
  const id = req.params.bookId;
  // find book with id
  const book = await Book.findOne({ where: { id: id } });
  // no book with searched id
  if (!book) {
    return res.status(204).json({ message: `No book matches ID ${id}.` });
  }
  // delete book
  const result = await Book.destroy({ where: { id: id } }); 
  res.json(result);
};


module.exports = {
  getBooks,
  createNewBook,
  updateBook,
  deleteBook,
};

const db = require("../models");
const Book = db.book;
const User = db.user;

const borrowBook = async (req, res) => {
  // check params
  if (!req?.params?.bookId) {
    return res.status(400).json({ message: "Book ID required" });
  }
  // find book
  const book = await Book.findOne({ where: { id: req.params.bookId } });
  // book didn't find
  if (!book) {
    return res
      .status(204)
      .json({ message: `Book ID ${req.params.bookId} not found` });
  }
  // if userId exist in book record it means it's borrowed by user with this id
  // so it's unavaiable
  if (book.userId) {
    return res.status(204).json({ message: "Book unavailable" });
  }
  // recognition of logged user 
  // user data are written to req.user when JWT if verified
  const user = await User.findOne({ where: { username: req.user } });
  // borrow book means write userID to book record
  const result = await Book.update(
    {
      userId: user.id,
    },
    { where: { id: book.id } }
  );
  // res.json(result);
  res.status(201).json({ success: `Book ${book.title} borrowed by ${user.username}!` });
};

const returnBook = async (req, res) => {
  // check params
  if (!req?.params?.bookId) {
    return res.status(400).json({ message: "Book ID required" });
  }
  // find book
  const book = await Book.findOne({ where: { id: req.params.bookId } });
  if (!book) {
    return res
      .status(204)
      .json({ message: `Book ID ${req.params.bookId} not found` });
  }
  // no userId in book record means that book is in Library
  // book is not borrowed
  if (!book.userId) {
    return res
      .status(204)
      .json({ message: "Book already in store. Cannot return" });
  }
  // recognition of logged user 
  // user data are written to req.user when JWT if verified
  const user = await User.findOne({ where: { username: req.user } });
  // only user which borrowed book can return it
  if (user.id !== book.userId) {
    return res
      .status(204)
      .json({ message: "Cannot return. You didn't borrow it" });
  }
  // book returned
  // clear userId in book record
  const result = await Book.update(
    {
      userId: null,
    },
    { where: { id: book.id } }
  );
  //res.json(result);
  res.status(201).json({ success: `Book ${book.title} returned!` });
};

module.exports = {
  borrowBook,
  returnBook,
};

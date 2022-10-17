const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const booksUsersController = require('../controllers/booksUsersController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

//available routes and by middleware user role control
router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), booksController.getBooks)
    .post(verifyRoles(ROLES_LIST.Admin), booksController.createNewBook)

router.route('/:bookId')
    .patch(verifyRoles(ROLES_LIST.Admin), booksController.updateBook)
    .delete(verifyRoles(ROLES_LIST.Admin), booksController.deleteBook);

router.route('/:bookId/borrow')
    .patch(verifyRoles(ROLES_LIST.User), booksUsersController.borrowBook);

router.route('/:bookId/return')
    .patch(verifyRoles(ROLES_LIST.User), booksUsersController.returnBook);

module.exports = router;
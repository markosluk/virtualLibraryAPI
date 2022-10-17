const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const ROLES_LIST = require('../config/roles_list');

router.post('/', registerController.handleNewUser(ROLES_LIST.User));

module.exports = router;
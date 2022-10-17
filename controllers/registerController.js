//const User = require('../models/User');
const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");

const handleNewUser = (role) => {
  return async (req, res) => {
    // check user data
    const { username, firstName, password } = req.body;
    if (!username || !firstName || !password)
      return res
        .status(400)
        .json({ message: "Username, first name and password are required." });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ where: { username: username } });
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
      //encrypt the password
      const hashedPwd = await bcrypt.hash(password, 10);

      //create and store the new user
      const result = await User.create({
        username: username,
        firstName: firstName,
        password: hashedPwd,
        role: role
      });

      res.status(201).json({ success: `New user ${username} created!` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};
module.exports = { handleNewUser };

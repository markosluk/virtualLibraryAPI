const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    // check if login data exists
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    //find user in db
    const foundUser = await User.findOne({ where: { username: username }});
    //user not found
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create new token
        const accessToken = jwt.sign(
            // payload
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "role": foundUser.role
                }
            },
            // secret key
            process.env.ACCESS_TOKEN_SECRET,
            // expiration time
            { expiresIn: '1h' }
        );
        // create refresh token
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user in db
        foundUser.refreshToken = refreshToken;
        const result = await User.update(
            {refreshToken: refreshToken}, {where:{id: foundUser.id}})

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, 
            //secure: true, 
            sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const role = foundUser.role
        // Send authorization role and access token to user
        res.json({ role, accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
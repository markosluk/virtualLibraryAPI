const db = require("../models");
const User = db.user;
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    // cookies check
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // find user with refreshToken
    const foundUser = await User.findOne({ where: { refreshToken: refreshToken }});
    if (!foundUser) return res.sendStatus(403); 
    // verify refreshToken and create new accessToken
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const role = foundUser.role;
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }
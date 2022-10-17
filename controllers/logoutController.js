const db = require("../models");
const User = db.user;

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    // refreshToken from cookie
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = await User.findOne({ where: { refreshToken: refreshToken } });
    // no user found
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await User.update(
        { refreshToken: foundUser.refreshToken },
        { where: {id: foundUser.id} }
        );
    //clear cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'
    //, secure: true 
    });
    res.sendStatus(204);
}

module.exports = { handleLogout }
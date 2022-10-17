const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // check authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // get token from header
    const token = authHeader.split(' ')[1];
    // verify token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            // save user data from token to request
            req.user = decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            next();
        }
    );
}

module.exports = verifyJWT
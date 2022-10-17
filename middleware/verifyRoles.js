const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // check role data
        if (!req?.role) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        // check if requeste role is in whitelist
        const result = rolesArray.includes(req.role);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles
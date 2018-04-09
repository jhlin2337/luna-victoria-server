const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

module.exports = (req, res, next) => {
    // IMPORTANT: INCLUDE MIDDLEWARE TO CHECK IF USER STILL EXISTS
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, keys.jwtKey);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
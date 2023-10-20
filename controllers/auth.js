const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                JWT_ACCESS_SECRET
            );
            req.user = decoded;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.isTokenValid = async (token) => {
    try {
        const decoded = await promisify(jwt.verify)(token, JWT_ACCESS_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
};

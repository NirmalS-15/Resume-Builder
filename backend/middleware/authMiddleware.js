const jwt = require("jsonwebtoken");
const SECRET = "resume_secret_key";

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

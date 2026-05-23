// const jwt = require('jsonwebtoken');
// const verfiyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ status: "Error", msg: "Unauthorized" });
//     }
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ status: "Error", msg: "Invalid token" });
//     }
// }

// module.exports = verfiyToken;
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    console.log(process.env.JWT_SECRET)

    if (!token) {
        return res.status(401).json({
            status: "Error",
            msg: "Unauthorized (no cookie)",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            status: "Error",
            msg: "Invalid token",
        });
    }
};

module.exports = verifyToken;
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.userData = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      error: "Not Authenticated",
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.userData = decoded;
    if (decoded.is_admin === 1) {
      next();
    }
  } catch (e) {
    res.status(401).json({
      error: "Not Authenticated",
    });
  }
};

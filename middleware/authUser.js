const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

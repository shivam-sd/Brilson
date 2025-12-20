const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.adminToken;
    // console.log(req);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // verify and decode token
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
// console.log(decoded)

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Not admin" });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


module.exports = verifyAdmin;
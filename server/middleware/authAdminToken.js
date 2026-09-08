const jwt = require("jsonwebtoken");

const authAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.adminToken;
    // console.log(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    // verify and decode token
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    // console.log(decoded)

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not admin" });
    }

      req.admin = decoded;
      next();

  } catch (err) {
    console.error("Admin token verification failed:", err);
    return res.status(401).json({ message: "Authentication error", success: false });
  }
};


module.exports = authAdminToken;
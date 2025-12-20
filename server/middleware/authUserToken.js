const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token ;
    // console.log(req)
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: "Login required" });
    }

    const decoded = jwt.verify(token, process.env.BRILSON_SECRET_KEY);
    console.log("decode",decoded)
    req.user = decoded.userId; 

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authUser;

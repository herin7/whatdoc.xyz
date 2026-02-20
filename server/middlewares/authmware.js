const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authmware(req, res, next) {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
         message: "Invalid token format"
      });
   }
   const token = authHeader.split(" ")[1];
   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      next();
   }
   catch (e) {
      return res.status(403).json({
         e,
         message: "Invalid Token"
      });
   }
}

module.exports = authmware;
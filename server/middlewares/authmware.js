const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authmware(req, res, next) {
   const authHeader = req.headers.authorization;

   // Support token via query param (needed for EventSource / SSE — no custom headers)
   const token = (authHeader && authHeader.startsWith("Bearer "))
      ? authHeader.split(" ")[1]
      : req.query?.token;

   if (!token) {
      return res.status(401).json({
         message: "Not authenticated. Please log in."
      });
   }
   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      next();
   }
   catch (e) {
      return res.status(401).json({
         message: "Session expired. Please log in again."
      });
   }
}

module.exports = authmware;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "s3cret";

function authmware(req,res,next) {
     const authHeader = req.headers.authorization;
     if(!authHeader){
        return res.status(403).json({
            message : "No token Provided"
        });
     }
     const token = authHeader.split(" ")[1];
     try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.userId = decoded.id;
        next();
     }
     catch(e){
        return res.status(403).json({
            e,
            message : "Invalid Token"
        });
     }
}

module.exports = authmware;
const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    const AuthHeader = req.get('Authorization');
    if(!AuthHeader){
        req.isAuth = false;
        return next();
    }
    const token = AuthHeader.split(" ")[1];
    if(!token || token == ""){
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
      decodedToken =  jwt.verify(token,process.env.Secret_key);
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}
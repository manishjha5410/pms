var jwt = require('jsonwebtoken');
require('dotenv').config();
var Key = process.env.SECRET_KEY;

module.exports=(req,res,next) => {
    var headerToken = req.headers.authorization;
    try
    {
        var token = headerToken;
        var decode = jwt.decode(token,Key);
        if(decode)
            req.userData = decode;
        else
            throw new Error();
        //token="Bearer "+token;
        next();
    }
    catch(error)
    {
        res.status(401).json({
            error:"Invalid Token"
        })
    }
};
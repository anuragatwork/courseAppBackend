const jwt=require('jsonwebtoken');
require('dotenv').config();
const secretKey=process.env.secretKey;

function userMiddleware(req, res, next) {
    const authHeader =req.headers.authorization;
    // format bearer space <actual token>
    const arr=authHeader.split(" ");
    const authData=arr[1];
    try{
        const data=jwt.verify(authData,'secretKey');
        req.header.username=data.username;
        next();
    }
    catch(err){
        res.status(401).send("you are not authorized");
    }
}

module.exports = userMiddleware;
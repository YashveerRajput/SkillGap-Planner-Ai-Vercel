const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

//it is a middleware , 3 parameters input hote hain
async function authUser(req,res,next) {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }

    //now checking , is tokenblacklisted or not
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    //method to verify token and extract data out of it
    //it takes tooken and secret
    //if token is not verified then error is throwed so , try and catch is used 
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        //data mil gya then
        req.user = decoded
        next()

    }catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}

module.exports = {authUser}
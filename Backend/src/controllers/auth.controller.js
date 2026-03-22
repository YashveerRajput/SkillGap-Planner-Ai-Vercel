const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production"
    return {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000
    }
}

//register controller
/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description Register a new user , expects username , email and password in the request body
 * @access Public
 */

//register controller
async function registerUserController(req,res){
    const {username ,email,password} = req.body
    
    if(!username || !password || !email) {
        return res.status(400).json({
            message:"Please provide username , email and password"
        })
    }
    
    const isUserAlreadyExists = await userModel.findOne({
        $or : [{username},{email}]
    })
    
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exits"
        })
    }
    
    const hash = await bcrypt.hash(password,10)
    
    const user = await userModel.create({
        username,
        email,
        password:hash
    })
    
    const token = jwt.sign({
        id:user._id,username:user.username
    },process.env.JWT_SECRET,{ expiresIn:"1d"})
    
    //now setting the token in cookie
    res.cookie("token",token,getCookieOptions())
    res.status(201).json({
        message: "User Successfully registered",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

//login controller
/**
 * @name loginuserController
 * @description login a user , expects email and passwords
 * @access public
 */

async function loginuserController(req,res) {
    const {email, password} = req.body
    //email check karega ki already exist h ya nahi
    const user = await userModel.findOne({email})

    //if email doesnot exists 
    if(!user){
        return res.status(400).json({
            message:"invalid email or Password"
        })
    }

    //now check if password is correct or not
    const isPasswordValid = await bcrypt.compare(password,user.password) 

    //if password is not valid then 
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or Password"
        })
    }

    //now will create a token
     const token = jwt.sign({
        id:user._id,username:user.username
    },process.env.JWT_SECRET,{ expiresIn:"1d"})

    //set the token in cookie
    res.cookie("token",token,getCookieOptions())
    res.status(200).json({
        message:"User loggedIn successfully",
         user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name logoutuserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req,res) {
    const token = req.cookies.token

    //if token aata hai then usko blacklist m add kr liya
    if(token){
        await tokenBlacklistModel.create({token})
    }

    //blacklist hogya hai , then also we will clear the cookie and send res

    const cookieOptions = getCookieOptions()
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure
    })
    res.status(200).json({
        message:"user logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */

async function getMeController(req,res) {
    // req.user.id -> this is comming from middleware 
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginuserController,
    logoutUserController,
    getMeController
}
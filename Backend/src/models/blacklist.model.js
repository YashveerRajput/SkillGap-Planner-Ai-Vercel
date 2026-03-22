const mongoose = require('mongoose')

//we will create a schema
const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required: [true,"token is required"]
    }
    
},{
    //it will store the logout time automatically
    timestamps:true
})

//now making model
const tokenBlacklistModel = mongoose.model("blacklistTokens",blacklistTokenSchema)


//exporting the model
module.exports = tokenBlacklistModel
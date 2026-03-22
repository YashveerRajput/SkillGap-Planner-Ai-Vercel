const mongoose = require("mongoose")

async function connectToDB() {
    try{
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection
        }

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database");
        return mongoose.connection
    }

    catch (err){
        console.log(err);
        throw err
    }


}
module.exports = connectToDB;
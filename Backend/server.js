require("dotenv").config();
const app = require("./src/app")

//connected server to db
const connectToDB = require("./src/config/database")

//call the function
connectToDB();

const PORT = process.env.PORT || 3000

app.listen(PORT,function(){
    console.log(`Server is started on port ${PORT}`)
});
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config()

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MongoDb_url);
        console.log("Connected to Mongodb")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;

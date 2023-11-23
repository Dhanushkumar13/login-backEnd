const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        joinedOn: {
            type: Date,
            default: Date.now(),
        },
        forgetPassword:{
            type: Date,
            otp: String,
        },
        token: {
            type: String,
        },
    },{
        collection: "user" 
    }
);

module.exports = mongoose.model("user",userSchema);
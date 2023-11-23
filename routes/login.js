const express = require("express");
const { authenticateUser } = require("../controllers/login");
const loginController = express.Router();
const client = require("../redis");

client
.connect()
.then((res)=>{
    console.log("connected to redis",res);
})
.catch((err)=>{
    console.log("Error occured!",err);
});




loginController.post("/", async (req,res,next)=>{
    const {email,password} = await req.body
    let loginCredentials = await authenticateUser(email, password)
    if(loginCredentials === "Invalid Username or password"){
        res.status(200).send("Invalid Username or password")
    } else if(loginCredentials === "Server Busy"){
        res.status(200).send("Server Busy")
    }else{
        res.status(200).json({token: loginCredentials.token})
    }
})

module.exports = loginController;
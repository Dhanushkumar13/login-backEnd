const express = require("express");
const { authorizeUser } = require("../controllers/login");
const homeController = express.Router();

homeController.get("/",async (req,res,next)=>{
    try {
        const auth_token = await req.headers.authorization;
        const loginCredentials = authorizeUser(auth_token);
        if(loginCredentials === false){
            res.status(200).send("Invalid token")
        }else{
            res.json(loginCredentials);
        }
    } catch (error) {
        console.log("error",error)
        res.status(500).send("Server Busy")
    }
})

module.exports = homeController;
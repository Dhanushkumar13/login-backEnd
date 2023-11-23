const user = require("../models/user");
const {sendMail} = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
const { response } = require("express");
dotenv.config()


async function insertVerifyUser(name,email,password){
    try {
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       const token = generateToken(email);


        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token,
        })
        await newUser.save()

       const activationLink = `http://localhost:3000/signin/${token}`;
       const content = `<h4>Hello User</h4>
       <h5>Welcome to the app</h5>
       <p>Thank you for signing up, Click the below link to activate</p>
       <a href=${activationLink}>Click here </a>
       <p>Team</p>`
        
       sendMail(email,"Verify the User!",content);
    } catch (error) {
        console.log(error);
    }
}


function generateToken(email){
    const token = jwt.sign(email,process.env.signup_secret_token);
    return token;
}


async function insertSignupToken(token){
    try {
        const userVerify = await verifyUser.findOne({token: token});
        if(userVerify){
            const newUser = new user({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
            });
            await newUser.save();
            await userVerify.deleteOne({token: token});
            const content = `<h4Registration successful</h4>
            <h5>Welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>Regards</p>  
            <p>Team</p>`;
            sendMail(newUser.email,"Register Successful!",content);
            return `<h4Registration successful</h4>
            <h5>Welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>Regards</p>  
            <p>Team</p>`;
        }
        return `<h4>Registration failed</h4>
        <p>Link Expired</p>
        <p>Regards</p>
        <p>Team</p>`;
    } catch (error) {
        console.log("error occured while matching token:", error);
        return `<html>
        <body>        
        <h4>Registration failed</h4>
        <p>Unexpected Error Occured ._.</p>
        <p>Regards</p>
        <p>Team/p>
        </body>
        </html>`
        
    }
}


module.exports = {insertVerifyUser, insertSignupToken}
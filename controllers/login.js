const login = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../redis")


async function checkUser(email){
    try {
        const User = await login.findOne({email: email});
        if(User){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        return "Server Busy!"
    }
};

async function authenticateUser(email, password){
    try {
        const userCheck = await login.findOne({email: email})
        const validPassword = await bcrypt.compare(password,userCheck.password);
        if(validPassword == true){
            const token = jwt.sign({email}, process.env.login_secret_token)
            const response = {
                    id: userCheck._id,  
                    name: userCheck.name,
                    email: userCheck.email,
                    token: token,
                    status: true,   
            }
        await client.set(`key-${email}`,JSON.stringify(response))    

        
        await login.findOneAndUpdate({email: userCheck.email},{$set:{token: token}}, {new: true})
        return response
        }
        return "Invalid Username or password"
    } catch (error) {
        console.log(error)
        return "Server Busy"
    }
}


async function authorizeUser(token){
    try {
        const decodedToken = jwt.verify(token,process.env.login_secret_token)
        if(decodedToken){
            const email = decodedToken.email;
            const auth = await client.get(`key-${email}`)
            if(auth){
                const data = JSON.parse(auth)
                return data;
            }else{
                const data = await login.findOne({email: email})

                return data;
            }
        }

        return false;
    } catch (error) {
        console.log(error)
    }
}

module.exports ={checkUser, authenticateUser, authorizeUser};

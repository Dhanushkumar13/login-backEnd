const express = require("express");
const { checkUser } = require("../controllers/login");
const { insertVerifyUser, insertSignupToken} = require("../controllers/signIn");
const signInController = express.Router();


signInController.get("/:token",async (req,res,next)=>{
    try {
        const response =  await insertSignupToken(req.params.token)
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(`
        <html>
        <body>        
        <h4>Registration failed</h4>
        <p>Unexpected Error Occured ._.</p>
        <p>Regards</p>
        <p>Team/p>
        </body> 
        </html>`)
    }
})


signInController.post("/verify",async(request,response,next)=>{
try {
    const {name,email,password} = await request.body
    const registerCrendentials = await checkUser(email);
    if(registerCrendentials === false){
        await insertVerifyUser(name,email,password);
        response.status(200).send(true);
    }else if(registerCrendentials === true){
        response.status(200).send(false);
    }else if(registerCrendentials === "Server Busy!"){
        response.status(500).send("Server Busy!");
    }
} catch (error) {
    console.log(error);
}
});


module.exports = signInController;
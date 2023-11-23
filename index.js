const express = require('express');
const connectDB = require('./db');

const cors = require("cors");

const SERVER = express();
connectDB();

const signInController = require("./routes/signin");
const loginController = require('./routes/login');
const homeController = require("./routes/home");
SERVER.use(express.json());
SERVER.use(cors({origin: "*"}));
SERVER.use("/signin",signInController);
SERVER.use("/login",loginController);
SERVER.use("/home",homeController);

//initalizing PORT
const PORT = 3000;

//HTTP REQUEST
SERVER.get("/",(request,response,next)=>{
    response.send("HELLO WORLD!");
})

//SERVER LISTEN
SERVER.listen(PORT, ()=>{
    console.log("Server Started!");
})
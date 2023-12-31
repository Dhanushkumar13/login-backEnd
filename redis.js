const redis = require("redis");
const dotenv =require("dotenv");
dotenv.config();

const redisClient = () =>{
    return redis.createClient()
}

const client= redisClient();

client.on("error",(err)=>{
    console.log("error",err);
})

client.on("connect",()=>{
    console.log("connected to redis");
})

client.on("end",()=>{
    console.log("connection ended");
})

client.on("SIGQUIT",()=>{
    client.quit()
})

module.exports = client;
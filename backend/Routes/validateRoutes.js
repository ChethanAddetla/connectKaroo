const express = require('express')
const validateRoutes = express.Router();
const postModel = require("../model/postModel");
const jwt  = require("jsonwebtoken")
require("dotenv").config();


validateRoutes.get('/validate',(req,res)=>{
let authHeader = req.headers.authorization;
let token = authHeader && authHeader.split(" ")[1]
try{

let result = jwt.verify(token,process.env.SECURITY_KEY)
res.json({msg:"Session Valid",status:true,data:result})

}
catch(error){
    res.status(400).json({msg:"Session Expired",status:false})
}


})


validateRoutes.get('/postValidate',async(req,res)=>{
    let authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(" ")[1];
    try{

    let result = jwt.verify(token,process.env.SECURITY_KEY);
    // console.log(result);
    const postsData = await postModel.find();
    // console.log(postsData)
    res.send({data :postsData})
    }
    catch(error){
        res.status(400).send({msg:"Session Expired !, Login again"})
    }
})

module.exports=validateRoutes
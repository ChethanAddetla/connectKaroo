const express = require("express");
const postModel = require("../model/postModel")
const postRoutes = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config();


postRoutes.get('/postdata/:id',async(req,res)=>{
    let postid  = req.params.id;
    let postdata = await postModel.findById(postid);

    if(postdata){
     
        res.json({data:postdata,msg:"Post Find"})
    }
    else{
        res.status(400).send({msg:"Post Not Found"})
    }

})

postRoutes.put('/editpost/:id',async(req,res)=>{
    let postid = req.params.id;
    let updatedData = req.body;
    let authHeader = req.headers.authorization;

    let token  = authHeader && authHeader.split(" ")[1];
    console.log(updatedData.editedpost)

    try{
        let result  = jwt.verify(token,process.env.SECURITY_KEY);
        
        let editedResult = await postModel.findByIdAndUpdate(postid,updatedData.editedpost,{new:true});//updating the database
        

        if(editedResult){
            console.log(editedResult)
            res.send({msg:"Post Updated Successsfuly !",data:editedResult})
        }
        else{
            res.send({msg:"Error in Updating the post"})
        }


    }
    catch(error){
        res.status(400).send({msg:error})
    }



})


postRoutes.get('/authorPost/:authorName',async (req,res)=>{
    let authorName = req.params.authorName;

    try{
    let postData = await postModel.find({author:authorName})

    
    if(postData.length >0){
       res.send({data:postData,status:true}) 
    }
    else{
        res.send({msg:"No Such Author Found!",status:false});
    }
}
catch(error){
     res.send({msg:"Error in finding the Author posts!",status:false})
}

})

module.exports = postRoutes;

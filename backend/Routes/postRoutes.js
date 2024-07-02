const express = require("express");
const postModel = require("../model/postModel")
const postRoutes = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config();


postRoutes.get('/postdata/:id',async(req,res)=>{
    let postid  = req.params.id;
    let postdata = await postModel.findById(postid);

    if(postdata){
     
        res.json({data:postdata,msg:"Post Found"})
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
    // console.log(updatedData.editedpost)

    try{
        let result  = jwt.verify(token,process.env.SECURITY_KEY);
        
        let editedResult = await postModel.findByIdAndUpdate(postid,updatedData.editedpost,{new:true});//updating the database
        

        if(editedResult){
            // console.log(editedResult)
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
       res.send({data:postData,status:true,msg:"Author Found !"}) 
    }
    else{
        res.send({msg:"No Such Author Found!",status:false});
    }
}
catch(error){
     res.send({msg:"Error in finding the Author posts!",status:false})
}

})


postRoutes.delete('/deletepost/:postid',async(req,res)=>{
    let postid = req.params.postid;

    try{
    let data = await postModel.findById(postid)
    let result = await postModel.findByIdAndDelete(postid)
    res.send({status:true ,title : data.title});
   }
   catch(error){
    res.send({status:false,msg:"Error in deleting the post !"})
    }
})


postRoutes.put('/likepost/:postid',async(req,res)=>{
    let id = req.params.postid;
    let userName = req.body.username;
    // console.log(req.body)
    try{
    let result  = await postModel.findById(id);

    if(result.likes.includes(userName)){
        // console.log(result.likes.length)
        // console.log(result)
        res.send({msg:"Already liked this post !",status:false });
    }
    else{
        result.likes.push(userName)
        let result2 = await postModel.findByIdAndUpdate(id,result,{new:true})

        res.send({length : result2.likes.length,status:true})
    }

      }
      catch{
        res.send({msg:"Error in finding Updating the Likes",status:false})
      }

    
})

module.exports = postRoutes;

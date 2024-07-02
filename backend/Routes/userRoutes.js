const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel")
const postModel = require("../model/postModel")
const userroutes = express.Router();
const jwt  = require("jsonwebtoken")
require("dotenv").config();

userroutes.post('/register',async (req,res)=>{
    let rawpass = req.body.password;

    let encpass = await bcrypt.hash(rawpass,10);
    req.body.encpass = encpass; 

    let user = new userModel({...req.body})
    await user.save();

    res.send({mas:"Registration Successful !"})
})

userroutes.post('/login',async(req,res)=>{
    let data = req.body;
   
    let userdata = await userModel.find();
   
    try{

    let x = userdata.filter(item =>item.id==data.id);
    if(x.length > 0){
        
        // console.log(data)
        let details = x[0]
        let accesstoken = generatetoken(details.toJSON());
        let refreshtoken = jwt.sign(details.toJSON(),process.env.REFRESH_KEY,{expiresIn:'1d'});
       let encrypted = x[0].encpass;
       let enteredpass =data.password;

       let equal = await bcrypt.compare(enteredpass,encrypted)

       if(equal){
        res.send({msg:"Login Successful !",accesstoken:accesstoken,refreshtoken:refreshtoken})
       }
       else{
        res.status(401).send({ msg: "Wrong Password!" });
       }

    }else{
        console.log("user not found !")
        res.status(401).send({ msg: "User Not Found!" });
    
    }
}
catch(error){
    res.status(400).send({msg:error})
}
})



userroutes.post('/verify',(req,res)=>{
    let event = req.body;
    let authHeader = req.headers.authorization;
    let token  = authHeader && authHeader.split(" ")[1];
    try{
    let result = jwt.verify(token,process.env.SECURITY_KEY);
    // res.send({msg:`You(id:${result.id}) are allowed to use ${event.target.id} plan `});
    res.json({msg:"user verified" ,payload:result})
    }
    catch(error){
        res.status(400).send({msg:error})
    }

})




userroutes.post('/refresh',(req,res)=>{
    let authtoken = req.headers.authorization;

    let token  = authtoken && authtoken.split(" ")[1];
    // console.log( {reft :token})
    

 try{   
        let result = jwt.verify(token,process.env.REFRESH_KEY)
        let newpayload = {
            name :result.name,
            id : result.id,
            password:result.password
        }
        let accesstoken = generatetoken(newpayload)
    
        res.json({accesstoken:accesstoken});
    }
    catch(error){
        res.status(500).json({msg:error})
    }


    
    // catch(event){
    //     res.status(401).send({msg:"Token Expired"})
    // }
    

})



userroutes.post('/addpost',async (req,res)=>{
    try{
    let authHeader = req.headers.authorization;
    let token  = authHeader && authHeader.split(" ")[1];

    
        let result = jwt.verify(token,process.env.SECURITY_KEY);
        req.body.username = result.name;
        try{
        let post = new postModel({...req.body})
        await post.save();
        // console.log(post)
        res.json({data:req.body})
        }
        catch{
            res.status(400).send({msg:"All the entries are needed !"})
        }
       
    }
    catch(error){
        res.status(400).send({msg:"Token Experied !"})
    }
    

})
const generatetoken=(data)=>{
    return jwt.sign(data,process.env.SECURITY_KEY,{expiresIn:'10m'})
}


userroutes.put('/followers/:postusername',async(req,res)=>{
    let logedInUser =req.body.username;
    let postusername  = req.params.postusername;

    let result  = await userModel.find({name :postusername})
    // console.log(result);
    // console.log(logedInUser)
    if(result.length >0){
        let userid = result[0]._id;
        // console.log(userid)
        if(result[0].followers.includes(logedInUser)){
            // console.log(result[0].followers)
            res.send({msg:`You are already following the ${postusername}`})
        }
        else{
            result[0].followers.push(logedInUser);
            let result2 = await userModel.findByIdAndUpdate(userid,result[0],{new:true})
            // console.log(result2.followers)
            res.send({length : result2.followers.length,status:true,msg:`Started following ${postusername}`})
        }
       
    }
    else{
        res.send({msg : "Couldn't find the User who created post"})
    }
    
})


module.exports = userroutes;

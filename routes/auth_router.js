const {Router}=require("express");
const bcrypt=require("bcrypt");
const {auth_model}= require("../model/auth_model");
const jwt=require("jsonwebtoken");
const user=Router();

user.post("/signup",async (req,res)=>{
    const {email,password}=req.body;
    const userPresent=await auth_model.findOne({email})
    if(userPresent){
        res.send({"msg":"user already present"})
    }
    else{
        try{
            bcrypt.hash(password,4,async function(err,hash){
                const user=new auth_model({email,password:hash})
                await user.save()
                res.send({"msg":"Signup sucessful"})
            });

        }
        catch(err){
            console.log(err);
            res.send({"msg":"Something went wrong"})
        }
    }
})
user.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await auth_model.find({email})
        if(user.length>0){
            const hashed_password=user[0].password;
            bcrypt.compare(password,hashed_password,function(err,result){
                if(result){
                    const token=jwt.sign({"userID":user[0]._id},"hush");
                    res.send({"msg":"Login Sucess..","token":token})
                }
                else{
                    res.send({"msg":"Login Failed"})
                }
            })
        }
        else{
            res.send({"msg":"Login Failed"})
        }
    }
    catch(err){
        console.log(err);
        res.send({"msg":"Something went wrong"})
    }
})

module.exports={user}
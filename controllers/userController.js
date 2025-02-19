const path=require('path');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


exports.postSignup=async(req,res)=>{
    try{
    const {name, email, password, ispremiumuser}=req.body;
    console.log(name);
    //check the user exist or not
    const userexist=await User.findOne({ where: {email} });
    if(userexist){
        return res.status(400).json({error: "Email already exists"});
    }  
    else{
        const saltrounds=10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            console.log(err);
            await User.create({name, email, password: hash, ispremiumuser});
            res.status(201).json({ message: "User created successfully" });
        }) 
    }
    } catch(err){  
            res.status(500).json({error: "user not created"});
        }
}

function webtoken(id){
    return jwt.sign({ userId: id}, process.env.TOKEN_SECRET);
}
exports.postLogin=async(req,res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findAll({ where: {email}});
        if(user){
            bcrypt.compare(password, user[0].password, (err,result)=>{
                if(err){
                    throw new Error("something went wrong");
                }
                if(result==true) {
                    return res.json({ redirect: '/Expense', token: webtoken(user[0].id)});
                }
                else{
                    res.status(401).json({error: "User not authorized"});
                }
            });
        }
        else{ res.status(404).json({error: "User not found"}); }
    }
    catch(err){
        res.status(404).json({error: err.message});
    }
}
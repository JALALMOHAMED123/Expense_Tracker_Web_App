const path=require('path');
const User=require('../models/signup');
const { where } = require('sequelize');

exports.getSignup=(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/signup.html'));
}

exports.postSignup=async(req,res)=>{
    try{
    const {name, email, password}=req.body;
    //check the user exist or not
    const userexist=await User.findOne({ where: {email} });
    if(userexist){
        return res.status(400).json({error: "Email already exists"});
    }  
    else{
    User.create({name, email, password});
    // res.redirect('/signup');
    res.status(201).json({ message: "User created successfully" });
    }
    } catch(err){  
            res.status(500).json({error: "user not created"});
        }
    }
exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'));
}

exports.postLogin=async(req,res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findOne({ where: {email}});
        if(user){
            const user_pwd=await User.findOne({ where: {email, password}});
            if(user_pwd){ return res.status(200).json({message: "Login successfully"}); }
            else{
            res.status(403).json({error: "Password not matched"});
            }
        }
        else{ res.status(404).json({error: "Email not found"}); }
    }
    catch(err){
        res.status(404).json({error: "Login not working"});
    }
}
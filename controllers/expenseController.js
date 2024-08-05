const path=require('path');
const User=require('../models/signup');
const bcrypt=require('bcrypt');

exports.getSignup=(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/signup.html'));
}

exports.postSignup=async(req,res)=>{
    try{
    const {name, email, password}=req.body;
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
            await User.create({name, email, password: hash});
            res.status(201).json({ message: "User created successfully" });
        }) 
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
        const user=await User.findAll({ where: {email}});
        if(user){
            bcrypt.compare(password, user[0].password, (err,result)=>{
                if(err){
                    throw new Error("something went wrong");
                }
                if(result==true) res.status(200).json({message: "User login successful"});
                else{
                    res.status(401).json({error: "User not authorized"});
                }
            });
        }
        else{ res.status(404).json({error: "User not found"}); }
    }
    catch(err){
        res.status(404).json({error: err});
    }
}
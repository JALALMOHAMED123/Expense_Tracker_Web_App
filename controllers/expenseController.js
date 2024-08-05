const path=require('path');
const User=require('../models/signup');

exports.getSignup=(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/signup.html'));
}

exports.postSignup=(req,res)=>{
    const {name, email, password}=req.body;
    //check the user exist or not
    const _email=User.findByPk(email);
    if(!_email){
    User.create({name, email, password})
    .then((result)=>{
        res.redirect('/signup');
    })
    .catch((err)=>{
        res.status(500).json({error: "user not created"});
    })}
}
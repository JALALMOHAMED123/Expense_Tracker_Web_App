const path=require('path');
const User=require('../models/signup');
const Expense=require('../models/expense');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sequelize = require('../util/db');
const { Transaction } = require('sequelize');

exports.getSignup=(req,res)=>{
    res.sendFile(path.resolve('views/signup.html'));
}

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

exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'));
}

function webtoken(id){
    return jwt.sign({ userId: id}, '374bfu2yryr8234rt02bfe032r230');
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
  
exports.getExpense=(req, res)=>{
    res.sendFile(path.resolve('views/Expense.html'));
}

exports.fetchExpense=async(req, res)=>{
    try {
        // console.log(req.user.id);
        const expenses = await Expense.findAll( { where: {userId: req.user.id}} );
        res.json({expenses, premium:req.user.ispremiumuser}); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}
exports.postExpense=async (req, res)=>{
    try{
        const {amount, description, category}=req.body;
        // const expense= await Expense.create({amount, description, category, UserId: req.user.id})
        req.user.createExpense({amount, description, category}, {transaction: t})
        .then(expense=>{
            totalExpense=Number(user.totalExpense) + Number(amount);
            User.update({totalExpense},{where: { id:req.user.id},transaction: t})
            .then(async()=>{
                t.commit();
                res.status(200).json(expense);
            })
            .catch(async()=>{
                await t.rollback();
                return res.status(500).json({error: err.message});
            })
        })
        .catch(async()=>{
            await t.rollback();
            return res.status(500).json({error: err.message});
        })
        
    }
    catch(error){
        res.status(404).json({error: error.message});
    }
}

exports.deleteExpense=async(req,res)=>{
    try{
    const id=req.params.id;
    const expense = await Expense.findOne({ where: { id, UserId: req.user.id } });
    const user = await User.findByPk(expense.UserId);
        
        if (user) {
            user.totalExpense = Number(user.totalExpense) - Number(expense.amount);
            await user.save();
        }
    console.log(user.totalExpense);
    Expense.destroy({where: {id, UserId: req.user.id}})
    .then(()=> {
        return res.status(200).json({ message: "Expense destroyed"})
    })
    .catch(err=>res.status(500).json({error: err}));
}
catch(err){
    res.status(500).json({ error: err.message });
}
}

exports.getleaderboard=async (req,res)=>{
    try{
        const leaderboardofusers=await User.findAll()

        return res.status(200).json({leaderboardofusers});
    }
    catch(err){
        res.status(200).json({Error: err.message});
    }
}
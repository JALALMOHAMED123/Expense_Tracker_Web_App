const path=require('path');
const User=require('../models/user');
const Expense=require('../models/expense');

const sequelize = require('../util/db');
const S3services=require('../services/S3services');
const History=require('../models/filedownload');

exports.fetchExpense=async(req, res)=>{
    try {
        const expenses = await Expense.findAll( { where: {userId: req.user.id}} );
        res.json({expenses, premium:req.user.ispremiumuser}); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const ITEM_PER_PAGE = 2;

exports.getpagination = async(req, res) => {
    const page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || ITEM_PER_PAGE;
    let totalItems;

    await Expense.count({ where: { userId: req.user.id } })
        .then(count => {
            totalItems = count;
            return Expense.findAll({
                where: { userId: req.user.id },
                offset: (page - 1) * pageSize,
                limit: pageSize
            });
        })
        .then(expenses => {
            res.json({
                expenses: expenses,
                currentPage: page,
                hasNextPage: pageSize  * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize ),
                premium:req.user.ispremiumuser
            });
        })
        .catch(err => {
            console.log(err.message);
        });
}

exports.download = async (req, res) => {
    try {
        const expenses=await Expense.findAll();
        const stringifiedExpenses=JSON.stringify(expenses);
        const userId=req.user.id;

        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileurl=await S3services.uploadToS3(stringifiedExpenses, filename);
        console.log(fileurl);
        await History.create({path: fileurl, UserId: req.user.id});
        res.status(200).json({fileurl});

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.historydownload=async(req, res)=>{
    try{
        const history=await History.findAll({where: {userId: req.user.id}});
        res.status(200).json({history});
    }
    catch(err){
        res.status(401).json({ err:err.message});
    }
}
exports.postExpense=async (req, res)=>{
    try{
        
        const {amount, description, category}=req.body;
        const t=await sequelize.transaction();
        // const expense= await Expense.create({amount, description, category, UserId: req.user.id})
        req.user.createExpense({amount, description, category}, {transaction: t})
        .then(expense=>{
            totalExpense=Number(req.user.totalExpense) + Number(amount);
            User.update({totalExpense},{where: { id:req.user.id},transaction: t})
            .then(async()=>{
                await t.commit();
                res.status(200).json({expense, message: "Expense created"});
            })
            .catch(async(err)=>{
                await t.rollback();
                return res.status(500).json({error: err.message});
            })
        })
        .catch(async(err)=>{
            await t.rollback();
            return res.status(500).json({reason: "create Expense", error: err.message});
        })
    }
    catch(error){
        res.status(404).json({error: error.message});
    }
}

exports.deleteExpense=async(req,res)=>{
    try{
    const id=req.params.id;
    const t=await sequelize.transaction();
    const expense= await Expense.findOne({ where: { id, UserId: req.user.id }, transaction: t});
    if (!expense) {
        await t.rollback();
        return res.status(404).json({ error: "Expense not found" });
    }
    
    const user=await User.findByPk(expense.UserId, { transaction: t});
    console.log(user.totalExpense);
    if (!user) {
        await t.rollback();
        return res.status(404).json({ error: "User not found" });
    }
    totalExpense = Number(user.totalExpense) - Number(expense.amount);
    
    await User.update({totalExpense},{where: { id:req.user.id},transaction: t});

    await Expense.destroy({where: {id, UserId: req.user.id}, transaction: t});

    await t.commit();
    return res.status(200).json({ message: "Expense destroyed"});
}
    catch(err){
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
}

exports.getleaderboard=async (req,res)=>{
    try{
        const leaderboardofusers=await User.findAll({
            order: [['totalExpense', 'DESC']]
        })

        return res.status(200).json({leaderboardofusers});
    }
    catch(err){
        res.status(401).json({Error: err.message});
    }
}

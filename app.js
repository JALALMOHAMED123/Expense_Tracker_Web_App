const express=require('express');
const bodyparser=require('body-parser');
const path = require('path');
const ExpenseRoutes=require('./routes/Expense_routes');
const sequelize=require('./util/db');

const User=require('./models/signup');
const Expense=require('./models/expense');
const Order = require('./models/orders');
const ForgetPassword = require('./models/ForgotPasswordRequests');
require('dotenv').config();

const app=express();

app.use(bodyparser.urlencoded({ extended: false}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(ExpenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        console.log('Database and tables synced');
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });
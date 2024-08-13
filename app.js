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
const helmet = require('helmet');
const express = require('express');
app.use(helmet());

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

const app=express();

app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(500).send('Something went wrong!');
  });
  
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
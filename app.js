const express=require('express');
const bodyparser=require('body-parser');
const path = require('path');
const ExpenseRoutes=require('./routes/Expense_routes');
const sequelize=require('./util/db');
const session = require('express-session');

const app=express();

app.use(bodyparser.urlencoded({ extended: false}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '123-324-354', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));

app.use(ExpenseRoutes);
 
sequelize
    .sync()
    .then(result => {
        console.log('Database and tables synced');
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });
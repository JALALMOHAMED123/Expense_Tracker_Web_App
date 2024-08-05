const express=require('express');
const bodyparser=require('body-parser');
const path = require('path');
const ExpenseRoutes=require('./routes/Expense_routes');
const sequelize=require('./util/signup');

const app=express();

app.use(bodyparser.urlencoded({ extended: false}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'views')));

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
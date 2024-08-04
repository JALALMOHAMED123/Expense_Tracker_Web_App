const express=require('express');
const bodyparser=require('body-parser');
const path = require('path');
const ExpenseRoutes=require('./routes/Expense_routes');

const app=express();

app.use(bodyparser.urlencoded({ extended: true}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'views')));

app.use(ExpenseRoutes);

app.listen(4000);
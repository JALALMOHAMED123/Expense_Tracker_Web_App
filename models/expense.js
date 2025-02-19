const Datatype=require('sequelize');
const sequelize=require('../util/db');

const Expense=sequelize.define('Expense', {
    id: {
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: Datatype.INTEGER,
        allowNull: false
    },
    description: {
        type: Datatype.STRING,
        allowNull: false
    },
    category: {
        type: Datatype.STRING,
        allowNull: false
    }
})

module.exports=Expense;
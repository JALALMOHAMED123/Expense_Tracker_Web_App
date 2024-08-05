const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense', 'root', 'Jalal@2024', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports=sequelize;
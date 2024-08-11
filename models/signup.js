const Datatype=require('sequelize');
const sequelize=require('../util/db');

const User=sequelize.define('User', {
    id: {
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Datatype.STRING,
        allowNull: false
    },
    email: {
        type: Datatype.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Datatype.STRING,
        allowNull: false
    },
    ispremiumuser: {
        type: Datatype.BOOLEAN
    }
})

module.exports=User;
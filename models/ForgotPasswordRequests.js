const Datatype=require('sequelize');
const sequelize=require('../util/db');

const ForgetPassword=sequelize.define('ForgetPassword', {
    id: {
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    mail: {
        type: Datatype.STRING,
        allowNull: false,
        unique: true
    },
    User_id: {
        type: Datatype.INTEGER
    },
    isactive: {
        type: Datatype.BOOLEAN
    }
})

module.exports=ForgetPassword;
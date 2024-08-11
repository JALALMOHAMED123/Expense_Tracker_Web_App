const Datatype=require('sequelize');
const sequelize=require('../util/db');

const Order=sequelize.define('Order', {
    id: {
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    paymentid: Datatype.STRING,
    orderid: Datatype.STRING,
    status: Datatype.STRING
})

module.exports=Order;
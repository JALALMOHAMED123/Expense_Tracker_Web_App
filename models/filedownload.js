const Datatype=require('sequelize');
const sequelize=require('../util/db');

const Filedownload=sequelize.define('Filedownload', {
    id: {
        type: Datatype.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    path: {
        type: Datatype.TEXT,
        allowNull: false
    }
})

module.exports=Filedownload;
const Datatype=require('sequelize');
const sequelize=require('../util/db');

const Forgotpassword=sequelize.define('Forgotpassword', {
    id: {
        type: Datatype.UUID,
        primaryKey: true,
        allowNull: false
    },
    isactive: {
        type: Datatype.BOOLEAN
    },
    expiresby: {
        type: Datatype.DATE
    }
})

module.exports=Forgotpassword;
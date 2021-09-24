const sequelize = require('../utils/database').sequelize;
const { Sequelize, DataType, Model, DataTypes } = require('sequelize');

const OrderItem = sequelize.define('orderItem',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:DataTypes.INTEGER
    }
},
{timestamps: false}
);

module.exports = OrderItem;
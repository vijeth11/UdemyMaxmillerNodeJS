const sequelize = require('../utils/database').sequelize;
const { Sequelize, DataType, Model, DataTypes } = require('sequelize');
const orderItem = require('./order-item');
const Product = sequelize.models.Product;
const User = require('./user');

class Order extends Model{

    static async addProducts(products,userId,cart, res){        
        Order.create({UserId:userId})
        .then(order => {
            products.forEach(product => {                
                order.addProduct(product,{through:{quantity:product.ProductCart.quantity}})
                .then(result => console.log("added product "+product.title))
                .catch(err =>console.log(err));
            });
            return cart.setProducts(null);
        })
        .then(result => {
            res();
        })
        .catch(err => console.log(err))
    }

    static async fetchAll(userId){
        return Order.findAll({
            include:{
                model:Product
            },
            where:{
                UserId:userId
            }
        });
    }
}

Order.init({
    id : {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
{
    sequelize,
    modelName: 'Order',
    timestamps: false
})

Order.belongsTo(User,{constraints:true, onDelete:"CASCADE"});
User.hasMany(Order);
Order.belongsToMany(Product, {through: orderItem});
Product.belongsToMany(Order, {through: orderItem});
module.exports = Order;
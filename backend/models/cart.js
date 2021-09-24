const fs = require('fs');
const path = require('path');
const sequelize = require('../utils/database').sequelize;
const { Sequelize, DataType, Model, DataTypes } = require('sequelize');
const product = sequelize.models.Product;
const user = require('./user');

const cartFile = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

getDataFromCartFile = res => {
    fs.readFile(cartFile, (err, fileContent)=>{
        let cart = { products: [], totalPrice:0 };
        if(!err){
            let data = JSON.parse(fileContent);            
            res(data ? data : cart);                
        }else{
            res(cart);
        }
    });
}
class Cart extends Model{
    
    static async addProduct(id, userId, productPrice, redirect){
        /*getDataFromCartFile((cart) => {                      
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            let updatedProduct;
            if(existingProductIndex > -1){
                updatedProduct = { ...cart.products[existingProductIndex] };
                updatedProduct.qty += 1
                cart.products[existingProductIndex] = {...updatedProduct};
            }else{
                updatedProduct = { id:id, qty : 1};
                cart.products = [...cart.products,updatedProduct]
            }
            cart.totalPrice += Number(productPrice);
            fs.writeFile(cartFile,JSON.stringify(cart), err => {
                console.log(err);
            })            
        });*/
        try{
            let cart = await Cart.findOne({ 
                include:{
                    model:product
                },               
                where: {
                    UserId: userId
                }            
            });            
            if(!cart){
                let newcart = await Cart.create({
                    totalPrice:productPrice,
                    UserId:userId
                });
                //newcart.addProduct(await product.findOne({where:{id:id}}),{through:"ProductCart"});      --this also works
                await newcart.addProduct(await product.findOne({where:{id:id}}),{through:{quantity:1}});        
            }
            else{
                let productCart = await ProductCart.findOne({where:{cartId:cart.dataValues.id, productId:id}});
                if(!productCart){
                    await cart.addProduct(await product.findOne({where:{id:id}}),{through:{quantity:1}});
                }else{
                    await cart.addProduct(await product.findOne({where:{id:id}}),{through:{quantity:Number(cart.Products[0].ProductCart.dataValues.quantity)+1}});
                }
                await cart.update({totalPrice: Number(cart.dataValues.totalPrice) + Number(productPrice)});                              
            }
            redirect();
        }catch(ex){
            console.log(ex);
        }
    }

    static async deleteProduct(id,userId,productPrice,onlyCart=false,redirect){
        /*getDataFromCartFile((cart) => {
            const existingProduct = cart.products.find(prod => prod.id === id);
            let updatedCartProducts = []
            if(existingProduct){
                if(onlyCart && existingProduct.qty > 1){
                    cart.totalPrice -= Number(productPrice);
                    existingProduct.qty -= 1;
                    updatedCartProducts = [...cart.products.map(x => {
                        if(x.id == existingProduct.id)
                            return existingProduct;
                        return x;
                    })]
                }else{
                 cart.totalPrice -= Number(existingProduct.qty) * Number(productPrice);
                 updatedCartProducts = cart.products.filter(prod => prod.id != id);
                }
                 cart.products = [...updatedCartProducts]
                 fs.writeFile(cartFile, JSON.stringify(cart), err => {
                    console.log(err);
                })      
            }
        })*/
        try{
            let cart = (await Cart.findOne({where:{UserId:userId}}));            
            cart.update({totalPrice:+cart.totalPrice - (+productPrice)});
            let productQuantity = (await ProductCart.findOne({
                where:{
                    productId:id,
                    cartId:cart.dataValues.id                        
                }
            })).dataValues.quantity;            
            if(onlyCart && +productQuantity > 1){
                await ProductCart.update({quantity: +productQuantity - 1},{
                    where:{
                            productId:id,
                            cartId:cart.dataValues.id
                        }
                });
            } else {
                await ProductCart.destroy({
                    where:{
                        productId:id,
                        cartId:cart.dataValues.id
                    }
                });
            }
            redirect();          
            
        }
        catch(ex){
            console.log(ex);
        }
    }

    static getCartData(res){
        //getDataFromCartFile(res);

      Cart.findOne({include:{model:product}})
      .then(data => {
          res(data);
      })
      .catch(err => {
          console.log(err);
      });
    }
}

//creating table definition using sequalizer in mysql database refer docfor more info
Cart.init({
    id : {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    totalPrice: {
        type:DataTypes.DOUBLE
    }  
},{
    sequelize,
    modelName: 'Cart',
    timestamps: false
});
//Sequalize many to one
Cart.belongsTo(user,{constraints:true, onDelete:"CASCADE"});
user.hasMany(Cart);
//Seqelizer code to crate a many-to-many relation
const ProductCart = sequelize.define('ProductCart',{quantity:{type:DataTypes.INTEGER}},{timestamps: false});
Cart.belongsToMany(product, { through: ProductCart});
product.belongsToMany(Cart, { through: ProductCart});

module.exports = Cart;
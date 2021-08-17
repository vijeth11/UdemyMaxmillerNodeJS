const fs = require('fs');
const path = require('path');

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
module.exports = class Cart {
    
    static addProduct(id, productPrice){
        getDataFromCartFile((cart) => {                      
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
        });
    }

    static deleteProduct(id,productPrice,onlyCart=false){
        getDataFromCartFile((cart) => {
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
        })
    }

    static getCartData(res){
        getDataFromCartFile(res);
    }
}
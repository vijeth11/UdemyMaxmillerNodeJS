const fs = require('fs');
const path = require('path');

const cartFile = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    
    static addProduct(id, productPrice){
        fs.readFile(cartFile, (err, fileContent) => {
            let cart = { products: [], totalPrice:0 };
            if(!err){
                cart = JSON.parse(fileContent);                
            }
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
}
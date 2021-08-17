const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const filePath = path.join(rootDir,'data','product.json');

getDataFromFile = res => {
    fs.readFile(filePath, (err, fileContent)=>{
        if(err){
            return res([]);
        }
        res(JSON.parse(fileContent));
    });
}
module.exports = class Product{
    
    constructor(title,imageUrl, price, description, id=null){
        this.id = id;
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        getDataFromFile((products) => {
            if(this.id){
                const productIndex = products.findIndex(x => x.id == this.id);
                products[productIndex] = {...this};
            }else{
                this.id = Math.random().toString();
                products.push(this);                
            }
            fs.writeFile(filePath, JSON.stringify(products),(err)=>{
                console.log(err);
            });
        })       
    }

    static fetchAll(res){
        getDataFromFile(res);
    }

    static findById(id,res){
        getDataFromFile((data) => {
            res(data.find( x => x.id == id));
        });
    }

    static delteProduct(id){
        getDataFromFile((products) => {            
            let updatedProductList = [...products.filter(x => x.id != id)];
            fs.writeFile(filePath, JSON.stringify(updatedProductList),(err)=>{
                console.log(err);
            });
        });
    }
}
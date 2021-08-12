const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const products = [];
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
    
    constructor(title,imageUrl, price, description){
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        this.id = Math.random().toString();        
        getDataFromFile((products) => {
            products.push(this);
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
}
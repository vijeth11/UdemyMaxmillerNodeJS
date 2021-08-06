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
    
    constructor(t){
        this.title=t;        
    }

    save(){        
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
}
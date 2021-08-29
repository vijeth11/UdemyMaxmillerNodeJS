const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const filePath = path.join(rootDir,'data','product.json');
const db = require('../utils/database').mysql;

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

    save(redirect){
        //code to save data to a json file instead DB
        /*getDataFromFile((products) => {
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
        }) */      

        db.execute('insert into products values(?,?,?,?)',[this.title,this.price,this.description,this.imageUrl])
        .then(res => redirect())
        .catch(err => console.log(err));
    }

    static fetchAll(res){
        //get data fron json file
        //getDataFromFile(res);

        db.execute('Select * from products')
        .then(([rows, fieldData]) =>  res(rows))
        .catch(err => console.log(err))
    }

    static findById(id,res){
        //get data from json file
        /*getDataFromFile((data) => {
            res(data.find( x => x.id == id));
        });*/
        db.execute('Select * from products where id = ?',[id])
        .then(([rows, fieldData]) =>  res(rows[0]))
        .catch(err => console.log(err))
    }

    static delteProduct(id){
        //delete from the json file
        /*getDataFromFile((products) => {            
            let updatedProductList = [...products.filter(x => x.id != id)];
            fs.writeFile(filePath, JSON.stringify(updatedProductList),(err)=>{
                console.log(err);
            });
        });*/

        db.execute('delete from products where id = ?',[id])
        .then(msg => console.log(msg))
        .catch(err => console.log(err))
    }
}
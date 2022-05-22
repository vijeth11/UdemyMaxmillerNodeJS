const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const filePath = path.join(rootDir,'data','product.json');
const db = require('../utils/database').mysql;
const sequelize = require('../utils/database').sequelize;
const DataTypes  = require('sequelize').DataTypes;
const user = require('./user');
getDataFromFile = res => {
    fs.readFile(filePath, (err, fileContent)=>{
        if(err){
            return res([]);
        }
        res(JSON.parse(fileContent));
    });
}
module.exports = class Product{
    
    constructor(title,imageUrl, price, description, userId,id=null){
        this.id = id;
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.userId = userId;
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
        if(this.id){
            db.execute('update products set title = ?, price = ?, description = ?, imageUrl =? where id = ?',[this.title,this.price,this.description,this.imageUrl, this.id])
            .then(res => redirect())
            .catch(err => console.log(err));
        }else{
            console.log(this.userId);
            db.execute('insert into products (title,price,description,imageUrl,userId) values(?,?,?,?,?)',[this.title,this.price,this.description,this.imageUrl,this.userId])
            .then(res => redirect())
            .catch(err => console.log(err));
        }
    }

    static fetchAll(start,end,res){
        //get data fron json file
        //getDataFromFile(res);

        db.execute('Select * from products Limit ? OFFSET ? ',[end, start])
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

const product = sequelize.define('Product',{
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type:DataTypes.STRING
    },
    imageUrl:{
        type: DataTypes.TEXT
    },
    description:{
        type: DataTypes.TEXT
    },
    price:{
        type: DataTypes.DOUBLE
    }
},{
    timestamps: false
});

//Sequelize one-To-Many 
product.belongsTo(user,{ constraints: true, onDelete: 'CASCADE' });
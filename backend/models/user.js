const sequelize = require('../utils/database').sequelize;
const { Sequelize, DataType, Model, DataTypes } = require('sequelize');

class User extends Model{    

   findById(id){
       return User.findOne({where:{id:id}})
       .then(user => {
           this.Name = user.name;
           this.Email = user.email;
           this.Id = user.id;
           console.log(this);
       })
       .catch(err => console.log(err));
   }
}

User.init({
    id : {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:DataTypes.STRING,        
    },
    email:{
        type: DataTypes.STRING
    }
},{
    sequelize,
    modelName: 'User',
    timestamps: false
});

module.exports = User
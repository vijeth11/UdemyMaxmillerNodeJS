const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userschema = new schema({
    _id: Number,
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    todoList:{
        items:[
            {
                itemId:{
                    type:schema.Types.ObjectID,
                    ref:'Todolist'
                }
            }
        ]
    }
})

userschema.methods.addTodo = function(todoId){  
    this.todoList.items.push({itemId:todoId});
    return this.save();
}

userschema.methods.removeTodo = function(todoId){
    this.todoList.items=this.todoList.items.filter(item => item.itemId.toString() != todoId.toString());
    console.log(this.todoList.items);
    return this.save();
} 

module.exports = mongoose.model('User',userschema);
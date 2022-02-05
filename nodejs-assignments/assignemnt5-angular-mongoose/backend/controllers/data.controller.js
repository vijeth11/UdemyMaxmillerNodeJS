const TodoList = require("../models/todoList");
const userModel = require("../models/user");

exports.getTitleName = (req,res,next)=>{
    res.json({'title':"Welcome To Angular"});
}

 exports.AddTodoList = (req,res,next)=>{
     const listItem = req.body.item;
     const userId = req.body.userId;
     const listId =  Math.floor(Math.random()*10000);
     let todoList = new TodoList({
         //schema keys: values
         userId:userId,
         listId:listId,
         listItem:listItem
    });

    todoList.save()
    .then(result => {
        req.user.addTodo(result._id);
        res.json({'result':'added'});
    })
    .catch(err => {
        console.log(err);
    });
 }

 exports.getTodoList = (req,res,next)=>{
     const userId = req.query.userId;
     //TodoList.findOne({userId:userId})
     //.select("userId listId listItem -_id")// retrieve only certain fields and add '-' before the key for excluding it from result 
     // .populate('userId','name') it returns the details of foreign key as well in this userId. after ',' we can pass which fields to be taken from relation table
     userModel.findOne({_id:userId})
     .populate('todoList.items.itemId',"userId listId listItem -_id")
     .select("-_id -name -email -password")
     .then(result => {
         res.json(result.todoList.items.map(x => x.itemId));
     })
     .catch(err => {
         console.log(err);
     })
 }

 exports.getAllTodoList = (req,res,next)=>{    
    TodoList.find()
    .select("userId listId listItem -_id")
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        console.log(err);
    })
}

exports.updateTodoList = (req,res,next)=>{
    const listId = req.body.listId;
    const listItem = req.body.listItem;
    // we can do using find and save methods of mongoose
    TodoList.updateOne({listId:listId},{listItem:listItem})
    .then(result => {
        res.json({"result":"updated success full"});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.deleteTodoList = (req,res,next)=>{
    TodoList.findOne({listId:req.body.listId})
    .then(result => {
        TodoList.deleteOne({listId:req.body.listId})
        .then(() => {
            req.user.removeTodo(result._id);
            res.json({"result":"successfully deleted the record"});
        })
    })    
    .catch(err => {
        console.log(err);
    })
}
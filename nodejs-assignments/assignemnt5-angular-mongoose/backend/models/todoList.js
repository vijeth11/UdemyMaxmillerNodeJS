const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const todoListSchema = new Schema({
    userId:{
        type:Schema.Types.Number,
        ref:'User',
        required:true
    },
    listId:Number,
    listItem:String,
});

module.exports = mongoose.model('Todolist',todoListSchema);

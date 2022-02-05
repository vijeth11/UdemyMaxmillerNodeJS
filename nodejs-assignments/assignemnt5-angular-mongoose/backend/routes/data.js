var express = require('express');
var router = express.Router();
var dataController = require('../controllers/data.controller');

router.get('/title',dataController.getTitleName);

router.post('/add', dataController.AddTodoList);

router.get('/todo', dataController.getTodoList);

router.get('/todos', dataController.getAllTodoList);

router.post('/update',dataController.updateTodoList);

router.delete('/delete', dataController.deleteTodoList);

module.exports = router;
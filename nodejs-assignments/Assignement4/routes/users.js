const express = require('express')
const routes = express.Router()
const userList = require('./main').data;


routes.get('/',(req,res,next) => {
    res.render('user',{names:userList});
})

module.exports = routes;
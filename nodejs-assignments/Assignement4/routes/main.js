const express = require('express')
const routes = express.Router()
const userData = require('./users').data;

routes.get('/',(req,res,next) => {
    console.log("User Data",userData);
    res.render('main')    
})

module.exports = routes;
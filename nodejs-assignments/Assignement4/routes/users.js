const express = require('express')
const routes = express.Router()
const userList = [];

routes.get('/',(req,res,next) => {
    res.render('user');
})

module.exports = {routes:routes,data:userList};
const express = require('express')
const routes = express.Router()
const userData = []

routes.get('/',(req,res,next) => {
    res.render('main')    
})

routes.post('/name',(req,res,next) => {
    userData.push(req.body.name);
    res.redirect('users');
})
module.exports = {routes:routes,data:userData};
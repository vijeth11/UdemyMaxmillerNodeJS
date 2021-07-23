const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const router = express.Router();
const products = [];

router.use('/add-product',(req,res,next)=>{
    //console.log("In the Middleware");   
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});

router.post('/product',(req,res,next)=>{
    console.log(req.body);
    products.push({title:req.body.title});
    res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;
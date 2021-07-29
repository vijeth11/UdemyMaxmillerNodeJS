const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const router = express.Router();
const products = [];

router.use('/add-product',(req,res,next)=>{
    //console.log("In the Middleware");   
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','add-product.html'));

    // if view engine is setup for the express like PUG in this example then use render
    res.render('pugs/add-product',{title:"Add-Product",path:"/admin/add-product"});

    // if view engine is setup for express as handlebars use render
    //res.render('handlebars/add-product',{title: "Add-Product", productCss:true,formCss: true, activeAddProduct:true});

    //if view engine is setup for the express like EJS in this example then use render
    //res.render('ejs/add-product',{title:"Add-Product", display: "AddProduct"});
});

router.post('/product',(req,res,next)=>{
    console.log(req.body);
    products.push({title:req.body.title});
    res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;
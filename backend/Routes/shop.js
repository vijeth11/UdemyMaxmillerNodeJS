const express = require('express');
const path = require('path')
const rootDir = require('../utils/path');
const adminData = require('./admin');
// router and express() constructor work in same way they use same REST method and 'use' method
const router = express.Router();

router.get('/',(req,res,next)=>{
    console.log("shop js", adminData.products);
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','shop.html'));

    // if view engine is setup for the express like PUG in this example then use render
    res.render('pugs/shop',{products: adminData.products, title:"shop", path:"/"});

    // if view engine is setup for the express like handlebars then use render
    //res.render('handlebars/shop',{products: adminData.products, title:"shop", hasProducts: adminData.products.length > 0, activeShop:true, productCss:true});

    //if view engine is setup for the express like EJS in this example then use render
    //res.render('ejs/shop',{products: adminData.products, title:"shop", display: "Shop"});
});

module.exports = router;
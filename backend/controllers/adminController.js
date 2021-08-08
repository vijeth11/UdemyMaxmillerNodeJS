
const Product = require('../models/product');

exports.getAddProductPage = (req,res,next)=>{
    //console.log("In the Middleware");   
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','add-product.html'));

    // if view engine is setup for the express like PUG in this example then use render
    res.render('pugs/admin/add-product',{ 
                    title:"Add-Product",
                    path:"/admin/add-product"
                    });

    // if view engine is setup for express as handlebars use render
    //res.render('handlebars/add-product',{title: "Add-Product", productCss:true,formCss: true, activeAddProduct:true});

    //if view engine is setup for the express like EJS in this example then use render
    //res.render('ejs/add-product',{title:"Add-Product", display: "AddProduct"});
}

exports.postAddProductPage = (req,res,next)=>{
    console.log(req.body);
    let product = new Product(
                              req.body.title, 
                              req.body.imageUrl, 
                              req.body.price, 
                              req.body.description
                            );
    product.save();
    res.redirect('/');
}

exports.getAdminProducts = (req,res,next) => {
    Product.fetchAll((data) => {
        res.render('pugs/admin/products.pug',{
            products:data, 
            title:"All Products", 
            path:"/admin/products"
        })
    });
}

exports.editAdminProducts = (req,res,next) => {
    res.render('pugs/admin/edit-product.pug');
}
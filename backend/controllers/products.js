const Product = require('../models/product');

exports.getAddProductPage = (req,res,next)=>{
    //console.log("In the Middleware");   
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','add-product.html'));

    // if view engine is setup for the express like PUG in this example then use render
    res.render('pugs/add-product',{ 
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
    let product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req,res,next)=>{
    
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','shop.html'));

    // if view engine is setup for the express like PUG in this example then use render
    Product.fetchAll((data) => {
        console.log("shop js",data);
        res.render('pugs/shop',{
        products:data, 
        title:"shop", 
        path:"/"
        })
    });

    // if view engine is setup for the express like handlebars then use render
    //res.render('handlebars/shop',{products: adminData.products, title:"shop", hasProducts: adminData.products.length > 0, activeShop:true, productCss:true});

    //if view engine is setup for the express like EJS in this example then use render
    //res.render('ejs/shop',{products: adminData.products, title:"shop", display: "Shop"});
}
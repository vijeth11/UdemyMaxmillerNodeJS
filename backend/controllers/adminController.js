
const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getAddProductPage = (req,res,next)=>{
    //console.log("In the Middleware");   
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    
    // if view engine is setup for the express like PUG in this example then use render
    res.render('pugs/admin/edit-product.pug',{ 
                    title:"Add-Product",
                    path:"/admin/add-product",
                    isAuthenticated:req.session.isLoggedIn
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
                              req.body.description,
                              req.session.user.Id
                            );
    product.save(() =>  res.redirect('/'));   
}

exports.getAdminProducts = (req,res,next) => {
    Product.fetchAll((data) => {
        res.render('pugs/admin/products.pug',{
            products:data, 
            title:"All Products", 
            path:"/admin/products",
            isAuthenticated:req.session.isLoggedIn
        })
    });
}

exports.editAdminProducts = (req,res,next) => {

    //Param object name should match variable name given in route (ex: id below)
    const productId = req.params.id;
    const editMode = Boolean(req.query.edit);
    
    if(!editMode){
        res.redirect('/');
    }else{
        Product.findById(productId, product => {
            if(!product){
                return res.redirect('/');
            }
            res.render('pugs/admin/edit-product.pug',{
                title:"Edit-Product",
                editing:editMode,
                product:product,
                isAuthenticated:req.session.isLoggedIn                
            });
        });
    }
}

exports.postEditProductPage = (req,res,next) => {
    console.log(req.body);    
    let product = new Product(
                              req.body.title, 
                              req.body.imageUrl, 
                              req.body.price, 
                              req.body.description,
                              req.session.user.Id,
                              req.body.id
                            );
    product.save(() => res.redirect('/admin/products'));
    
}

exports.deleteAdminProduct = (req,res,next) => {
    let productId = req.body.id;
    let productPrice = req.body.price;
    Product.delteProduct(productId);
    Cart.deleteProduct(productId,productPrice);
    res.redirect('/admin/products');
}

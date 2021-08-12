const Product = require('../models/product');

exports.getProducts = (req,res,next)=>{
    
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','shop.html'));

    // if view engine is setup for the express like PUG in this example then use render
    Product.fetchAll((data) => {
        console.log("shop js",data);
        res.render('pugs/shop/product-list',{
        products:data, 
        title:"All Products", 
        path:"/products"
        })
    });

    // if view engine is setup for the express like handlebars then use render
    //res.render('handlebars/shop',{products: adminData.products, title:"shop", hasProducts: adminData.products.length > 0, activeShop:true, productCss:true});

    //if view engine is setup for the express like EJS in this example then use render
    //res.render('ejs/shop',{products: adminData.products, title:"shop", display: "Shop"});
}

exports.getProductDetail = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId,(data) => {
        product = data;
        res.render('pugs/shop/product-detail.pug',{ 
            product: data,
            title:data.title, 
            path:"/products"
        });
    });    
}

exports.getCartDetails = (req,res,next) =>{
    res.render('pugs/shop/cart.pug',{
        path:"/cart",
        title:"Your Cart"
    });
} 

exports.getIndex = (req,res,next) => {
    Product.fetchAll((data) => {
        res.render('pugs/shop/index.pug',{
        products:data, 
        title:"shop", 
        path:"/"
        })
    });
}

exports.getCheckout = (req,res,next) => {
    res.render('pugs/shop/checkout.pug',{
        path:'/checkout',
        title:'Checkout Page'
    })
}

exports.getOrders = (req,res,next) =>{
    res.render('pugs/shop/orders.pug',{
        path:"/orders",
        title:"Your Orders"
    });
} 
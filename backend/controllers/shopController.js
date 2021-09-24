const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

console.log(typeof(new Cart()));
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
        res.render('pugs/shop/product-detail.pug',{ 
            product: data,
            title:data.title, 
            path:"/products"
        });
    });    
}

exports.getCartDetails = (req,res,next) =>{
    Cart.getCartData(cart => {
        /*Product.fetchAll(products => { 
            let filteredProducts = []
            for(let item of cart.products){ 
                filteredProducts.push({...products.find(x => x.id == item.id),qty:item.qty});
            }
            res.render('pugs/shop/cart.pug',{
                path:"/cart",
                title:"Your Cart",
                products:filteredProducts
            });
        });*/          
        res.render('pugs/shop/cart.pug',{
            path:"/cart",
            title:"Your Cart",
            products:cart.Products
        });
        
    });    
} 

exports.addProductToCard =async (req,res,next) => {
    const productId = req.body.productId;
    const productPrice = req.body.productPrice;
    const userId = req.user.Id;
    Cart.addProduct(productId,userId,productPrice,() => {
        res.redirect('/cart');
    });    
}

exports.deleteCartItem = (req,res,next) => {
    const productId = req.body.id;
    const productPrice = req.body.price;
    const userId = req.user.Id;
    Cart.deleteProduct(productId,userId,productPrice,true,() => {
        res.redirect('/cart');
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

exports.postOrder = (req,res,next) => {
    const userId = req.user.Id;
    let fetchCart = null;
    Cart.findOne({where:{UserId:userId}})
    .then(cart => {
       fetchCart = cart;
       return cart.getProducts();
    })
    .then(products => {
       Order.addProducts(products,userId,fetchCart,() => {
           res.redirect('/orders');
       });
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req,res,next) => {
    
    res.render('pugs/shop/checkout.pug',{
        path:'/checkout',
        title:'Checkout Page'
    })
}

exports.getOrders = (req,res,next) =>{
    const userId = req.user.Id
    Order.fetchAll(userId)
    .then(orders => {               
        res.render('pugs/shop/orders.pug',{
            path:"/orders",
            title:"Your Orders",
            orders:orders
        });
    })
    
} 


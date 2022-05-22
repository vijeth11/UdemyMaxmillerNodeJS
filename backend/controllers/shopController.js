const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

console.log(typeof(new Cart()));
const ITEMS_PER_PAGE = 2;
exports.getProducts = (req,res,next)=>{
    
    //if you are using html file then below code
    //res.sendFile(path.join(rootDir,'views','shop.html'));

    // if view engine is setup for the express like PUG in this example then use render
    Product.fetchAll((data) => {
        console.log("shop js",data);
        res.render('pugs/shop/product-list',{
        products:data, 
        title:"All Products", 
        path:"/products",
        isAuthenticated:req.session.isLoggedIn
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
            path:"/products",
            isAuthenticated:req.session.isLoggedIn
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
            products:cart.Products,
            isAuthenticated:req.session.isLoggedIn
        });
        
    });    
} 

exports.addProductToCard =async (req,res,next) => {
    const productId = req.body.productId;
    const productPrice = req.body.productPrice;
    const userId = req.session.user.Id;
    Cart.addProduct(productId,userId,productPrice,() => {
        res.redirect('/cart');
    });    
}

exports.deleteCartItem = (req,res,next) => {
    const productId = req.body.id;
    const productPrice = req.body.price;
    const userId = req.session.user.Id;
    Cart.deleteProduct(productId,userId,productPrice,true,() => {
        res.redirect('/cart');
    });    
}

exports.getIndex = (req,res,next) => {
    try{
        const page = req.query.page;
        Product.fetchAll((page-1)*ITEMS_PER_PAGE,ITEMS_PER_PAGE,(data) => {
            res.render('pugs/shop/index.pug',{
            products:data, 
            title:"shop", 
            path:"/"
            })
        });
    }catch(err){
        let error = new Error(err);
        return next(error);
    }
}

exports.postOrder = (req,res,next) => {
    const userId = req.session.user.Id;
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
    .catch(err => {
        let error = new Error(err);
        return next(error);
    });
}

exports.getCheckout = (req,res,next) => {
    
    res.render('pugs/shop/checkout.pug',{
        path:'/checkout',
        title:'Checkout Page',
        isAuthenticated:req.session.isLoggedIn
    })
}

exports.getOrders = (req,res,next) =>{
    const userId = req.session.user.Id
    Order.fetchAll(userId)
    .then(orders => {               
        res.render('pugs/shop/orders.pug',{
            path:"/orders",
            title:"Your Orders",
            orders:orders,
            isAuthenticated:req.session.isLoggedIn
        });
    }).catch(err => {
        let error = new Error(err);
        return next(error);
    })
    
} 

exports.getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    const invoiceName = "invoice-"+orderId+".pdf"
    const invoicePath = path.join('data', 'invoices',invoiceName);
    console.log(invoicePath);
    Order.findById(orderId)
    .then((order) => {
        if(!order){
            let err = new Error("Order not found");
            return next(err);
        }else{
            if(order.dataValues.UserId.toString() != req.session.user.Id)
            {
                return next(new Error("Unauthorized "));
            }
           /* return fs.readFile(invoicePath,(err, data) => {
                if(err){
                    next(err);
                }else{
                    res.setHeader('Content-Type','application/pdf');
                    res.setHeader('Content-Disposition','attachment; filename="'+invoiceName+'"');
                    return res.send(data);
                }
            });*/
            // this is good streaming the data and server donot need to pre-load the data before sending the file
            // createReadStream method returns file readStream object which can be piped with res which is writer
            // thus the file be sent to browser as an when it reads the chunk hence no need to store the complete file in server
            const pdfDoc = new pdfkit();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));            
            //const file = fs.createReadStream(invoicePath);
            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition','attachment; filename="'+invoiceName+'"');
            //return file.pipe(res);
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text("Invoice",{
                underline:true
            });
            pdfDoc.text("----------------------------");
            let total = 0
            order.Products.forEach(product => {
                pdfDoc.fontSize(14).text(product.title + ' - ' + product.orderItem.quantity +' x '+'$'+product.price);
                total += +product.orderItem.quantity * +product.price;
            });
            pdfDoc.text("-----");
            pdfDoc.fontSize(20).text('Total Price: $'+total);
            pdfDoc.end();
        }
    })
    .catch(err => next(err));
    
}


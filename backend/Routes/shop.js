const express = require('express');
const shopController = require('../controllers/shopController');
// router and express() constructor work in same way they use same REST method and 'use' method
const router = express.Router();

// / => GET
router.get('/',shopController.getIndex);

// /products => GET
router.get('/products',shopController.getProducts);

// /cart => GET
router.get('/cart',shopController.getCartDetails);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

// /orders => GET
router.get('/orders', shopController.getOrders);

// /product-detail/1 => GET
router.get('/product-detail/:productId',shopController.getProductDetail); // always put routes with dynamic params in last because it will consider anything passed after first route part as dynamic
module.exports = router;
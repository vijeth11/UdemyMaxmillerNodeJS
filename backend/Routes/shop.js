const express = require('express');
const shopController = require('../controllers/shopController');
// router and express() constructor work in same way they use same REST method and 'use' method
const router = express.Router();
// look at the middleware and amin routes for more details regarding this middleware
const isAuth = require('../middleware/is-auth');

// / => GET
router.get('/',shopController.getIndex);

// /products => GET
router.get('/products',shopController.getProducts);

// /cart => GET
router.get('/cart',isAuth,shopController.getCartDetails);

// /cart => POST
router.post('/cart',isAuth,shopController.addProductToCard);

// /cart-delete-item => POST
router.post('/cart-delete-item', isAuth,shopController.deleteCartItem);

// /checkout => GET
router.get('/checkout', isAuth,shopController.getCheckout);

// /orders => GET
router.get('/orders', isAuth,shopController.getOrders);

// /create-order => POST
router.post('/create-order', isAuth,shopController.postOrder);

// /product-detail/1 => GET
router.get('/product-detail/:productId',shopController.getProductDetail); // always put routes with dynamic params in last because it will consider anything passed after first route part as dynamic

// /orders/:orderId => GET
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
module.exports = router;
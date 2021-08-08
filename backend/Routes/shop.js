const express = require('express');
const shopController = require('../controllers/shopController');
// router and express() constructor work in same way they use same REST method and 'use' method
const router = express.Router();

router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/product-detail',shopController.getProductDetail);

router.get('/cart',shopController.getCartDetails);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const router = express.Router();
const productController = require('../controllers/products')

router.use('/add-product',productController.getAddProductPage);

router.post('/product',productController.postAddProductPage);

module.exports = router;
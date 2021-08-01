const express = require('express');
const path = require('path')
const rootDir = require('../utils/path');
const productController = require('../controllers/products');
// router and express() constructor work in same way they use same REST method and 'use' method
const router = express.Router();

router.get('/',productController.getProducts);

module.exports = router;
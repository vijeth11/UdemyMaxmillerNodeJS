const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')

// /admin/add-product => GET
router.use('/add-product',adminController.getAddProductPage);

// /admin/product => POST
router.post('/product',adminController.postAddProductPage);

// /admin/products => GET
router.get('/products',adminController.getAdminProducts);

// /admin/edit-product => GET
router.get('/edit-product',adminController.editAdminProducts);

module.exports = router;
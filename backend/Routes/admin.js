const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')

// /admin/add-product => GET
router.use('/add-product',adminController.getAddProductPage);

// /admin/product => POST
router.post('/product',adminController.postAddProductPage);

// /admin/products => GET
router.get('/products',adminController.getAdminProducts);

// /admin/product => POST
router.post('/edit-product',adminController.postEditProductPage);

// /admin/delete-product/:id => POST
router.post('/delete-product/', adminController.deleteAdminProduct);

// /admin/edit-product/:id => GET
router.get('/edit-product/:id',adminController.editAdminProducts);

module.exports = router;
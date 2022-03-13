const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const isAuth = require('../middleware/is-auth');

// the router.use can have multiple request handlers "coma" seperated 
// these handlers execute from left to right meaning in below example isAuth will run then based on its result
// which if next() called then request is passed to getAddProductPage else if previous handler calls res() then the 
// request will not go to forward handler

// /admin/add-product => GET
router.use('/add-product',isAuth,adminController.getAddProductPage);

// /admin/product => POST
router.post('/product',isAuth,adminController.postAddProductPage);

// /admin/products => GET
router.get('/products',isAuth,adminController.getAdminProducts);

// /admin/product => POST
router.post('/edit-product',isAuth,adminController.postEditProductPage);

// /admin/delete-product/:id => POST
router.post('/delete-product/', isAuth,adminController.deleteAdminProduct);

// /admin/edit-product/:id?edit=true => GET
router.get('/edit-product/:id',isAuth,adminController.editAdminProducts);

module.exports = router;
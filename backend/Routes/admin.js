const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const isAuth = require('../middleware/is-auth');
const { check } = require('express-validator/check');

// the router.use can have multiple request handlers "coma" seperated 
// these handlers execute from left to right meaning in below example isAuth will run then based on its result
// which if next() called then request is passed to getAddProductPage else if previous handler calls res() then the 
// request will not go to forward handler

// /admin/add-product => GET
router.use('/add-product',isAuth,adminController.getAddProductPage);

// for more information on validation using check look at auth router
// /admin/product => POST
router.post('/product',isAuth,[
    check('title')
    .isString()
    .isLength({min: 3})
    .trim(),
    check('file')
    .custom((value, {req}) => {
        if(req.file){
            return true;
        }else{
            throw new Error("Attached File is not an image");
        }
    }),
    check('price')
    .isFloat(),
    check('description')
    .isLength({min: 5, max: 500})
    .trim()    
],adminController.postAddProductPage);

// /admin/products => GET
router.get('/products',isAuth,adminController.getAdminProducts);

// /admin/product => POST
router.post('/edit-product',isAuth,[
    check('title')
    .isString()
    .isLength({min: 3})
    .trim(),
    check('price')
    .isFloat(),
    check('description')
    .isLength({min: 5, max: 500})
    .trim()    
],adminController.postEditProductPage);

// /admin/delete-product/:id => POST
router.post('/delete-product/', isAuth,adminController.deleteAdminProduct);

// /admin/edit-product/:id?edit=true => GET
router.get('/edit-product/:id',isAuth,adminController.editAdminProducts);

module.exports = router;
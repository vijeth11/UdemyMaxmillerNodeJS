const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// /login => GET
router.get('/login',authController.getLogin);

// /signup => GET
router.get('/signup', authController.getSignup);

// /login => POST
router.post('/login', authController.postLogin);

// /signup => POST
router.post('/signup', authController.postSignup);

// /logout => POST
router.post('/logout', authController.postLogout);

// /reset => GET
router.get('/reset', authController.getReset);

// /reset => POST
router.post('/reset', authController.postReset);

// /reset/:token => Get
router.get('/reset/:token', authController.getNewPassword);

// /new-password => POST
router.post('/new-password',authController.postNewPassword);
module.exports = router;

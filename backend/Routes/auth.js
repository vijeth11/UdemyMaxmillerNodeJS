const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/authController');

// /login => GET
router.get('/login',authController.getLogin);

// /signup => GET
router.get('/signup', authController.getSignup);

// /login => POST
router.post('/login', authController.postLogin);

// This router takes a middleware for implementing serverside validation of the form sent in the post request
// it is achieved by using express-validator library which provides a function called check which takes a single
// or an array of keys used as name in the form in the view (ex: auth/signup.pug) and the check method provides a
// list of validation methods which can be used to validate the form data in this ex: we are using isEmail() which
// after validating the form adds the error if any to the req and the forwards the request to the controller or 
// next middleware where it can be consumed by using validationResult method provided by express-validator.
// see postSignup method for usage of it.

// /signup => POST
router.post('/signup',
            [
                check('email')
                    .isEmail()
                    .withMessage("Please enter a valid email")
                    .custom((value, {req}) => {
                        if(value == "test@test.com"){
                            throw new Error("This email address is forbidden");
                        }
                        return true;
                    }),
                // second argument is default error message which needs to be shown if any of the validation fail
                check('password','Please enter a password with only numbers and text at least 5 characters.')
                    .isLength({min:5})
                    .isAlphanumeric(),
                check('confirmPassword','Please enter a password with only numbers and text at least 5 characters.')
                    .isLength({min:5})
                    .isAlphanumeric()
                    .custom((value,{req}) => {
                        if(value != req.body.password){
                            throw new Error('Passwords have to match!')
                        }
                        return true;
                    })
                    
            ],
            authController.postSignup);

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

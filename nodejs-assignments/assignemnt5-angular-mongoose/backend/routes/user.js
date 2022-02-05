var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');

router.post('',userController.createUser);

module.exports = router;
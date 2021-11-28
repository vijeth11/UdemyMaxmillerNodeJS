const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// /login => GET
router.get('/login',authController.getLogin);

module.exports = router;

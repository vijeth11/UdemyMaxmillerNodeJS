const express = require('express')
const router = express.Router();
const errorPageController = require('../controllers/errorController');

// /500 => GET
router.get('/500',errorPageController.get500);

router.use(errorPageController.errorPage);

module.exports = router;
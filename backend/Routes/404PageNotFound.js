const express = require('express')
const router = express.Router();
const errorPageController = require('../controllers/errorController');

router.use(errorPageController.errorPage);

module.exports = router;
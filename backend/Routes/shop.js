const express = require('express');
const path = require('path')
const rootDir = require('../utils/path');
const router = express.Router();

router.get('/',(req,res,next)=>{
    //console.log("Last Middleware");
    res.sendFile(path.join(rootDir,'views','shop.html'));
});

module.exports = router;
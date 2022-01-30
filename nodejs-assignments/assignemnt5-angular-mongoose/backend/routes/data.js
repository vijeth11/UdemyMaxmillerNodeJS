var express = require('express');
var router = express.Router();


router.get('/title',(req,res,next)=>{
    res.json({'title':"Welcome To Angular"});
})

module.exports = router;
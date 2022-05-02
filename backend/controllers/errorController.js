const path = require('path')
const rootDir = require('../utils/path');
exports.errorPage = (req,res,next)=>{
    res.status(404).sendFile(path.join(rootDir,'views','page-not-found.html'));
}

exports.get500 = (req,res,next) => {
    res.status(500).render("pugs/error/500.pug",{
        title: "Error!",
        path:"/500",
        isAuthenticated:req.session.isLoggedIn,
    });
}
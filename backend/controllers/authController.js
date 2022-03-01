const User = require('../models/user');
const utils = require('../utils/common');
exports.getLogin = (req, res, next) => {   
    res.render('pugs/auth/login.pug',{
        path:'/login',
        pageTitle: 'Login',
        isAuthenticated:utils.getDataFromCookie(req,'loggedIn') == 'true'
    });
}

exports.postLogin = (req,res,next) => {
    req.session.isLoggedIn = true;
    let user = new User();
    user.findById(1).then(() => {
        console.log("post login",user);
        req.session.user = {Id:user.Id,Name:user.Name,Email:user.Email};
        res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');
        req.session.save(err => {
            console.log(err)
            res.redirect('/');
        });
        //res.redirect('/');        
    });      
}

exports.postLogout = (req,res,next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}
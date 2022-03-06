const User = require('../models/user');
const utils = require('../utils/common');
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {   
    res.render('pugs/auth/login.pug',{
        path:'/login',
        pageTitle: 'Login',
        isAuthenticated:utils.getDataFromCookie(req,'loggedIn') == 'true'
    });
}

exports.getSignup = (req,res,next) => {
    res.render('pugs/auth/signup.pug',{
        path:'/signup',
        pageTitle: 'SignUp',
        isAuthenticated:utils.getDataFromCookie(req,'loggedIn') == 'true'
    })
}

exports.postLogin = async (req,res,next) => {
    req.session.isLoggedIn = true;
    const email = req.body.email;
    const password = req.body.password;       
    let user = await User.findOne({where:{email:email}});
    if(user){
        return bcrypt.compare(password,user.password).then((result) => {
            if(result){
                console.log("post login",user);
                req.session.user = {Id:user.Id,Name:user.Name,Email:user.Email};
                res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');
                return req.session.save(err => {
                    console.log(err)
                    return res.redirect('/');
                });
            }
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
        //res.redirect('/');        
    }else{
        return res.redirect('/signup');
    }         
}

exports.postSignup = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confpassword = req.body.confirmPassword;
    const user = await User.findOne({where :{ email: email}});
    if(!user){        
        if(password == confpassword){
            bcrypt.hash(password, 12).then((hashedPassword) => {
                user = User.create({
                    name:email.split("@")[0], 
                    email:email,
                    password:hashedPassword
                }).then(result => {
                    res.redirect('/login');
                });
            })
            return;
        }
    }else{
        return res.redirect("/signup");
    }
}

exports.postLogout = (req,res,next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}
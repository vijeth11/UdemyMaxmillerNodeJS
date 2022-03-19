const User = require('../models/user');
const utils = require('../utils/common');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6667426c98b5a9",
      pass: "17cbf1876d152f"
    }
  });

exports.getLogin = (req, res, next) => {  
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else{
        message = null;
    }
    res.render('pugs/auth/login.pug',{
        path:'/login',
        pageTitle: 'Login',
        errorMessage: message        
    });
}

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else{
        message = null;
    }
    res.render('pugs/auth/signup.pug',{
        path:'/signup',
        pageTitle: 'SignUp',
        errorMessage: message        
    })
}

exports.postLogin = async (req,res,next) => {    
    const email = req.body.email;
    const password = req.body.password;       
    let user = await User.findOne({where:{email:email}});
    if(user){
        return bcrypt.compare(password,user.password).then((result) => {
            if(result){
                console.log("post login",user);
                req.session.user = {Id:user.id,Name:user.name,Email:user.email};
                req.session.isLoggedIn = true;
                res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');
                return req.session.save(err => {
                    console.log(err)
                    return res.redirect('/');
                });
            }
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
        //res.redirect('/');        
    }else{
        req.flash('error', 'Email is not regirstered');
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
                    transport.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject:'Signup Succeeded!',
                        html: '<h1> You successfully signed up! </h1>'
                    },(err,info) => {
                        if(err) console.log(err);
                        else console.log(info);
                    });                  
                })
                .catch(err => {
                    console.log(err);
                })
            })
            return;
        }
    }else{
        req.flash('error', 'Email exists already, please pick a new one');
        return res.redirect("/signup");
    }
}

exports.postLogout = (req,res,next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}
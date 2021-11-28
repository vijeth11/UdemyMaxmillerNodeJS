exports.getLogin = (req, res, next) => {
    res.render('pugs/auth/login.pug',{
        path:'/login',
        pageTitle: 'Login'
    });
}
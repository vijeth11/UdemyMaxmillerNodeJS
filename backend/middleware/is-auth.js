// this is a middleware used to block the unauthorized request. if user is loggedin then only
//correct response for the request will be sent or else user will be redirected to the login page
// this middleware is used in admin, shop routes
module.exports = (req,res,next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}
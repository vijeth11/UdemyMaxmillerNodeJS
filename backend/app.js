//const http = require('http');
const uuid = require('uuid');
const express = require('express');
const path = require('path');
// for password encryption
const bcrypt = require("bcryptjs");
//const routes = require('./routes') //Vanila NodeJs
//const server = http.createServer(routes); //Vanila NodeJs
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const authRouter = require('./Routes/auth');
const shopRouter = require('./Routes/shop');
const adminRouter = require('./Routes/admin');
const errorRouter = require('./Routes/404PageNotFound');
const sequelize = require('./utils/database').sequelize;
const app = express();
const expressHbs = require('express-handlebars');
const User = require('./models/user');
const SessionKey = uuid.v1();
const csrfProtection = csrf();

// Dynamic Templates setup
/*PUG*/
app.set('view engine','pug');
app.set('views', 'views'); // this tells template engine to consider views folder in this directory as views for template engine
//so when it tries to render we just need to write path to the pug file no need to add parent folder(ex: 'views/pugs/shop' can be written '/pug/shop') 

/*Handlers*/
//The name of the engine will be extention of the view files (ex: shop.hbs)
//app.engine('hbs',expressHbs({layoutsDir: 'views/handlebars/layouts/', defaultLayout: 'main-layout',extname:'hbs'}));
//app.set('view engine', 'hbs') //engine name should be equal to name give for engine in above statement
//app.set('views','views')

/*EJS*/
//app.set('view engine', 'ejs')
//app.set('views','views')// this tells template engine to consider views folder in this directory as views for template engine
//so when it tries to render we just need to write path to the pug file no need to add parent folder(ex: 'views/ejs/shop' can be written '/ejs/shop') 

app.use(bodyParser.urlencoded({extended:false}));
// this middleware is used to parse files in the form with encoding type multipart in it. we need to pass the attribute name in which file will be stored
// multer takes an object with a property called dest ex: multer({dest:"images"}), the value passed to it will create a folder in working directory with that name and save the files sent in the form in it
// with random name (this can be changed). Otherwise we will get strem data in req.body.file which we need to convert to file using file.js.
// Other way is to create a storage object using multer.diskStorage function which takes an object with attributes destination and filename, both of them are functions.
// the first one destination gets three args request , file object and call back function. We need to call callBack function with first arg as null which indicates no error and second with the folder name
// where it needs to store the files from form. The next attribute is fileName which is also a function with three args request , file object and call back function. We need to call callBack function
// with first arg as null which indicates no error and second with the name of the file in which file needs to be saved in destination folder. Then we need to set the storage attribute of middleware multer 
// constructor obj argument with the storage object created in this ex: fileStorage.
const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'images');
    },
    filename:(req, file, cb)=>{
        // filename is the random name given by multer and originalname is the name of the file uploaded via form.
        cb(null, file.originalname);
    }
});
// multer also provides us with ability to filter the files which needs to be stored. It is done by setting fileFilter attribute of multer obj argument. this attribute takes a function with three args request, file 
// of type file object and a call back function. we need to call callBack function with first argument as null which indicates no error and second argument a boolean value true or false.
// When sent true it will save the file else it will reject in below ex we are trying to save only png,jpgmjpeg files and discarding rest.
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    cb(null, true);
    else
    cb(null,false);
}
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public')));
// Sessions can be stored in a database like mongodb to do that checkout express-session docs
// When some data is added to empty session it creates a session Id and stores it in the cookies in browser
// So when we use req.session it uses the sessionid from request cookie and gets the session data from the storage in server
// thus maintaining user specific data
// In this project session is used in AuthController
app.use(session({secret:SessionKey, resave:false, saveUninitialized:false}));
// This a cross-site request forgery protection middleware it creates a token and adds it to request which needs to be used
// By the view and send it along with post request from the view.
// To send from the view the post request form should have Input tag which is hidden and name attribute saying "_csrf"(depends on the library)
// and value attribute with the csrf token passed to the view from view engine render method
app.use(csrfProtection);

//This is a library used to display some flash message after user has performed any action
// so that the user is aware what is happening ex: when user tries logging in but he has not registered yet
app.use(flash());
/*app.use((req,res,next)=>{
    let user = new User();
    user.findById(1).then(() => {
        req.user = user;
        next();
    });    
});*/

// this middleware will pass the csrf token and isAuthenticated to all the views rendered
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session ? req.session.isLoggedIn : false;
    res.locals.csrftoken= req.csrfToken();
    next();
})
app.use(shopRouter);
app.use(authRouter);
app.use('/admin',adminRouter); // /admin part is ommited from url path when sent to router in admin
// app.use((req,res,next)=>{ //use method does no make exact path match due to which order matters while REST methods does exact match of pattern
//     //console.log("next middleware");
//     next();// Allows the request to continue to the next middleware, and if not added request is also not completed 
//     // browser will be spinning until unless you use res.send()
// });
app.use(errorRouter);

// Error handling middleware called whenver Error object is passed as argument to next() like next(new Error("test"))
// this bypasses all the other above middlewares whenever next with error object is called
// if multiple error middleware are written then it follows same middleware pattern of express framework
app.use((error, req, res, next)=>{
    console.log(error);
    res.redirect('/500');
});

// creates the table of models related to this project if does not exist in database already sync({ force: true}) to drop all tables and recreate
sequelize
//.sync({force:true})
.sync()
.then(result => {
    console.log(result);
    return User.findOne({where:{id:1}});
})
.then(user => {
    if(!user){
        return bcrypt.hash("1234567", 12)
        .then((hashedPassword) => {
            User.create({
                name:"Main", 
                email:"test@test1.com",
                password:hashedPassword});
        });
    }
    return user;
})
.catch(err => {
    console.log(err);
})

//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000);
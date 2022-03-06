//const http = require('http');
const uuid = require('uuid');
const express = require('express');
const path = require('path');
// for password encryption
const bcrypt = require("bcryptjs");
//const routes = require('./routes') //Vanila NodeJs
//const server = http.createServer(routes); //Vanila NodeJs
const bodyParser = require('body-parser');
const session = require('express-session');
const authRouter = require('./Routes/auth');
const shopRouter = require('./Routes/shop');
const adminRouter = require('./Routes/admin');
const errorRouter = require('./Routes/404PageNotFound');
const sequelize = require('./utils/database').sequelize;
const app = express();
const expressHbs = require('express-handlebars');
const User = require('./models/user');
const SessionKey = uuid.v1();
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
app.use(express.static(path.join(__dirname,'public')));
// Sessions can be stored in a database like mongodb to do that checkout express-session docs
// When some data is added to empty session it creates a session Id and stores t in the cookies in browser
// So when we use req.session it uses the sessionid from request cookie and gets the session data from the storage in server
// thus maintaining user specific data
// In this project session is used in AuthController
app.use(session({secret:SessionKey, resave:false, saveUninitialized:false}));
/*app.use((req,res,next)=>{
    let user = new User();
    user.findById(1).then(() => {
        req.user = user;
        next();
    });    
});*/

app.use(shopRouter);
app.use(authRouter);
app.use('/admin',adminRouter); // /admin part is ommited from url path when sent to router in admin
// app.use((req,res,next)=>{ //use method does no make exact path match due to which order matters while REST methods does exact match of pattern
//     //console.log("next middleware");
//     next();// Allows the request to continue to the next middleware, and if not added request is also not completed 
//     // browser will be spinning until unless you use res.send()
// });
app.use(errorRouter);

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
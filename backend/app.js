//const http = require('http');
const express = require('express');
const path = require('path');
//const routes = require('./routes') //Vanila NodeJs
//const server = http.createServer(routes); //Vanila NodeJs
const bodyParser = require('body-parser');
const adminRouter = require('./Routes/admin');
const shopRouter = require('./Routes/shop');
const errorRouter = require('./Routes/404PageNotFound');
const app = express();
const expressHbs = require('express-handlebars');

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


app.use(shopRouter);
app.use('/admin',adminRouter); // /admin part is ommited from url path when sent to router in admin
// app.use((req,res,next)=>{ //use method does no make exact path match due to which order matters while REST methods does exact match of pattern
//     //console.log("next middleware");
//     next();// Allows the request to continue to the next middleware, and if not added request is also not completed 
//     // browser will be spinning until unless you use res.send()
// });
app.use(errorRouter);

//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000);
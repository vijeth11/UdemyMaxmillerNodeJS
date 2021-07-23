//const http = require('http');
const express = require('express');
const path = require('path');
//const routes = require('./routes') //Vanila NodeJs
//const server = http.createServer(routes); //Vanila NodeJs
const bodyParser = require('body-parser');
const adminRouter = require('./Routes/admin');
const shopRouter = require('./Routes/shop');
const app = express();

app.set();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(shopRouter);
app.use('/admin',adminRouter.routes); // /admin part is ommited from url path when sent to router in admin
// app.use((req,res,next)=>{ //use method does no make exact path match due to which order matters while REST methods does exact match of pattern
//     //console.log("next middleware");
//     next();// Allows the request to continue to the next middleware, and if not added request is also not completed 
//     // browser will be spinning until unless you use res.send()
// });
app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','page-not-found.html'));
});

//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000);
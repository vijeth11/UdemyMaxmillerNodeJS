//const http = require('http');
const express = require('express');
//const routes = require('./routes') //Vanila NodeJs
//const server = http.createServer(routes); //Vanila NodeJs
const app = express();
app.use('/add-product',(req,res,next)=>{
    console.log("In the Middleware");   
    res.send("<h1> Add Product from Express</h1>");
});

app.use((req,res,next)=>{
    console.log("next middleware");
    next();// Allows the request to continue to the next middleware, and if not added request is also not completed 
    // browser will be spinning until unless you use res.send()
});

app.use('/',(req,res,next)=>{
    console.log("Last Middleware");
    res.send("<h1>Hello from the ExpressJs</h1>");
});
//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000);
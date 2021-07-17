const express = require('express');
const app = express();
app.use('/users',(req,res,next)=>{
    res.send(
        [{
            name:"user1",
            age:20
        },{
            name:"user2",
            age:19
        }]
    );
});
/*app.use((req,res,next) => {
    console.log("middleware one");
    next();
});
app.use((req,res,next)=>{
    console.log("middleware two");
    next();
});*/
app.use('/',(req,res,next)=>{
    res.send("<h1>Welcome to Assignement2</h1>");
});

app.listen(3000);

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
app.use('/api/:status',(req,res,next)=> {
    let status = req.params.status || 400;
    console.log("Error Message API sample for status "+ status + " time "+ new Date());
    if(+status >= 200 && +status <= 210){
        res.status(200).send({issueCount:2});
    }else{
    res.status(+status).send({errorMessage:"Something broken",devMessage:"dev for testing purpose this error ",issueCount:0});
    }
});

app.use('/',(req,res,next)=>{
    res.send("<h1>Welcome to Assignement2</h1>");
});

app.listen(3000);

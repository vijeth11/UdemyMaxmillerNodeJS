const user = require('../models/user');

exports.createUser= (req,res,next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const id = Math.floor(Math.random()*100);

    const newUser = new user({
        name:username,
        email:email,
        password:password,
        _id:id,
        todoList:{
            items:[]
        }
    });
    newUser.save();
    console.log("create user called");
    res.json({"result":"user added success"});
}
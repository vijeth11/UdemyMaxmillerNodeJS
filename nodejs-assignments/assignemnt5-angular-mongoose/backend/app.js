var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var userRouter = require('./routes/user');

var userModel = require('./models/user');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use((req,res,next)=>{
  const userName = req.body.username;
  if(req.path.indexOf('user') > -1 || req.method == "GET"){
    next();
    return;
  }
  userModel.findOne({name:userName})
  .then(result => {
    if(!result) {
      res.json({"error":"create a user"}).status(500);
    }else{
      req.body.userId = result._id;
      req.user = result;
      next();
    }
  })
  .catch(error => {
    console.log(error);
  })  
});

app.use('/api/user',userRouter);

app.use('/api', dataRouter);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

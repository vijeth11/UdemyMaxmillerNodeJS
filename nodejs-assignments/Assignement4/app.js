const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);
const user = require('./routes/users');
const main = require('./routes/main');

app.set('view engine','pug');
app.set('views', 'templates');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/users',user);
app.use('/',main.routes);

server.listen(3000,function(){
    console.log('Listening on port ' + 3000);
});
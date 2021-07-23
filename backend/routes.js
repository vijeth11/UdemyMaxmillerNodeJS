
const fs = require('fs');

const routeHandler = (req,res) => {
    if(req.url == "/"){
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head><title>Enter Mesage</title></head>");
        res.write("<body><form action='/message' method='POST'>");
        res.write("<input type='text' name='message'/><br>");
        res.write("<button type='submit'>Submit</button>");
        res.write("</form></body>");
        res.write("</html>");
        return res.end(); // once res.end() called we cannot call res.write() function should return
    }
    if(req.method=='POST' && req.url=='/message'){
        // in nodeJs request body comes in the form of chunks of data in the form of bytes which needs to be captured in byte array (ex: body variable) and then combined
        // we do not get data in req.body like in expressJs so we need to follow below approach
        // expressJs handles this below task and provide us the data in req.body
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', ()=> {
            const parseBody = Buffer.concat(body).toString();
            fs.open('message.txt','w+',(error,filed) => {
                fs.write(filed,parseBody.split("=")[1],(err,bytes )=> {
                    if(err){
                        console.log(err);
                    }                
                });
                fs.close(filed ,() => {
                    res.statusCode = 302;
                    res.setHeader('Location','/')
                    return res.end();
                });
            });                   
        });               
    }
    res.write('<html>');
    res.write("<head><title>Mesage</title></head>");
    res.write("<body><h1>Hello from Node.js Server</h1></body>");
    res.write("</html>");
    res.end();
}

module.exports = routeHandler;